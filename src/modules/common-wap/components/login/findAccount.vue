<template>
<div id="findAccount">
	<div class="find-account-container">
		<form>
			<div class="find-account-label">
				<p>Find Account</p>
			</div>
			<div class="action-label">reset your password, please confirm<br>your account first.</div>
			<af-input class="verifyInputs" placeholder="Mobile Number" icon="delete" :iconClick="iconCLick" :maxlength="18" v-model="phone" :error="showError">
				<div slot="prepend">+{{countryCode}}</div>
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<af-button @click.prevent="findAccount" class="find-account-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Next'}}</af-button>
		</form>
	</div>
</div>
</template>

<script>
import { AfInput } from 'components/input';
import afButton from 'packages/button/index';
import dialog from 'components/dialog';
import { fixPhone } from 'base/js/utils';
// import findAccountErr from './errorMsg/addPhone';

export default {
	name: 'findAccount',
	components: {
		AfInput,
		afButton
	},
	props: {
		bizType: {
			type: String,
			'default': ''
		}
	},
	data () {
		return {
			phone: '',
			disabled: true,
			loading: false,
			errorMsg: '',
			showError: false,
			countryCode: window.countryCode || '254'
		};
	},
	created () { },
	watch: {
		phone () {
			this.disabled = this.phone === '';
			if (this.showError) {
				this.showError = false;
			}
		}
	},
	methods: {
		iconCLick () {
			this.phone = '';
		},
		findAccount () {
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
				if (res.bizCode === 11600) {
				// 已注册帐号, 为了能在超发短信的情况下直接进入sms验证页，此处手动获取验证码，进入验证码页面不再自动获取。
					this.loading = true;
					fetch('/patron/verifyCode/sms', {
						method: 'POST',
						body: {
							phone: this.phone,
							bizType: 'PASSWORD_RESET'
						}
					})
					.then(res => res.json())
					.then(res => {
						this.loading = false;
						const msg = res.message;
						const tokenSaved = res.data || {};
						let token = '';
						if (tokenSaved.token) {
							token = tokenSaved.token;
						}

						switch (res.bizCode) {
						case 10000:
							this.$emit('goVeriry', {
								bizType: 'PASSWORD_RESET',
								phone: this.phone,
								remainMsgNum: res.data.remainMsgNum,
								token,
								showWarning: res.data.remainMsgNum === 1
							});
							break;
						case 11703:
							this.$emit('goSms', {
								bizType: 'PASSWORD_RESET',
								phone: this.phone,
								smsNumber: res.data.smsNumber,
								msgContent: res.data.msgContent,
								token
							});
							break;
						case 11705:
							this.$emit('goVeriry', {
								bizType: 'PASSWORD_RESET',
								phone: this.phone,
								warnForNG: msg
							});
							break;
						default:
							dialog.alert(msg, ['OK']);
							break;
						}
					});
				} else if (res.bizCode === 11602) {
				//	dialog.alert('The number' + this.phone + 'was locked, pls contact our customer service', ['OK']);
					dialog({
						css: 'wap-register',
						content: res.message,
						title: 'You\'re Temporarily Locked',
						button: ['OK'],
						width: '26rem'
					});
				} else if (res.bizCode === 11605) {
				// dialog.alert('The number' + this.phone + 'was freezed, pls contact our customer service', ['OK']);
					dialog.alert(res.message, ['OK']);
				} else if (res.bizCode === 11000) {
				// this.errorMsg = "It is not Kenya's mobile number";
					this.errorMsg = res.message;
					this.showError = true;
				} else {
				// this.errorMsg = "The mobile number has not been registered";
					this.errorMsg = res.message;
					this.showError = true;
				}
			})
			.catch(e => {
				this.loading = false;
				dialog.alert('No internet connection, try again.', ['OK']);
			});
		}
	}
};
</script>

<style lang='less'>
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

#findAccount {
	margin-top:-40/@rem;
	form{
		width: 100%;
	}
  .find-account-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .find-account-label {
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
    .action-label {
      width:100%;
      margin-top: 14.8/@rem;
      margin-bottom: 40/@rem;
	  height: 20/@rem;
      font-size: 12/@rem;
      line-height: 20/@rem;
      text-align: center;
      color: @dark;
	}
    .verifyInputs {
      height: 48/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      font-size: 14/@rem;
      .m-loading-circle-icon {
        .m-icon-loading-circle();
      }

      input {
        height: 100%;
        padding: 17/@rem 10px;
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

    .find-account-btn {
      margin-top: 27/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      background-color: @green;
      border: none;
      height: 47.5/@rem;
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
  }
}
.wap-register.es-dialog .es-dialog-head h1{
	font-size: 20/@rem;
	height: auto;
}
</style>
