<template lang="html">
  <div class="m-dp-gh-suc">
	  <h2 class="f-title">
		  <i class="m-icon-suc"></i>
		  <span>Deposit Succeeded!</span>
	  </h2>
	  <div class="f-line">
		  <span class="i-label">Amount({{showCurrency}})</span>
		  <div class="i-value">{{amount}}</div>
	  </div>
	  <div class="f-line">
		  <span class="i-label">Deposit From</span>
		  <div class="i-value">
			  <div class="m-image-wrapper" v-if="dpInfo.channelIconUrl">
				<img :src="dpInfo.channelIconUrl" alt="">
			  </div>
			  <span class="f-text">{{dpInfo.channelShowName}}</span>
		  </div>
	  </div>
	  <div class="f-line">
		  <div class="i-label">Mobile Number</div>
		  <div class="i-value">{{dpInfo.counterPart}}</div>
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

			temp = temp.payAmount || 0;
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
