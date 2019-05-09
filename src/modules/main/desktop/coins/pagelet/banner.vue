<template lang="html">
  <div class="m-banner-item">
	  <img :src="bannerInfo.bgUrl" alt="" v-if="bannerInfo.bgUrl">
	  <img src="../img/bannerDf.jpg" alt="" v-else>
	  <div class="m-infos">
		  <div class="m-t-bold m-t-coffee m-t-14" v-if="bannerInfo.title">{{bannerInfo.title}}</div>
		  <div class="m-t-bold m-t-white m-t-24 m-t-s-b" v-if="bannerInfo.promotation">{{cfg.showCurrencyOrigin}} {{bannerInfo.promotation}}</div>
		  <div class="m-t-white m-t-12 m-t-mt3">SportyCoins</div>
	  </div>
  </div>
</template>

<script>
import { showCurrencyOrigin } from 'config/currencyConfig';

export default {
	props: {
		bannerInfo: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			cfg: Object.freeze({
				showCurrencyOrigin
			})
		};
	}
};
</script>

<style lang="less" scoped>
@import '../style/banner.less';
</style>
