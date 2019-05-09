<template lang="html">
	<div class="m-page--psdcode">
		<p class="m-text-tips">We’ve sent you a 6-digit code to {{countryCode}} {{phone}}.</p>
		<div class="m-page-opt">
			<span class="m-left">Enter code</span>
			<div class="m-mid m-opt-wrapper">
				<AfInput
					v-model="code"
					placeholder="6-digit code"
					:error="codeError || isCodeError"
					icon="delete"
					:iconClick="clearAllInput"
					@change="validatorCode"/>
				<p v-if="showError" class="m-error-tips">{{errorInfo.msg}}</p>
				<AfButton
					type="primary"
					@click="goNext"
					:loading="goingNext"
					:disabled="submitStatus">Next</AfButton>
			</div>
			<div class="m-right" v-if="replaceError">
				<p class="m-text">You’ve run out of 3 times to send code within 24h.</p>
				<p class="m-text">Didn’t get a code? Try to verify by <a class="m-text-highlight" @click="sendSms">sending text messages</a></p>
			</div>
			<div class="m-right" v-else-if="pageError">
				<p class="m-text">You’ve run out of 5 times to send code within 24h.</p>
				<p class="m-text">Didn’t get a code? Please try again tomorrow.</p>
			</div>
			<div class="m-right" v-else>
				<Timer
					:showBackground="true"
					:isStartTimer="isStartTimer"
					@timerClick="sendCode"/>
				<p class="m-text">You have {{getShowRemain}} left to resend within 24h.</p>
			</div>
		</div>
	</div>
</template>

<script>
import psdMix from '../js/psdMixins';
import codeValidator from '../js/codeValidator';
import Timer from './timer.vue';

let popTips;

export default {
	mixins: [psdMix, codeValidator],
	components: {
		Timer
	},
	props: {
		remainCount: {
			type: [Number, String],
			require: true
		},
		phone: {
			type: [Number, String],
			required: true
		},
		countryCode: {
			type: String,
			'default': ''
		},
		errorInfo: {
			type: Object,
			'default': null
		},
		isStartTimer: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			activeBtn: '',			// button which is clicked
			replaceError: false,	// replace timer with error
			isStopTimer: false,
			pageError: false
		};
	},
	computed: {
		/*
		nextButton could be clicked
		 */
		submitStatus() {
			return !this.isCodeReady;
		},
		/*
		error shown below input
		 */
		showError() {
			const err = this.errorInfo || {};
			return err.type !== undefined && !['dialog', 'replace', 'content'].includes(err.type);
		},
		goingNext() {
			return this.loading && this.activeBtn === 'next';
		},
		getShowRemain() {
			return this.remainCount + (this.remainCount > 1 ? ' times' : ' time');
		},
		isCodeError() {
			const errorInfo = this.errorInfo || {};
			return errorInfo.isCodeError || false;
		}
	},
	methods: {
		/*
		go to next module
		 */
		goNext() {
			if (this.submitStatus) {
				return;
			}

			this.activeBtn = 'next';	// next mudule

			this.$emit('submit', {
				from: 'code',
				params: {
					code: this.code
				}
			});
		},
		/*
		get code
		 */
		sendCode() {
			const pageError = this.pageError || false;

			if (pageError) {
				this.$emit('submit', {
					from: 'dialog-tips',
					params: popTips
				});
			} else {
				this.$emit('submit', {
					from: 'code-get',
					params: {
						phone: this.phone,
						bizType: 'PASSWORD_RESET'
					}
				});
			}
		},
		/*
		send sms
		 */
		sendSms() {
			this.$emit('submit', {
				from: 'go-sms'
			});
		},

		clearAllInput() {
			this.code = '';
		},

		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.goNext();
			}
		}
	},
	watch: {
		/*
		reset activeBtn's value when request done
		 */
		loading(val) {
			!val && (this.activeBtn = '');
		},
		errorInfo(val) {
			if (val && val.type === 'replace') {
				this.replaceError = true;
			}

			if (val && val.type === 'content') {
				this.pageError = true;
				popTips = val;
			}
		},
		phone(val, oldVal) {
			this.pageError = false;
			popTips = null;
		}
	},
	mounted() {
		const errorInfo = this.errorInfo || {};

		(errorInfo.type === 'replace') && (this.replaceError = true);

		if (errorInfo.type === 'content') {
			this.pageError = true;
			popTips = errorInfo;
		}

		document.querySelector('.m-page--psdcode').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--psdcode').removeEventListener('keyup', e => {
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

.m-page--psdcode {
	padding: 34px 40px 42px 70px;
	box-sizing: border-box;
	color: @dark;

	.m-text-tips {
		font-size: 20px;
		line-height: 24px;
	}

	.m-page-opt {
		padding-top: 35px;
		box-sizing: border-box;
		font-size: 0;

		.m-left, .m-mid, .m-right {
			display: inline-block;
			vertical-align: top;
		}

		.m-left {
			margin-right: 18px;
			font-size: 20px;
			line-height: 40px;
		}

		.m-mid {
			margin-right: 30px;
			width: 300px;

			.af-button {
				margin-top: 44px;
			}
		}

		.m-input-wrapper {
			width: 100%;
			height: 40px;
			background: @white;
		}

		.m-input, .af-button {
			height: 40px;
			width: 300px;
		}

		.m-input {
			border: 1px solid @fogGrayBorder;
			border-radius: 2px;
		}

		.m-right {
			max-width: 320px;
			word-wrap: break-word;
			text-align: left;

			.m-text {
				font-size: 14px;
				line-height: 24px;
				color: @darkGray;
			}

			.af-button {
				width: 128px;
				margin-bottom: 5px;
			}
		}
	}

	.m-text-highlight {
		color: @linkBlue;
		text-decoration: none;

		&:hover {
			cursor: pointer;
		}
	}
}
</style>
