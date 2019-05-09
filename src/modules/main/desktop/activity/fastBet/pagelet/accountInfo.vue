<template>
	<div id="account-info">
		<!-- 验证码发送次数小于3的注册页面 -->
		<div class="register" v-if="showRegister">
			<p class="last-step">Last Step - Account Information</p>
			<form>
				<af-input class="mobile-number" v-model='registerPhone' :error='registerPhoneError' @focus="handleFocus" placeholder="Your Phone Number" :maxlength="18" icon="delete" >
					<span slot="prepend" v-if="countryCode">+{{countryCode}}</span>
				</af-input>
				<af-input class="password" type="password" @focus="handleFocus" :toggleShowText="true" :initTextIconValue="true" :error="registerPsdError" v-model='registerPassword' placeholder="Set Password(6-14 number+letter)" :minlength="6" :maxlength="14" >
				</af-input>
				<af-input class="verifyInputs" placeholder="Verification  Code" icon="delete" :error="showError" @focus="handleFocus" :maxlength="18" v-model="verifyCode">
				</af-input>
				<af-button class="verify-btn" :autofocus="false" @click.prevent="getVerifyCode" :loading="verifyBtnLoading" :disabled="verifyBtnDisabled">
					<span v-if="!verifyBtnLoading && !timeRunning">Get Code</span>
					<span v-if="!verifyBtnLoading && timeRunning">{{'Send Again'+(timer===0 ? '':' (' + timer + 's)')}}</span>
				</af-button>
				<div class="error-msg-area">
					<div class="error-msg-container" v-if="showErr">
						<div class="error-msg">
							<p v-if="showOtherErr">{{otherErr}}</p>
							<p v-if="showLogin" >The phone number has already been registered.<br>Please visit
								<a class="link" :href="loginPage" style="color:#e41827;border-bottom:2px solid #ff4350">www.sportybet.com.</a>
							</p>
						</div>
					</div>
				</div>
			</form>
			<af-button class="complete-btn" :autofocus="false" @click.prevent="register" :loading="registerBtnLoading">
				<span v-if="registerBtnLoading === false">Complete</span>
			</af-button>
		</div>
		<!-- 验证码发送次数大于3时显示短信验证页面 -->
	  	<div class="sendSMS" v-if="showSMS">
			<div class="icon-container">
				<i class="m-back-icon-wap" @click="handleBack"></i>
				<span class="back-label" @click="handleBack">Back</span>
			</div>
			<div class="smsSent-message">
				<p>Please send a SMS to {{smsNumber}} from<br> {{registerPhone}} with the verification code blow:</p>
				<p style="margin-top:30px;font-size:18px;font-weight:bold;">{{msgContent}}</p>
			</div>
			<div class="smsSent-footer">
				<af-button class="smsSent-btn" size="large" :autofocus="true" @click="smsClick">
					<span>Continue</span>
				</af-button>
			</div>
			<div class="error-msg-area">
					<div class="error-msg-container" v-if="showSmsErr">
						<div class="error-msg">
							<p>{{otherErr}}</p>
						</div>
					</div>
			</div>
		</div>
		<div class="loading" v-if="showLoading">
			<img class="loadingImg" style="width:66px;height:66px" src="../image/loading.png">
			<div class="wait">Loading, please wait…</div>
		</div>
  	</div>
</template>
<script>
import md5 from 'blueimp-md5';
import { fixPhone } from 'base/js/utils';
import { LS } from 'storage';
import { wapBaseUrl, domain, protocol, pagePath } from 'config/pageConfig';
import '../../../mockData/loginRegister/register?debug';
import '../../../mockData/order/order?debug';
import '../../../mockData/gifts/index?debug';

export default {
	data () {
		return {
			// 显示注册页面
			showRegister: true,
			// 显示短信发送页面
			showSMS: false,
			registerPhone: '',
			registerPassword: '',
			// 注册页面出错提示显示
			showErr: false,
			// 短信发送页面出错提示显示
			showSmsErr: false,
			// 号码已被注册时显示
			showLogin: false,
			// 出现其他错误时显示
			showOtherErr: false,
			// 其他错误的内容
			otherErr: '',
			// 手机号输入不符合规则时input边框标红
			registerPhoneError: false,
			// 密码输入不符合规则时input边框标红
			registerPsdError: false,
			// 验证码输入错误时input边框标红
			showError: false,
			registerBtnLoading: false,
			verifyBtnLoading: false,
			verifyBtnDisabled: false,
			timeRunning: false,
			timer: 0,
			verifyCode: '',
			smsNumber: '',
			msgContent: '',
			token: '',
			device: 0,
			// 拉红包下单时的loading
			showLoading: false,
			giftId: '',
			getGiftTimes: 0,
			giftAmount: 0,
			actualPayAmount: 0,
			// 登录跳转地址
			loginPage: '',
			countryCode: window.countryCode || '254',
			currency: window.currency || 'KES'
		};
	},
	mounted () {
		const isWap = new RegExp(wapBaseUrl).test(window.location.href);
		// if (window.location.href.split('/')[4] === 'm') {
		// 	this.loginPage = location.protocol + '//' + location.hostname + '/' + location.pathname.split('/')[1] + '/m/independent_login';
		if (isWap) {
			this.loginPage = `${protocol}//${domain}${pagePath.wapLogin}`;
			this.device = 3;
		} else {
			// this.loginPage = `${protocol}//${domain}${pagePath.login}`location.protocol + '//' + location.hostname + '/' + location.pathname.split('/')[1] + '/registration';
			this.loginPage = `${protocol}//${domain}${pagePath.login}`;
			this.device = 2;
		}
	},
	methods: {
		handleFocus () {
			this.showErr = false;
			this.registerPhoneError = false;
			this.registerPsdError = false;
			this.showError = false;
		},
		// 发送验证码倒计时
		runTimer () {
			this.verifyBtnDisabled = true;
			this.timer = 60;
			this.timerId = setInterval(() => {
				this.timer--;
				if (this.timer === 0) {
					clearInterval(this.timerId);
					this.timeRunning = false;
					this.verifyBtnDisabled = false;
				}
			}, 1000);
		},
		// 清空错误提示，恢复input边框颜色
		clearErr () {
			this.showErr = false;
			this.showOtherErr = false;
			this.showLogin = false;
			this.registerPhoneError = false;
			this.registerPsdError = false;
			this.showError = false;
		},
		getVerifyCode () {
			this.verifyBtnLoading = true;
			this.clearErr();
			// 验证手机号是否为空
			if (this.registerPhone === '') {
				this.verifyBtnLoading = false;
				this.showLogin = false;
				this.registerPhoneError = true;
				this.showErr = true;
				this.showOtherErr = true;
				this.otherErr = 'Mobile Number is required.';
				return;
			}
			// 如果用户输入的手机号首位未加0，自动修正
			this.registerPhone = fixPhone(this.registerPhone);
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: {
					bizType: 'REGISTER',
					phone: this.registerPhone
				}
			})
				.then(res => res.json())
				.then(res => {
					this.showErr = false;
					this.registerPsdError = false;
					const code = res.bizCode;
					if (code === 10000) {
						this.verifyBtnLoading = false;
						this.runTimer();
						this.timeRunning = true;
						this.token = res.data.token;
						LS.set('token', this.token);
						// LS.set('smsNumber', res.data.smsNumber);
						// LS.set(this.registerPhone + 'msgContent', res.data.msgContent);
					} else if (code === 11703) {			// 判断获取验证码次数超过3次，跳转短信发送页面
						const result = this.checkpwd(this.registerPassword);
						if (result === 'null') {
							this.verifyBtnLoading = false;
							this.otherErr = 'Password is required.';
							this.showOtherErr = true;
							this.showErr = true;
							this.registerPsdError = true;
							return;
						} else if (result === 'short') {
							this.verifyBtnLoading = false;
							this.otherErr = 'Password cannot be shorter than 6 characters.';
							this.showOtherErr = true;
							this.showErr = true;
							this.registerPsdError = true;
							return;
						} else if (result === 'long') {
							this.verifyBtnLoading = false;
							this.otherErr = 'Password cannot be longer than 14 characters.';
							this.showOtherErr = true;
							this.showErr = true;
							this.registerPsdError = true;
							return;
						} else if (result === 'mix') {
							this.verifyBtnLoading = false;
							this.otherErr = 'Password must contain at least one letter and one number.';
							this.showOtherErr = true;
							this.showErr = true;
							this.registerPsdError = true;
							return;
						} this.verifyBtnLoading = false;
						this.registerPhoneError = false;
						this.showErr = false;
						this.showRegister = false;
						this.smsNumber = res.data.smsNumber;
						this.msgContent = res.data.msgContent;
						this.token = res.data.token;
						this.showSMS = true;
					} else if (code === 11600) {			// 该号码已被注册
						this.verifyBtnLoading = false;
						this.showOtherErr = false;
						this.showErr = true;
						this.showLogin = true;
						this.registerPhoneError = true;
					} else {
						this.verifyBtnLoading = false;
						this.showLogin = false;
						this.registerPhoneError = true;
						this.showErr = true;
						this.showOtherErr = true;
						this.otherErr = res.message;
					}
				})
				.catch(res => {
					console.log(res);
					this.verifyBtnLoading = false;
					this.showErr = true;
					this.showOtherErr = true;
					this.otherErr = 'No internet connection, try again.';
				});
		},
		register () {
			this.registerBtnLoading = true;
			this.clearErr();
			this.registerPhone = fixPhone(this.registerPhone);
			if (this.registerPhone === '') {
				this.registerBtnLoading = false;
				this.showLogin = false;
				this.registerPhoneError = true;
				this.showErr = true;
				this.showOtherErr = true;
				this.otherErr = 'Mobile Number is required.';
				return;
			}
			if (+this.registerPhone[1] !== 7 || this.registerPhone.length !== 10) {
				this.registerBtnLoading = false;
				this.showLogin = false;
				this.registerPhoneError = true;
				this.showErr = true;
				this.showOtherErr = true;
				this.otherErr = 'Please enter a valid mobile number.';
			} else {
				const result = this.checkpwd(this.registerPassword);
				if (result === 'null') {
					this.registerBtnLoading = false;
					this.otherErr = 'Password is required.';
					this.showOtherErr = true;
					this.showErr = true;
					this.registerPsdError = true;
					return;
				} else if (result === 'short') {
					this.registerBtnLoading = false;
					this.otherErr = 'Password cannot be shorter than 6 characters.';
					this.showOtherErr = true;
					this.showErr = true;
					this.registerPsdError = true;
					return;
				} else if (result === 'long') {
					this.registerBtnLoading = false;
					this.otherErr = 'Password cannot be longer than 14 characters.';
					this.showOtherErr = true;
					this.showErr = true;
					this.registerPsdError = true;
					return;
				} else if (result === 'mix') {
					this.registerBtnLoading = false;
					this.otherErr = 'Password must contain at least one letter and one number.';
					this.showOtherErr = true;
					this.showErr = true;
					this.registerPsdError = true;
					return;
				}
				if (this.verifyCode === '') {
					this.registerBtnLoading = false;
					this.showErr = true;
					this.showError = true;
					this.showOtherErr = true;
					this.otherErr = 'Verification Code is required.';
					return;
				} else if (this.token === '') {
					this.registerBtnLoading = false;
					this.showErr = true;
					this.showError = true;
					this.showOtherErr = true;
					this.otherErr = 'Incorrect code. Please try again.';
					return;
				}
				fetch('/patron/account/create', {
					method: 'POST',
					body: {
						phoneVerifyCode: this.verifyCode,
						phone: this.registerPhone,
						password: md5(this.registerPassword),
						token: this.token,
						type: 1
					}
				})
					.then(res => res.json())
					.then(res => {
						const code = res.bizCode;
						if (code === 10000) {
							this.registerBtnLoading = false;
							this.getGift();
						} else if (code === 11000) {
							this.registerBtnLoading = false;
							this.registerPhoneError = true;
							this.showErr = true;
							this.showOtherErr = true;
							this.otherErr = res.message;
						} else {
							this.registerBtnLoading = false;
							this.showError = true;
							this.showErr = true;
							this.showOtherErr = true;
							this.otherErr = res.message;
						}
					}).catch(res => {
						this.registerBtnLoading = false;
						this.showErr = true;
						this.showOtherErr = true;
						this.otherErr = 'No internet connection, try again.';
					});
			}
		},
		checkpwd (text) {
			if (text.length === 0) {
				return 'null';
			} else if (text.length < 6 && text.length > 0) {
				return 'short';
			} else if (text.length > 14) {
				return 'long';
			} else if (!/[a-z]/gi.test(text) || !/[0-9]/.test(text)) {
				return 'mix';
			}
			return true;
		},
		getGift () {
			this.showLoading = true;
			this.showRegister = false;
			this.showSMS = false;
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);
			const params = {
				classify: 2,
				deviceCh: this.device,
				bizType: 1,
				betType: 0
			};
			fetch('/promotion/v1/gifts/query', {
				method: 'post',
				headers: t,
				body: JSON.stringify(params)
			})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						if (res.data.entityList.length > 0 && res.data.entityList[0].giftId) {		// 判断是否有红包
							this.giftId = res.data.entityList[0].giftId;							// 有，存储红包金额，走下单流程
							this.giftAmount = res.data.entityList[0].curBal;
							this.actualPayAmount = 500000 - this.giftAmount;
							LS.set('giftAmount', this.giftAmount);
							this.sendOrder();
						} else {																	// 没有，判断请求红包次数是否超过3次
							this.getGiftTimes++;
							if (this.getGiftTimes < 3) {											// 否，继续走拿红包流程
								setTimeout(() => {
									this.getGift();
								}, 1000);
							} else {																// 是，跳转获取红包失败页面
								LS.set('state', 'fail');
								this.$emit('goPlaceOrder');
							}
						}
					} else {
						this.getGiftTimes++;
						if (this.getGiftTimes < 3) {
							setTimeout(() => {
								this.getGift();
							}, 1000);
						} else {
							LS.set('state', 'fail');
							this.$emit('goPlaceOrder');
						}
					}
				})
				.catch(res => {
					console.log(res);
					this.otherErr = 'No internet connection, try again.';
					this.showOtherErr = true;
				});
		},
		sendOrder () {
			LS.set('phone', this.registerPhone);
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);
			const params = {
				bizType: 1,
				orderType: 1,
				actualPayAmount: this.actualPayAmount,
				currency: this.currency,
				ticket: {
					selections: [{
						banker: false,
						eventId: LS.get('eventId'),
						id: LS.get('id'),
						odds: LS.get('odds')
					}],
					bets: [{
						selectedSystems: [1],
						stake: {
							value: 500000
						}
					}]
				},
				favor: {
					favorInfo: [{
						giftId: this.giftId
					}]
				}
			};
			console.log(JSON.stringify(params));
			fetch('/orders/order', {
				method: 'POST',
				headers: t,
				body: JSON.stringify(params)
			})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						this.showLoading = false;
						LS.set('state', 'success');
						this.$emit('goPlaceOrder');
					} else if (res.bizCode === 5000) {
						LS.set('state', 'pending');
						this.$emit('goPlaceOrder');
					} else {
						LS.set('state', 'fail');
						this.$emit('goPlaceOrder');
					}
				})
				.catch(res => {
					console.log(res);
					this.otherErr = 'No internet connection, try again.';
					this.showOtherErr = true;
					LS.set('state', 'fail');
					this.$emit('goPlaceOrder');
				});
		},
		smsClick (e) {
			console.log(this.registerPhone, this.registerPassword, this.token);
			fetch('/patron/account/create', {
				method: 'POST',
				body: {
					phone: this.registerPhone,
					password: md5(this.registerPassword),
					token: this.token,
					type: 2
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						this.getGift();
					} else {
						this.otherErr = res.message;
						this.showSmsErr = true;
					}
				})
				.catch(res => {
					console.log(res);
					this.otherErr = 'No internet connection, try again.';
					this.showSmsErr = true;
				});
		},
		handleBack () {
			this.showSMS = false;
			this.showSmsErr = false;
			this.showRegister = true;
			this.otherErr = '';
			this.registerPhone = '';
			this.registerPassword = '';
		}
	}
};

</script>
<style lang="less">
@import "iconfont/iconfont-mixin.less";
@import "base/style/variable.less";

#account-info {
  background: #1c1e26;
  height: 306px;
}
.last-step {
  padding: 13px 16px 17px 17px;
  white-space: nowrap;
  color: #fff;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.2px;
  text-align: left;
}
// input样式
.m-input {
  border-radius: 2px;
}
.register form .m-input-prepend {
  font-weight: bold;
  border: none;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}
form .m-input-wrapper .m-input-icon + .m-input {
  padding-right: 0;
}
.register form .m-input-group--prepend .m-input {
  border: none !important;
}
.register form .m-input-wrapper--active {
  outline: 2px solid #17c61c !important;
  border-radius: 2px !important;
}
#account-info .register form .m-input-wrapper--error {
  outline: #e41827 2px solid !important;
  border-radius: 2px !important;
}
form .m-icon-delete,
#account-info .m-input-text--icon {
  display: none;
}
form .mobile-number,
.password {
  width: 280px;
  margin-left: 20px;
  margin-bottom: 14px;
}
.verifyInputs {
  position: fixed !important;
  top: 211px;
  left: 19px;
  width: 140px;
  margin-right: 10px;
}
// button样式
.verify-btn {
  position: fixed !important;
  top: 211px;
  left: 170px;
  width: 126px;
  height: 36px;
  span {
    position: relative;
    right: 3px;
  }
}
.register form .is-disabled {
  background: #373840 !important;
  color: #42434b;
  height: 36px;
}
.register form .af-button--primary {
  background: #30ea6a;
  border: none;
  color: #1c1e26;
}
.af-icon-loading:before {
  content: "\e648";
  .iconfont();
}
.af-icon-loading {
  display: inline-block;
  animation: loading-rotate 2s linear infinite;
}
#account-info .register .complete-btn {
  width: 160px;
  height: 40px;
  position: fixed;
  top: 300px;
  margin-left: 80px;
  border: none;
  border-radius: 20px;
  background-image: linear-gradient(to bottom, #17ce1d, #16b31a);
  box-shadow: 0 2px 5px 0 rgba(50, 206, 98, 0.5);
  color: #fff;
  font-size: 16px;
}
// 错误提示样式
.error-msg-area {
  width: 280px;
  position: fixed;
  top: 255px;
  left: 20px;
  margin-right: 20px;
  color: #e41827;
  font-weight: bold;
}
// 短信发送页面样式
.sendSMS {
  height: 100%;
  .smsSent-message {
    margin-top: 40px;
    p {
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.2px;
      text-align: center;
      color: #fff;
    }
  }
  .smsSent-code {
    margin-top: 30px;
    font-family: Roboto;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0.3px;
    text-align: center;
    color: #fff;
  }
  .smsSent-footer {
    margin-top: 20px;
    margin-left: 80px;
  }
}
.icon-container {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.link:hover {
  text-decoration: none;
}
.loadingImg {
  margin-top: 67px;
  margin-left: 128px;
  animation: loading-rotate 2s linear infinite;
  @keyframes loading-rotate {
    to {
      transform: rotate(360deg);
    }
    from {
      transform: rotate(0deg);
    }
  }
}
.wait {
  margin-top: 49px;
  color: #fff;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.3px;
  text-align: center;
}
#account-info .smsSent-btn {
  width: 160px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background-image: linear-gradient(to bottom, #17ce1d, #16b31a);
  box-shadow: 0 2px 5px 0 rgba(50, 206, 98, 0.5);
  font-family: Roboto;
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0.2px;
  text-align: center;
  color: #fff;
}
#account-info .m-back-icon-wap::before {
  margin-left: 15px;
  content: "\E620";
  font-family: "iconfont";
  font-size: 10.7px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
}
.sendSMS .error-msg-area {
  top: 300px;
}
</style>
