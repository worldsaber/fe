<template>
	<div class="gt-bank-wrap">
		<div class="bank-title">
			<img class="bank-icon" src="../image/gtbank.png" /><span>GTBank</span>
		</div>

		<div class="gt-bank">
			<div class="bank-label" @click="setCurrentTab('website')">Deposit with GTBank Website 
				<span class=""></span>
				<span :class="['bank-icon-arrow-down', isWebsite ? '' : 'bank-icon-arrow-right']"></span>
			</div>
			<div class="bank-content" v-show="isWebsite">
				<div class="bank-item">
					<span class="bank-no">1.</span> 
					Login in to your <a :href="bankUrl" class="bank-link">GTBank account</a>.
				</div>
				<div class="bank-item">
					<span class="bank-no">2.</span>
					From the Internet banking homepage, click <em class="bank-em">'Payments & Collections'</em> from the drop-down menu and then click 
					<em class="bank-em">'Sports and Gaming'</em>. Scroll and select 
					<em class="bank-em">'SPORTYBET'</em> and then click 
					<em class="bank-em">'Make New Payments'</em>.
				</div>
				<div class="bank-item">
					<span class="bank-no">3.</span>
					Enter your <em class="bank-em">SportyBet Login Phone Number: {{phone}}</em> and the amount you wish to deposit. 
				</div>
				<div class="bank-item">
					<span class="bank-no">4.</span>
					Confirm all your details and bank charges. Answer any security questions and enter your token code or USSD.
				</div>
				<div class="bank-item">
					<span class="bank-no">5.</span>
					Upon successful payment, your betting wallet will be credited instantly.
				</div>
				<a class="visit-link" :href="bankUrl">Visit GTBank to Deposit</a>
				<a :href="transactionLink" class="transaction-link">Check Transaction Result <span class="arrow-right"></span></a>
			</div>
		</div>
		<div class="gt-bank">
			<div class="bank-label" @click="setCurrentTab('mobile')">Deposit with GTBank Mobile
				<span :class="['bank-icon-arrow-down', isMobile ? '' : 'bank-icon-arrow-right']"></span>
			</div>
			<div class="bank-content" v-show="isMobile">
				<div class="bank-item">
					<span class="bank-no">1.</span> 
					Open the GTBank mobile banking app and sign in.
				</div>
				<div class="bank-item">
					<span class="bank-no">2.</span>
					Click on <em class="bank-em">'Other Payments'</em>, then select <em class="bank-em">'More Payments'</em>.
				</div>
				<div class="bank-item">
					<span class="bank-no">3.</span>
					Click on <em class="bank-em">'Sports and Gaming'</em> and select <em class="bank-em">'SPORTYBET'.</em>
				</div>
				<div class="bank-item">
					<span class="bank-no">4.</span>
					Click on SPORTYBET.
				</div>
				<div class="bank-item">
					<span class="bank-no">5.</span>
					Enter your <em class="bank-em">SportyBet Login Phone Number: {{phone}}</em> and the amount you wish to deposit.
				</div>
				<div class="bank-item">
					<span class="bank-no">6.</span>
					Select the GT Bank account that you wish to make the deposit from, insert your mobile banking pin and confirm.
				</div><div class="bank-item">
					<span class="bank-no">7.</span>
					Upon successful payment, your betting wallet will be credited instantly.
				</div>
				<a :href="transactionLink" class="transaction-link">Check Transaction Result <span class="arrow-right"></span></a>
			</div>
		</div>
		<div class="gt-bank">
			<div class="bank-label" @click="setCurrentTab('USSD')">Deposit with USSD
				<span :class="['bank-icon-arrow-down', isUSSD ? '' : 'bank-icon-arrow-right']"></span>
			</div>
			<div class="bank-content" v-show="isUSSD">
				<div class="bank-item">
					Dial *737*50*Amount*558#
				</div>
				<a :href="transactionLink" class="transaction-link">Check Transaction Result <span class="arrow-right"></span></a>
			</div>
		</div>
	</div>
</template>

<script>
import cookie from 'storage/cookie';
import { pagePath } from 'config/pageConfig';

export default {
	data() {
		const phone = cookie('phone');
		return {
			bankUrl: 'https://www.gtbank.com',
			currentTab: '',
			phone,
			transactionLink: `${pagePath.home}my_accounts/transactions`
		};
	},
	computed: {
		isWebsite() {
			return this.currentTab === 'website';
		},
		isMobile() {
			return this.currentTab === 'mobile';
		},
		isUSSD() {
			return this.currentTab === 'USSD';
		}
	},
	methods: {
		setCurrentTab(tab) {
			if (tab === this.currentTab) {
				this.currentTab = '';
			} else {
				this.currentTab = tab;
			}
		}
	}
};
</script>
<style lang='less'>
@import 'base/style/icon.less';
@import 'base/style/variable.less';

.gt-bank-wrap{
	.bank-title{
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #000000;
		margin: 10px 0 6px;
		.bank-icon{
			width: 24px;
			// height: 24px;
			margin: 10px 10px 10px 16px;
		}
	}
	.visit-link{
		display: block;
		margin: 16px 0;
		width: 220px;
		background-color: #0d9737;
		border-radius: 2px;
		line-height: 48px;
		height: 48px;
		color: #FFF;
		font-size: 14px;
		text-align: center;
		font-weight: bold;
	}
	.transaction-link{
		display: block;
		margin: 16px 0;
		font-size: 14px;
		color: #0d9737;
		.arrow-right{
			.m-icon-arrow--right();
			&::before{
				color: #0d9737;
				font-size: 14px;
			}
		}
	}
	.bank-footer{
		margin: 40px 0 0;
		font-size: 12px;
		color: #353a45;
		line-height: 1.5;
		padding-top: 20px;
		border-top: solid 1px #eaecef;
		.f-title {
			line-height: 16px;
			font-size: 14px;
			.m-icon-light2();
			margin-bottom: 10px;

			&:before {
				font-size: 18px;
				line-height: 1;
				color: @green;
				margin-right: 6px;
			}
		}
	}
}
.gt-bank{
	color: #353a45;
	border-bottom: 1px solid #eaecef;
	
	.bank-label{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48px;
		line-height: 48px;
		font-size: 16px;
	}
	.bank-icon-arrow-down{
		transition: transform 0.5s;
		.m-icon-arrow-down2();
		&::before{
			color: #0d9737;
		}
		&.bank-icon-arrow-right{
			transform: rotate(-90deg);
		}
	}
	.bank-content{
		margin: 5px 40px;
	}
	.bank-item{
		position: relative;
		padding: 0 16px;
		font-size: 14px;
		margin: 6px 0;
		line-height: 16px;
		.bank-no{
			position: absolute;
			left: 0;
		}
		.bank-em{
			font-weight: bold;
		}
		.bank-link{
			color: #3656a3;
		}
	}
}
</style>
