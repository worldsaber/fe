<template>
  <div class="m-cup-rulers">
  	<div class="title">Terms & Conditions</div>
	<div v-for="(item, index) in data" :key="index" :class="['term-item', {'term-item-em': index === -1 }]">
		{{item}}
	</div>
  </div>
</template>

<script>
import { showCurrency } from 'config/currencyConfig';
import termsKe from '../js/terms-ke.js';
import termsNg from '../js/terms-ng.js';
import termsGh from '../js/terms-gh.js';

const termsMap = {
	ke: termsKe,
	ng: termsNg,
	gh: termsGh,
};
export default {
	data() {
		const terms = termsMap[window.country];
		return {
			country: window.country,
			showCurrency,
			data: terms()
		};
	}
};
</script>

<style lang="less">
@import 'base/styles/variable';
.m-cup-rulers {
	width: 100%;
	padding: 30/@rem 20/@rem 50/@rem;
	box-sizing: border-box;

	letter-spacing: -0.3/@rem;
	text-align: justify;
	color: @white;
	counter-reset: index;
	.title{
		margin-bottom: 15/@rem;
		line-height: 1.5;
		text-align: center;
		font-size: 16/@rem;
		font-weight: bold;
	}

	.term-item {
		line-height: 1.2;
		margin-bottom: 5/@rem;
		font-size: 12/@rem;
		&:before {
			counter-increment: index;
			content: counter(index) ". ";
		}
	}
	.term-item-em{
		color: #ffee00;
	}
	span {
		color: #ffee00;
	}
}
</style>
