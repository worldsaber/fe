<template>
  <div class="deposit-success">
    <div class="icon-container">
	  <img :src="require('../img/success-icon.svg')">
	</div>
	<p class="success-msg">Deposit Succeeded!</p>
	<div class="success-line"/>
	<div class="success-form amount">
	  <div class="form-label">{{'Amount(' + currency + ')'}}</div>
	  <div class="form-value">{{form.amount}}</div>
	</div>
	<div class="success-form payment">
	  <div class="form-label">Payment Info</div>
	  <img class="form-value icon" :src="form.icon">
	  <span class="form-value name">{{form.name}}</span>
	  <span class="form-value">{{form.account}}</span>
	</div>
	<div class="success-form trade">
	  <div class="form-label">Trade Number</div>
	  <div class="form-value">{{form.tradeId}}</div>
	</div>
	<div class="static-button" @click="goUrl">Done</div>
	<div class="check-transaction-container">
	  <span class="check-transaction" @click="checkTransaction">Check status in Transaction</span>
	  <i @click="checkTransaction" class="icon-right"/>
	</div>
  </div>
</template>

<script>
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
// import { pagePath } from 'config/pageConfig.js';
import { showCurrency } from 'config/currencyConfig';
// import depositConfig from 'config/deposit/record';
import { LS } from 'storage';

export default {
	props: {
		form: {
			type: Object,
			'default': () => ({})
		}
	},
	data () {
		return {
			showCurrency,
			currency: window.currency
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
		// goHome() {
		// 	window.location.href = depositConfig.getRecord() || pagePath.home;
		// },
		goUrl() {
			if (URL.getPara('source') === 'betslip') {
				LS.set('isOpenBetslip', true);
			}
			window.history.go(-1);
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";
.deposit-success {
	width: 100%;
	padding: 0 16/@rem;
	box-sizing: border-box;
	.icon-container {
		margin-top: 60/@rem;
		text-align: center;
	}
	.success-msg {
		margin-top: 20/@rem;
		margin-bottom: 35/@rem;
		font-size: 20px;
		line-height: 27px;
		font-weight: bold;
		text-align: center;
		color: @dark;
	}
	.success-line {
		height: 4/@rem;
		width: 100%;
		background-color: @fogGray;
		margin-bottom: 28/@rem;
	}
	.success-form {
		display: flex;
		align-items: center;
		justify-content: center;
		color: @dark;
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
			margin-bottom: 16/@rem;
		}
		&.payment {
			margin-bottom: 16/@rem;
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
