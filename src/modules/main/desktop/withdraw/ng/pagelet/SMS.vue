<template lang="html">
	<div class="m-wd-pop m-pop--sms" id="j_ngToken">
		<h3 class="f-title">
			<span>Verify Identity</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</h3>
		<section>
			<!-- <p class="f-tips">Please send an SMS to {{smsNumber}} from {{countryCode}} {{phone}} with <br /> the verification code below.</p>
			<div class="f-sms">{{msgContent}}</div>
			<div class="f-line f-line--pos">
				<p :class="[
					'm-icon-check',
						{
							'm-icon-checked': isReady
						}
					]"
					@click="handleAcccept"
				>I have sent the requested SMS</p>
				<div class="f-error" v-if="showError">
					<p>The checkbox above should be checked</p>
				</div>
			</div>
			<div class="f-line f-line--opt">
				<af-button
					extraType="primary"
					@click="submit"
					:class="{
						'is-disabled': !isReady
					}"
					:loading="loading"
				>{{subText}}</af-button>
			</div> -->
			<p class="f-tips">We can only send you a verification code {{msgThreshold}} times <br />within 24 hours. Please try again tomorrow.</p>
			<div class="f-line f-line--opt">
				<af-button
					extraType="primary"
					data-action="close"
					data-ret="close"
				>OK</af-button>
			</div>
		</section>
	</div>
</template>

<script>
import {
	// mapActions,
	mapState,
	// mapMutations
} from 'vuex';
// import {
// 	AfInput
// } from 'packages/input';
import 'packages/button';
// import pageMixin from '../js/pageMixin';

export default {
	// mixins: [pageMixin],
	// data() {
	// 	return {
	// 		showError: false,
	// 		isReady: false
	// 	};
	// },
	computed: {
		...mapState('codeVerify', [
	// 		'countryCode',
	// 		'msgContent',
	// 		'smsNumber',
			'msgThreshold'
		]),
	// 	...mapState('userCenter', [
	// 		'phone'
	// 	]),
	// 	...mapState('withdraw', [
	// 		'verfiyInfo'
	// 	]),
	// 	subText() {
	// 		return this.loading ? 'Loading...' : 'Complete Withdrawal';
	// 	}
	},
	// watch: {
	// 	isReady(val) {
	// 		if (val) {
	// 			this.showError = false;
	// 		}
	// 	}
	// },
	// methods: {
	// 	...mapActions('withdraw', [
	// 		'tradeAddtional'
	// 	]),
	// 	handleAcccept() {
	// 		this.isReady = !this.isReady;
	// 	},
	// 	submit() {
	// 		if (!this.isReady) {
	// 			this.showError = true;
	// 			return;
	// 		}
	//
	// 		if (this.loading) {
	// 			return;
	// 		}
	//
	// 		this.loading = true;
	// 		this.tradeAddtional({
	// 			sms: this.msgContent
	// 		});
	// 	},
	// 	handleEnterPress(event) {
	// 		if (event.keyCode && event.keyCode === 13) {
	// 			this.submit();
	// 		}
	// 	}
	// },
	// created() {
	// 	const verfiyInfo = this.verfiyInfo || {};
	//
	// 	if (verfiyInfo.sms === this.msgContent) {
	// 		this.isReady = true;
	// 	}
	// },
	// mounted() {
	// 	document.querySelector('#j_ngToken').addEventListener('keyup', e => {
	// 		this.handleEnterPress(e);
	// 	});
	// },
	// beforeDestory() {
	// 	document.querySelector('#j_ngToken').removeEventListener('keyup', e => {
	// 		this.handleEnterPress(e);
	// 	});
	// }
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import '../style/popDialog.less';

.m-pop--sms {
	padding-bottom: 25px;
	box-sizing: border-box;

	.f-tips {
		margin-top: 36px;
	}

	.f-sms {
		padding: 16px 0;
		box-sizing: border-box;
		font-size: 20px;
		line-height: 24px;
		font-weight: bold;
	}

	.m-icon-check {
		font-size: 14px;
		line-height: 16px;

		.m-icon-check();
		&:before {
			display: inline-block;
			vertical-align: middle;
			margin-right: 6px;
			font-size: 15px;
		}
	}

	.m-icon-checked {
		.m-icon-check--checked();
	}

	.f-line--opt {
		margin-top: 30px;
	}

	.f-error {
		width: 100%;
		top: 20px;
	}
}
</style>
