<template>
		<div class="m-fm-sucwrap">
			<em class="m-icon-success"></em>
			<h2>Deposit Succeeded !</h2>
			<div class="m-fm-suc-cont">
				<dl class="m-fm-row">
					<dt class="m-fm-left">Amount({{showCurrencyOrigin}})</dt>
					<dd class="m-fm-right">{{succData.amount}}</dd>
				</dl>
				<dl class="m-fm-row">
					<dt class="m-fm-left">Deposit From</dt>
					<dd class="m-fm-right">M-PESA (****{{succData.mobile && succData.mobile.slice(-4)}})</dd>
				</dl>
				<dl class="m-fm-row">
					<dt class="m-fm-left">Trade No.</dt>
					<dd class="m-fm-right m-fm-tradeTxt">{{succData.tradeId}}</dd>
				</dl>
			</div>
			<p class="m-fm-lwrap"><a class="m-fm-link" :href="transactionUrl">Check status in Transactions ></a></p>
			<div class="m-btn-wrap">
				<AfButton
					type="primary"
					@click="goUrl"
					>Done</AfButton>
			</div>
		</div>
</template>

<script>
import { userCenterUrl } from 'config/mycenter/dataConfig';
// import { pagePath } from 'config/pageConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';
// import depositConfig from 'config/deposit/record';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import { LS } from 'storage';

export default {
	components: {
		AfButton,
		AfInput
	},
	data () {
		return {
			transactionUrl: userCenterUrl.transaction,
			showCurrencyOrigin
		};
	},
	props: {
		succData: {}
	},
	methods: {
		goUrl () {
			if (URL.getPara('source') === 'betslip') {
				LS.set('isOpenBetslip', true);
			}
			window.history.go(-1);
			// window.location.href = depositConfig.getRecord() || pagePath.home;
		}
	}
};
</script>
