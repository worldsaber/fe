<template lang="html">
	<section :class="[
		'm-action',
		{
			'm-action-fixed': homeStatus === 2
		}
	]">
		<div class="m-btn-wrapper extra-lives">
			<div class="m-extra-label">Extra lives</div>
			<div class="m-extra-value">{{!isLogin ? '--' : totalLives}}</div>
			<div class="m-get-extra" @click="goExtraLives">
				<div class="m-share-to-wrap">
					<span class="left">Share to</span>
					<span class="right">>></span>
				</div>
				<div class="get-more-text">Get More Lives</div>
			</div>
		</div>
		<div class="m-btn-wrapper" v-if="homeStatus !== 2">

			<template v-if="!isLogin">
				<div class="m-btn-item m-btn m-btn-com" @click="handleLogin">Register / Log in to Play</div>
			</template>

			<template v-else-if="canBegin">
				<div
					:class="[
						'm-btn-item',
						'm-btn',
						'm-btn-com',
						'm-animate-btn',
						{
							'm-loading': authLoading
						}
					]"
					@click.stop="jmpBegin"
				>Tap to Start</div>
			</template>

			<template v-else>
				<div class="m-btn-item m-btn m-btn-more" @click.stop="seeRules">Happening Soon!<span class="m-tips">Learn More</span></div>
			</template>
		</div>
	</section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import appCore from 'appCore';
import { UPDATE_LOGIN_STATUS, UPDATE_SHAREBAR_STATUS, UPDATE_TOTAL_GIFTS, UPDATE_MUSIC_STATUS, REFRESH_LOGIN_STATUS } from 'store/issue/mutationTypes';
import 'components/login/popupLogin';
import { pagePath } from 'config/pageConfig';
import { appPath } from 'config/appPagePath';

import CommonMixin from '../js/commonMixin';
import { getRulersUrl } from '../js/config';
import Gifts from './gifts.vue';

export default {
	components: {
		Gifts
	},
	mixins: [
		CommonMixin
	],
	data() {
		return {
			confirmDialog: null,
			authLoading: false,
			hasStartAudio: false
		};
	},
	computed: {
		...mapState('issue', [
			'isLogin',
			'homeStatus',
			'reqLoading',
			'alreayJoin',
			'baseInfo',
			'deltaTime',
			'musicStatus',
			'hasRefreshLoginStatus',
			'totalLives',
		]),
		showShare() {
			return !this.isLogin || !this.canBegin;
		},
		canBegin() {
			const status = this.homeStatus || 2;
			return [1, 4].includes(status);
		}
	},
	watch: {
		reqLoading(val, oldVal) {
			if (!val) {
				this.authLoading = false;
			}
		},
		$route(val, oldVal) {
			if (val.name === 'home' && !val.hash) {
				this.$popupLogin && this.$popupLogin.close();
			}
		},
		isLogin(val, oldVal) {
			if (val) {
				this.getGiftsAmount();
			} else {
				this.chgShowTotalGift('-');
			}
		},
		showShare(val, oldVal) {
			if (!val) {
				this.showShareBar(false);
			}
		}
	},
	methods: {
		...mapMutations('issue', {
			updateLoginStatus: UPDATE_LOGIN_STATUS,
			showShareBar: UPDATE_SHAREBAR_STATUS,
			chgShowTotalGift: UPDATE_TOTAL_GIFTS,
			updateMusicStatus: UPDATE_MUSIC_STATUS,
			sysRefreshStatus: REFRESH_LOGIN_STATUS
		}),
		...mapActions('issue', [
			'verifyAuthority',
			'joinQuiz',
			'getGiftsAmount',
			'refreshLoginStatus'
		]),
		share() {
			if (appCore.getAppName() === 'sportybet') {
				appCore.share({
					title: 'share',
					url: window.location.href
				});
				appCore.shareNow();
			} else {
				this.showShareBar(true);
			}
		},
		handleLogin() {
			this.jmpLogin();
		},
		jmpBegin() {
			const audio = document.querySelector('#bg-music');
			if (audio && !this.musicStatus) {
				audio.play();
				this.updateMusicStatus(true);
			}

			const baseInfo = this.baseInfo || {},
				now = Date.now();

			if (baseInfo.endTime + this.deltaTime <= now) {
				EventBus.$emit('refresh-home');
				return;
			}

			if (this.authLoading) {
				return;
			}

			if (!this.alreayJoin) {
				this.join();
				return;
			}

			this.jmpRulers();
		},
		popConfirm() {
			this.$dialog();
			this.confirmDialog = this.$dialog({
				'class': 'm-join-confirm',
				width: '92%',
				title: 'Sorry, you are late!',
				content: 'The activity already started, it might be that you were late or did not log in on time. Do you still wish to enter spectator mode?',
				button: ['Exit', 'Spectator Mode']
			});
			this.confirmDialog.$once('beforeClose', ret => {
				if (ret) {
					this.$router.push({ name: 'issue' });
					this.confirmDialog = null;
				} else {
					if (window.AppCore.getAppName() === 'sportybet') {
						return window.AppCore.sendCmd(appPath.home);
					}

					location.href = pagePath.home;
				}
			});
		},
		jmpLogin() {
			if (this.$popupLogin) {
				window.location.hash += '#login';
				this.$popupLogin.show();
			} else {
				const okUrl = window.location.href;
				window.location.href = `${pagePath.loginPath}?okUrl=${encodeURIComponent(okUrl)}`;
			}
		},
		handleLoginStatus(opt) {
			const { onlyStatus = false } = opt || {};
			!onlyStatus && this.chgHash();

			const rbCode = URL.getPara('rbCode');
			if (rbCode) {
				this.$parent.addLives().then(() => {
					this.$parent.loadData();
				});
			} else {
				this.$parent.loadData();
			} // 登录后检查是否奖励复活并刷新复活数

			this.updateLoginStatus();
			this.sysRefreshStatus(true);
		},
		saveLoginStatus() {
			this.handleLoginStatus({
				onlyStatus: true
			});
		},
		chgHash() {
			this.$popupLogin && this.$popupLogin.close();
			window.location.hash = window.location.hash.replace('#login', '');
		},
		jmpRulers () {
			const status = this.homeStatus || -1;
			if (status === 1) {
				this.authLoading = true;
				this.verifyAuth();
			} else {
				this.$router.push({ name: 'rulers' });
			}
		},
		join() {
			this.joinQuiz().then(() => {
				if (!this.hasRefreshLoginStatus) {
					this.refreshLoginStatus().then(ret => {
						const { refresh = false } = ret || {};

						if (refresh) {
							this.jmpRulers();
						}
					});
				} else {
					this.jmpRulers();
				}
			}, errorInfo => {
				const { type = '' } = errorInfo;

				if (type === 'login') {
					this.jmpLogin();
				} else {
					this.showErrorInfo(errorInfo);
				}
			});
		},
		verifyAuth() {
			this.verifyAuthority().then(ret => {
				if (ret && ret.userStatus) {
					this.popConfirm();
					return;
				}

				if (ret && !ret.userStatus) {
					this.$router.push({ name: 'issue' });
				}
			}, errorInfo => {
				this.hasRefreshLoginStatus && this.showErrorInfo(errorInfo);
			});
		},
		showErrorInfo(errorInfo) {
			const { type = 'dialog', msg = '' } = errorInfo || {};

			if (msg) {
				this.$dialog();
				switch (type) {
				case 'toast':
					this.$toast(msg);
					break;
				default:
					this.$dialog({
						content: msg,
						button: ['OK']
					});
				}
			}
		},
		seeRules() {
			location.href = getRulersUrl();
		},
		goExtraLives() {
			if (!this.isLogin) {
				this.handleLogin();
			} else {
				this.$router.push({
					name: 'extraLives'
				});
			}
		}
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$off(commonEvent.SAVE_LOGIN_STATUS, this.saveLoginStatus);
		EventBus.$off(commonEvent.UPDATE_POP_LOGIN_BACK, this.chgHash);
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$on(commonEvent.SAVE_LOGIN_STATUS, this.saveLoginStatus);
		EventBus.$on(commonEvent.UPDATE_POP_LOGIN_BACK, this.chgHash);
	}
};
</script>

<style lang="less">
@import '../style/popDialog.less';
</style>
