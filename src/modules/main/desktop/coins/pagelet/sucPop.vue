<template lang="html">
  <div class="m-coins--suc">
  	<h4 class="m-title">Congratulations!</h4>
	<div class="m-main">
		<div class="m-money">{{cfg.showCurrencyOrigin}} {{contentData.showVal}}</div>
		<div class="m-desc">SportyCoins</div>
		<div class="m-infos">{{contentData.msg}}</div>

		<button
			type="button"
			class="m-icon-close"
			data-action="close"
			data-ret="close">OK</button>
	</div>
  </div>
</template>

<script>
import { showCurrencyOrigin } from 'config/currencyConfig';

export default {
	data() {
		return {
			cfg: Object.freeze({
				showCurrencyOrigin
			})
		};
	}
};
</script>

<style lang="less">
@import '../style/popSuc.less';
</style>
