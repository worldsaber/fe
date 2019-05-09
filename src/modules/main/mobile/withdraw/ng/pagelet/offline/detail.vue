<template>
  <div class="withdraw-detail-container">
	  <navbar></navbar>
	  <div class="details">
		  <div class="detail-wrapper">
			  <ul class="detail">
				<li>
					<span>Withdrawal Amount ({{currency}})</span>
					<span>{{detail.initAmount}}</span>
				</li>
				<li>
					<span>Commission to Partner</span>
					<span>{{fee}}</span>
				</li>
				<li v-if="detail.cancelFee>0">
					<span>Cancellation Fee</span>
					<span>{{detail.cancelFee}}</span>
				</li>
				<li>
					<span>Partner Code</span>
					<span>{{detail.ptnCode}}</span>
				</li>
				<li v-if="detail.ptnInfo">
					<span>Info:</span>
					<span>{{detail.ptnInfo}}</span>
				</li>
				<li>
					<span>Trade No.</span>
					<span>{{detail.tradeId}}</span>
				</li>
			</ul>
		  </div>		
		<div class="process">
			<p class="finished">Request Submitted</p>
			<p class="time">{{detail.requestTime}}</p>
			<section v-if="finishAt2" class="finish-at-2">
				<div class="upper">
					<p class="finished">{{finishAt2Text}}</p>
					<p class="tips" v-if="finishAt2Tips">{{finishAt2Tips}}</p>									
					<p class="time-without-line">{{detail.finishTime}}</p>
				</div>
			</section>
			<section v-if="finishAt3" class="finish-at-3">
				<div class="upper">
					<p class="finished">Approved</p>
					<p class="time">{{detail.approveTime}}</p>
				</div>
				<div class="upper">
					<p class="finished">{{finishAt3Text}}</p>
					<p class="tips" v-if="finishAt3Tips">{{finishAt3Tips}}</p>				
					<p class="time-without-line">{{detail.finishTime}}</p>
				</div>
			</section>
			<section v-if="waitFor2" class="wait-for-2">
				<div class="upper">
					<p class="wait">Waiting for partner's approval</p>
					<p class="tips">If the partner did not approve your request within 30 minutes, a full refund will be returned to your balance.</p>				
				</div>
			</section>
			<section v-if="waitFor3" class="wait-for-3">
				<div class="upper">
					<p class="finished">Approved, PIN code: {{detail.pin}} (valid for 12 hours)</p>
					<p class="tips">Take the PIN code to the partner, then expect a SMS code from the partner.</p>
					<p class="time">{{detail.approveTime}}</p>
				</div>
				<div class="upper">
					<p class="wait">Withdraw Succeeded</p>
				</div>
			</section>
			<div class="btn" v-if="detail.status===10||detail.status===12" @click.stop="cancelWithdraw(detail.tradeId, detail.status)">Cancel Withdrawal</div>
		</div>
	  </div>
  </div>
</template>

<script>
import navbar from 'components/navbar';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';

export default {
	components: {
		navbar
	},
	data () {
		return {
			currency: window.currency || 'NGN',
			fee: 0,
			cancelFee: formatNumber(withdrawCfg.withdrawCancelFee, 2), // eslint-disable-line
			detail: {},
			finishAt2Text: '',
			finishAt3Text: '',
			finishAt2Tips: '',
			finishAt3Tips: ''
		};
	},
	computed: {
		finishAt2 () {
			return [35, 37, 90].includes(this.detail.status);
		},
		finishAt3 () {
			return [20, 30, 36, 91].includes(this.detail.status);
		},
		waitFor2 () {
			return this.detail.status === 10;
		},
		waitFor3 () {
			return this.detail.status === 12;
		}
	},
	created () {
		fetch(`pocket/v1/flows/${URL.getPara('tradeId')}`, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(ret => {
				if (ret.bizCode === 10000) {
					this.formateData(ret.data);
					switch (ret.data.status) {
					case 37:
						this.finishAt2Text = 'Request rejected by partner';
						this.finishAt2Tips = 'A full refund has been returned to your balance. Please try to apply request to other partners.';
						break;
					case 35:
						this.finishAt2Text = 'Cancelled';
						this.finishAt2Tips = 'A full refund has been returned to your balance.';
						break;
					case 90:
						this.finishAt2Text = 'Request expired';
						this.finishAt2Tips = 'A full refund has been returned to your balance.';
						break;
					case 20:
						this.finishAt3Text = 'Withdrawal Succeeded';
						break;
					case 30:
						this.finishAt3Text = 'Withdrawal Failed';
						this.finishAt3Tips = 'A full refund has been returned to your balance.';
						break;
					case 36:
						this.finishAt3Text = `Cancelled (Cancellation fee: ${ret.data.cancelFee})`;
						this.finishAt3Tips = 'Your withdrawal amount and commision to partner have been returned to your balance.';
						break;
					case 91:
						this.finishAt3Text = 'PIN code expired';
						this.finishAt3Tips = 'A full refund has been returned to your balance.';
						break;
					default:
						break;
					}
				} else {
					this.$dialog.alert('Sorry，something went wrong. Please try again later.');
				}
			})
			.catch(e => {
				this.$toast('Sorry，something went wrong. Please try again later.');
				console.log(e); // eslint-disable-line
			});
	},
	mounted () {
		document.querySelector('body').style.background = '#f2f3f5';
	},
	destroyed () {
		document.querySelector('body').style.background = '';
	},
	methods: {
		formateData (data) {
			this.fee = formatNumber(Math.min((data.initAmount / 10000) * JSON.parse(withdrawCfg.partnerWithdrawFee).rate, +JSON.parse(withdrawCfg.partnerWithdrawFee).maxAmount), 2); // eslint-disable-line
			data.requestTime = dateFormat.format(data.requestTime, 'DD/MM/YYYY HH:mm:ss');
			if (data.approveTime) {
				data.approveTime = dateFormat.format(data.approveTime, 'DD/MM/YYYY HH:mm:ss');
			}
			if (data.finishTime) {
				data.finishTime = dateFormat.format(data.finishTime, 'DD/MM/YYYY HH:mm:ss');
			}
			data.initAmount = formatNumber(data.initAmount / 10000, 2);
			data.cancelFee = formatNumber(data.cancelFee / 10000, 2);
			this.detail = data;
		},
		cancelWithdraw (tradeId, status) {
			if (status === 10) {
				this.beforeCancel = 'Are you sure you want to cancel the request? Please ensure that Partner has not approved your request or you will be charged a cancellation fee.';
				this.afterCancel = 'Your withdrawal request has been cancelled. A refund has been returned to your balance.';
			} else if (status === 12) {
				this.beforeCancel = `Since partner has accepted your request, you need to pay cancellation fee ${window.showCurrency} ${this.cancelFee} to the partner for cancelling the request. Are you sure you still want to cancel the request?`; // eslint-disable-line
				this.afterCancel = `Your withdrawal request has been cancelled. Cancellation fee: ${window.showCurrency} ${this.cancelFee} Your withdrawal amount and commision to partner have been returned to your balance.`; // eslint-disable-line
			}
			this.$dialog({
				title: null,
				content: this.beforeCancel,
				button: ['No', 'Yes']
			}).onBtnClick(btnType => {
				if (btnType === 1) {
					fetch(`pocket/v1/bankTrades/bankTrade/${tradeId}/cancel`, {
						method: 'POST'
					})
						.then(res => res.json())
						.then(ret => {
							if (ret.bizCode === 10000) {
								this.$dialog({
									title: null,
									content: this.afterCancel,
									button: ['OK']
								}).onBtnClick(() => {
									location.reload();
								});
							} else if (ret.bizCode === 11000) {
								this.$dialog({
									title: null,
									content: 'Cancellation failed. Your request status is changed. Please refresh the page to check the latest status.',
									button: ['OK']
								}).onBtnClick(() => {
									location.reload();
								});
							} else {
								this.$dialog({
									title: null,
									content: ret.message,
									button: ['OK']
								}).onBtnClick(() => {
									location.reload();
								});
							}
						})
						.catch(e => {
							this.$toast('Sorry，something went wrong. Please try again later.');
						});
				}
			});
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";

.detail-wrapper {
  background: #fff;
}

.withdraw-detail-container {
  .details {
    .detail {
      padding: 0 16 / @rem 10 / @rem;
      width: 100%;
      box-sizing: border-box;
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6 / @rem;
        span:first-child {
          color: #9ca0ab;
        }
        span:last-child {
          font-size: 14 / @rem;
        }
      }
      li:first-child {
        padding-top: 19 / @rem;
        margin-bottom: 10 / @rem;
        span:first-child {
          font-size: 14 / @rem;
          color: #353a45;
        }
        span:last-child {
          font-size: 18 / @rem;
          font-weight: bold;
        }
      }
    }
    .process {
      padding: 36 / @rem 16 / @rem 10 / @rem;
      width: 100%;
      box-sizing: border-box;
      .finished {
        font-size: 14 / @rem;
        font-weight: 500;
        &:before {
          display: inline-block;
          vertical-align: middle;
          font-size: 24 / @rem !important;
          color: @green;
          margin-right: 8 / @rem;
        }
        .m-icon-success-bg();
      }
      .wait {
        font-size: 14 / @rem;
        font-weight: 500;
        color: #9ca0ab;
        &:before {
          content: " ";
          display: inline-block;
          width: 24 / @rem;
          height: 24 / @rem;
          border-radius: 12 / @rem;
          background: #dcdee5;
          vertical-align: middle;
          margin-right: 8 / @rem;
        }
      }
      .time {
        color: #9ca0ab;
        display: inline-block;
        position: relative;
        top: -8 / @rem;
        left: 11 / @rem;
      }
      .time-without-line {
        color: #9ca0ab;
        position: relative;
        left: 33 / @rem;
        top: 8 / @rem;
      }
      .tips {
        color: #9ca0ab;
        display: inline-block;
        position: relative;
        left: 33 / @rem;
      }
      .tips:before {
        content: "i";
        display: inline-block;
        width: 12 / @rem;
        height: 12 / @rem;
        line-height: 12 / @rem;
        border-radius: 6 / @rem;
        background: #9ca0ab;
        color: #f2f3f5;
        text-align: center;
        margin-right: 6 / @rem;
      }
      .time:before {
        content: " ";
        display: inline-block;
        width: 2 / @rem;
        height: 70 / @rem;
        background-image: linear-gradient(to bottom, #0d9737, #dcdee5);
        vertical-align: top;
        margin-right: 19 / @rem;
      }
      .upper {
        margin-top: -32 / @rem;
        position: relative;
      }
      .wait-for-3 {
		  .wait {
			  position: relative;
			  top: -40/@rem;
		  }
        .time {
          top: 0 / @rem;
          &:before {
            position: relative;
			top: -64/@rem;
			height: 110/@rem;
          }
        }
        .tips {
          width: 260 / @rem;
        }
      }
      .btn {
        border-radius: 2/@rem;
        height: 36 / @rem;
        line-height: 36 / @rem;
        border: solid 1/@rem #0d9737;
        font-size: 14/@rem;
        font-weight: 500;
        text-align: center;
        color: #0d9737;
        margin-top: 44 / @rem;
      }
    }
  }
}
</style>
