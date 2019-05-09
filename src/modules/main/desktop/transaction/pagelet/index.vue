<template>
	<ULayout>
		<UNav :tabList="tabList" :active="0" @click="tabClick"></UNav>
		<template v-if="isLoaded">
			<TransactionList :dataList="dataList"></TransactionList>
			<div class="m-pwrap" v-if="pageCount > 1">
				<Pagination ref="paginate" :pageCount="pageCount" :clickHandler="pageClickHandler" :initialPage="pageNo" class="pagination"></Pagination>
			</div>
		</template>
		<UDesc style="margin-bottom:70px;">
			<ul>
				<li><em>1.</em>Closed — Your transaction is expired, please try again.</li>
				<li><em>2.</em>Pending —  Your transaction is waiting for the confirmation from SportyBet Staff. Please patiently wait for the confirmation. </li>
				<li><em>3.</em>Failed — Your transaction is failed for some reasons. Please contact SportyBet customer service for more information. </li>
			</ul>
		</UDesc>
	</ULayout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import { formatNumber } from 'utils';
import Pagination from 'components/pagination/pagination';
import ULayout from 'components/userCenter/layout';
import UNav from 'components/userCenter/nav';
import UDesc from 'components/userCenter/description';
import { getTypeWithSub } from 'transaction/tool';
import TransactionList from './list';
import { bizTypeMap, statusMap, typeList, types, pendingMap } from '../js/config';

import '../../mockData/transaction/index?debug';

export default {
	name: 'transaction',
	components: {
		ULayout,
		UNav,
		UDesc,
		TransactionList,
		Pagination
	},
	created () {
		this.getList();
	},
	computed: {
		...mapState('userCenter', {
			mobile: 'phone'
		}),
	},
	data () {
		return {
			bizTypeMap,
			statusMap,
			typeList,
			currentTab: 0,
			dataList: [],
			pageCount: 0,
			isLoaded: false,
			pageNo: 1,
			tabList: types,
		};
	},
	methods: {
		...mapActions('userCenter', [
			'getBalance'
		]),
		tabClick (val) {
			this.currentTab = this.typeList[val].value || '';
			this.pageNo = 1;
			// this.$refs.paginate._data.selected = 0;
			this.getList();
			// tab点击触发余额更新，防止pending状态的订单变化导致余额未更新
			this.getBalance();
		},
		getList () {
			// console.log('tab:' + this.currentTab + 'pageNo:' + this.pageNo);
			fetch('/pocket/v1/statements', {
				method: 'GET',
				body: {
					type: this.currentTab,
					pageSize: 20,
					pageNo: this.pageNo,
				}
			}).then(res => res.json())
			.then(data => {
				this.isLoaded = true;

				// 未登录
				if (data.login === false) {
					this.$dialog();
					window.login({ activeTab: 'Log In' });
					return;
				}

				const code = data.bizCode;
				if (code === 10000) {
					this.formatDataList(data.data);
				}
			}).catch(() => {
				this.isLoaded = true;
			});
		},
		// 分页点击事件
		pageClickHandler (pageNo) {
			this.pageNo = pageNo;
			this.getList();
		},
		// 格式化部分数据
		formatDataList (data) {
			const list = data.statements || [];
			const len = list.length;
			for (let i = 0; i < len; i++) {
				const createTime = list[i].createTime;
				list[i].showDate = dateFormat.format(createTime, 'DD/MM/YYYY');
				list[i].date = dateFormat.format(createTime, 'DD/MM');
				list[i].showTime = dateFormat.format(createTime, 'HH:mm');
				list[i].time = dateFormat.format(createTime, 'HH:mm:ss');
				list[i].type = this.getType(list[i]);
				list[i].mobile = this.mobile;
				// 如果是取现则显示 总金额 - 手续费
				if (list[i].tradeCode === 'WD0001' || list[i].tradeCode === 'WD0004') {
					list[i].amountStr = formatNumber((list[i].amount - list[i].feeAmount) / 10000, 2) || '';
					list[i].feeStr = formatNumber(list[i].feeAmount / 10000, 2);
				} else {
					list[i].amountStr = formatNumber(list[i].amount / 10000, 2) || '';
				}
				list[i].statusStr = this.statusMap[list[i].status] || '- - -';
				if (list[i].status === 10 && list[i].auditStatus) {
					list[i].statusStr = pendingMap[list[i].auditStatus] || list[i].statusStr;
				}
				// 线下派奖，balance 显示 - - -
				if (list[i].tradeCode === 'CB0003') {
					list[i].afterBalStr = '- - -';
				} else	if (list[i].status !== 10 && list[i].afterBal !== undefined) {
					list[i].afterBalStr = formatNumber(list[i].afterBal / 10000, 2);
				}
			}
			this.dataList = list;
			this.pageCount = Math.ceil((data.totalNum || 0) / 20);
		},
		getType (obj) {
			return getTypeWithSub(obj);
		}
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.getList();
			}
		});
	}
};
</script>

<style lang="less">
	.m-pwrap{
		padding:24px 0;
	}
</style>
