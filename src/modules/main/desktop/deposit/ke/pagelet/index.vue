<template>
	<ULayout class="m-deposit-layout">
		<UNav :tabList='tabList' :active="0" @click="tabClick"></UNav>
		<template v-if="currentTab === 0">
			<template v-if="!isSuccess">
				<p class="m-fm-tip">Enter an amount below, use your service PIN to authorize the transaction.</p>
				<DepositForm @success="switchSuccess" :quickInput="quickInput" :freeThreshold="freeThreshold" :feeRange="feeRange"></DepositForm>
			</template>
			<Success v-else :succData="succData"></Success>
		</template>
		<Paybill v-if="currentTab === 1" :quickInput="quickInput" :freeThreshold="freeThreshold"></Paybill>
		<div class="m-deposit-info" v-if="!isSuccess">
			<div class="m-deposit-info-title"><span class="m-deposit-info-light"></span> Note</div>
			<ul class="m-deposit-info-list">
				<li><em>1.</em> SportyBet will credit your M-pesa charges to your balance if the deposit amount is equal or greater than {{showCurrency}}{{freeThreshold}}. </li>
				<li><em>2.</em> Maximum per transaction is {{showCurrency}}{{showDpMax}} - deposit up to {{showCurrency}}{{showDpMax}} in one transaction. </li>
				<li><em>3.</em> Maximum Daily Transaction is {{showCurrency}}{{showTransThreshold}} - the maximum transferrable amount per day is {{showCurrency}}{{showTransThreshold}}.</li>
			</ul>
		</div>
	</ULayout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import { userCenter } from 'config/order/userCenterConfig';
import ULayout from 'components/userCenter/layout';
import UNav from 'components/userCenter/nav';
import UDesc from 'components/userCenter/description';
import { getShowCurrency } from 'config/currencyConfig';
import { getConfig } from 'deposit/index';

import '../../../mockData/deposit/index?debug';

import { showTransThreshold, showDpMax } from '../js/config';
import DepositForm from './form';
import Success from './success';
import Paybill from './paybill';

export default {
	name: 'deposit',
	components: {
		ULayout,
		UNav,
		UDesc,
		DepositForm,
		Success,
		Paybill
	},
	computed: {
		...mapState('userCenter', {
			mobile: 'phone'
		}),
		amountThreshold() {
			return 250;
		}
	},
	data () {
		return {
			showCurrency: getShowCurrency(),
			succData: {},
			tabList: ['Online Deposit', 'Paybill'],
			currentTab: 0,
			isSuccess: false,
			showTransThreshold,
			showDpMax,
			quickInput: {},
			freeThreshold: 250,
			feeRange: []
		};
	},
	watch: {
		isSuccess () {
			// 如果成功充值，更新左侧sidebar的balance
			if (this.isSuccess === true) {
				this.getBalance();
			}
		}
	},
	created () {
		this.updatePageTab(userCenter[4]);
		getConfig().then(data => {
			this.quickInput = data.quickInput;
			this.feeRange = data.feeRange;
			this.freeThreshold = data.freeThreshold;
		});
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		...mapActions('userCenter', [
			'getBalance'
		]),
		tabClick (index) {
			if (index === 0) {
				this.isSuccess = false;
			}
			this.currentTab = index;
		},
		switchSuccess (obj) {
			this.succData = {
				// showCurrency: this.showCurrency,
				amount: obj.amount,
				tradeId: obj.tradeId,
				mobile: this.mobile
			};
			this.isSuccess = true;
		}
	}
};
</script>

<style lang="less">
@import "../index.less";
@import 'base/style/icon.less';
.m-uc-wrapper{
	background-image: url(../images/bg.jpg);
	&.m-deposit-layout{
		padding: 10px 40px;
	}
}
.m-deposit-layout{
	color: #353a45;
}
.m-fm-tip{
	font-size: 14px;
	margin: 35px 0;
	font-weight: 500;
}
.m-deposit-info{
	margin: 36px 0 74px;
	padding: 20px 0;
	border-top: 1px solid #eaecef;
	.m-deposit-info-light{
		.m-icon-light2();
		margin-right: 8px;
		&::before{
			font-size: 16px;
			line-height: 16px;
			color: #0d9737;
		}
	}
	.m-deposit-info-title{
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 12px;
	}
	.m-deposit-info-list{
		font-size: 12px;
		line-height: 2;
		padding-left: 24px;
	}
}
</style>
