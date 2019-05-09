<template lang="html">
	<div class="m-page--psdlogin m-page--sign">
		<p class="m-text-tips m-icon-success">Password has been reset. You can now use your new password to log in.</p>
		<div class="m-account">
			<span class="m-label">Account</span>
			<span>{{countryCode}} {{account}}</span>
		</div>
		<div class="m-page-opt">
			<span class="m-label">Password</span>
			<div class="m-opt-wrapper">
				<AfInput
					v-model="password"
					type="password"
					placeholder="Enter Password"
					:toggleShowText="true"
					:error="passwordError || isPsdError"
					:initTextIconValue="true"
					@change="validatorPsd"/>
				<p v-if="showAdjError" class="m-error-tips">{{tipsInfo.msg}}</p>
				<AfButton
					type="primary"
					:disabled="submitStatus"
					:loading="loading"
					@click="signIn"
					>Log In</AfButton>
			</div>
		</div>
	</div>
</template>

<script>
import psdMix from '../js/psdMixins';
import psdValidator from '../js/psdValidator';

export default {
	mixins: [psdMix, psdValidator],
	props: {
		account: {
			type: [String, Number],
			required: true
		},
		errorInfo: {
			type: Object,
			'default': null
		},
		countryCode: {
			type: String,
			'default': ''
		}
	},
	computed: {
		submitStatus() {
			return !this.isPsdReady;
		},
		showAdjError() {
			return !!this.tipsInfo;
		},
		tipsInfo() {
			const errorInfo = this.errorInfo;

			if (errorInfo && errorInfo.msg) {
				return errorInfo;
			}

			return this.psdErrorInfo;
		},
		isPsdError() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.isPsdError || false;
		}
	},
	methods: {
		signIn() {
			if (this.submitStatus) {
				return;
			}

			// const checkPsdRet = this.checkPassword(this.password);

			// if (checkPsdRet) {
			this.$emit('submit', {
				from: 'login',
				params: {
					password: this.password,
					phone: this.account
				}
			});
			// }
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.signIn();
			}
		}
	},
	mounted() {
		document.querySelector('.m-page--psdlogin').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--psdlogin').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

@import '../style/button.less';
@import '../style/input.less';
@import '../style/error.less';

.m-page--psdlogin {
	width: 100%;
	padding: 8px 88px 27px 100px;
	box-sizing: border-box;

	.m-account,
	.m-page-opt {
		font-size: 0;

		> * {
			font-size: 16px;
			color: @dark;
		}
	}

	.m-label,
	.m-opt-wrapper {
		display: inline-block;
		vertical-align: top;
	}

	.m-label {
		width: 140px;
	}

	.m-icon-success {
		&:before {
			display: inline-block;
			vertical-align: middle;
			font-size: 30px !important;
			color: @green;
			margin-right: 10px;
		}
		.m-icon-success-bg();
	}

	.m-account {
		margin-top: 10px;
		width: 100%;

		span {
			line-height: 20px;
		}
	}

	.m-page-opt {
		margin-top: 20px;

		.m-label,
		.m-input-wrapper,
		.m-input {
			height: 40px;
		}

		.m-input-wrapper {
			display: block;
		}

		.af-button,
		.m-input {
			width: 300px;
		}

		.m-label {
			line-height: 40px;
		}

		.af-button {
			margin-top: 40px;
		}
	}
}
</style>
