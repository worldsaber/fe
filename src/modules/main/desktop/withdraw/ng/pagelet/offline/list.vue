<template>
  <div class="offline-withdraw-list-container">
	  <div class="crumb">
		  <span class="to-withdraw" @click="back">Withdraw ></span>
		  <span class="r-list">Request List</span>
	  </div>
	  <div class="table-wrapper">
		  <p>Request List</p>
		  <AfTable class="m-trans-head">
			<AfTableRow>
				<AfTableCell class="m-trans-tl">
					<span>Time</span>
				</AfTableCell>
				<AfTableCell class="tran-type">
					<span>From</span>
				</AfTableCell>
				<AfTableCell class="tran-tradeno">
					<span>Amount</span>
				</AfTableCell>
				<AfTableCell>
					<span>Status</span>
				</AfTableCell>

				<AfTableCell>
					<span></span>
				</AfTableCell>

				<AfTableCell>
					<span></span>
				</AfTableCell>
			</AfTableRow>
	 	</AfTable>
		<NoList v-if="!(records||[]).length"/>
		<AfTable class="m-trans-body" v-else>
			<AfTableRow v-for="(item,i) in records" :key="i">
				<AfTableCell class="m-trans-tl">
					<span>{{item.requestDate}}</span>
					<span>{{item.requestTime}}</span>
				</AfTableCell>
				<AfTableCell class="tran-type">
					<span>Partner</span>
					<span class="gray">{{item.ptnCode}}</span>
				</AfTableCell>
				<AfTableCell  class="tran-tradeno">
					<span>{{item.initAmount}}</span>
				</AfTableCell>
				<AfTableCell>
					<span>{{item.statusText}}</span>
					<span class="gray" v-if="item.status===12">(PIN Code: {{item.pin}})</span>
				</AfTableCell>
				<AfTableCell @click="cancelWithdraw(item.tradeId, item.status)">
					<span class="cancel" v-if="item.status===12 || item.status===10">Cancel</span>
				</AfTableCell>
				<AfTableCell @click="getDetail(item.tradeId)">
					<span class="details">Details</span>
				</AfTableCell>
			</AfTableRow>
		</AfTable>
	  </div>
	  <Pagination
			v-if="totalNum>20"
			:pageCount="Math.ceil(totalNum/20)"
			:clickHandler="pageClickHandler"
			:initialPage="1"
			class="pagination">
		</Pagination>
  </div>
</template>

<script>
import { userCenterConfig } from 'config/order/userCenterConfig.js';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import Pagination from 'components/pagination/pagination';
import CommonPop from 'components/popDialog/commonPop';
import { mapState, mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import NoList from './nolist';
import { monthData } from '../../js/comFunc';
import detail from './detail';

export default {
	components: {
		detail,
		Pagination,
		NoList
	},
	data () {
		return {
			records: [],
			offline: `${userCenterConfig.Withdraw}?is_offline=1 `,
			partnerCode: '',
			withdrawAmount: 0,
			pageNo: 1,
			totalNum: 0,
			beforeCancel: '',
			afterCancel: '',
			pop: null
		};
	},
	computed: {
		...mapState('userCenter', {
			current: 'currentTab',
		}),
	},
	created () {
		this.getList();
	},
	mounted() {
		this.updateCurrentTab('Withdraw');
	},
	methods: {
		...mapMutations('userCenter', {
			updateCurrentTab: mutationTypes.UPDATE_CURRENT_TAB,
		}),
		back () {
			location.href = this.offline;
		},
		pageClickHandler (page) {
			this.pageNo = page;
			this.getList();
		},
		getDetail (id) {
			this.$dialog({
				title: null,
				contentData: {
					tradeId: id,
				},
				content: detail,
				'class': 'withdraw-detail-pop',
				button: []
			});
		},
		getList () {
			fetch('pocket/v1/flows', {
				method: 'GET',
				body: {
					pageNo: this.pageNo,
					pageSize: 20,
				}
			})
			.then(res => res.json())
			.then(ret => {
				if (ret.bizCode === 10000) {
					this.totalNum = ret.data.totalNum;
					this.formateData(ret.data.entityList);
				} else {
					this.$dialog({
						title: null,
						contentData: {
							msg: 'Sorry，something went wrong. Please try again later.',
						},
						content: CommonPop,
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
		},
		formateData (data) {
			const flag = {};
			for (const item of data) {
				item.Month = monthData[new Date(item.requestTime).getMonth()];
				item.Year = new Date(item.requestTime).getYear();
				if (!flag[item.monthlyDate]) {
					item.monthlyDate = `${item.Month} ${item.Year}`;
					flag[item.monthlyDate] = 1;
				}
				item.requestTime = dateFormat.format(item.requestTime, 'DD/MM/YYYY HH:mm:ss');
				item.initAmount = formatNumber(item.initAmount / 10000, 2);
				switch (item.status) {
				case 10:
					item.statusText = 'Waiting for Partner\'s Approval';
					break;
				case 12:
					item.statusText = 'Approved';
					break;
				case 20:
					item.statusText = 'Withdrawal Succeeded';
					break;
				case 30:
					item.statusText = 'Withdrawal Failed';
					break;
				case 35:
					item.statusText = 'Cancelled';
					break;
				case 36:
					item.statusText = `Cancelled (Cancellation Fee:${formatNumber(+item.cancelFee / 10000, 2)})`;
					break;
				case 37:
					item.statusText = 'Rejected';
					break;
				case 90:
					item.statusText = 'Request Expired';
					break;
				case 91:
					item.statusText = 'PIN Code Expired';
					break;
				default:
					break;
				}
			}
			this.records = data;
		},
		cancelWithdraw (tradeId, status) {
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
			});
		}
	}
};
</script>

<style lang="less">
@import "base/style/variable.less";
.m-main-left {
  margin-top: 20px;
  margin-right: 20px;
}
.m-main {
  background: #eaecef;
}

.offline-withdraw-list-container {
  margin-top: 20px;
   .m-table-cell {
	   width: 50px;
   }
  .pagination .selected {
    background: @green;
    color: #fff;
  }
  .pageNum {
    font-weight: bold !important;
  }
  .pagination {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 92px;
  }
  .r-list,
  .details {
    color: #3858a1;
  }
  .details:hover,
  .cancel:hover,
  .to-withdraw:hover {
    cursor: pointer;
  }
  .gray {
    color: #9ca0ab;
  }
  .cancel {
    width: 56px;
    line-height: 24px !important;
    border-radius: 2px;
    color: #0d9737;
    margin-left: 53px;
    border: solid 1px #0d9737;
  }
  .table-wrapper {
    background: #fff;
    p {
      margin: 20px 0 20px 16px;
      font-size: 14px;
      font-weight: 500;
      padding-top: 20px;
    }
  }
  .m-table-row {
    table-layout: fixed;
  }
  .m-table-cell {
    text-align: center;
    align-self: center;
    box-sizing: border-box;
    flex-basis: 140px;
    &.tran-type {
      width: 18%;
      flex-basis: 115px;
    }
    &.tran-tradeno {
      width: 23%;
      flex-basis: 150px;
    }
    > span {
      display: block;
      line-height: 1.3;
      white-space: normal;
    }
  }
  .m-trans-tl {
    text-align: left;
    padding-left: 15px;
  }
  .m-trans-head {
    background: @blueBlack;
    padding: 10px 0;
    box-sizing: border-box;
    color: @white;
  }
  .m-trans-body {
    margin-bottom: 46px;
    .m-table-row {
      border: 1px solid @fogGrayBorder;
      padding: 6px 0;
      margin: 5px 0 0;
      box-sizing: border-box;
    }
  }
  .m-detail {
    cursor: pointer;
    color: #3656a3;
    text-decoration: none;
  }
}
</style>
