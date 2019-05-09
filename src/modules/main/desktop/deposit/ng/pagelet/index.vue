<template lang="html">
	<div class="m-dp-ng">
		<DpNav />

		<template v-if="dpSuccess">
			<Success />
		</template>

		<template v-else>
			<div class="f-dp">
				<template v-if="isCard">
					<CardPanel />
				</template>
				<template v-else-if="isQuick">
					<Quickteller />
				</template>
				<template v-else-if="isGT">
					<GTBank />
				</template>
				<template v-else>
					<BankPanel />
				</template>
			</div>

			<DepositTips v-show="!isQuick && !isGT"/>
		</template>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { userCenter } from 'config/order/userCenterConfig';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import * as dpMutationTypes from 'store/deposit/ng/mutationTypes';

import DpNav from './nav.vue';
import CardPanel from './cardPanel.vue';
import BankPanel from './bankPanel.vue';
import DepositTips from './depositTips.vue';
import Success from './success.vue';
import GTBank from './gtBank';
import Quickteller from './quickteller';

export default {
	components: {
		DpNav,
		CardPanel,
		BankPanel,
		DepositTips,
		Success,
		GTBank,
		Quickteller
	},
	computed: {
		...mapState('deposit', [
			'depositType',
			'dpSuccess',
			'verifyType',
			'errorInfo'
		]),
		isCard() {
			return this.depositType === 'card';
		},
		isGT() {
			return this.depositType === 'gt bank';
		},
		isQuick() {
			return this.depositType === 'quickteller';
		}
	},
	created () {
		this.updatePageTab(userCenter[4]);
	},
	watch: {
		// 充值成功，更新账号余额
		dpSuccess(val) {
			if (val) {
				this.getBalance();

				const errorInfo = this.errorInfo || {};

				if (!errorInfo.msg) {
					this.$dialog();
				}
			}
		},
		// tab切换时，更新成功状态
		depositType(val) {
			if (this.dpSuccess) {
				this.updateDpStatus(false);
			}
		},
		verifyType(val) {
			if (!val) {
				this.$dialog();
			}
		}
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		...mapMutations('deposit', {
			updateDpStatus: dpMutationTypes.UPDATEDEPOSITRESULT
		}),
		...mapActions('userCenter', [
			'getBalance'
		]),
	}
};
</script>

<style lang="less">
@import '../style/index.less';
</style>
