<template lang="html">
  <div class="m-page-wrapper">
	  <div>
		  <p class="m-page-title">
			<span class="m-icon-lock">Forgot Password</span>
		  </p>
		   <PagePhone
			v-if="showPhone"
			:account="getAccount"
			:countryCode="countryCode"
			:errorInfo="getErrorInfo('phone')"
			:loading="isLoading('phone')"
			@submit="goNext"/>
		   <div v-else class="m-page">
			  <PageSteps
				v-if="showSteps"
				:active="stepIndex" />
			  <PageCode
				v-if="showPage('code')"
				:errorInfo="getErrorInfo('code')"
				:remainCount="remainCount"
				:phone="getAccount"
				:isStartTimer="startTimer"
				:countryCode="countryCode"
				:loading="isLoading('code')"
				@submit="goNext"/>
			  <PageSMS
				v-if="showPage('sms')"
				:errorInfo="getErrorInfo('sms')"
				:smsContent="smsContent"
				:smsNumber="smsNumber"
				:phone="getAccount"
				:countryCode="countryCode"
                :msgThreshold="msgThreshold"
				:loading="isLoading('sms')"
				@submit="goNext"/>
			  <PagePassword
				v-if="showPage('password')"
				:errorInfo="getErrorInfo('password')"
				:loading="isLoading('password')"
				@submit="goNext"/>
			  <PageLogin
				v-if="showPage('login')"
				:errorInfo="getErrorInfo('login')"
				:account="getAccount"
				:countryCode="countryCode"
				:loading="isLoading('login')"
				@submit="goNext"/>
		   </div>
	  </div>
  </div>
</template>

<script>
import PagePhone from 'components/login/pagelet/phone.vue';
import PageSteps from 'components/login/pagelet/psdSteps.vue';
import PageCode from 'components/login/pagelet/psdCode.vue';
import PageSMS from 'components/login/pagelet/psdSMS.vue';
import PagePassword from 'components/login/pagelet/password.vue';
import PageLogin from 'components/login/pagelet/psdSignIn.vue';
import { noop } from 'utils';
import { debounce } from 'utils/debounce';

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationsTypes from 'store/changePsd/mutationTypes';

import PopTips from 'components/betslips/pagelet/popTips.vue';

import { pagePath } from 'config/pageConfig';

let debounced = null;

let timerId;

export default {
	components: {
		PagePhone,
		PageSteps,
		PageCode,
		PageSMS,
		PagePassword,
		PageLogin
	},
	data() {
		return {
			reqLoading: this.loading
		};
	},
	computed: {
		...mapState('changePsd', [
			'countryCode',
			'msgThreshold'
		]),
		...mapGetters('changePsd', {
			errorInfo: 'getErrorInfo',
			moduleName: 'getmoduleName'
		}),
		...mapGetters('changePsd', [
			'remainCount',
			'smsContent',
			'smsNumber',
			'getAccount',
			'loading'
		]),
		showPhone() {
			return this.moduleName === 'phone';
		},
		showSteps() {
			return ['code', 'sms', 'password', 'login'].indexOf(this.moduleName) !== -1;
		},
		startTimer() {
			return this.moduleName === 'code' && this.remainCount < this.msgThreshold && this.remainCount >= 0;
		},
		stepIndex() {
			// module 顺序
			const stepsKey = {
				code: 0,
				sms: 0,
				password: 1,
				login: 2
			};
			return stepsKey[this.moduleName];
		},
	},
	methods: {
		...mapActions('changePsd', [
			'verifyPhone',
			'getCode',
			'verifyResetCode',
			'verfiySms',
			'resetPassword',
			'login'
		]),
		...mapMutations('changePsd', {
			changemoduleName: mutationsTypes.UPDATE_NEXT_PAGE,
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE
		}),
		isLoading(module) {
			return this.moduleName === module && this.reqLoading;
		},
		goNext(opt) {
			if (debounced) {
				debounced.cancel();
			}

			let handleFuntion = noop,
				showTips = false;

			switch (opt.from) {
			case 'phone':
				handleFuntion = this.verifyPhone;
				break;
			case 'code-get':
				handleFuntion = this.getCode;
				break;
			case 'code':
				handleFuntion = this.verifyResetCode;
				break;
			case 'sms':
				handleFuntion = this.verfiySms;
				break;
			case 'password':
				handleFuntion = this.resetPassword;
				break;
			case 'login':
				handleFuntion = this.login;
				break;
			case 'go-sms':
				this.changemoduleName('sms');
				return;
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

						if (err.type && err.type === 'dialog') {
							this.showTips(err);
						}
					});
				}, 320);

				// 设置loading状态
				this.changeReqStaue(true);
				debounced();
			}
		},

		showPage(name) {
			return name === this.moduleName;
		},
		getErrorInfo(name) {
			const isCurrent = this.showPage(name);

			return isCurrent ? this.errorInfo : null;
		},
		showTips(err) {
			const self = this;

			self.$dialog();
			self.$dialog({
				title: null,
				contentData: {
					title: err.title || null,
					msg: err.msg || err,
				},
				content: PopTips,
				button: []
			}).onBtnClick(btnType => {
				err.moduleName && self.changemoduleName(err.moduleName);
			});
		},
	},
	watch: {
		moduleName(val) {
			if (!val) {
				location.href = pagePath.home;
			}

			timerId && clearTimeout(timerId);
			this.reqLoading = false;
		},
		loading(val, oldVal) {
			if (val) {
				this.reqLoading = true;
				timerId = setTimeout(() => {
					this.reqLoading = this.loading;
					clearTimeout(timerId);
					timerId = null;
				}, 500);
			} else {
				!timerId && (this.reqLoading = val);
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

@import 'components/betslips/style/popDialog.less';

.m-page-wrapper {
	background: url(./image/forgotPasswordBg2.png) no-repeat left bottom;
	background-size: cover;
	padding-bottom: 88px;

	> div {
		width: 880px;
		margin: 0 auto;
	}

	.m-page-title {
		font-size: 26px;
		color: @dark;
		line-height: 33px;
		padding: 30px 0 14px;

		.m-icon-lock {
			.m-icon-lock();

			&:before {
				display: inline-block;
				vertical-align: middle;
				font-size: 23px;
				margin-right: 10px;
			}
		}
	}

	.m-page {
		border-radius: 2px;
		width: 880px;
		height: 400px;
		background: @lighterGray;
	}

	.m-header-bar {
		background: @white;
	}

	.m-steps {
		padding: 35px 0 32px;
		border-bottom: 1px solid @fogGrayBorder;
		background: @white;
	}
}
</style>
