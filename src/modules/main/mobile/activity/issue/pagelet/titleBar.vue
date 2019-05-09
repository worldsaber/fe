<template lang="html">
	<div :class="['m-addtion-bar', {'fixed': positionFixed}]">
		<div :class="['m-item']" v-if="showLives">
		  <template v-if="!isSpectator">
			<span class="m-label">Current Lives</span>
			<span class="m-value" id="countShake">{{totalLives}}</span>
		  </template>
		  <div class="m-get-extra" @click="goExtraLives" v-else>Get Extra Lives</div>
		</div>
		<div :class="['m-item']" v-if="showGifts">
		  <span class="m-label">Gifts</span>
		  <span class="m-value">{{getShowGifts}}</span>
		</div>

		<div :class="['m-item']" v-if="showPartCount">
	  	  <span class="m-label">Online</span>
	  	  <span class="m-value">{{getShowPartCount}}</span>
	    </div>
		
		<div :class="['m-item', 'music']" v-if="showMusic" @click="toggleMusic">
			<img v-if="status==='Off'" class="icon-music" src="../image/music-off.svg"/>
			<img v-if="status==='On'" class="icon-music" src="../image/music-on.svg"/>
		</div>
	</div>
</template>

<script>
import {
    mapGetters,
	mapActions,
	mapState
} from 'vuex';

export default {
	data() {
		return {
			refreshTimer: null,
			totalLives: 0
		};
	},
	computed: {
		...mapState('issue', [
			'pageModule',
			'isSpectator',
			'musicStatus',
			'currentPeriodLives'
		]),
		...mapGetters('issue', [
			'getShowPartCount',
			'getShowGifts',
			'getTotalLives'
		]),
		status() {
			return !this.musicStatus ? 'On' : 'Off';
		},
		showMusic() {
			if (['issue', 'rulers', 'quizOver'].includes(this.pageModule)) {
				return true;
			}

			return false;
		},
		positionFixed() {
			if (['issue'].includes(this.pageModule)) {
				return true;
			}
		},
		showLives() {
			if (['issue', 'rulers'].includes(this.pageModule)) {
				return true;
			}

			return false;
		},
		showGifts() {
			if (this.isSpectator) {
				return false;
			}

			if (['issue', 'quizOver'].includes(this.pageModule)) {
				return true;
			}

			return false;
		},
		showPartCount() {
			return ['issue', 'rulers', 'quizOver'].includes(this.pageModule);
		}
	},
	methods: {
		...mapActions('issue', [
			'getParticipantsCount'
		]),
		refreshPartCount() {
			this.refreshTimer = setInterval(() => {
				this.getParticipantsCount();
			}, 5000);
		},
		toggleMusic() {
			const audioEl = document.querySelector('#bg-music');
			if (this.musicStatus) {
				audioEl.pause();
			} else {
				audioEl.play();
			}
		},
		shake() {
			console.log(this);
			const now = (new Date()).getTime();
			let current;
			const $count = document.querySelector('#countShake');
			const time = 100; // 四分之一周期
			const deg = 45; // 抖动度数
			const loop = function() {
				requestAnimationFrame(ts => {
					if (window.supportRequestAF) {
						// current = performance.timing.navigationStart + ts - now;
						current = Date.now() - now;
					} else {
						current = ts - now;
					}
					if (current <= time) {
						$count.style.transform = `rotate(${deg * current / time}deg)`;
					} else if (current <= 3 * time) {
						$count.style.transform = `rotate(${deg - deg * (current - time) / time}deg)`;
					} else if (current <= 4 * time) {
						$count.style.transform = `rotate(${-deg + deg * (current - 3 * time) / time}deg)`;
					} else {
						$count.style.transform = '';
					}
					if (current < 1000) {
						loop();
					}
				});
			};
			loop();
		},
		scale() {
			const now = (new Date()).getTime();
			let current;
			const $count = document.querySelector('#countShake');
			const loop = function() {
				requestAnimationFrame(ts => {
					if (window.supportRequestAF) {
						// current = performance.timing.navigationStart + ts - now;
						current = Date.now() - now;
					} else {
						current = ts - now;
					}
					if (current <= 200) {
						$count.style.transform = `scale(${current / 200 + 1})`;
						$count.style.opacity = 1 - (current / 200);
					} else if (current <= 300) {
						$count.style.transform = `scale(${2 - (current - 200) / 100})`;
						$count.style.opacity = (current - 200) / 100;
					} else if (current <= 400) {
						$count.style.transform = `scale(${(current - 300) / 100 + 1})`;
						$count.style.opacity = 1 - (current - 300) / 100;
					} else if (current <= 500) {
						$count.style.transform = `scale(${2 - (current - 400) / 100})`;
						$count.style.opacity = (current - 400) / 100;
					} else {
						$count.style.transform = '';
						$count.style.opacity = 1;
					}
					if (current < 1000) {
						loop();
					}
				});
			};
			loop();
		},
		animate() {
			this.scale();
			setTimeout(() => {
				this.totalLives--;
				this.$nextTick(() => {
					this.shake();
				});
			}, 1000);
		},
		goExtraLives() {
			this.$router.push({
				name: 'extraLives'
			});
		}
	},
	watch: {
		showPartCount(val, oldVal) {
			if (!val) {
				clearInterval(this.refreshTimer);
			} else {
				this.refreshPartCount();
			}
		},
		currentPeriodLives(val) {
			this.totalLives = val;
		}
	},
	created() {
		if (this.showPartCount) {
			this.getParticipantsCount();
			this.refreshPartCount();
		}
		this.totalLives = this.currentPeriodLives;
	},
	destroyed() {
		clearInterval(this.refreshTimer);
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import '../style/variable.less';

.m-issue {
	.m-addtion-bar {
		position: absolute;
		top: 17/@rem;
		right: 12/@rem;
		z-index: 22;
		&.fixed {
			position: absolute;
			top: 52/@rem;
			right: 12/@rem;
			.m-item.music {
				position: absolute;
				top: -35/@rem;
				right: 0;
				display: block;
			}
		}
		.m-item {
			display: inline-block;
			vertical-align: top;
			margin-right: 6/@rem;
			// &:first-of-type {
			// 	margin-right: 18/@rem;
			// }
			// &:only-of-type {
			// 	margin-right: 0;
			// }
			&.music {
				width: 20/@rem;
				height: 19/@rem;
				margin-left: 12/@rem;
				&.music-fixed {
					position: absolute;
					bottom: -25/@rem;
					right: 0;
				}
			}
		}

		.m-label,
		.m-value {
			display: inline-block;
			vertical-align: middle;
		}

		.m-label {
			line-height: 14/@rem;
			font-size: 12/@rem;
			font-weight: 900;
			color: fadeout(@white, 50%);
			margin-right: 6/@rem;
		}

		.m-value {
			line-height: 19/@rem;
			font-size: 16px;
			font-weight: bold;
			color: @white;
		}
			
		.m-get-extra {
			display: inline-block;
			padding: 0 10/@rem;
			vertical-align: top;
			text-align: center;
			line-height: 18/@rem;
			font-size: 12/@rem;
			color: @white;
			border-radius: 11/@rem;
			border: solid 2/@rem rgba(255, 255, 255, 0.3);
			
		}
		.m-music {
			position: absolute;
			right: 0;
			top: 25/@rem;
			padding: 0 9/@rem;
			box-sizing: border-box;
			line-height: 24/@rem;
			background-color: fadeout(@white, 80%);
			border-radius: 12/@rem;
			color: @white;
		}
	}
}
</style>
