<template>
<div id="setPassword">
	<div class="set-password-container">
		<form>
			<div class="set-password-label">
				<p>Set Password</p>
			</div>
			<div class="action-label">Your password must be 6-14 character long and contain at least one letter and one number.</div>
			<af-input class="verifyInputs" placeholder="Password" type="password" :toggleShowText="true" :initTextIconValue="false" v-model="password" :error="showError">
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<af-button @click.prevent="setPassword" class="set-password-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Create Account'}}</af-button>
		</form>
	</div>
	<div class="footer">
		<p>By creating an account, you agree to the
			<a :href="`${helpUrl}#/about/terms-and-conditions`" class='hightlight'> Terms & Conditions </a>, you confirm you are 18 years old or over and all information given is true.
		</p>
	</div>
</div>
</template>

<script>
import afButton from 'packages/button/index';
import dialog from 'components/dialog';
import md5 from 'blueimp-md5';
import {
	AfInput
} from 'components/input';
import { pagePath } from 'config/pageConfig';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import cookie from 'storage/cookie';

export default {
	name: 'setPassword',
	components: {
		AfInput,
		afButton
	},
	props: {
		phone: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			password: '',
			disabled: true,
			loading: false,
			errorMsg: '',
			showError: false,
			helpUrl: pagePath.help
		};
	},
	created() {

	},
	watch: {
		password() {
			this.disabled = this.password === '';
			if (this.showError) {
				this.showError = false;
			}
		}
	},
	methods: {
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
				window.__debug__ && console.log(res);
				this.loading = false;
				if (res.bizCode === 10000) { // 注册成功
					this.$emit('goVeriry', {
						phone: this.phone,
						remainMsgNum: res.data.remainMsgNum,
						token: res.data.token,
						showWarning: res.data.remainMsgNum === 1,
						opt: {
							smsNumber: res.data.smsNumber || '',
							msgContent: res.data.msgContent || ''
						}
					});
				} else if (res.bizCode === 11610) {
					// 不需要验证码直接注册成功
					this.$emit('goFinish');
					cookie('phone', this.phone, {
						path: '/',
						expires: 365
					});

					// 更新登录状态
					window.loginStatus = true;

					// 广播登陆全局消息
					EventBus.$emit(commonEvent.SAVE_LOGIN_STATUS);
				} else if (res.bizCode === 11703) { // 无法继续发送短信
					this.$emit('goSms', {
						bizType: 'REGISTER',
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
				window.__debug__ && console.log(res);
				this.loading = false;
				dialog.alert('No internet connection, try again.');
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
@import '~base/styles/variable.less';
@import 'iconfont/iconfont-mixin.less';
@import 'base/styles/icon.less';

#setPassword {
	margin-top: -38/@rem;
    .set-password-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        .set-password-label {
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
            margin-top: 14.8/@rem;
            margin-bottom: 35/@rem;
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
            .m-loading-circle-icon {
                .m-icon-loading-circle();
            }

            input {
                height: 100%;
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

        .set-password-btn {
            margin-top: 8/@rem;
            width: 100%;
            padding-left: 1px;
            padding-right: 1px;
            box-sizing: border-box;
            background-color: @green;
            border: none;
            height: 47.5/@rem;
            font-size: 14/@rem;
        }

    }
    .footer {
        margin-top: 165/@rem;
        width: 301/@rem;
        font-size: 11/@rem;
        line-height: 1.36;
        text-align: left;
        color: @dark;
    }

}
</style>
