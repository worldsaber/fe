<template>
	<div class="m-uc-wrapper">
		<topNavBar v-if="!isSuccess">
			<a slot="right" :href="`${helpUrl}#/how-to-play/others/how-to-deposit`"><i class="m-icon--question"></i></a>
		</topNavBar>
		<!-- 系统通知 -->
		<DepositNav v-if="!isSuccess" :tabList="tabList" :active="currentTab" @click="tabClick"></DepositNav>
		<Notification type="info" :text="notifyContent" v-if="!isSuccess" />
		<template v-if="currentTab == 0">
			<deposit-form v-if="!isSuccess" :quickInput="quickInput" :mobile="mobile"
			:freeThreshold="freeThreshold" :feeRange="feeRange"
			:wholeMobile="wholeMobile" @success="switchSuccess" :lines="lines"></deposit-form>
			<Success v-else :succData="succData"></Success>
		</template>
		<Paybill v-else :quickInput="quickInput" :freeThreshold="freeThreshold"></Paybill>
	</div>
</template>

<script>
import topNavBar from 'components/navbar';
import Notification from 'components/notification';
import { pagePath } from 'config/pageConfig';
import { getConfig } from 'deposit/index';

import DepositNav from './nav';
import DepositForm from './form';
import Success from './success';
import Paybill from './paybill';

export default {
	components: {
		topNavBar,
		Notification,
		DepositNav,
		DepositForm,
		Success,
		Paybill
	},
	props: {
		mobile: String,
		wholeMobile: String
	},
	data () {
		return {
			currentTab: 0,
			isSuccess: false,
			succData: {},
			tabList: ['Online Deposit', 'Paybill'],
			helpUrl: pagePath.help,
			quickInput: {},
			notifyFn: () => {},
			notifyContent: '',
			linesFn: () => {},
			lines: [],
			feeRange: [],
			freeThreshold: 0,
		};
	},
	created() {
		// this.getDepositGiftsConfig();
		getConfig().then(data => {
			if (data.notifyContent) {
				this.notifyFn = data.notifyContent;
				this.notifyContent = this.notifyFn(1);
			}
			if (data.lines) {
				this.linesFn = data.lines;
				this.lines = this.linesFn(1);
			}
			this.quickInput = data.quickInput;
			this.freeThreshold = data.freeThreshold;
			this.feeRange = data.feeRange;
		});
	},
	methods: {
		tabClick (index) {
			this.currentTab = index;
			this.notifyContent = this.notifyFn(index + 1);
			// this.lines = this.linesFn(index + 1);
		},
		switchSuccess (obj) {
			this.succData = {
				// showCurrency: this.showCurrency,
				amount: obj.amount,
				tradeId: obj.tradeId,
				mobile: this.mobile
			};
			this.isSuccess = true;
		},
	}
};
</script>

<style lang="less">
@import "../index.less";
</style>
