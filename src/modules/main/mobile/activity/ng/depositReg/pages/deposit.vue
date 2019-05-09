<template>
	<div class="deposit-reg-home">
		<HomeDeposit @success="onRegisterSuccess"/>
		<div class="deposit-home-title">Why SportyBet </div>
		<div class="deposit-why-content">SportyBet is the leading technology-fueled sports betting company in Africa, with the best promotions and the fastest APP betting experience. Join us now, Get Sporty Bet Sporty.</div>
		<Advantage />
		<div class="deposit-home-title">SportyBet’s Partners</div>
		<img src="../images/partner.png" class="deposit-home-partner"/>
		<div class="deposit-home-title">We Love SportyBet</div>
		<Testimonials />
		<SportyFooter :link="{name: 'terms'}"/>
	</div>
</template>
<script>
import SportyHeader from 'components/depositReg/header.vue';
import SportyFooter from 'components/depositReg/footer.vue';
import Testimonials from 'components/depositReg/testimonials.vue';
import HomeDeposit from 'components/depositReg/home-deposit.vue';
import { pagePath } from 'config/pageConfig';
import Advantage from '../components/advantage.vue';

export default {
	components: {
		SportyHeader,
		SportyFooter,
		Advantage,
		Testimonials,
		HomeDeposit
	},
	methods: {
		onRegisterSuccess(payload) {
			// 调整链接
			const amount = payload.amount;
			const depositUrl = `${pagePath.myCenter}/deposit?source=fbad${amount ? `&amount=${amount}` : ''}`;
			location.href = depositUrl;
		}
	},
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.deposit-home-title{
	margin: 20/@rem 0;
	color: #1b1e25;
	font-size: 24/@rem;
	text-align: center;
}
.deposit-why-content{
	font-size: 14/@rem;
	color: #1b1e25;
	margin: 0 30/@rem 40/@rem 30/@rem;
}
.deposit-home-partner{
	width: 100%;
	margin: 10/@rem 0 80/@rem;
}

</style>
