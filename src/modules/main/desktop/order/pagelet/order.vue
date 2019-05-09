<template lang="html">
	<div class="m-order-wrapper">
		<h1 class="print-subtitle print-item" id="oListPTit">Bet History - Sport Bets</h1>
		<NavBar :settleType='settleType' orderType="sports" @changeSettleType="switchSettleType" @update="dateChange" @reset="resetDate"/>
		<Nobet v-if="!isLoading && !(orderList||[]).length"/>
		<div v-else>
			<OrderList
				v-for="item in orderList"
				:key="item.orderId"
				:orderInfo="item"
			/>
			<div class="m-pg-container" v-if="pageCount > 1">
				<Pagination :pageCount="pageCount" :pageRange="10" :clickHandler="pageClickHandler" :initialPage="pageIndex"  class="pagination"></Pagination>
			</div>
		</div>
	</div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat.js';
import Pagination from 'components/pagination/pagination';
import { formatNumber } from 'utils';

import NavBar from './navigator.vue';
import OrderList from './orderList.vue';
import Nobet from './nobet.vue';
import { keyToType, typeToKey, orderTypeMap, statusMap } from './config.js';

export default {
	components: {
		NavBar,
		OrderList,
		Nobet,
		Pagination
	},
	data() {
		return {
			settleType: 'all',
			pageSize: 5,
			isLoading: false,
			currentBetId: '',
			pageIndex: 1,
			pageCount: 1,
			orderList: [],
			start: '',
			end: ''
		};
	},
	computed: {

	},
	created() {
		this.changeSettleType(keyToType[this.$route.query.isSettled]);
		this.getOrderList();
	},
	methods: {
		changeSettleType(type) {
			this.settleType = type || this.settleType;
		},
		getOrderList(pageNo) {
			this.isLoading = true;
			fetch('/orders/order/v2/realbetlist', {
				method: 'GET',
				body: {
					isSettled: typeToKey[this.settleType],
					pageSize: this.pageSize,
					pageNo: pageNo || 1,
					startTime: this.start ? this.start : '',
					endTime: this.end ? this.end : ''
				}
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				const { data, bizCode } = res;
				if (bizCode === 10000) {
					this.orderList = this.formatOrder(data.entityList || []);
					const totalNum = data.totalNum || 0;
					this.pageCount = totalNum > 10 ? Math.ceil(totalNum / this.pageSize) : 1; // 少于十个直接显示，多余十个按五个分页显示
					this.pageIndex = data.pageNo || 0;
				}
			}).catch(e => {
				console.log(e);
				this.isLoading = false;
			});
		},
		formatOrder(orders) {
			orders.forEach(order => {
				order.showTime = dateFormat.format(order.createTime, 'DD/MM/YYYY') + '    ' + dateFormat.format(order.createTime, 'shortTime');
				order.showOrderType = orderTypeMap[order.orderType] + (order.combinationSize > 1 ? ` (x${order.combinationSize})` : '');

				order.showStatus = statusMap[order.winningStatus];
				order.showSelections = [];
				for (let i = 0; i < order.selections.length; i++) {
					if (i < 3) {
						order.showSelections.push({
							home: order.selections[i].home,
							away: order.selections[i].away
						});
					} else {
						break;
					}
				}
				if (order.selections.length === 4) {
					order.showSelections.push('and 1 other match');
				} else if (order.selections.length > 4) {
					order.showSelections.push(`and ${order.selections.length - 3} other matches`);
				}
				order.totalStake && (order.totalStake = formatNumber(order.totalStake, 2));
				order.totalWinnings && (order.totalWinnings = formatNumber(order.totalWinnings, 2));
			});
			return orders;
		},
		pageClickHandler (page) {
			this.getOrderList(page);
		},
		// type:settled  or unsettled
		switchSettleType (type) {
			this.changeSettleType(type);
			// 切换settled 类型时更新state中保存的一些数据
			this.resetPageData();
			this.getOrderList();
		},
		resetPageData() {
			this.pageIndex = 1;
			this.orderList = [];
			this.totalOrder = 0;
			this.pageCount = 0;
		},
		dateChange (start, end) {
			this.start = start;
			this.end = end;
			this.resetPageData();
			this.getOrderList();
		},
		resetDate () {
			this.start = '';
			this.end = '';
			this.resetPageData();
			this.getOrderList();
		},
	}
};
</script>

<style lang="less">
@import '../style/common.less';
</style>
