<template>
		<div class="m-fm-sucwrap">
			<em class="m-icon-success"></em>
			<template v-if="succData.isSubmitSuccess">
				<h2 style="margin-bottom:0">Submission Succeeded !</h2>
				<p class="m-suc-reason">Manual process <br>Result in 3 working days</p>
			</template>
			<h2 v-else>Withdrawal Succeeded !</h2>
			<div class="m-fm-suc-cont">
				<dl class="m-fm-row">
					<dt class="m-fm-left">Amount({{showCurrencyOrigin}})</dt>
					<dd class="m-fm-right">{{succData.amount}}</dd>
				</dl>
				<dl class="m-fm-row">
					<dt class="m-fm-left">Additional Fee</dt>
					<dd class="m-fm-right">{{showFee}}</dd>
				</dl>
				<dl class="m-fm-row">
					<dt class="m-fm-left">Withdraw To</dt>
					<dd class="m-fm-right">M-PESA (****{{succData.mobile && succData.mobile.slice(-4)}})</dd>
				</dl>
				<dl class="m-fm-row">
					<dt class="m-fm-left">Trade No.</dt>
					<dd class="m-fm-right m-fm-tradeTxt">{{succData.tradeId}}</dd>
				</dl>
			</div>
			<p class="m-fm-lwrap">
				<a class="m-fm-link" :href="transactionUrl">Check status in Transactions ></a>
			</p>
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
import AfButton from 'packages/button/button.vue';
import { pagePath } from 'config/pageConfig';
import { AfInput } from 'packages/input';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { showFee } from '../js/config';

export default {
	components: {
		AfButton,
		AfInput
	},
	props: {
		succData: {}
	},
	data () {
		return {
			transactionUrl: userCenterUrl.transaction,
			showCurrencyOrigin,
			showFee
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
@import 'base/styles/variable.less';

.m-suc-reason{
	text-align: center;
	font-size:16/@rem;
	color: @green;
	margin: 12/@rem auto 18/@rem;
}
</style>
