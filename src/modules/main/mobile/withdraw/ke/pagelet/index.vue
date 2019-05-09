<template>
	<div class="m-uc-wrapper">
		<topNavBar v-if="!isSuccess">
			<a slot="right" :href="`${helpUrl}#/how-to-play/others/how-to-withdraw`"><i class="m-icon--question"></i></a>
		</topNavBar>
		<template v-if="!isSuccess">
			<!-- 这里withdraw block优先级高 -->
			<withdrawTip from="withdraw"/>
			<Notification v-if="!auditStatus" type="info" :text="notifyContent"/>
			<WithdrawForm @success="switchSuccess" :mobile="mobile" :wholeMobile="wholeMobile" 
			:freeThreshold="freeThreshold" :feeRange="feeRange" :additionalFee="additionalFee" :remainAmount="balance" :lines="lines"></WithdrawForm>
		</template>
		<Success v-else :succData="succData"></Success>
		<ShopBanner v-if="!isSuccess" keyword="buyGiftWithdrawPage" />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import topNavBar from 'components/navbar';
import Notification from 'components/notification';
import { pagePath } from 'config/pageConfig';
import { getConfig } from 'withdraw/index';
import withdrawTip from 'components/withdrawBlockTip';
// import { getConfig } from 'deposit/index';
import WithdrawForm from './form';
import Success from './success';
import ShopBanner from '../../../shop/pagelet/adBanner.vue';

export default {
	components: {
		topNavBar,
		WithdrawForm,
		Success,
		Notification,
		ShopBanner,
		withdrawTip
	},
	props: {
		mobile: '',
		wholeMobile: '',
		balance: 0
	},
	data () {
		return {
			// showCurrency: window.showCurrency || 'KSh',
			succData: {},
			isSuccess: false,
			helpUrl: pagePath.help,
			additionalFee: '33',
			freeThreshold: 500,
			feeRange: [],
			notifyFn: () => {},
			notifyContent: '',
			linesFn: () => {},
			lines: [],
		};
	},
	created() {
		getConfig().then(data => {
			this.additionalFee = data.additionalFee;
			this.freeThreshold = data.freeThreshold;
			this.feeRange = data.feeRange;
			if (data.notifyContent) {
				this.notifyFn = data.notifyContent;
				this.notifyContent = this.notifyFn(3);
			}
			if (data.lines) {
				this.linesFn = data.lines;
				this.lines = this.linesFn(3);
			}
		});
	},
	computed: {
		...mapState('assetsInfo', ['auditStatus'])
	},
	methods: {
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
@import "../../../deposit/ke/index.less";
</style>
