<template>
	<div class="bet-list-wrap" v-loading="isLoading">
		<div class="bet-list-header">
			<span class="bet-number">Number of Bet: {{contentData.betSize}}</span>
			<i class="icon-print" v-if="false"/>
			<span class="print" v-if="false">Print</span>
		</div>
		<div class="bet-list-body">
		<div class="bet-detail-wrap" v-for="bet in betDetails" :key="bet.id">
			<h2 class="bet-id">Bet ID: {{bet.id}}<em class="flexibet-title" v-if="bet.type === 4"><i>F</i>Flex Your Bet {{bet.minToWin}}+ of {{bet.selectionSize}}</em></h2>
			<div class="bet-detail-row">
				<span class="left bet-type" v-if="bet.type === 3">{{bet.showComboType + (bet.comboNum > 1 ? ' (X' + bet.comboNum + ')' : '')}}</span>
				<span class="left bet-type" v-else>{{bet.showBetType}} <template v-if="contentData.comboSize>1&&bet.type!==1">(X{{contentData.comboSize}})</template></span>
				<template v-if="bet.status === 1 || bet.status === 4">
					<i class="right win"/>
					<span class="right bet-status green">{{bet.showStatus}}</span>
				</template>
				<span class="right bet-status" v-else>{{bet.showStatus}}</span>
			</div>
			<div class="bet-detail-row">
				<span class="left bet-stake">{{bet.showOriginalStake}}</span>
				<span class="right return-stake green" v-if="bet.status === 1 || bet.status === 3 || bet.status === 4">{{bet.showWinnings}}</span>
				<span class="right return-stake" v-else-if="bet.status === 2">0.00</span>
				<span class="right return-stake" v-else>--</span>
			</div>
			<div class="bet-detail-extra">
				<template v-if="bet.stake!=bet.originalStake&&bet.stake!==0&&(bet.status===0||bet.status===90)">
					<span class="stake-label">Remaining Stake:</span>
					<span class="stake-value">{{bet.showStake}}</span>
				</template>
				<template v-if="bet.totalOdds">
					<span class="stake-label">Odds:</span>
					<span class="stake-value">{{bet.totalOdds}}</span>
				</template>
				<template v-if="bet.potentialWinnings!==0&&(bet.status===0||bet.status===90)">
					<span class="stake-label">Pot.Win:</span>
					<span class="stake-value">{{bet.showPotentialWinnings}}</span>
				</template>
				<template v-if="bet.bonus > 0">
					<span class="stake-label">Bonus:</span>
					<span class="stake-value">{{bet.showBonus}}</span>
				</template>
			</div>
			<!-- flexibettip -->
			<div class="flexibet-tip" v-if="bet.type === 4 && bet.currentSelectionSize > 0 &&  bet.currentMinToWin > 0" @click="showFlexibetTip">* FlexiBet current selections: {{bet.currentMinToWin}} of {{bet.currentSelectionSize}}
				<i class="tip">
					<PopOver
						position="bottom"
						:isCenter="true"
						:arrowCenter="true">
						<p>Because one or some of your selected<br> matches are void, FlexiBet has removed<br> relate selections and recalculated the odds.</p>
					</PopOver>
				</i>
			</div>
			<div class="cashout-wrap" v-if="bet.cashOutHistorys.length>0">
				<div class="cashout-bar flex-row" @click="toggleCashout(bet)">
					<i :class="'arrow-icon ' + (bet.cashoutExpand ? 'down' : 'right')"/>
					<span class="cashout-label">Cashout History</span>
					<template v-if="bet.cashoutExpand">
						<span class="stake-used header">Stake Used</span>
						<span class="cashout-stake header">Cashout</span>
					</template>
					<template v-else>
						<span class="stake-used header"></span>
						<span class="cashout-stake header"></span>
					</template>
				</div>
				<template v-if="bet.cashoutExpand">
					<div class="cashout-detail flex-row" v-for="(cashout, index) in bet.cashOutHistorys" :key="index">
						<span class="cashout-date">{{cashout.date}}</span>
						<span class="stake-used">{{cashout.showUsedStake}}</span>
						<span class="cashout-stake">{{cashout.showAmount}}</span>
					</div>
					<div class="cashout-total-wrap flex-row">
						<span class="blank"></span>
						<span class="total-used">Total {{bet.totalUsedStake}}</span>
						<span class="total-cashout">Total {{bet.totalCashout}}</span>
					</div>
				</template>
			</div>
			<div class="selection-wrap" v-if="bet.selections && bet.selections.length > 0">
				<div class="selection-bar" @click="toggleSelection(bet)">
					<i :class="'arrow-icon ' + (bet.selectionExpand ? 'down' : 'right')"/>
					<span class="selection-label">Selection Details</span>
				</div>
				<div class="selection-detail-wrap" v-for="(selection,i) in bet.selections" v-if="bet.selectionExpand" :key="i">
					<div class="selection-num">{{i + 1}}</div>
					<div class="selection-detail">
						<div class="selection-header">
							<i class="live-icon" v-if="selection.eventStatus === 1 || selection.eventStatus === 2">Live</i>
							<span class="game-timestamp">{{selection.showTime}}</span>
							<span class="game-id" v-if="selection.gameId">Game ID: {{selection.gameId}}</span>
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
			</div>
			<div class="combo-wrap" v-if="bet.combinations && bet.combinations.length > 1">
				<h2 class="combo-title">Combo Details</h2>
				<div class="combo-row header">
					<div class="combo-cell combination">Combination</div>
					<div class="combo-cell stake">Stake</div>
					<div class="combo-cell odds">Odds</div>
					<div class="combo-cell bonus">Bonus</div>
					<div class="combo-cell return">Return</div>
					<div class="combo-cell result">Result</div>
				</div>
				<div class="combo-row" v-for="(combo, i) in bet.combinations" :key="i">
					<div class="combo-cell num">{{i + 1}}</div>
					<div class="combo-cell combo"><p>{{combo.combo}}</p></div>
					<div class="combo-cell stake">{{combo.stake}}</div>
					<div class="combo-cell odds">{{combo.odds}}</div>
					<div class="combo-cell bonus">{{(combo.bonus && (+combo.bonus)>0) ? combo.bonus : '--'}}</div>
					<div class="combo-cell return">{{(+combo.winnings>=0) ? combo.winnings : '--'}}</div>
					<div :class="'combo-cell result ' + (combo.status === 2 ? 'lost' : '')">{{combo.showStatus}}</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script>
import { getScheduleDesc } from 'base/js/utils.js';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import 'components/popOver';
import { betStatusMap, orderTypeMap, comboType, comboStatusMap, status } from './config.js';

export default {
	data() {
		return {
			betDetails: [],
			isLoading: false
		};
	},
	created() {
		this.getBetDetail();
	},
	methods: {
		isTwoColumnScore(sportId) {
			const id = sportId.slice('9');
			return ['5', '23', '34'].includes(id); //  Tennis, 'Volleyball', 'Beach Volley'
		},
		isTreeColumnScore(sportId) {
			const id = sportId.slice('9');
			return ['5'].includes(id); // Tennis
		},
		isEventLive(status) {
			return [1, 2].includes(status);
		},
		getBetDetail() {
			const orderId = this.contentData.orderId;
			this.isLoading = true;
			fetch('/realSportsGame/order', {
				method: 'GET',
				body: {
					orderId,
					integrity: 'full'
				}
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					this.betDetails = res.data || [];
					this.format(this.betDetails);
					this.$nextTick(() => {
						this.$parent.setPosition(true);
					});
				}
			}).catch(e => {
				console.log(e);
				this.isLoading = false;
			});
		},
		format(bets) {
			bets.forEach(bet => {
				if (bet.comboType > 3) {
					bet.showComboType = `${bet.comboType} Folds`;
				} else {
					bet.showComboType = comboType[bet.comboType];
				}
				bet.showBetType = orderTypeMap[bet.type];
				bet.showStatus = betStatusMap[bet.status];
				bet.showOriginalStake = formatNumber((+bet.originalStake) / 10000, 2);
				bet.showWinnings = formatNumber((+bet.winnings) / 10000, 2);
				bet.showStake = formatNumber((+bet.stake) / 10000, 2);
				bet.showBonus = formatNumber((bet.bonus / 10000), 2);
				bet.showPotentialWinnings = formatNumber((bet.potentialWinnings / 10000), 2);
				bet.combinations && bet.combinations.forEach(combo => {
					combo.showStatus = comboStatusMap[combo.status];
				});

				bet.totalCashout = 0;
				bet.totalUsedStake = 0;
				bet.cashOutHistorys && bet.cashOutHistorys.forEach(cashout => {
					bet.totalCashout += +cashout.amount;
					bet.totalUsedStake += +cashout.usedStake;
					cashout.showUsedStake = formatNumber(cashout.usedStake / 10000, 2);
					cashout.showAmount = formatNumber(cashout.amount / 10000, 2);
					cashout.date = dateFormat.format(cashout.createTime, 'DD/MM hh:mm');
				});
				bet.totalCashout = formatNumber(bet.totalCashout / 10000, 2);
				bet.totalUsedStake = formatNumber(bet.totalUsedStake / 10000, 2);

				bet.selections.forEach(selection => {
					selection.showTime = this.getShowTime(selection);
					selection.showPick = selection.outcomeDesc + ' @' + selection.odds;
					selection.showSetScore = selection.setScore ? selection.setScore.split(':') : ['', ''];
					selection.showGameScore = selection.gameScore ? selection.gameScore[selection.gameScore.length - 1].split(':') : ['', ''];
					selection.showPointScore = selection.pointScore ? selection.pointScore.split(':') : ['', ''];
					selection.showStatus = status[selection.status];
				});

				this.$set(bet, 'cashoutExpand', false);
				this.$set(bet, 'selectionExpand', true);
			});
		},
		getShowTime(selection) {
			if (selection.eventStatus !== 1 && selection.eventStatus !== 2) { // 赛前或赛后
				return dateFormat.format(selection.startTime, 'DD/MM') + '    ' + dateFormat.format(selection.startTime, 'shortTime');
			}
			return getScheduleDesc(selection, selection.sportId.slice(9));
		},
		toggleCashout(bet) {
			bet.cashoutExpand = !bet.cashoutExpand;
		},
		toggleSelection(bet) {
			bet.selectionExpand = !bet.selectionExpand;
		},
	}
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@import '../style/mixin.less';

.bet-list-wrap {
	.bet-list-header {
		width: 580px;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.bet-number {
			flex: 1 1 auto;
			line-height: 16px;
			font-size: 12px;
			color: @darker;
		}
		.icon-print {
			flex: 0 0 auto;
			.m-icon-print();
			margin-right: 7px;
		}
		.print {
			flex: 0 0 auto;
			font-size: 12px;
			line-height: 16px;
			color: @dark;
		}
	}
	.bet-list-body {
		max-height: 500px;
		width: 580px;
		overflow: auto;
	}
	.bet-detail-wrap {
		border: 1px solid @dark;
		padding: 10px;
		margin-bottom: 10px;
		.bet-id {
			margin-bottom: 4px;
			line-height: 14px;
			font-size: 12px;
			.flexibet-title{
				padding-left: 18px;
				.flexibet();
			}
		}
		.bet-detail-row {
			display: flex;
			align-items: center;
			justify-content: center;
			.left {
				flex: 1 1 auto;
				&.bet-type {
					font-size: 14px;
					line-height: 20px;
					height: 20px;
				}
				&.bet-stake {
					font-size: 16px;
					font-weight: bold;
					line-height: 22px;
				}
			}
			.right {
				flex: 0 0 auto;
				&.bet-status {
					font-size: 14px;
					font-weight: bold;
					line-height: 16px;
					color: @dark;
				}
				&.bet-status.green {
					color: @green;
				}
				&.win {
					.m-icon-jackpot();
					margin-right: 10px;
					color: @green;
				}
				&.return-stake {
					font-size: 16px;
					font-weight: bold;
					line-height: 22px;
					color: @dark;
				}
				&.return-stake.green {
					color: @green;
				}
			}
		}
		
		.bet-detail-extra {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			font-size: 12px;
			line-height: 14px;
			margin-top: 5px;
			margin-bottom: 12px;
			.stake-label {
				color: @darkGray;
				margin-left: 40px;
				&:first-child {
					margin-left: 0px;
				}
			}
			.stake-value {
				color: @dark;
				margin-left: 2px;
			}
		}
		.flexibet-tip{
			font-size: 10px;
			color: @darkGray;
			padding: 0 0 8px;
			margin-top: -6px;
			.tip{
				.m-icon-tips();
				font-size: 12px;
				vertical-align: middle;
				margin-left: 4px;
				.m-popOver-wrapper{
					margin-bottom: 6px;
					margin-left: 5px;
					white-space: nowrap;
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
		.cashout-wrap {
			margin-bottom: 8px;
			.flex-row {
				&.cashout-bar {
					line-height: 24px;
					background-color: @lightGray;
				}
				&.cashout-detail {
					&:first-child {
						margin-top: 8px;
					}
					line-height: 26px;
					border-bottom: 1px solid @lightGray;
				}
				&.cashout-total-wrap {
					line-height: 26px;
				}
				display: flex;
				align-items: center;
				justify-content: center;
				padding-right: 11px;
				.arrow-icon {
					flex: 0 0 auto;
					color: @green;
					padding: 0 6px 0 6px;
					&.right {
						transform: rotate(270deg);
						.m-icon-arrow-down2();
					}
					&.down {
						.m-icon-arrow-down2();
					}
				}
				.cashout-label {
					flex: 0 0 auto;
					width: 102px;
				}
				.cashout-date {
					flex: 0 0 auto;
					text-align: center;
					width: 130px;
				}
				.blank {
					flex: 0 0 auto;
					width: 130px;
				}
				.stake-used,.cashout-stake,.total-used,.total-cashout {
					flex: 1 1 auto;
					width: 150px;
					text-align: right;
				}
				.stake-used.header,.cashout-stake.header {
					color: @darkGray;
				}
				.total-used,.total-cashout {
					font-weight: bold;
				}
			}
		}
		
		.selection-wrap {
			.selection-bar {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				line-height: 24px;
				background-color: @lightGray;
				.arrow-icon {
					flex: 0 0 auto;
					color: @green;
					padding: 0 6px 0 6px;
					&.right {
						transform: rotate(270deg);
						.m-icon-arrow-down2();
					}
					&.down {
						.m-icon-arrow-down2();
					}
				}
				.selection-label {
					flex: 0 0 auto;
				}
			}
			.selection-detail-wrap {
				display: flex;
				position: relative;
				align-items: center;
				justify-content: center;
				padding: 9px 11px;
				border-bottom: 2px solid @fogGrayBorder;
				.selection-num {
					position: absolute;
					top: 9px;
					left: 11px;
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
		}
		
		.combo-wrap {
			.combo-title {
				line-height: 19px;
				margin-top: 15px;
				margin-bottom: 9px;
				font-size: 14px;
				text-align: center;
				color: @darkGray;
			}
			.combo-row {
				display: flex;
				align-items: flex-start;
				justify-content: center;
				color: @dark;
				border-top: 1px solid @lightGray;
				&:first-child {
					border: none;
				}
				&.header {
					color: @darkGray;
					border: none;
					background-color: @lightGray;
					.combo-cell {
						line-height: 24px;
						font-size: 12px;
						margin: 0;
					}
				}
				.combo-cell {
					flex: 0 0 auto;
					line-height: 18px;
					margin-top: 11px;
					margin-bottom: 11px;
					text-align: right;
					word-wrap: break-word;
					&.combination {
						flex: 1 1 auto;
						width: 117px;
						margin-left: 6px;
						margin-right: 16px;
					}
					&.num {
						width: 36px;
						text-align: left;
						margin-left: 6px;
						margin-right: 8px;
					}
					&.combo {
						flex: 1 1 auto;
						width: 80px;
						text-align: center;
						margin-right: 16px;
					}
					&.stake {
						width: 70px;
						margin-right: 16px;
					}
					&.odds {
						width: 60px;
						margin-right: 16px;
					}
					&.bonus {
						width: 60px;
						margin-right: 16px;
					}
					&.return {
						width: 72px;
						margin-right: 16px;
					}
					&.result {
						width: 72px;
						margin-right: 8px;
						font-weight: bold;
						&.lost {
							color: @darkGray;
						}
					}
				}
			}
		}
	}
}
</style>
