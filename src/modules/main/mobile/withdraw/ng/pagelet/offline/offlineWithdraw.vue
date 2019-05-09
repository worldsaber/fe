<template>
	<div class="offline-withdraw-container">
		<form>
			<div class="withdraw-bank">
				<af-input type="tel" class="withdraw-bank-number" v-model="partnerCode" :maxlength="10" placeholder="e.g. PRXXXX" transformText="Partner Code" icon="delete" :iconClick="clearPartnerCode" :error="!!codeErr">
					<img slot="prepend" src="../../img/card.svg">
				</af-input>
				<div class="error-msg">{{codeErr}}</div>
			</div>
			<div class="withdraw-footer">
				<div class="balance-container">
					<img src="../../img/light-green.svg"><span class="balance-text">Balance ({{currency}}) {{fomatBalance}}</span>
				</div>
				<AfInput type="tel" class="withdraw-bank-number" v-model="withdrawAmount" :maxlength="18" placeholder="min. 50" :transformText="`Amount (${currency})`" icon="delete" :iconClick="clearWithdrawAmount" :error="!!amountErr" @focus="showMin=false" @blur="withdrawAmount?showMin=false:showMin=true">
					<span :class="[showMin?'amount-prepend':'min']" slot="prepend">min. 50</span>
				</AfInput>
				<div class="error-msg">{{amountErr}}</div>
				<AfButton class="withdraw-submit" :autofocus="false" @click.prevent="confirm" :disabled="withdrawDisabled" :loading="withdrawLoading">
					<span>{{withdrawLoading ? 'Loading' : 'Withdraw'}}</span>
				</AfButton>

				<p class="to-list" @click="gotoList">My Request List (Check PIN Code) ></p>
				<!-- <div class="withdraw-rule">
				<div><span>1. </span><div>PIN Code will be available only in next 12 hours after the  partner approved your request.</div></div>
				<div><span>2. </span><div>Please do not share your PIN Code to anyone else except for the partner.</div></div>
				<div><span>3. </span><div>1% fee (up to {{currency}} 50) per withdrawal to partner.</div></div>
				</div> -->
			</div>
		</form>
	</div>
</template>

<script>
import AfButton from 'packages/button';
import { AfInput } from 'components/input';
import { pagePath } from 'config/pageConfig.js';
import { mapState, mapGetters } from 'vuex';
import cookie from 'packages/lib/utils/cookie.js';
import { formatNumber } from 'utils';
import { validateAmount } from '../../js/comFunc';
import withdrawInfo from './withdrawInfo';

export default {
	components: {
		AfButton,
		AfInput,
		withdrawInfo
	},
	data () {
		return {
			partnerCode: cookie.get('partnerCode') || '',
			withdrawAmount: '',
			withdrawLoading: false,
			showMin: true,
			currency: window.currency,
			codeErr: '',
			amountErr: '',
			info: '',
		};
	},
	computed: {
		withdrawDisabled () {
			if ((this.partnerCode !== '' || this.withdrawAmount !== '') && (this.codeErr === '' && this.amountErr === '')) return false;
			return true;
		},
		fee() {
			return Math.min(this.withdrawAmount * JSON.parse(withdrawCfg.partnerWithdrawFee).rate, +JSON.parse(withdrawCfg.partnerWithdrawFee).maxAmount) || 0; // eslint-disable-line
		},
		...mapState('assetsInfo', ['isLogin', 'giftNum', 'balance']),
		...mapGetters('assetsInfo', ['fomatBalance']),
	},
	methods: {
		clearPartnerCode () {
			this.partnerCode = '';
		},
		clearWithdrawAmount () {
			this.withdrawAmount = '';
			this.showMin = true;
		},
		gotoList () {
			this.$router.push({
				name: 'list'
			});
		},
		showDialog(msg) {
			this.$dialog({
				title: null,
				content: msg,
				button: ['OK']
			})
			.onBtnClick(() => {
				location.href = `${pagePath.myCenter}/withdraw/?is_offline=1`;
			});
		},
		async getInfo() {
			try {
				const res = await fetch('partner/account/id/byCode', {
					method: 'GET',
					body: {
						code: this.partnerCode
					}
				});
				const ret = await res.json();
				if (ret.bizCode === 10000) {
					this.showPop(ret.data.info);
				} else {
					this.showPop();
				}
			} catch (e) {
				this.$toast('Sorry，something went wrong. Please try again later.');
				console.log(e); // eslint-disable-line
			}
		},
		showPop(info) {
			this.$dialog({
				title: null,
				'class': 'withdraw-info',
				contentData: {
					partnerCode: this.partnerCode,
					withdrawAmount: formatNumber(this.withdrawAmount, 2),
					remainingAmount: formatNumber(+this.balance - (+this.withdrawAmount) - this.fee, 2),
					fee: formatNumber(this.fee, 2),
					info: info || ''
				},
				content: withdrawInfo,
				button: ['Cancel', 'Confirm']
			}).onBtnClick(async btnType => {
				if (btnType === 1) {
					try {
						const res = await fetch('/pocket/v1/bankTrades/bankTrade/withdrawFP', {
							method: 'POST',
							headers: new Headers({
								'Content-Type': 'application/json'
							}),
							body: JSON.stringify({
								payAmount: this.withdrawAmount * 10000,
								ptnCode: this.partnerCode
							})
						});
						const ret = await res.json();
						this.withdrawLoading = false;
						if (ret.bizCode === 10000) {
							if (cookie.get('partnerCode') !== this.partnerCode) {
								cookie.set('partnerCode', this.partnerCode);
							}
							this.$toast('Request submitted. Please check request list for further progress.');
							this.$router.push({
								path: '/request_list/details',
								query: {
									tradeId: ret.data.tradeId
								}
							});
						} else if (ret.bizCode === 61100) {
							this.showDialog(ret.message);
						} else {
							this.showDialog(ret.message);
						}
					} catch (e) {
						this.withdrawLoading = false;
						this.$toast('Sorry，something went wrong. Please try again later.');
						console.log(e); // eslint-disable-line
					}
				} else {
					this.withdrawLoading = false;
				}
			});
		},
		confirm () {
			if (this.partnerCode === '') {
				this.codeErr = 'Please enter a partner code.';
			}
			this.amountErr = validateAmount(this.withdrawAmount, 'withdraw', true, true, this.balance) || '';
			if (!this.amountErr && !this.codeErr) {
				this.withdrawLoading = true;
				this.getInfo();
			}
		}
	},
	watch: {
		partnerCode () {
			this.codeErr = '';
		},
		withdrawAmount(val) {
			this.withdrawAmount = ('' + val).replace(/[^0-9.]/g, '');
			if (val !== '') {
				if (+val + this.fee - this.balance > 0) {
					this.amountErr = `NGN ${formatNumber(this.fee, 2)} will be charged on your withdrawal. Your current available balance is ${this.balance}`; // eslint-disable-line
				} else {
					this.amountErr = validateAmount(this.withdrawAmount, 'withdraw', true, false, this.balance) || '';
				}
			} else {
				this.amountErr = '';
			}
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
.show-close {
  .es-dialog-close {
    display: inline-block;
  }
}
.es-dialog.m-dialog.withdraw-confirm {
  width: 90% !important;
  .es-dialog-close {
    display: inline-block;
  }
}
.offline-withdraw-container {
  .to-list {
    margin-top: -30 / @rem;
    margin-bottom: 56 / @rem;
    font-size: 14px;
    text-align: center;
	color: #0d9737;
	&:hover {
		cursor: pointer;
	}
  }
  .amount-prepend {
	color: #bbb;
	position: relative;
    left: 235/@rem;
}
.min {
	visibility: hidden;
}
  .error-msg {
    min-height: 12px;
    line-height: 12px;
    font-size: 10px;
    text-align: left;
    color: @red;
    margin-top: 2px;
  }
  .m-input-wap-wrapper--active {
    border: 1px #0d9737 solid;
  }
  .withdraw-bank {
    margin-top: 22 / @rem;
    margin-bottom: 10 / @rem;
    padding: 0 16 / @rem;
    .withdraw-bank-number {
	  margin-top: 5 / @rem;
    }
  }

  .withdraw-footer {
	padding: 0 16 / @rem;
	  .m-input-wap,
	  .m-input-transform-text {
		  transform: translateX(-58/@rem);

	  }
	  .m-input-wap {
		width: auto !important
	  }
    .m-input-wap-wrapper {
      width: 100%;
    }
    .m-input-transform {
	  padding-left: 10 / @rem;
	  height: 32/@rem;
    }
    .balance-container {
      line-height: 19px;
      text-align: right;
      margin-bottom: 5 / @rem;
      .balance-text {
        vertical-align: middle;
        margin-left: 8 / @rem;
        font-size: 12px;
        color: #000;
      }
    }
    .withdraw-submit {
      width: 100%;
      background-color: @green;
      border: none;
      height: 48 / @rem;
      margin-top: 18 / @rem;
      margin-bottom: 60 / @rem;
    }
    .withdraw-rule {
      color: @darkGray;
      text-align: left;
      font-size: 12px;
      line-height: 1.33;
      div {
        display: flex;
        flex-direction: row;
        margin-bottom: 3 / @rem;
      }
      span {
        width: 16px;
        flex: 0 0 auto;
      }
      p {
        flex: 1 1 auto;
      }
    }
  }
}

</style>
