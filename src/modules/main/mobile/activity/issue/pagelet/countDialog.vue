<template>
	<div class="m-issue-count">
		<div class="m-count-header">
			<img class="m-count-clock" src="../image/clock.svg"/>
			<h1 class="m-count-title">Counting...</h1>
		</div>
		<div class="m-count-football-quiz">
			<img class="football-quiz-icon" src="../image/football-quiz.png"/>
		</div>
		<div class="m-count-next">Next Round</div>
		<p class="m-count-date" v-if="contentData.nextPeriodTime">{{showNextDate}}<span>{{showNextTime}}</span></p>
		<p class="m-count-date" v-else>Coming Soon!</p>
	</div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat.js';

export default {
	data() {
		return {

		};
	},
	computed: {
		showNextDate() {
			if (this.contentData.nextPeriodTime) {
				return dateFormat.format(this.contentData.nextPeriodTime, 'dddd HH:mm ');
			}
			return '';
		},
		showNextTime() {
			if (this.contentData.nextPeriodTime) {
				return dateFormat.format(this.contentData.nextPeriodTime, 'MMMM Do');
			}
			return '';
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-issue-count {
	background-image: linear-gradient(to bottom, #2b0098, #7c2bb7);
	.m-count-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 97/@rem;
		padding-bottom: 56/@rem;
		.m-count-clock {
			flex: 0 0 auto;
			width: 24/@rem;
			height: 24/@rem;
			margin-right: 16/@rem;
		}
		.m-count-title {
			flex: 0 0 auto;
			font-size: 24/@rem;
			line-height: 28/@rem;
			font-weight: bold;
			color: #ffa600;
		}
	}
	.m-count-football-quiz {
		text-align: center;
		.football-quiz-icon {
			height: 23/@rem;
		}
	}
	.m-count-next {
		margin-top: 16/@rem;
		margin-bottom: 3/@rem;
		text-align: center;
		font-size: 16/@rem;
		color: @white;
		opacity: 0.4;
	}
	.m-count-date {
		padding-bottom: 38/@rem;
		font-size: 24/@rem;
		font-weight: bold;
		text-align: center;
		color: @white;
		line-height: 28/@rem;
		span {
			font-size: 16/@rem;
			line-height: 20/@rem;
		}
	}
}
</style>
