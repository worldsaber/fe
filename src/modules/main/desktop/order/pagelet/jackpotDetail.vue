<template lang="html">
	<div class="m-order-wrapper m-jackpot-detail">
		<div class="m-order-detail-wrap">
			<div class="back-wrap">
				<div class="back-btn" @click="goBack">
					<i class="icon-back"/>
					<span>Back</span>
				</div>
				<div class="blank-block"/>
				<div v-if="isSettled && !orderInfo.isHistory" class="delete-btn" @click="deleteJackpotOrder">Delete</div>
			</div>
			<div class="title-wrap">
				<span class="title">Ticket Details (ID:{{orderInfo.shortId}})</span>
				<i class="icon-print" v-if="false"/>
				<span @click="printDetail" class="print" v-if="false">Print</span>
				<i v-if="false" class="icon-share"/>
				<span v-if="false" class="share">Share</span>
			</div>
			<div class="timestamp">{{orderInfo.showTime}}</div>
			<div :class="'status-bar ' + orderInfo.showColor">
				<span class="m-order-type">{{orderInfo.showOrderType}}</span>
				<i class="m-order-icon win" v-if="orderInfo.winningStatus === 20"/>
				<span class="m-order-icon pending" v-if="orderInfo.winningStatus === 90"/>
				<span class="m-order-status">{{orderInfo.showStatus}}</span>
			</div>
			<div class="stake-wrap">
				<div class="cell bonus">
					<div class="label">Round No.</div>
					<div class="value">{{orderInfo.periodNumber}}</div>
				</div>
				<div class="cell total-stake">
					<div class="label">Total Stake</div>
					<div class="value">{{orderInfo.totalStake}}</div>
				</div>
				<div class="cell total-return">
					<div class="label">Total Return</div>
					<div class="value" v-if="orderInfo.winningStatus===0||orderInfo.winningStatus===90">--</div>
					<div :class="(orderInfo.winningStatus===5||orderInfo.winningStatus===20 ? 'green' : '') + ' value'" v-else>{{orderInfo.totalWinnings}}</div>
				</div>
			</div>
			<div class="gift-wrap">
				<div class="gift cell" v-if="orderInfo.favor">
					<div class="label">{{orderInfo.showFavorType}}</div>
					<div class="value">- {{orderInfo.favorAmount}}</div>
				</div>
				<div class="win-detail cell" v-for="winning in orderInfo.orderWinnings">
					<div class="label">{{winning.correctEvents}} out of {{orderInfo.betType}} (x{{winning.winNum}})</div>
					<div class="value">{{winning.showPerWinnings}}</div>
				</div>
			</div>
			<div class="triangle left"/>
			<div class="triangle right"/>
		</div>
		<div class="m-order-detail-wrap list">
			<div class="selection-detail-wrap" v-for="(selection,i) in orderInfo.elements">
				<div class="selection-num">{{i + 1}}</div>
				<div class="selection-detail">
					<div class="selection-header">
						<i class="live-icon" v-if="selection.eventStatus === 1 || selection.eventStatus === 2">Live</i>
						<span class="game-timestamp">{{selection.showTime}}</span>
						<span class="game-id" v-if="selection.gameId">Game ID: {{selection.gameId}}</span>
						<span class="game-statistics" v-if="selection.eventStatus === 3 || selection.eventStatus === 4" @click="goStatistics(selection.eventId)">Check statistics ></span>
						<div class="go-live-betting" v-if="(selection.eventStatus===1||selection.eventStatus===2)&&selection.haveLive===true" @click="goLiveBetting(selection.eventId, selection.specifier)">
							Go to Live Betting<i class="arrow-right"/>
						</div>
						<span class="selection-status unsettled" v-if="orderInfo.winningStatus===0 || orderInfo.winningStatus===90">--</span>
						<span :class="{'selection-status': true, running:selection.selectionsStatus === 0}" v-else-if="selection.selectionsStatus!==1">{{selection.showStatus}}</span>
						<i class="selection-status checked" v-else/>
					</div>
					<div class="selection-body">
						<div class="team-wrap">
							<p class="team-label home">{{selection.home}}</p>
							<p class="team-label">{{selection.away}}</p>
						</div>
						<div class="score-wrap">
							<div class="score-pairs" v-if="selection.homeScore && selection.awayScore">
								<div class="home-score main">{{selection.homeScore}}</div>
								<div class="away-score main">{{selection.awayScore}}</div>
							</div>
							<div class="no-score" v-else>--</div>
						</div>
						<div class="outcome-wrap">
							<div class="outcome-row">
								<span class="outcome-label">Pick</span>
								<p class="outcome-value">{{selection.showPick}}</p>
							</div>

						</div>
					</div>
				</div>
			</div>
			<div v-if="showPeriod" class="triangle left"/>
			<div v-if="showPeriod" class="triangle right"/>
		</div>
		<div class="periodWinning-wrap">
			<h2 class="total-prize"><i class="icon-win"/>Sporty {{orderInfo.betType}} Prize {{orderInfo.showMaxWinnings}}</h2>
			<h2 class="winning-title" v-if="showPeriod">Winnings of this Round</h2>
			<div class="winning-row header" v-if="showPeriod">
				<div class="cell correct-event">Correct Events</div>
				<div class="cell ticket-num">No. Tickets</div>
				<div class="cell ticket-winning">Winning per Ticket</div>
			</div>
			<div class="winning-row" v-if="showPeriod" v-for="winning in orderInfo.periodWinnings">
				<div class="cell correct-event">{{winning.correctEvents}} out of {{orderInfo.betType}}</div>
				<div class="cell ticket-num">{{winning.winNum}}</div>
				<div class="cell ticket-winning">{{winning.showPerWinnings}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import 'utils/dom';
import { formatNumber } from 'utils';
import { sportConfigLowerCase } from 'config/sportsType';
import { baseUrl } from 'config/pageConfig';
import dateFormat from 'kernel/js/dateFormat.js';
import statisticsBridge from './bridge.vue';
import { colorMap, statusMap, jackpotPickMap, favorType, jackpotSelStatus } from './config.js';

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
		this.comboSize = this.$router.currentRoute.params.comboSize || 1;
		this.fetchDetail();
	},
	computed: {
		showPeriod() {
			return this.orderInfo.periodWinnings && this.orderInfo.periodWinnings.length > 0;
		},
		isSettled() {
			return this.orderInfo && [20, 30, 40].indexOf(this.orderInfo.winningStatus) > -1;
		}
	},
	methods: {
		goBack() {
			// this.$router.push({
			// 	path: '/jackpot'
			// });
			window.history.go(-1);
		},
		deleteJackpotOrder() {
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
									path: '/jackpot'
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

			const fetchOrder = fetch('/orders/order/jackpot/ticketDetail', {
				method: 'GET',
				body: {
					orderId
				}
			}).then(res => res.json());
			const fetchJackpot = fetch('/jackpot/bet', {
				method: 'GET',
				body: {
					id: orderId
				}
			}).then(res => res.json());

			Promise.all([fetchOrder, fetchJackpot]).then(res => {
				if (res[0].bizCode === 10000 && res[1].bizCode === 10000) {
					this.orderInfo = this.format(res[0].data, res[1].data);
				}
			}).catch(e => {
				console.log(e);
			});
		},
		getShowTime(selection) {
			if (selection.eventStatus !== 1 && selection.eventStatus !== 2 || !selection.haveLive) { // 赛前或赛后, 或者没有订阅比赛
				return dateFormat.format(selection.date, 'DD/MM') + '    ' + dateFormat.format(selection.date, 'shortTime');
			}
			return `${selection.playedSeconds}' ${selection.matchStatus}`;
		},
		format(order, jackpot) {
			jackpot.showTime = dateFormat.format(order.createTime, 'DD/MM/YYYY') + '    ' + dateFormat.format(order.createTime, 'shortTime');
			jackpot.showOrderType = 'Sporty ' + jackpot.betType;
			jackpot.shortId = order.shortId;
			jackpot.isHistory = order.isHistory;
			jackpot.winningStatus = order.winningStatus;
			jackpot.showStatus = statusMap[order.winningStatus];
			jackpot.showColor = colorMap[order.winningStatus];
			jackpot.elements.forEach(selection => {
				selection.showTime = this.getShowTime(selection);
				selection.showPick = jackpotPickMap[selection.selections[0].id];
				for (let i = 1; i < selection.selections.length; i++) {
					selection.showPick += '/' + jackpotPickMap[selection.selections[i].id];
				}
				selection.showStatus = jackpotSelStatus[selection.selectionsStatus];
			});
			jackpot.favor = order.favor;
			if (order.favor) {
				jackpot.showFavorType = favorType[order.favor.favorInfo[0].giftKind];
				jackpot.favorAmount = formatNumber((order.favor.favorInfo[0].giftAmount / 10000), 2);
			}

			jackpot.totalWinnings = order.totalWinnings;
			jackpot.showMaxWinnings = formatNumber(jackpot.maxWinnings, 2);

			jackpot.periodWinnings.forEach(winning => {
				winning.showPerWinnings = formatNumber(winning.perWinnings, 2);
			});
			jackpot.orderWinnings.forEach(winning => {
				winning.showPerWinnings = formatNumber(winning.perWinnings, 2);
			});
			return jackpot;
		},
		goStatistics(id) {
			// this.currentEventId = id;
			// this.showStatistics = true;
			this.disableScroll();
			const d = this.$dialog({
				css: 'statistics',
				title: '',
				content: statisticsBridge,
				contentData: {
					eventId: id
				},
				button: []
			});
			d.onClosed(() => {
				this.enableScroll();
			});
			// document.querySelector('body').style = 'background:#353a45 !important';
		},
		disableScroll() {
			const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;width:100%';
		},
		enableScroll() {
			const body = document.body;
			const top = body.style.top;
			document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top, 10);
			body.style.top = '';
			body.style.width = '';
			body.style.position = '';
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

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@import '../style/common.less';

.m-jackpot-detail {
	.m-order-detail-wrap {
		position: relative;
		background-color: @white;
		margin-bottom: 3px;
		padding: 22px 20px 12px 20px;
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
					.m-icon-jackpot();
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
				&.bonus {
					text-align: left;
					width: 60px;
					margin-left: 6px;
					margin-right: 21px;
				}
				&.total-stake {
					flex: 1 1 auto;
					width: 126px;
					margin-left: 6px;
					margin-right: 21px;
					.value {
						font-size: 14px;
					}
				}
				&.total-return {
					width: 97px;
					margin-left: 6px;
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
		.gift-wrap {
			border-top: 1px solid @lightGray;
			padding-top: 11px;
			font-size: 0;
			.cell {
				font-size: 12px;
				line-height: 14px;
				display: inline-block;
				vertical-align: middle;
				text-align: right;
				margin-left: 6px;
				margin-right: 19px;
				.label {
					color: @darkGray;
				}
				.value {
					color: @dark;
					margin-top: 4px;
					margin-bottom: 1px;
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
			padding: 15px 28px 20px 28px;

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
				.selection-status {
					flex: 1 1 auto;
					color: @darkGray;
					font-weight: bold;
					text-align: right;
					&.running, &.unsettled {
						color: @dark;
					}
					&.checked {
						.m-icon-success-bg();
						&::before {
							color: @green;
						}
					}
				}
				.selection-detail {
					flex: 1 1 auto;
					margin-left: 25px;
					.selection-header {
						display: flex;
						align-items: center;
						justify-content: flex-start;
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
						.game-statistics {
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
	}
	.periodWinning-wrap {
		margin-top: 2px;
		padding: 14px 29px 16px 29px;
		background-color: @white;
		.total-prize {
			color: @dark;
			font-size: 14px;
			font-weight: bold;
			line-height: 16px;
			text-align: center;
			.icon-win {
				vertical-align: middle;
				margin-right: 10px;
				.m-icon-jackpot();
				color: @dark;
			}
		}
		.winning-title {
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			margin-top: 11px;
			margin-bottom: 8px;
		}
		.winning-row {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			line-height: 31px;
			border-top: 1px solid @lightGray;
			&.header {
				line-height: 24px;
				background-color: @lightGray;
				border: none;
			}
			&:first-child {
				border: none;
			}
			.cell {
				flex: 1 1 auto;
				width: 200px;
				margin-left: 16px;
				&.correct-event {
					text-align: left;
				}
				&.ticket-num {
					flex: 0 0 auto;
					width: 100px;
					text-align: center;
				}
				&.ticket-winning {
					text-align: right;
					margin-right: 16px;
				}
			}
		}
	}
}

.statistics {
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
		max-height: 500px;
	}
	&.es-dialog .es-dialog-head {
		background-color: @dark;
	}
}

</style>
