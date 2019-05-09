<template>
	<div class="m-guide-wrap">
		<div class="m-guide-mask" @click="close"/>
		<div class="m-guide-main">
			<i class="icon-close" @click="close"/>
			<div class="m-guide-head">PLAY GUIDES</div>
			<div class="m-guide-body">
				<div class="guide-title">The Basics</div>
				<p class="guide-para">Online roulette is a thrilling game where you must predict a correct outcome. Players must bet on Single numbers or a Range of numbers: red or black, and odd or even.</p>
				<p class="guide-para">Every selection you place (red, black, odd, even, single numbers or range of numbers) will have a cost of {{currency}} 10 per selection.</p>
				<div class="guide-title">Withdraw your Winnings</div>
				<p class="guide-para">Every time you win a round of Sporty Roulette, the winnings will automatically be added to your SportyBet account's Balance.</p>
				<p class="guide-para">It is possible to withdraw your winnings the same way you would withdraw your winnings from placing bets in SportyBet.</p>
				<div class="guide-title">Step 1</div>
				<p class="guide-para">Select a chip. A chip corresponds to the amount you wish to bet.</p>
				<img class="img-wrap" src="../images/help-1.png">
				<div class="guide-title">Step 2</div>
				<p class="guide-para">Place a chip on a Single number ("5"), areas which cover a Range of numbers ("2", "3" or "4"), colored areas ("1") for what you believe the outcome will be.</p>
				<p class="guide-para">It is possible to select more than 1 outcome ({{currency}} 10 per selection), kindly pay attention to the odds of each selection (e.g. "1:12", "1:2", ...).</p>
				<p class="guide-para">The lower the odds (1:12>1:3>1:2), the more you can win!</p>
				<img class="img-wrap" src="../images/help-2.png">
				<div class="guide-title-2"><span class="num-block">1</span>Red / Black</div>
				<p class="guide-para-2">Bet that the outcome will be a number either Red (numbers 1, 3, 5, 8, 10, 12) or Black (2, 4, 6, 7, 9, 11).</p>
				<p class="guide-para-2">Odds: 2 (1:2)  {{guidesList[0].limit}}</p>
				<div class="guide-title-2"><span class="num-block">2</span>Low / High</div>
				<p class="guide-para-2">Bet that the outcome will be a Low number (numbers 1 to 6) or a High number (numbers 7 to 12).</p>
				<p class="guide-para-2">Odds: 2 (1:2)  {{guidesList[1].limit}}</p>
				<div class="guide-title-2"><span class="num-block">3</span>Odd / Even</div>
				<p class="guide-para-2">Bet that the outcome will be an Odd number (1, 3, 5, 7, 9, 11) or an Even number (2, 4, 6, 8, 10, 12; excludes 0).</p>
				<p class="guide-para-2">Odds: 2 (1:2)  {{guidesList[2].limit}}</p>
				<div class="guide-title-2"><span class="num-block">4</span>Column Bets</div>
				<p class="guide-para-2">Bet that the outcome will be a number on the same line as the column: C1 (numbers 3, 6, 9, 12), C2 (numbers 2, 5, 8, 11) or C3 (numbers 1, 4, 7, 10).</p>
				<p class="guide-para-2">Odds: 3 (1:3)  {{guidesList[3].limit}}</p>
				<div class="guide-title-2"><span class="num-block">5</span>Straight</div>
				<p class="guide-para-2">Bet that the outcome will be a Single number of your choice (numbers 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12).</p>
				<p class="guide-para-2">Odds: 12 (1:12)  {{guidesList[4].limit}}</p>
				<div class="guide-title">Step 3</div>
				<p class="guide-para">After you select the possible outcomes, tap "SPIN" or "AUTO PLAY" to start!</p>
				<img class="img-wrap" src="../images/help-3.png">
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			currency: window.currency
		};
	},
	computed: {
		...mapState('roulette', ['guidesList'])
	},
	methods: {
		close() {
			this.$emit('toggleGuide', false);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
@keyframes move-in {
	0% {
		transform: translateY(100%); 
	}
	100% {
		transform: translateY(0);  
	}
}
.m-guide-wrap {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	height: 100vh;
	width: 100%;
	width: 100vw;
	z-index: 200;
	.m-guide-mask {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: @dark;
		opacity: 0.8;
	}
	.m-guide-main {
		animation: move-in 0.5s;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 70%;
		width: 100%;
		z-index: 1;
		.icon-close {
			position: absolute;
			top: -86/@rem;
			left: 50%;
			width: 22/@rem;
			height: 22/@rem;
			line-height: 22/@rem;
			text-align: center;
			border: 1px solid @white;
			border-radius: 50%;
			opacity: 0.8;
			.m-icon-close();
			&::before {
				font-size: 12/@rem;
				color: @white;
			}
		}
		.m-guide-head {
			position: absolute;
			left: 0;
			top: -46/@rem;
			line-height: 46/@rem;
			width: 100%;
			border-bottom: 1px solid rgba(216, 216, 216, 0.2);
			font-size: 22/@rem;
			color: @white;
			font-weight: bold;
			text-align: center;
			background-color: #6125C2;
		}
		.m-guide-body {
			height: 100%;
			box-sizing: border-box;
			overflow: auto;
			padding: 20/@rem;
			background: linear-gradient(to bottom, #6125C2, #5537ca 53%, #5438ca);
			.guide-title {
				font-size: 18/@rem;
				line-height: 24/@rem;
				margin-top: 12/@rem;
				margin-bottom: 10/@rem;
				color: @white;
				font-weight: bold;
			}
			.guide-para {
				font-size: 12/@rem;
				line-height: 14/@rem;
				color: @white;
				margin-bottom: 8/@rem;
			}
			.img-wrap {
				display: inline-block;
				margin-bottom: 12/@rem;
				width: 100%;
			}
			.guide-title-2 {
				margin-top: 12/@rem;
				line-height: 24/@rem;
				font-size: 16/@rem;
				color: @white;
				font-weight: bold;
				.num-block {
					margin-right: 12/@rem;
					width: 18/@rem;
					height: 18/@rem;
					display: inline-block;
					border-radius: 50%;
					border: 1px solid @white;
					line-height: 20/@rem;
					text-align: center;
					color: @white;
					font-size: 13/@rem;
					vertical-align: middle;
				}
			}
			.guide-para-2 {
				margin-bottom: 12/@rem;
				padding-left: 32/@rem;
				color: @white;
				font-size: 12/@rem;
				line-height: 12/@rem;
			}
		}
	}
}
</style>
