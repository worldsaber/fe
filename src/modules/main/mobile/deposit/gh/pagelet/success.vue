<template lang="html">
  <div class="m-dp-gh-suc">
	  <h2 class="f-title">
		  <i class="m-icon-suc"></i>
		  <span>Deposit Succeeded!</span>
	  </h2>
	  <div class="f-main">
		  <div class="f-line f-flex">
    		  <span class="i-label">Amount({{showCurrency}})</span>
    		  <div class="i-value f-flex-item">{{amount}}</div>
    	  </div>
    	  <div class="f-line f-flex">
    		  <span class="i-label">Deposit From</span>
    		  <div class="i-value f-flex-item">
    			  <div class="m-image-wrapper" v-if="dpInfo.channelIconUrl">
    			  	<img :src="dpInfo.channelIconUrl" alt="">
    			  </div>
    			  <span class="f-text">{{dpInfo.channelShowName}}</span>
    		  </div>
    	  </div>
    	  <div class="f-line f-flex">
    		  <div class="i-label">Mobile Number</div>
    		  <div class="i-value f-flex-item">{{dpInfo.counterPart}}</div>
    	  </div>
    	  <div class="f-line f-flex">
    		  <div class="i-label">Trade No.</div>
    		  <div class="i-value f-flex-item">{{tradeId}}</div>
    	  </div>
	  </div>

	  <div class="f-opt">
		  <a class="f-link" :href="transactionUrl">Check status in Transactions ></a>
		  <af-button
		  	extraType="primary"
			@click="goUrl"
			>Done</af-button>
	  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatNumber } from 'utils';
import 'packages/button';
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
// import { pagePath } from 'config/pageConfig.js';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { LS } from 'storage';

export default {
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			transactionUrl: userCenterUrl.transaction,
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
		// bet() {
		// 	window.location.href = pagePath.home;
		// },
		goUrl() {
			if (URL.getPara('source') === 'betslip') {
				LS.set('isOpenBetslip', true);
			}
			window.history.go(-1);
		}
	}
};
</script>

<style lang="less">
@import '../style/success.less';
</style>
