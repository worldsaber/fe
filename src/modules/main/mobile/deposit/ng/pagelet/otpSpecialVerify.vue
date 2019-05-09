<template>
	<form class="deposit-otp-verify">
		<p class="otp-message">{{displayMsg}}</p>
		<af-input
			class="otp"
			v-model="otp"
			placeholder="Enter OTP"
			icon="delete"
			:iconClick="clearOtp"
			@change="handleChange">
		</af-input>
		<div class="error-msg">{{errText}}</div>
		<af-button
			class="submit"
			:autofocus="false"
			@click.prevent="submit"
			:disabled="submitDisabled"
			:loading="submitLoading"
			:error="submitErr">
			{{submitLoading ? 'Loading...' : 'Continue'}}
		</af-button>
	</form>
</template>

<script>
import AfButton from 'packages/button';
import { AfInput } from 'components/input';
import verifyMixins from '../js/verifyMixins';

export default {
	props: {
		tradeId: {
			type: [Number, String],
			'default': ''
		},
		verifyType: {
			type: Number,
			required: true
		},
		status: {
			type: [Number, String],
			'default': ''
		}
	},
	components: {
		AfInput,
		AfButton
	},
	mixins: [
		verifyMixins
	],
	data() {
		return {
			otp: ''
		};
	},
	methods: {
		clearOtp() {
			this.otp = '';
			this.resetError();
		},
		handleChange (data) {
			this.otp = data.value.trim();
		},
		submit() {
			const { tradeId, verifyType, otp, status } = this;
			this.getTradeAdditional({
				params: {
					tradeId,
					otp,
					type: verifyType
				},
				currentStatus: status
			});
		}
	},
	computed: {
		submitDisabled() {
			return this.otp === '' || this.submitErr;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";

.deposit-otp-verify {
	.otp-message {
		font-size: 16/@rem;
		line-height: 1.5;
		text-align: left;
		color: @dark;
	}
	.otp {
		margin-top: 16/@rem;
		width: 100%;
		&.m-input-wap-wrapper {
			.m-input-wap {
				height: 44/@rem;
			}
		}
	}
	.error-msg {
		min-height: 12px;
		line-height: 12px;
		font-size: 10px;
		text-align: left;
		color: @red;
		margin-top: 2/@rem;
		margin-bottom: 12/@rem;
	}
	.submit {
		width: 100%;
		height: 42/@rem;
		margin-bottom: 18/@rem;
		background-color: @green;
		text-align: center;
		border: none;
	}

	.m-input-wap-wrapper {
		&--active {
			border: 1px solid @green;
		}
	}
}

</style>
