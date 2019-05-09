<template>
  	<div class="m-ticket-detail">
		  <topNavBar/>
		  <!-- 列表详情部分，statistics隐藏时显示 -->
			<div>
				<!-- 头部黑色块内容 -->
				<div class="top">
					<div class="seperate ticket-info">
						<span>Ticket ID: {{jackpotDetail.shortId}}</span>
						<span>{{jackpotDetail.date}}</span>
					</div>
					<div class="bar seperate">
						<span>Sporty {{jackpotDetail.betType}}</span>
						<span :class="{'cup':jackpotDetail.winningStatus==='Won'}"></span>
						<!-- 赢时字体为绿色 -->
						<span :class="{'win':jackpotDetail.winningStatus==='Won', status: true}">{{jackpotDetail.winningStatus}}</span>
					</div>
					<div class="seperate stake-info">
						<span>Total Stake</span>
						<span>Total Return</span>
					</div>
					<!-- 如果没有优惠券，或没有获胜，分隔线不显示 -->
					<div class="seperate stake-amount" :class="{'border-bottom':jackpotDetail.favor||JSON.stringify(jackpotDetail.orderWinnings)!=='[]'}">
						<span>{{jackpotDetail.totalStake}}</span>
						<!-- pending或running时，return为二横杠 -->
						<span v-if="jackpotDetail.winningStatus==='Pending'||jackpotDetail.winningStatus==='Running'" style="color:#fff;margin-top:-5px">--</span>
						<!-- 否则显示实际金额 -->
						<span v-else :class="{'win':jackpotDetail.winningStatus==='Won'}">{{jackpotDetail.winnings}}</span>
					</div>
					<div class="cash-info">
						<!-- 优惠券信息 -->
						<div class="seperate" v-if="jackpotDetail.giftType&&jackpotDetail.giftAmount">
							<span class="left">{{jackpotDetail.giftType}}</span>
							<span>-{{jackpotDetail.giftAmount}}</span>
						</div>
						<!-- 获胜信息 -->
						<div class="seperate" v-for="(winning, i) in jackpotDetail.orderWinnings" :key="i">
							<span class="left">{{winning.correctEvents}} out of {{jackpotDetail.betType}} (x{{winning.winNum}})</span>
							<span>{{winning.perWinnings}}</span>
						</div>
					</div>
				</div>
				<!-- 详情列表部分 -->
				<div class="mid-container">
					<div class="round-num">Round No.{{jackpotDetail.periodNum}}</div>
					<AfTable>
						<!-- 表头部分 -->
						<AfTableRow class="legend">
							<AfTableCell class="time">Date/Match</AfTableCell>
							<AfTableCell>Score</AfTableCell>
							<AfTableCell class="section">Pick </AfTableCell>
							<!-- 比赛开始时及开始前不显示result -->
							<AfTableCell v-if="jackpotDetail.winningStatus!=='Running'">Status</AfTableCell>
						</AfTableRow>
						<!-- 表内容部分，列表循环开始 -->
						<div class="detail-list" v-for="(item,index) in jackpotDetail.elements" :key="index">
							<!-- 一行 -->
							<AfTableRow class="content">
								<AfTableCell>
									<div class="date">No.{{index+1}}
										<!-- 比赛此时正在进行即显示live标记 -->
										<i class="m-icon-live" v-if="(item.eventStatus==1||item.eventStatus==2)">live</i>
										<!-- 比赛没进行（未开始或已结束），显示比赛开始时间；正在进行，显示进行时间和阶段 -->
										<span v-if="item.eventStatus!=1&&item.eventStatus!=2">{{item.date}}</span>
										<span v-if="(item.eventStatus==1||item.eventStatus==2)&&item.haveLive===true">{{`${item.playedSeconds}'`}} {{item.matchStatus}}</span>
									</div>
									<div class="home">{{item.home}}</div>
									<div class="away">{{item.away}}</div>
								</AfTableCell>
								<!-- 根据比赛结束与否，调整其在表格中的位置；没有比分显示二横杠 -->
								<AfTableCell :class="['scores',{'settled':jackpotDetail.winningStatus==='Won'||jackpotDetail.winningStatus==='Lost','unsettled':jackpotDetail.winningStatus!=='Win'||jackpotDetail.winningStatus!=='Lost'}]">
									<div  class="home-score">{{item.homeScore?item.homeScore:'--'}}</div>
									<div class="away-score">{{item.awayScore?item.awayScore:'--'}}</div>
								</AfTableCell>
								<!-- 用户投注的场次，比赛结束后，如果选对了，颜色加深 -->
								<AfTableCell class="sections" :class="{'sec-settled':jackpotDetail.winningStatus==='Won'||jackpotDetail.winningStatus==='Lost'}">
									<span v-for="(sel,i) in item.selections" :key="i">
										<span :class="{'wrong':sel.status==0}">{{sel.pick}}<span v-if="item.selections&&item.selections.length>1&&i<item.selections.length-1" class="gray">/</span></span>
									</span>
								</AfTableCell>
								<!-- 比赛结束前不显示，猜对的显示check图标 -->
								<AfTableCell class="result" v-if="jackpotDetail.winningStatus!=='Running'">
									<span v-if="item.result==='Won'" class="check"></span>
									<span v-else>{{item.result}}</span>
								</AfTableCell>
							</AfTableRow>
							<!-- 比赛结束后显示statistics标记，点击显示statistics -->
							<div class="statistics" v-if="item.eventStatus==3||item.eventStatus==4" @click="openStatistics(item.eventId)">Statistics</div>
							<!-- 此时比赛正在进行，且live betting的比赛才显示，点击跳转到该比赛的live betting页面 -->
							<div class="to-live" v-if="(item.eventStatus==1||item.eventStatus==2)&&item.haveLive===true" @click="toLive(item.eventId,item.specifier)">Go to Live Betting
								<i class="arrow"></i>
							</div>
						</div>
					</AfTable>
				</div>
				<!-- settle后显示所有投注jackpot的用户的获奖情况汇总，包括11中11，11中10，11中9；unsettle的不显示 -->
				<div class="period-winnings">
					<div class="title">Sporty {{jackpotDetail.betType}} Prize {{jackpotDetail.maxWinnings}}</div>
					<div class="sub-title" v-if="jackpotDetail.periodWinnings&&jackpotDetail.periodWinnings.length>0">Winnings of This Round</div>
					<AfTable v-if="jackpotDetail.periodWinnings&&jackpotDetail.periodWinnings.length>0">
						<AfTableRow class="legends">
							<AfTableCell style="margin-left:30px">Correct Events</AfTableCell>
							<AfTableCell>No.Tickets</AfTableCell>
							<AfTableCell>Winning per Ticket</AfTableCell>
						</AfTableRow>
						<AfTableRow class="wins" v-for="(wins,i) in jackpotDetail.periodWinnings" :key="i">
							<AfTableCell>
								<i class="m-icon-winners" :class="{'first-winner':wins.correctEvents==jackpotDetail.betType,'second-winner':wins.correctEvents==jackpotDetail.betType-1,'third-winner':wins.correctEvents==jackpotDetail.betType-2}"></i>
								<span>{{wins.correctEvents}} out of {{jackpotDetail.betType}}</span>
							</AfTableCell>
							<AfTableCell style="position:relative;top:5px" :class="{'adjust':i!==0}">{{wins.winNum}}</AfTableCell>
							<AfTableCell style="position:relative;top:5px">
								<span style="font-weight:300">{{showCurrency}}</span>
								{{wins.perWinnings}}
							</AfTableCell>
						</AfTableRow>
					</AfTable>
				</div>
				<div v-if="jackpotDetail && jackpotDetail.isSettled && !jackpotDetail.isHistory" class="delete-bet" @click="deleteTicket">Delete Ticket</div>
			</div>
		</div>
</template>

<script>
import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';

import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import topNavBar from 'components/navbar';
import { formatNumber } from 'utils';
import { formatWithoutYear } from 'store/order/commonFun';
import { pagePath, baseUrl } from 'config/pageConfig';
import { sportsConfigById } from 'config/sports';
import { pick, selectStatus, favorType, winningStatus } from '../js/config';

export default {
	data () {
		return {
			live: pagePath.live,
			categoryId: '',
			tournamentId: '',
			showCurrency: window.showCurrency || 'KSh',
			jackpotDetail: {}
		};
	},

	components: {
		AfTable,
		AfTableRow,
		AfTableCell,
		topNavBar
	},
	created() {
		this.pageLoading(false);
		this.fetchDetail();
	},
	methods: {
		fetchDetail() {
			const orderId = this.$router.currentRoute.query.id;

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
					this.orderInfo = this.formatDetail(res[0].data, res[1].data);
				}
			}).catch(e => {
				console.log(e);
			});
		},
		formatDetail (order, jackpot) {
			jackpot.shortId = order.shortId;
			jackpot.date = formatWithoutYear(order.createTime);
			jackpot.winningStatus = winningStatus[order.winningStatus];
			jackpot.isSettled = [20, 30, 40].indexOf(order.winningStatus) > -1;
			jackpot.isHistory = order.isHistory;
			if (order.favor) {
				jackpot.giftType = favorType[order.favor.favorInfo[0].giftKind];
				jackpot.giftAmount = formatNumber((order.favor.favorInfo[0].giftAmount / 10000), 2);
			}
			jackpot.periodNum = order.periodNumber;
			const elements = jackpot.elements || [];
			const periodWinnings = jackpot.periodWinnings || [];
			for (const item of elements) {
				item.date = formatWithoutYear(item.date);
				for (const select of item.selections) {
					select.pick = pick[select.id];
				}
				item.result = selectStatus[item.selectionsStatus];
			}
			for (const item of periodWinnings) {
				item.perWinnins && (item.perWinnins = formatNumber(item.perWinnins, 2));
			}
			jackpot.totalStake && (jackpot.totalStake = formatNumber(jackpot.totalStake, 2));
			jackpot.winnings && (jackpot.winnings = formatNumber(jackpot.winnings, 2));
			jackpot.maxWinnings && (jackpot.maxWinnings = formatNumber(jackpot.maxWinnings, 2));
			this.jackpotDetail = jackpot;
		},
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING,
		}),
		deleteTicket() {
			const orderId = this.$router.currentRoute.query.id;
			this.$dialog({
				title: null,
				content: 'Are you sure you want to delete this ticket?',
				button: ['CANCEL', 'DELETE']
			}).onBtnClick(val => {
				if (val === 1) {
					fetch(`/orders/order/deleteOrder/${orderId}`, {
						method: 'POST'
					}).then(res => res.json()).then(res => {
						if (res.bizCode === 10000) {
							this.$toast('Successfully Deleted');
							this.$router.replace({
								name: 'jackpot'
							});
						} else {
							this.$toast('Failed to Delete');
						}
					});
				}
			});
		},
		openStatistics (id) {
			this.$router.push({
				path: '/jackpot/detail/statistics',
				query: {
					eventId: id
				}
			});
		},
		// 为跳转live betting页面获取categoryID和tournamentId，并在获取成功后跳转
		toLive (eventId, specifier) {
			if (!specifier) {
				specifier = 'null';
			}
			fetch('factsCenter/simpleEvent', {
				method: 'GET',
				body: {
					eventId, marketId: 0, specifier
				}
			})
				.then(res => res.json())
				.then(data => {
					if (data.bizCode === 10000) {
						this.categoryId = data.data.sport.category.id;
						this.tournamentId = data.data.sport.category.tournament.id;
						const sportId = data.data.sport.id;
						const sportName = sportsConfigById[sportId].name;
						location.href = `${baseUrl}sport/${sportName}/live/${this.tournamentId}/${this.categoryId}/${eventId}`;
					}
				});
		}
	}
};
</script>

<style lang="less" scoped>
@import "base/styles/variable.less";
@import "base/styles/icon.less";
.m-ticket-detail{
	.win {
		color: #33ea6a;
	}
  	font-size: 12/@rem;
	.period-winnings {
	  background: #353a45;
	  padding-bottom: 10/@rem;
	  color: #fff;
	  .title {
		padding-top: 13/@rem;
		margin-bottom: 3/@rem;
		font-size: 14/@rem;
		font-weight: bold;
		text-align: center;
		.m-icon-wincup();
		&::before {
		  padding-right: 8/@rem;
		  position: relative;
		}
	  }
	  .sub-title {
		margin-bottom: 4/@rem;
		font-size: 12/@rem;
		color: #eaecef;
		text-align: center;
	  }
	  .legends {
		color: #9ca0ab;
		padding-bottom: 9/@rem;
	  }
	  .wins {
		font-size: 14/@rem;
		font-weight: bold;
	  }
	  .legends,
	  .wins {
		justify-content: space-around;
		border-bottom: solid 1px rgba(234, 236, 239, 0.15);
	  }
	  .second-winner {
		background: #fafd00;
		&:after {
		  border-top: 36/@rem solid #fafd00;
		}
	  }
	  .third-winner {
		background: @lightGreen;
		&:after {
		  border-top: 36/@rem solid @lightGreen;
		}
	  }
	  .first-winner {
		background: #0d9737;
		&:after {
		  border-top: 36/@rem solid #0d9737;
		}
	  }
	  .m-icon-winners {
		width: 15/@rem;
		height: 34/@rem;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		left: -33/@rem;
		margin-right: 5/@rem;
		padding: 0 2/@rem;
		box-sizing: border-box;
		&:after {
		  position: absolute;
		  top: 0;
		  right: -7/@rem;
		  content: "";
		  border-right: 8/@rem solid transparent;
		}
	  }
	}
	.delete-bet {
		height: 48/@rem;
		line-height: 48/@rem;
		text-align: center;
		color: @red;
		font-size: 14/@rem;
		background: @white;
	}
	.mid-container {
	  padding: 0 10/@rem;
	}
	.round-num {
	  margin-top: 16/@rem;
	  margin-bottom: 10/@rem;
	  color: #9ca0ab;
	  text-align: center;
	}
	.legend {
	  height: 17/@rem;
	  background-color: #f2f3f5;
	  .time {
		width: 150/@rem;
	  }
	}
	.content {
	  padding-bottom: 11/@rem;
	  padding-top: 12/@rem;
	  .date span {
		color: #9ca0ab;
		margin-left: 6/@rem;
	  }
	  .home,
	  .away {
		width: 210/@rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	  }
	}
	.m-table-cell {
	  flex: 0 0 auto !important;
	}
	.legend,
	.content {
	  justify-content: space-between;
	  padding-left: 6/@rem;
	  padding-right: 6/@rem;
	  box-sizing: border-box;
	}
	.adjust {
		right:15/@rem;
	}
	.scores {
	  position: relative;
	  top: 17/@rem;
	}
	.section {
	  width: 10/@rem;
	  padding-right: 20/@rem;
	  margin-left: 10/@rem;
	}
	.sections {
	  width: 32/@rem;
	  position: relative;
	  top: 26/@rem;
	}
	.wrong {
	  color: #9ca0ab;
	}
	.sec-settled {
	  right: 10/@rem;
	}
	.settled {
	  position: relative;
	  left: -50/@rem;
	}
	.unsettled {
	  right: 40/@rem;
	}
	.result {
	  position: relative;
	  top: 26/@rem;
	  color: #9ca0ab;
	  .check {
		.m-icon-success-bg();
		&::before {
		  color: #33ea6a;
		  font-size: 16/@rem;
		  padding-right: 15/@rem;
		  position: relative;
		  left: 10/@rem;
		  top: -5/@rem;
		}
	  }
	}

	.seperate {
	  display: flex;
	  justify-content: space-between;
	}
	.cashout-title {
	  height: 28/@rem;
	  line-height: 28/@rem;
	  margin-bottom: 6/@rem;
	  background-color: rgba(234, 236, 239, 0.15);
	  color: #eaecef;
	}
	.fold {
	  transform: rotate(270deg);
	  display: inline-block;
	  margin-top: -1/@rem;
	  position: relative;
	  top: 1/@rem;
	  .unfold();
	}
	.unfold {
	  .m-icon-arrow-down2();
	  &::before {
		font-size: 10/@rem;
		padding-right: 15/@rem;
		position: relative;
		left: 10/@rem;
		top: 2/@rem;
	  }
	}
	.top {
	  padding: 12/@rem 16/@rem 17/@rem;
	  background-color: #1b1e25;
	  color: #fff;

	  .cashout-detail {
		font-size: 14/@rem;
		line-height: 1.57;
	  }
	  .ticket-info {
		opacity: 0.5;
		color: #fff;
	  }
	  .bar {
		font-size: 16/@rem;
		.cup {
		  .m-icon-wincup();
		  &::before {
			color: #33ea6a;
			padding-right: 15/@rem;
			position: relative;
			right: -95/@rem;
			font-size: 16/@rem;
		  }
		}
	  }
	  .stake-info {
		opacity: 0.7;
		color: #fff;
	  }
	  .border-bottom {
		border-bottom: solid 1/@rem #44484d;
		padding-bottom: 11/@rem;
		margin-bottom: 6/@rem;
	  }
	  .stake-amount {
		span:first-child {
		  font-size: 16/@rem;
		  font-weight: 500;
		}
		span:last-child {
		  font-size: 20/@rem;
		  font-weight: bold;
		}
	  }
	  .left {
		opacity: 0.5;
	  }
	  .cash-info {
		margin-bottom: 11/@rem;
		font-size: 14/@rem;
		line-height: 1.57;
	  }
	  .unavailable {
		opacity: 0.5;
		font-size: 10/@rem;
	  }
	}
	.detail-list {
	  border-bottom: 1/@rem solid #eaecef;
	  box-sizing: border-box;
	  .m-icon-live {
		display: inline-block;
		vertical-align: top;
		background: @lightGreen;
		color: @dark;
		position: relative;
		margin-right: 5/@rem;
		padding: 0 2/@rem;
		box-sizing: border-box;
		&:after {
		  position: absolute;
		  top: 0;
		  right: -2/@rem;
		  content: "";
		  width: 0;
		  height: 0;
		  border-top: 8/@rem solid @lightGreen;
		  border-left: 1/@rem solid @lightGreen;
		  border-right: 1/@rem solid transparent;
		  border-bottom: 8/@rem solid transparent;
		}
	  }
	  .gray {
		color: #9ca0ab;
	  }
	  .score span:first-child {
		font-weight: bold;
	  }
	  .score {
		margin-right: 7/@rem;
	  }
	  .status {
		font-size: 14/@rem;
		font-weight: bold;
		color: #353a45;
	  }
	  .others {
		color: #9ca0ab;
	  }
	  .won {
		.m-icon-success-bg();
		&::before {
		  color: #33ea6a;
		  font-size: 16/@rem;
		  padding-right: 15/@rem;
		  position: relative;
		  left: 10/@rem;
		  top: -5/@rem;
		}
	  }
	  .pick-info {
		margin-top: 6/@rem;
	  }
	  .not-seperate {
		display: table-row;
		span {
		  display: table-cell;
		}
		span:last-child {
		  padding-left: 8/@rem;
		}
		.banker {
		  width: 16/@rem;
		  height: 16/@rem;
		  line-height: 16/@rem;
		  display: inline-block;
		  margin-left: 3/@rem;
		  border: solid 1/@rem #0d9737;
		  border-radius: 8/@rem;
		  color: #0d9737;
		  text-align: center;
		  font-weight: bold;
		}
	  }
	  .statistics {
		position: relative;
		top: -10/@rem;
		left: 5/@rem;
		color: #0d9737;
		.m-icon-live-statistic();
		&::before {
		  font-size: 16/@rem;
		  padding-right: 5/@rem;
		  position: relative;
		  left: 0;
		  top: 2/@rem;
		}
	  }
	}
	.bets-info {
	  padding: 18/@rem 12/@rem;
	}
	.bets-num {
	  font-size: 14/@rem;
	  color: #353a45;
	}
	.to-bet-detail {
	  font-size: 14/@rem;
	  color: #0d9737;
	}
	.to-live {
	  height: 34/@rem;
	  line-height: 34/@rem;
	  border-radius: 2/@rem;
	  margin-bottom: 11/@rem;
	  border: 1/@rem solid #0d9737;
	  text-align: center;
	  color: #0d9737;
	  .arrow {
		.m-icon-arrow--right();
		&::before {
		  color: #0d9737;
		  font-size: 16/@rem;
		  padding-right: 15/@rem;
		  position: relative;
		  left: 10/@rem;
		  top: 2/@rem;
		}
	  }
	}
}
</style>
