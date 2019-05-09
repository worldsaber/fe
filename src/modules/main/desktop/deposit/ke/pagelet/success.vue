<template>
		<div class="m-fm-sucwrap">
			<h2>Deposit Succeeded !</h2>
			<dl class="m-fm-row">
				<dt class="m-fm-left">Amount({{showCurrencyOrigin}})</dt>
				<dd class="m-fm-right"><strong>{{succData.amount}}</strong></dd>
			</dl>
			<dl class="m-fm-row">
				<dt class="m-fm-left">Deposit From</dt>
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
			<a class="m-fm-link" :href="transactionUrl">Check status in Transactions ></a>
		</div>
</template>

<script>
import { userCenterUrl } from 'config/order/userCenterConfig';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';

import { pagePath } from 'config/pageConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';

export default {
	name: 'depositSuccess',
	components: {
		AfButton,
		AfInput
	},
	data () {
		return {
			transactionUrl: userCenterUrl[5],
			showCurrencyOrigin
		};
	},
	props: {
		succData: {}
	},
	methods: {
		goUrl () {
			window.location.href = pagePath.home;
		}
	}
};
</script>
<style>
.m-fm-sucwrap{
	padding:80px 0 0 249px;
}
</style>
