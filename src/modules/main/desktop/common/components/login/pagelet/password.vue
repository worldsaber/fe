<template lang="html">
	<div class="m-page--psd">
		<p class="m-text-tips">Password must be 6-14 characters in length and contain at least one letter and one number</p>
		<div class="m-page-opt">
			<span class="m-label">New Password</span>
			<div class="m-opt-wrapper">
				<AfInput
					v-model="password"
					type="password"
					placeholder="Enter New Password"
					:toggleShowText="true"
					:error="passwordError"
					@change="validatorPsd"/>
				<p v-if="showAdjError" class="m-error-tips">{{tipsInfo.msg}}</p>
				<AfButton
					type="primary"
					@click="goNext"
					:loading="loading"
					:disabled="submitStatus">Confirm</AfButton>
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
		errorInfo: {
			type: Object,
			'default': null
		}
	},
	computed: {
		/*
		could the next button be clicked
		 */
		submitStatus() {
			return !this.isPsdReady;
		},
		showAdjError() {
			return !!this.tipsInfo;
		},
		/*
		merge the error from request and input error
		 */
		tipsInfo() {
			const errorInfo = this.errorInfo;

			if (errorInfo && errorInfo.msg) {
				return errorInfo;
			}

			return this.psdErrorInfo;
		}
	},
	methods: {
		/*
		to next module
		 */
		goNext() {
			// check password
			const checkPsdRet = this.checkPassword(this.password);

			if (checkPsdRet) {
				this.$emit('submit', {
					from: 'password',
					params: {
						password: this.password
					}
				});
			}
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.goNext();
			}
		}
	},
	mounted() {
		document.querySelector('.m-page--psd').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--psd').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

@import '../style/button.less';
@import '../style/input.less';
@import '../style/error.less';

.m-page--psd {
	width: 702px;
	margin: 0 auto;
	padding: 35px 0 44px;
	box-sizing: border-box;

	.m-text-tips {
		color: @dark;
		font-size: 20px;
		line-height: 27px;
	}

	.m-page-opt {
		width: 100%;
		margin-top: 10px;
		text-align: left;

		.m-label,
		.m-opt-wrapper {
			display: inline-block;
			vertical-align: top;
		}

		.m-label {
			font-size: 14px;
			line-height: 40px;
			height: 40px;
			@color: @dark;
			margin-right: 15px;
		}

		.m-input-wrapper {
			height: 40px;
			width: 300px;
			display: block;

			.m-input {
				height: 40px;
			}
		}

		.af-button {
			margin-top: 40px;
			width: 300px;
		}
	}
}
</style>
