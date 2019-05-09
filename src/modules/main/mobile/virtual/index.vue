<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="true" :isHasFooter="false">
		<div slot="mid" class="virtual" :style="virtualStyle">
			<div id="golden-race-mobile-app" >
			</div>
		</div>
	</Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import { mapMutations } from 'vuex';
import { TOGGLE_LEFT, TOGGLE_RIGHT, CHANGE_LOADING } from 'store/layout/mutationTypes';
import appCore from 'appCore';

const defaulHash = 'ded7cf4dffd43b4d8fb31f913ad23204';
const defaultScriptUrl = 'https://virtual.golden-race.net/mobile-v2/golden-race-mobile-loader.js';

export default{
	name: 'virtual',
	components: {
		Layout
	},
	data () {
		return {
			virtualStyle: {}
		};
	},
	mounted () {
		this.resetHeight();
		window.addEventListener('resize', this.resetHeight, false);
		this.getHash()
		.then(data => {
			const param = {};
			if (data.onlineHash) {
				param.onlineHash = data.onlineHash;
			} else if (data.anonHash) {
				param.hwId = data.anonHash;
			}
			return this.mountSDK(data.mobileUrl || defaultScriptUrl)
			.then(() => param);
		})
		.catch(() => {
			const param = {};
			// 出错走默认未登录的hash
			param.hwId = defaulHash;
			return this.mountSDK(defaultScriptUrl)
			.then(() => param);
		})
		.then(param => {
			param.showHeader = true;
			param.showFooter = true;
			param.showMenuBetHistory = false;
			param.showMenuCredit = false;
			param.showMenuProfile = false;
			param.showMenuLoginButton = false;
			param.showMenuLogoutButton = false;
			// console.log(param);
			const loader = window.grMobileLoader(param);
			loader.onLogout(() => {
				location.reload();
			});
			// console.log(loader.onLogout);
			loader.onCreditUpdate((eventName, eventArguments) => {
				// console.log('in on CreditUpdate');
				if (appCore.getAppName() === 'sportybet') {
					appCore.sportybet.ready(AFJsApi => {
						// console.log('in ready no api');
						if (!AFJsApi) {
							return;
						}
						// console.log('in ready');
						// alert('ref');
						AFJsApi.common.postNotification({
							name: 'com.sportybet.action.JS_EVENT',
							params: {
								eventName: 'refreshBalance'
							}
						});
					});
				} else {
					EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
				}
			});
			this.changeLoading(false);
			return loader;
		});

		if (appCore.getAppName() === 'sportybet') {
			appCore.sportybet.ready(AFJsApi => {
				if (!AFJsApi) {
					return;
				}
				AFJsApi.common.postNotification({
					name: 'com.sportybet.action.JS_EVENT',
					params: {
						eventName: 'refreshBalance'
					}
				});
			});
		} else {
			EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
		}

		// 登录状态发生变化重新刷新页面
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, val => {
			window.location.reload();
		});
	},
	beforeDestroy () {
		window.removeEventListener('resize', this.resetHeight);
	},
	methods: {
		...mapMutations('layout', [TOGGLE_LEFT, TOGGLE_RIGHT, CHANGE_LOADING]),
		getHash () {
			const t = new Headers();
			t.append('OperId', window.operId);
			return fetch('patron/goldenrace-account', {
				headers: t
			})
			.then(res => res.json())
			.then(res => {
				if (res && res.bizCode === 10000 && res.data) {
					return res.data;
				}
				return Promise.reject();
			});
		},
		resetHeight () {
			const winHeight = document.documentElement.clientHeight;
			const mobileNavbar = document.querySelector('.mobile-navbar');
			if (mobileNavbar) {
				const navHeight = mobileNavbar.getBoundingClientRect().height;
				const height = winHeight - navHeight;
				this.$set(this.virtualStyle, 'height', height + 'px');
			}
		},
		mountSDK(url) {
			console.log('js:' + url);
			return new Promise((resolve, reject) => {
				const scirptEl = document.createElement('script');
				scirptEl.src = url;
				scirptEl.id = 'golden-race-mobile-loader';
				document.querySelector('body').appendChild(scirptEl);
				scirptEl.addEventListener('load', () => {
					resolve();
				});
			});
		}
	}
};
</script>
<style lang="less">
	@import './index.less';
</style>
