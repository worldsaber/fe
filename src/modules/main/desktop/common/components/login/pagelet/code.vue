<template lang="html">
	<div class="m-page m-page--code">
		<AfHeader
			v-if="hasHeader"
			:backIcon="backIcon"
			:title="titleText"
			@back="goPrev"
			@close="closePop"/>
		<section class="m-page-main">
			<p
				:class="[
					'm-text-tips',
					{
						'm-text--fix': pageError
					}
				]"
			>{{getShowTips}}</p>
			<div class="m-page-opt">
				<div class="m-line">
					<AfInput
						v-model="code"
						placeholder="Verification Code"
						:error="codeError || isCodeError"
						icon="delete"
						:iconClick="clearAllInput"
						@change="validatorCode"/>
					<Timer
						@timerClick="sendCode"
						:isStartTimer="isStartTimer"
						:isStopTimer="isStopTimer"
					/>
				</div>
				<p v-if="showError" class="m-error-tips">{{errorInfo.msg}}</p>
				<!-- <p class="m-text-info">You have {{remainCount}} times left to resend code.</p> -->
				<div class="m-btn-wrap">
					<AfButton
						type='primary'
						@click="goNext"
						:loading="goingNext"
						:disabled="submitStatus">{{btnText}}</AfButton>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import pageMixins from '../js/mixins';
import codeValidator from '../js/codeValidator';
import Timer from './timer.vue';

let popTips;

export default {
	name: 'LoginCode',
	mixins: [pageMixins, codeValidator],
	components: {
		Timer
	},
	props: {
		phone: {
			type: [Number, String],
			required: true
		},
		backIcon: {
			type: Boolean,
			'default': true
		},
		remainCount: {
			type: [Number, String],
			require: true
		},
		errorInfo: {
			type: Object,
			'default': null
		},
		countryCode: {
			type: String,
			'default': ''
		},
		isStartTimer: {
			type: Boolean,
			'default': false
		},
		needReset: {
			type: Boolean,
			'default': true
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
			activeBtn: '',		// button which is clicked
			isStopTimer: false,
			pageError: ''
		};
	},
	computed: {
		/*
		could the next button be clicked
		 */
		submitStatus() {
			return !this.isCodeReady;
		},
		/*
		show error message which not dialoging
		 */
		showError() {
			const err = this.errorInfo || {};
			return err.type && !['dialog', 'content'].includes(err.type);
		},
		goingNext() {
			return this.loading && this.activeBtn === 'next';
		},
		isCodeError() {
			const errorInfo = this.errorInfo || {};
			return errorInfo.isCodeError || false;
		},
		getShowTips() {
			const pageError = this.pageError || '';

			if (pageError) {
				return pageError;
			}

			return `We’ve sent you a 6-digit code to ${this.countryCode} ${this.phone}.`;
		}
	},
	methods: {
		resetState() {
			this.code = '';
			this.isCodeReady = false;
			this.codeError = false;
			this.isStopTimer = true;
		},
		goPrev() {
			this.resetState();

			this.$emit('back');
		},

		closePop() {
			this.resetState();
			this.$emit('closePop');
		},

		/*
		go to the next steps
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
			const pageError = this.pageError || '';
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
						bizType: 'REGISTER'
					}
				});
			}
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
		needReset(val) {
			if (val) {
				this.code = '';
			}
		},
		errorInfo(val) {
			if (val && val.type === 'content') {
				this.pageError = val.msg;
				popTips = val;
			}
		},
		phone(val, oldVal) {
			this.pageError = '';
			popTips = null;
		}
	},
	mounted() {
		const errorInfo = this.errorInfo || {};

		if (errorInfo.type === 'content') {
			this.pageError = errorInfo.msg || '';
			popTips = errorInfo;
		}

		document.querySelector('.m-page--code').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--code').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

@import '../style/input.less';
@import '../style/button.less';
@import '../style/error.less';

.m-page--code {

	.m-page-opt {
		text-align: center;
		margin-top: 50px;
		position: relative;
	}

	.m-line {
		font-size: 0;

		.m-input-wrapper,
		.m-timer {
			display: inline-block;
			vertical-align: top;
		}

		.m-input-wrapper {
			height: 40px;
			width: 210px !important;
			margin-right: 18px;
			background: @white;

			.m-input {
				height: 40px !important;
			}
		}

		.m-timer {
			width: 130px;
		}
	}

	.m-btn-wrap {
		width: 300px;
		display: inline-block;
		margin-top: 58px;
	}

	.m-error-tips {
		top: 50px;
		left: 215px;
	}

	.m-text--fix {
		padding: 0 100px;
		box-sizing: border-box;
	}
}
</style>
