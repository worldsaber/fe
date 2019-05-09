<template>
<div id="enterMobile">
	<div class="m-top-banner" v-if="regCfg">
		<img :src="regCfg" alt="">
	</div>
	<div class="change-region-wrap" v-if="regionConfig">
		<img :src="regionConfig.flag" :alt="regionConfig.region">
		<span class="current-country">{{regionConfig.region}}</span>
		<span class="change-country" @click="changeRegion">Change</span>
		<i class="m-icon-right" @click="changeRegion"/>
	</div>
	<div class="enter-mobile-container">
		<form>
			<div class="enter-mobile-label">
				<p>Join SportyBet with your mobile number</p>
			</div>
			<af-input class="verifyInputs" type="tel" placeholder="Mobile Number" icon="delete" :iconClick="iconCLick" :maxlength="18" v-model="phone" :error="!!showError">
				<div slot="prepend">+{{countryCode}}</div>
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}<span class="err-login-btn" v-if="showError === 'exist'" @click="goLogin">Log In</span></p>
			</div>
			<af-button @click.prevent="enterMobile" class="enter-mobile-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Next'}}</af-button>
		</form>
		<div class="action-label" @click="goLogin">Already have an account? Log In</div>
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

import { fbLogin } from 'base/js/fbLogin.js';
import { thirdPartyLogin } from 'core/js/loginBar.js';
import { fixPhone } from 'base/js/utils';
import { pagePath } from 'config/pageConfig';
import ChangeRegion from '../popDialog/pagelet/changeRegion';
import regionConf from '../popDialog/config/regionConf.js';

let pop = null;
export default {
	name: 'enterMobile',
	components: {
		AfInput,
		afButton,
		ChangeRegion
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
			showError: false, // boolean 或者特定的exist值
			countryCode: window.countryCode || '254',
			regCfg: '',
			regionConfig: ''
		};
	},
	created() {
		this.getCfg();
		regionConf && regionConf.forEach(item => {
			if (window.ipCountry === item.shortName) {
				this.regionConfig = item;
			}
		});
	},
	watch: {
		phone () {
			this.disabled = this.phone === '';
			if (this.showError) {
				this.showError = false;
			}
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
		iconCLick () {
			this.phone = '';
		},
		goLogin() {
			this.$emit('goLogin', {
				phone: this.showError === 'exist' ? this.phone : ''
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
					this.$emit('goPasswdSet', {
						phone: this.phone,
						bizType: 'REGISTER'
					});
				} else if (bizCode === 11600) { // 原文案太长折行，11600改用前端错误提示
					this.errorMsg = 'The number has already been registered.'; // res.message;
					this.showError = 'exist';
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
		},
		getCfg() {
			fetch('/marketing/v1/activities/firstDeposit/registrationInfo', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(res => {
				const { bizCode } = res;

				let temp;

				if (bizCode === 10000 && (temp = res.data) && (temp = temp.info)) {   // eslint-disable-line
					this.regCfg = temp;
				}
			}).catch(() => {});
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
#enterMobile {
  .m-top-banner {
	  width: 100%;

	 img {
		 width: 100%;
	 }
  }
	
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
  .enter-mobile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
	padding: 25/@rem 30/@rem 0;
	box-sizing: border-box;
	
    .enter-mobile-label {
	  margin-top: 10/@rem;
	  margin-bottom: 24/@rem;
      width: 100%;
      line-height: 24/@rem;
      font-size: 20/@rem;
      font-weight: bold;
      text-align: center;
      color: @dark;
    }
    .m-input-wap-wrapper--active {
      border: 1px solid #0d9737;
    }
    .verifyInputs {
      height: 48/@rem;
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
	  .err-login-btn {
		  color: @linkBlue;
	  }
    }

    .enter-mobile-btn {
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
	
	.action-label {
		margin-top: 21/@rem;
		width: 100%;
		text-align: center;
		color: @linkBlue;
		font-size: 14/@rem;
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
