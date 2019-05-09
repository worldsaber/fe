<template>
	<div class="deposit-reg-mpesa-wrap">
		<SportyHeader />
		<NavBar />
		<div class="deposit-mpesa-content">
			<p class="mpesa-title">Already Completed?</p>
			<p class="mpesa-tip">Lipa na M-PESA Online transaction has been initiated on your phone! Please enter service PIN to authorize the deposit, then tap the button below to let us know. </p>
		</div>
		<div class="mpesa-btn" @click="onCheckMpesaPIN">I've entered M-Pesa PIN</div>
		<div class="mpesa-gifts">You'll get KES {{gifts}} OFF in total when placing bets at SportyBet!</div>
		<router-link :to="{name: 'paybill'}" class="mpesa-try-paybill">Try PayBill   ></router-link>
		<SportyFooter :link="{name: 'terms'}"/>
		<template v-if="checking">
			<div class="deposit-mpesa-checking">
				<div class="mpesa-checking-circle"></div>
				<div class="mpesa-checking-text">Checking with M-Pesa ...</div>
			</div>
			<div class="deposit-mpesa-mask"></div>
		</template>
	</div>
</template>
<script>
import SportyHeader from 'components/depositReg/header.vue';
import SportyFooter from 'components/depositReg/footer.vue';
import NavBar from 'components/navbar';
import { formatNumber } from 'utils';
import { payBillNumber } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';
import { showMsgPop, showToast } from '../popMsg.js';

export default {
	components: {
		SportyHeader,
		SportyFooter,
		NavBar,
	},
	data() {
		return {
			tradeId: '',
			gifts: '',
			checking: false
		};
	},
	created() {
		const query = this.$route.query;
		this.tradeId = query.tradeId;
		this.gifts = formatNumber(query.gifts);
	},
	methods: {
		// 查询交易
		queryInfo () {
			return new Promise((resolve, reject) => {
				this.checking = true;
				fetch('/pocket/v1/bankTrades/bankTrade/' + this.tradeId, {
					method: 'GET',
				})
				.then(res => res.json())
				.then(data => {
					const code = data.bizCode;
					const status = (data.data || {}).status;
					if (code === 10000) {
						if (status === 20) { // 成功
							this.mpesaSuccess();
						} else if (status === 10) { // 等待支付
							showMsgPop({
								msg: 'Your request has been submitted to M-Pesa, awaiting for confirmation. Once the request has been approved, you\'ll find the Gifts in your SportyBet account.'
							}).onClose(this.goToHomePage);
						} else { // 30-FAIL, 90-CLOSED
							const msgTitle = 'Error during transaction';
							const msg = `M-PESA account is unable to accept your payment at this time.You can also use paybill number(${payBillNumber}) to deposit.`;
							showMsgPop({ msg, msgTitle, className: 'm-mpesa-long-tit' }).onClose(this.hideMpesaPop);
						}
					} else {
						showMsgPop({
							msg: 'Sorry，something went wrong. Please try again later.',
						});
					}
					resolve(true);
				})
				.catch(() => {
					showToast('No internet connection, try again.');
					reject(false);
				});
			});
		},
		hideMpesaPop() {
			const query = this.$route.query;
			this.$router.push({
				name: 'paybill',
				query,
			});
		},
		mpesaSuccess() {
			const query = this.$route.query;
			this.$router.push({
				name: 'success',
				query,
			});
		},
		goToHomePage() {
			location.href = pagePath.home;
		},
		onCheckMpesaPIN() {
			this.queryInfo()
			.then(() => {
				this.checking = false;
			}).catch(() => {
				this.checking = false;
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.deposit-reg-mpesa-wrap{
	color: #1b1e25;
}
.deposit-mpesa-content{
	.mpesa-title{
		font-size: 18/@rem;
		font-weight: bold;
		margin: 42/@rem 0 36/@rem;
		text-align: center;
	}
	.mpesa-tip{
		font-size: 14/@rem;
		margin: 0 32/@rem 40/@rem 32/@rem;
	}
}
.mpesa-btn{
	height: 48/@rem;
	line-height: 48/@rem;
	border-radius: 2/@rem;
	margin: 20/@rem;
	font-size: 16/@rem;
	text-align: center;
	background-color: #0d9737;
	color: #FFF;
}
.mpesa-gifts{
	position: relative;
	margin: 20/@rem;
	font-size: 14/@rem;
	padding-left: 28/@rem;
	.m-icon-light2();
	&::before{
		position: absolute;
		left: 0;
		font-size: 20/@rem;
		color: #0d9737;
	}
}
.mpesa-try-paybill{
	display: block;
	text-align: center;
	font-size: 14/@rem;
	color: #0d9737;
	margin: 120/@rem 0 35/@rem;

}
.deposit-mpesa-checking{
	position: fixed;
	width: 192/@rem;
	height: 128/@rem;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(27, 30, 37, 0.9);
	color: #FFF;
}
.mpesa-checking-circle{
	width: 36/@rem;
	height: 36/@rem;
	margin: 35/@rem auto 20/@rem;
	.m-icon-loading-circle();
	animation: circles 1s infinite;
	animation-timing-function: linear;
	transform-origin: 50% 50%;
	text-align: center;
	&:before{
		height: 36/@rem;
		width: 36/@rem;
		line-height: 1;
		font-size: 32/@rem;
		line-height: 36/@rem;
		color: #32ce62;
	}
}
@keyframes circles {
	100% {
		transform: rotate(360deg);
	}
}
.mpesa-checking-text{
	font-size: 14/@rem;
	text-align: center;
}
.deposit-mpesa-mask{
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background-color: transparent;
}
</style>
