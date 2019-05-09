<template>
	<div class="live-player-container">
		<div v-loading:fetchData.dark="loading" class="live-player-wrap">
			<template v-if="loading === false">
				<div class="m-login-error" v-if="!isLogin && !liveChannelUrl">
					<div class="err-tip">
						<p>Live Stream Available</p>
						<p>Please log in to view</p>
						<div class="login-btn"  @click="goToLogin">Log In</div>
					</div>
				</div>
				<div class="m-detail-error" v-else-if="loaingVideoFail || !liveChannelUrl">
					<div>
						<span class="m-error-msg">Sorry, there is no live data! </span>
					</div>
				</div>
				<div class="wrap" v-else-if="liveChannelUrl">
					<div id="liveplayerEle">
						<video>
							<source :src="liveChannelUrl.streamMPEGDash" type="application/dash+xml">
							<source :src="liveChannelUrl.streamDynamicBitRate" type="application/x-mpegURL">
						</video>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';

const CDN = __cdn__ // eslint-disable-line

export default {
	name: 'liveStreamPlayer',
	props: {
		eventId: String
	},
	data() {
		return {
			loading: false,
			isLogin: window.loginStatus,
			loaingVideoFail: false,
		};
	},
	computed: {
		...mapState('eventDetail', [
			'liveChannelUrl'
		])
	},
	methods: {
		...mapActions('eventDetail', [
			'fetchLiveChannel'
		]),
		mountSDK() {
			return new Promise((resolve, reject) => {
				if (window.liveplayer) {
					return resolve();
				}
				const scirptEl = document.createElement('script');
				scirptEl.src = `${CDN}third-lib/liveplayer-1.8.2/liveplayer.js`;
				const style = document.createElement('link');
				style.rel = 'stylesheet';
				style.href = `${CDN}third-lib/liveplayer-1.8.2/style/liveplayer.css`;
				document.querySelector('body').appendChild(scirptEl);
				document.querySelector('head').appendChild(style);
				scirptEl.addEventListener('load', () => {
					resolve();
				});
			});
		},
		init() {
			const config = {
				videoHandlers: ['html5', 'hls', 'dash'],
				loglevel: 0,
				autoplay: false, // 自动播放
				loop: false, // 循环
				mute: false, // 静音
				vod: false,  // 隐藏控制条
				bufferTime: 4.5,
				scaleMode: false, // 填充模式, 'stretch':填充整个容器
				edgeServerIpDetection: false,
				ui: { // 播放器界面
					enabled: true,
					videoControls: true,
					fullscreen: false,
					controlBarHideDelay: 3
				},
				simpleBitrate: false
			};
			const dom = document.querySelector('#liveplayerEle');
			if (dom) {
				window.lpInstance = window.liveplayer('liveplayerEle', config);
				window.lpInstance.bind('stream-loaded', params => {
					const playerSpinner = document.querySelector('.spinner');
					playerSpinner.style.display = 'none';
				});
				window.lpInstance.bind('error', err => {
					this.$nextTick(() => {
						// this.loaingVideoFail = true;
					});
					console.error(err);
				});
			}
		},
		goToLogin () {
			if (this.$popupLogin) {
				this.$popupLogin.show(); // use popup login.
			} else if (window.login) {
				window.login();
			}
			EventBus.$once('updateLoginStatus', () => {
				this.isLogin = true;
				this.fetchData();
			});
		},
		fetchData() {
			this.loading = true;
			const { eventId } = this;
			return new Promise((resolve, reject) => {
				this.fetchLiveChannel({ eventId })
				.then(res => {
					// 未登录
					if (res && res.login === false) {
						this.isLogin = false;
					}

					this.mountSDK().then(() => {
						this.loading = false;
						this.$nextTick(() => this.init());
						resolve();
					});
				})
				.catch(() => {
					this.loading = false;
					resolve();
				});
			});
		}
	},
	mounted() {
		window.test = this;
		this.fetchData();
	},
	destroyed() {
		if (window.lpInstance) {
			window.lpInstance.remove();
		}
		window.lpInstance = null;
	}
};
</script>

<style lang="less">
@import './style.less';
</style>
