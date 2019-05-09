<template>
	<div class="m-history-wrap">
		<div class="m-score-header">
			<span class="m-round-time">{{item.categoryName}} {{item.tournamentName}}, {{time}}</span>
			<div class="m-result-wrap" v-if="isFinal">Final: {{realScore}}</div>
		</div>
		<div class="m-score-wrap">
			<div class="team-icon">
				<img :src="item.homeTeamIcon"/>
			</div>
			<div class="team-player-wrap">
				<div class="team-score-wrap"> 
					<span class="team-score">{{item.homeScore}}</span>
					<div class="team-score-line"/>
					<span class="team-score">{{item.awayScore}}</span>
				</div>
				<div class="team-name">{{item.homeTeamName}} / {{item.awayTeamName}}</div>
			</div>
			<div class="team-icon">
				<img :src="item.awayTeamIcon"/>
			</div>
		</div>
		<div class="round-tip" v-if="item.isFirstFinal">
			<div class="round-won" v-if="isRight">
				<span class="icon-cup"></span>You won <span class="text-em">{{item.giftAmountText}}</span> this round! Go to <a class="text-em gift-link" :href="giftsUrl">"Gifts"</a> to check.
			</div>
			<div class="round-lose" v-else>Incorrect Score! Only Your First Prediction is Valid!</div>
		</div>
	</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import { pagePath } from 'config/pageConfig';

export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			giftsUrl: pagePath.gifts,
		};
	},
	computed: {
		time() {
			return dateFormat.format(this.item.deadLine, 'DD/MM');
		},
		isFinal() {
			return this.item.isFinal;
		},
		homeScore() {
			const score = this.item.realHomeScore;
			return score >= 0 ? score : '';
		},
		awayScore() {
			const score = this.item.realAwayScore;
			return score >= 0 ? score : '';
		},
		realScore() {
			return this.isFinal ? `${this.homeScore} - ${this.awayScore}` : '--';
		},
		isRight() {
			return this.item.homeScore === this.item.realHomeScore && this.item.awayScore === this.item.realAwayScore;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';

.m-history-wrap {
	margin-top: 10/@rem;
	padding-top: 10/@rem;
	background-color: #047ad9;
	border-radius: 4/@rem;
	overflow: hidden;
	.m-score-header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 25/@rem;
		padding: 0 10/@rem;
		font-size: 10/@rem;
		line-height: 10/@rem;
		.m-round-time {
			flex: 1 1 auto;
			font-weight: 500;
			color: @white;
			text-align: left;
		}
		.m-result-wrap {
			flex: 0 0 auto;
			font-weight: 500;
			color: @white;
		}
		.m-round-result {
			vertical-align: middle;
			color: #fee900;
		}
		.m-icon-right {
			vertical-align: middle;
			.m-icon-arrow--right();
			margin-left: 2/@rem;
			line-height: 12/@rem;
			&::before {
				font-size: 12/@rem;
				color: #fee900;
			}
		}
	}
	.m-score-wrap {
		display: flex;
		// width: 100%;
		margin: 10/@rem 0;
		padding: 0 10/@rem;
		align-items: center;
		justify-content: center;
		.team-icon {
			flex: 0 0 40/@rem;
			height: 40/@rem;
			width: 40/@rem;
			border-radius: 50%;
			overflow: hidden;
			img {
				height: 100%;
				width: 100%;
			}
		}
		.team-player-wrap{
			flex-grow: 1;
		}
		.team-score-wrap{
			display: flex;
			height: 24/@rem;
			justify-content: center;
			align-items: center;
		}
		.team-name {
			flex: 1 1 auto;
			margin: 4/@rem;
			font-size: 10/@rem;
			line-height: 12/@rem;
			font-weight: 500;
			color: @white;
			text-align: center;
		}
		.team-score {
			flex: 0 0 auto;
			font-size: 24/@rem;
			line-height: 24/@rem;
			text-align: center;
			color: @white;
		}
		.team-score-line {
			flex: 0 0 auto;
			width: 12/@rem;
			height: 2/@rem;
			margin: 0 12/@rem;
			background-color: @white;
		}
	}
	.round-tip{
		font-size: 11/@rem;
		line-height: 22/@rem;
		.round-won{
			padding: 0 10/@rem 0 5@rem;
			background-color: #f8e71c;
			// border-bottom-left-radius: 4/@rem;
			// border-bottom-right-radius: 4/@rem;
			color: #3b029a;
			
			.text-em{
				font-weight: bold;
				color: #3b029a;
				&.gift-link{
					text-decoration: underline;
				}
			}
		}
		.round-lose{
			padding: 0 10/@rem;

			color: #FFF;
			background: #0447a8;
		}
		.icon-cup{
			padding: 0 5/@rem;
			.m-icon-wincup();
			color: #eebd18;
			&::before{
				font-size: 14/@rem;
			}
		}
	}
}
</style>
