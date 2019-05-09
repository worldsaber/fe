<template>
	<div class="m-animate-roulette-wrap">
		<div :class="['m-animate-roulette-container', `m-animate-roulette--${type}`]">
			<div class="m-animate-roulette-pane">
				<div class="m-roulette-pane-base">
					<img src="./images/roulette-base.png">
				</div>

				<div class="m-roulette-pane-main" ref="paneMain">
					<img src="./images/roulette-main.png" id="numbers-pane" ref="numbersPane">
				</div>

				<div class="m-roulette-pane-center" ref="paneCenter">
					<img src="./images/roulette-center.png">
				</div>

				<div class="m-roulette-pane-ball" id="m-ball-base" ref="ballBase">
					<div class="m-ball-wrap" id="m-ball" ref="ball">
						<img src="./images/roulette-ball.png">
					</div>
				</div>
			</div>

			<!-- 自动开始 -->
			<template v-if="type === 'auto'">
				<div class="m-animate-roulette-desc">{{showDescText}}</div>

				<div :class="['m-animate-roulette-btn', {
					disabled: isStop || isComplete
				}]" @click.stop="handleStopAuto"></div>
			</template>
		</div>
	</div>
</template>

<script>
import anime from 'animejs';
import { EventBus } from 'kernel/js/eventBus';
import visibilitychange from 'utils/visibilitychange.js';

/*
 合运动说明，共分3部分：
 	1. paneMain (数字盘): 先作匀速圆周运动，当小球相对运动停止时，减速到静止；
 	2. ballBase (小球基座): 主要用来带动小球作圆周运动，先做贝塞尔圆周运动，当小球相对运动停止时，同步paneMain作减速运动到静止；
 	3. ball (小球): 小球对ballBase作相对运动，根据贝塞尔曲线，运动到内环后相对静止，跟随数字盘一同停止。
 */

// 根据转盘上的数字顺序，从左侧水平位置按顺时针方向得到 -- 注意，换图换数字
const NUMS = [11, 3, 6, 8, 9, 10, 4, 1, 7, 0, 12, 2, 5];

const baseSpeed = 4000; // 4s 一圈（数字盘）
const numbersPaneBoundarRatio = 36 / 97; // 数字盘内圈所占比例

// 减速运动
const negativeConfig = {
	easing: [0.56, 0.49, 1, -0.13],
	duration: baseSpeed
};

export default {
	name: 'AnimateRoulette',
	data() {
		return {
			type: 'default', // 转盘运动类型： 手动，auto(自动)
			target: -1, // 目标值
			leftCount: 0, // 剩余次数
			awardPercent: 0, // 返奖百分比（不带百分号）
			isStop: false,
			isComplete: false, // 轮盘是否停止
			isStopClicked: false,
			animNumbers: null,
			animBaseFirst: null,
			animBase: null,
			animBall: null,
			baseConfig: {}, // ball base anime 参数
			ballConfig: {}, // ball anime 参数
			keyframe: {} // 关键帧
		};
	},
	computed: {
		showDescText() {
			if (this.isComplete && this.isStopClicked) {
				return '';
			}
			if (this.isComplete && this.leftCount > 0) {
				return 'Next round about to start...';
			}

			if (this.awardPercent > 0) {
				return `${this.leftCount} round(s) left to get your ${this.awardPercent}% stake returned`;
			}
			return `${this.leftCount} round(s) left`;
		}
	},
	watch: {
		target() {
			this.start();
		}
	},
	methods: {
		handleStopAuto() {
			if (this.isStop) return;
			EventBus.$emit('stop_auto_play');
			this.isStop = true;
			this.isStopClicked = true;
		},
		moveNumbers() {
			const { numbersPane } = this.$refs;
			if (numbersPane) {
				// reset
				anime.remove('#numbers-pane');
				numbersPane.style = '';
			}

			this.animNumbers = anime({
				targets: '#numbers-pane',
				rotate: [{
					value: `${-1}turn`,
					easing: 'linear',
					duration: baseSpeed
				}, {
					value: `${-2}turn`,
					...negativeConfig
				}],
				update: anim => {
					if (this.isComplete) return;
					// 游戏结束
					if (anim.currentTime >= 2000 + (baseSpeed)) {
						this.stop();
					}
				}
			});
		},
		// 生成运动配置参数
		generateConfig() {
			const ballDutaion = baseSpeed;
			const ballDelay = baseSpeed;

			this.ballConfig = Object.assign({}, {
				duration: ballDutaion / 2,
				delay: ballDelay / 2
			});

			// ball运动带来的角度偏差
			const deviation = (ballDutaion / baseSpeed % 1);

			const targetIndex = NUMS.findIndex(x => x === this.target);
			const baseConfig = {
				turns: (targetIndex / NUMS.length) + anime.random(3, 5) - deviation,
				duration: baseSpeed
			};
			this.baseConfig = Object.assign({}, baseConfig);
			return baseConfig;
		},
		// 计算关键帧，主要是终点位置
		getKeyframe() {
			const { paneMain, paneCenter, ballBase, ball } = this.$refs;

			if (ball) {
				// reset
				anime.remove('#m-ball');
				ball.style = '';
			}

			const rMain = paneMain.offsetWidth / 2;
			const rCenter = paneCenter.offsetWidth / 2;
			const rBallBase = ballBase.offsetWidth / 2;
			const rBall = ball.offsetWidth / 2;

			const x = rBallBase - rCenter - rBall - (numbersPaneBoundarRatio * (rMain - rCenter)) + (2.5 * rBall);

			const bezier = anime.bezier(...negativeConfig.easing);
			const turns = this.baseConfig.turns % 1;
			const negativeTurns = bezier(2000 / negativeConfig.duration);

			this.keyframe = {
				ball: {
					translateX: x
				},
				base: {
					rotate: turns - negativeTurns
				},
				numbers: {
					rotate: -negativeTurns
				}
			};
		},
		// 移动基座
		moveBallBase() {
			const { ballBase } = this.$refs;
			if (ballBase) {
				// reset
				anime.remove('#m-ball-base');
				ballBase.style = '';
			}

			const { turns, duration } = this.baseConfig;

			this.animBaseFirst = anime({
				targets: '#m-ball-base',
				rotate: {
					value: `${turns}turn`,
					easing: 'easeInOutQuint',
					duration
				},
				complete: () => {
					anime.remove('#m-ball-base');
					this.animBase = anime({
						targets: '#m-ball-base',
						rotate: {
							value: `${turns - 1}turn`,
							...negativeConfig
						}
					});
				}
			});
		},
		moveBall() {
			const { ball } = this.$refs;

			if (ball) {
				// reset
				anime.remove('#m-ball');
				ball.style = '';
			}

			const { translateX } = this.keyframe.ball;
			const { duration, delay } = this.ballConfig;

			const options = {
				duration,
				delay,
				easing: [0.99, 0.56, 0.96, 0.74]
			};

			this.animBall = anime({
				targets: '#m-ball',
				translateX: [{
					value: translateX,
					...options
				}]
			});
		},
		start() {
			this.generateConfig();
			this.getKeyframe();
			this.moveNumbers();
			this.moveBallBase();
			this.moveBall();
		},
		pause() {
			this.$nextTick(() => {
				if (this.isComplete) return;
				this.animNumbers && this.animNumbers.pause();
				this.animBaseFirst && this.animBaseFirst.pause();
				this.animBase && this.animBase.pause();
				this.animBall && this.animBall.pause();
			});
		},
		// 切到后台再切回来时直接定位到终点
		play() {
			this.removeAnime();
			const { numbersPane, ballBase, ball } = this.$refs;

			const {
				numbers: numbersKeyframe,
				base: baseKeyframe,
				ball: ballKeyframe
			} = this.keyframe;

			this.$nextTick(() => {
				if (this.isComplete) return;
				numbersPane.style.transform = `rotate(${numbersKeyframe.rotate}turn)`;
				ballBase.style.transform = `rotate(${baseKeyframe.rotate}turn)`;
				ball.style.transform = `translateX(${ballKeyframe.translateX}px)`;
				this.stop();
			});
		},
		stop() {
			this.isComplete = true;
			this.animNumbers && this.animNumbers.pause();
			this.animBase && this.animBase.pause();
			EventBus.$emit('roulette_end');
		},
		reset() {
			this.isComplete = false;
			this.isStopClicked = false;
			this.isStop = false;

			this.removeAnime();
		},
		removeAnime() {
			const { numbersPane, ballBase, ball } = this.$refs;
			if (numbersPane) {
				// reset
				anime.remove('#numbers-pane');
				numbersPane.style = '';
			}
			if (ball) {
				// reset
				anime.remove('#m-ball');
				ball.style = '';
			}
			if (ballBase) {
				// reset
				anime.remove('#m-ball-base');
				ballBase.style = '';
			}
		}
	},
	created() {
		EventBus.$on('roulette_start', (data = {}) => {
			this.reset();
			this.type = data.type || 'default';
			this.target = parseInt(data.result, 10);
			this.leftCount = data.continuousCnt - data.currentNum;
			this.awardPercent = data.percent;

			this.start();
		});

		// 监听页面显示隐藏（切换到后台）
		visibilitychange(this.pause, this.play);
	},
	// mounted() {
	// 	// test...
	// 	this.start();
	// }
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';

.set-center() {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.m-animate-roulette-wrap {
	overflow: hidden;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);

	img {
		display: block;
		width: 100%;
	}
}

.m-animate-roulette-container {
	width: 100%;
	transform: translateZ(0); // 开启GPU加速
	perspective: 1000;
	backface-visibility: hidden;
}

.m-animate-roulette--default {
	margin: 14.4vh auto 0;
}

.m-animate-roulette--auto {
	width: 100%;
	.set-center();
}

.m-animate-roulette-pane {
	width: 85.83%;
	margin: 0 auto;
	overflow: hidden;
	position: relative;

	.m-roulette-pane-main {
		width: 66.33%;
		.set-center();
		overflow: hidden;
	}

	.m-roulette-pane-center {
		width: 35.89%;
		.set-center();
	}

	@paneBallWidth: 85%;

	.m-roulette-pane-ball {
		width: @paneBallWidth;
		height: 0;
		padding-top: @paneBallWidth;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: @paneBallWidth / -2;
		margin-left: @paneBallWidth / -2;

		.m-ball-wrap {
			width: 3.89%;
			border-radius: 50%;
			margin-left: -3.89%/2;
			margin-top: -(50% + 3.89%/2);
		}
	}
}

.m-animate-roulette-desc {
	width: 80%;
	min-height: 21/@rem;
	margin: 9vh auto 12vh;
	font-size: 14/@rem;
	line-height: 1.5;
	color: #fff;
	text-align: center;
}

.m-animate-roulette-btn {
	width: 53.6%;
	height: 0;
	padding-top: (46/193)*53.6%;
	margin: 0 auto;
	background-image: url(./images/stop-auto-play.png);
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;

	&:active {
		background-image: url(./images/stop-auto-play--active.png);
	}

	&.disabled {
		background-image: url(./images/stop-auto-play--disabled.png);
	}
}
</style>
