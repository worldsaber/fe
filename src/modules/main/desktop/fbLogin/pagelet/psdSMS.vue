<template lang="html">
	<div class="m-page m-page--sms" id="j_sms">
		<p class="m-text-tips">Please send an SMS to {{smsNumber}} from {{countryCode}} {{account}} with the verification code below</p>
		<p class="m-text-main">{{msgContent}}</p>
		<div class="m-page-opt">
			<p :class="['m-icon-check', {'m-icon-checked': isReady}]"  @click="handleAcccept">I have sent the requested SMS</p>
			<p v-show="showError" class="m-error-tips">The checkbox above should be checked</p>
			<div class="m-btn-wrap">
				<AfButton
					type='primary'
					:loading="reqLoading"
					:disabled="submitStatus"
					@click="goNext"
					>Continue</AfButton>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import AfButton from 'packages/button/button.vue';

import * as mutationsTypes from 'store/changePsd/mutationTypes';

import psdMix from 'components/login/js/psdMixins';

import PopTips from 'components/betslips/pagelet/popTips.vue';

let popDialog = null;

let timerId;

export default {
	mixins: [psdMix],

	components: {
		AfButton
	},

	data() {
		return {
			isReady: false,
			showError: false,
			reqLoading: false
		};
	},

	computed: {
		...mapState('fbLogin', [
			'account',
			'smsNumber',
			'msgContent',
			'countryCode',
			'errorInfo',
			'requesting'
		]),
		submitStatus() {
			return !this.isReady;
		}
	},
	watch: {
		requesting(val) {
			if (val) {
				this.reqLoading = val;

				timerId = setTimeout(() => {
					this.reqLoading = this.requesting;
					clearTimeout(timerId);
					timerId = null;
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
			}
		}
	},
	methods: {
		...mapActions('fbLogin', [
			'verifyThirdPartySms'
		]),
		...mapMutations('fbLogin', {
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE,
			changeModule: mutationsTypes.UPDATE_NEXT_PAGE
		}),
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

			this.changeReqStaue(true);
			this.verifyThirdPartySms({
				phone: this.account
			}).catch(() => {});
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
		document.querySelector('#j_sms').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_sms').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>
