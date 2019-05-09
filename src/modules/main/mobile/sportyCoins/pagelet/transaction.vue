<template>
	<div class="coin-transaction">
		<navbar/>
		<div class="coin-tabs" v-if="isShowTab">
			<div class="coin-tab" @click="selectTab('coin')">SportyCoins<span v-if="currentTab === 'coin'" class="selected-bar"/></div>
			<div class="coin-tab" @click="selectTab('stake')">Real Money<span v-if="currentTab === 'stake'" class="selected-bar"/></div>
		</div>
		<div class="coin-pane" v-if="currentTab === 'coin'" v-loading="isLoading">
			<ul class="transaction-list" v-if="list && list.length > 0">
				<li class="transaction-item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
					<div class="transaction-ts">{{item.showTime}}</div>
					<div class="transaction-detail">
						<span class="prompt">{{item.prompt}}</span>
						<span :class="['value', {
							'yellow': [1,3].indexOf(item.status) > -1
							},{
								'green': item.status === 4
								}]">{{item.amountSign}} {{item.showAmount}}</span>
					</div>
					<div class="go-history" v-if="[2, 3, 11].indexOf(item.status) > -1">Bet History<i class="icon-right"/></div>
				</li>
			</ul>
			<div class="no-items" v-if="list && list.length === 0 && !isLoading">
				<div class="icon-wrap">
					<img class="icon-none" src="../image/icon-none.svg">
				</div>
				<p class="no-history-text">No records available</p>
			</div>
		</div>
		<div class="coin-pane" v-if="currentTab === 'stake'" v-loading="isLoading">
			<ul class="transaction-list" v-if="list && list.length > 0">
				<li class="transaction-item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
					<div class="transaction-detail">
						<div class="prompt">
							<div class="transaction-ts">{{item.showTime}}</div>
							<div class="go-history">Bet History<i class="icon-right"/></div>
						</div>
						<span class="value yellow">{{item.amountSign}} {{item.showAmount}}</span>
					</div>
				</li>
			</ul>
			<div class="no-items" v-if="list && list.length === 0 && !isLoading">
				<div class="icon-wrap">
					<img class="icon-none" src="../image/icon-none.svg">
				</div>
				<p class="no-history-text">No records available</p>
			</div>
		</div>
	</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import { pagePath } from 'config/pageConfig';
import 'components/loading';
import navbar from '../../../../common-wap/components/navbar';

export default {
	components: {
		navbar
	},
	data() {
		return {
			currentTab: '',
			list: [],
			isLoading: false,
			isShowTab: false,
		};
	},
	methods: {
		selectTab(tab) {
			this.currentTab = tab;
			this.getList();
		},
		getList() {
			this.isLoading = true;
			this.list = [];
			return fetch(`/pocket/v1/activity/sportycoins/records?activityId=${this.$route.params.id}&type=${this.currentTab === 'coin' ? 0 : 1}`).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					this.list = this.format(res.data || []);
				}
			}).catch(e => {
				this.isLoading = false;
				console.log(e);
			});
		},
		format(list) {
			list.forEach(item => {
				item.showTime = dateFormat.format(item.createTime, 'DD/MM/YY HH:mm');
				item.showAmount = formatNumber(item.amount / 10000, 2);
			});
			return list;
		},
		goDetail(item) {
			// stake类型、coin类型中的投注和返还可以跳订单详情
			if ([0, 2, 3, 5, 11].indexOf(item.status) > -1) {
				location.href = `${pagePath.openbet}/bet_history/detail/${item.orderId}`;
			}
		},
		fetchDetail() {
			fetch('/pocket/v1/activity/sportycoins/detail')
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const data = res.data;
					this.isShowTab = data.settleCoinsRequire > 0 && data.settleStakeRequire > 0;
				}
			});
		}

	},
	created() {
		console.log(this);
		this.currentTab = this.$route.query.tab || 'coin';
		this.getList();
		this.fetchDetail();
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.coin-transaction {
	.coin-tabs {
		padding: 0 56/@rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid @dimBlack;
		.coin-tab {
			position: relative;
			flex: 1 1 auto;
			font-size: 14/@rem;
			line-height: 58/@rem;
			color: @dark;
			font-weight: bold;
			text-align: center;
			.selected-bar {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 3/@rem;
				background-color: @green;
			}
		}
	}
	.transaction-list {
		list-style: none;
		.transaction-item {
			border-bottom: 1px solid @dimBlack;
			padding: 16/@rem;
			.transaction-ts {
				line-height: 14/@rem;
				font-size: 12/@rem;
				color: @darkGray;
			}
			.transaction-detail {
				margin-top: 5/@rem;
				display: flex;
				align-items: center;
				justify-content: center;
				.prompt {
					flex: 1 1 auto;
					font-size: 16/@rem;
					line-height: 20/@rem;
					color: @darker;
				}
				.value {
					font-size: 18/@rem;
					line-height: 20/@rem;
					color: @darker;
					white-space: nowrap;
					&.yellow {
						color: #cf7a25;
					}
					&.green {
						color: @green;
					}
				}
			}
			.go-history {
				margin-top: 8/@rem;
				font-size: 12/@rem;
				line-height: 12/@rem;
				color: @linkBlue;
				.icon-right {
					margin-left: 6/@rem;
					.m-icon-arrow--right();
					&::before {
						font-size: 12/@rem;
						color: @linkBlue;
					}
				}
			}
		}
	}

	.no-items {
		.icon-wrap {
			margin-top: 60/@rem;
			text-align: center;
			.icon-none {
				width: 36/@rem;
				height: 36/@rem;
			}
		}
		.no-history-text {
			margin-top: 14/@rem;
			font-size: 14/@rem;
			line-height: 16/@rem;
			color: @darkGray;
			text-align: center;
		}
	}
}
</style>
