<template>
	<section class="head"  :style="{'background-image':headbge}">
		<div class="win-prizes">
			<p class="title">
				<em>Predict {{gameSize || '--'}} GAMES to Win</em></p>
			<p class="prizes">{{currency}} {{maxWinnings}} </p>
			<p class="dec">Prizes for {{pageData.secondPrizeCorrect || '--'}} and {{pageData.thirdPrizeCorrect || '--'}} correct predictions too!</p>
		</div>
		<div class="time-left" v-if="!isClosed">
			<p class="date">
				<span name="Days">{{indexTime.day||'0'}}</span>
				<span name="Hours">{{indexTime.hour||'0'}}</span>
				<span name="Min.">{{indexTime.minute||'0'}}</span>
				<span name="Sec.">{{indexTime.second||'0'}}</span>
			</p>
		</div>
		<div class="closed-dec" v-else>
			<p>The Current Round is Closed</p>
		</div>

	</section>
</template>
<script>
import { formatNumber } from 'utils';
import { mapState, mapActions } from 'vuex';
import * as mutationTypes from 'store/jackpot/mutationTypes';

const topBg = require('../img/background.jpg');

export default {
	computed: {
		...mapState('jackpot', ['pageData', 'gameSize']),
		leftTime() {
			const sec = this.pageData.leftTime || 0;
			return +sec;
		},
		maxWinnings() {
			return formatNumber(this.pageData.maxWinnings || 0);
		},
		currency() {
			return mutationTypes.SHOW_CURRENCY;
		},
		headbge() {
			return `url(${this.pageData.bgImage || this.defaultBg})`;
		},
	},
	watch: {
		leftTime(val) {
			if (val > 0 && this.pageData.status === 1) {
				this.isClosed = false;
				this.count(val);
			} else {
				this.isClosed = true;
			}
		}
	},

	data() {
		return {
			indexTime: {},
			isClosed: false,
			defaultBg: topBg,
		};
	},
	methods: {
		...mapActions('jackpot', ['getPageData']),
		count() {
			let sec = this.leftTime;
			if (this.timer) {
				clearInterval(this.timer);
			}
			this.timer = setInterval(() => {
				sec -= 1;
				this.indexTime = this.formatTime(sec);
				if (sec <= 0) {
					this.isClosed = true;
					this.getPageData();
					clearInterval(this.timer);
				} else {
					this.indexTime = this.formatTime(sec);
				}
			}, 1000);
		},
		formatTime(sec) {
			const date = {
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
			};
			if (sec <= 0) {
				return date;
			}
			// 这边是重点
			date.day = Math.floor(sec / 86400);
			date.hour = Math.floor(sec % 86400 / 3600);
			date.minute = Math.floor(sec % 86400 % 3600 / 60);
			date.second = Math.floor(sec % 86400 % 3600 % 60);

			return date;
		}
	},
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
.head {
	width: 100%;
	margin: 0 auto;
	height: 230/@rem;
	color: white;
	background-position: top left;
	background-size: 100%;
	background-repeat: no-repeat;
	.time-left {
		padding-top: 15/@rem;
		text-align: left;

		.date {
			font-size: 0;
			line-height: 0;
			padding: 18/@rem 0 0 16/@rem;
			span {
				display: inline-block;
				height: 41/@rem;
				width: 41/@rem;
				background: @blackBorder;
				border-radius: 4/@rem;
				font-size: 26/@rem;
				line-height: 41/@rem;
				text-align: center;
				margin-right: 8/@rem;
				position: relative;
				z-index: 10;
				&::before {
					content: attr(name);
					display: block;
					width: 100%;
					font-size: 10/@rem;
					height: 18/@rem;
					line-height: 18/@rem;
					position: absolute;
					top: -20/@rem;
					z-index: 9;
				}
				&::after{
					content: '';
					display: block;
					font-size: 0;
					line-height: 0;
					height: 1px;
					width: 100%;
					background:@darkGrayBorder;
					position: absolute;
					top: 21/@rem;
					z-index: 11;
				}
			}
		}
	}
	.closed-dec {
		text-align: left;
		float: left;
		padding: 40/@rem 20/@rem 0;
		font-size: 14/@rem;
		line-height: 1;
	}
	.win-prizes {
		text-align: left;
		display: block;
		font-size: 15/@rem;
		padding: 65/@rem 20/@rem 0;
		.title{
			line-height: 1;
			font-weight: bold;
			padding-bottom: 2/@rem;
			em{
				font-weight: bold;
				margin-right: 6/@rem;
			}
		}
		.prizes{
			font-size: 27/@rem;
			color: @yellow;
		}
		.dec{
			color: @midGreen;
			font-size: 10/@rem;
			font-weight:bold;
		}
	}
}
</style>
