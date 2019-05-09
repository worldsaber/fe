<template>
<div id="resetPassword">
	<div class="reset-password-container">
		<form>
			<div class="reset-password-label">
				<p>Reset Password</p>
			</div>
			<div class="action-label">Your password must be 6-14 character long and contain at least one letter and one number.</div>
			<af-input class="verifyInputs" placeholder="Password" type="password" :toggleShowText="true" :initTextIconValue="false" v-model="password" :error="showError">
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<af-button @click.prevent="resetPassword" class="reset-password-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Confirm'}}</af-button>
		</form>
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

export default {
	name: 'resetPassword',
	components: {
		AfInput,
		afButton
	},
	props: {
		resetToken: {
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
			showError: false
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
		resetPassword() {
			if (this.loading) {
				return;
			}
			if (!this.checkpwd(this.password)) {
				return;
			}
			this.loading = true;
			fetch('/patron/password/reset', {
				method: 'PUT',
				body: {
					token: this.resetToken,
					password: md5(this.password)
				}
			}).then(res => res.json()).then(res => {
				window.__debug__ && console.log(res);
				this.loading = false;
				if (res.bizCode === 10000) { // 重置成功
					this.$toast('Password reset Succeeded', e => location.href = pagePath.home);
				} else if (res.bizCode === 11810) {
					dialog.alert(
						'Your session has timed out. Please try again.', ['OK'],
						e => { // go register page
							this.$emit('goFindAccount');
						});
				} else {
					dialog.alert('Reset password failed.', ['OK']);
				}
			}).catch(res => {
				this.loading = false;
				dialog.alert('No internet connection, try again.', ['OK']);
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

#resetPassword {
	margin-top:-25/@rem;
    .reset-password-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        .reset-password-label {
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
            margin-top: 10/@rem;
            margin-bottom: 41/@rem;
            height: 20/@rem;
            font-size: 12/@rem;
            line-height: 20/@rem;
            text-align: center;
            color: @dark;
		}
		.m-input-wap-text--icon{
			padding-right:15/@rem;
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

        .reset-password-btn {
            margin-top: 25/@rem;
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

}
</style>
