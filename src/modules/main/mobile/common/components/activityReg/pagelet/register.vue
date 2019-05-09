<template lang="html">
	<div class="m-pagelet-index" :style="getPageStyle" id="j_pageIndex">
		<div class="m-page-opt">
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
					<span slot="prepend">{{countryCode}}</span>
				</af-input>

				<div class="m-error-wrapper" v-if="isPhoneError">
					<p v-html="phoneError"></p>
				</div>
			</div>

			<div class="m-l-wrapper">
				<af-input
					class="m-psd"
					type="password"
					:toggleShowText="true"
					:initTextIconValue="false"
					placeholder="Set Password"
					:minlength="6"
					:maxlength="14"
					:error="isPsdError"
					v-model='password'
					@blur="checkPassword"
					@change="clearPsdError"
				>
				</af-input>

				<div class="m-error-wrapper" v-if="isPsdError">
					<p>{{passwordError}}</p>
				</div>

				<ul class="m-tips-wrapper" v-else>
					<li class="m-tips-item">Length of 6-14 characters.</li>
					<li class="m-tips-item">At least one letter and one number.</li>
				</ul>
			</div>
			<div class="m-l-wrapper" v-if="!ignoreVcode">
				<div class="m-code-wrap">
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
					</af-input>
					<div :class="[{ 'btn-fix': timer, 'btn-loading': codeLoading }, 'btn-code']" >
						<span
							v-if="!codeLoading"
							class="send-again"
							@click.prevent="handleSendCode"
						>{{getCodeText}}</span>
						<i v-else class="af-icon-loading"></i>
					</div>
				</div>

				<div class="m-error-wrapper" v-if="isCodeError">
					<p>{{codeError}}</p>
				</div>
			</div>

			<div class="m-page-error" v-if="hasPageError">
				<p>{{errorInfo.msg}}</p>
			</div>

			<div class="m-l-wrapper">
				<af-button
					class="m-btn"
					:autofocus="false"
					@click.prevent="handleRegister"
					:disabled="registerBtnDisabled"
					:loading="registerBtnLoading"
				>
					<span>{{registerBtnLoading ? 'Loading' : commitBtnText}}</span>
				</af-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { objType } from 'utils';
import 'packages/input';
import 'packages/button';
import { fixPhone } from 'base/js/utils';

import * as mutationTypes from 'store/activityRegister/mutationTypes';

// import { showCurrency } from 'config/currencyConfig';

import { validatePhone, validatePsd, validateCode, unionValidate } from '../js/commonFun';

const defaultImg = require('../image/bg.jpg');

let timerId = null;

export default {
	name: 'ActivityRegIndex',

	props: {
		originPhone: {
			type: String,
			'default': ''
		},
		bgImg: {
			type: String,
			'default': ''
		},
		commitBtnText: {
			type: String,
			'default': 'Register'
			// default: `Get ${showCurrency} 50 to bet`
		}
	},

	data() {
		return {
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
			reqLoading: false,
			registerBtnLoading: false,

			bgImage: objType(this.bgImg) === 'null' ? '' : this.bgImg || defaultImg,

			hasPageError: false
		};
	},
	computed: {
		...mapState('activityRegister', [
			'countryCode',
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
		},
		getPageStyle() {
			// if (this.bgImage) {
			// 	return {
			// 		background: `url(${this.bgImage}) no-repeat`,
			// 		'background-size': 'cover'
			// 	};
			// }
			return '';
		}
	},
	watch: {
		errorInfo(val) {
			if (val) {
				val.isPhoneError && (this.phoneError = val.msg);
				val.isCodeError && (this.codeError = val.msg);
				val.isPsdError && (this.passwordError = val.msg);

				if (val.type === 'toast') {
					this.$dialog();
					this.$toast(val.msg);
					return;
				}

				if (val.type === 'dialog') {
					this.$dialog();
					this.$dialog({
						css: 'errMsg-dialog',
						width: 315,
						title: val.title || '',
						content: val.msg || '',
						button: ['*OK']
					}).onClose(() => {
						if (val.moduleName) {
							this.chgModule(val.moduleName);
						}
					});
					return;
				}

				if (val.type === 'psdEmpty') {
					this.checkPassword();
					return;
				}

				this.hasPageError = val.type === 'inline_toast';
			} else {
				this.hasPageError = false;
			}
		},
		account(val, oldVal) {
			val && (this.phone = val);
		},
		hasPageError(val) {
			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}

			if (val) {
				timerId = setTimeout(() => {
					this.hasPageError = false;
				}, 5000);
			}
		}
	},
	created() {
		this.detectIgnoreVcode();
	},
	methods: {
		...mapActions('activityRegister', [
			'register',
			'getCode',
			'detectIgnoreVcode'
		]),
		...mapMutations('activityRegister', {
			chgModule: mutationTypes.UPDATE_NEXT_PAGE
		}),
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
			}, err => { // eslint-disable-line
				this.codeLoading = false;
			}).catch(err => {}); // eslint-disable-line
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

				this.register(params).catch(err => {}); // eslint-disable-line
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';
@import '../style/btn.less';
@import '../style/input.less';
@import '../style/reset.less';

.m-pagelet-index {
	height: 100%;

	.m-page-opt {
		padding: 0 30px;
		box-sizing: border-box;
		.btn-wrapper,
		.af-button {
			width: 100%;
			height: 48px;
		}

		.af-button {
			.button();
			border-radius: 2px;
		}

		.af-button--primary {
			.button--primary();
		}

		.is-disabled {
			.disabled();
		}

		.input();

		.m-input-wrapper {
			height: 42px;

			.m-input {
				height: 42px;
				padding-right: 18px;
			}
		}

		.m-l-wrapper {
			margin-bottom: 26px;
			/* position: relative; */

			&:last-of-type {
				margin-bottom: 0;
			}
			.m-code-wrap{
				display: flex;
			}
			.btn-code{
				flex-basis: 100px;
				margin-left: 5px;
				flex-shrink: 0;
				line-height: 40px;
				text-align: center;
				border-radius: 2px;
				border: solid 1px #0d9737;
				color: #0d9737;
				font-size: 12px;
				box-sizing: border-box;
			}
		}

		.m-input-append {
			padding-right: 13px;

			> div {
				display: inline-block;
				height: 30px;
				width: 118px;
				border-radius: 2px;
				.button--primary();
				text-align: center;
				line-height: 30px;
				cursor: pointer;
			}

			.send-again {
				display: inline-block;
				height: 30px;
				width: 118px;
				font-size: 12px;
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
			/* position: absolute;
			top: 46px;
    		height: 20px; */
			line-height: 14px;
			font-size: 12px;
			color: @red;
			padding-top: 5px;
			box-sizing: border-box;
		}

		.m-tips-wrapper {
			display: none;
			margin-top: 5px;

			.m-tips-item {
				line-height: 14px;
				font-size: 11px;
				color: @darkGray;

				&:before {
					content: '-';
					margin-right: 5px;
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
}
</style>
