<template lang="html">
	<div class="m-dp-pop m-pop--token" id="j_ngToken">
		<h3 class="f-title">
			<span>One Time Setup</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</h3>
		<section>
			<p class="f-tips">Please enter the token sent to your phone.</p>
			<div class="f-line f-line--pos">
				<AfInput
					v-model="token"
					placeholder="Enter Token"
					icon="delete"
					:error="isTokenError"
					:iconClick="clearToken">
				</AfInput>
			<div class="f-error" v-if="isTokenError">
				<p>{{tokenError}}</p>
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
			token: '',
			tokenError: ''
		};
	},
	computed: {
		isTokenError() {
			return !!this.tokenError || false;
		},
		submitStatus() {
			return this.token && !this.isTokenError;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Continue';
		}
	},
	watch: {
		token(val) {
			const temp = val.replace(/\D/g, '');
			this.token = temp;
			this.tokenError = '';
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
			const inputDom = document.querySelector('#j_ngToken .m-input');
			inputDom && inputDom.blur();

			this.tradeAddtional({
				otp: this.token
			});
		},
		clearToken() {
			this.token = '';
			this.tokenError = '';
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngToken').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngToken').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import '../style/popDialog.less';

.m-pop--token {
	.f-line:first-of-type {
		margin-top: 10px;
	}
}
</style>
