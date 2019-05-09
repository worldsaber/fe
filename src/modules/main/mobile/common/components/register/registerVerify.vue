<template lang="html">
	<form class="m-register-verify">
		<div class="m-l-wrapper">
			<af-input
				class="m-mobile"
				placeholder="Mobile Number"
				:maxlength="18"
				v-model="phone"
				icon="delete"
				:iconClick="clearPhone"
				:error="isPhoneError"
				@change="handlePhoneChg"
				@blur="checkPhone"
			>
				<span slot="prepend">+{{countryCode}}</span>
			</af-input>

			<div class="m-error-wrapper">
				<p v-if="isPhoneError" v-html="phoneError"></p>
			</div>
		</div>

		<div class="m-l-wrapper">
			<af-input
				class="m-password"
				type="password"
				:toggleShowText="true"
				:initTextIconValue="false"
				:placeholder="passwordPlaceHolder"
				:minlength="6"
				:maxlength="14"
				:error="isPsdError"
				v-model='password'
				@blur="checkPassword"
				@change="clearPsdError"
			>
			</af-input>

			<div class="m-error-wrapper">
				<p v-if="isPsdError">{{passwordError}}</p>
			</div>

			<ul class="m-tips-wrapper" v-if="!isPsdError">
				<li class="m-tips-item">Length of 6-14 characters.</li>
				<li class="m-tips-item">At least one letter and one number.</li>
			</ul>
		</div>

		<div class="m-l-wrapper" v-if="!ignoreVcode">
			<af-input
				class="m-code"
				placeholder="Verification  Code"
				icon="delete"
				:iconClick="clearCode"
				:maxlength="18"
				v-model="code"
				:error="isCodeError"
				@change="handleCodeChg"
				@blur="checkCode"
				@focus="chgCodeStatus"
			>
				<div
					slot="append"
					:class="{
						'btn-fix': timer,
						'btn-loading': codeLoading
					}"
					@click.prevent="handleSendCode"
				>
					<span v-if="!codeLoading" class="send-again" >{{getCodeText}}</span>
					<i v-else class="af-icon-loading"></i>
				</div>
			</af-input>

			<div class="m-error-wrapper">
				<p v-if="isCodeError">{{codeError}}</p>
			</div>
		</div>

		<div class="m-page-error" v-if="pageError">
			<p>{{pageError}}</p>
		</div>

		<af-button
			class="m-submit-btn"
			:autofocus="false"
			@click.prevent="handleRegister"
			:disabled="registerBtnDisabled"
			:loading="registerBtnLoading"
		>
			<span>{{registerBtnLoading ? 'Loading' : commitBtnText}}</span>
		</af-button>
	</form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import 'packages/input';
import 'packages/button';
import { fixPhone } from 'base/js/utils';

import { validatePhone, validatePsd, validateCode, unionValidate } from './js/commonFun';

let timerId = null;

export default {
	name: 'RegisterVerify',
	props: {
		originPhone: {
			type: String,
			'default': ''
		},
		passwordPlaceHolder: {
			type: String,
			'default': 'Set Password'
		},
		commitBtnText: {
			type: String,
			'default': 'Register'
		}
	},
	data() {
		return {
			countryCode: window.countryCode,
			// phone
			phone: this.originPhone || this.account || '',
			phoneError: '',

			// psd
			password: '',
			passwordError: '',

			// code
			code: '',
			codeError: '',
			timer: 0,
			timerId: null,
			shouldValCode: false,

			// loading
			codeLoading: false,
			registerBtnLoading: false,

			pageError: ''
		};
	},
	computed: {
		...mapState('registerVerify', [
			'errorInfo',
			'account',
			'ignoreVcode'
		]),
		isPhoneError() {
			return !!this.phoneError;
		},
		isPsdError() {
			return !!this.passwordError;
		},
		isCodeError() {
			return !!this.codeError;
		},
		registerBtnDisabled() {
			return false;
		},
		getCodeText() {
			const timer = this.timer;
			if (timer) {
				return `Send Again (${timer}${timer === 1 ? '' : 's'})`;
			}

			return 'Get Code';
		}
	},
	watch: {
		account(val, oldVal) {
			val && (this.phone = val);
		},
		pageError(val) {
			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}

			if (val) {
				timerId = setTimeout(() => {
					this.pageError = '';
				}, 5000);
			}
		},
	},
	created() {
		this.detectIgnoreVcode();
	},
	methods: {
		...mapActions('registerVerify', [
			'register',
			'getCode',
			'setReferralCode',
			'detectIgnoreVcode'
		]),
		// phone
		checkPhone(val) {
			this.phoneError = validatePhone(this.phone) || '';
		},
		handlePhoneChg(opt) {
			const val = opt.value;
			this.phone = val.replace(/\s/g, '');
			this.phoneError && this.clearPhoneError();
		},
		clearPhone() {
			this.phone = '';
		},
		clearPhoneError() {
			this.phoneError = '';
		},

		// psd
		checkPassword() {
			this.passwordError = validatePsd(this.password) || '';
		},
		clearPsdError() {
			this.passwordError = '';
		},

		// code
		checkCode() {
			if (this.shouldValCode) {
				this.codeError = validateCode(this.code) || '';
			}
		},
		clearCodeError() {
			this.shouldValCode = true;
			this.codeError = '';
		},
		chgCodeStatus() {
			this.shouldValCode = true;
		},
		handleCodeChg(opt) {
			const val = opt.value,
				tempVal = val.replace(/\D/g, '');
			this.code = tempVal.length > 6 ? tempVal.slice(0, 6) : tempVal;
			this.codeError && this.clearCodeError();
		},
		clearCode() {
			this.code = '';
		},
		startTimer() {
			clearTimeout(this.timerId);
			if (this.timer === 0) {
				return;
			}
			this.timerId = setTimeout(() => {
				this.timer -= 1;
				this.startTimer();
			}, 1000);
		},
		handleSendCode() {
			this.shouldValCode = false;

			if (this.timer) {
				return;
			}

			const phone = this.phone,
				error = validatePhone(phone);
			if (error) {
				this.phoneError = error;
				return;
			}

			const tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}

			this.codeLoading = true;

			this.pageError = '';

			this.getCode({
				phone: tempPhone,
				password: this.password
			}).then(data => {
				this.codeLoading = false;
				const { bizCode } = data;
				if (bizCode === 10000) {
					this.timer = 60;
					this.startTimer();
				}
			}).catch((err = {}) => {
				this.codeLoading = false;

				switch (err.type) {
				case 'smsExceeded':
					return this.$emit('smsExceeded');
				case 'toast':
					return this.$toast(err.msg);
				case 'inline_toast':
					this.pageError = err.msg;
					break;
				case 'psdEmpty':
					return this.checkPassword();
				case 'phoneError':
					this.phoneError = err.msg;
					break;
				case 'codeError':
					this.codeError = err.msg;
					break;
				default:
					break;
				}
			});
		},
		checkParams() {
			const phone = this.phone;
			let params;
			if (this.ignoreVcode) {
				params = {
					phone,
					password: this.password
				};
			} else {
				params = {
					phone,
					password: this.password,
					phoneVerifyCode: this.code
				};
			}
			const validateRet = unionValidate(params, this.ignoreVcode);

			if (validateRet.success) {
				return {
					valResult: true,
					params
				};
			}

			this.phoneError = validateRet.phoneError || '';
			this.passwordError = validateRet.psdError || '';
			this.codeError = validateRet.codeError || '';

			return {
				valResult: false
			};
		},
		handleRegister() {
			const phone = this.phone,
				validateRet = this.checkParams();

			if (validateRet.valResult) {
				const { params } = validateRet,
					tempPhone = fixPhone(phone);
				if (tempPhone !== phone) {
					this.phone = tempPhone;
					params.phone = tempPhone;
				}
				this.registerBtnLoading = true;
				this.register(params)
					.then(data => {
						this.$emit('registerSuccess', data);
						this.registerBtnLoading = false;
						this.setReferralCode();
					}).catch(err => {
						this.registerBtnLoading = false;
						switch (err.type) {
						case 'toast':
							return this.$toast(err.msg);
						case 'inline_toast':
							this.pageError = err.msg;
							break;
						case 'psdEmpty':
							return this.checkPassword();
						case 'phoneError':
							this.phoneError = err.msg;
							break;
						case 'passwordError':
							this.passwordError = err.msg;
						case 'codeError':
							this.codeError = err.msg;
							break;
						default:
							break;
						}
					});
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';
@import './style/btn.less';

.m-register-verify {
	display: block;
	height: 100%;

	.m-submit-btn {
		width: 100%;
		border-radius: 2px;
		.button();
		.button--primary();
	}

	.is-disabled {
		.disabled();
	}

	.m-l-wrapper {
		padding-bottom: 6/@rem;
	}

	.m-input-append {
		padding-right: 13px;

		> div {
			display: inline-block;
			width: 100/@rem;
			height: 30/@rem;
			line-height: 30/@rem;
			border-radius: 2px;
			text-align: center;
			cursor: pointer;
			.button--primary();
		}

		.send-again {
			font-size: 12/@rem;
		}

		.btn-fix {
			.disabled();
			cursor: not-allowed;
		}

		.btn-loading {
			background: @lightGreen;

			&:hover,
			&:active {
				background: @lightGreen;
			}
		}
	}

	.af-icon-loading {
		.m-icon-loading();
		display: inline-block;
		animation: loading-rotate 2s linear infinite;
	}

	.m-error-wrapper {
		min-height: 14/@rem;
		line-height: 14/@rem;
		font-size: 12/@rem;
		color: @red;
		vertical-align: top;
	}

	.m-tips-wrapper {
		display: none;
		margin-top: -9/@rem;

		.m-tips-item {
			line-height: 14/@rem;
			font-size: 11/@rem;
			color: @darkGray;

			&:before {
				content: '-';
				margin-right: 5/@rem;
			}
		}
	}

	.m-input-wrapper--active {
		& ~ .m-tips-wrapper {
			display: block;
		}
	}

	.m-page-error {
		line-height: 14px;
		font-size: 12px;
		color: @red;
		margin-bottom: 10px;
	}
}
</style>
