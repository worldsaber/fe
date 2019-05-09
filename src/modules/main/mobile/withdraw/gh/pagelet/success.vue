<template lang="html">
  <div class="m-wd-gh-suc">
	  <h2 :class="[
	  	'f-title',
		{
			'f-title-fix': needAudit
		}
	  ]">
 		 <i class="m-icon-suc"></i>
		 <div class="m-title">{{getShowTitle}}</div>
		 <p class="m-tips" v-if="needAudit">Manual process (Result in 3 working days)</p>
 	 </h2>
	  <div class="f-main">
		  <div class="f-line f-flex">
    		  <span class="i-label">Amount({{showCurrency}})</span>
    		  <div class="i-value f-flex-item">{{amount}}</div>
    	  </div>
    	  <div class="f-line f-flex">
    		  <span class="i-label">Withdraw To</span>
    		  <div class="i-value f-flex-item">
    			  <div class="m-image-wrapper" v-if="wdInfo.channelIconUrl">
    			  	<img :src="wdInfo.channelIconUrl" alt="">
    			  </div>
    			  <span class="f-text">{{wdInfo.channelShowName}}</span>
    		  </div>
    	  </div>
    	  <!-- <div class="f-line f-flex f-line-fixed">
    		  <div class="i-label">Mobile Owner Full Name</div>
    		  <div class="i-value f-flex-item">{{showName}}</div>
    	  </div> -->
		  <div class="f-line f-flex">
    		  <div class="i-label">Mobile Number</div>
    		  <div class="i-value f-flex-item">{{showPhone}}</div>
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
			@click="bet"
			>Continue Betting</af-button>
	  </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { formatNumber } from 'utils';
import 'packages/button';
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import { pagePath } from 'config/pageConfig.js';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { /* formatName, */modifyPhone } from '../js/commonFun';

export default {
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			transactionUrl: userCenterUrl.transaction,
		};
	},
	computed: {
		...mapState('withdraw', [
			'wdInfo',
			'tradeId',
			'needAudit'
		]),
		amount() {
			let temp = this.wdInfo || {};

			temp = temp.payAmount || 0;
			return formatNumber(temp, 2);
		},
		getShowTitle() {
			if (this.needAudit) {
				return 'Submission Succeeded!';
			}

			return 'Withdrawal Succeeded!';
		},
		// showName() {
		// 	let temp = this.wdInfo || {};
		//
		// 	temp = temp.name || '';
		// 	return formatName(temp);
		// },
		showPhone() {
			return modifyPhone();
		}
	},
	methods: {
		...mapActions('assetsInfo', [
			'fetchAcountInfo'
		]),
		bet() {
			window.location.href = pagePath.home;
		}
	},
	created() {
		this.fetchAcountInfo();
	}
};
</script>

<style lang="less">
@import '../style/success.less';
</style>
