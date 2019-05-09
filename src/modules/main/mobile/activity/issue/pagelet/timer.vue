<template>
<div class="m-issue-timer">
	<svg width="440" height="440" class="svg-timer" viewBox="0 0 440 440">
		<circle cx="220" cy="220" r="190" stroke-width="40" :stroke="`${isSpectator ? '#9ca0ab' : '#ffa600'}`" fill="none" display="block"></circle>
    	<circle class="color-circle" ref='circle' cx="220" cy="220" r="190" stroke-width="50" stroke="#ffffff" fill="none" display="block"></circle>
	</svg>
	<div v-if="status==='right'" class="m-issue-clock right">
		<i class="icon-right"/>
	</div>
	<div v-else-if="status==='wrong'" class="m-issue-clock wrong">
		<i class="icon-wrong"/>
	</div>
	<div v-else :class="`m-issue-clock ${startClock ? 'start' : ''} ${isSpectator ? 'spectator' : ''}`">{{clock}}</div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import 'kernel/js/animateFrame.js';

export default {
	props: {
		startTime: {
			type: Number,
			'default': (new Date()).getTime() + 14000
		},
		status: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			deg: 180,
			clock: 12,
			startClock: false,
			animateId: ''
		};
	},
	created() {

	},
	mounted() {
		this.start();
	},
	beforeDestroy() {
		cancelAnimationFrame(this.animateId);
	},
	computed: {
		...mapState('issue', [
			'timeConfig',
			'isSpectator',
			'timeConfig'
		]),
	},
	watch: {
		startTime() {
			cancelAnimationFrame(this.animateId);
			this.startClock = false;
			this.clock = this.timeConfig.answeringTime;
			this.start();
		}
		// clock() {
		// 	if (this.clock < 4 && !this.isSpectator) {
		// 		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
		// 		navigator.vibrate(200);
		// 	}
		// }
	},
	methods: {
		start() {
			if (!this.startTime) {
				return;
			}
			const circle = this.$refs.circle,
				startTime = this.startTime - (this.timeConfig.answeringTime * 1000),
				speed = 100 / (this.timeConfig.answeringTime * 1000),
				perimeter = Math.PI * 2 * 190;

			const loop = () => {
				let time,
					percent;
				if (this.startTime) {
					this.animateId = requestAnimationFrame(timestamp => {
						let now;
						if (window.supportRequestAF) {
							// now = timestamp + performance.timing.navigationStart;
							now = Date.now();
						} else {
							now = timestamp;
						}
						if (now < startTime) {
							if (this.startClock) {
								this.startClock = false;
							}
							loop();
						} else {
							time = now - startTime;
							if (!this.startClock) {
								this.startClock = true;
							}
							if (time > this.timeConfig.answeringTime * 1000) {
								time = this.timeConfig.answeringTime * 1000;
							}
							this.clock = this.timeConfig.answeringTime - Math.floor(time / 1000);

							percent = time * speed / 100;

							if (percent > 0 && percent < 1) {
								circle.setAttribute('stroke-dasharray', `${perimeter * percent} ${perimeter * (1 - percent)}`);
								loop();
							} else if (percent >= 1) {
								this.$emit('end');
								cancelAnimationFrame(this.animateId);
							}
						}
					});
				}
			};
			loop();
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-issue-timer {
    width: 60/@rem;
    height: 60/@rem;
    position: relative;
    border-radius: 50%;
    background-color: @white;
    font-size: 0;

    .svg-timer {
        width: 56/@rem;
        height: 56/@rem;
        position: absolute;
        top: 2/@rem;
        left: 2/@rem;

		.color-circle {
			transform: rotate(-90.1deg);
			transform-origin: center;
		}
    }
    .m-issue-clock {
        position: absolute;
        height: 44/@rem;
        width: 44/@rem;
        border-radius: 50%;
        top: 8/@rem;
        left: 8/@rem;
        font-size: 24/@rem;
		font-weight: bold;
        text-align: center;
        line-height: 44/@rem;
        color: @white;
        background-color: #ffa600;
		&.start {
			background-color: @white;
			color: #ffa600;
		}
		&.right {
			background-color: #0bd19a;
			color: @white;
			.icon-right {
				.m-icon-success();
				&::before {
					font-size: 20/@rem;
				}
			}
		}
		&.wrong {
			background-color: #ff175f;
			color: @white;
			.icon-wrong {
				.m-icon-close();
				&::before {
					font-size: 20/@rem;
				}
			}
		}
		&.spectator {
			background-color: @white;
			color: #9ca0ab;
		}
    }
}
</style>
