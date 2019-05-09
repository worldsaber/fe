<template lang="html">
	<div class="m-page m-page--sms">
		<AfHeader
			:backIcon="backIcon"
			@back="goPrev"
			@close="closePop"
			:title="titleText"
		/>
		<section class="m-page-main">
			<p class="m-text-tips">Please send an SMS to {{smsNumber}} from {{countryCode}} {{phone}} with the verification code below.</p>
			<p class="m-text-main">{{smsContent}}</p>
			<div class="m-page-opt">
				<p :class="['m-icon-check', {'m-icon-checked': isReady}]"  @click="handleAcccept">I have sent the requested SMS</p>
				<p v-show="showError" class="m-error-tips">The checkbox above should be checked</p>
				<AfButton
					type='primary'
					:loading="loading"
					:disabled="submitStatus"
					@click="handleNext"
					>{{btnText}}</AfButton>
			</div>
		</section>
	</div>
</template>

<script>
import AfButton from 'packages/button/button.vue';
import AfHeader from './titleBar.vue';

export default {
	name: 'LoginSMS',

	components: {
		AfHeader,
		AfButton
	},
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
		loading: {
			type: Boolean,
			'default': false
		},
		countryCode: {
			type: String,
			'default': ''
		},
		backIcon: {
			type: Boolean,
			'default': true
		},
		needReset: {
			type: Boolean,
			'default': true
		},
		moduleName: {
			type: String,
			'default': 'test'
		},
		btnText: {
			type: String,
			'default': 'Complete Registration'
		},
		titleText: {
			type: String,
			'default': 'Verify Mobile Number'
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
		resetState() {
			this.isReady = false;
			this.showError = false;
		},
		handleAcccept() {
			this.isReady = !this.isReady;
		},
		handleNext() {
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
		goPrev() {
			this.resetState();

			this.$emit('back');
		},
		closePop() {
			this.resetState();

			this.$emit('closePop');
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13 && this.moduleName === 'sms') {
				this.handleNext();
			}
		}
	},
	watch: {
		needReset(val) {
			if (val) {
				this.isReady = false;
			}
		}
	},
	mounted() {
		window.addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		window.removeEventListener('keyup', e => {
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

.m-page--sms {

	.m-page-main {
		padding: 30px 95px !important;
		line-height: 33px;
		color: @dark;
		text-align: center;
	}

	.m-text-tips {
		font-size: 18px;
	}

	.m-text-main {
		margin-top: 29px;
		margin-bottom: 20px;
		font-size: 24px;
		font-weight: bold;
		line-height: 33px;
	}

	.m-page-opt{
		width: 300px;
		margin: 0 auto;
		text-align: left;

		.m-check {
			font-size: 14px;
			line-height: 33px;
		}

		.m-icon-check {
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
		}

		.m-error-tips {
			top: 29px;
		}
	}
}
</style>
