<template lang="html">
	<div class="m-page m-page--login">
		<AfHeader v-if="hasHeader" :backIcon="false" @close="closePop"/>
		<section class="m-page-main">
			<div class="m-tab-wrapper">
				<AfTabs
					class="m-page-nav"
					@change="handleToggle"
					:value="type">
			        <AfTabPane
			        	:label="registerText"
			        	:name="registerText"></AfTabPane>
			        <AfTabPane
			        	:label="loginText"
			        	:name="loginText"></AfTabPane>
			    </AfTabs>
			</div>
			<div class="m-opt-wrapper">
				<Tips
					v-if="tipsInfo"
					:type="tipsInfo.type || ''"
					:msg="tipsInfo && tipsInfo.msg || ''" />
				<div class="m-page-opt">
					<AfInput
						v-model="phone"
						placeholder="Mobile Number"
						icon="delete"
						:error="phoneError || isPhoneError"
						@change="validatorPhone"
						@keyup.enter="handleClick"
						:iconClick="clearAllInput">
						<span slot="prepend">{{countryCode}}</span>
					</AfInput>
					<AfInput
						type="password"
						v-model="password"
						:placeholder="getPsdPlaceholder"
						:toggleShowText="true"
						:error="passwordError || isPsdError"
						:initTextIconValue="initTextIconValue"
						@keyup.enter="handleClick"
						@change="validatorPsd">
						<PopOver
							v-if="type === registerText"
							position="bottom"
							:isCenter="false"
							:arrowCenter="false"
							triggerType="click"
							width="260px">
							<p>Length of 6-14 characters.<br />At least one letter and one number.</p>
						</PopOver>
					</AfInput>

					<a
						v-if="isLogin"
						:href="resetPsdUrl"
						class="m-forget">Forgot Password?</a>

					<div :class="[
							'm-btn-wrap',
							{
								'm-btn-wrap-fix': type === registerText
							}
						]"
					>
						<AfButton
							v-if="isLogin"
							@click="handleClick"
							:loading="loading"
							:disabled="submitStatus">Log In</AfButton>
						<AfButton
							v-else
							@click="handleClick"
							:loading="loading"
							:disabled="submitStatus">Create  Account</AfButton>
					</div>
				</div>
			</div>
			<div class="m-info-wrapper">
				<span class="m-log-third" @click="openIDOAuth"><i class="m-icon-facebook"></i>Log In with the Facebook</span>
				<p v-if="!isLogin" class="m-text-tips">
					By creating an account, you agree to our <a class="m-text-highlight" :href="`${helpUrl}?nav=terms-and-conditions`">Terms & Conditions</a> and confirm that you are at least 18 years old.
				</p>
			</div>
		</section>
	</div>
</template>

<script>
import 'packages/tabs';

import { fbLogin } from 'base/js/fbLogin';
import { fixPhone } from 'base/js/utils';
import { thirdPartyLogin } from 'core/js/loginBar';

import 'components/popOver';
import 'components/tips/index';
import { pagePath } from 'config/pageConfig';
import pageMixins from '../js/mixins';
import phoneValidator from '../js/phoneValidator';
import psdValidator from '../js/psdValidator';
import headerOperation from '../js/headerOptMixins';

export default {
	name: 'LoginHome',

	mixins: [pageMixins, psdValidator, phoneValidator, headerOperation],

	props: {
		loginText: {
			type: String,
			'default': 'Log In'
		},
		registerText: {
			type: String,
			'default': 'Register'
		},
		activeTab: {
			type: String,
			'default': 'Log In'
		},
		errorInfo: {
			type: Object,
			'default': null
		},
		isPop: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			type: this.activeTab || this.loginText,
			resetPsdUrl: pagePath.resetPassword,
			helpUrl: pagePath.help
		};
	},
	computed: {
		getPsdPlaceholder() {
			return this.type === this.loginText ? 'Password' : 'Set password';
		},
		initTextIconValue() {
			return this.type === this.loginText;
		},
		isLogin() {
			return this.type === this.loginText;
		},
		submitStatus() {
			return !(this.isPhoneReady && this.isPsdReady);
		},
		isPhoneError() {
			const errorInfo = this.errorInfo || {};
			return errorInfo.isPhoneError || false;
		},
		isPsdError() {
			const errorInfo = this.errorInfo || {};
			return errorInfo.isPsdError || false;
		},
		tipsInfo() {
			const errorInfo = this.errorInfo || {};

			if (this.psdErrorInfo) {
				return this.psdErrorInfo;
			}

			if (errorInfo && errorInfo.msg && !['dialog', 'content'].includes(errorInfo.type)) {
				return errorInfo;
			}
		}
	},
	methods: {
		handleToggle(val) {
			this.type = val;
			this.psdErrorInfo = '';
		},
		clearAllInput() {
			this.phone = '';
		},
		handleClick() {
			if (this.submitStatus) {
				return;
			}

			const phone = this.phone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}

			const checkPsdRet = this.type === this.registerText ? this.checkPassword(this.password) : true;

			if (checkPsdRet) {
				const isLogin = this.isLogin,
					params = {
						phone: this.phone,
						password: this.password
					};
				this.$emit('submit', {
					from: isLogin ? 'login' : 'register',
					params
				});
			}
		},
		openIDOAuth() {
			fbLogin().then(res => {
				thirdPartyLogin(res && res.fbToken || '')
				.then(ret => {
					if (ret && ret.login) {
						if (this.isPop) {
							this.$emit('closePop');
						} else {
							location.href = pagePath.home;
						}
					}
				});
			}).catch(() => {});
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.handleClick();
			}
		}
	},
	watch: {
		type(val) {
			this.password = '';
			this.passwordError = false;
			this.$emit('changeTab', val);
		}
	},
	mounted() {
		document.querySelector('.m-page--login').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--login').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@import 'base/style/icon.less';

@import '../style/button.less';
@import '../style/input.less';
@import '../style/error.less';

.m-page--login {

	.m-page-opt {
		padding: 36px 82px 0 82px;
		box-sizing: border-box;
		text-align: left;

		.m-input-wrapper {
			height: 54px;

			&.m-input-wrapper--active {
				.m-input-prepend,
				.m-input {
					border-color: 1px @green;
				}
			}

			&.m-input-wrapper--error {
				.m-input-prepend,
				.m-input {
					border-color: @red;
				}
			}

			&:nth-of-type(1) {
				.m-input {
					border-radius: 0 2px 0 0;
					border-bottom: none !important;
				}

				.m-input-prepend {
					border-bottom: none;
				}

				&.m-input-wrapper--active {

					& + .m-input-wrapper {
						.m-input {
							border-top: 1px solid @green;
						}
					}
				}

				&.m-input-wrapper--error {
					& + .m-input-wrapper {
						.m-input {
							border-top: 1px solid @red;
						}
					}
				}
			}

			&:nth-of-type(2) {
				.m-input {
					border-radius: 0  0 2px 2px;
				}
			}

			.m-input {
				height: 54px !important;
			}
		}

		.m-input-group--prepend {
			.m-input-prepend {
				border-radius: 2px 0 0 0;
			}

			// &.m-input-wrapper--error {
			// 	.m-input-prepend,
			// 	.m-input {
			// 		border-bottom: 1px solid @red;
			// 	}
			//
			// 	& + .m-input-wrapper {
			// 		.m-input {
			// 			border-top: none;
			// 		}
			// 	}
			// }

			// &.m-input-wrapper--active {
			// 	.m-input-prepend,
			// 	.m-input {
			// 		border-bottom: 1px solid @green;
			// 	}
			//
			// 	& + .m-input-wrapper {
			// 		.m-input {
			// 			border-top: none;
			// 		}
			// 	}
			// }
		}

		.m-btn-wrap {
			margin: 20px auto;
			text-align: center;

			.af-button {
				font-size: 16px;
			}
		}

		.m-btn-wrap-fix {
			margin: 35px auto 15px;
		}

		.m-forget {
			width: 100%;
			font-size: 16px;
			color: @linkBlue;
			text-align: right;
			display: inline-block;
			height: 33px;
			line-height: 33px;
			margin-bottom: -15px;
			margin-top: 5px;
			text-decoration: none;
		}
	}

	.m-info-wrapper {
		width: 100%;
		padding: 16px 82px 42px;
		box-sizing: border-box;
		text-align: left;

		.m-text-tips {
			font-size: 10px !important;
			line-height: 14px !important;
		}

		.m-text-highlight {
			text-decoration: none;
			color: @linkBlue;
		}

		.m-log-third {
			font-size: 16px;
			color: @linkBlue;
			display: inline-block;
			height: 33px;
			line-height: 33px;
			cursor: pointer;
		}

		.m-icon-facebook {
			display: inline-block;
			width: 19px;
			height: 19px;
			background: @linkBlue;
			color: @white;
			vertical-align: middle;
			margin: -2px 5px 0 0;
			.m-icon-facebook();

			&:before {
				display: inline-block;
    			transform: translate3d(2px,-4px,0);
			}
		}
	}

	.m-error-wrap {
		position: absolute;
		top: 0;

		.m-error {
			min-width: 300px;
			margin: 0 auto;
		}
	}

	.m-popOver-wrapper {
		padding: 10px;
		border: none;

		transform: translate3d(18px, -25px, 0);

		.m-popOver {
			font-size: 10px;
			line-height: 14px;
		}

		.m-popOver-arrow {
			top: -6px !important;
			border: none;
		}
	}
}
</style>
