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
		<SportyFooter :link="toLink" />
	</div>
</template>
<script>
import SportyHeader from 'components/depositReg/header.vue';
import SportyFooter from 'components/depositReg/footer.vue';
import Testimonials from 'components/depositReg/testimonials.vue';
import GrandSize from 'components/depositReg/grandSize.vue';
import Condition from 'components/depositReg/condition.vue';
import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import HomeCommon from 'components/depositReg/home-common.vue';
import Advantage from '../components/advantage.vue';
import { showMsgPop, showToast } from '../popMsg.js';

export default {
	components: {
		SportyHeader,
		SportyFooter,
		Advantage,
		Testimonials,
		HomeCommon,
		GrandSize,
		Condition,
	},
	data() {
		return {
			showCurrency,
			tradeId: '',
			toLink: {
				name: 'terms'
			},
			isLogin: window.loginStatus,
		};
	},
	methods: {
		onRegisterSuccess(payload) {
			// 调用充值接口
			this.submitPost(payload);
		},
		// 调用充值接口
		submitPost({ phone, amount, gifts }) {
			return new Promise((resolve, reject) => {
				fetch('/pocket/v1/bankTrades/bankTrade/deposit', {
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/json'
					}),
					body: JSON.stringify({
						phoneNo: phone,
						payAmount: amount * 10000,
						payChId: 10   // 付款渠道（10-Mpesa） 暂时只有10
					})
				})
				.then(res => res.json())
				.then(data => {
					const { bizCode: code, message } = data;
					const originData = data.data || {};
					if (code === 10000) {
						if (originData.status === 72) {  // risk audit
							return this.showErrorPop(code, message);
						}
						this.tradeId = originData.tradeId;
						this.showSuccPop({ amount, gifts });
					} else {
						return this.showErrorPop(code, message);
					}
				})
				.catch(err => reject(err));
			}).catch(() => {
				showToast('No internet connection, try again.');
			});
		},
		// 显示成功弹出层
		showSuccPop ({ amount, gifts }) {
			const query = this.$route.query;
			this.$router.push({
				name: 'mpesa',
				query: {
					...query,
					tradeId: this.tradeId,
					gifts,
					amount,
				}
			});
		},
		showErrorPop (code, message) {
			let msg;
			const transThreshold = +window.transThreshold || 140000;
			const showTransThreshold = formatNumber(transThreshold);

			if (code === 62100) {
				msg = `Maximum daily transaction value is ${this.showCurrency}${showTransThreshold}. The maximum you can send in a day is ${this.showCurrency}${showTransThreshold}.`;
			} else {
				msg = message || 'Sorry，something went wrong. Please try again later.';
				// msgTitle = 'Something went wrong';
				// msg = `M-PESA account is unable to accept your payment at this time. You can also use paybill number(${payBillNumber}) to deposit.`;
			}
			showMsgPop({ msg });
		}
	}
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
