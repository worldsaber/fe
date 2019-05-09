<template lang="html">
	<div class="m-dp-gh">
		<DpNav />

		<Success v-if="dpSuccess" />

		<template v-else>
			<template v-if="pageLoading">
				<div class="m-error-wrapper">
					<div>
						<i class="m-icon-loading"></i>
						<span class="m-text-msg">Loading...</span>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="f-dp">
    				<div class="m-dp-sys f-flex" v-if="showSysNotification">
    					<i class="i-tips"></i>
    					<p class="f-flex-item">{{sysNotification}}</p>
    				</div>

					<div class="m-dp-gh-index" id="j_ghBank" v-if="isOnline">
				  	  <AddBank />
				    </div>
    				<Paybill v-else />
    			</div>
			</template>

			<DepositTips />
		</template>
	</div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { userCenter } from 'config/order/userCenterConfig';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import * as dpMutationTypes from 'store/deposit/gh/mutationTypes';
import CommonPop from 'components/popDialog/commonPop';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

import {
	depositType
} from '../js/config';

import DpNav from './nav.vue';
import DepositTips from './depositTips.vue';
import Success from './success.vue';
import Paybill from './paybill.vue';
import AddBank from './addBank.vue';
import CfmPop from './comfirmPop.vue';
import MtnCfmPop from './mtnConfirm.vue';

export default {
	components: {
		DpNav,
		DepositTips,
		Success,
		Paybill,
		AddBank
	},
	data() {
		return {
			pageLoading: true
		};
	},
	computed: {
		...mapState('deposit', [
			'depositType',
			'errorInfo',
			'sysNotification',
			'bankList',
			'reqLoading',
			'dpInfo'
		]),
		...mapGetters('deposit', [
			'showSysNotification',
			'dpSuccess'
		]),
		isOnline() {
			return this.depositType === depositType[0].key;
		},
		isShowMtnCfmPop() {
			// const dpInfo = this.dpInfo || {};
			// return dpInfo && dpInfo.channelShowName === 'MTN Mobile Money';
			return false;
		}
	},
	created () {
		this.updatePageTab(userCenter[4]);
		this.updateDpType(depositType[0].key);
		this.getData();
		this.getSysNote();
	},
	watch: {
		reqLoading(val, oldVal) {
			if (!val) {
				setTimeout(() => {
					this.pageLoading = false;
				}, 500);
			}
		},
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
				this.updatePageModule('index');
			}

			if (val === depositType[0].key) {
				this.getHistoryList();
			}
		},
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'login':
				this.$dialog();
				window.login({ activeTab: 'Log In' });
				return;
			case 'confirm': {
				this.$dialog();
				if (this.isShowMtnCfmPop) {
					this.$dialog({
						title: null,
						content: Vue.extend(MtnCfmPop).mixin({
							store: window.v_store
						}),
						button: []
					});
				} else {
					this.$dialog({
						title: null,
						content: Vue.extend(CfmPop).mixin({
							store: window.v_store
						}),
						button: []
					});
				}
				return;
			}
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
				});
				break;
			default:
			}
		}
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		...mapMutations('deposit', {
			updatePageModule: dpMutationTypes.UPDATEPAGEMODULE,
			updateDpType: dpMutationTypes.UPDATEDEPOSITTYPE
		}),
		...mapActions('userCenter', [
			'getBalance'
		]),
		...mapActions('deposit', [
			'getSysNote'
		]),
		...mapActions('deposit', [
			'getBankList',
			'getHistoryList'
		]),
		getData() {
			this.getHistoryList();
			this.getBankList();
		}
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
@import '../style/index.less';
</style>
