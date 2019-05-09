<template>
	<div class="m-order">
		<Calendar
		class="m-calendar--order"
		@fetch="getTicketListByDate"
		v-show="showCalendar"
		@closeCalendar="showCalendar=false"
		@reset="resetTicketList"
		:viewMore="viewMore"
		:choosedDate="choosedDate"
		:settleType="settleType"/>

		<div v-show="!showCalendar">
			<div class="tabs-wrapper" v-show="!isHistory">
				<div class="m-l-left">
					<!-- tab，包括all，settled，unsettle, cashout，并在cashout处插入new标签 -->
					<SettleNav class="m-order-select-nav" :active="settleTypeIndex" @click="switchSettleType" :tabs="tabs" :isDisabled="isLoading"></SettleNav>
				</div>
				<div class="m-l-right all-dates" @click="showCalendar=true">
					<span class="m-txt">{{choosedDate?choosedDate:'All Dates'}}</span><span class="i-icon-more"></span>
				</div>
			</div>
			<!-- 列表部分 -->
			<noList
			v-if="!isLoading&&ticketList.length===0"
			:settleType="settleType"
			:onlyWinnings="onlyWinnings"
			:toggleOnlyWin="toggleOnlyWin"
			:viewMore="viewMore"
			:choosedDate="choosedDate"/>

			<div v-else class="m-scroll list-wrapper" v-loading:getTicketList="isLoading">
				<!-- 只显示赢的订单开关 -->
				<div class="only-win" v-if="(settleType !== 'Unsettled')&&!isHistory&&!lockWinFilter">
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
								<span>{{item.showTotalStake}}</span>
								<!-- 获奖金额在pending和running时显示双横杠，否则显示数值 -->
								<span v-if="item.winningStatus==='Pending'||item.winningStatus==='Running'" style="margin-top:-5px">--</span>
								<span v-else :class="{'green':item.winningStatus==='Won'||item.winningStatus==='Partial Win'}">{{item.showTotalWinnings}}</span>
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
				<div class="nomore" v-if="showNoMoreRecord && (choosedDate || isHistory || settleType === 'Unsettled')">- No More Tickets -</div>
				<!-- 点击跳转6个月以前订单，没有数据显示空。在未选择日期、非6个月后订单、非unsettle订单显示-->
				<div class="view-more" v-if="!choosedDate && !isHistory && (settleType !== 'Unsettled') && show6Mon && !isLoading">
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
import 'utils/class';
import 'components/login/popupLogin';
import { formatDateYear2 } from 'store/order/commonFun';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import Calendar from './calendar';
import SettleNav from './nav';
import noList from './nolist';

export default {
	components: {
		SettleNav,
		noList,
		Calendar
	},
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
			tabs: ['Settled', 'Unsettled', 'All'],
			lockWinFilter: false
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
			'noMore', // showWinnings开关打开时，用来判断最后取到的数据是否为空,
			'from',
			'to',
			'errorInfo'
		]),
		...mapGetters('order', ['isSettled']),
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
		},
		settleTypeIndex() {
			return this.tabs.indexOf(this.settleType);
		}
	},
	watch: {
		isLoading(val) {
			if (!val) {
				this.lockWinFilter = false;

				this.$nextTick(() => {
					this.isAjax = false;

					if (this.chgSettleType) {
						const wrapDom = document.querySelector('.m-main-mid--fix');
						if (wrapDom) {
							const orderWrapDom = wrapDom.querySelector('.m-bethistory'),
								paddingTop = orderWrapDom && window.getComputedStyle(orderWrapDom, null).getPropertyValue('padding-top') || 0,
								listWrapDom = wrapDom.querySelector('.m-scroll'),
								listPadTop = listWrapDom && window.getComputedStyle(listWrapDom, null).getPropertyValue('padding-top') || 0,
								 winHeight = document.documentElement.clientHeight || document.body.clientHeight;

							if (orderWrapDom.offsetHeight <= winHeight) {
								wrapDom.scrollTop = 0;
								EventBus.$emit('openbet-reset-scroll');
							} else {
								wrapDom.scrollTop = parseFloat(paddingTop) - parseFloat(listPadTop);
							}

							this.chgSettleType = false;
						}
					}
				});
			}
		},
		errorInfo(val) {
			const { type = '' } = val || {};

			if (type === 'login') {
				this.$dialog();
				this.$popupLogin.show();
			}
		},
		showCalendar(val, oldVal) {
			const scrollDom = document.querySelector('.m-main-mid');

			if (scrollDom && val) {
				scrollDom.addClass('m-con-fixed');
			}

			if (scrollDom && !val) {
				scrollDom.removeClass('m-con-fixed');

				this.$nextTick(() => {
					const wrapDom = document.querySelector('.m-main-mid--fix');
					if (wrapDom) {
						const orderWrapDom = wrapDom.querySelector('.m-bethistory'),
							paddingTop = orderWrapDom && window.getComputedStyle(orderWrapDom, null).getPropertyValue('padding-top') || 0,
							listWrapDom = wrapDom.querySelector('.m-scroll'),
							listPadTop = listWrapDom && window.getComputedStyle(listWrapDom, null).getPropertyValue('padding-top') || 0,
							 winHeight = document.documentElement.clientHeight || document.body.clientHeight;

						if (orderWrapDom.offsetHeight <= winHeight) {
							wrapDom.scrollTop = 0;
							EventBus.$emit('openbet-reset-scroll');
						} else {
							wrapDom.scrollTop = parseFloat(paddingTop) - parseFloat(listPadTop);
						}
					}
				});
			}
		},
		$route(val, oldVal) {
			if (val.name === 'sports' && oldVal.name === 'sixMonthsAgo') {
				this.hideHistory();
				this.refreshData();
			}
			if (val.name === 'sixMonthsAgo' && oldVal.name === 'sports') {
				this.showHistory();
				this.refreshData();
			}
		}
	},
	beforeRouteEnter(to, from, next) {
    // 从当前订单跳转6个月前订单再跳回时，更改isHistory为false，重新请求数据
		next(vm => {
			if (from.name === null && to.name === 'sixMonthsAgo') {
				vm.$router.push({ name: 'sports' });
			}
		});
	},
	created() {
		if (this.from && this.to) {
			this.choosedDate = `${formatDateYear2(this.from)}~${formatDateYear2(this.to)}`;
		}

		let isSettled = URL.getPara(location.href, 'isSettled') || 0;
		isSettled = +isSettled || 0;
		if (isSettled === 10) {
			this.changeSettleType(this.tabs[2]);
		}

		this.reset();
		this.refreshData();
	},
  // 添加滚动
	destroyed() {
		document.querySelector('body').style.background = 'none';

		const scrollDom = document.querySelector('.m-main-mid');
		scrollDom && scrollDom.removeEventListener('scroll', this.handleScroll);

		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	mounted() {
		document.querySelector('body').style.background = '#fff';
		const scrollDom = document.querySelector('.m-main-mid');
		scrollDom && scrollDom.addEventListener('scroll', this.handleScroll, false);

		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	methods: {
    // 清空最后一个订单号、清空保存年份、月份对象，重新请求数据
		refreshData() {
			this.clearLastOrderNo();
			this.clearFlag4Date();
			this.clearFlag4Year();
			this.resetNoMore();
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
			const scrollDom = document.querySelector('.m-main-mid');
			scrollDom && (scrollDom.scrollTop = 0);
			this.closeOnlyWinnings();
			this.refreshData();
		},
    // 获取选择日期区间的列表
		getTicketListByDate(data) {
			this.choosedDate = `${data.from}~${data.to}`;
			this.reset();
			this.resetNoMore();
			this.getTicketList();
			this.showCalendar = false;

			const wrapDom = document.querySelector('.m-main-mid--fix');
			if (wrapDom) {
				this.lockWinFilter = true;
				this.chgSettleType = true;
			}
		},
    // 清空选择日期后，重新请求列表，并清空头部日期区间
		resetTicketList() {
			this.choosedDate = undefined;
			this.resetNoMore();
			this.getTicketList();

			const wrapDom = document.querySelector('.m-main-mid--fix');
			if (wrapDom) {
				this.lockWinFilter = true;
				this.chgSettleType = true;
			}
		},
    // 显示详情页，并传递参数
		showTDetail(orderId, comboSize) {
			this.$router.push({
				name: 'sportsDetail',
				params: {
					id: orderId
				},
				query: {
					combo_size: comboSize
				}
			});
		},
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
			hideHistory: mutationTypes.HIDEHISTORY,
			resetNoMore: mutationTypes.UPDATENOMOREVAL
		}),
		...mapActions('order', {
			getTicketList: 'fetchTicketList'
		}),
		switchSettleType(type) {
			this.changeSettleType(this.tabs[type]);
			this.reset();
			this.refreshData();

			const wrapDom = document.querySelector('.m-main-mid--fix');
			if (wrapDom) {
				this.lockWinFilter = true;
				this.chgSettleType = true;
			}
		},
		handleScroll(e) {
			const scrollDom = document.querySelector('.m-main-mid');

			if (this.isAjax) {
				return;
			}

			if (scrollDom.scrollTop + scrollDom.clientHeight >= scrollDom.scrollHeight) {
				if (this.hasMoreList) {
					this.isAjax = true;
					this.getTicketList();
				}
			}
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.refreshData();
		}
	}
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
	.all-dates {
		font-size: 0;
		text-align: right;
		color: @dark;

		.m-txt {
			font-size: 12 / @rem;
			display: inline-block;
			vertical-align: middle;
			margin-right: 5/@rem;
		}

		.i-icon-more {
			display: inline-block;
			vertical-align: middle;

			.m-icon-arrow-down2();
			&::before {
				font-size: 10 / @rem;
				line-height: 1;
			}
		}
	  }

	.list-wrapper {
		padding: 12/ @rem 12 / @rem  0 12 / @rem;
		box-sizing: border-box;
	}
	.m-scroll {
		height: auto;
		height: auto;
		.only-win {
			height: 40/@rem;
			text-align: right;
			.text {
				margin-right: 9/@rem;
				color: @black;
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
			border-top: 1/@rem solid @fogGrayBorder;
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
				color: @darkGray;
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
					background: @blueBlack;
					color: @white;
					font-weight: 500;
					.type {
						font-size: 16 / @rem;
					}
					.block:before {
						content: "";
						display: inline-block;
						width: 12 / @rem;
						height: 12 / @rem;
						background: @red;
						margin-right: 5 / @rem;
						vertical-align: middle;
					}
					.cup {
						.m-icon-wincup();
						&::before {
							display: inline-block;
							color: @white;
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
					background: @green;
				}
				.lost {
					background: @darkGray;
				}
				.title {
					padding: 0 9 / @rem;
					font-size: 11 / @rem;
					color: @darkGray;
					display: flex;
					justify-content: space-between;
					margin-top: 9 / @rem;
				}
				.total_info {
					padding: 0 9 / @rem;
					font-weight: bold;
					color: @dark;
					display: flex;
					justify-content: space-between;

					.green {
						color: @green;
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
						color: @darkGray;
					}
				}
				.pending-statement {
					margin-top: 9 / @rem;
					margin-left: 9 / @rem;
					font-size: 10 / @rem;
					color: @darkGray;
				}
				.narrow {
					margin-top: 9 / @rem;
					border-bottom: 1 / @rem solid @dimBlack;
				}
				.order-boost{
					line-height: 16/@rem;
					font-size: 10/@rem;
					padding-left: 9/@rem;
					color: @dark;
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
			color: @darkGray;
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

	.tabs-wrapper {
		width: 100%;
		box-shadow: 0 2px 4px fadeout(@black, 95%);

		display: table;
		display: flex;
		display: grid;

		align-items: center;

		grid-template-columns: 1fr 120/@rem;

		.m-l-left,
		.m-l-right {
			display: table-cell;
			vertical-align: middle;
		}

		.m-l-left {
			flex: 1;
			min-width: 1%;
		}

		.m-l-right {
			width: 120/@rem;
		}
	}
}
</style>
