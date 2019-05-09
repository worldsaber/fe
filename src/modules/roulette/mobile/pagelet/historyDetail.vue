<template>
	<div class="history-detail-wrapper" v-loading:loading="detailLoading">
		<template v-if="!detailLoading">
			<div class="back-area">
				<div class="back-btn" @click="back">Details</div>
			</div>
			<div class="bet-info">
				<div class="bet-info-row">
					<div class="left">Status</div>
					<img class="right cup" src="../images/big-cup.png" v-if="betDetail.statusStyle==='won'">
					<div :class="['right',betDetail.statusStyle]">{{betDetail.status}}</div>
				</div>
				<div class="bet-info-row">
					<div class="left">Stake ({{currency}}) </div>
					<div class="right">{{betDetail.stake}}</div>
				</div>
				<div class="bet-info-row" v-if="+betDetail.bonus > 0">
					<div class="left">Rewards</div>
					<div class="right">{{betDetail.bonus}}</div>
				</div>
				<div class="bet-info-row">
					<div class="left">Result</div>
					<div class="right result" :style="`background:${betDetail.color}`">{{betDetail.result}}</div>
					<div class="right rebet" @click="rebet">Rebet</div>
				</div>
			</div>
			<section class="split">My Bets</section>
			<div class="bet-detail-wrap">
				<div class="bet-detail-area" v-for="item in betDetail.betInfo" :key="item.name">
					<p class="odds">{{item.name}} (Odds: {{item.odds}})<img class="cup" v-if="item.winning" src="../images/small-cup.png"/></p>
					<div class="balls">
						<p v-for="(info,i) in item.selections" :key="i" :class="[{'info':item.name==='Straight'},{'red-black':item.name==='Red/Black'}]">
							<span v-if="info.selection==='Red'||info.selection==='Black'" :class="['selection',{'red':info.selection==='Red'},{'black':info.selection==='Black'}]"></span>
							<span :class="{'ball':item.name==='Straight'}" :style="item.name==='Straight'?`background:${info.color}`:''">{{info.selection}} </span>
							<span class="stake">({{currency}} {{info.stake}})</span>
							<i class="check" v-if="info.winning"></i>
						</p>
					</div>
				</div>
				<div class="ticket-info-area seperate">
					<div class="left">
						<p>Ticket ID</p>
						<p>Time</p>
					</div>
					<div class="right">
						<p>{{betDetail.ticketId}}</p>
						<p>{{betDetail.placeTime}}</p>
					</div>
				</div>
				<div class="check-transaction-wrap" @click="goTransaction">
					<div class="left">Check Transaction  History</div>
					<i class="right icon-arrow"/>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus';
import { baseUrl } from '../../../common-wap/config/pageConfig';

export default {
	data() {
		return {
			currency: window.currency,
		};
	},
	props: ['betDetail', 'detailLoading'],
	methods: {
		rebet() {
			this.$parent.$emit('close');
			EventBus.$emit('rebet', this.betDetail.betInfoDetail);
		},
		back() {
			this.$emit('back2History');
		},
		goTransaction() {
			if (this.betDetail && this.betDetail.ticketId) {
				location.href = `${baseUrl}my_accounts/transactions/#search?keyword=${this.betDetail.ticketId}`;
			}
		}
	},
	mounted() {
		document.querySelector('.roulette-history-mask').addClass('detail');
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
	
	.detail {
		height: 100% !important;
		position: absolute;
		z-index: 2;
	}
	.history-detail-wrapper {
		background: linear-gradient(to bottom, #4d1aae, #5d44dd);
		border-top: 1px solid rgba(216, 216, 216, 0.2);
		width: 100vw;
		min-height: 80%;
		color: #fff;
		font-size: 13/@rem;
		font-weight: 600;
		animation: right-to-left 0.2s;
		animation-fill-mode: forwards;
		position: absolute;
		top: 20%;
		z-index: 3;
        @keyframes right-to-left
        {
            0% {left: 100vw}
            25% {left: 75vw}
            50% {left: 50vw}
            75% {left: 25vw}
            100% {left: 0vw}
        }
		.back-area {
			padding: 0 12/@rem;
			height: 48/@rem;
			line-height: 48/@rem;
			border-bottom: 1px solid rgba(216, 216, 216, 0.2);
			.back-btn {
				display: inline-block;
				background: #000;
				width: 74/@rem;
				height: 22/@rem;
				border-radius: 8/@rem;
				border: solid 1px transparent;
				line-height: 22/@rem;
				text-align: center;
				.m-icon-back();
				&:before {
					font-size: 12/@rem;
					margin-right: 3/@rem;
				}
			}
		}
		.seperate {
			display: flex;
			justify-content: space-between;
		}
		.bet-info {
			padding: 10/@rem 12/@rem;
			.bet-info-row {
				display: flex;
				align-items: center;
				justify-content: center;
				.left {
					flex: 1 1 auto;
					line-height: 32/@rem;
					font-size: 16/@rem;
					color: @white;
					font-weight: 600;
				}
				.right {
					flex: 0 0 auto;
					margin-left: 10/@rem;
					line-height: 32/@rem;
					font-size: 16/@rem;
					color: @white;
					font-weight: 600;
					&.cup {
						height: 24/@rem;
					}
					&.won {
						color: #ffc600;
					}
					&.running {
						color: #00d8ff;
					}
					&.result {
						width: 22/@rem;
						height: 22/@rem;
						margin: 0 12/@rem 0 5/@rem;
						line-height: 22/@rem;
						border-radius: 11/@rem;
						text-align: center;
					}
					&.rebet {
						width: 48/@rem;
						height: 20/@rem;
						background-image: linear-gradient(to bottom, #16b219, #1ace1d);
						border-bottom: 1px solid transparent;
						line-height: 20/@rem;
						text-align: center;
						border-radius: 10/@rem;
						font-size: 12/@rem;
					}
				}
			}
		}
		.split {
			background: #29145f;
			line-height: 32/@rem;
			font-size: 14/@rem;
			text-align: center;
		}
		.bet-detail-area {
			padding: 0 0 25/@rem;
			border-bottom: 1px solid rgba(216, 216, 216, 0.2);
			.odds {
				margin: 19/@rem 0 15/@rem;
			}
			.cup {
				width: 20/@rem;
				height: 20/@rem;
				margin-left: 15/@rem;
			}
			.check {
				.m-icon-success();
				&:before {
					position: relative;
					top: 13px;
					left: -40px;
					font-size: 22/@rem;
					color: #7bc124;
				}
			}
			
			.info{
				position:relative;
				.check {
					.m-icon-success();
					&:before {
						position: absolute;
						top: 25px;
						left: 83px;
						font-size: 22/@rem;
						color: #7bc124;
					}
				}
			}
			.red-black:first-child {
				margin-bottom: 10/@rem;
			}
			.stake {
				margin-right: 23/@rem;
				font-size: 12/@rem;
				font-weight: 100;
				
			}
			.balls {
				display: flex;
				flex-flow: row wrap;
				align-items: baseline;
			}
			.selection {
				width: 27/@rem;
				height: 17/@rem; 
				margin-left: 12/@rem;
				margin-right: 20/@rem;
				display: inline-block;
				transform: skew(59deg,151deg);
			}
			.red {
				background: #e41827;
			}
			.black {
				background: #000;
			}
			.ball {
					display: inline-block;
					width: 22/@rem;
					height: 22/@rem;
					margin: 23/@rem 4/@rem 0;
					line-height: 22/@rem;
					border-radius: 11/@rem;
					text-align: center;
				}
		}
		.ticket-info-area {
			padding: 18/@rem 0;
			font-weight: 100;
			.left p:first-child, .right p:first-child {
				margin-bottom: 15/@rem;
			}
			.right {
				text-align: right;
			}
		}
		.check-transaction-wrap {
			border-top: 1px solid rgba(216, 216, 216, 0.2);
			border-bottom: 1px solid rgba(216, 216, 216, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 42/@rem;
			.left {
				flex: 1 1 auto;
				font-size: 14/@rem;
				font-weight: 600;
			}
			.right {
				flex: 0 0 auto;
				.m-icon-arrow--right();
			}
		}
		.bet-detail-wrap {
			padding: 0 12/@rem 12/@rem;
		}
	}
</style>
