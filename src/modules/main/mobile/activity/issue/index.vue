<template>
	<div class="m-issue">
		<div :class="['m-back-bar', {'home-back': pageModule === 'home'}]" @click.stop="jmpHome">
			<i class="m-icon-back"></i>
			<span class="m-text">Back</span>
		</div>
		<TitleBar ref="titleBar"/>

		<!-- <Home v-if="pageModule === 'home'" />

		<Rulers v-if="pageModule === 'rulers'" /> -->

		<ShareBar v-if="showShareBar" />
		<!-- <Issue v-if="pageModule === 'issue'"/>
		<nationRank v-if="pageModule === 'nationRank'"/>
		<quizOver v-if="pageModule === 'quizOver'"/> -->

		 <router-view></router-view>
		<!-- 预先加载的大图片 -->
		<template v-if="country === 'ke'">
		  <img src="./image/homeBg.jpg" alt="" style="display: none;">
		</template>

		<template v-if="country === 'ng'">
		  <img src="./image/homeBg-ng.jpg" alt="" style="display: none;">
		</template>

		<img src="./image/btnBarBg.png" alt="" style="display: none;">
		<img src="./image/btnBg.png" alt="" style="display: none;">
		<img src="./image/group.png" alt="" style="display: none;">

		<img src="./image/ruler1.png" alt="" style="display: none;">
		<img src="./image/ruler2.png" alt="" style="display: none;">
		<img src="./image/ruler3.svg" alt="" style="display: none;">
		<img src="./image/ruler4.svg" alt="" style="display: none;">
		<img src="./image/ruler5.png" alt="" style="display: none;">
		<img src="./image/ruler6.svg" alt="" style="display: none;">

		<img src="./image/gift-dialog.png" alt="" style="display: none;">
		<img src="./image/board.png" alt="" style="display: none;">
		<img src="./image/toast.png" alt="" style="display: none;">

		<!-- 音频文件 -->
		<audio loop id="bg-music">
		  <!-- <source src="horse.ogg" type="audio/ogg"> -->
		  <source src="./music/bgm.mp3" type="audio/mpeg">
		</audio>
	</div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import appCore from 'appCore';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { UPDATE_FINISH_STATUS, RESET_DATA, UPDATE_MUSIC_STATUS } from 'store/issue/mutationTypes';

import { pagePath } from 'config/pageConfig';
import { appPath } from 'config/appPagePath';

import Home from './pagelet/home.vue';
import Issue from './pagelet/issue.vue';
import ShareBar from './pagelet/share.vue';
import Rulers from './pagelet/rulers.vue';
import nationRank from './pagelet/nationRank.vue';
import quizOver from './pagelet/quizOver.vue';
import TitleBar from './pagelet/titleBar.vue';
import CommonMixin from './js/commonMixin';

export default {
	components: {
		Home,
		ShareBar,
		Issue,
		Rulers,
		nationRank,
		TitleBar,
		quizOver
	},
	mixins: [
		CommonMixin
	],
	computed: {
		...mapState('issue', [
			'pageModule',
			'showShareBar',
			'country'
		]),
	},
	watch: {
		pageModule(val, oldVal) {
			if (val === 'home' && oldVal === 'quizOver') {
				this.chgFinishStatus(true);
				this.resetData();
			}
		},
		$route(val, oldVal) {
			this.chgShowPage(val.name);
			this.$dialog();
		}
	},
	created () {
		// 如果在app内
		this.requestAFPolyfill();
		if (appCore.getAppName() === 'sportybet') {
		  // appCore.sportybet.ready(AFJsApi => {
		  //   if (!AFJsApi) {
		  //     return;
		  //   }
		  //   AFJsApi.ui.setOptionMenu({ title: 'Share', resId: 'ic_share_white_24dp' });
		  // });
		  // document.addEventListener('optionMenu', () => {
		  //   // 右上角按钮被点击时会回调 optionMenu 事件
		  //   appCore.share({
		  //     title: 'share',
		  //     url: window.location.href
		  //   });
		  //   appCore.shareNow();
		  // }, false);
		}

		if (this.$route.name === 'home' && this.$route.hash) {
			window.location.hash = window.location.hash.replace('#login', '');
		}

		if (this.$route.name !== 'home') {
			this.$router.push({ name: 'home' });
		}
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		...mapMutations('issue', {
			chgFinishStatus: UPDATE_FINISH_STATUS,
			resetData: RESET_DATA,
			updateMusicStatus: UPDATE_MUSIC_STATUS,
		}),
		jmpHome() {
			if (this.pageModule === 'home') {
				if (window.AppCore.getAppName() === 'sportybet') {
					return window.AppCore.sendCmd(appPath.home);
				}

				location.href = pagePath.home;
			} else {
				this.backHome();
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
		// 基础信息加载完毕后，去掉loading
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
		const audioEL = document.querySelector('#bg-music');
		audioEL.addEventListener('play', () => {
			this.updateMusicStatus(true);
		});
		audioEL.addEventListener('pause', () => {
			this.updateMusicStatus(false);
		});
	}
};
</script>
<style lang="less">
@import "./style/layout.less";
</style>
