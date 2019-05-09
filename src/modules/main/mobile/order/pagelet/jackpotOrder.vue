<template>
	<div>
		<topNavBar/>
		<div class="jackpot-order">
			<div class="tabs-wrapper">
			<!-- all ，settle，unsettle， cashout的tab -->
				<SettleNav class="settle-nav" :active="currentTab" @click="switchTab" :isDisabled="loading"></SettleNav>
			</div>
			<!-- 列表部分 -->
			<div class="m-scroll" v-loading:fetchData="loading">
				<div v-if="!loading">
					<!-- 无订单时显示 -->
					<noList v-if="hasNoList"></noList>
					<div v-else class="list-wrapper">
						<!-- 列表循环开始 -->
						<div v-for="item in orderList" :key="item.orderId">
							<!-- 日期与日期之间的长分割线 -->
							<div :class="{'wide':item.showDate}"></div>
							<!-- 年 -->
							<div class="year" v-if="item.year<new Date().getFullYear()&&item.showYear">{{item.year}}</div>
							<div class="ticket-list">
								<!-- 月、日 -->
								<div class="date">
									<div :class="{'hide':!item.showDate}" class="day">{{item.day}}</div>
									<div :class="{'hide':!item.showDate}" class="month">{{item.month}}</div>
								</div>
								<!-- 间隔 -->
								<div class="place"></div>
								<!-- 订单内容，点击进入详情 -->
								<div class="list" @click="toDetail(item)">
									<!-- 状态条，赢了为绿色，输了为灰色，其他为黑色 -->
									<div class="bar" :class="{'win':item.winningStatus==='Won','lost':item.winningStatus==='Lost'}">
										<!-- type都为sport 11 -->
										<span class="type">Sporty {{item.betType}}</span>
										<!-- pending前显示红色方块，赢了显示奖杯，都有向右箭头提示 -->
										<!-- 输赢状态，猜对的次数仅在lost时显示 -->
										<span class="status" :class="{'block':item.winningStatus==='Pending','cup':item.winningStatus==='Won'}">{{item.winningStatus}}
											<span v-if="item.winningStatus==='Lost'">({{item.correctEvents}} of {{item.betType}})</span>
											<i class="arrow"></i>
										</span>
									</div>
									<div class="title">
										<span>Total Stake({{showCurrencyOrigin}})</span>
										<span>Total Return</span>
									</div>
									<!-- 本金和收益，pending和running时收益显示二横杠 -->
									<div class="total">
										<span>{{item.totalStake}}</span>
										<span v-if="item.winningStatus==='Pending'||item.winningStatus==='Running'" style="margin-top:-5px">--</span>
										<span v-else>{{item.totalWinnings}}</span>
									</div>
									<div class="teams">Round No.{{item.periodNumber}}</div>
									<!-- pending时提示 -->
									<p class="pending-statement" v-if="item.winningStatus==='Pending'">The ticket is being reviewed by our staff. <br>Contact us if you need any help.</p>
									<!-- 条目分割线 -->
									<div class="narrow"></div>
								</div>
							</div>
						</div>
						<!-- 没有更多订单 -->
						<div class="nomore" v-if="showNoMoreRecord">No More Tickets</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 列表详情，显示时列表隐藏 -->
	</div>
</template>
<script>
import homeNav from 'components/homeNav';
import { mapState, mapMutations } from 'vuex';
import { formatNumber } from 'utils';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import topNavBar from 'components/navbar';
import { showCurrencyOrigin } from 'config/currencyConfig';

import { formatDate } from 'store/order/commonFun';
import SettleNav from './nav';
import noList from './nolist';
import { betType, winningStatus, monthData } from '../js/config';

let flag4Date = {},
	flag4Year = {};

export default {
	components: {
		homeNav,
		topNavBar,
		SettleNav,
		noList,
	},
	data () {
		return {
			hasScroll: false, // 页面是否垂直方向滚动过
			loading: false,
			pageSize: 20,
			currentTab: 0, // tabList的index
			orderList: [],
			totalOrder: 0,
			lastOrderNo: '',
			isAjax: false, // 是否正在进行ajax请求
			tabList: ['all', 'settled', 'unsettled'],
			showCurrencyOrigin
		};
	},
	computed: {
		// 控制statistics的显示
		...mapState('order', [
			'jp_showStatistics',
		]),
		hasMoreList () {
			const len = this.orderList.length || 0;
			return len > 0 && len < this.totalOrder;
		},
		hasNoList () {
			return !this.loading && this.orderList.length === 0;
		},
		// currentTab为0时settleType为10，为1时settleType为1，否则settleType为0
		settleType () {
			switch (+this.currentTab) {
			case 0:
				return 10;
			case 1:
				return 1;
			default:
				return 0;
			}
		},
		// 控制没有更多订单的显示
		showNoMoreRecord () {
			const len = this.orderList.length;
			return len > 20 && len >= this.totalOrder && this.hasScroll;
		}
	},
	created () {
		// 根据URL的isSettled参数，设置tab的停留位置
		const { isSettled } = this.$route.query;
		let settleType = 0;
		switch (+isSettled) {
		case 0:
			settleType = 2;
			break;
		case 1:
			settleType = 1;
			break;
		default:
			break;
		}
		this.switchTab(settleType);
	},
	destroyed() {
		document.querySelector('body').style.background = 'none';
	},
	mounted () {
		document.querySelector('body').style.background = '#fff';
		// 给列表部分添加滚动事件
		this.pageLoading(false);
		const wrapper = document.querySelector('.m-main-mid');
		const stickOnTopDom = document.querySelector('.settle-nav');
		const flag = document.querySelector('.tabs-wrapper');
		wrapper.addEventListener('scroll', e => {
			if (flag.getClientRects()[0] && flag.getClientRects()[0].top <= 0) {
				stickOnTopDom.addClass('fix-tabs');
			}
			if (flag.getClientRects()[0] && flag.getClientRects()[0].top > 0) {
				stickOnTopDom.removeClass('fix-tabs');
			}
			if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight) {
				this.hasScroll = true;
				if (this.hasMoreList && !this.isAjax) {
					this.isAjax = true;
					this.getOrderList().then(() => {
						this.isAjax = false;
					}).catch(() => {
						this.isAjax = false;
					});
				}
			}
		}, false);
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		toDetail(item) {
			this.$router.push({
				path: '/jackpot/detail',
				query: {
					id: item.orderId
				}
			});
		},
		// 点击tab，清空年月日和lastOrderNo，重新请求列表
		switchTab (type) {
			flag4Date = {};
			flag4Year = {};
			this.lastOrderNo = '';
			this.currentTab = type;
			this.fetchData();
		},
		fetchData () {
			this.loading = true;
			this.getOrderList().then(() => {
				this.hasScroll = false;
				this.loading = false;
			}).catch(() => {
				this.hasScroll = false;
				this.loading = -1;
			});
		},
		getOrderList () {
			const postData = {
				isSettled: this.settleType
			};
			postData.pageSize = this.pageSize;
			if (this.lastOrderNo) {
				postData.lastId = this.lastOrderNo;
			}
			return new Promise((resolve, reject) => {
				fetch('/orders/order/v2/jackpotlist', {
					method: 'GET',
					body: postData
				})
					.then(res => res.json())
					.then(data => {
						const originData = data.data;
						if (data.bizCode === 10000) {
							this.dealListResult(originData, postData);
							resolve(originData);
						} else {
							reject(false);
						}
					}).catch(() => {
						reject(false);
					});
			});
		},
		dealListResult (data, postData) {
			const list = data.orders;
			const totalOrder = data.totalNum || 0;
			const listCount = list.length;
			for (const item of list) {
				item.orderType = betType[item.bizType];
				item.winningStatus = winningStatus[item.winningStatus];
				item.date = formatDate(item.createTime);
				item.year = item.date.split('/')[2];
				item.month = monthData[item.date.split('/')[1]];
				item.day = item.date.split('/')[0];
				if (!flag4Date[item.date]) {
					flag4Date[item.date] = 1;
					item.showDate = true;
				} else {
					item.showDate = false;
				}
				if (!flag4Year[item.year]) {
					flag4Year[item.year] = 1;
					item.showYear = true;
				} else {
					item.showYear = false;
				}
				item.totalStake && (item.totalStake = formatNumber(item.totalStake, 2));
				item.totalWinnings && (item.totalWinnings = formatNumber(item.totalWinnings, 2));
			}
			if (!postData.lastId) {
				this.orderList = list;
			} else {
				this.orderList = [...this.orderList, ...list];
			}
			this.totalOrder = totalOrder;
			this.lastOrderNo = listCount ? list[listCount - 1].orderId : '';
		},

	},
};

</script>
<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";

.jackpot-order{
	.fix-tabs {
		position: fixed;
		top: 0;
		width: 100%;
		border-top: 1/@rem solid @fogGray;
	}
	.m-scroll {
		background: @white;
		// overflow: scroll;
		position: absolute;
		height: auto;
		top: 131 / @rem;
		height: auto;
		bottom: 0;
		left: 0;
		right: 0;
	  .list-wrapper {
		padding: 12/@rem;
		.wide {
		  border-top: 1/@rem solid #eaecef;
		  margin-top: -11/@rem;
		  padding-top: 11/@rem;
		}
		.year {
		  text-align: center;
		  margin-left: 20/@rem;
		  margin-top: 30/@rem;
		  margin-bottom: 12/@rem;
		  font-size: 14/@rem;
		}
		.ticket-list {
		  display: table-row;
		  .date {
			display: table-cell;
			color: #9ca0ab;
			.day {
			  font-size: 18/@rem;
			  font-weight: bold;
			}
			.month {
			  font-size: 12/@rem;
			}
			.hide {
			  visibility: hidden;
			}
		  }
		  .place {
			width: 45/@rem;
			display: table-cell;
		  }
		  .list {
			display: table-cell;
			padding-bottom: 10/@rem;
			width: 80%;
			.bar {
			  height: 24/@rem;
			  padding: 0 9/@rem;
			  display: flex;
			  justify-content: space-between;
			  box-sizing: border-box;
			  line-height: 24/@rem;
			  background: #1b1e25;
			  color: #fff;
			  font-weight: 500;
			  .type {
				font-size: 16/@rem;
			  }
			  .status {
				font-size: 14/@rem;
				.arrow {
				  .m-icon-arrow--right();
				  &::before {
					font-size: 10/@rem;
					padding-right: 5/@rem;
					position: relative;
					left: 8/@rem;
				  }
				}

			  }
			  .block:before {
					content: " ";
					display: inline-block;
					width: 12/@rem;
					height: 12/@rem;
					background: #e41827;
					margin-right: 10/@rem;
					vertical-align: middle;
					}
			  .cup {
					.m-icon-wincup();
					&::before {
						color: #fff;
						font-size: 16/@rem;
						display: inline-block;
						margin-right: 10/@rem;
						vertical-align: middle;
					}
				}
			}
			.win {
			  background: #0d9737;
			}
			.lost {
			  background: #9ca0ab;
			}
			.title {
			  padding-right: 9/@rem;
			  font-size: 11/@rem;
			  color: #9ca0ab;
			  display: flex;
			  justify-content: space-between;
			  margin-top: 9/@rem;
			}
			.total {
			  padding-right: 9/@rem;
			  font-size: 12/@rem;
			  font-weight: bold;
			  color: #353a45;
			  display: flex;
			  justify-content: space-between;
			  margin-bottom: 8/@rem;
			}
			.teams {
			  padding-right: 9/@rem;
			  width: 238/@rem;
			  overflow: hidden;
			  text-overflow: ellipsis;
			  white-space: nowrap;
			  font-size: 14/@rem;
			  color: #9ca0ab;
			}
			.pending-statement {
			  margin-bottom: 16/@rem;
			  font-size: 10/@rem;
			  color: #9ca0ab;
			}
			.narrow {
				margin-top: 9/@rem;
				border-bottom: 1/@rem solid #eaecef;
			}
		  }
		}
		.nomore {
			font-size: 10/@rem;
			text-align: center;
			color: #9ca0ab;
		}
	  }
	}
}
</style>
