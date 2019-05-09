<template>
	<div class="withdraw-sms-verify">
		<p class="sms-message">We can only send you a verification code 5 times within 24 hours. Please try again tomorrow.</p>
		<div class="error-msg"></div>
		<af-button class="submit" :autofocus="false" @click.prevent="submit">OK</af-button>
	</div>
</template>

<script>
import AfButton from 'packages/button';

export default {
	components: {
		AfButton
	},
	data() {
		return {

		};
	},
	methods: {
		submit() {
			this.$dialog();
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";

.withdraw-sms-verify {

	.sms-message {
		font-size: 16px;
  		line-height: 1.5;
  		text-align: left;
  		color: @dark;
	}

	.sms-code {
		margin: 20/@rem 0;
		text-align: center;
		line-height: 24px;
  		font-size: 20px;
  		font-weight: bold;
  		text-align: center;
  		color: @dark;
	}

	.m-icon-check {
		font-size: 14px;
		line-height: 16px;
		text-align: center;
		.m-icon-check();
		&:before {
			display: inline-block;
			margin-right: 6/@rem;
			font-size: 15px;
		}
	}

	.m-icon-checked {
		.m-icon-check--checked();
	}

	.error-msg {
		min-height: 12px;
		line-height: 12px;
		font-size: 10px;
		text-align: left;
		color: @red;
		margin-top: 2/@rem;
		margin-bottom: 15/@rem;
	}
	.submit {
		width: 100%;
		height: 42/@rem;
		background-color: @green;
		border: none;
		margin-bottom: 17/@rem;
	}
}

</style>
