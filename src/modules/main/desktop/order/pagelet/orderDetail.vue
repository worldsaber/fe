<template lang="html">
	<div class="m-order-wrapper">
		<div class="m-order-detail-wrap">
			<div class="back-wrap">
				<div class="back-btn" @click="goBack">
					<i class="icon-back"/>
					<span>Back</span>
				</div>
				<div class="blank-block"/>
				<div v-if="isSettled && !orderInfo.isHistory" class="delete-btn" @click="deleteOrder">Delete</div>
			</div>
			<div class="title-wrap">
				<span class="title">Ticket Details (ID:{{orderInfo.shortId}})</span>
				<i class="icon-print" v-if="false"/>
				<span @click="printDetail" v-if="false" class="print">Print</span>
				<i v-if="false" class="icon-share"/>
				<span v-if="false" class="share">Share</span>
			</div>
			<div class="timestamp">{{orderInfo.showTime}}
				<em class="flexibet-title" v-if="orderInfo.orderType === 4">
					<i>F</i>Flex Your Bet {{orderInfo.minToWin}}+ of {{orderInfo.selectionSize}}
				</em>
			</div>
			<div :class="'status-bar ' + orderInfo.showColor">
				<span class="m-order-type">{{orderInfo.showOrderType}}</span>
				<i class="m-order-icon win" v-if="orderInfo.winningStatus === 20"/>
				<span class="m-order-icon pending" v-if="orderInfo.winningStatus === 90"/>
				<span class="m-order-status">{{orderInfo.showStatus}}</span>
			</div>
			<div :class="['stake-wrap', {'stake-wrap-fix': orderInfo.showPaymentType}]">
				<div class="cell cash" v-if="+orderInfo.favorAmount > 0">
					<div class="label">{{orderInfo.showFavorType}}</div>
					<div class="value">{{'- ' + orderInfo.showFavorAmount}}</div>
				</div>
				<div class="cell bonus" v-if="orderInfo.winningStatus!==20&&orderInfo.winningStatus!==30&&(+orderInfo.totalBonus > 0)">
					<div class="label">Max.Bonus</div>
					<div class="value">{{orderInfo.showTotalBonus}}</div>
				</div>
				<div class="cell bonus" v-if="(orderInfo.winningStatus===20 || orderInfo.winningStatus===30)&&(+orderInfo.bonusPrize > 0)">
					<div class="label">Total Bonus</div>
					<div class="value">{{orderInfo.showBonusPrize}}</div>
				</div>
				<!-- totalOdds -->
				<div class="cell pot-win" v-if="orderInfo.totalOdds">
					<div class="label">Total Odds</div>
					<div class="value">{{orderInfo.totalOdds}}</div>
				</div>
				<div class="cell pot-win" v-if="orderInfo.winningStatus!==20&&orderInfo.winningStatus!==30">
					<div class="label">Total Pot.Win</div>
					<div class="value">{{orderInfo.showPotentialWinnings}}</div>
				</div>
				<div class="cell total-stake">
					<div class="label">Total Stake{{orderInfo.showPaymentType ? `(${orderInfo.showPaymentType})` : ''}}</div>
					<div class="value">{{orderInfo.showTotalStake}}</div>
				</div>
				<div class="cell total-return">
					<div class="label">Total Return{{orderInfo.showPaymentType ? `(${orderInfo.showPaymentType})` : ''}}</div>
					<div class="value" v-if="orderInfo.winningStatus===0||orderInfo.winningStatus===90">--</div>
					<div :class="(orderInfo.winningStatus===5||orderInfo.winningStatus===20 ? 'green' : '') + ' value'" v-else>{{orderInfo.showTotalWinnings}}</div>
				</div>
			</div>
			<!-- 使用红包不能cashout，但是flexibet的订单直接提示flexbet不能cashout -->
			<p class="cashout-rule" v-if="orderInfo.orderType !== 4 && +orderInfo.favorAmount > 0">*Cashout unavailable as Gifts have been used.</p>
			<div class="rebet-wrap">
				<div v-if="orderInfo.shareCode" class="left">
					<af-button class="rebet-btn" @click="goShareCode">Rebet</af-button>
					Booking Code: {{orderInfo.shareCode}}
				</div>
				<div class="right">
					<div class="tip" v-if="orderInfo.orderType === 4">*Cashout unavailable for Flex your bet.</div>
					<div class="tip" v-if="orderInfo.orderType === 4 && orderInfo.currentSelectionSize > 0 &&  orderInfo.currentMinToWin > 0">*FlexiBet current selections: {{orderInfo.currentMinToWin}} of {{orderInfo.currentSelectionSize}}
						<i class="icon-tip">
							<PopOver
								position="bottom"
								:isCenter="true"
								:arrowCenter="true">
								<p>Because one or some of your selected<br> matches are void, FlexiBet has removed<br> relate selections and recalculated the odds.</p>
							</PopOver>
						</i></div>
				</div>
			</div>
			<div class="triangle left"/>
			<div class="triangle right"/>
		</div>
		<div class="m-order-detail-wrap list">
			<div class="selection-detail-wrap" v-for="(selection,i) in orderInfo.selections">
				<div class="selection-num">{{i + 1}}</div>
				<div class="selection-detail">
					<div class="selection-header">
						<i class="live-icon" v-if="selection.eventStatus === 1 || selection.eventStatus === 2">Live</i>
						<span class="game-timestamp">{{selection.showTime}}</span>
						<span class="game-id" v-if="selection.gameId">Game ID: {{selection.gameId}}</span>
						<span class="game-live-tracker" v-if="(selection.eventStatus===3 || selection.eventStatus===4) && isSupportLmts(selection.sportId)" @click="goTracker(selection.eventId)">Check liveTracker ></span>
						<!-- 分析换成tracker -->
						<div class="go-live-betting" v-if="isShowLive(selection)" @click="goLiveBetting(selection.eventId, selection.specifier)">
							Go to Live Betting<i class="arrow-right"/>
						</div>
						<span :class="{'selection-status': true, running:selection.status === 0}" v-if="selection.status!==1">{{selection.showStatus}}</span>
						<i class="selection-status checked" v-else/>
					</div>
					<div class="selection-body">
						<div class="team-wrap">
							<p class="team-label home">{{selection.home}}</p>
							<p class="team-label">{{selection.away}}</p>
						</div>
						<div class="score-wrap">
							<template v-if="selection.setScore">
								<div class="score-pairs">
									<div class="home-score main">{{selection.showSetScore[0]}}</div>
									<div class="away-score main">{{selection.showSetScore[1]}}</div>
								</div>
								<div class="score-pairs" v-if="isTwoColumnScore(selection.sportId) && isEventLive(selection.eventStatus)">
									<div class="home-score">{{selection.showGameScore[0]}}</div>
									<div class="away-score">{{selection.showGameScore[1]}}</div>
								</div>
								<div class="score-pairs" v-if="isTreeColumnScore(selection.sportId) && isEventLive(selection.eventStatus)">
									<div class="home-score">{{selection.showPointScore[0]}}</div>
									<div class="away-score">{{selection.showPointScore[1]}}</div>
								</div>
							</template>
							<span v-else class="no-score">--</span>
						</div>
						<div class="banker-wrap" v-if="selection.banker">
							<i class="banker-icon">B</i>
						</div>
						<div class="outcome-wrap">
							<div class="outcome-row">
								<span class="outcome-label">Pick</span>
								<p class="outcome-value">{{selection.showPick}}</p>
							</div>
							<div class="outcome-row">
								<span class="outcome-label">Market</span>
								<p class="outcome-value">{{selection.marketDesc}}</p>
							</div>
							<div class="outcome-row">
								<span class="outcome-label">Result</span>
								<p class="outcome-value">{{selection.correctOutcome ? selection.correctOutcome : '--'}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bet-number-wrap">
				<span class="bet-number">Number of Bets: {{orderInfo.betSize}}</span>
				<span @click="goBetDetail" class="bet-detail">Check Bet Details</span>
				<i @click="goBetDetail" class="bet-detail-icon"/>
			</div>
			<div v-if="(+orderInfo.cashOutAmount) > 0" class="triangle left"/>
			<div v-if="(+orderInfo.cashOutAmount) > 0" class="triangle right"/>
		</div>
		<div v-if="(+orderInfo.cashOutAmount) > 0" class="m-order-detail-wrap cashout">
			<h1 class="cashout-detail">Cashout Detail</h1>
			<div class="cashout-detail-wrap">
				<div class="total-cashout">
					<div class="label">Total Cashout</div>
					<div class="value">{{orderInfo.showCashOutAmount}}</div>
				</div>
				<template v-if="orderInfo.winningStatus!==20&&orderInfo.winningStatus!==30">
					<div class="remain-stake">
						<div class="label">Total Remaining Stake</div>
						<div class="value">{{orderInfo.showRemainStake}}</div>
					</div>
					<div class="pot-win">
						<div class="label">Total Remaining Pot.Win</div>
						<div class="value">{{orderInfo.showRemainPotentialWinnings}}</div>
					</div>
				</template>
				<template v-else>
					<div class="pot-win">
						<div class="label">Total Used Stake</div>
						<div class="value">{{orderInfo.showUsedStake}}</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import 'utils/dom';
import { formatNumber } from 'utils';
import dateFormat from 'kernel/js/dateFormat.js';
import { getScheduleDesc } from 'base/js/utils.js';
import { sportConfigLowerCase } from 'config/sportsType';
import { baseUrl, pagePath } from 'config/pageConfig';
import { payText } from 'config/payConfig';
import 'components/popOver';
import betDetailList from './betDetailList.vue';
// 分析统计弹窗的入口
import brigge from './bridge.vue';
import { colorMap, orderTypeMap, statusMap, favorType, status } from './config.js';

export default {
	props: {
		betId: {
			type: String,
		}
	},
	data() {
		return {
			orderInfo: {},
			showStatistics: false,
			currentEventId: ''
		};
	},
	created() {
		this.fetchDetail();
	},
	computed: {
		isSettled() {
			return this.orderInfo && [20, 30, 40].indexOf(this.orderInfo.winningStatus) > -1;
		}
	},
	methods: {
		isShowLive(selection) {
			const isOn = (selection.eventStatus === 1 || selection.eventStatus === 2);
			const isCricket = selection.sportId === 'sr:sport:21'; // Cricket放开haveLive
			return isOn && (selection.haveLive || isCricket);
		},
		isTwoColumnScore(sportId) {
			const id = sportId.slice(9);
			return ['5', '23', '34'].includes(id); //  Tennis, 'Volleyball', 'Beach Volley'
		},
		isTreeColumnScore(sportId) {
			const id = sportId.slice(9);
			return ['5'].includes(id); // Tennis
		},
		isEventLive(status) {
			return [1, 2].includes(status);
		},
		goBack() {
			// this.$router.push({
			// 	path: '/sport_bets'
			// });
			window.history.go(-1);
		},
		deleteOrder() {
			this.$dialog({
				title: '',
				width: 400,
				content: 'Are you sure you want to delete this ticket?',
				button: ['CANCEL', 'DELETE']
			}).onBtnClick(val => {
				if (val === 1) {
					const orderId = this.$router.currentRoute.params.id;
					fetch(`/orders/order/deleteOrder/${orderId}`, {
						method: 'POST'
					}).then(res => res.json()).then(res => {
						if (res.bizCode === 10000) {
							this.$dialog({
								title: '',
								width: 400,
								content: 'Successfully Deleted',
								button: ['OK']
							}).onClose(() => {
								this.$router.replace({
									path: '/sport_bets'
								});
							});
						} else {
							this.$dialog({
								title: '',
								width: 400,
								content: 'Failed to Delete',
								button: ['OK']
							});
						}
					});
				}
			});
		},
		fetchDetail() {
			const orderId = this.$router.currentRoute.params.id;

			fetch(`/orders/order/realsports/ticketDetail?orderId=${orderId}`, {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					this.orderInfo = this.format(data);
				}
			}).catch(e => {
				console.log(e);
			});
		},
		getShowTime(selection) {
			if (selection.eventStatus !== 1 && selection.eventStatus !== 2) { // 赛前或赛后
				return dateFormat.format(selection.startTime, 'DD/MM') + '    ' + dateFormat.format(selection.startTime, 'shortTime');
			}
			return getScheduleDesc(selection, selection.sportId.slice(9));
		},
		format(orderInfo) {
			orderInfo.showTime = dateFormat.format(orderInfo.createTime, 'DD/MM/YYYY') + '    ' + dateFormat.format(orderInfo.createTime, 'shortTime');
			orderInfo.showOrderType = orderTypeMap[orderInfo.orderType] + (orderInfo.combinationSize > 1 ? ` (x${orderInfo.combinationSize})` : '');

			orderInfo.showFavorAmount = formatNumber(orderInfo.favorAmount, 2);
			orderInfo.showTotalBonus = formatNumber(orderInfo.totalBonus, 2);
			orderInfo.showBonusPrize = formatNumber(orderInfo.bonusPrize, 2);
			orderInfo.showPotentialWinnings = formatNumber(orderInfo.potentialWinnings, 2);
			orderInfo.showTotalStake = formatNumber(orderInfo.totalStake, 2);
			orderInfo.showUsedStake = formatNumber(orderInfo.usedStake, 2);
			orderInfo.showTotalWinnings = formatNumber(orderInfo.totalWinnings, 2);
			orderInfo.showCashOutAmount = formatNumber(orderInfo.cashOutAmount, 2);
			orderInfo.showRemainStake = formatNumber(orderInfo.remainStake, 2);
			orderInfo.showRemainPotentialWinnings = formatNumber(orderInfo.remainPotentialWinnings, 2);

			orderInfo.paymentType && (orderInfo.showPaymentType = payText(orderInfo.paymentType));

			orderInfo.showStatus = statusMap[orderInfo.winningStatus];
			orderInfo.showColor = colorMap[orderInfo.winningStatus];
			orderInfo.selections.forEach(selection => {
				selection.showTime = this.getShowTime(selection);
				selection.showPick = selection.outcomeDesc + ' @' + selection.odds;
				selection.showSetScore = selection.setScore ? selection.setScore.split(':') : ['', ''];
				selection.showGameScore = selection.gameScore ? selection.gameScore[selection.gameScore.length - 1].split(':') : ['', ''];
				selection.showPointScore = selection.pointScore ? selection.pointScore.split(':') : ['', ''];
				selection.showStatus = status[selection.status];
			});
			orderInfo.showFavorType = orderInfo.favorType ? favorType[orderInfo.favorType] : '';

			return orderInfo;
		},
		goTracker (id) {
			this.disableScroll();
			const d = this.$dialog({
				css: 'tracker',
				title: '',
				content: brigge,
				contentData: {
					eventId: id
				},
				button: []
			});
			d.onClosed(() => {
				this.enableScroll();
			});
		},
		// 是否支持matchTracker
		isSupportLmts (sportId) {
			return ['sr:sport:1', 'sr:sport:2', 'sr:sport:5'].indexOf(sportId) > -1;
		},
		// sharecode跳转到首页
		goShareCode () {
			if (this.orderInfo.shareCode) {
				window.location.href = URL.addPara(pagePath.home, {
					shareCode: this.orderInfo.shareCode
				});
			}
		},
		disableScroll() {
			this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			document.body.style.cssText += 'position:fixed;top:-' + this.scrollTop + 'px;width:100%;';
		},
		enableScroll() {
			const body = document.body;
			body.style.top = '';
			body.style.width = '';
			body.style.position = '';

			document.body.scrollTop = document.documentElement.scrollTop = parseInt(this.scrollTop, 10);
		},
		goLiveBetting(eventId, specifier) {
			if (!specifier) {
				specifier = 'null';
			}
			fetch('factsCenter/simpleEvent', {
				method: 'GET',
				body: {
					eventId, marketId: 0, specifier
				}
			}).then(res => res.json()).then(data => {
				if (data.bizCode === 10000) {
					const categoryId = data.data.sport.category.id;
					const tournamentId = data.data.sport.category.tournament.id;
					const sportId = data.data.sport.id.slice(9);
					location.href = `${baseUrl}sport/${sportConfigLowerCase[sportId]}/live/${tournamentId}/${categoryId}/${eventId}`;
				}
			});
		},
		goBetDetail() {
			const orderId = this.$router.currentRoute.params.id;
			this.$dialog({
				title: 'Bet Details',
				css: 'bet-detail',
				content: betDetailList,
				contentData: {
					orderId,
					betSize: this.orderInfo.betSize,
					comboSize: +this.orderInfo.combinationSize,
					potentialWinnings: +this.orderInfo.potentialWinnings,
					cashoutHistory: this.orderInfo.cashOutHistory || []
				},
				button: []
			});
		},
		printDetail(e) {
			const curList = e.target.closest('.m-order-list');
			const body = document.querySelectorAll('body');
			body.addClass('m-print-betList');
			curList.addClass('m-print-betDetail');
			window.print();
			curList.removeClass('m-print-betDetail');
			body.removeClass('m-print-betList');
		}
	}
};
</script>

<style lang="less" scoped>
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@import '../style/mixin.less';
@import '../style/common.less';

.m-order-wrapper {
	.af-button--primary {
		background: @green !important;
		color: @white !important;
		border: 0px;
		&:hover {
			background: @midGreen !important;
		}

		&:active {
			background: @lightGreen !important;
		}
	}

	.is-disabled,
	.is-disabled:hover,
	.is-disabled:active {
		background: @midGray !important;
		color: @darkGray !important;
	}

	.m-order-detail-wrap {
		position: relative;
		background-color: @white;
		margin-bottom: 3px;
		padding: 22px 20px 14px 20px;
		.title-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			//margin-top: 22px;
			margin-bottom: 12px;

			.title {
				flex: 1 1 auto;
				font-size: 14px;
				line-height: 19px;
				font-weight: bold;
			}
			.icon-print {
				flex: 0 0 auto;
				.m-icon-print();
				margin-right: 7px;
			}
			.print {
				flex: 0 0 auto;
				font-size: 12px;
				margin-right: 16px;
			}
			.icon-share {
				flex: 0 0 auto;
				.m-icon-share();
				margin-right: 7px;
			}
			.share {
				flex: 0 0 auto;
				font-size: 12px;
			}
		}
		.back-wrap {
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			line-height: 20px;
			justify-content: center;
			.back-btn {
				cursor: pointer;
			}
			.icon-back {
				margin-right: 8px;
				.m-icon-wap-back();
				&::before {
					font-size: 12px;
				}
			}
			.blank-block {
				flex: 1 1 auto;
			}
			.delete-btn {
				cursor: pointer;
				padding: 0 16px 0 16px;
				height: 18px;
				line-height: 18px;
				border: 1px solid @midGray;
				background: @white;
				color: @red;
				&:hover {
					background: @lightGray;
				}
			}
		}
		.timestamp {
			font-size: 12px;
			line-height: 14px;
			margin-bottom: 9px;
			.flexibet-title{
				padding-left: 18px;
				.flexibet();
			}
		}
		.status-bar {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			line-height: 24px;
			font-weight: bold;
			color: @white;
			padding: 0 6px;
			margin-bottom: 10px;
			background-color: @dark;
			&.green {
				background-color: @green;
			}
			&.gray {
				background-color: @darkGray;
			}

			.m-order-type {
				flex: 1 1 auto;
				text-align: left;
			}
			.m-order-icon {
				flex: 0 0 auto;
				margin: 0 4px;
				&.win {
					.m-icon-wincup();
					color: @white;
				}
				&.pending {
					height: 16px;
					width: 16px;
					background-color: @red;
				}
			}
			.m-order-status {
				flex: 0 0 auto;
				margin-right: 13px;
			}
		}

		.stake-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 16px;

			.cell {
				flex: 1 1 auto;
				text-align: right;
				padding: 0 6px;
				.label {
					font-size: 12px;
					color: @darkGray;
				}
				.value {
					font-size: 12px;
					line-height: 14px;
					color: @dark;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				&.cash {
					width: 52px;
				}
				&.bonus {
					width: 60px;
				}
				&.pot-win {
					width: 76px;
				}
				&.total-stake {
					flex: 1 1 auto;
					width: 126px;
					.value {
						font-size: 14px;
					}
				}
				&.total-return {
					width: 97px;
					margin-right: 11px;
					.value {
						font-size: 14px;
						color: @dark;
						font-weight: bold;
					}
					.value.green {
						color: @green;
					}
				}
			}
		}

		.stake-wrap-fix {
			.cell {
				&.pot-win {
					margin-right: 15px;
				}
				&.total-stake {
					margin-right: 15px;
				}
				&.total-return {
					width: 130px;
					margin-right: 10px;
				}
			}
		}
		.cashout-rule {
			font-size: 12px;
			line-height: 12px;
			text-align: left;
			color: @darkGray;
			//margin-bottom: 12px;
		}
		.rebet-wrap{
			border-top: 1px solid @midGray;
			display: flex;
			margin-top: 16px;
			&>div{
				padding-top: 10px;
			}
			.left{
				flex: 1 0 auto;
				height: 30px;
				line-height: 30px;
				color: @dark;
				.rebet-btn{
					margin-right: 10px;
					width: 63px;
					height: 28px;
					padding:0;
					text-align: center;
					border: none;
				}
			}
			.right{
				width: 216px;
				flex: 0 0 1;
				// 只有一个节点的 时候
				&>div:only-child{
					height: 30px;
					line-height: 30px;
				}
				.tip{
					font-size: 10px;
					color: @darkGray;
						.icon-tip{
							.m-icon-tips();
							font-size: 12px;
							vertical-align: middle;
							margin-left: 4px;
							.m-popOver-wrapper{
								margin-bottom: 6px;
    							margin-left: 5px;
								.m-popOver-arrow{
									width: 6px;
									height: 6px;
									&.m-popOver-arrow--bottom{
										top:-5px;
									}
								}
							}
						}
				}
			}
		}
		.triangle {
			width: 15px;
			height: 15px;
			transform: rotate(45deg);
			position: absolute;
			bottom: -9px;
			background-color: @lightGray;
			z-index: 1;
			&.left {
				left: -10px;
			}
			&.right {
				right: -10px;
			}
		}

		&.list {
			padding: 15px 20px 20px 20px;

			.selection-detail-wrap {
				display: flex;
				position: relative;
				align-items: center;
				justify-content: center;
				padding: 9px 0;
				border-bottom: 2px solid @fogGrayBorder;
				.selection-num {
					position: absolute;
					top: 9px;
					left: 0;
					width: 25px;
					font-size: 14px;
					font-weight: bold;
					line-height: 16px;
				}
				.selection-detail {
					flex: 1 1 auto;
					margin-left: 25px;
					.selection-header {
						display: flex;
						font-size: 12px;
						line-height: 16px;
						font-weight: 500;
						margin-bottom: 6px;
						.live-icon {
							background: @lightGreen;
							color: @dark;
							position: relative;
							padding: 0 3px;
							box-sizing: border-box;
							flex: 0 0 auto;
							height: 16px;
							line-height: 16px;
							margin-right: 10px;
							&:after {
								position: absolute;
								top: 0;
								right: -2px;
								content: '';
								width: 0;
								height: 0;
								border-top: 8px solid @lightGreen;
								border-left: 1px solid @lightGreen;
								border-right: 1px solid transparent;
								border-bottom: 8px solid transparent;
							}
						}
						.game-id,.game-timestamp {
							flex: 0 0 auto;
							margin-right: 11px;
						}
						.game-statistics, .game-live-tracker {
							flex: 0 0 auto;
							margin-left: 13px;
							color: @linkBlue;
							cursor: pointer;
						}
						.go-live-betting {
							flex: 0 0 auto;
							margin-left: 13px;
							height: 14px;
							line-height: 14px;
							padding: 0 4px;
							color: @green;
							border: 1px solid @green;
							border-radius: 12px;
							font-weight: bold;
							cursor: pointer;
							.arrow-right {
								margin-left: 4px;
								vertical-align: middle;
								.m-icon-arrow-up2();
								&::before {
									font-size: 12px;
									transform: rotate(90deg);
									display: inline-block;
								}
							}
						}
						.selection-status {
							flex: 1 1 auto;
							color: @darkGray;
							font-weight: bold;
							text-align: right;
							&.running {
								color: @dark;
							}
							&.checked {
								.m-icon-success-bg();
								&::before {
									color: @green;
								}
							}
						}
					}

					.selection-body {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.team-wrap {
							flex: 0 0 auto;
							width: 180px;
						}
						.score-wrap {
							flex: 0 0 auto;
							margin: 0 21px;
							width: 70px;
							display: flex;
							align-items: center;
							justify-content: flex-start;
							.no-score {
								line-height: 34px;
							}
							.score-pairs {
								flex: 0 0 auto;
								min-width: 14px;
								text-align: center;
								line-height: 14px;
								font-size: 12px;
								font-weight: bold;
								margin-right: 1px;
								.home-score {
									margin-bottom: 2px;
									color: @darkGray;
									background-color: @white;
									border: 1px solid @midGray;
									&.main {
										color: @dark;
										background-color: @fogGray;
									}
								}
								.away-score {
									color: @darkGray;
									background-color: @white;
									border: 1px solid @midGray;
									&.main {
										color: @dark;
										background-color: @fogGray;
									}
								}
							}
						}
						.blank-wrap {
							flex: 1 1 auto;
						}
						.banker-wrap {
							flex: 0 0 auto;
							width: 16px;
							height: 48px;
							margin-right: 16px;
							display: flex;
							align-items: center;
							justify-content: center;
							.banker-icon {
								width: 14px;
								height: 14px;
								font-size: 12px;
								line-height: 14px;
								border: 1px solid @green;
								color: @green;
								font-weight: bold;
								border-radius: 8px;
								text-align: center;
							}
						}
						.outcome-wrap {
							flex: 1 1 auto;
							margin-right: 16px;
							.outcome-row {
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 12px;
								line-height: 16px;
								.outcome-label {
									flex: 0 0 auto;
									width: 41px;
									color: @darkGray;
								}
								.outcome-value {
									flex: 1 1 auto;
									margin-left: 4px;
									color: @dark;
								}
							}
						}
					}
				}
			}

			.bet-number-wrap {
				margin-top: 13px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				font-weight: bold;
				line-height: 16px;
				.bet-number {
					flex: 1 1 auto;
					color: @dark;
					text-align: left;
				}
				.bet-detail {
					flex: 0 0 auto;
					color: @green;
					cursor: pointer;
				}
				.bet-detail-icon {
					flex: 0 0 auto;
					margin-left: 6px;
					color: @green;
					cursor: pointer;
					.m-icon-arrow--right();
					&::before {
						font-size: 12px;
						vertical-align: middle;
					}
				}
			}
		}

		&.cashout {
			padding: 11px 20px 21px 20px;
			.cashout-detail {
				margin-bottom: 10px;
				font-size: 14px;
				line-height: 16px;
				font-weight: bold;
			}
			.cashout-detail-wrap {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.total-cashout {
					flex: 0 0 auto;
					margin-right: 40px;
				}
				.remain-stake {
					flex: 0 0 auto;
					margin-right: 41px;
				}
				.pot-win {
					flex: 0 0 auto;
				}
				.label {
					font-size: 12px;
					line-height: 14px;
					color: @darkGray;
					text-align: right;
				}
				.value {
					font-size: 14px;
					line-height: 16px;
					color: @dark;
					text-align: right;
				}
			}
		}
	}
}

.tracker {
	&.es-dialog {
		border-color: @dark;
	}
	&.es-dialog .es-dialog-head .es-dialog-close {
		top: 0px;
		right: -27px;
		text-decoration: none;
		cursor: pointer;
		em {
			color: @white;
			cursor: pointer;
		}

	}
	&.es-dialog .es-dialog-body .es-dialog-main {
		background-color: @dark;
		max-height: 400px;
	}
	&.es-dialog .es-dialog-head {
		background-color: @dark;
		height: 0px;
	}
}

.bet-detail {
	.es-dialog-head {
		height: 20px;
		h1 {
			line-height: 20px;
			padding-left: 0px;
		}
	}

	.es-dialog-main.m-dialog-main {
		padding-top: 0px;
	}
}
</style>
