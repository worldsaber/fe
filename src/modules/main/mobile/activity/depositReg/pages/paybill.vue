<template>
	<div class="deposit-reg-paybill-wrap">
		<SportyHeader />
		<NavBar />
		<div class="deposit-paybill-content">
			<div class="deposit-reg-paybill">
				<p class="paybill-title">Paybill Number</p>
				<img src="../images/mpesa@2x.png" class="paybill-logo" />
				<p class="paybill-number">29123</p>
			</div>
			<div class="deposit-paybill-tip">After depositing through Paybill, kindly go to SportyBet website. Go to [Gifts] in [Account] and find your Discount Gifts in there!</div>
			<a class="deposit-paybill-go" :href="homeUrl">Go To SportyBet Website</a>
			<p class="deposit-list-title">Step Guide</p>
			<div class="paybill-list-wrap">
				<p class="paybill-item-text" v-for="(text, index) in paybills" :key="index">{{text}}</p>
			</div>
		</div>
		<SportyFooter :link="{name: 'terms'}"/>
	</div>
</template>
<script>
import NavBar from 'components/navbar';
import SportyHeader from 'components/depositReg/header.vue';
import SportyFooter from 'components/depositReg/footer.vue';
import { pagePath } from 'config/pageConfig';
import paybillItems from '../data/paybill.js';

export default {
	components: {
		SportyHeader,
		SportyFooter,
		NavBar,
	},
	data() {
		return {
			paybills: paybillItems,
			homeUrl: pagePath.home
		};
	}

};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.deposit-paybill-content{
	padding: 20/@rem;
	color: #353a45;
}
.deposit-reg-paybill{
	text-align: center;
	.paybill-title{
		font-size: 14/@rem;
	}
	.paybill-logo{
		.m-icon-mpesa();
		margin: 8/@rem 0;
	}
	.paybill-number{
		font-size: 20/@rem;
		font-weight: bold;
	}

}
.deposit-paybill-tip{
	font-size: 16/@rem;
	margin-top: 30/@rem;
}
.deposit-paybill-go{
	display: block;
	height: 48/@rem;
	line-height: 48/@rem;
	margin: 12/@rem 0 30/@rem;
	font-size: 16/@rem;
	font-weight: bold;
	border-radius: 2/@rem;
	cursor: pointer;
	text-align: center;
	color: #FFF;
	background-color: #0d9737;
}
.deposit-list-title{
	font-size: 14/@rem;
	margin-bottom: 5/@rem;
}
.paybill-item-text{
	font-size: 12/@rem;
	line-height: 1.5;
}

</style>
