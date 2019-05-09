<template>
	<div class="m-roulette" :style="`height: ${height}px;`">
		<playground :enableMusic="enableMusic" @toggleHistory="toggleHistory" @toggleRoulette="toggleRoulette" @toggleGuide="toggleGuide" @triggerMusic="triggerMusic" @startAutoPlay="startAutoPlay" @stopAutoPlay="stopAutoPlay" @toggleMusic="toggleMusic"/>
		<AnimateRoulette class="m-animate-roulette" v-show="isShowRoulette"></AnimateRoulette>
		<history class="m-roulette-history" v-if="isShowHistory" @close="toggleHistory(false)"/>
		<PlayGuides class="m-roulette-guide" v-if="isShowGuides" @toggleGuide="toggleGuide"></PlayGuides>
		
		<audio ref="chip">
		  <source src="./music/chip.mp3" type="audio/mpeg">
		</audio>
		<audio ref="wheel">
		  <source src="./music/wheel240.mp3" type="audio/mpeg">
		</audio>
		<audio ref="button">
		  <source src="./music/button.mp3" type="audio/mpeg">
		</audio>
		<audio ref="win">
		  <source src="./music/location.mp3" type="audio/mpeg">
		</audio>
		<div class="image-container">
			<img src="./images/auto-play.png" style="visibility: hidden;"/>
			<img src="./images/auto-play--active.png" style="visibility: hidden;"/>
			<img src="./images/bgd.png" style="visibility: hidden;"/>
			<img src="./images/black.png" style="visibility: hidden;"/>
			<img src="./images/blue.png" style="visibility: hidden;"/>
			<img src="./images/cup.png" style="visibility: hidden;"/>
			<img src="./images/huge-reward.png" style="visibility: hidden;"/>
			<img src="./images/icon-win.png" style="visibility: hidden;"/>
			<img src="./images/light.png" style="visibility: hidden;"/>
			<img src="./images/litte-reward.png" style="visibility: hidden;"/>
			<img src="./images/music-off.svg" style="visibility: hidden;"/>
			<img src="./images/music-on.svg" style="visibility: hidden;"/>
			<img src="./images/plan-bgd.png" style="visibility: hidden;"/>
			<img src="./images/pp.png" style="visibility: hidden;"/>
			<img src="./images/ppr.png" style="visibility: hidden;"/>
			<img src="./images/rebet.png" style="visibility: hidden;"/>
			<img src="./images/rebet--active.png" style="visibility: hidden;"/>
			<img src="./images/rewards.png" style="visibility: hidden;"/>
			<img src="./images/roulette.png" style="visibility: hidden;"/>
			<img src="./images/s-black.png" style="visibility: hidden;"/>
			<img src="./images/s-blue.png" style="visibility: hidden;"/>
			<img src="./images/s-pp.png" style="visibility: hidden;"/>
			<img src="./images/s-ppr.png" style="visibility: hidden;"/>
			<img src="./images/s-yellow.png" style="visibility: hidden;"/>
			<img src="./images/spin.png" style="visibility: hidden;"/>
			<img src="./images/spin--active.png" style="visibility: hidden;"/>
			<img src="./images/table.png" style="visibility: hidden;"/>
			<img src="./images/warning.png" style="visibility: hidden;"/>
			<img src="./images/win-bgd.png" style="visibility: hidden;"/>
			<img src="./images/yellow.png" style="visibility: hidden;"/>
			<img src="./images/help-1.png" style="visibility: hidden;"/>
			<img src="./images/help-2.png" style="visibility: hidden;"/>
			<img src="./images/help-3.png" style="visibility: hidden;"/>
			<img src="./images/clear-btn.png" style="visibility: hidden;"/>
			<img src="./images/clear-btn--disable.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/roulette-ball.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/roulette-base.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/roulette-center.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/stop-auto-play--active.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/stop-auto-play--disabled.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/roulette-main.png" style="visibility: hidden;"/>
			<img src="./common/components/AnimateRoulette/images/stop-auto-play.png" style="visibility: hidden;"/>
		</div>
	</div>
</template>

<script>
import { LS } from 'storage';
import { mapActions } from 'vuex';
import AnimateRoulette from './common/components/AnimateRoulette';
import PlayGuides from './pagelet/playGuide';
import playground from './pagelet/main.vue';
import history from './pagelet/history.vue';

export default {
	name: 'Roulette',
	components: {
		AnimateRoulette,
		PlayGuides,
		playground,
		history
	},
	data() {
		return {
			isShowGuides: false,
			isShowHistory: false,
			isShowRoulette: false,
			height: document.body.clientHeight,
			enableMusic: true
		};
	},
	created() {
		const musicStatus = LS.get('roulette_music_status');
		this.enableMusic = musicStatus !== 'false';
		this.requestAFPolyfill();
		this.getStakeLimit();
	},
	methods: {
		...mapActions('roulette', ['getStakeLimit']),
		toggleHistory(val) {
			this.isShowHistory = val;
		},
		toggleRoulette(val) {
			this.isShowRoulette = val;
		},
		toggleGuide(val) {
			this.isShowGuides = val;
		},
		toggleMusic(val) {
			this.enableMusic = val;
			LS.set('roulette_music_status', val);
		},
		triggerMusic(name) {
			const audio = this.$refs[name];
			if (this.enableMusic && audio) {
				audio.play();
			}
		},
		startAutoPlay(name) {
			const audio = this.$refs[name];
			if (this.enableMusic && audio) {
				// audio.loop = true;
				audio.play();
			}
		},
		stopAutoPlay(name) {
			const audio = this.$refs[name];
			if (this.enableMusic && audio) {
				// audio.loop = false;
				audio.pause();
			}
		},
		requestAFPolyfill() {
			let lastTime = 0;
			const vendors = ['webkit', 'moz', 'ms'];
			for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
			}
			window.supportRequestAF = true;
			if (!window.requestAnimationFrame) {
				window.supportRequestAF = false;
				window.requestAnimationFrame = function(callback, element) {
					const currTime = new Date().getTime();
					const timeToCall = Math.max(0, 16 - (currTime - lastTime));
					const id = window.setTimeout(() => {
						callback(currTime + timeToCall);
					}, timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
			}
			if (!window.cancelAnimationFrame) {
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
			}
		}
	},
	mounted() {
		document.body.onresize = () => {
			this.height = document.body.clientHeight;
		};
		document.querySelector('#pageLoading').style.display = 'none';
		document.body.style.overflow = 'auto'; // 放开下拉刷新
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
.m-roulette-history {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	// width: 100vw;
	// height: 100vh;
	z-index: 50;
}

.m-animate-roulette,.m-roulette-guide {
	z-index: 50;
}
.image-container {
	height: 0;
	overflow: hidden;
}
</style>
