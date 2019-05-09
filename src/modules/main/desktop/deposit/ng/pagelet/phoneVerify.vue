<template lang="html">

<div class="m-dp-pop m-pop--phone" id="j_ngPhone">
	<h3 class="f-title">
		<span>Enroll Phone</span>
		<i
			class="m-icon-close"
			data-action="close"
			data-ret="close"
		></i>
	</h3>
	<section>
		<p class="f-tips">Please enter a mobile number (at least 10 digits). <br />We'll send an OTP to this number.</p>
		<div class="f-line f-line--pos">
			<AfInput
				v-model="phone"
				placeholder="Mobile Number"
				icon="delete"
				:error="isPhoneError"
				:iconClick="clearPhone">
				<span slot="prepend" v-if="countryCode">{{countryCode}}</span>
			</AfInput>
			<div class="f-error" v-if="isPhoneError">
				<p>{{phoneError}}</p>
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
			phone: '',
			countryCode: window.countryCode ? `+${window.countryCode}` : '',
			phoneError: '',
			errorInfo: {}
		};
	},
	computed: {
		isPhoneError() {
			return !!this.phoneError || false;
		},
		submitStatus() {
			return this.phone && !this.isPhoneError;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Continue';
		}
	},
	watch: {
		phone(val) {
			this.phone = val.replace(/[^0-9]/g, '');
			this.phoneError = '';
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

			if (this.phone.length < 10) {
				this.phoneError = 'Please enter at least 10 digit number.';
				return;
			}

			this.loading = true;
			const inputDom = document.querySelector('#j_ngPhone .m-input');
			inputDom && inputDom.blur();

			this.tradeAddtional({
				reservedPhone: this.phone
			});
		},
		clearPhone() {
			this.phone = '';
			this.phoneError = '';
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngPhone').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngPhone').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};

</script>

<style lang="less">
@import '../style/popDialog.less';

.m-pop--phone {

	.f-line:first-of-type {
		margin-top: 10px;
	}
}
</style>
