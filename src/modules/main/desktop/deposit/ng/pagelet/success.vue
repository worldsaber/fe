<template lang="html">
  <div class="m-dp-suc">
	  <h2 class="f-title"><i class="m-icon-suc"></i>Deposit Succeeded!</h2>
	  <div class="f-line">
		  <span class="i-label">Amount({{showCurrency}})</span>
		  <div class="i-value">{{amount}}</div>
	  </div>
	  <div class="f-line">
		  <span class="i-label">Payment Info</span>
		  <div class="i-value">
			  <div class="m-image-wrapper" v-if="dpInfo.counterIconUrl">
			  	<img :src="dpInfo.counterIconUrl" alt="">
			  </div>
			  <span class="f-text">{{dpInfo.counterAuthority}}</span>
			  <span class="f-text">{{dpInfo.counterPart}}</span>
		  </div>
	  </div>
	  <div class="f-line">
		  <div class="i-label">Trade No.</div>
		  <div class="i-value">{{tradeId}}</div>
	  </div>
	  <div class="f-line f-line--opt">
		  <af-button
		  	extraType="primary"
			@click="bet"
			>Continue Betting</af-button>
	  </div>
	  <a class="f-link" :href="transactionUrl">Check status in Transactions ></a>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatNumber } from 'utils';
import 'packages/button';
import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/order/userCenterConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';

export default {
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			transactionUrl: userCenterUrl[5],
		};
	},
	computed: {
		...mapState('deposit', [
			'dpInfo',
			'tradeId',
		]),
		amount() {
			let temp = this.dpInfo || {};

			temp = temp.amount || 0;
			return formatNumber(temp, 2);
		}
	},
	methods: {
		bet() {
			window.location.href = pagePath.home;
		}
	}
};
</script>

<style lang="less">
@import '../style/success.less';
</style>
