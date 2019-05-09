<template lang="html">
	<div class="m-wd-pop m-pop--confirm">
		<h3 class="f-title">
			<span>Confirm to Withdraw</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</h3>
		<section>
			<div class="f-line">
				<div class="i-label">Amount({{showCurrency}})</div>
				<div class="i-value">{{getWdAmount}}</div>
			</div>
			<div class="f-line" v-if="hasFee">
				<div class="i-label">Additional Fee</div>
			    <div class="i-value">{{showFee}}</div>
			</div>
			<div class="f-line">
				<div class="i-label">Bank Name</div>
			    <div class="i-value">{{wdInfo.bankName}}</div>
			</div>
			<div class="f-line">
				<div class="i-label">Account Number</div>
			    <div class="i-value">{{getBankNum}}</div>
			</div>
			<div class="f-line">
				<div class="i-label">Account Name</div>
			    <div class="i-value">{{bankAccount}}</div>
			</div>
			<div class="f-line f-line--opt">
				<af-button
					extraType="text"
					data-action="close"
					data-ret="close"
				>Cancel</af-button>
				<af-button
					extraType="primary"
					@click="submit"
					:loading="loading"
				>{{subText}}</af-button>
			</div>
		</section>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import * as mutationsTypes from 'store/withdraw/ng/mutationTypes';
import { fee, feeThreshold } from 'store/withdraw/ng/config';

import { formatNumber } from 'utils';
import { showCurrencyOrigin } from 'config/currencyConfig';
import 'packages/button';
import pageMixin from '../js/pageMixin';

export default {
	mixins: [
		pageMixin
	],
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			fee
		};
	},
	computed: {
		...mapState('withdraw', [
			'bankAccount',
			'wdInfo'
		]),
		subText() {
			return this.loading ? 'Loading...' : 'Confirm';
		},
		getBankNum() {
			const wdInfo = this.wdInfo || {},
				bankNum = wdInfo.bankAccNum || '',
				len = bankNum.length;

			if (bankNum.startsWith('*')) {
				return bankNum;
			}

			return len ? `****${bankNum.slice(-4)}` : '';
		},
		getWdAmount() {
			const wdInfo = this.wdInfo || {},
				amount = wdInfo.payAmount || 0;

			return formatNumber(amount, 2);
		},
		hasFee() {
			const wdInfo = this.wdInfo || {},
				amount = +wdInfo.payAmount || 0;

			return amount < feeThreshold;
		},
		showFee() {
			return formatNumber(this.fee, 2);
		}
	},
	methods: {
		...mapActions('withdraw', [
			'withdraw'
		]),
		...mapMutations('withdraw', {
			resetAuditStatus: mutationsTypes.UPDATEAUDITSTATUS
		}),
		submit() {
			if (this.loading) {
				return;
			}

			this.loading = true;
			this.resetAuditStatus(false);
			this.withdraw();
		}
	}
};
</script>

<style lang="less">
@import '../style/popDialog.less';

.m-pop--confirm {
	section {
		padding: 30px 0;
		box-sizing: border-box;
	}

	.f-line {
		margin-bottom: 10px;
	}

	.f-line--opt {
		margin: 20px auto 0;
	}

	.i-label,
	.i-value {
		display: inline-block;
		vertical-align: top;
		font-size: 14px;
		line-height: 19px;
	}

	.i-label {
		text-align: right;
		width: 234px;
		padding-right: 20px;
		box-sizing: border-box;
	}

	.i-value {
		text-align: left;
		width: 245px;
		font-weight: bold;
	}
}
</style>
