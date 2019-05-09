<template lang="html">
	<div class="m-wd-pop m-pop--confirm">
		<h3 class="f-title">
			<span>Confirm to Withdraw</span>
			<i
				class="m-icon-close"
				@click="closePop"
			></i>
		</h3>
		<section>
			<div class="f-line">
				<div class="i-label">Amount({{showCurrency}})</div>
				<div class="i-value">{{amount}}</div>
			</div>
			<div class="f-line">
	            <div class="i-label">Remaining Amount</div>
	            <div class="i-value">{{getRemainBalance}}</div>
	        </div>
			<div class="f-line">
				<div class="i-label">Withdraw To</div>
				<div class="i-value">{{wdInfo.channelShowName}}</div>
			</div>
			<!-- <div class="f-line">
				<div class="i-label">Mobile Owner Full Name</div>
				<div class="i-value">{{showName}}</div>
			</div> -->
			<div class="f-line">
				<div class="i-label">Mobile Number</div>
				<div class="i-value">{{showPhone}}</div>
			</div>
			<div class="f-line f-line--opt">
				<af-button
					extraType="text"
					@click="closePop"
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
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import * as mutationsTypes from 'store/withdraw/gh/mutationTypes';

import { formatNumber } from 'utils';
import { showCurrencyOrigin } from 'config/currencyConfig';
import 'packages/button';
import pageMixin from '../js/pageMixin';
import {
	modifyPhone,
	// formatName
} from '../js/commonFun';

export default {
	mixins: [
		pageMixin
	],
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			showPhone: modifyPhone()
		};
	},
	computed: {
		...mapState('withdraw', [
			'wdInfo'
		]),
		...mapGetters('withdraw', [
			'getRemainBalance'
		]),
		subText() {
			return this.loading ? 'Loading...' : 'Confirm';
		},
		amount() {
			let temp = this.wdInfo || {};

			temp = temp.payAmount || 0;
			return formatNumber(temp, 2);
		},
		// showName() {
		// 	let temp = this.wdInfo || {};
		//
		// 	temp = temp.name;
		//
		// 	if (temp) {
		// 		return formatName(temp);
		// 	}
		//
		// 	return '';
		// },
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
		},
		closePop() {
			if (this.loading) {
				return;
			}

			this.$parent.close();
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
