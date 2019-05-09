<template>
<div class="m-register-and-login">
	<af-tabs class="independent-tabs-container" v-model="currentTab">
		<af-tab-pane label="Register" name="register">
			<form>
			<div class="error-msg-area">
				<div class="error-msg-container" v-if="registerPhoneError || registerPsdError">
					<div class="error-icon"><i :class="'m-' + (regErrorMsg.type === 'error' ? 'error' : 'warn') + '-icon'"></i></div>
					<div class="error-msg">
						<p class="error-msg-label">{{regErrorMsg.text}}</p><a v-if="regErrorMsg.linkText" :href="regErrorMsg.link">{{regErrorMsg.linkText}}</a></div>
				</div>
			</div>

			<af-input class="mobile-number" placeholder="Mobile Number" :maxlength="18" v-model='registerPhone' icon="delete" :iconClick='clearRegPhone' :error='registerPhoneError' @change="regChangeHandler">
				<span slot="prepend">+{{countryCode}}</span>
			</af-input>
			<af-input class="password" type="password" :toggleShowText="true" :initTextIconValue="false" placeholder="Set Password" :error="registerPsdError" v-model='registerPassword' @change="regChangeHandler">
			</af-input>
			<div class="forget-password">
			    <div class="password-rules"><p>length of 6-14 characters.</p><p>At least one letter and one number.</p></div>
			</div>
			<af-button class="create-btn" :autofocus="false" @click.prevent="handleRegister" :disabled="registerBtnDisabled" :loading="registerBtnLoading">
				<span>{{registerBtnLoading ? 'Loading' : 'Create Account'}}</span>
			</af-button>
			</form>
		</af-tab-pane>

		<af-tab-pane label="Log In" name="login">
			<form>
			<div class="error-msg-area">
				<div class="error-msg-container" v-if="loginPhoneError || loginPsdError">
					<div class="error-icon"><i :class="'m-' + (loginErrorMsg.type === 'error' ? 'error' : 'warn') + '-icon'"></i></div>
					<div class="error-msg">
						<p class="error-msg-label">{{loginErrorMsg.text}}</p><a v-if="loginErrorMsg.linkText" :href="loginErrorMsg.link">{{loginErrorMsg.linkText}}</a></div>
				</div>
			</div>
			<af-input class="mobile-number" placeholder="Mobile Number" :maxlength="18" v-model='loginPhone' icon="delete" :iconClick='clearLoginPhone' :error='loginPhoneError' @change="loginChangeHandler">
				<span slot="prepend">+{{countryCode}}</span>
			</af-input>
			<af-input class="password" type="password" :toggleShowText="true" :initTextIconValue="false" placeholder="Password" :error="loginPsdError" v-model='loginPassword' @change="loginChangeHandler">
			</af-input>
			<div class="forget-password">
				<span @click="goForgetPwd">Forgot Password?</span>
			</div>
			<af-button class="create-btn" :autofocus="false" @click.prevent="handleLogin" :disabled="loginBtnDisabled" :loading="loginBtnLoading">
				<span>{{loginBtnLoading ? 'Loading' : 'Log In'}}</span>
			</af-button>
			</form>
		</af-tab-pane>
	</af-tabs>

	<template v-if="hasFacebookLogin">
		<div class="login-with-facebook" @click="openIDOAuth">
			<i class="m-facebook-icon"></i>
			<span>Log In With Facebook</span>
		</div>
	</template>

	<template v-if="hasRegisterDesc">
		<slot name="register-desc" >
			<div class="m-register-desc" v-show="currentTab === 'register'">
				<p>By creating an account, you agree to our
					<a :href="`${helpUrl}#/about/terms-and-conditions`" class='hightlight'> Terms & Conditions </a>and confirm that you are at least 18 years old.
				</p>
			</div>
		</slot>
	</template>
</div>
</template>

<script>
import cookie from 'storage/cookie';
import md5 from 'blueimp-md5';
import AfButton from 'packages/button';
import dialog from 'components/dialog';
import { AfInput } from 'components/input';
import { AfTabs, AfTabPane } from 'packages/tabs';
import { fbLogin } from 'base/js/fbLogin.js';
import { fixPhone } from 'base/js/utils';
import { thirdPartyLogin } from 'core/js/loginBar.js';
import { pagePath } from 'config/pageConfig';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import errorMessage from './errorMsg/registerAndLogin';

export default {
	name: 'registerAndLogin',
	props: {
		hasFacebookLogin: {
			type: Boolean,
			'default': true
		},
		hasRegisterDesc: {
			type: Boolean,
			'default': true
		}
	},

	components: {
		AfButton,
		AfInput,
		AfTabs,
		AfTabPane
	},
	created () {
		const phone = cookie('phone');
		if (phone) {
			this.loginPhone = phone;
			this.currentTab = 'login';
		} else {
			this.currentTab = 'register';
		}
	},
	data () {
		return {
			registerPhone: '',
			loginPhone: '',
			currentTab: '',
			registerPassword: '',
			loginPassword: '',
			registerPhoneError: false,
			loginPhoneError: false,
			registerPsdError: false,
			loginPsdError: false,
			registerBtnLoading: false,
			loginBtnLoading: false,
			registerBtnDisabled: true,
			loginBtnDisabled: true,
			showFooter: false,
			regErrorMsg: {},
			loginErrorMsg: {},
			helpUrl: pagePath.help,
			countryCode: window.countryCode || '254'
		};
	},
	watch: {
		registerPhone () {
			if (this.registerPhoneError) {
				this.registerPhoneError = false;
			}
		},
		loginPhone () {
			if (this.loginPhoneError) {
				this.loginPhoneError = false;
			}
		},
		registerPassword () {
			if (this.registerPsdError) {
				this.registerPsdError = false;
			}
		},
		loginPassword () {
			if (this.loginPsdError) {
				this.loginPsdError = false;
			}
		}
	},
	methods: {
		clearRegPhone () {
			this.registerPhone = '';
		},
		clearLoginPhone () {
			this.loginPhone = '';
		},
		regChangeHandler () {
			if (this.registerPhone === '' || this.registerPassword === '') {
				this.registerBtnDisabled = true;
			} else {
				this.registerBtnDisabled = false;
			}
		},
		loginChangeHandler () {
			if (this.loginPhone === '' || this.loginPassword === '') {
				this.loginBtnDisabled = true;
			} else {
				this.loginBtnDisabled = false;
			}
		},
		goForgetPwd () {
			this.$emit('goFindAccount');
		},
		openIDOAuth () {
			fbLogin()
				.then(res => {
					thirdPartyLogin((res && res.fbToken) || '').then(ret => {
						if (ret && ret.login) {
							if (this.$parent.isPop) {
								this.$popupLogin.close();

								window.loginStatus = true;
								EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
							} else {
								location.href = pagePath.home;
							}
						} else if (ret && ret.phoneNotFound) {
							this.$parent.goRegWithFb({
								phone: ''
							});
						}
					});
				})
				.catch(e => {
					dialog.alert('An error occurred while connecting to Facebook.', [
						'OK'
					]);
				});
			// this.$emit('openIDOAuth'); 通过事件触发login发生 xfbml错误
		},
		handleRegister () {
			if (this.registerBtnLoading) {
				return;
			}
			const phone = this.registerPhone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.registerPhone = tempPhone;
			}
			const result = this.checkpwd(this.registerPassword);
			if (result === 'short') {
				this.regErrorMsg = {
					type: 'error',
					text: 'Password cannot be shorter than 6 characters.',
					field: 'password',
					link: '',
					linkText: ''
				};
				this.registerPsdError = true;
				return;
			} else if (result === 'long') {
				this.regErrorMsg = {
					type: 'error',
					text: 'Password cannot be longer than 14 characters.',
					field: 'password',
					link: '',
					linkText: ''
				};
				this.registerPsdError = true;
				return;
			} else if (result === 'mix') {
				this.regErrorMsg = {
					type: 'error',
					text: 'Password must contain at least one letter and one number.',
					field: 'password',
					link: '',
					linkText: ''
				};
				this.registerPsdError = true;
				return;
			}
			this.registerPsdError = false;
			this.registerBtnLoading = true;
			fetch('/patron/account', {
				method: 'POST',
				body: {
					phone: this.registerPhone,
					password: md5(this.registerPassword)
				}
			})
				.then(res => res.json())
				.then(res => {
					this.registerBtnLoading = false;
					if (res.bizCode === 10000) {
						// 注册成功
						this.$emit('goVeriry', {
							phone: this.registerPhone,
							remainMsgNum: res.data.remainMsgNum,
							token: res.data.token,
							showWarning: res.data.remainMsgNum === 1
						});
					} else if (res.bizCode === 11610) {
						// 不需要验证码直接注册成功
						this.$emit('goFinish');
						cookie('phone', this.registerPhone, {
							path: '/',
							expires: 365
						});

						// 更新登录状态
						window.loginStatus = true;

						// 广播登陆全局消息
						EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);
					} else if (res.bizCode === 11703) {
						// 无法继续发送短信
						this.$emit('goSms', {
							bizType: 'REGISTER',
							phone: this.registerPhone,
							smsNumber: res.data.smsNumber,
							msgContent: res.data.msgContent,
							token: res.data.token
						});
					} else if (res.bizCode === 11705) { // 这里需要在发送短信的页面下显示弹窗
						this.$emit('goVeriry', {
							phone: this.registerPhone,
							warnForNG: res.message
						});
					} else {
						const errObj = errorMessage[res.bizCode] ?
							errorMessage[res.bizCode] :
							{};
						errObj.text = res.message; // 使用后台返回的错误信息
						this.regErrorMsg = errObj;
						if (errObj.field === 'phone') {
							this.registerPhoneError = true;
						} else {
							this.registerPsdError = true;
						}
					}
				})
				.catch(res => {
					this.registerBtnLoading = false;
					dialog.alert('No internet connection, try again.', ['OK']);
				});
		},
		handleLogin () {
			if (this.loginBtnLoading) {
				return;
			}
			const phone = this.loginPhone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.loginPhone = tempPhone;
			}
			// const result = this.checkpwd(this.loginPassword);
			// if (result === 'short') {
			// 	this.loginErrorMsg = {
			// 		type: 'error',
			// 		text: 'Password cannot be shorter than 6 characters.',
			// 		field: 'password',
			// 		link: '',
			// 		linkText: ''
			// 	};
			// 	this.loginPsdError = true;
			// 	return;
			// } else if (result === 'long') {
			// 	this.loginErrorMsg = {
			// 		type: 'error',
			// 		text: 'Password cannot be longer than 14 characters.',
			// 		field: 'password',
			// 		link: '',
			// 		linkText: ''
			// 	};
			// 	this.loginPsdError = true;
			// 	return;
			// } else if (result === 'mix') {
			// 	this.loginErrorMsg = {
			// 		type: 'error',
			// 		text: 'Password must contain at least one letter and one number.',
			// 		field: 'password',
			// 		link: '',
			// 		linkText: ''
			// 	};
			// 	this.loginPsdError = true;
			// 	return;
			// }
			this.loginPsdError = false;
			this.loginBtnLoading = true;
			fetch('/patron/accessToken', {
				method: 'POST',
				body: {
					username: this.loginPhone,
					password: md5(this.loginPassword)
				}
			})
				.then(res => res.json())
				.then(res => {
					this.loginBtnLoading = false;
					if (res.bizCode === 10000) {
						// 登录成功
						cookie('phone', this.loginPhone, {
							path: '/',
							expires: 365
						});
						const jumpUrl = URL.getPara('okUrl');
						location.href = jumpUrl === '' ? pagePath.home : jumpUrl;
					} else {
						const errObj = errorMessage[res.bizCode];
						errObj.text = res.message; // 使用后台返回的错误信息
						this.loginErrorMsg = errObj;
						if (errObj.field === 'phone') {
							this.loginPhoneError = true;
						} else {
							this.loginPsdError = true;
						}
					}
				})
				.catch(res => {
					this.loginBtnLoading = false;
					dialog.alert('No internet connection, try again.', ['OK']);
				});
		},
		checkpwd (text) {
			if (text.length < 6) {
				return 'short';
			} else if (text.length > 14) {
				return 'long';
			} else if (!/[a-z]/gi.test(text) || !/[0-9]/.test(text)) {
				return 'mix';
			}
			return true;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

.m-register-and-login {
  .independent-tabs-container {
	  width:100%;
    .m-tabs-tab {
      width: 96/@rem;
      font-size: 22/@rem;
      line-height: 1.5;
      text-align: middle;
      color: #0d9737;
    }
    .m-tabs-ink-bar {
      background: #0d9737;
      transform: scaleX(0.78);
      margin-left: 14/@rem;
    }
    .m-input-wap-wrapper--active {
	  border: 1px solid #0d9737 !important;
	  z-index: 1;
    }
    .error-msg-area {
      margin-top: 1/@rem;
      width: 100%;
      margin-bottom: 2/@rem;
      min-height: 34/@rem;
    }
    .error-msg-container {
      width: 100%;
      background-color: @ligterRed;
      margin-bottom: -4/@rem;
      .error-msg {
        padding-top: 11/@rem;
        padding-bottom: 12/@rem;
        line-height: 11/@rem;
        margin-left: 34/@rem;
      }
      .error-icon {
        float: left;
        margin-top: 5px;
      }
      .m-error-icon {
        width: 16/@rem;
        height: 16/@rem;
        margin-left: 13.6/@rem;
        margin-bottom: 11/@rem;
        color: @darkRed;
        .m-icon-delete2();
      }

      .m-warn-icon {
        width: 11.8/@rem;
        height: 11.8/@rem;
        margin-left: 11.6/@rem;
        margin-bottom: 11/@rem;
        color: @darkRed;
        .m-icon--error();
      }

      .error-msg-label {
        margin-left: 4/@rem;
        font-size: 10/@rem;
        text-align: left;
        color: @darkRed;
      }
    }

    .mobile-number {
      height: 50/@rem;
      background-color: @white;
      width: 100%;
	  margin-top: 4/@rem;

      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      font-size: 14/@rem;
      input {
		height:50/@rem;
        padding: 20/@rem 10px;
      }
    }

    .password {
      height: 50/@rem;
      background-color: @white;
      margin-bottom: 6/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
	  box-sizing: border-box;
	  margin-top: -1px;

      input {
		font-size: 14/@rem;
		height:100%;
        padding: 20/@rem 10px;
      }
    }

    .forget-password {
      height: 33/@rem;
      margin-bottom: -9/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      font-size: 14/@rem;
      text-align: right;
      color: @linkBlue;
      line-height: 2.36;

      .password-rules {
        font-size: 11/@rem;
        color: @darkGray;
        text-align: left;
        line-height: 1.5;
        margin-bottom: 4/@rem;
      }
    }

    .create-btn {
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      margin-top: 14px;
      box-sizing: border-box;
      height: 47.5/@rem;
      background-color: @green;
      border: none;
      font-size: 14/@rem;
    }

    .af-button.create-btn:active {
      background-color: @midBlue;
    }
  }

  .login-with-facebook {
    margin: 27/@rem auto 0;
    height: 33/@rem;
    font-size: 14/@rem;
    line-height: 2.36;
    text-align: center;
    color: @linkBlue;

    .m-facebook-icon {
      width: 19/@rem;
      height: 19/@rem;
      margin-right: 6/@rem;
      background-color: @linkBlue;
      color: @white;
      .m-icon-facebook();
    }
  }
  .m-register-desc {
    font-size: 11/@rem;
    line-height: 1.36;
    text-align: left;
	color: @dark;

	p {
		word-wrap: break-word;
	}
  }
}
</style>
