<template lang="html">
	<div class="m-page m-page--code" id="j_code">
		<p class="m-text-tips">We’ve sent you a 6-digit code to {{countryCode}} {{account}}.</p>
		<div class="m-page-opt">
			<span class="m-left">Enter code</span>
			<div class="m-mid m-opt-wrapper">
				<AfInput
					v-model="code"
					placeholder="Verification Code"
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
					:isStartTimer="startTimer"
					@timerClick="sendCode"/>
				<p class="m-text">You have {{getShowRemain}} left to resend within 24h.</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import AfButton from 'packages/button/button.vue';
import 'packages/input';

import * as mutationsTypes from 'store/changePsd/mutationTypes';

import codeValidator from 'components/login/js/codeValidator';
import Timer from 'components/login/pagelet/timer.vue';

import PopTips from 'components/betslips/pagelet/popTips.vue';

let popDialog = null;

let timerId;

export default {
	components: {
		AfButton,
		Timer
	},

	mixins: [codeValidator],

	data() {
		return {
			activeBtn: '',			// button which is clicked
			hasSmsTips: false,
			reqLoading: false,
			pageError: ''
		};
	},
	computed: {
		...mapState('fbLogin', [
			'remainMsgNum',
			'account',
			'countryCode',
			'errorInfo',
			'requesting',
			'msgThreshold'
		]),
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
			return this.reqLoading && this.activeBtn === 'next';
		},
		getShowRemain() {
			return this.remainMsgNum + (this.remainMsgNum > 1 ? ' times' : ' time');
		},
		startTimer() {
			return this.remainMsgNum < this.msgThreshold && this.remainMsgNum >= 0;
		},
		replaceError() {
			const err = this.errorInfo || {};

			if (!this.hasSmsTips) {
				this.hasSmsTips = err.type === 'replace';
			}

			return this.hasSmsTips;
		},
		isCodeError() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.isCodeError || false;
		}
	},
	methods: {
		...mapActions('fbLogin', [
			'getCode',
			'verifyThirdPartyCode'
		]),

		...mapMutations('fbLogin', {
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE,
			changeModule: mutationsTypes.UPDATE_NEXT_PAGE
		}),
		/*
		go to next module
		 */
		goNext() {
			if (this.submitStatus) {
				return;
			}

			this.activeBtn = 'next';	// next mudule
			this.changeReqStaue(true);
			this.verifyThirdPartyCode({
				code: this.code
			}).catch(() => {});
		},

		/*
		get code
		 */
		sendCode() {
			this.changeReqStaue(true);
			this.getCode({
				isThirdParty: true
			}).catch(() => {});
		},

		clearAllInput() {
			this.code = '';
		},

		sendSms() {
			this.changeModule('sms');
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
		requesting(val) {
			if (val) {
				this.reqLoading = val;

				timerId = setTimeout(() => {
					this.reqLoading = this.requesting;
					clearTimeout(timerId);
					timerId = null;
					this.activeBtn = '';
				}, 500);
			} else if (!timerId) {
				this.reqLoading = this.requesting;
				this.activeBtn = '';
			}
		},

		errorInfo(val, oldVal) {
			if (val) {
				const errorType = val.type || '';

				if (errorType === 'dialog') {
					this.$dialog();
					popDialog = this.$dialog({
						title: null,
						contentData: {
							title: val.title || '',
							msg: val.msg
						},
						content: PopTips,
						button: []
					}).onBtnClick(() => {
						popDialog && popDialog.close();
						popDialog = null;
						if (val.moduleName) {
							this.changeModule(val.moduleName);
						}
						return false;
					});
				}

				if (errorType === 'content') {
					this.pageError = val.msg;
				}
			}
		},
		account(val, oldVal) {
			this.pageError = '';
		}
	},
	mounted() {
		const errorInfo = this.errorInfo || {};

		if (errorInfo.type === 'content') {
			this.pageError = errorInfo.msg;
		}

		document.querySelector('#j_code').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_code').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>
