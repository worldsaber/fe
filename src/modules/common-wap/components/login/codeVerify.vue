<template>
<div id="codeVerify">
	<div class="verifyMobile">
		<form>
			<div class="verify-label">
				<p>Verify Mobile Number</p>
			</div>
			<div class="action-label">{{'We’ve sent you a 6-digit code to +' + countryCode + ' ' + phone}}<span class="change-number" @click="changeNum">Change Number</span></div>
			<af-input class="verifyInputs" type="tel" placeholder="Verification  Code" icon="delete" :maxlength="18" v-model="verifyCode" :error="showError">
				<div slot="append">
					<span v-if="!loadingCode" class="send-again" @click="handleSendCode(true)">{{'Send Again'+(timer===0 ? '':' (' + timer + 's)')}}</span>
					<i v-else class="af-icon-loading"></i>
				</div>
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<div class="m-go-sms" @click="goSms" v-if="country === 'ke' && bizType === 'REGISTER'">Didn't receive the code?</div>
			<af-button @click.prevent="handleVerify" class="verify-btn" :disabled="disabled" :loading="loading">
				{{loading ? 'Loading' : (bizType === 'PASSWORD_RESET' ? 'Next' : 'Complete Registration')}}
			</af-button>
		</form>
	</div>
</div>
</template>

<script>
import { AfInput } from 'components/input';
import afButton from 'packages/button/index';
import cookie from 'storage/cookie';
import dialog from 'components/dialog';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
// import {
// 	codeVerifyErr,
// 	sendSmsErr
// } from './errorMsg/codeVerify';
// import '../../../mockData/operation?debug';

let token = '';
let tokenSaved = '';

export default {
	name: 'codeVerify',
	components: {
		AfInput,
		afButton
	},
	props: {
		phone: {
			type: String,
			'default': ''
		},
		bizType: {
			type: String,
			'default': 'REGISTER'
		},
		showWarning: {
			type: Boolean,
			'default': false
		},
		warnForNG: {
			type: String,
			'default': ''
		},
		preToken: {
			type: String,
			'default': ''
		},
		regDefault: {
			type: Object,
			default () {
				return {};
			}
		}
	},
	data () {
		return {
			verifyCode: '',
			timer: 0,
			disabled: true,
			sendCodeDisabled: false,
			requestWindow: false,
			loading: false,
			loadingCode: false,
			errorMsg: '',
			showError: false,
			countryCode: window.countryCode || '254',
			passCfg: null,
			country: window.country || 'ke'
		};
	},
	created () {
		if (this.bizType !== 'REGISTER' && this.bizType !== 'PASSWORD_RESET') {
			this.handleSendCode(true);
		} else {
			token = this.preToken; // 注册过程后台自动发送短信，token需要从注册接口中拿
			this.sendCodeDisabled = true;
			this.runTimer();
		}
		if (this.showWarning) {
			this.$emit('warn', true);
			setTimeout(() => {
				this.$emit('warn', false);
			}, 4000);
		}
		if (this.warnForNG) {
			clearInterval(this.timerId);
			this.timer = 0;
			dialog.alert(this.warnForNG, ['OK'], () => {
				if (this.bizType === 'REGISTER') {
					if (this.$parent.componentName === 'independentLogin') {
						this.$emit('goRegAndLogin');
					} else {
						this.$emit('enterMobile');
					}
				}
				if (this.bizType === 'PASSWORD_RESET') {
					this.$emit('goFindAccount');
				}
				if (this.bizType === 'THIRD_PARTY_BIND') {
					this.$emit('regWithFb');
				}
			});
		}
	},
	beforeDestroy () {
		this.$emit('warn', false);
	},
	watch: {
		verifyCode () {
			this.disabled = this.verifyCode === '';
			if (this.showError) {
				this.showError = false;
			}
		}
	},
	methods: {
		handleVerify () {
			if (this.loading) {
				return;
			}
			// 如果是注册流程
			this.loading = true;
			if (this.bizType === 'REGISTER') {
				// 发送短信验证码
				// dialog.alert('Sending your code...');
				fetch('/patron/account/' + this.phone + '/complete', {
					method: 'PUT',
					body: {
						phoneVerifyCode: this.verifyCode,
						token
					}
				})
					.then(res => res.json())
					.then(res => {
						// dialog.close();
						this.loading = false;
						switch (res.bizCode) {
						case 10000:
							// 注册成功
							this.$emit('goFinish');
							cookie('phone', this.phone, {
								path: '/',
								expires: 365
							});

							// 更新登录状态
							window.loginStatus = true;

							// 广播登陆全局消息
							EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);
							break;
						case 11810:
							dialog.alert(
								res.message, // 'Your session has timed out. Please try again.',
								['OK'],
								e => {
									// go register page
									this.$emit('goRegAndLogin');
								}
							);
							break;
						default:
							// this.errorMsg = codeVerifyErr[res.bizCode] ? codeVerifyErr[res.bizCode].text : 'Unknown error.'
							this.errorMsg = res.message;
							this.showError = true;
							break;
						}
					})
					.catch(res => {
						window.__debug__ && console.log(res);
						this.loading = false;
						dialog.alert('No internet connection, try again.', ['OK']);
					});
			}

			if (this.bizType === 'THIRD_PARTY_BIND') {
				// 第三方注册流程
				fetch('/patron/account/completeThirdParty', {
					method: 'PUT',
					body: {
						phoneVerifyCode: this.verifyCode,
						token
					}
				})
					.then(res => res.json())
					.then(res => {
						// dialog.close();
						this.loading = false;
						switch (res.bizCode) {
						case 10000:
							// 注册成功
							this.$emit('goFinish');

							// 更新登录状态
							window.loginStatus = true;

							// 广播登陆全局消息
							EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);
							break;
						case 11810:
							dialog.alert(
								res.message, // 'Your session has timed out. Please try again.',
								['OK'],
								e => {
									// go register page
									this.$emit('goRegAndLogin');
								}
							);
							break;
						default:
							this.errorMsg = res.message;
							//	this.errorMsg = codeVerifyErr[res.bizCode] ? codeVerifyErr[res.bizCode].text : 'Unknown error.'
							this.showError = true;
							break;
						}
					})
					.catch(res => {
						window.__debug__ && console.log(res);
						this.loading = false;
						dialog.alert('No internet connection, try again.', ['OK']);
					});
			}

			// 如果是重置密码流程
			if (this.bizType === 'PASSWORD_RESET') {
				fetch('/patron/password/completeReset', {
					method: 'PUT',
					body: {
						phoneVerifyCode: this.verifyCode,
						token
					}
				})
					.then(res => res.json())
					.then(res => {
						this.loading = false;
						tokenSaved = res.data || {};
						if (tokenSaved.token) {
							token = tokenSaved.token;
						}

						switch (res.bizCode) {
						case 10000:
							// 发送验证短信成功, 跳转到Reset Passwd 页面
							this.$emit('goPasswdReset', {
								resetToken: token
							});
							break;
						case 11700:
						case 11702:
							dialog.alert(
								res.message, // 'Incorrect code. Please check it and try again.',
								['OK']
							);
							break;
						case 11701:
							dialog.alert(
								res.message, // 'That code has expired. Please check it and try again.',
								['OK']
							);
							break;
						case 11810:
							dialog.alert(
								res.message, // 'Your session has timed out. Please try again.',
								['OK'],
								e => {
									// go register page
									this.$emit('goFindAccount');
								}
							);
							break;
						default:
							dialog.alert(res.message, ['OK']);
							break;
						}
					})
					.catch(res => {
						this.loading = false;
						dialog.alert('No internet connection, try again.', ['OK']);
					});
			}
		},
		runTimer () {
			this.timer = 60;
			this.timerId = setInterval(() => {
				this.timer--;
				if (this.timer === 0) {
					clearInterval(this.timerId);
					this.sendCodeDisabled = false;
				}
			}, 1000);
		},
		handleSendCode (triggerWarn) {
			/* Disable Resend button, timer counts down */
			if (this.sendCodeDisabled) {
				return;
			}
			this.sendCodeDisabled = true;
			this.loadingCode = true;

			// 获取手机验证码
			let param;
			if (this.bizType === 'THIRD_PARTY_BIND') {
				param = {
					phone: this.phone,
					bizType: this.bizType,
					token: cookie('lgToken') || ''
				};
			} else {
				param = {
					phone: this.phone,
					bizType: this.bizType
				};
			}
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: param
			})
				.then(res => res.json())
				.then(res => {
					this.loadingCode = false;
					tokenSaved = res.data || {};
					if (tokenSaved.token) {
						token = tokenSaved.token;
					}
					// let msg = sendSmsErr[res.bizCode] ? sendSmsErr[res.bizCode].text : 'Unknown error.';
					const msg = res.message;
					switch (res.bizCode) {
					case 10000:
						this.runTimer();
						// 还剩1次 resend code 次数, 警示框出现4s
						if (res.data.remainMsgNum === 1 && triggerWarn) {
							this.$emit('warn', true);
							setTimeout(() => {
								this.$emit('warn', false);
							}, 4000);
						}

						this.passCfg = {
							smsNumber: res.data.smsNumber,
							msgContent: res.data.msgContent,
							token
						};
						break;
					case 11703:
						// 超过3次限制, 清除timer, 用户点击 OK 按钮跳转至 sms页面.
						clearInterval(this.timerId);
						dialog.alert(
							msg, // `The mobile number has exceeded the maximum number of verification (3 times within 24 hours) . You can still verify your mobile number by sending SMS ${res.data.msgContent} to ${res.data.smsNumber}.`,
							['OK'],
							e => {
								this.$emit('goSms', {
									bizType: this.bizType,
									phone: this.phone,
									smsNumber: res.data.smsNumber,
									msgContent: res.data.msgContent,
									token
								});
							}
						);
						break;
					case 11705:
						// 尼日超过5次限制, 清除timer, 用户点击 OK 按钮返回上一页.
						clearInterval(this.timerId);
						dialog.alert(
							msg,
							['OK'],
							e => {
								// 根据不同流程回到对应初始页面
								if (this.bizType === 'REGISTER') {
									if (this.$parent.componentName === 'independentLogin') {
										this.$emit('goRegAndLogin');
									} else {
										this.$emit('enterMobile');
									}
								}
								if (this.bizType === 'PASSWORD_RESET') {
									this.$emit('goFindAccount');
								}
								if (this.bizType === 'THIRD_PARTY_BIND') {
									this.$emit('regWithFb');
								}
							}
						);
						break;
					case 11810:
						clearInterval(this.timerId);
						dialog.alert(
							msg, // 'Your session has timed out. Please try again.',
							['OK'],
							e => {
								// go addphone or login facebook
								this.$emit('goRegAndLogin');
							}
						);
						break;
					case 11610:
						if (this.bizType === 'THIRD_PARTY_BIND') { // 无需验证码的第三方注册成功
							this.$emit('goFinish');
							cookie('phone', this.phone, {
								path: '/',
								expires: 365
							});

							// 更新登录状态
							window.loginStatus = true;

							// 广播登陆全局消息
							EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);
						}
						break;
					default:
						clearInterval(this.timerId);
						dialog.alert(msg, ['OK']);
						break;
					}
				})
				.catch(res => {
					this.loadingCode = false;
					clearInterval(this.timerId);
					dialog.alert('No internet connection, try again.', ['OK']);
				});
		},
		changeNum() {
			if (this.bizType === 'PASSWORD_RESET') {
				this.$emit('goFindAccount');
			} else {
				this.$emit('enterMobile');
			}
		},
		goSms() {
			const params = this.passCfg ?
				this.passCfg :
				Object.assign(this.regDefault, {
					token: this.preToken
				});

			this.$emit('goSms', Object.assign(params, {
				bizType: this.bizType,
				phone: this.phone
			}));
		}
	}
};
</script>

<style lang='less'>
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

#codeVerify {
	margin-top:-40/@rem;
  .verifyMobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .verify-label {
      width: 100%;
      height: 17/@rem;
      font-size: 22/@rem;
      font-weight: bold;
      line-height: 0.77;
      text-align: center;
      color: @dark;
    }
    .m-input-wap-wrapper--active {
      border: 1px solid #0d9737;
	}
	.send-again{
		color: @linkBlue
	}
    .action-label {
      width: 100%;
      margin-top: 14.8/@rem;
      margin-bottom: 40/@rem;
      height: 20/@rem;
      font-size: 12/@rem;
      line-height: 20/@rem;
      text-align: center;
      color: @dark;

	  .change-number {
		  font-size: 12/@rem;
	      line-height: 14/@rem;
	      color: @linkBlue;
		  margin-left: 6/@rem;
	  }
    }
    .verifyInputs {
      height: 48/@rem;
      width: 100%;
      box-sizing: border-box;
      padding-left: 1px;
      padding-right: 1px;
      .m-loading-circle-icon {
        .m-icon-loading-circle();
      }

      input {
        font-size: 14/@rem;
        padding: 17/@rem 10px;
        height: 100%;
      }
    }

    .error-message {
      margin-top: 1/@rem;
      width: 100%;
      font-size: 12/@rem;
      line-height: 1.67;
      text-align: left;
      min-height: 20/@rem;
      color: @red;
    }

    .verify-btn {
      margin-top: 27/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      background-color: @green;
      height: 47.5/@rem;
      border: none;
      font-size: 14/@rem;
    }

    .af-icon-loading:before {
      content: "\e648";
      .iconfont();
    }
    .af-icon-loading {
      display: inline-block;
      animation: loading-rotate 2s linear infinite;
    }

	.m-go-sms {
		font-size: 14/@rem;
		line-height: 16/@rem;
		color: @linkBlue;
		text-align: center;
		margin-top: 6/@rem;

		& + .af-button {
			margin-top: 16/@rem;
		}
	}
  }
}
</style>
