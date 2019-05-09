<template lang="html">
  <div class="m-wd-suc">
	  <h2 :class="[
		  'f-title',
		  {
			  'f-title-fix': needAudit
		  }
	  ]">
		  <i class="m-icon-suc"></i>
		  <div class="f-title-con">
			  <span>{{getShowTitle}}</span>
    		  <span class="f-tips" v-if="needAudit">Manual process (Result in 3 working days)</span>
		  </div>
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
		 <!-- <div class="f-line f-flex">
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
import { /* formatName, */modifyPhone } from '../js/commonFun';

export default {
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			transactionUrl: userCenterUrl[5],
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
		bet() {
			window.location.href = pagePath.home;
		}
	}
};
</script>

<style lang="less">
@import '../style/success.less';
</style>
