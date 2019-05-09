<template>
	<div class="m-pbill-wrap">
		<!-- <p class="m-pbill-tip"><i class="m-icon--cashout"></i>Paybill Number: <strong>{{payAmount}}</strong></p> -->
		<div class="m-pbill-tip">
			<div>Paybill Number</div>
			<div><img src="../image/mpesa@2x.png" width="29" height="14"/></div>
			<strong class="m-paybill-num">
				{{payAmount}}
			</strong>
		</div>
		<!-- 充值优惠文案 -->
		<div class="m-exclusive-text" v-if="isExclusive">
			<div class="m-title">💰 Exclusive Offers 💰</div>
			<ul class="m-bill-list">
				<li class="m-bill-item" v-for="(item, index) in extraItems" :key="index">
					<span class="bill-index">{{index+1}}.</span>
					 Only<em class="bill-em-green"> pay {{currency}} {{item.amount}}</em>
					<br /> to make a successful Deposit of 
					<em class="bill-em">{{currency}} {{item.amount + Math.ceil(item.bounty/10000)}}</em>.
				</li>
				<li class="m-bill-item"><span class="bill-index">{{extraItems.length + 1}}.</span>
					<em class="bill-em-green">Free Deposits</em> for <em class="bill-em">{{showCurrency}}{{freeThreshold}} or more</em>
					<br /><span class="bill-charge"> (SportyBet will credit your M-pesa charges to your balance.)</span>
				</li>
			</ul>
		</div>
		<ul class="m-pbill-desc">
			<li class="m-paybill-title">Step Guide</li>
			<li>1. Go to Mpesa menu</li>
			<li>2. Select Payment services</li>
			<li>3. Click on Paybill</li>
			<li>4. Enter business number as {{payAmount}}</li>
			<li>5. Enter the account number as SPORTYBET</li>
			<li>6. Enter the amount you want to transfer to SportyBet account</li>
			<li>7. Enter your Mpesa pin and Confirm the request</li>
			<li>8. You will shortly receive an SMS from Mpesa to confirm the transaction</li>
		</ul>
	</div>
</template>

<script>
import { payBillNumber } from 'config/mycenter/dataConfig';
import { showCurrency } from 'config/currencyConfig';

export default {
	props: {
		quickInput: {
			type: Object
		},
		freeThreshold: {
			type: Number
		}
	},
	data () {
		return {
			payAmount: payBillNumber,
			currency: window.currency,
			showCurrency,
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
		}
	}

};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import "~base/styles/icon.less";

.m-pbill-wrap{
	padding: 0 16/@rem;
	overflow-x: hidden;
	margin: 0 auto;
}
.m-pbill-tip{
	font-size: 12/@rem;
	margin: 19/@rem 0 20/@rem;
	text-align: center;
	strong{
		font-size: 28/@rem;
		text-align: center;
	}
	img{
		width: 29/@rem;
		height: 14/@rem;
	}
}
.m-pbill-desc{
	font-size: 13/@rem;
	// line-height: 40/@rem;
	line-height: 1.5;
	padding-left: 1em;
	text-indent: -1em;
	// background-image:linear-gradient(@fogGray 1px, transparent 0);
	// background-size: 100% 40/@rem;
	// background-position: 0 -1px;
}
.m-title{
	margin-top: 12/@rem;
	font-size: 14/@rem;
	font-weight: bold;
	text-align: center;
	color: @dark;
}
.m-paybill-title{
	color: @dark;
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 9/@rem;
}
.m-exclusive-text{
	border: 1px dashed #0d9737;
	margin-bottom: 25/@rem;
	ul{
		font-size: 14/@rem;
		text-align: left;
		color: @dark;
		margin: 10/@rem 11/@rem 16/@rem; 
	}
}
.m-bill-item{
	position: relative;
	padding-left: 15/@rem;
	.bill-index{
		position: absolute;
		left: 0;
	}
	.bill-em{
		color: #353a45;
		font-weight: bold;
	}
	.bill-em-green{
		color: #0d9737;
		font-weight: bold;
	}
	.bill-charge{
		font-size: 10/@rem;
	}
}
.m-icon--mpesa{
	.m-icon-mpesa();
}
</style>

