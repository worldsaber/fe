<template lang="html">

<div class="m-wd-gh-cfm">
    <div class="f-con">
        <div class="f-main">
			<div class="t-c t-s">Withdrawal Amount({{currency}})</div>
			<div class="t-c t-b">{{amount}}</div>
	        <div class="f-line">
	            <div class="i-label">Remaining Amount</div>
	            <div class="i-value">{{getRemainBalance}}</div>
	        </div>
			<div class="f-line">
				<div class="i-label">Withdraw To</div>
				<div class="i-value">{{contentData.channelShowName}}</div>
			</div>
			<!-- <div class="f-line">
				<div class="i-label">Mobile Owner Full Name</div>
				<div class="i-value">{{showName}}</div>
			</div> -->
			<div class="f-line">
				<div class="i-label">Mobile Number</div>
				<div class="i-value">{{showPhone}}</div>
			</div>
        </div>
		<div class="f-btn-wrapper">
			<af-button
				extraType="info"
				@click="closePop"
			>Cancel</af-button>
			<af-button
				extraType="primary"
				@click="confirm"
				:loading="withdrawLoading"
			>{{subText}}</af-button>
		</div>
    </div>
</div>

</template>

<script>
import {
	mapState,
	mapActions,
	mapGetters,
	mapMutations
} from 'vuex';
import {
	formatNumber
} from 'utils';
import {
	showCurrencyOrigin
} from 'config/currencyConfig';
import * as mutationsTypes from 'store/withdraw/gh/mutationTypes';
import {
	modifyPhone,
	// formatName
} from '../js/commonFun';

export default {
	data() {
		return {
			currency: showCurrencyOrigin,
			withdrawLoading: false,
			showPhone: modifyPhone()
		};
	},
	computed: {
		...mapState('withdraw', [
			'wdInfo',
			'reqLoading'
		]),
		...mapGetters('withdraw', [
			'getRemainBalance'
		]),
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
		// 		return `${formatName(temp)}`;
		// 	}
		//
		// 	return '';
		// },
		subText() {
			return this.withdrawLoading ? 'Loading...' : 'Confirm';
		},
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.withdrawLoading = false;
			}
		}
	},
	methods: {
		...mapActions('withdraw', [
			'withdraw'
		]),
		...mapMutations('withdraw', {
			resetAuditStatus: mutationsTypes.UPDATEAUDITSTATUS
		}),
		confirm() {
			if (this.withdrawLoading) {
				return;
			}

			this.withdrawLoading = true;
			this.resetAuditStatus(false);
			this.withdraw();
		},
		closePop() {
			if (this.withdrawLoading) {
				return;
			}

			this.$parent.close();
		}
	}
};

</script>

<style lang="less">
@import '../style/wdCfm.less';
</style>
