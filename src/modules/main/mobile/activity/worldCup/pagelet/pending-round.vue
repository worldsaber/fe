<template>
	<div class="pending-history-wrap">
		<div class="m-score-header">
			<span class="m-round-time">{{item.categoryName}} {{item.tournamentName}}, {{time}}</span>
		</div>
		<div class="m-score-wrap">
			<div class="team-icon">
				<img :src="item.homeTeamIcon"/>
			</div>
			<span class="team-score">?</span>
			<div class="team-score-line"/>
			<span class="team-score">?</span>
			<div class="team-icon">
				<img :src="item.awayTeamIcon"/>
			</div>
		</div>
		<div class="team-name-wrap">
			<span class="team-name team-name-a">{{item.homeTeamName}}</span>
			<span class="team-name team-name-b">{{item.awayTeamName}}</span>
		</div>
		<a :href="matchUrl" class="match-url"> Bet Now on This Match to Win More > </a>
	</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import { sportPageById } from 'config/pageConfig';

export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	computed: {
		time() {
			return dateFormat.format(this.item.effectTime, 'DD/MM');
		},
		matchUrl() {
			const item = this.item;
			const sportId = item.sportId;
			// 判断状态： 未开始 、live
			const startTime = item.startTime;
			const now = +new Date();
			if (startTime < now) { // live
				return `${sportPageById[sportId]}live/${item.categoryId}/${item.tournamentId}/${item.eventId}`;
			}
			return `${sportPageById[sportId]}${item.categoryId}/${item.tournamentId}/${item.eventId}`;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';

.pending-history-wrap {
	margin-top: 10/@rem;
	padding: 16/@rem 10/@rem;
	background-image: linear-gradient(to top, #70a1e6, #659ef6);
	box-shadow: 0px 3px 8.4px 2.6px rgba(2, 4, 0, 0.23);
	border-radius: 2/@rem;
	.m-score-header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24/@rem;
		font-size: 13/@rem;
		line-height: 13/@rem;
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
		width: 100%;
		box-sizing: border-box;
		padding: 0 20/@rem;
		justify-content: space-between;
		align-items: center;
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
	.team-name-wrap{
		display: flex;
		width: 100%;
		box-sizing: border-box;
		padding: 0 20/@rem;
		justify-content: space-between;
		margin: 10/@rem 0;
	}
	.team-name {
		width: 50%;
		flex-basis: 50%;
		font-size: 12/@rem;
		line-height: 12/@rem;
		font-weight: 500;
		color: @white;
		text-align: left;
	}
	.team-name-b{
		text-align: right;
	}
	.match-url{
		display: inline-block;
		margin-top: 5/@rem;
		font-size: 12/@rem;
		color: #fef400;
	}
}
</style>
