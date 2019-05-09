<template>
	<div class="offline-withdraw-container">
		<form>
			<div class="withdraw-bank">
				<span class="label">Partner Code</span>
				<AfInput class="withdraw-bank-number" v-model="partnerCode" :maxlength="10" placeholder="e.g. PRXXXX" icon="delete" :iconClick="clearPartnerCode" :error="!!codeErr">
				</AfInput>
				<div class="error-msg">{{codeErr}}</div>
			</div>
			<div class="withdraw-footer">
				<span class="label">Amount ({{currency}})</span>
				<AfInput class="withdraw-bank-number" v-model="withdrawAmount" :maxlength="18" placeholder="min. 50" icon="delete" :iconClick="clearWithdrawAmount" :error="!!amountErr">
				</AfInput>
				<div class="error-msg">{{amountErr}}</div>
				<AfButton class="withdraw-submit" :autofocus="false" @click.prevent="confirm" :disabled="withdrawDisabled" :loading="withdrawLoading">
					<span>{{withdrawLoading ? 'Loading' : 'Withdraw'}}</span>
				</AfButton>
				<p class="to-list"><span @click="gotoList">My Request List (Check PIN Code) ></span></p>
				<div class="withdraw-rule">
				<p>Note</p>
				<div><span>1. </span><div>PIN Code will be available only in next 12 hours after the  partner approved your request.</div></div>
				<div><span>2. </span><div>Please do not share your PIN Code to anyone else except for the partner.</div></div>
				<div><span>3. </span><div>1% fee (up to {{currency}} 50) per withdrawal to partner.</div></div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import AfButton from 'packages/button';
import { AfInput } from 'packages/input';
import { userCenterConfig } from 'config/order/userCenterConfig.js';
import { mapState, mapGetters } from 'vuex';
import { formatNumber } from 'utils';
import CommonPop from 'components/popDialog/commonPop';
import cookie from 'packages/lib/utils/cookie';
import { checkWithdrawBlock } from 'components/withdrawBlockTip/withdrawDialog.js';
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
		...mapState('userCenter', ['balance', 'auditStatus']),
		...mapGetters('userCenter', ['fomatBalance']),
	},
	methods: {
		clearPartnerCode () {
			this.partnerCode = '';
		},
		clearWithdrawAmount () {
			this.withdrawAmount = '';
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
				location.href = `${userCenterConfig.Withdraw}?is_offline=1`;
			});
		},
		async confirm () {
			if (!checkWithdrawBlock(this.auditStatus)) {
				return;
			}
			if (this.partnerCode === '') {
				this.codeErr = 'Please enter a partner code.';
			}
			this.amountErr = validateAmount(this.withdrawAmount, 'withdraw', true, true, this.balance) || '';
			if (!this.amountErr && !this.codeErr) {
				this.withdrawLoading = true;
				try {
					const res = await fetch('partner/account/id/byCode', {
						method: 'GET',
						body: {
							code: this.partnerCode
						}
					});
					const ret = await res.json();
					if (ret.bizCode === 10000) {
						this.info = ret.data.info;
					}
				} catch (e) {
					console.log(e); // eslint-disable-line
				}
				this.$dialog({
					title: null,
					'class': 'withdraw-info',
					contentData: {
						partnerCode: this.partnerCode,
						withdrawAmount: formatNumber(this.withdrawAmount, 2),
						remainingAmount: formatNumber(+this.balance - (+this.withdrawAmount) - this.fee, 2),
						fee: formatNumber(this.fee, 2),
						info: this.info
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
								if (cookie.get('partnerCode') !== this.partnerCode) cookie.set('partnerCode', this.partnerCode);
								this.$dialog({
									title: null,
									contentData: {
										msg: 'Request Submitted. Please check request list for further progress.',
									},
									content: CommonPop,
								}).onBtnClick(btnType => {
									this.$router.push({
										name: 'list'
									});
								});
							} else if (ret.bizCode === 61100) {
								this.showDialog(ret.message);
							} else {
								this.showDialog(ret.message);
							}
						} catch (e) {
							this.withdrawLoading = false;
							this.$dialog({
								title: null,
								contentData: {
									msg: 'Sorry，something went wrong. Please try again later.',
								},
								content: CommonPop,
							});
							console.log(e); // eslint-disable-line
						}
					} else {
						this.withdrawLoading = false;
					}
				});
			}
		}
	},
	watch: {
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
		},
		partnerCode () {
			this.codeErr = '';
		}
	}
};
</script>

<style lang="less">
@import "base/style/icon.less";
@import "base/style/variable.less";
.offline-withdraw-container {
  form {
    border-top: 1px solid #eaecef;
    .label {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.38;
      margin-right: 17px;
    }
    .error-msg {
      min-height: 12px;
      line-height: 12px;
      font-size: 10px;
      text-align: left;
      color: @red;
      margin-top: 2px;
      margin-left: 130px;
    }
    .withdraw-bank {
      margin-top: 22px;
      margin-bottom: 10px;
      padding: 0 16px;
      .withdraw-bank-number {
        margin-left: 13px;
        border: 1px solid @darkGray;
        border-radius: 2px;
        width: 170px;
        height: 40px;
      }
    }
    .m-input-icon:hover,
    .m-input-icon:active,
    .m-input-icon:visited {
      color: @darkGray !important;
    }
    .m-input-wrapper.m-input-wrapper--error .m-input {
      border: none !important;
    }
    .m-input-wrapper.m-input-wrapper--error {
      border: @red 1px solid !important;
      border-radius: 2px;
    }
    .m-input-wrapper--active {
      border: 1px @green solid !important;
      border-radius: 2px;
      .m-input {
        border: none;
      }
    }
    .m-input-wrapper {
      width: 170px;
      height: 40px;
      border: 1px solid @darkGray;
      border-radius: 2px;
    }
    .withdraw-footer {
      padding: 0 16px;
      .to-list {
        margin-top: -22px;
        padding-left: 126px;
		padding-bottom: 66px;
        font-size: 14px;
        color: @green;
		border-bottom: 1px solid #eaecef;
		span:hover {
			cursor: pointer;
		}
      }
      .withdraw-submit {
        width: 176px;
        margin-left: 128px;
        background-color: @green;
        border: none;
        height: 48px;
        margin-top: 18px;
        margin-bottom: 60px;
      }
      .withdraw-rule {
        color: @darkGray;
        text-align: left;
        font-size: 14px;
        line-height: 1.33;
        padding-top: 23px;
        p {
          margin-bottom: 11px;
          .m-icon-light2();
          &::before {
            font-size: 20px;
            color: @green;
            margin-right: 6px;
          }
        }
        div {
          display: flex;
          flex-direction: row;
          margin-bottom: 3px;
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
}
</style>
