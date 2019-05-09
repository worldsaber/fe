<template lang="html">
	<div class="m-page m-page--phone" id="j_phone">
		<p class="m-text-tips m-icon-tips">Adding your mobile number helps you easily deposit / withdraw your money</p>
		<div class="m-page-opt">
			<div class="m-label">
				<span class="m-text-label">Mobile Number</span>
			</div>
			<div class="m-opt-wrapper">
				<AfInput
					v-model="phone"
					icon="delete"
					:error="phoneError || isPhoneError"
					@change="validatorPhone"
					:iconClick="clearAllInput">
					<span slot="prepend">{{countryCode}}</span>
				</AfInput>
				<p v-if="showError" class="m-error-tips">{{tips}}</p>
				<div class="m-btn-wrap">
					<AfButton
						type='primary'
						:disabled="submitStatus"
						:loading="requesting"
						@click="goNext"
						>Next</AfButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import AfButton from 'packages/button/button.vue';
import 'packages/input';

import { fixPhone } from 'base/js/utils';

import * as mutationsTypes from 'store/changePsd/mutationTypes';

import phoneValidator from 'components/login/js/phoneValidator';

import PopTips from 'components/betslips/pagelet/popTips.vue';

let popDialog = null;

export default {
	name: 'LoginHome',

	components: {
		AfButton
	},

	mixins: [phoneValidator],

	computed: {
		...mapState('fbLogin', [
			'requesting',
			'errorInfo'
		]),
		submitStatus() {
			return !this.isPhoneReady;
		},
		showError() {
			const err = this.errorInfo || {};
			return err.type === 'error' || err.type === '';
		},
		tips() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.msg || '';
		},
		isPhoneError() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.isPhoneError || false;
		}
	},
	methods: {
		...mapActions('fbLogin', [
			'verifyPhone'
		]),
		...mapMutations('fbLogin', {
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE,
		}),
		clearAllInput() {
			this.phone = '';
		},
		goNext() {
			if (this.submitStatus) {
				return;
			}

			const phone = this.phone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}

			this.changeReqStaue(true);
			this.verifyPhone({
				phone: this.phone
			}).catch(() => {});
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.goNext();
			}
		}
	},
	watch: {
		errorInfo(val, oldVal) {
			if (val) {
				const errorType = val.type || '';

				(errorType !== 'dialog') && (this.phoneError = true);

				if (errorType === 'dialog') {
					this.$dialog();
					popDialog = this.$dialog({
						title: null,
						contentData: {
							title: '',
							msg: val.msg
						},
						content: PopTips,
						button: []
					}).onBtnClick(() => {
						popDialog && popDialog.close();
						popDialog = null;
						return false;
					});
				}
			} else {
				this.phoneError = false;
			}
		}
	},
	mounted() {
		document.querySelector('#j_phone').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_phone').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>
