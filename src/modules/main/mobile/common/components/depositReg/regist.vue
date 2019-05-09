<template>
<div class="deposit-enter-mobile">
	<div class="enter-mobile-container">
		<form style="width: 100%;">
			<af-input class="verifyInputs" type="tel" placeholder="Mobile Number" icon="delete" :iconClick="iconClick" :maxlength="18" v-model="phone" :error="showError">
				<div slot="prepend">+{{countryCode}}</div>
			</af-input>
			<div class="psd-wrap">
				<af-input @focus="onFocus" @blur="onBlur" class="verifyInputs" placeholder="Set a Password" type="password" :toggleShowText="true" :initTextIconValue="false" v-model="password" :error="showError">
				</af-input>
				<transition name="fade">
					<div class="pop-msg" v-if="showTip">
						<div class="pop-arrow"/>
						Your password must be 6-14 character long and contain at least one letter and one number.
					</div>
				</transition>
			</div>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<af-button @click.prevent="enterMobile" class="enter-mobile-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : btnLabel}}</af-button>
		</form>
	</div>
</div>
</template>

<script>
import { AfInput } from 'components/input';
import afButton from 'packages/button/index';
import md5 from 'blueimp-md5';
import dialog from 'components/dialog';
import cookie from 'storage/cookie';
import { fixPhone } from 'base/js/utils';
import { registeredDialog } from './util.js';
import Registered from './registered.vue';

export default {
	name: 'enterMobile',
	components: {
		AfInput,
		afButton,
		Registered,
	},
	props: {
		bizType: {
			type: String,
			'default': ''
		},
		btnLabel: String
	},
	data () {
		return {
			phone: '',
			password: '',
			disabled: true,
			loading: false,
			errorMsg: '',
			showError: false,
			showTip: false,
			countryCode: window.countryCode || '254'
		};
	},
	created () { },
	watch: {
		phone () {
			this.disabled = (this.phone === '' || this.password === '');
			if (this.showError) {
				this.showError = false;
			}
		},
		password() {
			this.disabled = (this.phone === '' || this.password === '');
			if (this.showError) {
				this.showError = false;
			}
		}
	},
	methods: {
		onFocus() {
			this.showTip = true;
		},
		onBlur() {
			this.showTip = false;
		},
		iconClick () {
			this.phone = '';
		},
		enterMobile () {
			if (this.loading) {
				return;
			}

			const phone = this.phone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}
			this.loading = true;
			fetch('/patron/phone/checkStatus', {
				method: 'GET',
				body: {
					phone: this.phone
				}
			})
			.then(res => res.json())
			.then(res => {
				this.loading = false;
				const bizCode = res.bizCode;
				if (bizCode === 11601) {
				// 未注册手机号码，去获取验证码
					this.setPassword();
				} else if (bizCode === 11600) {
					// this.$dialog.toast('Sorry, the number has been registered.');
					// 登录去充值
					registeredDialog();
				} else if (bizCode === 11602) {
				//	dialog.alert('The number '+this.phone+' is currently locked. If you have any questions, please contact us for more information.', ['OK']);
					dialog({
						css: 'wap-register',
						content: res.message,
						title: 'You\'re Temporarily Locked',
						button: ['OK'],
						width: '26rem'
					});
				} else if (bizCode === 11605) {
					// dialog.alert(
					// 	'The number ' +
					// 	this.phone +
					// 	' is currently freezed. If you have any questions, please contact us for more information.',
					// 	['OK']
					// );
					dialog.alert(res.message, ['OK']);
				} else {
				// this.errorMsg = enterMobileErr[bizCode] ? enterMobileErr[bizCode].text : 'Unknown error.'
					this.errorMsg = res.message;
					this.showError = true;
				}
			})
			.catch(res => {
				console.log(res);
				this.loading = false;
				dialog.toast('No internet connection, try again.');
			});
		},
		setPassword() {
			if (this.loading) {
				return;
			}
			if (!this.checkpwd(this.password)) {
				return;
			}
			this.loading = true;
			fetch('/patron/account', {
				method: 'POST',
				body: {
					phone: this.phone,
					password: md5(this.password)
				}
			}).then(res => res.json()).then(res => {
				this.loading = false;
				if (res.bizCode === 10000) { // 注册成功
					this.$emit('goVeriry', {
						phone: this.phone,
						remainMsgNum: res.data.remainMsgNum,
						token: res.data.token,
						showWarning: res.data.remainMsgNum === 1
					});
				} else if (res.bizCode === 11610) {
					// 不需要验证码直接注册成功
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
				} else if (res.bizCode === 11703) { // 无法继续发送短信
					this.$emit('goSms', {
						phone: this.phone,
						smsNumber: res.data.smsNumber,
						msgContent: res.data.msgContent,
						token: res.data.token
					});
				} else if (res.bizCode === 11705) { // 尼日超出5次下行短信次数, 这里需要在短信验证页弹窗
					this.$emit('goVeriry', {
						phone: this.phone,
						warnForNG: res.message
					});
				} else {
					this.errorMsg = res.message; // 使用后台返回的错误信息
					this.showError = true;
				}
			}).catch(res => {
				console.log(res);
				this.loading = false;
				dialog.toast('No internet connection, try again.');
			});
		},
		checkpwd(text) {
			if (text.length < 6) {
				this.errorMsg = 'Password cannot be shorter than 6 characters.';
				this.showError = true;
				return false;
			} else if (text.length > 14) {
				this.errorMsg = 'Password cannot be longer than 14 characters.';
				this.showError = true;
				return false;
			} else if (!/[a-z]/gi.test(text) || !/[0-9]/.test(text)) {
				this.errorMsg = 'Password must contain at least one letter and one number.';
				this.showError = true;
				return false;
			}
			return true;
		}
	}
};
</script>

<style lang='less'>
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

.deposit-enter-mobile {
  // margin-top: -43/@rem;
  .enter-mobile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .m-input-wap-wrapper--active {
      border: 1px solid #0d9737;
    }
	.psd-wrap {
		margin-top: 18/@rem;
		position: relative;
		.verifyInputs {
			margin-top: 0;
		}
		.pop-msg {
			position: absolute;
			top: -96/@rem;
			right: 0;
			width: 200/@rem;
			padding: 16/@rem 12/@rem;
			background-color: @dark;
			box-shadow: 0 2/@rem 4/@rem 0 rgba(0, 0, 0, 0.5);
			font-size: 12/@rem;
			color: @white;
			line-height: 16/@rem;
			.pop-arrow {
				position: absolute;
				bottom: -8/@rem;
				right: 40/@rem;
				width: 16/@rem;
				height: 16/@rem;
				background-color: @dark;
				transform: rotate(45deg);
			}
		}
	}
    .verifyInputs {
	  margin-top: 18/@rem;
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
	  &.m-input-wap-wrapper .m-input-wap-text--icon {
		  width: 48/@rem;
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

    .enter-mobile-btn {
    //   margin-top: 23/@rem;
      width: 100%;
	  background-color: @lightGreen;
	  color: @blueBlack;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      border: none;
      height: 47.5/@rem;
	  font-weight: 500;
      font-size: 16/@rem;
    }
  }

  .facebook-container {
    height: 81/@rem;
    margin-top: 25/@rem;
    border-top: 1px solid #e8e8e8;
    width: 80%;
    width: calc(~"100% - "60/@rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: @white;

    .or-area {
      padding-left: 2/@rem;
      padding-right: 2/@rem;
      margin-bottom: -5/@rem;
      background-color: @white;
      transform: translateY(-50%);
      font-size: 16/@rem;
      text-align: center;
      color: @darkGray;
    }

    .login-with-facebook {
      height: 33/@rem;
      font-size: 14/@rem;
      line-height: 2.36;
      text-align: left;
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
  }
  .fade-enter-active, .fade-leave-active {
  	transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}

.wap-register.es-dialog .es-dialog-head h1{
	font-size: 20/@rem;
	height: auto;
}
</style>
