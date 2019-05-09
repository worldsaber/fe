<template>
  	<form class="m-just-login">
		<div class="m-l-wrapper">
			<af-input
				class="m-mobile"
				placeholder="Mobile Number"
				:maxlength="18"
				v-model='phone'
				icon="delete"
				:iconClick='clearLoginPhone'
				:error='!!phoneErrorMsg'
				@change="handlePhoneChange"
			>
				<span v-if="isShowCountryCode" slot="prepend">+{{countryCode}}</span>
			</af-input>

			<div class="m-error-wrapper">
				<p v-if="phoneErrorMsg">{{phoneErrorMsg}}</p>
			</div>
		</div>

		<div class="m-l-wrapper">
			<af-input
				class="m-password"
				type="password"
				:toggleShowText="true"
				:initTextIconValue="true"
				placeholder="Password"
				:error="!!psdErrorMsg"
				v-model='password'
				@change="handlePasswordChange">
			</af-input>

			<div class="m-error-wrapper">
				<p v-if="psdErrorMsg">{{psdErrorMsg}}</p>
			</div>
		</div>

		<div class="m-forget-password">
			<slot name="forget-password">
				<a :href="forgetPasswordLink">Forgot Password?</a>
			</slot>
		</div>

		<af-button
			class="m-submit-btn"
			:autofocus="false"
			@click.prevent="handleLogin"
			:disabled="isDisabled || isLoading"
			:loading="isLoading"
		>
			<span>{{isLoading ? 'Loading' : commitBtnText}}</span>
		</af-button>
	</form>
</template>

<script>
import 'packages/button';
import 'packages/input';

import cookie from 'storage/cookie';
import md5 from 'blueimp-md5';
import dialog from 'components/dialog';
import { fixPhone } from 'base/js/utils';
import { pagePath } from 'config/pageConfig';
import errorMessage from '../errorMsg/registerAndLogin';

export default {
	name: 'JustLogin',
	props: {
		commitBtnText: {
			type: String,
			'default': 'Log In'
		},
		isShowCountryCode: {
			type: Boolean,
			'default': true
		}
	},
	data () {
		return {
			forgetPasswordLink: pagePath.resetPassword,
			phone: '',
			password: '',
			isLoading: false,
			isDisabled: false,
			countryCode: window.countryCode || '254',

			phoneErrorMsg: '',
			psdErrorMsg: ''
		};
	},
	methods: {
		clearLoginPhone () {
			this.phone = '';
		},
		handlePhoneChange () {
			const isValid = this.checkPhone(this.phone);
			this.isDisabled = !isValid;
		},
		handlePasswordChange () {
			const isValid = this.checkPassword(this.password);
			this.isDisabled = !isValid;
		},
		checkPhone (phone) {
			if (!phone) {
				this.phoneErrorMsg = 'Mobile Number is required.';
				return false;
			}
			this.phoneErrorMsg = '';
			return true;
		},
		checkPassword (password) {
			if (!password) {
				this.psdErrorMsg = 'Password is required.';
				return false;
			}
			this.psdErrorMsg = '';
			return true;
		},
		checkFormData ({ phone, password }) {
			return this.checkPhone(phone) && this.checkPassword(password);
		},
		handleLogin () {
			const isValid = this.checkFormData({
				phone: this.phone,
				password: this.password
			});
			if (!isValid) {
				return;
			}

			this.isLoading = true;

			const phone = fixPhone(this.phone);

			fetch('/patron/accessToken', {
				method: 'POST',
				body: {
					username: phone,
					password: md5(this.password)
				}
			})
				.then(res => res.json())
				.then(res => {
					this.isLoading = false;
					if (res.bizCode === 10000) {
						// 登录成功
						cookie('phone', phone, {
							path: '/',
							expires: 365
						});

						this.$emit('loginSuccess', res.data);
					} else {
						const errObj = errorMessage[res.bizCode];
						if (errObj.field === 'phone') {
							this.phoneErrorMsg = res.message;
						} else {
							this.psdErrorMsg = res.message;
						}
					}
				})
				.catch(res => {
					this.isLoading = false;
					dialog.alert('No internet connection, try again.', ['OK']);
				});
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

.m-just-login {
	display: block;

  	.m-submit-btn {
		width: 100%;
		border-radius: 2px;
		border: none !important;
		font-size: 16/@rem;

		background: @green;
		color: @white;

		&:hover {
			background: @midGreen;
		}

		&:active {
			background: @lightGreen;
		}

		&.is-disabled {
			background: @dark!important;
			color: fade(@white, 50%)!important;
		}
	}

	.m-l-wrapper {
		padding-bottom: 6/@rem;
	}

	.m-error-wrapper {
		min-height: 14/@rem;
		line-height: 14/@rem;
		font-size: 12/@rem;
		color: @red;
		vertical-align: top;
	}

	.m-input-wrapper {
		.m-input {
			height: 33/@rem;
			line-height: 33/@rem;
		}

		.m-input-icon:before {
			line-height: 33/@rem;
		}
	}

	.m-forget-password {
		text-align: center;
		font-size: 12/@rem;
		color: @green;
	}
}
</style>

