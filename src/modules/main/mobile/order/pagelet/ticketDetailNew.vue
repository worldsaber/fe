<template>
  	<div class="m-ticket-detail" v-loading:fetchTicketDetail="isLoading">
		<div v-if="!isLoading">
			<Notification type="info" :text="notifyContent" v-if="isPending"/>
			<!-- 头部黑框内的信息 -->
			<div class="ticket-top">
				<div class="seperate ticket-info">
					<span>Ticket ID: {{ticketDetail.shortId}}</span>
					<span>{{ticketDetail.date}}</span>
				</div>
				<div class="bar seperate">
					<span class="type">{{ticketDetail.orderType}}
						<!-- 组合数大于1时显示数量 -->
						<span v-if="comboSize>1">(x{{comboSize}})</span>
					</span>
					<!-- 状态为赢，显示奖杯和绿色 -->
					<span :class="{'green-color':isWon,'cup':isWon}" class="status" >{{ticketDetail.winningStatus}}</span>
				</div>
				<!-- flexbet订单 -->
				<div class="flexibet-title" v-if="ticketDetail.originOrderType === 4">
					<i>F</i>Flex Your Bet {{ticketDetail.minToWin}}+ of {{ticketDetail.selectionSize}}
				</div>
				<div class="seperate stake-info">
					<span>Total Stake{{ticketDetail.paymentType === 1 ? ' (SportyCoins)' : ''}}</span>
					<span>Total Return{{ticketDetail.paymentType === 1 ? ' (SportyCoins)' : ''}}</span>
				</div>
				<!-- 分割线在under-split里有内容时才显示 -->
				<div class="seperate stake-amount">
					<span>{{ticketDetail.showTotalStake}}</span>
					<!-- 状态为pending和running时，return为双横杠，否则显示实际金额，为赢时颜色为绿色 -->
					<span v-if="isPending || isRunning" style="color:#fff;margin-top:-5px">--</span>
					<span v-else :class="{'green-color':ticketDetail.totalWinnings!=='0.00'}">{{ticketDetail.totalWinnings}}</span>
				</div>
				<div class="sportcoins-tip" v-if="sportCoinsTip" @click="toSportyCoins"><div class="arrow-ele"/><p class="tip-text">{{sportCoinsTip}}</p><i class="icon-right"/></div>
				<!-- 第一条分割线以下的部分 -->
				<div class="under-split">
					<!-- 红包，bonus，potential win -->
					<div class="cash-info">
						<!-- 用一个节点去话线，当他是唯一节点的时候就代表这个模块不存在避免复杂的判断 -->
						<em></em>
						<div class="seperate" v-if="ticketDetail.favorAmount>0">
							<span class="left">{{ticketDetail.favorType}}</span>
							<span>-{{ticketDetail.showFavorAmount}}</span>
						</div>
						<!-- sportycoins 花费金额 -->
						<div class="seperate" v-if="ticketDetail.paymentType === 1 && sportyCoinsAmount">
							<span class="left">SportyCoins</span>
							<span>-{{sportyCoinsAmount}}</span>
						</div>
						<!-- unsettle时不为0显示 -->
						<div class="seperate" v-if="!isSettled && ticketDetail.totalBonus>0">
							<span class="left">Max. Bonus</span>
							<span>{{ticketDetail.showTotalBonus}}</span>
						</div>
						<!-- settle时不为0显示 -->
						<div class="seperate" v-if="isSettled && ticketDetail.bonusPrize > 0">
							<span class="left">Total Bonus</span>
							<span>{{ticketDetail.showBonusPrize}}</span>
						</div>
						<!-- system不显示，system的时候后台不传递 -->
						<div class="seperate" v-if="isShowTotalOdds">
							<span class="left">Total Odds</span>
							<span>{{ticketDetail.totalOdds}}</span>
						</div>
						<!-- settle以后不显示 -->
						<div class="seperate" v-if="!isSettled">
							<span class="left">Total Pot. Win</span>
							<span>{{ticketDetail.showPotentialWinnings}}</span>
						</div>
					</div>
					<!-- 用过了红包或者是flexibet就不能cashout提示，但是这2个提示只能出现一个，有优先级的问题,优先出flexibet的提示 -->
					<div class="unavailable" v-if="ticketDetail.originOrderType === 4">*Cashout unavailable for Flex your bet.</div>
					<div class="unavailable" v-else-if="+ticketDetail.favorAmount>0">* Cashout unavailable as Gifts has been used.</div>
					<!-- 当实际数据发送变化的时候出这个tip -->
					<div class="unavailable flexibet-tip" v-if="ticketDetail.originOrderType === 4 && ticketDetail.currentMinToWin > 0 && ticketDetail.currentSelectionSize > 0" @click="showFlexibetTip">* FlexiBet current selections: {{ticketDetail.currentMinToWin}} of {{ticketDetail.currentSelectionSize}}<i class="tip"></i></div>
					<!-- 该订单的cashout详情，默认收起，点击展开 -->
					<div class="cashout-wrapper" v-if="ticketDetail.cashOutAmount>0">
						<div class="cashout-title" @click="showDetail?showDetail=false:showDetail=true">
							<!-- 展开/收起的小三角 -->
							<span :class="{'unfold':showDetail,'fold':!showDetail}"></span>
							<span>Cashout Details</span>
						</div>
						<div class="cashout-detail" v-if="showDetail">
							<div class="seperate">
								<span class="left">Total Cashout</span>
								<span>{{ticketDetail.showCashOutAmount}}</span>
							</div>
							<div class="seperate">
								<!-- unsettle显示Total Remaining Stake，settle显示Total Used Stake，字段都是ticketDetail.remainStake -->
								<span class="left">
									<template v-if="!isSettled">
										Total Remaining Stake
									</template>
									<template v-else>Total Used Stake</template>
								</span>
								<span>
									<template v-if="!isSettled">
										{{ticketDetail.showRemainStake}}
									</template>
									<template v-else>{{ticketDetail.showUsedStake}}</template>
								</span>
							</div>
							<!-- settle以后不显示 -->
							<div class="seperate" v-if="!isSettled">
								<span class="left">Total Remaining Pot.Win </span>
								<span>{{ticketDetail.showRemainPotentialWinnings}}</span>
							</div>
						</div>
					</div>
				</div>

				<template v-if="!isAllSettled">
					<!-- 第二天分割线下的rebet -->
					<!-- shareCode码，应该是只有unsetted的订单有，后台在setted的订单不应该传递 -->
					<div class="rebet-wrapper seperate" v-if="ticketDetail.shareCode&&ticketDetail.isShowRebet">
						<span ref="copyShareCode" :data-clipboard-text="ticketDetail.shareCode">Booking Code: {{ticketDetail.shareCode}}<i class="copy">Copy</i></span>
						<span class="rebet-btn"><a @click="goToShare">Rebet</a></span>
					</div>
				</template>

				<template v-else-if="isWon">
					<div class="m-share">
						<div class="m-btn--share" @click="beginShare">Show Off</div>
					</div>
				</template>
			</div>
			<!-- 中部详情列表 -->
			<Selection class="ticket-detail-list" v-for="(item, index) in ticketDetail.selections" :key="index" :selection="item" :commentNum="commentNums[index]"/>
			<!-- 底部bets的数量 -->
			<div class="seperate bets-info" @click="toBetDetail">
				<span class="bets-num">Number of Bets: {{ticketDetail.betSize}}</span>
				<span class="to-bet-detail">Bet Details <i class="arrow"></i></span>
			</div>
			<div class="seperate bets-info to-trans" @click="toTransaction">
				<span class="bets-num">Check Transaction History</span>
				<i class="arrow"></i>
			</div>
			<div v-if="isSettled && !ticketDetail.isHistory" class="delete-bet" @click="deleteTicket">Delete Ticket</div>
		</div>

		<OrderShare
			v-if="showShare"
			:shareCfg="shareCfg"
			:orderId="orderId"
			:winnings="ticketDetail.totalWinnings"
			:percent="ticketDetail.percent"
			@close-share="hideShowPop" />
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import cookie from 'storage/cookie';
import 'components/login/popupLogin';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';

import { pagePath, baseUrl } from 'config/pageConfig';
import ClipboardJS from 'clipboard';
import OrderShare from 'components/share/orderShare';
import Notification from 'components/notification';
import { formatNumber } from 'utils/index';
import Selection from './selectionNew.vue';

export default {
	data () {
		return {
			showDetail: false,
			// 是否支持拷贝功能
			isHaveCopy: document.execCommand,
			showShare: false,
			country: window.country,
			commentNums: [], // 比赛的comment数量，顺序和详情中的selections相同
			orderId: this.$route.params.id,
			comboSize: 0,
			notifyContent: 'Your Ticket is under Grand Prize Auditing, audits usually take 24 hours or less to be processed. Thank you.',
		};
	},
	components: {
		Selection,
		Notification,
		OrderShare
	},
	watch: {
		ticketDetail (val) {
			if (val && val.orderId) {
				this.$nextTick(() => {
					if (this.clipboard) {
						this.clipboard.destroy();
					}
					if (this.$refs.copyShareCode) {
						this.clipboard = new ClipboardJS(this.$refs.copyShareCode);
						this.clipboard.on('success', e => {
							e.clearSelection();
							this.$toast('Successfully copied');
						});
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
		}
	},
	computed: {
		...mapState('order', [
			'ticketDetail',
			'isLoading',
			'errorInfo'
		]),
		isShowTotalOdds() {
			if (this.ticketDetail.orderType === 'Singles') return this.ticketDetail.totalOdds && this.comboSize === 1;
			return this.ticketDetail.totalOdds;
		},
		sportCoinsTip () {
			let tip = '';
			if (this.ticketDetail && this.ticketDetail.paymentType === 1) { // sportyCoins 订单
				if ([20, 30, 40].indexOf(this.ticketDetail.winningStatusCode) > -1) { // settled订单
					if (this.ticketDetail.winningStatusCode === 20) {
						tip = 'The winnings has been added to your "SportyCoins" account.';
					}
				} else { // unsetted
					tip = 'The winnings will be added to your "SportyCoins" account.';
				}
			}
			return tip;
		},
		shareCfg() {
			const tempUrl = `${location.origin}/${window.country}/m/share_win/${this.orderId}`;
			return {
				fb: {
					href: tempUrl
				},
				whatsapp: {
					shareUrl: tempUrl,
					shareText: window.shareTitle || 'Want to be the next Super Winner? Bet now!'
				},
				twitter: {
					url: tempUrl
				}
			};
		},
		isWon() {
			return this.ticketDetail.winningStatus === 'Won';
		},
		isLost() {
			return this.ticketDetail.winningStatus === 'Lost';
		},
		isPending() {
			return this.ticketDetail.winningStatus === 'Pending';
		},
		isRunning () {
			return this.ticketDetail.winningStatus === 'Running';
		},
		isSettled () {
			return this.isWon || this.isLost || this.ticketDetail.winningStatus === 'Void';
		},
		isAllSettled () {
			return this.ticketDetail.isAllSettled;
		},
		sportyCoinsAmount() {
			const detail = this.ticketDetail;
			const stake = parseFloat(detail.totalStake, 10);
			const gift = parseFloat(detail.favorAmount || 0, 10);
			const amount = stake - gift;

			if (amount >= 0) {
				return formatNumber(amount, 2);
			}
			return '';
		}

	},
	created () {
		this.loadData();
	},
	mounted() {
		document.querySelector('body').style.background = '#f2f3f5';
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destroyed() {
		document.querySelector('body').style.background = 'none';
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	beforeDestroy () {
		if (this.clipboard) {
			this.clipboard.destroy();
		}
	},
	methods: {
		toTransaction() {
			location.href = `${baseUrl}my_accounts/transactions/#search?keyword=${this.ticketDetail.shortId}`;
		},
		toSportyCoins() {
			location.href = `${baseUrl}my_accounts/sportycoins`;
		},
		...mapActions('order', [
			'fetchTicketDetail',
		]),
		deleteTicket() {
			this.$dialog({
				title: null,
				content: 'Are you sure you want to delete this ticket?',
				button: ['CANCEL', 'DELETE']
			}).onBtnClick(val => {
				if (val === 1) {
					fetch(`/orders/order/deleteOrder/${this.orderId}`, {
						method: 'POST'
					}).then(res => res.json()).then(res => {
						if (res.bizCode === 10000) {
							this.$toast('Successfully Deleted');
							this.$router.replace({
								name: 'sports'
							});
						} else {
							this.$toast('Failed to Delete');
						}
					});
				}
			});
		},
		// 获取评论
		fetchComment (eventIds) {
			fetch(`#/quanzi/lottery/eventEssentials.html?userToken=${cookie('accessToken')}&productId=${window.country.toUpperCase()}`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(eventIds)
			}).then(res => res.json()).then(res => {
				if (res.result === 100) {
					const resKeys = [];
					const commentNums = [];
					res.topics.forEach(topic => {
						resKeys.push(topic.eventId);
					});
					eventIds.forEach(id => {
						let num = res.topics[resKeys.indexOf(id)].commentsNum;
						num = num > 999 ? '999+' : num;
						commentNums.push(num);
					});
					this.commentNums = commentNums;
				}
			});
		},

		toBetDetail () {
			this.$router.push({
				name: 'betDetail',
				params: {
					id: this.orderId
				},
				query: {
					combo_size: this.comboSize,
					bet_size: this.ticketDetail.betSize
				}
			});
		},
		showFlexibetTip () {
			this.$alert('Because one or some of your selected matches are void, FlexiBet has removed relate selections and recalculated the odds.');
		},
		goToShare () {
			let shareUrl = '';
			if (this.ticketDetail.shareCode) {
				shareUrl = URL.addPara(pagePath.home, {
					shareCode: this.ticketDetail.shareCode
				});
			}
			location.href = shareUrl;
		},
		beginShare() {
			this.showShare = true;
		},
		hideShowPop() {
			this.showShare = false;
		},
		async loadData () {
    		// 获取详情
    		await this.fetchTicketDetail(this.orderId);

    		const ticketDetail = this.ticketDetail || {};

    		this.comboSize = ticketDetail.combinationSize || this.$route.query.combo_size;

    		const eventIds = [];
    		const selections = ticketDetail.selections || [];

    		selections.forEach(sel => {
    			eventIds.push(sel.eventId);
    		});
    		// 获取评论-- 详情页面用，在这里获取？提前加载？,并且批量获取所有详情的comment节约资源
    		await this.fetchComment(eventIds);
    	},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.loadData();
		}
	}
};
</script>
<style lang="less">
@import "base/styles/variable.less";

.m-ticket-detail {
	font-size: 12 / @rem;
	background: #fff;
	.seperate {
		display: flex;
		justify-content: space-between;
	}
}
</style>

<style lang="less" scoped>
@import "base/styles/variable.less";
@import "base/styles/icon.less";
@import "../style/mixin";
.m-ticket-detail {
	.ticket-top {
		padding: 12 / @rem 16 / @rem 17 / @rem;
		background-color: #1b1e25;
		color: #fff;
		.ticket-info {
			opacity: 0.5;
			color: #fff;
		}
		.green-color {
			color: #33ea6a;
		}
		.bar {
			font-size: 16 / @rem;

			.cup {
				.m-icon-wincup();
				&::before {
					color: #33ea6a;
					margin-right: 5 / @rem;
					display: inline-block;
				}
			}
		}
		.flexibet-title {
			.flexibet();
		}
		.sportcoins-tip {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 10/@rem;
			margin-bottom: 8/@rem;
			position: relative;
			padding: 12/@rem;
			background: #393c43;
			line-height: 14/@rem;
			font-size: 12/@rem;
			color: @white;
			.arrow-ele {
				position: absolute;
				top: -5/@rem;
				right: 16/@rem;
				width: 10/@rem;
				height: 10/@rem;
				background: #393c43;
				transform: rotate(45deg);
				transform-origin: center;
			}
			.tip-text {
				flex: 1 1 auto;
			}
			.icon-right {
				flex: 0 0 auto;
				.m-icon-arrow--right();
			}
		}
		.stake-info {
			opacity: 0.7;
			color: #fff;
		}
		.stake-amount {
			span:first-child {
				font-size: 16 / @rem;
				font-weight: 500;
			}
			span:last-child {
				font-size: 20 / @rem;
				font-weight: bold;
			}
		}
		.cash-info {
			margin-bottom: 11 / @rem;
			font-size: 14 / @rem;
			line-height: 1.57;
			em {
				padding-top: 10 / @rem;
				display: block;
				border-top: solid 1 / @rem #44484d;
				&:only-child {
					margin-bottom: 0px;
					padding-top: 0;
					border-top: 0px;
				}
			}
		}
		.unavailable {
			opacity: 0.5;
			font-size: 10 / @rem;
		}
		.flexibet-tip {
		font-size: 10 / @rem;
		.tip {
			.m-icon-tips();
				&:before {
					color: @midGray;
					font-size: 12 / @rem;
					padding-left: 5 / @rem;
				}
			}
		}
		.cashout-title {
			height: 28 / @rem;
			line-height: 28 / @rem;
			margin-bottom: 6 / @rem;
			background-color: rgba(234, 236, 239, 0.15);
			color: #eaecef;
			.fold {
				transform: rotate(270deg);
				display: inline-block;
				margin-top: -1px;
				position: relative;
				top: 1px;
				.unfold();
			}
			.unfold {
				.m-icon-arrow-down2();
				&::before {
				font-size: 10 / @rem;
				padding-right: 15 / @rem;
				position: relative;
				left: 10 / @rem;
				top: 2 / @rem;
				}
			}
		}
		.cashout-detail {
			font-size: 14 / @rem;
			line-height: 1.57;
		}
		.split {
			border-bottom: solid 1 / @rem #44484d;
			padding-bottom: 11 / @rem;
		}
		.left {
			opacity: 0.5;
		}
  	}
	.m-share {
		margin-left: -16 / @rem;
		margin-bottom: -17 / @rem;
		background: url("../image/shareBg.png") no-repeat left center;
		background-size: 73% auto;

		border-top: solid 1 / @rem #44484d;
		padding: 12 / @rem 0 16 / @rem;
		box-sizing: border-box;

		display: flex;
		align-items: center;
		justify-content: flex-end;

		.m-btn--share {
		width: 102 / @rem;
		height: 40 / @rem;
		line-height: 40 / @rem;
		border-radius: 2 / @rem;
		background-color: #f2af00;
		font-size: 14 / @rem;
		font-weight: bold;
		text-align: center;
		color: #1b1e25;
		}
	}
	.rebet-wrapper {
		border-top: 1px solid fade(@lightGray, 20%);
		padding: 12 / @rem 0px 0 / @rem;
		margin-top: 13 / @rem;
		span {
		white-space: nowrap;
		height: 40 / @rem;
		line-height: 40 / @rem;
		&:first-child {
			color: @midGray;
			font-size: 12 / @rem;
			.copy {
			padding-left: 14 / @rem;
			display: inline-block;
			color: @green;
			}
		}
		}
		.rebet-btn {
		width: 92 / @rem;
		flex: 0 0 auto;
		border-radius: 2px;
		background-color: @green;
		text-align: center;
		font-size: 14 / @rem;
		&:active {
			background-color: @midGreen;
		}
		a,
		a:hover,
		a:active,
		a:visited {
			text-decoration: none;
			color: @white;
		}
		}
	}
	.bets-info {
		padding: 18 / @rem 12 / @rem;
		border-top: 1/@rem solid @lightGray;
		border-bottom: 1/@rem solid @lightGray;
		.arrow {
			.m-icon-arrow--right();
				&::before {
					font-size: 10/@rem;
					padding-right: 5/@rem;
					position: relative;
					left: 8/@rem;
					color: @green;
				}
			}
	.bets-num {
		font-size: 14 / @rem;
		color: #353a45;
	}
	.to-bet-detail {
		font-size: 14 / @rem;
		color: #0d9737;
	}
	}
	.to-trans {
		border-top: 9/@rem solid @lightGray;
	}
	.delete-bet {
		height: 48/@rem;
		line-height: 48/@rem;
		text-align: center;
		border-top: 9/@rem solid @lightGray;
		border-bottom: 9/@rem solid @lightGray;
		color: @red;
		font-size: 14/@rem;
		background: @white;
	}
}
</style>
