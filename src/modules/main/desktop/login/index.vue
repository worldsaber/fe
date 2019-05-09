<template lang="html">
  <div class="m-page-wrapper">
	  <div class="m-page-header">
		  <div>
			  <a class="m-image-wrapper" href="/">
				  <img src="../common/core/image/logo.png" alt="sportyBet" />
			  </a>
		  </div>
	  </div>
	  <div class="m-page-container">
		  <div>
			  <LoginHome
    			v-if="showHome"
    			:activeTab="activeTab"
    			@submit="goNext"
    			@changeTab="handleToggle"
    			:errorInfo="getShowError()"
    			:account="getAccount"
    			:countryCode="countryCode"
    			:loading="loading && moduleName === 'login'"
    			:hasHeader="false"/>
    		  <div v-if="showPage('success')" class="m-page">
    			<LoginSuc
    				:promotionAd="promotionAd"
                    :sucCfg="sucCfg"
    				:referralCode="referralCode"
    				:errorInfo="errorInfo"
    				:loading="loading && moduleName === 'success'"
    				@submit="goNext"
    			/>
    		  </div>
		  </div>
	  </div>
  </div>
</template>

<script>
import LoginHome from 'components/login/pagelet/index.vue';
import LoginSuc from 'components/login/pagelet/psdSuccess.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationsTypes from 'store/changePsd/mutationTypes';
import { noop, URL } from 'utils';
import { EventBus } from 'kernel/js/eventBus.js';
import { debounce } from 'utils/debounce';

import { pagePath } from 'config/pageConfig';

import PopTips from 'components/betslips/pagelet/popTips.vue';

import PopDialog from './popDialog';

let popDialog = null,
	debounced = null;

export default {
	components: {
		LoginHome,
		LoginSuc
	},
	props: {
		currentTab: {
			type: String,
			'default': 'Log In'
		}
	},
	data() {
		let type = URL.getPara('type');

		if (type.toLowerCase() === 'register') {
			type = 'Register';
		}

		if (type.toLowerCase() === 'login') {
			type = 'Log In';
		}

		return {
			activeTab: type || this.currentTab
		};
	},
	computed: {
		...mapState('login', [
			'countryCode',
			'promotionAd',
			'referralCode',
			'sucCfg'
		]),
		...mapGetters('login', {
			errorInfo: 'getErrorInfo',
			moduleName: 'getmoduleName'
		}),
		...mapGetters('login', [
			'getAccount',
			'loading'
		]),
		showPopDialog() {
			return this.activeTab === 'Register' && ['code', 'sms'].indexOf(this.moduleName) !== -1;
		},
		showHome() {
			return this.moduleName !== 'success';
		}
	},
	methods: {
		...mapActions('login', [
			'login',
			'register',
			'verfiyCode',
			'verfiySms',
			'getCode',
			'setReferralCode'
		]),
		...mapMutations('login', {
			changemoduleName: mutationsTypes.UPDATE_NEXT_PAGE,
			clearErrorInfo: mutationsTypes.HNADLE_ERROR,
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE
		}),
		showPage(val) {
			return this.moduleName === val;
		},

		// handle request & response
		goNext(opt) {
			if (debounced) {
				debounced.cancel();
			}

			let handleFuntion = noop,
				showTips = false;

			switch (opt.from) {
			case 'login':
				handleFuntion = this.login;
				break;
			case 'register':
				handleFuntion = this.register;
				break;
			case 'code':
				handleFuntion = this.verfiyCode;
				break;
			case 'sms':
				handleFuntion = this.verfiySms;
				break;
			case 'code-get':
				handleFuntion = this.getCode;
				break;
			case 'referralCode':
				handleFuntion = this.setReferralCode;
				break;
			case 'dialog-tips':
				showTips = true;
				break;
			default:
				break;
			}

			if (showTips) {
				this.showTips(opt.params);
			} else {
				debounced = debounce(() => {
					handleFuntion(opt.params).then(null, () => {
						const err = this.errorInfo || {};

						if (err.type === 'dialog') {
							this.showTips(err);
						}
					});
				}, 320);

				// 设置loading状态
				this.changeReqStaue(true);
				debounced();
			}
		},
		// show errorInfo
		showTips(err) {
			const self = this;

			popDialog && popDialog.hide();

			self.$dialog({
				title: null,
				contentData: {
					title: err.title || null,
					msg: err.msg || err,
				},
				content: PopTips,
				button: []
			}).onBtnClick(res => {
				const module = err.moduleName;
				module && self.changemoduleName(module);
				popDialog.show();
			});
		},

		handleToggle(val) {
			this.activeTab = val;
		},
		showPop() {
			popDialog = PopDialog();

			popDialog.onBtnClick(btnType => {
				this.hidePop();
				this.changemoduleName('login');
				return false;
			});
		},
		hidePop() {
			popDialog && popDialog.close();
			popDialog = null;
		},
		getShowError() {
			if (this.moduleName === 'login') {
				return this.errorInfo;
			}

			return null;
		}
	},
	watch: {
		showPopDialog(val) {
			if (val) {
				!popDialog && this.showPop();
			} else {
				popDialog && this.hidePop();
			}
		},
		activeTab(val) {
			// clear errorInfo
			this.clearErrorInfo(null);

			// reset request status
			this.changeReqStaue(false);
		},
		moduleName(val) {
			if (val === '') {
				const retUrl = URL.getPara('okUrl') || URL.getPara('ret');
				if (retUrl) {
					location.href = retUrl;
				} else {
					location.href = pagePath.home;
				}
			}

			if (val === 'success') {
				this.setReferralCode();
			}
		}
	},
	mounted() {
		EventBus.$on('goNextModule', this.goNext);
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/mixin.less';

@import 'components/login/style/tabNav.less';
@import 'components/betslips/style/popDialog.less';

.m-page-wrapper {
	.m-page-header {
		height: 73px;
		background: @red;

		> div {
			width: 1000px;
			margin: 0 auto;
		}

		.m-image-wrapper {
            display: inline-block;
			height: 100%;
			width: 207px;
			padding: 20px 16px;
			box-sizing: border-box;
			.m-image-wrapper();
		}
	}

	.m-page-container {
		background: @lightGray;

		>div {
			background: url(./image/loginBg.png) no-repeat left top;
			background-size: cover;
			width: 1000px;
			margin: 0 auto;
			height: 564px;
			padding: 63px 0 61px;
			box-sizing: border-box;
		}

		.m-page {
			text-align: right;
		}

		.m-page-main {
			width: 462px;

			background: @white;
			display: inline-block;
		}

		.m-page-nav {
			width: 100%;
			margin: 0 auto;
			padding: 32px 48px 25px;
			box-sizing: border-box;
			border-bottom: 1px solid @fogGrayBorder;
		}
	}

	.m-popOver-wrapper {
		z-index: 100;
	}
}
</style>
