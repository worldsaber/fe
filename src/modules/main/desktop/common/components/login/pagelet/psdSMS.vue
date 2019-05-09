<template lang="html">
	<div class="m-page--psdsms">
		<p class="m-text-tips">Please send an SMS to {{smsNumber}} from {{countryCode}} {{phone}} with the verification code below</p>
		<p class="m-text-main">{{smsContent}}</p>
		<div class="m-page-opt">
			<p :class="['m-icon-check', {'m-icon-checked': isReady}]"  @click="handleAcccept">I have sent the requested SMS</p>
			<p v-show="showError" class="m-error-tips">The checkbox above should be checked</p>
			<AfButton
				type='primary'
				:loading="loading"
				:disabled="submitStatus"
				@click="goNext"
				>Continue</AfButton>
		</div>
	</div>
</template>

<script>
import psdMix from '../js/psdMixins';

export default {
	mixins: [psdMix],
	props: {
		phone: {
			type: [Number, String],
			required: true
		},
		smsNumber: {
			type: String,
			required: true
		},
		smsContent: {
			type: String,
			required: true
		},
		countryCode: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			isReady: false,
			showError: false
		};
	},
	computed: {
		submitStatus() {
			return !this.isReady;
		}
	},
	methods: {
		goNext() {
			// click continue 时，如果没有勾选checkbox，显示提示的错误信息
			if (!this.isReady) {
				this.showError = true;
			} else {
				this.showError = false;
			}

			if (this.submitStatus) {
				return;
			}

			this.$emit('submit', {
				from: 'sms'
			});
		},
		handleAcccept() {
			this.isReady = !this.isReady;
		},

		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.goNext();
			}
		}
	},
	mounted() {
		document.querySelector('.m-page--psdsms').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--psdsms').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

@import '../style/button.less';
@import '../style/error.less';

.m-page--psdsms {
	padding: 38px 0;
	width: 100%;
	box-sizing: border-box;

	text-align: center;
	color: @dark;

	.m-text-tips {
		font-size: 20px;
		line-height: 27px;
	}

	.m-text-main {
		margin-top: 23px;
		margin-bottom: 8px;
		font-size: 24px;
		font-weight: bold;
		line-height: 33px;
	}

	.m-page-opt {
		width: 300px;
		margin: 0 auto;
		text-align: left;

		.m-icon-check {
			font-size: 14px;
			line-height: 33px;
			.m-icon-check();

			&:before {
				display: inline-block;
				vertical-align: middle;
				margin-right: 6px;
				font-size: 15px;
			}
		}

		.m-icon-checked {
			.m-icon-check--checked();
		}

		.af-button {
			margin-top: 29px;
			width: 300px;
		}

		.m-error-tips {
			top: 29px;
		}
	}
}
</style>
