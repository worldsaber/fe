<template>
	<div class="m-order">
		<Calendar
		@fetch="getTicketListByDate"
		v-show="showCalendar"
		@closeCalendar="showCalendar=false"
		@reset="resetTicketList"
		:viewMore="viewMore"
		:choosedDate="choosedDate"
		:settleType="settleType"/>

		<div v-show="!showCalendar">
			<topNavBar>
				<div slot="right" v-if="!isHistory">
					<div class="all-dates" @click="showCalendar=true">{{choosedDate?choosedDate:'All Dates'}}<span></span></div>
				</div>
			</topNavBar>
			<Banner :periodId="periodId" source="order" class="odds-boost-banner" v-if="isDuringClaim" @closed="closeBanner"/>
			<div class="tabs-wrapper" v-show="!isHistory">
				<!-- tab，包括all，settled，unsettle, cashout，并在cashout处插入new标签 -->
				<SettleNav class="m-order-select-nav" :active="settleType" @click="switchSettleType">
					<!-- <li class="m-nav-item" slot="append">
						<span>Cashout</span>
						<span v-if="cashoutCount" class="m-nav-item--desc">{{showCashoutCount}}</span>
					</li> -->
				</SettleNav>
			</div>
			<!-- 列表部分 -->
			<noList
			v-if="!isLoading&&ticketList.length===0"
			:settleType="settleType"
			:onlyWinnings="onlyWinnings"
			:toggleOnlyWin="toggleOnlyWin"
			:viewMore="viewMore"
			:choosedDate="choosedDate"/>

			<div v-else :class="['m-scroll','list-wrapper',{'show-history':isHistory},{'has-banner':isDuringClaim&&showBanner&&!isHistory},{'has-banner-history':isDuringClaim&&showBanner&&isHistory}]" v-loading:getTicketList="isLoading">
				<!-- 只显示赢的订单开关 -->
				<div class="only-win" v-if="(settleType===0||settleType===1)&&!isHistory">
					<span class="text">Show only winning tickets</span>
					<span :class="['outter',onlyWinnings?'on':'off']" @click="toggleOnlyWin"><span class="inner"></span></span>
				</div>
				<!-- 列表循环部分 -->
				<div v-for="(item, index) in ticketList" :key="item.orderId">
					<div :class="{'wide':item.showDate}" v-if="item.showDate"></div>
					<!-- 当前年份不显示，剩下的一年显示一次 -->
					<div class="year" v-if="item.year<new Date().getFullYear()&&item.showYear">{{item.year}}</div>
					<div class="ticket-list">
						<!-- 日期不重复显示 -->
						<div class="date">
							<div :class="{'hide':!item.showDate}" class="day">{{item.day}}</div>
							<div :class="{'hide':!item.showDate}" class="month">{{item.month}}</div>
						</div>
						<!-- 空格 -->
						<div class="place"></div>
						<!-- 列表单块，点击进入详情，并传递orderId和combinationSize -->
						<div :class="['list', {'no-border': ticketList[index + 1] && ticketList[index + 1].showDate}]" @click="showTDetail(item.orderId,item.combinationSize)">
							<!-- 状态条，赢为绿，输为灰，其他黑 -->
							<div class="bar" :class="{'win':item.winningStatus==='Won','lost':item.winningStatus==='Lost'}">
								<span class="type">{{item.orderType}}
									<!-- combinationSize大于1时在括号里显示具体数字 -->
									<span v-if="item.combinationSize>1">(x{{item.combinationSize}})</span>
								</span>
								<!-- pending时显示红方块，赢显示奖杯 -->
								<span :class="{'block':item.winningStatus==='Pending','cup':item.winningStatus==='Won'}" class="status">{{item.winningStatus}} <i class="arrow"></i></span>
							</div>
							<div class="title">
								<span>Total Stake({{currency}})</span>
								<span>Total Return</span>
							</div>
							<div class="total_info">
								<span>{{item.totalStake}}</span>
								<!-- 获奖金额在pending和running时显示双横杠，否则显示数值 -->
								<span v-if="item.winningStatus==='Pending'||item.winningStatus==='Running'" style="margin-top:-5px">--</span>
								<span v-else :class="{'green':item.winningStatus==='Won'||item.winningStatus==='Partial Win'}">{{item.totalWinnings}}</span>
							</div>
							<!-- odds boost -->
							<div class="order-boost" v-if="item.oddsBoosted">
								<img src="../image/market-boost.svg"  class="boost-icon" />
								Live Odds Boost
							</div>
							<!-- flexbet订单 -->
							<div class="flexibet-title" v-if="item.originOrderType === 4">
								<i>F</i>Flex Your Bet {{item.minToWin}}+ of {{item.selectionSize}}
							</div>
							<!-- 对阵最多显示3组，多余三组提示more -->
							<ul class="teams" v-for="(selection, i) in item.selections" :key="i">
								<li v-if="i<3">{{selection.home}} v {{selection.away}}</li>
								<li v-if="i===3">… (and {{item.selections.length-3}} other <span v-if="item.selections.length&&item.selections.length-3===1">match</span> <span v-else>matches</span>)</li>
							</ul>
							<!-- pending状态提示 -->
							<p class="pending-statement" v-if="item.winningStatus==='Pending'">Your ticket is being reviewed. Please wait patiently.</p>
							<!-- 短分割线 -->
							<div class="narrow"></div>
						</div>
					</div>
				</div>
				<!-- 无更多,在选择日期时、6个月以后订单时、unsettled订单时显示 -->
				<div class="nomore" v-if="showNoMoreRecord && (choosedDate || isHistory || settleType===2)">- No More Tickets -</div>
				<!-- 点击跳转6个月以前订单，没有数据显示空。在未选择日期、非6个月后订单、非unsettle订单显示-->
				<div class="view-more" v-if="!choosedDate && !isHistory && (settleType===0||settleType===1) && show6Mon">
					<p>Show only tickets in last 6 months</p>
					<p @click="viewMore">View older tickets<i class="icon"></i></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';
import * as mutationTypes from 'store/order/mutationTypes';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import topNavBar from 'components/navbar';
import Banner from 'components/oddsBoost/banner.vue';
import { LS } from 'storage/index';

// import { EventBus } from 'kernel/js/eventBus.js';
// import cashoutEvent from 'config/cashout/eventCfg';
// import cashoutCount from 'components/cashout/js/cashoutCountMixin';

import Calendar from './calendar';
import SettleNav from './nav';
import noList from './nolist';

export default {
	components: {
		SettleNav,
		noList,
		Calendar,
		topNavBar,
		Banner
	},
	// mixins: [
	// 	cashoutCount
	// ],
	data() {
		return {
			isAjax: false, // 是否正在进行ajax请求
			noData: false, // 列表是否为空
			showCalendar: false, // 是否显示日期筛选
			showDate: false,
			choosedDate: undefined, // 选择好日期后回到列表页显示的时间区间
			currency: window.currency,
			start: null,
			end: null,
			showBanner: LS.get('showBanner') !== 'false',
		};
	},
	computed: {
		...mapState('order', [
			'settleType',
			'totalOrder',
			'ticketList',
			'lastOrderNo',
			'flagForDate', // 用来判断日期是否重复
			'flagForYear', // 用来判断年份是否重复
			'bizCode',
			'isLoading',
			'onlyWinnings', // 是否只显示中奖订单
			'isHistory', // 是否6个月以前订单,
			'noMore' // showWinnings开关打开时，用来判断最后取到的数据是否为空
		]),
		...mapGetters('order', ['isSettled']),
		...mapState('oddsBoost', ['periodId']),
		...mapGetters('oddsBoost', ['isDuringClaim']),
		hasMoreList() {
			const len = this.ticketList.length;
			return len > 0 && len < this.totalOrder;
		},
		showNoMoreRecord() {
			const len = this.ticketList.length;
			return len > 10 && len >= this.totalOrder;
		},
		show6Mon() {
			const len = this.ticketList.length;
			return len >= this.totalOrder || (len > 0 && this.noMore);
		}
	},
	watch: {
		isLoading(val) {
			if (!val) {
				this.$nextTick(() => {
					this.isAjax = false;
				});
			}
		}
	},
	beforeRouteEnter(to, from, next) {
    // 从当前订单跳转6个月前订单再跳回时，更改isHistory为false，重新请求数据
		next(vm => {
			if (from.name === null && to.name === 'sixMonthsAgo') {
				vm.$router.push({ name: 'sports' });
			}
			if (to.name === 'sports' && from.name === 'sixMonthsAgo') {
				vm.hideHistory();
				vm.refreshData();
			}
			if (to.name === 'sixMonthsAgo' && from.name === 'sports') {
				vm.showHistory();
				vm.refreshData();
			}
		});
	},
	created() {
		// this.getCashoutCount();

		this.pageLoading(false); // 页面加载的loading
    // 根据URL的isSwttled参数控制tab激活
		const { isSettled } = this.$route.query;
		let settleType = 0;
		switch (Number(isSettled)) {
		case 0:
			settleType = 2;
			break;
		case 1:
			settleType = 1;
			break;
		default:
			break;
		}
		this.switchSettleType(settleType);
	},
  // 添加滚动
	destroyed() {
		document.querySelector('body').style.background = 'none';
	},
	mounted() {
		document.querySelector('body').style.background = '#fff';
		const scrollDom = document.querySelector('.m-main-mid');
		const stickOnTopDom = document.querySelector('.m-order-select-nav');
		const flag = document.querySelector('.tabs-wrapper');
		scrollDom.addEventListener('scroll', e => {
			if (!this.isHistory) {
				this.start = +new Date();
				if (flag.getBoundingClientRect() && flag.getBoundingClientRect().top <= 0 && (!this.end || this.start - this.end >= 100)) {
					stickOnTopDom.addClass('fix-tabs');
					this.end = +new Date();
				}
				if (flag.getBoundingClientRect() && flag.getBoundingClientRect().top > 0) {
					stickOnTopDom.removeClass('fix-tabs');
					return;
				}
			}
			if (this.isAjax) {
				return;
			}

			if (scrollDom.scrollTop + scrollDom.clientHeight >= scrollDom.scrollHeight) {
				if (this.hasMoreList) {
					this.isAjax = true;
					this.getTicketList();
				}
			}
		}, false);

		// EventBus.$on(cashoutEvent.REFRESH_CASHOUT_COUNT, val => {
		// 	this.cashoutCount = val;
		// });
	},
	methods: {
		closeBanner() {
			LS.set('showBanner', false);
			this.showBanner = false;
		},
    // 清空最后一个订单号、清空保存年份、月份对象，重新请求数据
		refreshData() {
			this.clearLastOrderNo();
			this.clearFlag4Date();
			this.clearFlag4Year();
			this.getTicketList();
		},
    // 更改isWinnings状态后重新获取数据
		toggleOnlyWin() {
			this.updateOnlyWinnings();
			this.refreshData();
		},
    // 跳转6个月以后订单页面，重新请求数据
		viewMore() {
			this.showHistory();
			this.$router.push({
				name: 'sixMonthsAgo'
			});
			this.closeOnlyWinnings();
			this.refreshData();
		},
    // 获取选择日期区间的列表
		getTicketListByDate(data) {
			this.choosedDate = `${data.from}~${data.to}`;
			this.reset();
			this.getTicketList();
			this.showCalendar = false;
		},
    // 清空选择日期后，重新请求列表，并清空头部日期区间
		resetTicketList() {
			this.choosedDate = undefined;
			this.getTicketList();
		},
    // 显示详情页，并传递参数
		showTDetail(orderId, comboSize) {
			this.$router.push({
				path: `/sport_bets/detail/${orderId}`,
				query: {
					combo_size: comboSize
				}
			});
		},
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		...mapMutations('order', {
			changeSettleType: mutationTypes.UPDATESETTLETYPE,
			updateList: mutationTypes.UPDATETICKETLIST,
			changeLastOrderNo: mutationTypes.UPDATELASTORDERNO,
			clearLastOrderNo: mutationTypes.CLEARLASTORDERNO,
			reset: mutationTypes.RESETSTATEDATA,
			clearFlag4Date: mutationTypes.CLEARFLAGFORDATE,
			clearFlag4Year: mutationTypes.CLEARFLAGFORYEAR,
			updateOnlyWinnings: mutationTypes.UPDATEONLYWINNINGS,
			closeOnlyWinnings: mutationTypes.CLOSEONLYWINNINGS,
			showHistory: mutationTypes.SHOWHISTORY,
			hideHistory: mutationTypes.HIDEHISTORY
		}),
		...mapActions('order', {
			getTicketList: 'fetchTicketList'
		}),
		switchSettleType(type) {
			this.changeSettleType(type);
			if (type === 3) {
				this.$router.push({
					path: '/sport_bets/cashout'
				});
				this.changeSettleType(type);
			} else {
        // tab为其他时清空日期、年份、lastorderNo，重新请求列表
				this.reset();
				this.refreshData();
			}
		}
	},
	// destoryed() {
	// 	if (this.showCashout) {
	// 		EventBus.$off(cashoutEvent.REFRESH_CASHOUT_COUNT);
	// 	}
	// }
};
</script>
<style lang="less">
@import "base/styles/variable.less";
.m-main-mid {
	overflow-x: hidden !important;
	overflow-y: auto !important;
}
.loading {
		position: fixed !important;
		top: 60% !important;
	}
.m-navbar {
  background-color: @fogGray !important;
  color: #515d79 !important;
  &-item {
    a {
      color: @dark !important;
    }
  }
  &-back {
    &::before {
      color: @dark !important;
    }
  }
  padding: 6 / @rem 10 / @rem !important;
}
</style>
<style lang="less" scoped>
@import "base/styles/variable.less";
@import "base/styles/icon.less";
@import "../style/mixin";
.m-order {

	.fix-tabs {
		position: fixed;
		top: 0;
		width: 100%;
		border-top: 1/@rem solid @fogGray;
	}
	.all-dates {
		border-left: 1px solid #9ca0ab;
		padding-left: 15 / @rem;
		font-size: 14 / @rem;
		text-align: center;
		color: #353a44;
		span {
			.m-icon-arrow-down2();
			&::before {
				font-size: 10 / @rem;
				padding-right: 15 / @rem;
				position: relative;
				left: 10 / @rem;
			}
		}
	  }

	.list-wrapper {
		padding: 12 / @rem;
	}
	.m-scroll {
		// position: absolute;
		height: auto;
		// top: 131 / @rem;
		height: auto;
		// bottom: 0;
		width: 93%;
		.only-win {
			height: 40/@rem;
			text-align: right;
			.text {
				margin-right: 9/@rem;
				color: #000;
				font-size: 12/@rem;
				vertical-align: super;
			}
			.outter, .inner {
				display: inline-block;
				border: 1/@rem solid @green;
			}
			.outter {
				width: 31/@rem;
				height: 20/@rem;
				line-height: 20/@rem;
				text-align: left;
				.inner {
					width: 16/@rem;
					height: 16/@rem;
					margin: 1/@rem 1/@rem 0 1/@rem;
					background: #fff;
				}
			}
			.off {
				background: @midGray;
			}
			.on {
				background: @lightGreen;
				text-align: right;
			}
		}
		.wide {
			// 避免rem计算误差修改
			border-top: 1/@rem solid #eaecef;
			margin-top: -10 / @rem;
			padding-top: 10 / @rem;
		}
		.year {
			text-align: center;
			margin-top: 30 / @rem;
			margin-bottom: 12 / @rem;
			font-size: 14 / @rem;
		}
		.ticket-list {
			display: table-row;
			.date {
				display: table-cell;
				color: #9ca0ab;
				.hide {
					visibility: hidden;
				}
				.day {
					font-size: 18 / @rem;
					font-weight: bold;
				}
				.month {
					font-size: 12 / @rem;
				}
			}
			.place {
				width: 30 / @rem;
				display: table-cell;
			}
			.list {
				display: table-cell;
				padding-bottom: 10 / @rem;
				width: 85%;
				&.no-border {
					border-width: 0px;
				}
				.bar {
					height: 24 / @rem;
					padding: 0 9 / @rem;
					display: flex;
					justify-content: space-between;
					box-sizing: border-box;
					line-height: 24 / @rem;
					background: #1b1e25;
					color: #fff;
					font-weight: 500;
					.type {
						font-size: 16 / @rem;
					}
					.block:before {
						content: "";
						display: inline-block;
						width: 12 / @rem;
						height: 12 / @rem;
						background: #e41827;
						margin-right: 5 / @rem;
						vertical-align: middle;
					}
					.cup {
						.m-icon-wincup();
						&::before {
							display: inline-block;
							color: #fff;
							font-size: 16 / @rem;
							margin-right: 5 / @rem;
						}
					}
					.status {
						font-size: 14 / @rem;
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
				}
				.win {
					background: #0d9737;
				}
				.lost {
					background: #9ca0ab;
				}
				.title {
					padding: 0 9 / @rem;
					font-size: 11 / @rem;
					color: #9ca0ab;
					display: flex;
					justify-content: space-between;
					margin-top: 9 / @rem;
				}
				.total_info {
					padding: 0 9 / @rem;
					font-weight: bold;
					color: #353a45;
					display: flex;
					justify-content: space-between;

					.green {
						color: #0d9737;
						font-size: 20 / @rem;
					}
				}
				.flexibet-title {
					padding: 0 9 / @rem;
					.flexibet();
				}
				.teams {
					li {
						padding: 0 9 / @rem;
						width: 238 / @rem;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 14 / @rem;
						color: #9ca0ab;
					}
				}
				.pending-statement {
					margin-top: 9 / @rem;
					margin-left: 9 / @rem;
					font-size: 10 / @rem;
					color: #9ca0ab;
				}
				.narrow {
					margin-top: 9 / @rem;
					border-bottom: 1 / @rem solid #eaecef;
				}
				.order-boost{
					line-height: 16/@rem;
					font-size: 10/@rem;
					padding-left: 9/@rem;
					color: #353a45;
					.boost-icon{
						width: 16/@rem;
						height: 11/@rem;
						margin-top: -3/@rem;
					}
				}
			}
		}
		.nomore {
			font-size: 10 / @rem;
			text-align: center;
			color: #9ca0ab;
		}
		.view-more {
			// height: 64/@rem;
			width: 100%;
			margin-left: -12/@rem;
			// margin-bottom: -12/@rem;
			background: @fogGray;
			text-align: center;
			padding-right: 29/@rem;
			p {
				padding-left: 40/@rem;
			}
			p:first-child {
				padding-top: 15/@rem;
				color: @darkGray;
			}
			p:last-child {
				padding-bottom: 15/@rem;
				color: @linkBlue;
				.icon {
					.m-icon-arrow--right();
					&:before {
						font-size: 12/@rem;
						margin-left:5/@rem;
					}
				}
			}
		}
	}
	.show-history {
		// top: 80/@rem;
	}
	.has-banner {
		// top: 183/@rem;
	}
	.has-banner-history {
		// top: 135/@rem;
	}
}
</style>
