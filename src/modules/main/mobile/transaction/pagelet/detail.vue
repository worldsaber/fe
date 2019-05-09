<template>
  <div class="m-tran-detail-wrap">
		<topNavBar backText="Back" :backClick="backToList" id="top-navbar">
			<div slot="right">
				<homeNav/>
			</div>
		</topNavBar>
		<!-- 只要有comment就显示comment, 一般是rollback或者下单失败会给用户一个提示 -->
		<div class="m-rollback-reason"
			v-if="comment">
			<span class="m-warn-icon">
				<img src="../image/icon-warn.png" width="20" height="20">
			</span>
			<span class="m-rollback-comment">
				{{comment}}
			</span>
		</div>
		<!-- withdraw block提示和rollback等提示位置相同，此处withdraw block提示优先级低 -->
		<withdrawTip v-else/>
		<div class="m-my-dl m-my-dl-part1">
			<dl>
				<dt>Amount ({{showCurrencyOrigin}})</dt>
				<dd class="m-my-dl-em">{{['','+','-'][detailObj.amountSign]}} {{detailObj.amountStr}}</dd>
			</dl>
			<dl v-if="detailObj.tradeCode == 'WD0001' && detailObj.feeAmount !== 0">
				<dt>Additional Fee</dt>
				<dd class="m-my-dl-em">- {{detailObj.feeStr}}</dd>
			</dl>
		</div>
		<div class="m-my-dl m-my-dl-part2">
			<dl v-if="detailObj.tradeCode === 'WD0004'&&detailObj.status===20">
				<dt>Commission to Partner</dt><dd>- {{detailObj.feeStr}}</dd>
			</dl>
			<dl>
				<dt>Status</dt><dd :class="{'m-txt-red':detailObj.status === 10}">{{detailObj.statusStr}}</dd>
			</dl>
			<p class="m-tran-tips" v-if='!!detailObj.reason'>{{detailObj.reason}}</p>
			<dl>
				<dt>Time</dt><dd>{{detailObj.showDate}} {{detailObj.showTime}}</dd>
			</dl>
			<dl>
				<dt>Type</dt><dd>{{detailObj.type}}</dd>
			</dl>
			<dl v-if="detailObj.tradeCode === 'WD0004'">
				<dt>Withdraw From</dt><dd>Partner({{partnerCode}})</dd>
			</dl>
			<dl v-if="statusType && statusText && detailObj.tradeCode !== 'WD0004'">
				<dt>{{statusType}}</dt>
				<dd>{{statusText}}</dd>
			</dl>
			<dl>
				<dt>Trade No.</dt><dd>{{detailObj.tradeId}}</dd>
			</dl>
			<dl v-if="detailObj.goodsName&&detailObj.tradeCode === 'WD0004'">
				<dt>Round No.</dt><dd>{{detailObj.goodsName}}</dd>
			</dl>
			<dl v-if="detailObj.payChTxId && detailObj.status === 20">
				<dt v-if="country === 'ng'">Reference</dt>
				<dt v-else>Transaction No.</dt>
				<dd>{{detailObj.payChTxId}}</dd>
			</dl>
			<dl v-if="!!detailObj.orderId">
				<dt>Ticket ID</dt><dd>{{detailObj.orderId}}</dd>
			</dl>
			<dl>
				<dt>Balance</dt>
				<dd>{{detailObj.afterBalStr}}</dd>
			</dl>
			<dl v-if="detailObj.tradeCode === 'WD0004'|| detailObj.tradeCode === 'FE0001'" @click="gotoList(detailObj.tradeId)">
				<dt class="request-details">Request Details</dt>
			</dl>
		</div>
		<div class="m-rollback-title" v-if="isRollback && rollbackDetail">
			<dl>
				<dt>Rollback Details</dt>
			</dl>
		</div>
		<div class="m-my-dl m-my-dl-rollback" v-if="isRollback  && rollbackDetail">
			<dl>
				<dt>Game ID</dt>
				<dd>{{rollbackDetail.gameId}}</dd>
			</dl>
			<dl>
				<dt>Rollback Time</dt>
				<dd>{{rollbackDetail.rollbackTime}}</dd>
			</dl>
			<dl>
				<dt>Home</dt>
				<dd>{{rollbackDetail.home}}</dd>
			</dl>
			<dl>
				<dt>Away</dt>
				<dd>{{rollbackDetail.away}}</dd>
			</dl>
			<dl>
				<dt>Pick</dt>
				<dd>{{rollbackDetail.selection}}</dd>
			</dl>
			<dl>
				<dt>Market</dt>
				<dd>{{rollbackDetail.market}}</dd>
			</dl>
			<dl>
				<dt>Result</dt>
				<dd>{{rollbackDetail.betStatus}}</dd>
			</dl>
		</div>
		<p class="m-trans-contat"
			:class="[detailObj.tradeCode == 'CB0005' || detailObj.tradeCode == 'CB0006'? 'm-contact-line' : '']"
			v-if="isShowTelephone"
        >
			Contacts {{contactPhone}}
		</p>
  </div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import topNavBar from 'components/navbar';
import homeNav from 'components/homeNav';
import withdrawTip from 'components/withdrawBlockTip';
import { showCurrencyOrigin } from 'config/currencyConfig';
import tool from 'transaction/tool';
import { pagePath } from 'config/pageConfig.js';
import { getContactsNumber } from 'base/js/utils';
import '../../mockData/transaction/index?debug';

const BetStatus = {
	RUNNING: 'Running',
	WON: 'Won',
	LOST: 'Lost',
	VOID: 'Void',
	CASHOUT: 'Cash out',
	APPROVAL: 'Approval'
};
export default {
	components: {
		topNavBar,
		homeNav,
		withdrawTip
	},
	props: {
		detailObj: {
			type: Object,
			'default': function () {
				return {};
			}
		},
		isHistory: {
			type: Boolean,
			'default': false
		}
	},
	mounted() {
		this.getTransactionDetail();
	},
	data  () {
		return {
			showCurrencyOrigin,
			// 收费显示一个交易记录的type，只有 type 是充值提现和交易code是 CB003(线下派奖)和RF001(退款)才显示
			country: window.country || '',
			payChTxId: '',
			rollbackDetail: '',
			comment: '',
			loading: false,
			partnerCode: '',
			detail: `${pagePath.myCenter}/withdraw/request_list/details`,
			contactPhone: getContactsNumber()
		};
	},
	computed: {
		isRollback() {
			const tradeCode = this.detailObj.tradeCode;
			return ['CB0005', 'CB0006'].includes(tradeCode);
		},
		statusType() {
			const tradeCode = this.detailObj.tradeCode;
			return tool.getTypeLabel(tradeCode);
		},
		statusText() {
			 return tool.getTypeValue(this.detailObj);
		},
		isShowTelephone() {
			return window.country !== 'gh';
		}
	},
	methods: {
		getTransactionDetail() {
			this.loading = true;
			fetch(`/pocket/v1/statements/${this.detailObj.tradeId}?isHistory=${this.isHistory ? 1 : 0}`, {
				method: 'GET'
			}).then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					// comment改成通用comment，只要有就显示
					this.comment = res.data.comment || '';
					if (this.isRollback) {
						const detail = res.data.rollbackDetail;
						if (detail) {
							detail.rollbackTime = dateFormat.format(detail.rollbackTime, 'DD/MM  HH:mm:ss');
							detail.betStatus = BetStatus[detail.betStatus];
							this.rollbackDetail = detail;
						}
						this.payChTxId = res.data.payChTxId || '';
						this.loading = false;
					}
					this.partnerCode = res.data.counterpart;
				}
			})
			.catch(e => {
				this.loading = false;
				this.$toast('Sorry，something went wrong. Please try again later.');
			});
		},
		backToList () {
			this.$emit('backToListEvent', true);
		},
		gotoList(id) {
			location.href = `${this.detail}?tradeId=${id}`;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/mixin.less';

	.m-tran-detail-wrap{
		position: fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 100%;
		background: @white;
		z-index: 33;
		overflow: auto;
		.m-gray-line{
			border-top: 1px solid @fogGray;
		}
		.request-details {
			color: @green !important;
			&:after {
				content: '>';
				display: inline-block;
				margin-left: 10/@rem;
			}
		}
		.m-my-dl{
			width: 90%;
			margin: 10/@rem auto 0;
			color:@dark;
			padding:10/@rem 0 0;
			dl{
				.clearfix();
			}
			dt{
				float: left;
				padding-left: 2px;
			}
			dd {
				float: right;
			}
			&-part1{
				font-size: 14/@rem;
				dd, dt{
					height: 24/@rem;
					line-height: 24/@rem;
					padding: 7/@rem 0;
				}
				dd{
					padding-right: 18/@rem;
					color:@darkGray;
				}
				dt{
					font-size: 16/@rem;
				}
				.m-my-dl-em{
					font-size: 22/@rem;
					color: #353a45;
					font-weight: bold;
				}
			}
			// &-detail-fix{
			// 	padding:33/@rem 0 10/@rem !important;
			// }
			&-part2{
				border-top: 1px solid @fogGray;
				margin-top:5/@rem;
				padding:33/@rem 0 10/@rem;

				font-size: 12/@rem;
				dl{
					padding:9/@rem 0;
				}
				dt,dd{
					height: 18px;
					line-height: 18px;
				}
				dt{
					color:@darkGray;
				}

				dd{
					padding-right: 4/@rem;
				}
			}
			&-rollback{
				margin-top:5/@rem;
				padding:0 0 10/@rem;
				font-size: 12/@rem;
				dl{
					padding:9/@rem 0;
				}
				dt,dd{
					height: 18px;
					line-height: 18px;
				}
				dt{
					color:@darkGray;
				}

				dd{
					padding-right: 4/@rem;
				}
			}
		}
		.m-trans-contat{
			width: 90%;
			margin: 0 auto 20/@rem;
			text-align: center;
			color:@dark;
			padding-top: 10/@rem;
			border-top: 1/@rem solid #eaecef;
		}
		.m-tran-tips{
			height:28/@rem;
			line-height: 28/@rem;
			color:@green;
			font-size: 10/@rem;
			background: #fbfbfb;
			text-align: center;
			margin:5/@rem 0 8/@rem;
		}
		.m-rollback-reason{
			padding: 10/@rem;
			overflow-x: hidden;
			background-color: rgba(250,253,0,0.1);
			display: flex;
			img{
				width: 20/@rem;
				height: 20/@rem;
			}
			.m-rollback-comment{
				margin-left: 11/@rem;
				flex: 1;
			}
			.m-warn-icon{
				width: 20/@rem;
				flex: 0 1 auto;
				display: flex;
				align-items: center;
			}
		}
		.m-rollback-title{
			width: 90%;
			margin: 0 auto;
			padding-top: 15/@rem;
			font-size: 14px;
			color: @darkGray;
			text-align: center;
			border-top: 1px solid @fogGray;
		}
		.m-contact-line{
			border-top: 1px solid @fogGray;
		}
	}
</style>
