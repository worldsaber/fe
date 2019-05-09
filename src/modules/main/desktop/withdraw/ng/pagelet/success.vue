<template lang="html">
  <div class="m-dp-suc">
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
	  <div class="f-line">
		  <span class="i-label">Amount({{showCurrency}})</span>
		  <div class="i-value">{{amount}}</div>
	  </div>
	  <div class="f-line">
		  <span class="i-label">Withdraw To</span>
		  <div class="i-value">
			  <div class="m-image-wrapper" v-if="wdInfo.counterIconUrl">
			  	<img :src="wdInfo.counterIconUrl" alt="">
			  </div>
			  <span class="f-text">{{getBankName}}</span>
			  <span class="f-text">{{getBankNum}}</span>
		  </div>
	  </div>
	  <div class="f-line">
		  <div class="i-label">Account Name</div>
		  <div class="i-value">{{bankAccount}}</div>
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
		...mapState('withdraw', [
			'wdInfo',
			'tradeId',
			'needAudit',
			'bankAccount'
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
		getBankNum() {
			const wdInfo = this.wdInfo || {},
				bankNum = wdInfo.bankAccNum || '',
				counterPart = wdInfo.counterPart,
				len = bankNum.length;

			if (counterPart) {
				return counterPart;
			}

			if (bankNum.startsWith('*')) {
				return bankNum;
			}

			return len ? `****${bankNum.slice(-4)}` : '';
		},
		getBankName() {
			const wdInfo = this.wdInfo || {},
				counterAuthority = wdInfo.counterAuthority;

			if (counterAuthority) {
				return counterAuthority;
			}

			return wdInfo.bankName;
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
