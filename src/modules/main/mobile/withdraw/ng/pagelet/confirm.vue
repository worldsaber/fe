<template>
	<div class="withdraw-confirm">
		<div class="withdraw-area">
		  	<div class="withdraw-label">{{'Amount(' + currency + ')'}}</div>
			<p class="withdraw-value">{{extraData.amount}}</p>
		</div>
		<div class="withdraw-area" v-if="showFee">
		  	<div class="withdraw-label">Additional Fee</div>
			<div class="withdraw-value">{{fee}}</div>
		</div>
		<div class="withdraw-area">
		  	<div class="withdraw-label">Bank Name</div>
			<div class="withdraw-value">{{extraData.bankName}}</div>
		</div>
		<div class="withdraw-area">
		  	<div class="withdraw-label">Account Number</div>
			<p class="withdraw-value">{{extraData.bankAccNum}}</p>
		</div>
		<div class="withdraw-area">
		  	<div class="withdraw-label">Account Name</div>
			<p class="withdraw-value">{{extraData.bankAccName}}</p>
		</div>
		<div class="withdraw-action">
			<span class="action-cancel" @click="cancel">CANCEL</span>
			<span class="action-confirm" v-if="!withdrawLoading" @click="confirm">CONFIRM</span>
			<i class="af-icon-loading" v-else/>
		</div>
	</div>
</template>

<script>
import { showCurrencyOrigin } from 'config/currencyConfig';
import { formatNumber } from 'utils';

export default {
	props: {
		extraData: {
			type: Object,
			'default': () => ({
				bankName: '',
				amount: '',
				accountNum: '',
				accountName: '',
				originAmount: ''
			})
		}
	},
	data() {
		return {
			// showCurrency: window.showCurrency,
			currency: showCurrencyOrigin,
			withdrawLoading: false,
			fee: formatNumber(+withdrawCfg.fee, 2),
			feeThreshold: +withdrawCfg.feeThreshold || 1000,
		};
	},
	computed: {
		showFee() {
			const extraData = this.extraData || {},
				amount = +extraData.originAmount || 0;

			return amount < this.feeThreshold;
		}
	},
	created() {
		this.$on('loading', val => {
			this.withdrawLoading = val;
		});
	},
	methods: {
		confirm() {
			this.withdrawLoading = true;
			this.$emit('trigger', 'withdraw');
		},
		cancel() {
			this.$dialog();
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";

.withdraw-confirm {
	margin-top: 33/@rem;
	.withdraw-area {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		color: @dark;
		margin-bottom: 9/@rem;
		.withdraw-label {
			flex: 0;
			margin-right: 20/@rem;
			font-size: 14px;
			line-height: 18px;
			white-space: nowrap;
		}
		.withdraw-value {
			flex: 1;
			font-size: 16px;
			font-weight: 500;
			text-align: right;
			line-height: 18px;
		}
	}
	.withdraw-action {
		margin-top: 46/@rem;
		margin-bottom: 18/@rem;
		color: @green;
		font-size: 14px;
		line-height: 16px;
		text-align: right;
		.action-cancel {
			margin-right: 33/@rem;
		}
		.action-confirm {
			font-weight: bold;
		}
		.af-icon-loading:before{
			content: "\e648";
			.iconfont();
		}
		.af-icon-loading{
			display: inline-block;
			animation: loading-rotate 2s linear infinite;
		}
	}
}
</style>
