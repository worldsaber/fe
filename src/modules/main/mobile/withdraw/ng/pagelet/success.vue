<template>
  <div class="withdraw-success">
    <div class="icon-container">
	  <img :src="require('../img/success-icon.svg')">
	</div>
	<p class="success-msg">{{(manual ? 'Submission' : 'Withdrawal') + ' Succeeded!'}}</p>
	<p class="manual-text" v-if="manual">Manual process Result in 3 working days</p>
	<div class="success-line"/>
	<div class="success-form amount">
	  <div class="form-label">{{'Amount(' + currency + ')'}}</div>
	  <div class="form-value">{{form.amount}}</div>
	</div>
	<div class="success-form withdraw">
	  <div class="form-label">Withdraw to</div>
	  <img class="form-value icon" :src="form.icon">
	  <span class="form-value name">{{form.name}}</span>
	  <span class="form-value">{{form.account}}</span>
	</div>
	<div class="success-form">
	  <div class="form-label">Account Name</div>
	  <div class="form-value">{{form.account}}</div>
	</div>
	<div class="success-form trade">
	  <div class="form-label">Trade Number</div>
	  <div class="form-value">{{form.tradeId}}</div>
	</div>
	<div class="static-button" @click="goHome">Continue Betting</div>
	<div class="check-transaction-container">
	  <span class="check-transaction" @click="checkTransaction">Check status in Transaction</span>
	  <i @click="checkTransaction" class="icon-right"/>
	</div>
  </div>
</template>

<script>
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import { pagePath } from 'config/pageConfig.js';
import { showCurrencyOrigin } from 'config/currencyConfig';

export default {
	props: {
		manual: {
			type: Boolean,
			'default': false
		},
		form: {
			type: Object,
			'default': () => ({})
		}
	},
	data () {
		return {
			step: 'pay',
			// showCurrency: window.showCurrency,
			currency: showCurrencyOrigin
		};
	},
	created () {

	},
	mounted() {

	},
	methods: {
		checkTransaction() {
			location.href = userCenterUrl.transaction;
		},
		goHome() {
			location.href = pagePath.home;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";
.withdraw-success {
	width: 100%;
	padding: 0 16/@rem;
	box-sizing: border-box;
	.icon-container {
		margin-top: 60/@rem;
		text-align: center;
	}
	.success-msg {
		margin-top: 20/@rem;
		margin-bottom: 20/@rem;
		font-size: 20px;
		line-height: 27px;
		font-weight: bold;
		text-align: center;
		color: @dark;
	}
	.manual-text {
		font-size: 16px;
		line-height: 18px;
		color: @green;
		text-align: center;
		padding: 0 80/@rem;
	}
	.success-line {
		height: 4/@rem;
		width: 100%;
		background-color: @fogGray;
		margin-top: 15/@rem;
		margin-bottom: 30/@rem;
	}
	.success-form {
		display: flex;
		align-items: center;
		justify-content: center;
		color: @dark;
		margin-bottom: 20/@rem;
		white-space: nowrap;
		.form-label {
			flex: 1;
			font-size: 14px;
			text-align: left;
			line-height: 20px;
		}
		.form-value {
			flex: 0;
			font-size: 14px;
			font-weight: bold;
			line-height: 20px;
			&.icon {
				margin-right: 6/@rem;
				height: 20px;
			}
			&.name {
				margin-right: 24/@rem;
			}
		}
		&.amount {
			margin-bottom: 20/@rem;
		}
		&.trade {
			margin-bottom: 48/@rem;
		}
	}

	.static-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 48/@rem;
		width: 100%;
		font-size: 16px;
		font-weight: bold;
		color: @white;
		background-color: @green;
		border: none;
		margin-bottom: 16/@rem;
	}

	.check-transaction-container {
		display: flex;
		align-items: center;
		justify-content: center;
		.check-transaction {
			flex: 0;
			font-size: 14px;
			line-height: 16px;
			color: @green;
			white-space: nowrap;
		}
		.icon-right {
			flex: 0;
			margin-left: 10/@rem;
			.m-icon-arrow--right();
			color: @green;
			font-size: 16px;
			&:before{
				vertical-align: middle;
			}
		}
	}
}
</style>
