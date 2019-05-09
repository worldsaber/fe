<template>
<div id="enterPassword">
	<div class="enter-password-container">
		<form>
			<div class="enter-password-label">
				<p>Enter Password</p>
			</div>
			<div class="action-label">{{'Enter the password for +' + countryCode + ' ' + this.phone + '.'}}</div>
			<div class="change-number" @click="changeNumber">Change Number</div>
			<af-input class="verifyInputs" placeholder="Password" type="password" :toggleShowText="true" :initTextIconValue="false" v-model="password" :error="showError">
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<af-button @click.prevent="enterPassword" class="enter-password-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Log In'}}</af-button>
		</form>
		<div class="forget-password"><span @click="goForgetPwd">Forgot Password?</span></div>
		<div class="facebook-container">
			<div class="or-area">Or</div>
			<div class="login-with-facebook" @click="openIDOAuth">
				<i class="m-facebook-icon"></i><span>Log In With Facebook</span>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import {
	AfInput
} from 'components/input';
import afButton from 'packages/button/index';
import dialog from 'components/dialog';
// import enterPasswordErr from './errorMsg/addPhone';
import md5 from 'blueimp-md5';
import cookie from 'storage/cookie';
import {
	EventBus
} from 'kernel/js/eventBus';
import {
	fbLogin
} from 'base/js/fbLogin.js';
import {
	thirdPartyLogin
} from 'core/js/loginBar.js';
import { pagePath } from 'config/pageConfig';
import commonEvent from 'config/eventConfig/commonEvent';

export default {
	name: 'enterPassword',
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
			'default': ''
		}
	},
	data () {
		return {
			password: '',
			disabled: true,
			loading: false,
			errorMsg: '',
			showError: false,
			countryCode: window.countryCode || '254'
		};
	},
	created () {

	},
	watch: {
		password () {
			this.disabled = this.password === '';
			if (this.showError) {
				this.showError = false;
			}
		}
	},
	methods: {
		goForgetPwd () {
			this.$emit('goFindAccount');
		},
		changeNumber () {
			this.$emit('enterMobile');
		},
		enterPassword () {
			if (this.loading) {
				return;
			}
			// if (!this.checkpwd(this.password)) {
			// 	return;
			// }
			this.loading = true;
			fetch('/patron/accessToken', {
				method: 'POST',
				body: {
					username: this.phone,
					password: md5(this.password)
				}
			}).then(res => res.json()).then(res => {
				window.__debug__ && console.log(res);
				this.loading = false;
				if (res.bizCode === 10000) { // 登录成功
					cookie('phone', this.phone, {
						path: '/',
						expires: 365
					});
					// // 更新登录状态
					window.loginStatus = true;

					// // 广播登陆全局消息
					EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
				} else {
					this.errorMsg = res.message; // 使用后台返回的错误信息
					this.showError = true;
				}
			}).catch(res => {
				this.loading = false;
				dialog.alert('No internet connection, try again.', ['OK']);
			});
		},
		openIDOAuth () {
			fbLogin().then(res => {
				thirdPartyLogin(res && res.fbToken || '')
					.then(ret => {
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
			}).catch(e => {
				dialog.alert('An error occurred while connecting to Facebook.', ['OK']);
			});
			// this.$emit('openIDOAuth'); 通过事件触发login发生 xfbml错误
		},
		checkpwd (text) {
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

#enterPassword {
  margin-top: -38/@rem;
  .enter-password-container {
    width: 100%;
    .enter-password-label {
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
      width: 100%;
      margin-top: 17.4/@rem;
      margin-bottom: 13.2/@rem;
      height: 20/@rem;
      font-size: 12/@rem;
      line-height: 20/@rem;
      text-align: center;
      color: @dark;
    }
    .change-number {
      height: 16.8/@rem;
      font-size: 14/@rem;
      line-height: 1;
      text-align: center;
      color: @linkBlue;
      margin-bottom: 12.7/@rem;
    }
    .verifyInputs {
      height: 48/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      .m-loading-circle-icon {
        .m-icon-loading-circle();
      }
      .m-input-wap-text--icon {
        margin-right: 16/@rem;
      }
      input {
        height: 100%;
        // width: 300/@rem;
        font-size: 14/@rem;
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

    .enter-password-btn {
      margin-top: 28/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      background-color: @green;
      border: none;
      height: 47.5/@rem;
      font-size: 14/@rem;
    }

    .forget-password {
      height: 33/@rem;
      margin-top: 11/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      font-size: 14/@rem;
      text-align: center;
      color: @linkBlue;
    }

    .facebook-container {
      height: 81/@rem;
	  margin-top: 60/@rem;
	  margin-left:40px;
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
        margin-bottom: -7/@rem;
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
  }
}

</style>
