<template lang="html">
  <div>
  	<img src="../img/suc.svg" alt="" />
	<div class="m-txt-main">{{showCurrency}}{{getShowVal}}</div>
	<div class="m-txt-min">{{contentData.isPartial ? 'Partial ' : ''}}Cashout Succeeded !</div>
	<div class="m-txt-desc" v-if="contentData.isPartial">{{getTips}}</div>
  </div>
</template>

<script>
import { showCurrency } from 'config/currencyConfig';

export default {
	data() {
		return {
			showCurrency
		};
	},
	computed: {
		getTips() {
			const contentData = this.contentData || {},
				isPartial = contentData.isPartial || false,
				count = contentData.remainCount || 0;

			if (isPartial) {
				return `${count} ${count <= 1 ? 'chance' : 'chances'} left to do Partial Cashout`;
			}

			return '';
		},
		getShowVal() {
			const contentData = this.contentData || {};
			let val = contentData.val;

			val = +val;

			return val.toFixed(2);
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
.m-openBet--suc.es-dialog {
	.es-dialog-main {
		margin-top: 8/@rem;
		padding: 0 20/@rem;
    	box-sizing: border-box;

		text-align: center;

		>img {
			width: 40/@rem;
			height: 40/@rem;
		}

		.m-txt-main {
			margin-top: 22/@rem;
			line-height: 20/@rem;
			font-size: 22/@rem;
			font-weight: bold;
			color: @dark;
		}

		.m-txt-min {
			margin-top: 14/@rem;
			line-height: 1;
			font-size: 18/@rem;
			color: @dark;
		}

		.m-txt-desc {
			margin-top: 8/@rem;
			line-height: 1;
			font-size: 14/@rem;
			color: @darkGray;
		}
	}
}
</style>
