<template lang="html">
	<div :class="[
		'm-betslips',
		{
			'm-betslips--green': isFlexi
		}
	]">
		<template v-if="betslipLoading">
			<div class="m-betslips-loading">
				<div>
					<i class="m-icon-loading"></i>
					<p class="m-text-msg">Loading…</p>
				</div>
			</div>
		</template>

		<template v-if="hasBet">
			<div
				class="m-list-nav"
				v-show="showBetTab"
			>
				<AfTable>
					<AfTableRow>
						<AfTableCell
							v-for="type in betType"
							:key="type"
							@click.native="handleChangeTab(type)"
							:class="{
								'm-table-cell--active': currentType === type,
								'm-table-cell-disabled': (type === 'multiple' && !supportMultiple) || (type === 'system' && !supportSystem)
							}"
						>
							{{type === 'single' ? 'singles' : type}}
							<span class="m-label--flex" v-if="showFlexiLable(type)"></span>
						</AfTableCell>
					</AfTableRow>
				</AfTable>
			</div>
			<div
				:class="[
					'm-opertaion',
					{
						'm-opertaion-fix': !showBetTab
					}
				]"
			>
				<AfTable>
					<AfTableRow>
						<AfTableCell v-show="showBankerTip">
							<i
								:class="[
									'm-icon--switch',
									{
										'm-icon--switch-active': hasBanker
									}
								]"
								@click="changeBankerStatus"
							></i>
							<span>Banker</span>
							<div class="m-icon--tips">
								<PopOver position="bottom">
									<p>A banker is a selection which a customer believes is certain to win. If a Banker is selected, it will be included in every combination and must win in order to provide a return on the bet.</p>
								</PopOver>
							</div>
						</AfTableCell>
						<AfTableCell class="m-align--right">
							<span
								class="m-text-min"
								v-show="showBetTab"
								@click="handleClear"
							>Remove All</span>
						</AfTableCell>
					</AfTableRow>
				</AfTable>
			</div>
			<div
				:class="[
					'm-list',
					{
						'm-list-fix': showBankerBar
					}
				]"
			>
				<BetslipsList
					v-for="slip in getBetslips"
					:key="slip.key"
					:slip="slip"
					:showBankerBar="showBankerBar"
					:isBanker="isBanker(slip)"
					:showCheckBox="showCheckbox"
					:checked="getOutcomeChecked(slip)"/>
			</div>
			<div class="m-stake">
				<BetslipsStake :coins="coins" />
			</div>
			<div class="m-share--wrapper">
				<div>
					<span @click="handleShare">Share Betslip</span>
					<span @click="printBetslips">Print</span>
				</div>
			</div>
		</template>
		<template v-else>
			<SearchBet />
		</template>

		<div class="m-print-bar">
			<div id="j_betslips_print" v-show="hasPrintInit">
				<BetslipPrint />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';

import { EventBus } from 'kernel/js/eventBus.js';
import 'packages/tableLayout';

import listEvent from 'config/eventConfig/listEvent.js';
import commonEvent from 'config/eventConfig/commonEvent.js';

import * as mutationTypes from 'store/betslip/mutationTypes';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import * as stakeMutationTypes from 'store/betslipStake/mutationTypes';

import PopOver from 'components/popOver';

import 'lib/print';

import BetslipsList from './pagelet/list.vue';
import BetslipsStake from './pagelet/stake.vue';
import SearchBet from './pagelet/searchBet.vue';
import PopSuccess from './pagelet/popSuccess.vue';
import PopTips from './pagelet/popTips.vue';
import BetslipPrint from './pagelet/betslipsPrint';

let popDialog = null;

export default {
	name: 'Betslips',

	componentName: 'Betslips',

	components: {
		BetslipsList,
		BetslipsStake,
		SearchBet,
		PopOver,
		BetslipPrint
	},

	data() {
		return {
			hasBanker: false,
			hasPrintInit: false,
			coins: window.coins || 0
		};
	},

	computed: {
		...mapGetters('betslip', [
			'hasBet',
			'getBetslips',
			'getOutcomeKeys',
			'getSelectList',
			'getBetCount',
			'supportBanker',
			'isSupportFlexiBet',
			'isFlexi'
		]),
		...mapState('betslip', [
			'betType',
			'currentType',
			'bankerList',
			'bankerStatus',
			'threshold',
			'systemThreshold',
			'supportMultiple',
			'supportSystem',
			'acceptStatus',
			'betslipLoading',
			'isInit'
		]),
		...mapState('betslipStake', [
			'errorInfo',
			'orderInfo',
			'showCurrency'
		]),
		...mapState('coupons', [
			'comfirmError'
		]),
		showBankerBar() {
			return this.supportBanker && this.hasBanker && this.currentType === 'system';
		},
		showBankerTip() {
			return this.supportBanker && this.currentType === 'system';
		},
		showBetTab() {
			return this.getBetCount > 1;
		},
		showCheckbox() {
			// return this.getBetCount > 1;
			return true;
		}
	},

	watch: {
		betslipLoading(val) {
			if (!val) {
				this.updateGiftStatus(true);
			}
		},
		acceptStatus(val, oldVal) {
			// 点击accept changes后，acceptStatus从true变成false
			!val && oldVal && this.emitBetslipChanges();
		},
		orderInfo(val, oldVal) {
			if (val) {
				this.$dialog();
				popDialog = this.$dialog({
					title: null,
					contentData: val,
					content: PopSuccess,
					button: []
				}).onBtnClick(btnType => {
					this.hidePop('reset');
					return false;
				});
			}
		},
		errorInfo(val, oldVal) {
			if (val && val.msg) {
				this.$dialog();
				popDialog = this.$dialog({
					title: null,
					contentData: val,
					content: PopTips,
					button: []
				}).onBtnClick(btnType => {
					this.hidePop(val.optType);
					return false;
				});
			}
		},
		bankerStatus(val) {
			this.hasBanker = val;
		},

		// 生单红包检验失败，提示
		comfirmError(val) {
			if (val) {
				this.$dialog();
				popDialog = this.$dialog({
					title: null,
					contentData: {
						title: 'Gift unavailable',
						msg: 'The gift you have chosen can not be used at this time, please try another one.'
					},
					content: PopTips,
					button: []
				}).onBtnClick(btnType => {
					this.hidePop(val.optType);
					return false;
				});
			}
		},

		currentType(val, oldValue) {
			if (oldValue === 'system' && !this.supportSystem) {
				this.showSystemTips();
				this.changeChecked({
					giftId: '',
					type: 'system'
				});
			}

			if (oldValue === 'multiple' && !this.supportMultiple) {
				this.changeChecked({
					giftId: '',
					type: 'multiple'
				});
			}

			this.changeCouponBetType(val);
		},

		getBetCount(val) {
			if (!val) {
				this.changeChecked({
					clear: true
				});

				// 重置stake
				this.resetStake();
			}

			if (val === 1) {
				this.changeChecked({
					giftId: '',
					type: 'multiple'
				});
				this.changeChecked({
					giftId: '',
					type: 'system'
				});
			}

			EventBus.$emit(commonEvent.NOTIFY_BET_COUNT, val);
		},
		isSupportFlexiBet(val, oldVal) {
			if (!val) {
				this.updateMultipleMode(1);
			}
		}
	},

	methods: {
		...mapActions('betslip', [
			'addBetSlip',
			'clearAllBetSlips',
			'refreshBetslip',
			'createCode',
			'loadBetslip',
			'subscription',
			'unSubscription',
			'getFlexConfig',
			'unsubFlex',
			'subFlex'
		]),
		...mapActions('coupons', [
			'getCoupons'
		]),
		...mapActions('bonus', [
			'getBonus'
		]),
		...mapMutations('betslip', {
			changeBetType: mutationTypes.UPDATEBETTYPE,
			updateBankerStatus: mutationTypes.UPDATEBANKERSTATUS,
			updateInitState: mutationTypes.UPDATEINITSTATE,
			updateMultipleMode: mutationTypes.UPDATEMULTIPLEMODE
		}),
		...mapMutations('betslipStake', {
			resetStake: stakeMutationTypes.RESETSTAKE
		}),
		...mapMutations('coupons', {
			changeCouponBetType: couponMutationTypes.UPDATEBETTYPE,
			changeChecked: couponMutationTypes.UPDATECHECKEDGIFTID,
			resetCoupons: couponMutationTypes.RESETCOUPONSLIST,
			updateGiftStatus: couponMutationTypes.UPDATEGIFTSTATUS
		}),
		showFlexiLable(type) {
			return type === 'multiple' && this.isSupportFlexiBet;
		},
		handleClear() {
			this.clearAllBetSlips();

			// 通知其他列表，重置outcome list状态
			EventBus.$emit(commonEvent.RESET_BET_SLIPS);

			// 重置stake
			this.resetStake();

			// 清空红包列表
			this.resetCoupons();

			// 去掉url参数中的shareCode参数
			const shareCode = URL.getPara('shareCode');
			if (shareCode && history.replaceState) {
				const modifiedUrl = URL.removePara(document.URL, 'shareCode');
				history.replaceState(null, document.title, modifiedUrl);
			}
		},
		getOutcomeChecked(slip) {
			return this.getSelectList.includes(slip.key);
		},
		changeBankerStatus() {
			this.hasBanker = !this.hasBanker;
			this.updateBankerStatus(this.hasBanker);
		},
		isBanker(slip) {
			return this.bankerList.includes(slip.key);
		},
		handleChangeTab(type) {
			if (!this.supportMultiple && type === 'multiple') {
				return;
			}

			if (!this.supportSystem && type === 'system') {
				this.showSystemTips();
				return;
			}

			this.changeBetType(type);
			this.changeCouponBetType(type);
		},
		emitBetslipChanges() {
			// 向别的module提供本地存储的betslip keys
			EventBus.$emit(commonEvent.NOTIFY_BETSLIPS_CHANGE, this.getOutcomeKeys);
		},
		hidePop(action = '') {
			if (popDialog) {
				popDialog && popDialog.close();
				popDialog = null;
			}

			// 清空投注列表
			if (action === 'clear' || action === 'reset') {
				this.handleClear();

				// 重置stake的值
				this.resetStake();
			}

			// 刷新账号余额
			if (action === 'reset' || action === 'refreshAsset') {
				EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
			}

			// 刷新红包列表
			if (action === 'coupons') {
				this.getCoupons({
					betType: 0
				});
			}

			// flexibet
			if (action === 'flexibet') {
				this.getFlexConfig();
			}
		},
		showSystemTips() {
			this.$dialog();
			popDialog = this.$dialog({
				title: null,
				contentData: {
					title: 'Note',
					msg: `There cannot be over <span class="m-tips-strong">${this.systemThreshold}</span> selections under System.Sorry for the inconvenience.`
				},
				content: PopTips,
				button: []
			}).onBtnClick(btnType => {
				this.hidePop();
				return false;
			});
		},
		showBetTips() {
			this.$dialog();
			popDialog = this.$dialog({
				title: null,
				contentData: {
					title: 'Note',
					msg: `There cannot be over ${this.threshold} selections within a betslip. Sorry for the inconvenience.`
				},
				content: PopTips,
				button: []
			}).onBtnClick(btnType => {
				this.hidePop();
				return false;
			});
		},
		// 分享
		handleShare() {
			this.createCode()
			.then(ret => {
				this.$dialog();
				popDialog = this.$dialog({
					title: null,
					contentData: Object.assign(
						ret,
						{
							optType: 'share',
							title: 'Share Betslip',
							msg: 'Booking code is used for your betslip reservation or sharing. Your friends can place the same bet with yours when they input the code or visit the code link.'
						}
					),
					content: PopTips,
					button: []
				}).onBtnClick(btnType => {
					this.hidePop();
					return false;
				});
			}, err => { // eslint-disable-line
				this.$dialog();
				popDialog = this.$dialog({
					title: null,
					contentData: {
						msg: 'No internet connection, try again.'
					},
					content: PopTips,
					button: []
				}).onBtnClick(btnType => {
					this.hidePop();
					return false;
				});
			});
		},
		printBetslips() {
			!this.hasPrintInit && (this.hasPrintInit = true);

			this.createCode()
			.then(ret => {
				window.printJS('j_betslips_print', 'html');
			}, err => { // eslint-disable-line
				window.printJS('j_betslips_print', 'html');
			});
		},
		updateCoins(opt) {
			const { coins = 0 } = opt || {};
			this.coins = coins;
		}
	},
	/*
	请求快照信息
	 */
	created() {
		if (this.isInit) {
			return;
		}

		if (this.getOutcomeKeys.length) {
			// 快照优先
			this.refreshBetslip().then(res => {
				if (res && res.betslipRefresh === 'done') {
					this.loadBetslip().then(ret => {
						if (ret && !ret.loadBetError) {
							// code load 成功，订阅消息
							this.subscription();
						}

						this.updateInitState(true);
					}, err => {}); // eslint-disable-line
				}
			});
		} else {
			this.loadBetslip().then(ret => {
				if (ret && !ret.loadBetError) {
					// code load 成功，订阅消息
					this.subscription();
				}

				this.updateInitState(true);
			}, err => {}); // eslint-disable-line
		}

		this.getFlexConfig();
		this.getBonus();
	},
	mounted() {
		EventBus.$on(listEvent.LIST_ITEM_ADD, this.addBetSlip);
		EventBus.$on(commonEvent.NOTIFY_REACH_TRESHOLD, this.showBetTips);
		EventBus.$emit(commonEvent.NOTIFY_BET_COUNT, this.getOutcomeKeys.length || 0);
		EventBus.$on(commonEvent.SYNC_ACCOUNT_BALANCE, this.updateCoins);

		this.emitBetslipChanges();

		this.hasBanker = this.bankerStatus;

		this.changeCouponBetType(this.currentType);

		// 统一订阅消息
		this.subscription();
		this.subFlex();
	},
	destoryed() {
		this.unSubscription();
		this.unsubFlex();
		EventBus.$off(listEvent.LIST_ITEM_ADD);
		EventBus.$off(commonEvent.NOTIFY_REACH_TRESHOLD);
		EventBus.$off(commonEvent.NOTIFY_BET_COUNT);
		EventBus.$off(commonEvent.SYNC_ACCOUNT_BALANCE);
	}
};
</script>
<style lang="less">
@import 'base/style/variable.less';

.m-betslips {
	.m-popOver-wrapper {
		width: 240px !important;
		padding: 10px;
		margin: 7px;
		border: none;

		.m-popOver-arrow--bottom {
			top: -5px !important;
			border: none;
		}

		.m-popOver > p {
			font-size: 12px;
			line-height: 16px;
			color: @darkGray;
		}
	}
}
</style>
