<template lang="html">
	<div>
	<withdrawBlockTip from="withdraw"/>
	<div class="m-wd-gh">
		<h3 class="m-title">Withdrawal</h3>
		<section>
			<template v-if="pageLoading">
				<div class="m-error-wrapper">
					<div>
						<i class="m-icon-loading"></i>
						<span class="m-text-msg">Loading...</span>
					</div>
				</div>
			</template>

			<Success v-else-if="wdSuccess" />

			<template v-else>
				<WithdrawBank />
				<WithdrawTips />
			</template>
		</section>
	</div>
	</div>
</template>

<script>
import Vue from 'vue';
import {
	mapState,
	mapActions,
	mapMutations
} from 'vuex';
import CommonPop from 'components/popDialog/commonPop';
import 'packages/button/button.vue';
import * as ucMutationTypes from 'store/usercenter/mutationTypes';
import { userCenter } from 'config/order/userCenterConfig';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import withdrawBlockTip from 'components/withdrawBlockTip/index.vue';

import WithdrawBank from './wd.vue';
import WithdrawTips from './wdTips.vue';
import Success from './success.vue';

import aduitComfirm from './confirmPop.vue';

export default {
	components: {
		WithdrawBank,
		WithdrawTips,
		Success,
		withdrawBlockTip
	},
	data() {
		return {
			pageLoading: true
		};
	},
	computed: {
		...mapState('withdraw', [
			'wdSuccess',
			'errorInfo',
			'reqLoading'
		]),
		...mapState('userCenter', [
			'phone'
		]),
	},
	methods: {
		...mapActions('withdraw', [
			'getBankList',
			'getHistoryList'
		]),
		...mapActions('userCenter', [
			'getBalance'
		]),
		...mapMutations('userCenter', {
			updatePageTab: ucMutationTypes.UPDATE_CURRENT_TAB
		}),
		getData() {
			this.getHistoryList();
			this.getBankList();
		}
	},
	watch: {
		// 提现成功，更新账号余额
		wdSuccess (val) {
			if (val) {
				this.getBalance();

				const errorInfo = this.errorInfo || {};

				if (!errorInfo.msg) {
					this.$dialog();
				}
			}
		},
		reqLoading(val, oldVal) {
			if (!val) {
				setTimeout(() => {
					this.pageLoading = val;
				}, 500);
			}
		},
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'login':
				this.$dialog();
				window.login({ activeTab: 'Log In' });
				return;
			case 'dialog':
				this.$dialog();
				this.$dialog({
					title: null,
					contentData: {
						title: val.title || 'Note',
						msg: val.msg,
						cssList: val.showIcon ? 'm-dialog--tips' : ''
					},
					content: CommonPop,
					button: []
				}).onBtnClick(btnType => {
					if (val.jmp) {
						location.href = val.jmp;
					}

					if (val.clearAmount) {
						EventBus.$emit(commonEvent.NOTIFY_CLEAR_AMOUNT);
					}

					if (val.refresh) {
						window.location.reload();
					}
				});
				break;
			case 'confirmAudit':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(aduitComfirm).mixin({
						store: window.v_store
					}),
					button: []
				});
				break;
			default:
			}
		}
	},
	created() {
		this.updatePageTab(userCenter[5]);

		this.getData();
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.pageLoading = true;
				this.getData();
			}
		});
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
@import '../style/index.less';
@import '../style/pageLoading.less';
.s-page{
	.m-me-box();
}
</style>
