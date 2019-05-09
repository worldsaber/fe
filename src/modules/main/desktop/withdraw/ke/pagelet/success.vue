<template>
		<div class="m-fm-sucwrap">
			<template v-if="succData.isSubmitSuccess">
				<h2 style="margin-bottom:0">Submission Succeeded !</h2>
				<p class="m-suc-reason">Manual process (Result in 3 working days)</p>
			</template>
			<h2 v-else>Withdrawal Succeeded !</h2>
			<dl class="m-fm-row">
				<dt class="m-fm-left">Amount({{showCurrencyOrigin}})</dt>
				<dd class="m-fm-right"><strong>{{succData.amount}}</strong></dd>
			</dl>
			<dl class="m-fm-row">
				<dt class="m-fm-left">Additional Fee</dt>
				<dd class="m-fm-right">{{succData.additionalFee}}</dd>
			</dl>
			<dl class="m-fm-row">
				<dt class="m-fm-left">Withdraw To</dt>
				<dd class="m-fm-right">M-PESA (****{{succData.mobile.slice(-4)}})</dd>
			</dl>
			<dl class="m-fm-row">
				<dt class="m-fm-left">Trade No.</dt>
				<dd class="m-fm-right">{{succData.tradeId}}</dd>
			</dl>
			<div class="m-btn-wrap" style="width:198px;margin:40px 0 16px;">
				<AfButton
							type="primary"
							@click="goUrl"
							>Continue Betting</AfButton>
			</div>
			<a class="m-fm-link" :href="transactionUrl">Check status in Transactions<i class="m-icon-aright"></i></a>
		</div>
</template>

<script>
import { userCenterUrl } from 'config/order/userCenterConfig';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';

import { pagePath } from 'config/pageConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';

// import { showFee } from '../js/config';

export default {
	components: {
		AfButton,
		AfInput
	},
	props: {
		// showCurrency: '',
		succData: {}
	},
	data () {
		return {
			transactionUrl: userCenterUrl[5],
			showCurrencyOrigin,
			// showFee
		};
	},
	methods: {
		goUrl () {
			window.location.href = pagePath.home;
		}
	}
};
</script>
<style lang="less">
@import 'base/style/variable.less';

.m-suc-reason{
	font-size:16px;
	color: @green;
	margin-bottom: 15px;
}
</style>
