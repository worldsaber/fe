<template>
	<div class="m-ticket" :class="{
		'wide': isShowDate
	}">
		<!-- 当前年份不显示，剩下的一年显示一次 -->
		<div class="year" v-if="isShowYear">{{ticket.year}}</div>

		<div class="ticket-list" @click="handleChoose">
			<!-- 日期不重复显示 -->
			<div class="date" v-if="isShowDate">
				<div class="day">{{ticket.day}}</div>
				<div class="month">{{ticket.month}}</div>
			</div>

			<!-- 列表单块，点击进入详情，并传递orderId和combinationSize -->
			<div class="list">
				<!-- 状态条，赢为绿，输为灰，其他黑 -->
				<div class="bar" :class="{
					'win': isWon,
					'lost': isLost
				}">
					<span class="type">{{ticket.orderType}}
						<!-- combinationSize大于1时在括号里显示具体数字 -->
						<span v-if="ticket.combinationSize>1">(x{{ticket.combinationSize}})</span>
					</span>
					<!-- pending时显示红方块，赢显示奖杯 -->
					<span class="status" :class="{
						'block': isPending,
						'cup': isWon
						}">{{ticket.winningStatus}} <i class="arrow"></i></span>
				</div>

				<div class="title">
					<span>Total Stake({{currency}})</span>
					<span>Total Return</span>
				</div>

				<div class="total_info">
					<span>{{ticket.totalStake}}</span>
					<!-- 获奖金额在pending和running时显示双横杠，否则显示数值 -->
					<span v-if="isPending || isRunning" style="margin-top:-5px">--</span>
					<span v-else :class="{'green': isWon || isPartialWin}">{{ticket.totalWinnings}}</span>
				</div>

				<!-- odds boost -->
				<div class="order-boost" v-if="ticket.oddsBoosted">
					<img src="../../../../order/image/market-boost.svg"  class="boost-icon" />
					Live Odds Boost
				</div>
				<!-- flexbet订单 -->
				<div class="flexibet-title" v-if="ticket.originOrderType === 4">
					<i>F</i>Flex Your Bet {{ticket.minToWin}}+ of {{ticket.selectionSize}}
				</div>
				<!-- 对阵最多显示3组，多余三组提示more -->
				<ul class="teams" v-for="(selection, i) in ticket.selections" :key="i">
					<li v-if="i < 3">{{selection.home}} v {{selection.away}}</li>
					<li v-if="i === 3">… (and {{ticket.selections.length-3}} other
						<span v-if="ticket.selections.length && ticket.selections.length - 3 === 1">match</span>
						<span v-else>matches</span>)
					</li>
				</ul>
				<!-- pending状态提示 -->
				<p class="pending-statement" v-if="isPending">Your ticket is being reviewed. Please wait patiently.</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Ticket',
	props: {
		ticket: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			showDate: false,
			currency: window.currency,
		};
	},
	computed: {
		...mapState('order', [
			'ticketList',
		]),
		isShowYear() {
			const { year, showYear } = this.ticket;
			return year < new Date().getFullYear() && showYear;
		},
		isShowDate() {
			return this.ticket.showDate;
		},
		isWon() {
			return this.ticket.winningStatus === 'Won';
		},
		isPartialWin() {
			return this.ticket.winningStatus === 'Partial Win';
		},
		isLost() {
			return this.ticket.winningStatus === 'Lost';
		},
		isPending() {
			return this.ticket.winningStatus === 'Pending';
		},
		isRunning() {
			return this.ticket.winningStatus === 'Running';
		}
	},
	methods: {
		handleChoose() {
			this.$emit('choose', this.ticket.orderId);
		}
	}
};
</script>

<style lang="less" scoped>
@import "base/styles/variable.less";
@import "base/styles/icon.less";
@import "../../../../order/style/mixin";

.m-ticket {

	&.wide {
		// 避免rem计算误差修改
		border-top: 1px solid #eaecef;
		margin-top: -10 / @rem;
		padding-top: 10 / @rem;
	}

	&:first-child {
		margin-top: 0;
	}

	.year {
		text-align: center;
		margin-top: 30 / @rem;
		margin-bottom: 12 / @rem;
		font-size: 14 / @rem;
	}


	.ticket-list {
		padding-left: 50/@rem;
		position: relative;

		.date {
			color: #9ca0ab;
			position: absolute;
			left: 0;

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
			padding-bottom: 10 / @rem;
			margin-bottom: 9 / @rem;
			border-bottom: 1px solid #eaecef;

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
}
</style>
