<template>
	<section class="head">
		<div class="print-jp-tleft print-item">
			<h2>Jackpot</h2>
			<h3>Sporty {{pageData.firstPrizeCorrect}}</h3>
			<div>www.Sportybet.com</div>
		</div>
		<div class="time-left" v-if="!isClosed">
			<p class="title">Time Left</p>
			<p class="date">
				<span name="Days">{{indexTime.day||'0'}}</span>
				<span name="Hours">{{indexTime.hour||'0'}}</span>
				<span name="Minutes">{{indexTime.minute||'0'}}</span>
				<span name="Seconds">{{indexTime.second||'0'}}</span>
			</p>
		</div>
		<div class="closed-dec" v-else>
			<p>The Current Round is Closed</p>
		</div>
		<div class="win-prizes">
			<p class="title">
				<em>Predict {{pageData.firstPrizeCorrect}} GAMES </em>to Win</p>
			<p class="prizes">{{currency}}{{maxWinnings}} </p>
			<p class="dec">Prizes for {{pageData.secondPrizeCorrect}} and {{pageData.thirdPrizeCorrect}} correct predictions too!</p>
		</div>
	</section>
</template>
<script>
import { formatNumber } from 'utils';
import { mapState, mapActions } from 'vuex';
import * as mutationTypes from 'store/jackpot/mutationTypes';

export default {
	computed: {
		...mapState('jackpot', ['pageData']),
		leftTime() {
			const sec = this.pageData.leftTime || 0;
			return +sec;
		},
		maxWinnings() {
			return formatNumber(this.pageData.maxWinnings || 0);
		},
		currency() {
			return mutationTypes.SHOW_CURRENCY;
		}

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
					this.getPageData();
					this.isClosed = true;
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
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
.head {
	width: 1000px;
	min-width: 1000px;
	margin: 0 auto;
	height: 186px;
	color: white;
	text-align: right;
	.time-left {
		padding-top: 25px;
		text-align: left;
		float: left;
		.title {
			font-family: 'AvenirNext-Bold';
			font-size: 14px;
			color: #ffffff;
			letter-spacing: 0;
			line-height: 19px;
			padding-bottom: 5px;
		}
		.date {
			font-size: 0;
			line-height: 0;
			span {

				display: inline-block;
				height: 77px;
				min-width: 70px;
				background: black;
				border-radius: 2px;
				font-size: 46px;
				line-height: 77px;
				text-align: center;
				margin-right: 16px;
				position: relative;
				&:after {
					content: attr(name);
					display: block;
					font-size: 12px;
					height: 42px;
					line-height: 32px;
				}
				&:not(:last-of-type):before{
					content:":";
					display: inline-block;
					height: 42px;
					font-family: Roboto;
					font-size: 36px;
					font-weight: bold;
					color: @white;
					position: absolute;
					top: 0;
					right: -13px;
				}
			}
		}
	}
	.closed-dec {
		text-align: left;
		float: left;
		padding-top: 75px;
		font-size: 20px;
		line-height: 1;
	}
	.win-prizes {
		text-align: left;
		display: inline-block;
		font-size: 20px;
		padding: 37px 98px 0 0;
		.title{
			font-size: 20px;
			line-height: 1;
			font-weight: bold;
			em{
				color: @midGreen;
				margin-right: 6px;
			}
		}
		.prizes{
			font-size: 42px;
		}
		.dec{
			color: @midGreen;
		}
	}
}
</style>
