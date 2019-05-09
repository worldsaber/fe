<template lang="html">
	<div>
	<withdrawBlockTip from="withdraw"/>
	<div class="m-wd-ng">
		<af-tabs :value="currentTab" @change="handleTabChange">
			<af-tab-pane label="Online" name="online">
				<section>
					<template v-if="pageLoading">
						<div class="m-error-wrapper">
							<div>
								<i class="m-icon-loading"></i>
								<span class="m-text-msg">Loading...</span>
							</div>
						</div>
					</template>

					<template v-else-if="wdSuccess">
						<Success />
					</template>

					<template v-else-if="bankHistoryList.length">
						<WithdrawList />
					</template>
					<template v-else>
						<WithdrawBank />
					</template>

					<WithdrawTips />
				</section>
			</af-tab-pane>
			<af-tab-pane label="Offline Partner" name="offline">
				<offlineWithdraw/>
			</af-tab-pane>
		</af-tabs>
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
import * as mutationsTypes from 'store/withdraw/ng/mutationTypes';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import { AfTabs, AfTabPane } from 'packages/tabs';
import withdrawBlockTip from 'components/withdrawBlockTip/index.vue';
import WithdrawBank from './wd.vue';
import offlineWithdraw from './offline/offlineWithdraw';
import WithdrawList from './wdList.vue';
import WithdrawTips from './wdTips.vue';
import Success from './success.vue';

import codeVerify from './code.vue';
import smsVerify from './SMS.vue';
import aduitComfirm from './confirmPop.vue';

export default {
	components: {
		WithdrawBank,
		WithdrawList,
		WithdrawTips,
		Success,
		AfTabs,
		AfTabPane,
		offlineWithdraw,
		withdrawBlockTip
	},
	data() {
		return {
			pageLoading: true,
			currentTab: URL.getPara('is_offline') ? 'offline' : 'online'
		};
	},
	computed: {
		...mapState('withdraw', [
			'bankHistoryList',
			'wdSuccess',
			'errorInfo',
			'verifyType',
			'reqLoading'
		]),
		...mapState('codeVerify', [
			'moduleName'
		]),
		...mapState('userCenter', [
			'phone'
		]),
		...mapState('codeVerify', {
			getCordError: 'errorInfo'
		})
	},
	methods: {
		handleTabChange(tab) {
			this.currentTab = tab;
			if (URL.getPara('is_offline')) {
				location.href = URL.removePara('is_offline');
			}
		},
		...mapActions('withdraw', [
			'getHistoryList',
			'getBankList',
		]),
		...mapActions('codeVerify', [
			'getCode'
		]),
		...mapActions('userCenter', [
			'getBalance'
		]),
		...mapMutations('withdraw', {
			chgVerifyType: mutationsTypes.UPDATEVERIFYTYPE,
			clearVerfiyInfo: mutationsTypes.SAVEVERIFYINFO,
			deleteRecord: mutationsTypes.UPDATEBANKHISROEYLIST
		}),
		...mapMutations('userCenter', {
			updatePageTab: ucMutationTypes.UPDATE_CURRENT_TAB
		}),
		getData() {
			Promise.all([
				this.getHistoryList(),
				this.getBankList()
			]).then(list => {
			});
		},
		showSmsPop() {
			this.$dialog();
			this.$dialog({
				title: null,
				content: Vue.extend(smsVerify).mixin({
					store: window.v_store
				}),
				button: []
			});
		},
		showCodePop() {
			this.$dialog();
			this.$dialog({
				title: null,
				content: Vue.extend(codeVerify).mixin({
					store: window.v_store
				}),
				button: []
			});
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
		moduleName(val, oldVal) {
			if (val && !oldVal) {
				this.chgVerifyType(val);
			}
		},
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'dialog':
				this.$dialog();
				this.$dialog({
					title: null,
					contentData: {
						title: val.title || '',
						msg: val.msg,
						cssList: val.showIcon ? 'm-dialog--tips' : ''
					},
					content: CommonPop,
					button: []
				}).onBtnClick(btnType => {
					if (val.jmp) {
						location.href = val.jmp;
					}

					// code验证过程中，token失效，重置验证步骤
					if (val.isTimeout) {
						this.chgVerifyType('');
					}

					if (val.showSmsPop) {
						this.showSmsPop();
					}

					if (val.clearAmount) {
						EventBus.$emit(commonEvent.NOTIFY_CLEAR_AMOUNT);
					}

					if (val.deleteRecord) {
						this.deleteRecord({
							type: 'delete'
						});
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
			// case 'jmp':
			// 	window.open(val.jumpUrl);
			// 	this.chgVerifyType('bank');
			// 	break;
			default:
			}
		},
		verifyType(val) {
			// 验证步骤发生变化，清空验证参数
			this.clearVerfiyInfo(null);

			switch (val) {
			case 'getCode':
				this.getCode({
					phone: this.phone,
					bizType: 'WITHDRAW_CONFIRM'
				}).catch(() => {});
				break;
			case 'code':
				this.showCodePop();
				break;
			case 'sms':
				this.showSmsPop();
				break;
			default:
				this.$dialog();
			}
		},
		getCordError(val) {
			if (val && val.msg) {
				const { msg = '', title = '', moduleName = '' } = val;

				if (moduleName === 'sms') {
					this.chgVerifyType('sms');
				} else {
					this.$dialog();
					this.$dialog({
						title: null,
						contentData: {
							title: title || '',
							msg
						},
						content: CommonPop,
						button: []
					});
				}
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
section {
	border-top: 1px solid #eaecef;
}
</style>
