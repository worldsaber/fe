<template lang="html">
  <div class="m-pop-wrapper" v-if="showPop">
	  <div class="m-pop-bg"></div>
	  <div class="m-pop-mian">
		  <SlideAnimation
			:pageCount="3"
			:activeIndex="moduleIndex">
			<SlideItem :pageIndex="0">
				<LoginHome
					@submit="goNext"
					@closePop="handleClose"
					@changeTab="handleToggle"
					:errorInfo="errorInfo"
					:account="getAccount"
					:countryCode="countryCode"
					:loading="loading"
					:isPop="true"
					:activeTab="activeTab"/>
			</SlideItem>
			<SlideItem :pageIndex="1" v-if="!showSMSPage">
				<LoginCode
					:phone="getAccount"
					:countryCode="countryCode"
					:errorInfo="errorInfo"
					:remainCount="remainCount"
					:loading="loading"
					:needReset="moduleIndex === 1"
					:isStartTimer="startTimer"
					@submit="goNext"
					@back="goPrev"
					@closePop="handleClose"/>
			</SlideItem>
			<SlideItem :pageIndex="1" v-else>
				<LoginSMS
					:phone="getAccount"
					:countryCode="countryCode"
					:smsNumber="smsNumber"
					:smsContent="smsContent"
					:loading="loading"
					:needReset="moduleIndex === 1"
					:moduleName="moduleName"
					@submit="goNext"
					@closePop="handleClose"
					@back="goPrev"/>
			</SlideItem>
			<SlideItem :pageIndex="2" class="m-item-suc">
				<LoginSuc
					:promotionAd="promotionAd"
					:referralCode="referralCode"
					:loading="loading"
					:errorInfo="errorInfo"
                    :sucCfg="sucCfg"
					@submit="goNext"
					@closePop="handleClose"
					@back="goPrev"/>
			</SlideItem>
		  </SlideAnimation>
	  </div>
  </div>
</template>

<script>
import SlideAnimation from 'components/slideAnimation/slideContainer.vue';
import SlideItem from 'components/slideAnimation/slideItem.vue';
import LoginHome from 'components/login/pagelet/index.vue';
import LoginCode from 'components/login/pagelet/code.vue';
import LoginSuc from 'components/login/pagelet/success.vue';
import LoginSMS from 'components/login/pagelet/SMS.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationsTypes from 'store/changePsd/mutationTypes';
import { noop } from 'utils';
import { debounce } from 'utils/debounce';

import PopTips from 'components/betslips/pagelet/popTips.vue';

let debounced = null;

export default {

	components: {
		SlideAnimation,
		SlideItem,
		LoginHome,
		LoginCode,
		LoginSuc,
		LoginSMS
	},
	props: {
		currentTab: {
			type: String,
			'default': 'Log In'
		}
	},
	data() {
		return {
			activeTab: this.currentTab,
			account: '',
			needReset: true
		};
	},
	computed: {
		...mapState('login', [
			'countryCode',
			'promotionAd',
			'referralCode',
			'msgThreshold',
			'sucCfg'
		]),
		...mapGetters('login', {
			errorInfo: 'getErrorInfo',
			moduleName: 'getmoduleName'
		}),
		...mapGetters('login', [
			'remainCount',
			'smsContent',
			'smsNumber',
			'getAccount',
			'loading',
			'moduleIndex',
			'modulePath'
		]),
		showSMSPage() {
			return this.modulePath.includes('sms');
		},
		showPop() {
			return !!this.moduleName;
		},
		startTimer() {
			return this.moduleName === 'code' && this.remainCount < this.msgThreshold && this.remainCount >= 0;
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
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE,
			changeAccount: mutationsTypes.UPDATE_ACCOUNT
		}),
		goPrev() {
			this.changemoduleName();

			this.clearErrorInfo(null);
		},
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
		showTips(err) {
			const self = this;

			self.$parent.hide();

			self.$dialog({
				title: null,
				contentData: {
					title: err.title || null,
					msg: err.msg || err,
				},
				content: PopTips,
				button: []
			}).onBtnClick(res => {
				err.moduleName && self.changemoduleName(err.moduleName);
				self.$parent.show();
			});
		},
		handleClose() {
			this.changemoduleName('');
		},
		handleToggle(val) {
			this.activeTab = val;
		},
	},
	watch: {
		// 关闭弹窗
		moduleName(val, oldVal) {
			if (!val) {
				this.$parent.close();
			}

			if (val === 'success') {
				this.setReferralCode();
			}
		},
		activeTab(val) {
			// clear errorInfo
			this.clearErrorInfo(null);

			// reset request status
			this.changeReqStaue(false);
		}
	},
	created() {
		this.account && this.changeAccount(this.account);
	},
	mounted() {
		// 设置首个moduleName
		!this.moduleName && this.changemoduleName('login');

		// 解决返回按钮关闭弹窗问题
		this.$parent.onBtnClick(btnType => {
			if (btnType === 'back') {
				return false;
			}
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

@import 'components/betslips/style/popDialog.less';

@import '../style/popDialog.less';
@import '../style/tabNav.less';

.m-pop-dialog__wrapper {

	.m-page--login {
		padding: 0;

		.m-page-main {
			position: relative;
			top: -110px;
			padding: 0 44px !important;
		}

		.m-tab-wrapper {
			position: relative;
			height: 110px;
			z-index: 999;
		}

		.m-page-nav {
			width: 300px;
			border-bottom: none;
			margin: 0 auto;
			transform: translate3d(0,33px,0);
		}

		.m-page-opt {
			padding: 39px 0 0;
			box-sizing: border-box;
			width: 300px;
			margin: 0 auto;

			.m-input-wrapper {
				padding: 0;
				background: transparent;

				.m-input-prepend,
				.m-input {
					background: @white;
				}

				.m-input-prepend {
					border-radius: 2px 0 0 0;
				}
			}
		}

		.m-info-wrapper {
			width: 300px;
			margin: 0 auto;
			padding-left: 0;
			padding-right: 0;
			padding-bottom: 0;
			text-align: left;

			.m-log-third {
				width: 300px;
				margin: 0 auto;
				display: block;
			}

			.m-text-tips {
				text-align: left;
			}
		}
	}

	.m-page--code,
	.m-page--sms {
		padding: 0;
	}

	.m-page--success {
		padding: 0;

		.m-page-main {
			padding-top: 0;
		}
	}

	.m-item-suc {
		background: @white url(../image/popSuc.jpg) no-repeat;
	}
}
</style>
