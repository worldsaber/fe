<template lang="html">
	<AfButton
		:class="getBtnCls"
		extraType="info"
		@click.prevent.stop="handleClick"
		:disabled="!isReady">{{btnText}}</AfButton>
</template>

<script>
import AfButton from 'packages/button/button.vue';

export default {
	name: 'loginTimer',
	components: {
		AfButton
	},
	props: {
		showBackground: {
			type: Boolean,
			'default': false
		},
		isStartTimer: {
			type: Boolean,
			'default': false
		},
		isStopTimer: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			isReady: true,
			count: 0,
			timerId: null
		};
	},
	computed: {
		getBtnCls() {
			return [
				'm-timer',
				{
					'm-button--disable': !this.isReady,
					'm-button--text': !this.showBackground
				}
			];
		},
		btnText() {
			if (this.count) {
				return `Send Again(${this.count}s)`;
			}
			return 'Send Again';
		}
	},
	methods: {
		timer() {
			clearTimeout(this.timerId);
			if (this.count === 0) {
				return;
			}
			this.timerId = setTimeout(() => {
				this.count -= 1;
				this.timer();
			}, 1000);
		},
		handleClick() {
			if (!this.isReady) {
				return;
			}

			this.$emit('timerClick');

			if (this.isStartTimer) {
				this.startTimer();
			}
		},
		stopTimer() {
			this.timerId && clearTimeout(this.timerId);
			this.isReady = true;
			this.count = 0;
		},
		startTimer() {
			this.count = 60;
			this.timer();
			this.isReady = false;
		}
	},
	watch: {
		count(val) {
			!val && (this.isReady = true);
		},
		isStartTimer(val, oldVal) {
			if (val) {
				this.startTimer();
			} else {
				this.stopTimer();
			}
		},
		isStopTimer(val, oldVal) {
			if (val) {
				this.stopTimer();
			}
		}
	},
	mounted() {
		if (this.isStartTimer) {
			this.startTimer();
		} else {
			this.stopTimer();
		}
	},
	destroyed() {
		this.stopTimer();
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-button--disable{
	font-size: 12px;
}
.m-button--text {
	background: transparent !important;
	border-color: transparent !important;
	color: @linkBlue !important;
}
</style>
