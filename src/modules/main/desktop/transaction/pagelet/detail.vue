<template>
	<div class="dialog-main-content">
		<div class="dg-rollback-text" v-if="isRollback">
			<span class="dg-rollback-info">!</span>
			{{comment}}
		</div>
		<AfTable class="m-table-style m-table-transaction">
			<AfTableRow class="m-row-amount">
				<AfTableCell><div class="m-left-amount">Amount ({{showCurrency}})</div></AfTableCell>
				<AfTableCell><div class="m-right-amount m-row-amount-value">{{amount}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="detailData.tradeCode == 'WD0001' && +detailData.feeStr">
				<AfTableCell><div class="left-cell m-row-fee-label">Additional Fee</div></AfTableCell>
				<AfTableCell><div class="right-cell m-row-fee-value">- {{detailData.feeStr}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-cell-top"></AfTableRow>
			<AfTableRow class="m-row-normal" v-if="detailData.tradeCode === 'WD0004'&&detailData.status===20">
				<AfTableCell><div class="left-cell">Commission to partner</div></AfTableCell>
				<AfTableCell><div class="right-cell">- {{detailData.feeStr}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow>
				<AfTableCell><div class="left-cell">Status</div></AfTableCell>
				<AfTableCell style="flex: 0 1 auto;">
					<div class="right-cell m-row-status-value" :class="{'m-cell-red':detailData.status === 10}" style="padding-left: 10px;">
						{{detailData.statusStr}}
					</div>
					<div class="right-cell m-row-status-pending" v-if="detailData.reason">{{detailData.reason}}</div>
				</AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal">
				<AfTableCell><div class="left-cell">Time</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.date}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.time}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow  class="m-row-normal">
				<AfTableCell><div class="left-cell">Type</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.type}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow  class="m-row-normal" v-if="detailData.tradeCode === 'WD0004'">
				<AfTableCell><div class="left-cell">Withdraw From</div></AfTableCell>
				<AfTableCell><div class="right-cell">Partner({{partnerCode}})</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="statusType && statusText && detailData.tradeCode !== 'WD0004'">
				<AfTableCell><div class="left-cell">{{statusType}}</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{statusText}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal">
				<AfTableCell><div class="left-cell">Trade No.</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.tradeId}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="detailData.goodsName&&detailData.tradeCode === 'WD0004'">
				<AfTableCell><div class="left-cell">Round No.</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.goodsName}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="!!detailData.orderId">
				<AfTableCell><div class="left-cell">Ticket ID.</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.orderId}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="showTransactionNo">
				<AfTableCell><div class="left-cell">Transaction No.</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.payChTxId}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="showReference">
				<AfTableCell><div class="left-cell">Reference</div></AfTableCell>
				<AfTableCell><div class="right-cell">{{detailData.payChTxId}}</div></AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal">
				<AfTableCell><div class="left-cell">Balance</div></AfTableCell>
				<AfTableCell>
					<div class="right-cell">
					{{detailData.status === 10 || detailData.tradeCode === 'CB0003' ? '— —' : detailData.afterBalStr}}
					</div>
				</AfTableCell>
			</AfTableRow>
			<AfTableRow class="m-row-normal" v-if="detailData.tradeCode === 'WD0004'|| detailData.tradeCode === 'FE0001'">
				<AfTableCell><div class="left-cell"></div></AfTableCell>
				<AfTableCell><div class="right-cell" style="color:#0d9737;" @click="gotoList">Request Details ></div></AfTableCell>
			</AfTableRow>
		</AfTable>
		<div class="rollback-details" v-if="isRollback && rollbackDetail">
			<div class="rollback-details-title">Rollback Details</div>
			<AfTable class="m-table-rollback">
				<AfTableRow class="rollback-row" v-for="item in rollbackRows" :key="item.label" v-if="!item.disable">
					<AfTableCell><div class="rollback-cell-label  left-cell">{{item.label}}</div></AfTableCell>
					<AfTableCell><div class=" rollback-cell-value right-cell">{{item.value}}</div></AfTableCell>
				</AfTableRow>
			</AfTable>
		</div>
		<div class="m-contact" v-if="isShowTelephone">
			Contacts <span class="contact-number">{{contactsNumber}}</span>
		</div>
	</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import tool from 'transaction/tool.js';
import EventBus from 'kernel/js/eventBus';
import { getContactsNumber } from 'base/js/utils';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { transitionNoCfg, referenceCfg } from 'config/transationConfig';
import { userCenterConfig } from 'config/order/userCenterConfig.js';

const BetStatus = {
	RUNNING: 'Running',
	WON: 'Won',
	LOST: 'Lost',
	VOID: 'Void',
	CASHOUT: 'Cash out',
	APPROVAL: 'Approval'
};

const rollMap = {
	CB0005: 'Due to bet rollback, your bet winnings have been deducted by SportyBet. In the case of a winning bet, the winnings of your bet will be refunded to your account.',
	CB0006: 'After the rollback on your bet, the final result is that your bet lost. However, we have provided you with a compensation bonus. Wish you good luck next time!'
};

export default{
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			contactsNumber: getContactsNumber(),
			comment: '',
			rollbackDetail: null,
			partnerCode: '',
			list: `${userCenterConfig.Withdraw}/request_list `,
		};
	},
	mounted() {
		this.getRollbackDetail();
		if (this.isRollback) {
			// 评论展示
			const trade = this.detailData.tradeCode;
			this.comment = rollMap[trade];
		}
	},
	computed: {
		detailData() {
			return this.dialogData.data;
		},
		amount() {
			return ['', '+', '-'][this.detailData.amountSign] + this.detailData.amountStr;
		},
		statusType() {
			const tradeCode = this.detailData.tradeCode;
			return tool.getTypeLabel(tradeCode);
		},
		statusText() {
			 return tool.getTypeValue(this.detailData);
		},
		isRollback() {
			const tradeCode = this.detailData.tradeCode;
			return ['CB0005', 'CB0006'].includes(tradeCode);
		},
		rollbackRows() {
			const detail = this.rollbackDetail;
			if (!detail) {
				return [];
			}
			const dataStr = dateFormat.format(detail.rollbackTime, 'DD/MM  HH:mm:ss');

			return [{
				label: 'Game ID',
				value: detail.gameId,
			}, {
				label: 'Rollback Time',
				value: dataStr,
			}, {
				label: 'Home',
				value: detail.home,
			}, {
				label: 'Away',
				value: detail.away,
			}, {
				label: 'Pick',
				value: detail.selection
			}, {
				label: 'Market',
				value: detail.market
			}, {
				label: 'Result',
				value: BetStatus[detail.betStatus]
			}];
		},
		showTransactionNo() {
			const detailData = this.detailData || {},
				payChId = detailData.payChId,
				status = detailData.status;

			return transitionNoCfg.statue === status && transitionNoCfg.payChId.includes(payChId);
		},
		showReference() {
			const detailData = this.detailData || {},
				payChId = detailData.payChId,
				status = detailData.status;

			return referenceCfg.statue === status && referenceCfg.payChId.includes(payChId);
		},
		isShowTelephone() {
			return window.country !== 'gh';
		}
	},
	methods: {
		getRollbackDetail() {
			const tradeId = this.detailData.tradeId;
			// this.setRollbackDetail({
			// 	gameId: '01',
			// 	rollbackTime: +new Date(),
			// 	home: 'NBD',
			// 	away: 'TES',
			// 	market: 'AME',
			// 	selection: "Home @1.3",
			// 	betStatus: 0
			// });

			fetch(`/pocket/v1/statements/${tradeId}`, {
				method: 'GET',
				body: {}
			}).then(res => res.json())
			.then(data => {
				// this.isLoaded = true;
				const code = data.bizCode;
				if (code === 10000) {
					// 更新 rollback detail

					if (data.data.rollbackDetail && this.isRollback) {
						this.setRollbackDetail(data.data.rollbackDetail);
						// Ojbect.assign(this.data, data.data);
						this.comment = data.data.comment;
					}
					this.partnerCode = data.data.counterpart;
				}
			}).catch(() => {
				// this.isLoaded = true;
			});
		},
		setRollbackDetail(detail) {
			this.rollbackDetail = detail;
			this.$nextTick(() => {
				EventBus.$emit('rollback-detail');
			});
		},
		gotoList() {
			location.href = this.list;
		}
	}
};
</script>
<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
.dialog-main-content {
	.m-t-gray{
		color:@darkGray;
	}

	.m-row-amount{
		height: 49px;
		line-height: 49px;
		font-size: 16px;
		font-weight: bold;
	}
	.m-row-normal{
		height: 31px;
		font-size: 12px;
	}
	.m-left-amount{
		height: 49px;
		line-height: 49px;
		text-align: left;
		// margin-left: 35px;
	}
	.m-right-amount{
		height: 49px;
		line-height: 49px;
		text-align: right;
		// margin-right: 49px;

	}
	.left-cell{
		height: 31px;
		line-height: 31px;
		text-align: left;
		color: #9ca0ab;
		// margin-left: 35px;
	}
	.right-cell{
		height: 31px;
		line-height: 31px;
		text-align: right;
		// margin-right: 49px;
		color: #353a45;
	}
	.m-cell-top{
		height: 0px;
		margin: 10px 0;
		border-bottom: solid 1px #eaecef;
	}
	.m-cell-bottom{
		height: 38px;
	}
	.m-tran-tips{
		height:28px;
		line-height: 28px;
		color:@green;
		font-size: 10px;
		background: #fbfbfb;
		text-align: center;
		margin:5px 0 8px;
	}
	.m-cell-reason{
		background-color:#f2f2f2;
		line-height:23px;
		height:23px;
		font-size: 10px;
		text-align:center;
		color: #9ca0ab;
		margin: 4px 0;
	}
	.dg-rollback-text{
		position: relative;
		width: 376px;
		margin: 10px auto 20px;
		padding: 10px 10px 10px 42px;
		background-color: rgba(250, 253, 0, 0.1);
		font-size: 12px;
		color: #353a45;
	}
	.dg-rollback-info {
		position: absolute;
		width: 20px;
		height: 20px;
		font-size: 14px;
		line-height: 20px;
		text-align: center;
		left: 11px;
		top: 50%;
		margin-top: -10px;
		background-color: #fac111;
		color: #FFF;
		border-radius: 50%;
	}
	.m-table-rollback .rollback-row
	{
		display: flex;
		justify-content: space-between;
		.rollback-cell{
			display: flex;
			flex: 1;
			flex-basis: 50%;
			width: 50%;
		}
		.m-rollback-cell-game{
			flex-basis: auto;
			width: auto;
			flex-shrink: 0;
			flex-grow: 0;
		}
	}
	.m-rollback-cell-game{
		.rollback-cell-label{
			display: none;
		}
		.rollback-cell-value{
			flex-grow: 0;
			padding-right: 10px;
			border-right: 1px solid #eaecef;
			height: 15px;
			line-height: 15px;
			margin: 8px 10px 8px 0;
			text-align: left;

		}
	}
	.m-rollback-cell-home, .m-rollback-cell-away{
		.rollback-cell-label{
			display: none;
		}
		.rollback-cell-value{
			text-align: left;
		}
	}
	.m-rollback-cell-time{
		.rollback-cell-value{
			text-align: left;
			padding-left: 20px;
		}
	}
	.rollback-cell-value {
		flex-grow: 1;
	}
	.rollback-details-title{
		text-align: center;
		font-size: 14px;
		color: #9ca0ab;
		padding: 10px 0;
		margin: 10px 50px 0;
		border-top: 1px solid #eaecef;
	}
	.m-table-transaction, .m-table-rollback{
		padding: 0 50px;
		box-sizing: border-box;
	}
	.m-table-transaction{
		margin-top: 20px;
	}
	.m-row-fee-label{
		color: #353a45;
		font-size: 14px;
	}
	.m-row-fee-value{
		color: #353a45;
		font-size: 16px;
	}
	.m-row-amount-value{
		font-size: 22px;
	}
	.m-contact{
		font-size: 14px;
		padding: 10px 0;
		margin: 10px 50px;
		border-top: 1px solid #eaecef;
		color: #9ca0ab;
		text-align: center;
		.contact-number{
			color: #3656a3;
		}
	}
	.m-row-status-value{
		font-size: 14px;
		&.m-cell-red{
			font-weight: bold;
			color: #e42127;
		}
	}
	.m-row-status-pending{
		color: #9ca0ab;
		text-align: right;
		margin: -5px 0 5px;
		line-height: 20px;
		height: 20px;
	}
}
</style>
