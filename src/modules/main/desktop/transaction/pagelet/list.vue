<template>
	<div class="m-trans-list">
		<div class="m-list-header" v-if="isSupportManual">
			<!-- mpesa对账单按钮 -->
			<a class="m-reconciliation-btn" @click="handleReconciliationPanel">Was your Deposit unsuccessful?</a>
		</div>
		<AfTable class="m-trans-head">
			<AfTableRow>
				<AfTableCell class="m-trans-tl">
					<span>Time</span>
				</AfTableCell>
				<AfTableCell class="tran-type">
					<span>Type</span>
				</AfTableCell>
				<AfTableCell class="tran-tradeno">
					<span>Trade No.</span>
				</AfTableCell>
				<!-- <AfTableCell>
					<span>Ticket ID</span>
				</AfTableCell> -->
				<AfTableCell>
					<span>Amount</span>
				</AfTableCell>
				<AfTableCell>
					<span>Status</span>
				</AfTableCell>
				<AfTableCell>
					<span>Balance</span>
				</AfTableCell>
				<AfTableCell>
					<span></span>
				</AfTableCell>
			</AfTableRow>
		</AfTable>
		<NoList v-if="!(dataList||[]).length"/>
		<AfTable class="m-trans-body" v-else>
			<AfTableRow v-for="(item, index) in dataList" :key="index">
				<AfTableCell class="m-trans-tl">
					<span>{{item.showDate}}</span>
					<span>{{item.time}}</span>
				</AfTableCell>
				<AfTableCell class="tran-type">
					<span>{{item.type}}</span>
				</AfTableCell>
				<AfTableCell  class="tran-tradeno">
					<span>{{item.tradeId}}</span>
				</AfTableCell>
				<AfTableCell>
					<span>{{['','+','-'][item.amountSign]}}{{item.amountStr}}</span>
				</AfTableCell>
				<AfTableCell>
					<span :class="{'m-t-red':item.status === 10,'m-t-gray':item.status === 30}">{{item.statusStr}}</span>
				</AfTableCell>
				<AfTableCell>
					<span v-if="item.status != 10">{{item.afterBalStr}}</span>
					<span v-else>- - -</span>
				</AfTableCell>
				<AfTableCell>
					<span><a @click="getDetails(index)" class="m-detail">Details</a></span>
				</AfTableCell>
			</AfTableRow>
		</AfTable>
		</div>
</template>

<script>
import 'components/dialog';
import EventBus from 'kernel/js/eventBus';
import NoList from './nolist';
import Detail from './detail';
import Reconciliation from './reconciliation';
import { supportManual } from '../js/config';

export default {
	components: {
		NoList,
		Detail
	},
	data () {
		return {
			country: window.country,
			isSupportManual: supportManual()
		};
	},
	props: {
		dataList: {
			type: Array,
			'default': function () {
				return [];
			}
		}
	},
	methods: {
		getDetails(index) {
			const dialogData = {
				data: this.dataList[index]
			};
			const dialog = this.$dialog({
				title: '<div class="dialog-title">Transaction Details</div>',
				contentData: dialogData,
				content: Detail,
				layout: true,
				button: [],
				css: 'position: absolute'
			});
			// rollback detail 导致高度有调整， 手动更新弹框位置
			EventBus.$on('rollback-detail', () => {
				dialog.setPosition({
					top: 'center',
					left: 'center'
				});
			});
		},
		handleReconciliationPanel () {
			this.$dialog({
				'class': 'm-reconciliation-dialog',
				content: Reconciliation,
				layout: true,
				button: []
			});
		}
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

.m-trans-list {
	margin: 25px auto 0;

	.m-list-header {
		margin: -11px 0 10px;
		overflow: hidden;

		.m-reconciliation-btn {
			float: right;
			font-size: 13.3px;
			line-height: 15px;
			color: @green;
			cursor: pointer;
		}
	}

	.m-t-gray{
		color:@darkGray;
	}

	.m-t-red{
		color: @red;
	}
	.m-table-row{
		table-layout: fixed;
	}
	.m-table-cell{
		text-align: center;
		align-self: center;
		box-sizing: border-box;
		flex-basis: 60px;
		&.tran-type{
			width:18%;
			flex-basis:115px;
		}
		&.tran-tradeno{
			width:23%;
			flex-basis:150px;
		}
		>span{
			display: block;
			line-height: 1.3;
			white-space:normal;
			word-break:break-all;
		}
	}

	.m-trans-tl{
		text-align: left;
		padding-left: 15px;
	}

	.m-trans-head {
		background: @blueBlack;
		padding: 10px 0;
		box-sizing: border-box;
		color:@white;
	}

	.m-trans-body{
		.m-table-row{
			border: 1px solid @fogGrayBorder;
			padding: 6px 0;
			margin: 5px 0 0;
			box-sizing: border-box;
		}

	}
	.m-detail{
		cursor: pointer;
		color: #3656a3;
		text-decoration: none;
	}
	.m-bet-list {
		margin-top: 2px;

		.m-table-row {
			padding: 15px 0;
			box-sizing: border-box;
			align-items: center;
		}

		.m-table-cell {
			>span {
				display: block;

				&:last-of-type {
					margin-bottom: 0;
				}
			}
		}
	}
}
.es-dialog{
	.es-dialog-head {
		padding: 0;
		color: #353a45;
		height: 58px;
		h1{
			line-height: 1;
			padding: 0;
			.dialog-title{
				font-size: 24px;
				width: 528px;
				height: 57px;
				line-height: 57px;
				text-align: center;
				font-weight: bold;
				border-bottom: solid 1px #eaecef;
			}
		}
		.es-dialog-close{
			top: 11px;
			right: 20px;
			text-decoration: none;
			cursor: pointer;

			> * {
				cursor: pointer !important;
			}
		}
	}
	.es-dialog-body{
		.es-dialog-main{
			padding: 0;
			max-height: 500px;
			overflow-y: auto;

			.dialog-content{
				width:528px;
				// height:348px;
				font-size: 12px;
			}
		}
	}
}

.m-reconciliation-dialog {
	width: 528px!important;

	.m-dialog-body {
		margin-top: -58px;
	}
}
</style>
