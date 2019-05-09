<template>
<div class="deposit-code-verify">
	<div class="verifyMobile">
		<form style="width: 100%;">
			<div class="action-label">{{'A verification code has been sent to ' + phone}}</div>
			<af-input class="verifyInputs" type="tel" placeholder="Verification  Code" icon="delete" :maxlength="18" v-model="verifyCode" :error="showError">
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<div class="timer-wrap">
				<span v-if="!loadingCode" class="send-again" @click="handleSendCode(true)">{{'Send Again'+(timer===0 ? '':' (' + timer + 's)')}}</span>
				<i v-else class="af-icon-loading"></i>
			</div>
			<div class="btn-wrap">
				<div class="back-btn" @click="back"><i class="back-icon"/></div>
				<af-button @click.prevent="handleVerify" class="verify-btn" :disabled="disabled" :loading="loading">
					{{loading ? 'Loading' : btnLabel}}
				</af-button>
			</div>
		</form>
	</div>
</div>
</template>

<script>
import { AfInput } from 'components/input';
import afButton from 'packages/button/index';
import cookie from 'storage/cookie';
import dialog from 'components/dialog';

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
		warnForNG: {
			type: String,
			'default': ''
		},
		preToken: {
			type: String,
			'default': ''
		},
		btnLabel: String
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
			countryCode: window.countryCode || '254'
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
		if (this.warnForNG) {
			clearInterval(this.timerId);
			this.timer = 0;
			dialog.alert(this.warnForNG, ['OK'], () => {
				this.$emit('goRegist');
			});
		}
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
		back() {
			this.$emit('goRegist');
		},
		handleVerify () {
			if (this.loading) {
				return;
			}
			// 如果是注册流程
			this.loading = true;
				// 发送短信验证码
				// dialog.alert('Sending your code...');
			fetch('/patron/account/' + this.phone + '/complete', {
				method: 'PUT',
				body: {
					phoneVerifyCode: this.verifyCode,
					token
				}
			}).then(res => res.json()).then(res => {
				// dialog.close();
				this.loading = false;
				switch (res.bizCode) {
				case 10000:
					// 注册成功
					// this.$router.push({
					// 	path: 'success'
					// });
					this.$emit('success', {
						phone: this.phone
					});
					cookie('phone', this.phone, {
						path: '/',
						expires: 365
					});
					break;
				case 11810:
					dialog.alert(
						res.message, // 'Your session has timed out. Please try again.',
						['OK'],
						e => {
							// go register page
							this.$emit('goRegist');
						}
					);
					break;
				default:
					// this.errorMsg = codeVerifyErr[res.bizCode] ? codeVerifyErr[res.bizCode].text : 'Unknown error.'
					this.errorMsg = res.message;
					this.showError = true;
					break;
				}
			}).catch(res => {
				console.log(res);
				this.loading = false;
				dialog.toast('No internet connection, try again.');
			});
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
								this.$emit('goRegist');
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
								this.$emit('goRegist');
							}
						);
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
					dialog.toast('No internet connection, try again.');
				});
		}
	}
};
</script>

<style lang='less'>
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

.deposit-code-verify{
	// margin-top:-40/@rem;
  .verifyMobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .m-input-wap-wrapper--active {
      border: 1px solid #0d9737;
	}
	.send-again{
		color: @dark;
		font-weight: bold;
		font-size: 12/@rem;
	}
    .action-label {
      width: 100%;
      margin-top: 14.8/@rem;
      margin-bottom: 10/@rem;
      font-size: 12/@rem;
      line-height: 20/@rem;
      text-align: center;
      color: @white;
    }
	.verifyInputs {
      height: 48/@rem;
      width: 100%;
      box-sizing: border-box;
	  border: 1px solid @white;
	  border-radius: 2px;
      padding-left: 1px;
      padding-right: 1px;
      font-size: 14/@rem;
      .m-loading-circle-icon {
        .m-icon-loading-circle();
      }
	  .m-input-wap-prepend {
		  color: @white;
		  background-color: rgba(27, 30, 37, 0.15);
	  }
	  &.m-input-wap-wrapper.m-input-wap-wrapper--error {
		  border: 1px solid #ffe600!important
	  }
      input {
		color: @midGray;
        height: 100%;
		background-color: rgba(27, 30, 37, 0.15);
      }
    }

    .error-message {
      margin-top: 1/@rem;
      width: 100%;
      font-size: 12/@rem;
      line-height: 1.67;
      text-align: left;
      min-height: 20/@rem;
      color: #ffe600;
    }

	.btn-wrap {
		margin-top: 27/@rem;
		display: flex;
		align-items: center;
		justify-content: center;

		.back-btn {
			text-align: center;
			margin-right: 8/@rem;
			flex: 0 0 auto;
			width: 46/@rem;
			height: 46/@rem;
			line-height: 46/@rem;
			border: 1px solid @white;
			border-radius: 2/@rem;
			.back-icon {
				.m-icon-wap-back();
				&::before {
					color: @white;
				}
			}
		}
		.verify-btn {
			flex: 1 1 auto;
			width: 100%;
			box-sizing: border-box;
			background-color: @lightGreen;
			height: 48/@rem;
			border: none;
			font-size: 14/@rem;
		}
	}

    .af-icon-loading:before {
      content: "\e648";
      .iconfont();
    }
    .af-icon-loading {
      display: inline-block;
      animation: loading-rotate 2s linear infinite;
    }
  }
}
</style>
