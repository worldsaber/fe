<template lang="html">
	<div class="m-dp-pop m-pop--otp" id="j_ngOtp">
		<h3 class="f-title">
			<span>Authorization Required</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</h3>
		<section>
			<p class="f-tips">Please enter OTP.</p>
			<div class="f-line f-line--pos">
				<AfInput
					v-model="otp"
					placeholder="Enter OTP"
					icon="delete"
					:error="isOtpError"
					:iconClick="clearOtp">
				</AfInput>
				<div class="f-error" v-if="isOtpError">
					<p>{{otpError}}</p>
				</div>
			</div>
			<div class="f-line f-line--opt">
				<af-button
					extraType="primary"
					@click="submit"
					:disabled="!submitStatus"
					:loading="loading"
				>{{subText}}</af-button>
			</div>
		</section>
	</div>
</template>

<script>
import {
	mapActions
} from 'vuex';
import 'packages/input';
import 'packages/button';

import pageMixin from '../js/pageMixin';

export default {
	mixins: [pageMixin],
	data() {
		return {
			otp: '',
			otpError: ''
		};
	},
	computed: {
		isOtpError() {
			return !!this.otpError || false;
		},
		submitStatus() {
			return this.otp && !this.isOtpError;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Continue';
		}
	},
	watch: {
		otp(val) {
			const temp = val.replace(/[^0-9a-z]/gi, '');
			this.otp = temp;

			this.otpError = '';
		}
	},
	methods: {
		...mapActions('deposit', [
			'tradeAddtional'
		]),
		submit() {
			if (!this.submitStatus || this.loading) {
				return;
			}

			this.loading = true;
			const inputDom = document.querySelector('#j_ngOtp .m-input');
			inputDom && inputDom.blur();

			this.tradeAddtional({
				otp: this.otp
			});
		},
		clearOtp() {
			this.otp = '';
			this.otpError = '';
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngOtp').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngOtp').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import '../style/popDialog.less';

.m-pop--otp {
	.f-line:first-of-type {
		margin-top: 10px;
	}
}
</style>
