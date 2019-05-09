<template lang="html">
	<div class="m-wd-pop m-pop--token" id="j_ngToken">
		<h3 class="f-title">
			<span>Verify Identity</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</h3>
		<section>
			<p class="f-tips">We've sent you a 6-digit code to {{countryCode}} {{phone}}.</p>
			<div class="f-line f-line--pos">
				<AfInput
					v-model="token"
					placeholder="Verification Code"
					icon="delete"
					:error="isTokenError"
					:iconClick="clearToken">
				</AfInput>
				<div class="f-timer">
					<span
						v-if="!codeLoading"
						:class="{
							'f-btn': !timer,
							'f-text': timer
						}"
						@click.prevent="handleSendCode"
					>{{getCodeText}}</span>
					<i v-else class="m-icon-loading"></i>
				</div>

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
	mapActions,
	mapState,
	mapMutations
} from 'vuex';
import 'packages/input';
import 'packages/button';
import * as wdMutationsTypes from 'store/withdraw/ng/mutationTypes';
import pageMixin from '../js/pageMixin';

export default {
	mixins: [pageMixin],
	data() {
		return {
			token: '',
			tokenError: '',

			timer: 60,
			timerId: null,

			clickBtn: '',

			// loading
			codeLoading: false,
		};
	},
	computed: {
		...mapState('codeVerify', [
			'countryCode'
		]),
		...mapState('userCenter', [
			'phone'
		]),
		...mapState('withdraw', {
			verfiyErrorInfo: 'errorInfo'
		}),
		isTokenError() {
			return !!this.tokenError || false;
		},
		submitStatus() {
			return this.token && !this.isTokenError;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Complete Withdrawal';
		},
		getCodeText() {
			const timer = this.timer;
			if (timer) {
				return `Send Again (${timer}${timer === 1 ? '' : 's'})`;
			}

			return 'Send Again';
		},
	},
	watch: {
		token(val) {
			const temp = val.replace(/\D/g, '');
			this.token = temp.length > 6 ? temp.slice(0, 6) : temp;

			this.tokenError = '';
		},
		verfiyErrorInfo(val) {
			const { isCodeError = false, msg = '' } = val || {};

			if (isCodeError) {
				this.tokenError = msg;
			}
		}
	},
	methods: {
		...mapActions('codeVerify', [
			'getCode'
		]),
		...mapActions('withdraw', [
			'tradeAddtional'
		]),
		...mapMutations('withdraw', {
			chgVerifyType: wdMutationsTypes.UPDATEVERIFYTYPE
		}),
		startTimer() {
			clearTimeout(this.timerId);
			if (this.timer === 0) {
				return;
			}
			this.timerId = setTimeout(() => {
				this.timer -= 1;
				this.startTimer();
			}, 1000);
		},
		handleSendCode() {
			if (this.codeLoading || this.timer !== 0) {
				return;
			}

			this.codeLoading = true;
			this.getCode({
				phone: this.phone,
				bizType: 'WITHDRAW_CONFIRM'
			}).then(() => {
				this.codeLoading = false;
				this.timer = 60;
				this.startTimer();
			}, () => {
				this.codeLoading = false;
			}).catch(() => {});
		},
		submit() {
			if (!this.submitStatus || this.loading) {
				return;
			}

			this.loading = true;
			const inputDom = document.querySelector('#j_ngToken .m-input');
			inputDom && inputDom.blur();
			this.tradeAddtional({
				sms: this.token
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

		this.timer && (this.startTimer());
	},
	beforeDestory() {
		document.querySelector('#j_ngToken').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/refreshAnimation.less';
@import 'base/style/icon.less';
@import '../style/popDialog.less';

.m-pop--token {
	padding-bottom: 35px;
	box-sizing: border-box;

	.f-line {
		text-align: left;
		padding-left: 140px;
		box-sizing: border-box;
	}

	.f-timer {
		display: inline-block;
		vertical-align: middle;
		margin-left: 12px;

		.f-text {
			line-height: 14px;
			font-size: 12px;
			color: @linkBlue;
		}

		.f-btn {
			height: 34px;
			width: 85px;
			display: inline-block;
			line-height: 34px;
			text-align: center;
			border-radius: 2px;
			background: @white;
			color: @green;
			border: 1px solid @green !important;
			font-weight: 600;
			cursor: pointer;

			&:hover {
				color: @midGreen;
				border-color: @midGreen !important;
			}

			&:active {
				color: @lightGreen;
				border-color: @lightGreen !important;
			}
		}
	}

	.m-input-wrapper {
		vertical-align: middle;
	}

	.f-line--opt {
		margin-top: 30px;
	}

	.f-tips {
		margin: 46px 0 30px;
	}

	.f-error {
		margin-left: -140px;
		width: 100%;
		text-align: center;
	}

	.m-icon-loading {

		.m-icon-loading();
		&:before {
			display: inline-block;
			animation: rotating 2s linear infinite;
		}
	}
}
</style>
