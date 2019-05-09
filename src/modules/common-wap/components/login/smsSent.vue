<template>
<div id="smsSent">
	<div class="smsSent-top">
		<div class="title">
			<p>Verify Mobile Number</p>
		</div>
	</div>

	<div class="smsSent-message">
		<p>Please send an SMS to {{smsNumber}} from +{{countryCode}} {{phone}} with the verification code below</p>
	</div>

	<div class="smsSent-code">
		<p>{{msgContent}}</p>
	</div>
	<div class="smsSent-footer">
		<af-button class="smsSent-btn" size="large" :autofocus="true" @click="smsClick" :loading="loading">
			<span>{{loading ? 'Loading' : 'Continue'}}</span>
		</af-button>
	</div>
</div>
</template>

<script>
import dialog from 'components/dialog';
import cookie from 'storage/cookie';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';

let token = '';
let tokenSaved = '';

export default {
	name: 'smsSent',
	data () {
		return {
			loading: false,
			countryCode: window.countryCode || '254'
		};
	},
	props: {
		phone: {
			type: String,
			'default': ''
		},
		smsNumber: {
			type: String,
			'default': ''
		},
		msgContent: {
			type: String,
			'default': ''
		},
		bizType: {
			type: String,
			'default': 'REGISTER'
		},
		token: {
			type: String,
			'default': ''
		}
	},

	methods: {
		// 验证短信完成注册
		smsClick (e) {
			if (this.loading) {
				return;
			}
			this.loading = true;
			// 如果是注册流程
			if (this.bizType === 'REGISTER') {
				fetch('/patron/account/' + this.phone + '/completeBySms', {
					method: 'PUT',
					body: {
						token: this.token
					}
				})
				.then(res => res.json())
				.then(res => {
					this.loading = false;
					switch (res.bizCode) {
					case 10000:
						// 跳转到注册完成页面
						cookie('phone', this.phone, {
							path: '/',
							expires: 365
						});
						// 更新登录状态
						window.loginStatus = true;

						// 广播登陆全局消息
						EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);

						this.$emit('goFinish');

						break;
					case 11800:
						// dialog.alert('We have not received your SMS. Please try again or contact us.', ['OK']);
						dialog({
							css: 'wap-register',
							content: res.message,
							title: 'Certificate validation failure',
							button: ['OK'],
							width: '26rem'
						});
						break;
					case 11810:
						dialog.alert(
								res.message, // 'Your session has timed out. Please try again.',
								['OK'],
								e => {
								// go register page
									this.$emit('goRegAndLogin');
								});
						break;
					default:
						dialog.alert(res.message, ['OK']);
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
				fetch('/patron/password/completeResetBySms', {
					method: 'PUT',
					body: {
						token: this.token
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
						this.$emit('goPasswdReset', {
							resetToken: token
						});
						break;
					case 11800:
						// dialog.alert('We have not received your SMS. Please try again or contact us.', ['OK']);
						dialog.alert(res.message, ['OK']);
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
			if (this.bizType === 'THIRD_PARTY_BIND') {
				fetch('/patron/account/completeThirdPartyBySms', {
					method: 'PUT',
					body: {
						token: this.token
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
						// 更新登录状态
						window.loginStatus = true;

						// 广播登陆全局消息
						EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);

						this.$emit('goFinish');
						break;
					case 11800:
						// dialog.alert('We have not received your SMS. Please try again or contact us.', ['OK']);
						dialog.alert(res.message, ['OK']);
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
						dialog.alert(res.message, ['OK']);
						break;
					}
				})
				.catch(res => {
					this.loading = false;
					dialog.alert('No internet connection, try again.', ['OK']);
				});
			}
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
#smsSent {
  .smsSent-top {
    .title {
      width: 100%;
      font-size: 22/@rem;
      font-weight: bold;
    }
  }
  .m-input-wap-wrapper--active {
    border: 1px solid #0d9737;
  }
  .smsSent-message {
    margin-top: 16/@rem;
    font-size: 12/@rem;
    line-height: 1.33;
    text-align: center;
  }

  .smsSent-code {
    margin-top: 28/@rem;
    margin-bottom: 35/@rem;
    font-size: 20/@rem;
    font-weight: bold;
  }
  .smsSent-footer {
    width: 100%;
    .smsSent-btn {
      background-color: @green;
      border: none;
      width: 100%;
      height: 47.5/@rem;
      font-size: 14/@rem;
    }
  }
}

.wap-register.es-dialog .es-dialog-head h1{
	font-size: 20/@rem;
	height: auto;
}
</style>
