<template lang="html">
	<div class="m-dp-pop m-pop--pin" id="j_ngPin">
		<h3 class="f-title">
			<span>Enter Card PIN</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</h3>
		<section>
			<p class="f-tips">To confirm that you are the owner of this card,<br />please enter your card PIN.</p>
			<div class="f-line f-line--pos">
				<AfInput
					v-model="pin"
					type="password"
					placeholder="Enter PIN"
					:toggleShowText="false"
					:initTextIconValue="true"
					icon="delete"
					:error="isPinError"
					:canPaste="false"
					:iconClick="clearPin">
				</AfInput>
				<div class="f-error" v-if="isPinError">
					<p>{{pinError}}</p>
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
			pin: '',
			pinError: ''
		};
	},
	computed: {
		isPinError() {
			return !!this.pinError || false;
		},
		submitStatus() {
			return this.pin && !this.isPinError;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Continue';
		}
	},
	watch: {
		pin(val) {
			// 18/3/19 修正pin只能输入数字
			const temp = val.replace(/[^0-9]/g, '');
			this.pin = temp;

			this.pinError = '';
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
			const inputDom = document.querySelector('#j_ngPin .m-input');
			inputDom && inputDom.blur();

			this.tradeAddtional({
				pin: this.pin
			});
		},
		clearPin() {
			this.pin = '';
			this.pinError = '';
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngPin').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngPin').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import '../style/popDialog.less';

.m-pop--pin {
	.f-line:first-of-type {
		margin-top: 10px;
	}
}
</style>
