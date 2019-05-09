<template>
	<div class="m-paybill">
		<p class="m-bill-num"><span>Paybill Number:</span> <em class="bill-amount">{{payAmount}}</em> <i class="icon-mpesa"></i></p>
		<div class="m-bill-offer" v-if="isExclusive">
			<h2 class='m-bill-title'>💰 Exclusive Offers 💰</h2>
			<ul class="m-bill-list">
				<li class="m-bill-item" v-for="(item, index) in extraItems" :key="index">{{index+1}}. Only pay <span class="bill-em-green">{{currency}} {{item.amount}}</span> to make a successful Deposit of <em class="bill-em">{{currency}} {{item.amount + Math.ceil(item.bounty/10000)}}</em>.</li>
				<li class="m-bill-item">{{extraItems.length + 1}}. 
					<span class="bill-em-green">Free Deposits</span> for <span class="bill-em">{{currency}} {{freeThreshold}} or more</span>
					<span class="bill-charge"> (SportyBet will credit your M-pesa charges to your balance.)</span>
				</li>
			</ul>
		</div>
		<h2 class="step-guide">Step Guide</h2>
		<p class="m-pbill-desc">
			1. Go to Mpesa menu<br>
			2. Select Payment services<br>
			3. Click on Paybill<br>
			4. Enter business number as {{payAmount}}<br>
			5. Enter the account number as SPORTYBET<br>
			6. Enter the amount you want to transfer to SportBet account<br>
			7. Enter your Mpesa pin and Confirm the request<br>
			8. You will shortly receive an SMS from Mpesa to confirm the transaction
		</p>
	</div>
</template>

<script>
import { payBillNumber } from 'config/order/userCenterConfig';

export default {
	props: {
		quickInput: {
			type: Object,
		},
		freeThreshold: {
			type: Number
		}

	},
	data () {
		return {
			payAmount: payBillNumber,
			currency: window.currency
		};
	},
	computed: {
		isExclusive() {
			return this.extraOffer.length > 0;
		},
		extraOffer() {
			return this.quickInput.extraOffer || [];
		},
		extraItems() {
			return this.extraOffer.filter(item => item.bounty && item.amount);
		},
	}
};
</script>
<style lang="less">
.m-paybill{
	color: #353a45;
	.m-bill-num{
		display: flex;
		align-items: center;
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		margin: 35px 0;

	}
	.bill-amount{
		font-size: 24px;
		font-weight: bold;
		margin: 0 10px;
	}
	.icon-mpesa{
		display: inline-block;
		width: 43px;
		height: 40px;
		background-image: url(../images/mpesa.png);
		background-position: center center;
		background-repeat: no-repeat;
		@media only screen and (-webkit-min-device-pixel-ratio: 2),
		only screen and (min--moz-device-pixel-ratio: 2),
		only screen and (-o-min-device-pixel-ratio: 2/1),
		only screen and (min-device-pixel-ratio: 2),
		only screen and (min-resolution: 192dpi),
		only screen and (min-resolution: 2dppx) {
			background-image: url(../images/mpesa@2x.png);
			background-size: 43px 21px;
		}
	}
	.step-guide{
		font-size: 16px;
		margin: 50px 0 10px;
	}
	.m-pbill-desc{
		font-size: 14px;
		line-height: 24px;
	}
}
.m-bill-offer{
	width: 600;
	border: 1px #0d9737 dashed;
	padding: 20px;
	font-size: 14px;
	line-height: 24px;
	.bill-em{
		font-weight: bold;
	}
}
.m-bill-title{
	font-size: 16px;
	margin-bottom: 10px;
}
.m-bill-item{
	font-size: 14px;
	.bill-em-green{
		color: #0d9737;
		font-weight: bold;
	}
	.bill-em{
		color: #1b1e25;
		font-weight: bold;
	}
}

</style>

