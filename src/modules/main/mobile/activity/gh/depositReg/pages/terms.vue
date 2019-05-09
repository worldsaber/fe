<template>
	<div class="deposit-reg-terms-wrap">
		<SportyHeader />
		<NavBar />
		<div class="deposit-terms-title">Terms and Conditions </div>
		<ol class="deposit-terms-wrap">
			<li v-for="(item, index) in terms" :key="index" class="deposit-terms-item">
				<span class="terms-index">{{index + 1}}.</span>{{item}}
			</li>
		</ol>
	</div>
</template>
<script>
import NavBar from 'components/navbar';
import SportyHeader from 'components/depositReg/header.vue';
import terms from '../data/terms.js';

export default {
	components: {
		SportyHeader,
		NavBar
	},
	data() {
		return {
			terms,
		};
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.deposit-terms-title{
	font-size: 16/@rem;
	color: #1b1e25;
	padding: 30/@rem 16/@rem 10/@rem;
}
.deposit-terms-wrap{
	margin-bottom: 60/@rem;
}
.deposit-terms-item{
	position: relative;
	font-size: 12/@rem;
	margin: 6/@rem 0;
	padding: 0 30/@rem;
	text-align: justify;
	.terms-index{
		position: absolute;
		left: 16/@rem;
	}
}
</style>
