<template>
	<div class="deposit-reg-home">
		<HomeCommon @success="onRegisterSuccess"/>

		<template v-if="!isLogin">
			<div class="deposit-home-title">Why SportyBet </div>
			<div class="deposit-why-content">SportyBet is the leading technology-fueled sports betting company in Africa, with the best promotions and the fastest APP betting experience. Join us now, Get Sporty Bet Sporty.</div>
			<Advantage />
		</template>
		
		<div class="deposit-home-title">SportyBet’s Partners</div>
		<img src="../images/partner.png" class="deposit-home-partner"/>
		
		<template v-if="isLogin">
			<Condition />
			<GrandSize class="sportbet-grandsize"/>
		</template>
		
		<template v-else>
			<div class="deposit-home-title">We Love SportyBet</div>
			<Testimonials />
		</template>

		<SportyFooter :link="{name: 'terms'}"/>
	</div>
</template>
<script>
import SportyHeader from 'components/depositReg/header.vue';
import SportyFooter from 'components/depositReg/footer.vue';
import Testimonials from 'components/depositReg/testimonials.vue';
import HomeCommon from 'components/depositReg/home-common.vue';
import Condition from 'components/depositReg/condition.vue';
import GrandSize from 'components/depositReg/grandSize.vue';
import { pagePath } from 'config/pageConfig';

import Advantage from '../components/advantage.vue';

export default {
	components: {
		SportyHeader,
		SportyFooter,
		Advantage,
		Testimonials,
		HomeCommon,
		Condition,
		GrandSize
	},
	data() {
		return {
			isLogin: window.loginStatus
		};
	},
	methods: {
		onRegisterSuccess(payload) {
			// 调整链接
			const query = this.$route.query;
			if (payload.source === 'login') { // 来自登录态，直接到充值页面
				const amount = payload.amount;
				location.href = `${pagePath.myCenter}/deposit?source=fbad${amount ? `&amount=${amount}` : ''}`;
			} else {
				this.$router.push({
					name: 'success',
					query: {
						...query,
						...payload
					},
				});
			}
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
	margin: 10/@rem 0 30/@rem;
}
.sportbet-grandsize{
	margin-bottom: 30/@rem;
}
</style>
