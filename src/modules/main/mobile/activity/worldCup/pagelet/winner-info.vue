<template>
	<div class="winner-info-wrap">
		<div class="winner-title">Winners' Information</div>

		<div class="loading-wrap" v-if="isLoading">
			<i class="m-icon-loading"></i>
			<span class="m-text-msg">Loading...</span>
		</div>
		
		<div class="winner-empty" v-else-if="isEmpty">
			<div class="empty-text">No Winners Yet!</div>
			<div class="route-home" @click="onBack">{{routeTitle}}<span class="arrow-right"></span></div>
		</div>
		<template v-else>
			<div class="winner-event" v-if="event">
				<div class="event-name">{{event.tournamentName}}</div>
				<div class="event-colmuns">
					<img :src="event.homeTeamIcon" alt="" class="event-icon">
					<div class="event-score">
						<div class="score">{{event.homeTeamScore}}<span class="split"> - </span>{{event.awayTeamScore}}</div>
						<div class="team">{{event.homeTeamName}} / {{event.awayTeamName}}</div>
					</div>
					<img :src="event.awayTeamIcon" alt="" class="event-icon">
				</div>
			</div>
			
			<div class="cash-gifts"> 
				<div class="title">Cash Gifts shared per Winner: </div>
				<div class="amount">{{giftsAmount}}</div>
			</div>

			<div class="round-wrap">
				<div class="title">This Round's Winners</div>
				<div class="amount">{{winnerAmount}}</div>
			</div>
			<div class="winner-list-wrap">
				<div class="title">Part of the Winners: </div>
				<ul class="winner-list">
					<li class="winner-item" v-for="(item, index) in phoneList" :key="index">{{item}}</li>
				</ul>
			</div>
		</template>

		<div class="winner-tips" v-if="!isLoading">
			<div class="que">How to get a Share of {{shareAmount}}</div>
			<div class="item">· Correctly predict the final score of a game.</div>
			<div class="item">· Successfully share your prediction as "Public".</div>
		</div>

	</div>
</template>
<script>
import { formatNumber } from 'utils';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { routeTitle, shareAmount } from '../js/config';

export default {
	data() {
		return {
			data: {},
			loading: false,
			routeTitle: routeTitle(),
			shareAmount: shareAmount(),
		};
	},
	computed: {
		event() {
			return this.data.eventVO;
		},
		giftsAmount() {
			const amount = this.data.giftAmount || 0;
			return `${showCurrencyOrigin} ${formatNumber(amount / 10000, 2)}`;
		},
		winnerAmount() {
			return this.data.correctCount;
		},
		phoneList() {
			return this.data.correctPhones;
		},
		isLoading() {
			return this.loading;
		},
		isEmpty() {
			return !this.data.eventVO;
		}
	},
	created() {
		this.getEventData();
	},
	methods: {
		getEventData() {
			this.loading = true;
			fetch('/promotion/v1/activities/score/winnings', {
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			})
			.then(res => res.json()).then(res => {
				const data = res.data;

				this.data = data;
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},
		onBack() {
			this.$router.back();
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.winner-info-wrap{
	.winner-title{
		color: #fef300;
		font-size: 18/@rem;
		font-weight: bold;
		padding: 20/@rem;
		text-align: center;
	}
	.winner-empty{
		text-align: center;
		margin-top: 100/@rem;
		.empty-text{
			font-size: 18/@rem;
			font-weight: bold;
			color: #FFF;
			padding: 20/@rem;
		}
		.route-home{
			font-size: 12/@rem;
			color: #f8e71c;
		}
		.arrow-right{
			padding-left: 5/@rem;
			.m-icon-arrow--right();
			&::before{
				font-size: 12/@rem;
			}
		}
	}
	.winner-tips{
		margin-top: 100/@rem;
		padding: 0 30/@rem 50/@rem;
		font-size: 12/@rem;
		color: #FFF;
	}
	.winner-event{
		margin: 20/@rem;
		padding: 15/@rem 20/@rem;
		background-image: linear-gradient(to bottom, #0078d9, #55a4e7);
		box-shadow: 0 6px 8px 0 #023b8d;
		border-radius: 4/@rem;
		text-align: center;
		color: #FFF;
		.event-name{
			font-size: 12/@rem;
			font-weight: bold;
		}
		.event-colmuns{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10/@rem;
		}
		.event-icon{
			width: 40/@rem;
			height: 40/@rem;
			border-radius: 20/@rem;
		}
		.event-score{
			flex: 1;
			margin: 0 5/@rem;
			overflow: hidden;
			.score{
				font-size: 24/@rem;
			}
			.team{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.title{
		font-size: 14/@rem;
		color: #FFF;
		font-weight: bold;
		text-align: center;
		margin: 36/@rem 0 10/@rem;
	}
	.amount{
		font-size: 26/@rem;
		color: #fef300;
		font-weight: bold;
		text-align: center;

	}
	.winner-list{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 40/@rem;
		flex-wrap: wrap;
		color: #FFF;
		font-size: 12/@rem;
		font-weight: bold;
		line-height: 32/@rem;
		.winner-item{
			flex-basis: 30%;
			text-align: center;
		}
	}

	.loading-wrap{
		color: #FFF;
		text-align: center;
		margin-top: 50/@rem;
		font-size: 16/@rem;
		.m-icon-loading {
			.m-icon-loading-circle();
			&:before {
				margin-right: 15/@rem;
				animation: loading-rotate 2s linear infinite;
				display: inline-block;
				vertical-align: top;
			}
		}
	}
}
@keyframes loading-rotate {
	100% {
		transform: rotate(360deg);
	}
}
</style>


