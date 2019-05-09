<template>
  <div class="withdraw-detail-container">
	  <div class="icon-wrapper">
		  <span>Request Details</span>
		<i class="m-icon-close" data-action="close" data-ret="close"></i>
	</div>
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
					<span>Info</span>
					<span>{{detail.ptnInfo}}</span>
				</li>
				<li>
					<span>Trade No.</span>
					<span>{{detail.tradeId}}</span>
				</li>
			</ul>
		  </div>
		
		<div class="process">
			<!-- 第一个状态 -->
			<p class="finished">Request Submitted</p>
			<p class="time first">{{detail.requestTime}}</p>
			<!-- 非等待审核的第二状态：（拒绝、取消、请求超时）、（成功、失败、同意后取消、PIN码失效） -->
			<div :class="[detail.status===12?'waiting':'finishing']" v-if="detail.status!==10">
				<p class="finished">{{secondStatus}}</p>
				<p :class="['tips',secondTips?'ico':'']">{{secondTips}}</p>				
				<p :class="[detail.finishAtStep3||detail.wait4Face2Face?'time':'time-without-line']">{{detail.approveTime||detail.finishTime}}</p>
			</div>
			<!-- 成功、失败、同意后取消、PIN码失效后的第三状态 -->
			<div class="processing" v-if="detail.finishAtStep3">
				<p class="finished">{{thirdStatus}}</p>
				<p :class="['tips',thirdTips?'ico':'']">{{thirdTips}}</p>				
				<p :class="[thirdTips?'time-with-tips':'time-without-line']">{{detail.finishTime}}</p>
			</div>
			<!-- 等待审核，等待进一步审核的置灰状态 -->
			<div class="upper" v-if="detail.wait4Approve||detail.wait4Face2Face">
				<p class="wait">{{fourthStatus}}</p>
				<p :class="['tips',fourthTips?'ico':'']">{{fourthTips}}</p>				
			</div>
			<div class="btn" v-if="detail.status===10||detail.status===12" @click.stop="cancelWithdraw(detail.tradeId,detail.status)">Cancel Withdrawal</div>
		</div>
	  </div>
  </div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import CommonPop from 'components/popDialog/commonPop';

export default {
	data () {
		return {
			currency: window.currency || 'NGN',
			detail: {},
			secondStatus: '',
			secondTips: '',
			thirdStatus: '',
			thirdTips: '',
			fourthStatus: '',
			fourthTips: '',
			fee: 0
		};
	},
	components: {
		CommonPop
	},
	created () {
		fetch(`pocket/v1/flows/${this.contentData.tradeId}`, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(ret => {
				if (ret.bizCode === 10000) {
					this.formateData(ret.data);
					switch (ret.data.status) {
					case 37:
						this.secondStatus = 'Request rejected by partner';
						this.secondTips = 'A full refund has been returned to your balance. Please try to apply request to other partners.';
						break;
					case 35:
						this.secondStatus = 'Cancelled';
						this.secondTips = 'A full refund has been returned to your balance.';
						break;
					case 90:
						this.secondStatus = 'Request expired';
						this.secondTips = 'A full refund has been returned to your balance.';
						break;
					case 12:
						this.secondStatus = `Approved, PIN code: ${ret.data.pin} (valid for 12 hours)`;
						this.secondTips = 'Take the PIN code to the partner, then expect a SMS code from the partner.';
						this.fourthStatus = 'Withdrawal Succeeded';
						this.fourthTips = '';
						break;
					case 10:
						this.fourthStatus = 'Waiting for partner\'s approval';
						this.fourthTips = 'If the partner did not approve your request within 30 minutes, a full refund will be returned to your balance.';
						break;
					case 20:
						this.secondStatus = 'Approved';
						this.secondTips = '';
						this.thirdStatus = 'Withdrawal Succeeded';
						this.thirdTips = '';
						break;
					case 30:
						this.secondStatus = 'Approved';
						this.secondTips = '';
						this.thirdStatus = 'Withdrawal Failed';
						this.thirdTips = 'A full refund has been returned to your balance.';
						break;
					case 36:
						this.secondStatus = 'Approved';
						this.secondTips = '';
						this.thirdStatus = `Cancelled (Cancellation fee: ${ret.data.cancelFee})`;
						this.thirdTips = 'Your withdrawal amount and commision to partner have been returned to your balance.';
						break;
					case 91:
						this.secondStatus = 'Approved';
						this.secondTips = '';
						this.thirdStatus = 'PIN code expired';
						this.thirdTips = 'A full refund has been returned to your balance.';
						break;
					default:
						this.secondStatus = '';
						break;
					}
				} else {
					this.$dialog.alert('Sorry，something went wrong. Please try again later.');
				}
			})
			.catch(e => {
				this.$dialog({
					title: null,
					content: 'Sorry，something went wrong. Please try again later.',
					button: ['OK']
				});
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
			if (data.status === 10) {
				data.wait4Approve = true;
			}
			if (data.status === 12) {
				data.wait4Face2Face = true;
			}
			if ([35, 37, 90].includes(data.status)) {
				data.finishAtStep2 = true;
			}
			if ([20, 30, 36, 91].includes(data.status)) {
				data.finishAtStep3 = true;
			}
			this.detail = data;
		},
		showDialog (msg) {
			this.$dialog({
				title: null,
				content: msg,
				button: ['OK']
			});
		},
		cancelWithdraw (tradeId, status) {
			document.querySelector('.withdraw-detail-pop').style.display = 'none';
			if (status === 10) {
				this.beforeCancel = 'Are you sure you want to cancel the request? Please ensure that Partner has not approved your request or you will be charged a cancellation fee.';
				this.afterCancel = 'Your withdrawal request has been cancelled. A refund has been returned to your balance.';
			} else if (status === 12) {
				this.beforeCancel = `Since partner has accepted your request, you need to pay cancellation fee ${window.showCurrency} ${formatNumber(+withdrawCfg.withdrawCancelFee, 2)} to the partner for cancelling the request. Are you sure you still want to cancel the request?`; // eslint-disable-line
				this.afterCancel = `Your withdrawal request has been cancelled. Cancellation fee: ${window.showCurrency} ${formatNumber(+withdrawCfg.withdrawCancelFee, 2)} Your withdrawal amount and commision to partner have been returned to your balance.`; // eslint-disable-line
			}
			this.$dialog({
				title: null,
				contentData: {
					msg: this.beforeCancel,
					okBtn: 'No',
					cancelBtn: 'Yes',
				},
				content: CommonPop,
			}).onBtnClick(btnType => {
				if (btnType === 'cancel') {
					fetch(`pocket/v1/bankTrades/bankTrade/${tradeId}/cancel`, {
						method: 'POST'
					})
					.then(res => res.json())
					.then(ret => {
						if (ret.bizCode === 10000) {
							this.$dialog({
								title: null,
								contentData: {
									msg: this.afterCancel,
								},
								content: CommonPop,
							}).onBtnClick(() => {
								location.reload();
							});
						} else if (ret.bizCode === 11000) {
							this.$dialog({
								title: null,
								contentData: {
									msg: 'Cancellation failed. Your request status is changed. Please refresh the page to check the latest status.',
								},
								content: CommonPop,
							}).onBtnClick(() => {
								location.reload();
							});
						} else {
							this.$dialog({
								title: null,
								contentData: {
									msg: ret.message,
								},
								content: CommonPop,
							}).onBtnClick(() => {
								location.reload();
							});
						}
					})
					.catch(e => {
						this.$dialog({
							title: null,
							contentData: {
								msg: 'Sorry，something went wrong. Please try again later.',
							},
							content: CommonPop,
						});
					});
				}
				location.reload();
			});
		}
	}
};
</script>

<style lang="less">
@import "base/style/variable.less";
@import "base/style/icon.less";
.es-dialog.withdraw-detail-pop {
  width: 520px !important;
  height: 503px !important;
  border-radius: 2px;
  overflow-y: scroll;
  .es-dialog-main {
    overflow: hidden;
  }
}
.detail-wrapper {
  background: #fff;
  padding: 0 10px;
}
.icon-wrapper {
  position: relative;
  top: -15px;
  left: -15px;
  line-height: 58px;
  height: 58px;
  width: 107%;
  background: #f2f3f5;
  span {
    position: relative;
    left: 200px;
    font-size: 20px;
    font-weight: 500;
  }
}
.m-icon-close {
  cursor: pointer;
  position: relative;
  left: 320px;
  margin-bottom: 21px;
  color: #5f5f5f;
  font-size: 16px;
  .m-icon-close();
}
.withdraw-detail-container {
  .details {
    .detail {
      padding: 0 16px 10px;
      width: 100%;
      box-sizing: border-box;
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        span:first-child {
          color: #9ca0ab;
        }
        span:last-child {
          font-size: 14px;
        }
      }
      li:first-child {
        padding-top: 19px;
        margin-bottom: 10px;
        span:first-child {
          font-size: 14px;
          color: #353a45;
        }
        span:last-child {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
    .process {
      padding: 36px 40px 10px;
	  width: 107%;
	  height: 300px;
      box-sizing: border-box;
      background: #f8f8f8;
      position: relative;
      left: -15px;
      bottom: -15px;
      .finished {
        font-size: 14px;
        font-weight: 500;
        &:before {
          display: inline-block;
          vertical-align: middle;
          font-size: 24px !important;
          color: @green;
          margin-right: 8px;
        }
        .m-icon-success-bg();
      }
      .wait {
        font-size: 14px;
        font-weight: 500;
        color: #9ca0ab;
        &:before {
          content: " ";
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: #dcdee5;
          vertical-align: middle;
          margin-right: 8px;
        }
      }
      .time {
        color: #9ca0ab;
        display: inline-block;
        position: relative;
        top: -26px;
        left: 11px;
      }
      .first {
        top: -8px;
      }
      .time-without-line {
        color: #9ca0ab;
        position: relative;
        left: 33px;
        top: 8px;
      }
      .tips {
        color: #9ca0ab;
        display: inline-block;
        position: relative;
        left: 33px;
        width: 380px;
      }
      .ico:before {
        content: "i";
        display: inline-block;
        width: 12px;
        height: 12px;
        line-height: 12px;
        border-radius: 6px;
        background: #9ca0ab;
        color: #f2f3f5;
        text-align: center;
        margin-right: 6px;
      }
      .time:before {
        content: " ";
        display: inline-block;
        width: 2px;
        height: 70px;
        background-image: linear-gradient(to bottom, #0d9737, #dcdee5);
        vertical-align: top;
        margin-right: 19px;
      }
      .upper {
        margin-top: -32px;
        position: relative;
      }
      .processing {
        margin-top: -32px;
        position: relative;
        // bottom: -17px;
        .tips {
          top: -5px;
        }
        & .time {
          top: 0;
          &:before {
            position: relative;
            top: -46px;
          }
        }
        .time-without-line {
          color: #9ca0ab;
          position: relative;
          left: 33px;
          top: -26px;
        }
        .time-with-tips {
          top: 0;
          left: 33px;
          color: #9ca0ab;
          position: relative;
        }
      }
      .waiting {
        margin-top: -32px;
        position: relative;
        bottom: -17px;
        .tips {
          top: -5px;
        }
        & .time {
          top: 0;
          &:before {
            position: relative;
            top: -46px;
          }
        }
      }
      .finishing {
        margin-top: -32px;
        position: relative;
        bottom: -17px;
        .tips {
          top: -5px;
        }
      }
      .btn {
        border-radius: 2px;
        height: 36px;
        line-height: 36px;
        border: solid 1px #0d9737;
        font-size: 14px;
        font-weight: 900;
        text-align: center;
        color: #0d9737;
        margin-top: 44px;
        margin-bottom: 26px;
      }
      .btn:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
