<template>
	<div :class="['christmas-wrapper', {'christmas-wrapper--fix': pageError || pageLoading}]" id="j_christmas">
		<div class="m-top-bar">
			<div class="m-back" @click.stop="jmpHome">
				<i class="m-icon-back"></i>
				<span class="m-text">Back</span>
			</div>
			<div class="m-i-share" @click.stop="beginShare"></div>
		</div>

		<div class="l-top">
			<img :src="bannerPic" alt="" />
		</div>
		<template v-if="pageError">
			<div class="m-error-wrapper">
				<div>
					<span class="m-error-msg">Failed to load data. Please refresh the page.</span>
					<div class="m-btn" @click.stop="getActInfo">Refresh</div>
				</div>
			</div>
		</template>

		<template v-else-if="pageLoading">
			<div class="m-error-wrapper">
				<div>
					<i class="m-icon-loading"></i>
					<span class="m-text-msg">Loading...</span>
				</div>
			</div>
		</template>

		<template v-else>
			<div class="l-mid">
				<img :src="require('./image/circleBg.png')" alt="" />
				<div class="m-main m-t-center">
					<div v-if="isEnded" class="m-d-txt">
						<DefaultTxt />
						<div class="m-btn m-btn-log" @click="jmpLogin" v-if="!isLogin">Register/Log In</div>
						<div class="m-btn" @click.stop="shareCelebrate" v-else>Share to Celebrate</div>
					</div>
					<div v-else-if="+indexTime.hour || +indexTime.minute || +indexTime.second" class="m-act-timer">
						<div class="m-t-start">
							<StartTxt />
						</div>
						<ul class="m-timer">
							<li v-for="(item, index) in showTimer" :key="index" class="m-t-item">
								<N0 v-if="+item === 0" />
								<N1 v-if="+item === 1" />
								<N2 v-if="+item === 2" />
								<N3 v-if="+item === 3" />
								<N4 v-if="+item === 4" />
								<N5 v-if="+item === 5" />
								<N6 v-if="+item === 6" />
								<N7 v-if="+item === 7" />
								<N8 v-if="+item === 8" />
								<N9 v-if="+item === 9" />
								<Split v-if="item === 'split'" class="m-t-split"/>
							</li>
						</ul>

						<div class="m-btn m-btn-log" @click="jmpLogin" v-if="!isLogin">Register/Log In</div>
						<div class="m-btn--disable" @click.stop="handleDisableGrab" v-else>Grab</div>

						<div class="m-link" @click.stop="seeGifts">More Gifts?</div>
					</div>
					<div v-else class="m-act-on">
						<ul class="m-num">
							<li v-for="(item, index) in showNumbers" :key="index" class="m-n-item">
								<N0 v-if="+item === 0" />
								<N1 v-if="+item === 1" />
								<N2 v-if="+item === 2" />
								<N3 v-if="+item === 3" />
								<N4 v-if="+item === 4" />
								<N5 v-if="+item === 5" />
								<N6 v-if="+item === 6" />
								<N7 v-if="+item === 7" />
								<N8 v-if="+item === 8" />
								<N9 v-if="+item === 9" />
							</li>
						</ul>
						<div class="m-n-desc">
							<FreeTxt />
						</div>

						<div class="m-btn m-btn-log" @click="jmpLogin" v-if="!isLogin">Register/Log In</div>
						<template v-else>
							<div class="m-btn" v-if="+baseInfo.remainNumber > 0" @click="grab">Grab Now</div>
							<div class="m-btn--disable" v-else>Come Next Round</div>
						</template>

						<div class="m-link" @click.stop="seeGifts" v-if="+baseInfo.remainNumber === 0">More Gifts?</div>
					</div>
				</div>
			</div>
			<div class="l-btm">
				<img :src="require('./image/cardBg.png')" alt="" />
				<div class="m-main m-t-center">
					<div class="m-t-b m-t-14 m-t-l16 m-t-bred m-t-mt3">17/12-23/12</div>
					<div class="m-t-b6 m-t-13 m-t-l15 m-t-dred m-t-mt8">100 Free Bets Up For Grabs at {{cfg.actTime[1]}} ({{cfg.curTimeZone}})</div>
					<div class="m-t-b m-t-14 m-t-l16 m-t-bred m-t-mt3">24/12-25/12</div>
					<div class="m-t-b6 m-t-13 m-t-l15 m-t-dred">200 Free Bets Up For Grabs at <span class="m-t-b">{{cfg.actTime[0]}} & {{cfg.actTime[1]}}</span> ({{cfg.curTimeZone}}) for each round</div>
				</div>
			</div>

			<div class="m-rulers" v-if="cfg.tips.length">
				<h3 class="m-r-title">Terms and Conditions</h3>
				<ul class="f-count">
					<li class="f-count-item" v-for="item in cfg.tips">{{item}}</li>
				</ul>
			</div>
		</template>

		<img :src="require('./image/footerBg.png')" alt="" class="m-bg-footer" />
		<Share v-if="isShowShare" :shareCfg="cfg.shareCfg" @close-share="handleCloseShare"></Share>

		<img :src="require('./image/circleBg.png')" alt="" style="display:none" />
		<img :src="require('./image/footerBg.png')" alt="" style="display:none" />
		<img :src="require('./image/cardBg.png')" alt="" style="display:none" />
		<template v-if="cfg.country === 'ke'">
			<img :src="require('./image/banner_ke1.png')" alt="" style="display:none" />
			<img :src="require('./image/banner_ke2.png')" alt="" style="display:none" />
		</template>
		<template v-if="cfg.country === 'ng'">
			<img :src="require('./image/banner_ng1.png')" alt="" style="display:none" />
			<img :src="require('./image/banner_ng2.png')" alt="" style="display:none" />
		</template>
		<template v-if="cfg.country === 'gh'">
			<img :src="require('./image/banner_gh1.png')" alt="" style="display:none" />
			<img :src="require('./image/banner_gh2.png')" alt="" style="display:none" />
		</template>
	</div>
</template>
<script>
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath, domain, protocol } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import dateFormat from 'kernel/js/dateFormat';
import appCore from 'appCore';
import 'components/login/popupLogin';
import 'components/share';
import { appPath } from 'config/appPagePath';
import { isEmptyObject } from 'utils';

import { formatTime } from './js/commonFun';
import { helpTips, bannerImg, curTimeZone, actTime, country } from './js/pageConfig';
import N0 from './pagelet/n0.vue';
import N1 from './pagelet/n1.vue';
import N2 from './pagelet/n2.vue';
import N3 from './pagelet/n3.vue';
import N4 from './pagelet/n4.vue';
import N5 from './pagelet/n5.vue';
import N6 from './pagelet/n6.vue';
import N7 from './pagelet/n7.vue';
import N8 from './pagelet/n8.vue';
import N9 from './pagelet/n9.vue';
import Split from './pagelet/split.vue';
import FreeTxt from './pagelet/freeTxt.vue';
import DefaultTxt from './pagelet/defaultTxt.vue';
import StartTxt from './pagelet/startTxt.vue';

const currentDate = new Date();

export default {
	components: {
		N0,
		N1,
		N2,
		N3,
		N4,
		N5,
		N6,
		N7,
		N8,
		N9,
		Split,
		FreeTxt,
		DefaultTxt,
		StartTxt
	},
	data () {
		return {
			indexTime: {},
			baseInfo: {},
			isShowShare: false,
			deltaTime: null,
			cfg: Object.freeze({
				tips: helpTips || [],
				shareCfg: {
					url: `${protocol}//${domain}${pagePath.home}promotion/sporty_flash_surprises`,
					hashtag: '#SportyBetXmas'
				},
				giftsPath: `${userCenterUrl.gift}`,
				loginPath: pagePath.login,
				curTimeZone,
				actTime,
				country
			}),
			bannerPic: currentDate.getMonth() === 11 && currentDate.getDate() < 24 ? bannerImg.default : bannerImg.special,
			isEnded: false,
			isOn: false,
			pageError: false,
			pageLoading: false,
			isLogin: window.loginStatus || false
		};
	},
	computed: {
		showNumbers() {
			const baseInfo = this.baseInfo || {};

			let remainNumber = baseInfo.remainNumber || 0;

			remainNumber = Math.floor(remainNumber);

			remainNumber = ('' + remainNumber).split('');

			return remainNumber;
		},
		showTimer() {
			const indexTime = this.indexTime || {};
			let { hour = 0, minute = 0, second = 0 } = indexTime;
			const ret = [];

			hour && hour < 10 && (hour = '0' + hour);
			minute && minute < 10 && (minute = '0' + minute);
			second && second < 10 && (second = '0' + second);

			if (hour) {
				ret.push(...('' + hour).split(''));
				ret.push('split');
			} else {
				ret.push(...[0, 0]);
				ret.push('split');
			}

			if (minute) {
				ret.push(...('' + minute).split(''));
				ret.push('split');
			} else {
				ret.push(...[0, 0]);
				ret.push('split');
			}

			if (second) {
				ret.push(...('' + second).split(''));
			} else {
				ret.push(...[0, 0]);
			}

			return ret;
		}
	},
	created () {
		this.getActInfo();
	},
	methods: {
		getActInfo() {
			if (this.pageLoading) {
				return;
			}

			this.pageError = false;
			this.pageLoading = true;

			fetch('/promotion/v1/activities/grabGifts/info')
				.then(res => res.json())
				.then(ret => {
					this.pageLoading = false;

					const code = ret.bizCode,
						originData = ret.data || {};

					if (code === 10000) {
						this.deltaTime = (Date.now() || +new Date()) - originData.ts;
						this.clearData(originData);
					} else {
						this.pageError = true;
					}
				})
				.catch(err => {
					console.log(err);
					this.pageLoading = false;
					this.pageError = true;
				});
		},
		clearData(data) {
			this.timerId && clearInterval(this.timerId);

			if (isEmptyObject(data)) {
				this.isEnded = true;
				return;
			}

			const { remainNumber = 0, dailyTimes = 0, nextRoundTime = 0 } = data || {};
			let { started = false, countDown = 0 } = data || {};

			if (dailyTimes > 1) {
				this.bannerPic = bannerImg.special;
			} else {
				this.bannerPic = bannerImg.default;
			}

			if (dailyTimes > 1 && !remainNumber && started) {
				started = false;
				data.started = false;
			}

			if (!started && countDown) {
				data.remainNumber = data.totalNumber;
			}

			this.isOn = started;

			this.baseInfo = { ...data };

			if (!started && countDown) {
				this.indexTime = formatTime(countDown);
				this.startTimer();
			}

			if (started && nextRoundTime) {
				let lastTime = Date.now() || +new Date();
				let diff = nextRoundTime + this.deltaTime - lastTime;

				this.timerId = setInterval(() => {
					const now = Date.now() || +new Date();
					diff -= (now - lastTime);
					lastTime = now;

					if (diff <= 0) {
						clearInterval(this.timerId);
						this.timerId = null;
						this.getActInfo();
					}
				}, 100);
			}
		},
		grab() {
			if (!window.loginStatus) {
				this.jmpLogin();
				return;
			}

			this.$dialog({
				title: null,
				css: 'es-dialog-toast',
				width: 0,
				content: '<i class="m-icon--loading"></i>Loading...',
				button: []
			});

			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			fetch('/promotion/v1/activities/grabGifts/grab', {
				method: 'POST',
				headers: t
			})
			.then(res => res.json())
			.then(ret => {
				this.$dialog();

				if (ret.login === false) {
					this.jmpLogin();
					return;
				}

				const code = ret.bizCode,
					data = ret.data || {},
					nextRoundTime = data.nextRoundTime || '';

				switch (code) {
				case 10000:
					this.$dialog({
						title: 'WOW! YOU GOT A FREE BET!',
						content: 'Show Off your Xmas Gift!',
						'class': 'm-christmas-pop m-pop--suc',
						width: '80%',
						button: ['Check My Gift', 'Show Off']
					}).onBtnClick(btnType => {
						if (btnType === 0) {
							this.jmpGifts();
						} else if (btnType === 1) {
							this.handleShare();
							this.clearData(ret.data || {});
						} else {
							this.clearData(ret.data || {});
						}
					});
					break;
				case 4400:
					this.$dialog({
						title: 'You Have Got A Free Bet!',
						content: nextRoundTime && `Next round starts at ${dateFormat.format(nextRoundTime, 'DD/MM HH:mm')}!` || '',
						'class': nextRoundTime ? 'm-christmas-pop' : 'm-christmas-pop m-christmas--fix',
						width: '80%',
						button: ['Show Off My Xmas Gift']
					}).onBtnClick(btnType => {
						if (btnType) {
							this.jmpGifts();
						} else {
							this.clearData(ret.data || {});
						}
					});
					break;
				case 4310:
					this.$toast('There’s a limit of 1 Free Bet per IP address / Device each round.').onClose(() => {
						this.clearData(ret.data || {});
					});
					break;
				case 19000:
				case 4500:
					this.$dialog({
						title: 'Oops, you didn\'t get the Free Bet!',
						content: nextRoundTime && `Come at ${dateFormat.format(nextRoundTime, 'DD/MM HH:mm')} for Next Round!` || '',
						'class': nextRoundTime ? 'm-christmas-pop m-pop--error' : 'm-christmas-pop m-pop--error m-christmas--fix',
						width: '80%',
						button: ['Go Gift Shop for More Gifts']
					}).onBtnClick(btnType => {
						if (btnType) {
							this.jmpShop();
						} else {
							this.clearData(ret.data ? ret.data : code === 4500 ? Object.assign(baseInfo, { remainNumber: 0 }) : {});
						}
					});
					break;
				default:
					this.$toast('Sorry, something went wrong. Please refresh and try again.');
				}
			}).catch(err => {
				console.log(err);
				this.$dialog();
				this.$toast(err.message || 'No internet connection, try again.');
			});
		},
		jmpLogin() {
			if (this.$popupLogin) {
				document.querySelector('#j_christmas').addClass('off');
				this.$popupLogin.show();
			} else {
				const okUrl = window.location.href;
				window.location.href = `${this.cfg.loginPath}?okUrl=${encodeURIComponent(okUrl)}`;
			}
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.isLogin = window.loginStatus;
			document.querySelector('#j_christmas').removeClass('off');
		},
		seeGifts() {
			this.jmpShop();
		},
		jmpGifts() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.gifts);
			}

			location.href = this.cfg.giftsPath;
		},
		jmpHome() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.home);
			}

			location.href = pagePath.home;
		},
		jmpShop() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.shop);
			}

			location.href = pagePath.shop;
		},
		handleDisableGrab() {
		},
		handleCloseShare() {
			this.isShowShare = false;
		},
		shareCelebrate() {
			this.handleShare();
		},
		beginShare() {
			this.handleShare();
		},
		handleShare() {
			if (appCore.getAppName() === 'sportybet') {
				appCore.share({
					title: 'share',
					url: this.cfg.shareCfg.url,
					hashtag: this.cfg.shareCfg.hashtag
				});
				appCore.shareNow();
			} else if (window.FB) {
				this.isShowShare = true;
			}
		},
		startTimer() {
			if (this.timer) {
				return;
			}

			const { countDown = 0 } = this.baseInfo || {};

			let dis = countDown;

			this.indexTime = formatTime(dis);

			if (this.indexTime.hour === 0 && this.indexTime.minute === 0 && this.indexTime.second === 0) {
				this.isOn = true;
				return;
			}

			let lastTime = Date.now() || +new Date();

			this.timer = setInterval(() => {
				const now = Date.now() || +new Date();
				dis -= (now - lastTime);
				lastTime = now;

				this.indexTime = formatTime(dis);

				if (dis <= 0) {
					clearInterval(this.timer);
					this.isOn = true;
					this.timer = null;
					return;
				}

				if (this.indexTime.hour === 0 && this.indexTime.minute === 0 && this.indexTime.second === 0) {
					clearInterval(this.timer);
					this.isOn = true;
					this.timer = null;
				}
			}, 100);
		},
		handleLoginBack() {
			document.querySelector('#j_christmas').removeClass('off');
		}
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');

		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$on(commonEvent.UPDATE_POP_LOGIN_BACK, this.handleLoginBack);
		EventBus.$on(commonEvent.SAVE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$off(commonEvent.UPDATE_POP_LOGIN_BACK, this.handleLoginBack);
		EventBus.$off(commonEvent.SAVE_LOGIN_STATUS, this.handleLoginStatus);
		this.timer && clearInterval(this.timer);
		this.timerId && clearInterval(this.timerId);
	}
};
</script>
<style lang="less">
@import './index.less';
</style>
