<template>
<div id="loginStep">
	<div class="change-region-wrap" v-if="regionConfig">
		<img :src="regionConfig.flag" :alt="regionConfig.region">
		<span class="current-country">{{regionConfig.region}}</span>
		<span class="change-country" @click="changeRegion">Change</span>
		<i class="m-icon-right" @click="changeRegion"/>
	</div>
	<div class="login-container">
		<form style="width: 100%">
			<af-input class="verifyInputs" type="tel" placeholder="Mobile Number" icon="delete" :iconClick="iconCLick" :maxlength="18" v-model="loginPhone" :error="!!mobileErr">
				<div slot="prepend">+{{countryCode}}</div>
			</af-input>
			<div class="error-message">
				<p v-if="mobileErr">{{mobileErr}}</p>
			</div>
			<af-input class="verifyInputs" type="password" :toggleShowText="true" :initTextIconValue="false" placeholder="Password" :error="!!psdErr" v-model="password">
			</af-input>
			<div class="error-message">
				<p v-if="psdErr">{{psdErr}}</p>
			</div>
			<af-button @click.prevent="login" class="login-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Log In'}}</af-button>
		</form>
		<div class="action-wrap">
			<div @click="goForgetPwd">Forgot Password?</div>
			<div class="blank-block"/>
			<div @click="goRegist">Create New Account</div>
		</div>
	</div>
	<div class="facebook-container">
		<div class="or-area">Or</div>
		<div class="login-with-facebook" @click="openIDOAuth">
			<i class="m-facebook-icon"></i><span>Log In With Facebook</span>
		</div>
	</div>
</div>
</template>

<script>
import { AfInput } from 'components/input';
import afButton from 'packages/button/index';
import dialog from 'components/dialog';
import md5 from 'blueimp-md5';
import cookie from 'storage/cookie';
import {
	EventBus
} from 'kernel/js/eventBus';
import { fbLogin } from 'base/js/fbLogin.js';
import { thirdPartyLogin } from 'core/js/loginBar.js';
import { fixPhone } from 'base/js/utils';
import { pagePath } from 'config/pageConfig';
import commonEvent from 'config/eventConfig/commonEvent';
import ChangeRegion from '../popDialog/pagelet/changeRegion';
import regionConf from '../popDialog/config/regionConf.js';

// const mobileCode = [11000, 11001, 11002, 11601, 11602, 11605];
const psdCode = [11010, 11603];
let pop = null;
export default {
	name: 'loginStep',
	components: {
		AfInput,
		afButton,
		ChangeRegion
	},
	props: {
		phone: {
			type: String,
			'default': ''
		}
	},
	data () {
		return {
			loginPhone: '',
			password: '',
			loading: false,
			mobileErr: '',
			psdErr: '',
			countryCode: window.countryCode || '254',
			regionConfig: ''
		};
	},
	created() {
		if (this.phone) {
			this.loginPhone = this.phone;
		} else {
			this.loginPhone = cookie('phone') || '';
		}
		regionConf && regionConf.forEach(item => {
			if (window.ipCountry === item.shortName) {
				this.regionConfig = item;
			}
		});
	},
	watch: {
		loginPhone () {
			if (this.mobileErr) {
				this.mobileErr = false;
			}
		},
		password () {
			if (this.psdErr) {
				this.psdErr = false;
			}
		}
	},
	computed: {
		disabled() {
			return this.password === '' || this.loginPhone === '';
		}
	},
	methods: {
		changeRegion() {
			pop = this.$dialog({
				title: null,
				button: [],
				content: ChangeRegion,
				contentData: { fixWidth: true } // 调整组件宽度的开关
			}).onBtnClick(btnType => {
				pop.close();
				pop = null;
			});
		},
		iconCLick() {
			this.loginPhone = '';
		},
		goForgetPwd() {
			this.$emit('goFindAccount');
		},
		goRegist() {
			this.$emit('enterMobile');
		},
		login() {
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
					username: this.loginPhone,
					password: md5(this.password)
				}
			}).then(res => res.json()).then(res => {
				window.__debug__ && console.log(res);
				this.loading = false;
				if (res.bizCode === 10000) { // 登录成功
					cookie('phone', this.loginPhone, {
						path: '/',
						expires: 365
					});
					// // 更新登录状态
					window.loginStatus = true;

					// // 广播登陆全局消息
					EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
				} else {
					this.psdErr = '';
					this.mobileErr = '';
					if (psdCode.indexOf(res.bizCode) > -1) { // 区分密码错误， 其他都算做号码错误
						this.psdErr = res.message;
					} else {
						this.mobileErr = res.message;
					}
				}
			}).catch(res => {
				this.loading = false;
				dialog.alert('No internet connection, try again.', ['OK']);
			});
		},
		openIDOAuth () {
			fbLogin()
				.then(res => {
					thirdPartyLogin((res && res.fbToken) || '').then(ret => {
						if (ret && ret.login) {
							if (this.$parent.isPop) {
								this.$popupLogin.close();
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
		enterMobile () {
			if (this.loading) {
				return;
			}

			const phone = this.loginPhone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.loginPhone = tempPhone;
			}

			this.loading = true;
			fetch('/patron/phone/checkStatus', {
				method: 'GET',
				body: {
					phone: this.loginPhone
				}
			})
			.then(res => res.json())
			.then(res => {
				this.loading = false;
				const bizCode = res.bizCode;
				if (bizCode === 11601) {
				// 未注册手机号码，去获取验证码
					this.$emit('goPasswdSet', {
						phone: this.loginPhone,
						bizType: 'REGISTER'
					});
				} else if (bizCode === 11600) {
					this.$emit('goPasswdEnter', {
						phone: this.loginPhone
					});
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
				window.__debug__ && console.log(res);
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

.enter-mobile.es-dialog .es-dialog-footer .es-dialog-btn {
  width: 100%;
  border-top: 1px solid #d4d4d4;
}
#loginStep {
	
  .change-region-wrap {
	padding: 24/@rem 30/@rem 0;
	line-height: 18/@rem;
	font-size: 16/@rem;
	color: @dark;
	width: 100%;
	box-sizing: border-box;
	img {
		
	}	
	.current-country {
		margin-left: 6/@rem;
		margin-right: 14/@rem;
	}
	.change-country {
		margin-right: 6/@rem;
		color: @green;
	}
	.m-icon-right {
		.m-icon-arrow--right();
		&::before {
			color: @green;
		}
	}
  }
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
	padding: 25/@rem 30/@rem 0;
	box-sizing: border-box;
    .m-input-wap-wrapper--active {
      border: 1px solid #0d9737;
    }
    .verifyInputs {
      height: 44/@rem;
      width: 100%;
      box-sizing: border-box;
      padding-left: 1px;
      padding-right: 1px;
      font-size: 14/@rem;
      .m-loading-circle-icon {
        .m-icon-loading-circle();
      }

      input {
        height: 100%;
        padding: 12/@rem 10px;
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

    .login-btn {
      margin-top: 23/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      background-color: @green;
      border: none;
      height: 47.5/@rem;
      font-size: 14/@rem;
    }
	
	.action-wrap {
		margin-top: 21/@rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: @linkBlue;
		font-size: 14/@rem;
		div {
			flex: 0 0 auto;
			&.blank-block {
				flex: 1 1 auto;
			}
		}
	}
  }

  .facebook-container {
    height: 81/@rem;
    margin-top: 45/@rem;
    border-top: 1px solid #e8e8e8;
    width: 80%;
    width: calc(~"100% - "60/@rem);
	padding: 0 30/@rem;
	box-sizing: border-box;
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
}

.wap-register.es-dialog .es-dialog-head h1{
	font-size: 20/@rem;
	height: auto;
}
</style>
