<template>
	<ULayout>
		<template v-if="!isSuccess">
			<WithdrawForm @success="switchSuccess" :feeRange="feeRange" :additionalFee="additionalFee" :freeThreshold="freeThreshold"></WithdrawForm>
			<UDesc style="margin-left:34px;">
				<ul>
					<li><em>1.</em>Currently, SportyBet does not support Airtel services. We plan to have Airtel services as a payment option available soon.</li>
					<li><em>2.</em>An additional Carrier Fee of {{showCurrency}}{{additionalFee}} will be applied if the withdrawal amount is less than {{showCurrency}}{{freeThreshold}}.</li>
					<li><em>3.</em>Maximum per transaction is {{showCurrency}}{{showWdMax}} - withdraw up to {{showCurrency}}{{showWdMax}} in one transaction.</li>
					<li><em>4.</em>Maximum Daily Transaction is {{showCurrency}}{{showTransThreshold}} - the maximum you can send in a day is {{showCurrency}}{{showTransThreshold}}.</li>
				</ul>
			</UDesc>
		</template>
		<Success v-else :succData="succData"></Success>
	</ULayout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import { userCenter } from 'config/order/userCenterConfig';
import ULayout from 'components/userCenter/layout';
import UDesc from 'components/userCenter/description';

import { getShowCurrency } from 'config/currencyConfig';
import { getConfig } from 'withdraw/index';
import { showTransThreshold, showWdMax, showFee } from '../js/config';

import WithdrawForm from './form';
import Success from './success';

export default {
	components: {
		ULayout,
		UDesc,
		WithdrawForm,
		Success
	},
	computed: {
		...mapState('userCenter', {
			mobile: 'phone',
			remainAmount: 'balance'
		}),
	},
	data () {
		return {
			showCurrency: getShowCurrency(),
			succData: {},
			isSuccess: false,
			showTransThreshold,
			showFee,
			showWdMax,
			additionalFee: '33',
			freeThreshold: 500,
			feeRange: []
		};
	},
	watch: {
		isSuccess () {
			// 如果成功取现，更新左侧sidebar的balance
			if (this.isSuccess === true) {
				this.getBalance();
			}
		}
	},
	created () {
		this.updatePageTab(userCenter[5]);
		getConfig().then(data => {
			this.additionalFee = data.additionalFee;
			this.freeThreshold = data.freeThreshold;
			this.feeRange = data.feeRange;
		});
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		...mapActions('userCenter', [
			'getBalance'
		]),
		switchSuccess (obj) {
			this.succData = {
				// showCurrency: this.showCurrency,
				amount: obj.amount,
				tradeId: obj.tradeId,
				mobile: this.mobile,
				additionalFee: obj.additionalFee,
				isSubmitSuccess: obj.isSubmitSuccess || false
			};
			this.isSuccess = true;
		}
	}
};
</script>

<style lang="less">
	@import "../index.less";
	.m-uc-wrapper{
		background-image: url(../images/bg.jpg);
	}
</style>
