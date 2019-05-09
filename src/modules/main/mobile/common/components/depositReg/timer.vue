<template>
	<div class="timer-wrap">
		<div class="left">
			<div class="timer-block-title">Deal ends in</div>
			<div class="timer-block">
				<div class="timer-value">{{timeStr.hrs}}</div>
				<div class="timer-label">hrs</div>
			</div>
			<div class="timer-block">
				<div class="timer-value">{{timeStr.mins}}</div>
				<div class="timer-label">mins</div>
			</div>
			<div class="timer-block">
				<div class="timer-value">{{timeStr.secs}}</div>
				<div class="timer-label">secs</div>
			</div>
			<!-- <div class="timer-block">
				<div class="timer-value">{{timeStr.msecs}}</div>
				<div class="timer-label">msecs</div>
			</div> -->
		</div>
		<div class="right">
			<div class="timer-block-title">Sold</div>
			<div class="percent-value">{{percentStr}}</div>
			<div class="percent-wrap">
				<div class="percent-bar" :style="percentStyle"/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		timeout: {
			type: Number,
			'default': 0
		},
		percent: {
			type: Number,
			'default': 0
		}
	},
	data() {
		return {
			remain: this.timeout // ms
		};
	},
	watch: {
		timeout(value) {
			if (value < 0) {
				return;
			}
			clearInterval(this.interval);
			this.interval = null;
			this.remain = value;
			this.interval = setInterval(() => {
				this.remain -= 1;

				if (this.remain < 0) {
					clearInterval(this.interval);
					this.interval = null;
				}
			}, 1000);
		}
	},
	created() {

	},
	computed: {
		percentStr() {
			return `${this.percent}%`;
		},
		percentStyle() {
			return {
				width: this.percentStr
			};
		},
		timeStr() {
			let time = this.remain;
			if (time < 0) {
				return {
					hrs: 0,
					mins: 0,
					secs: 0,
					// msecs: 0
				};
			}

			// const msecs = this.formatNumber(time % 1000, 3);

			// time = Math.ceil(time / 1000);
			const secs = this.formatNumber(time % 60, 2);

			time = Math.floor(time / 60);
			const mins = this.formatNumber(time % 60, 2);

			time = Math.floor(time / 60);
			const hrs = this.formatNumber(time, 2);

			return {
				hrs,
				mins,
				secs,
				// msecs,
			};
		}
	},
	methods: {
		formatNumber(number, no) {
			const num = number + '';
			return num.padLeft(no, '0');
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.timer-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	.left {
		flex: 0 0 auto;
		margin-left: 20/@rem;
		margin-right: 37/@rem;
		text-align: left;
	}
	.right {
		flex: 1 1 auto;
		text-align: left;
		padding-right: 20/@rem;
	}
	.timer-block-title {
		margin-bottom: 2/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
		font-weight: 500;
		color: @white;
	}
	.timer-block {
		display: inline-block;
		width: 40/@rem;
		height: 36/@rem;
		background: black;
		.timer-value {
			font-size: 18/@rem;
			font-weight: 900;
			line-height: 22/@rem;
			color: @lightGreen;
			text-align: center;
		}
		.timer-label {
			font-size: 12/@rem;
			line-height: 14/@rem;
			color: @white;
			text-align: center;
		}
	}
	.percent-value {
		text-align: left;
		font-size: 20/@rem;
		line-height: 22/@rem;
		font-weight: 900;
		color: @white;
	}
	.percent-wrap {
		height: 10/@rem;
		padding: 2/@rem;
		width: 100%;
		background-color: #000000;
		border-radius: 10/@rem;
		.percent-bar {
			height: 10/@rem;
			width: 0;
			background: linear-gradient(to left, #25ff6d, #117332 98%);
			border-radius: 7/@rem;
		}
	}
}
</style>
