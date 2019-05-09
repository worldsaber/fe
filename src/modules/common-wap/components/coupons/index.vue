<template lang="html">
	<div class="m-coupon-wrapper">
		<div class="m-coupon-title" @click="togglePack">
			<span class="m-label">Choose Gifts
				<span v-if="!isAvailable">(None)</span>
				<span v-else class="m-label--green">
					({{availabledCoupons.length}} available)
				</span>
			</span>
			<div class="m-value">
				<template v-if="isAvailable">
					<!-- 选用红包 -->
					<span v-if="checkGiftId && getDiscount" class="m-text m-text--green">
						- {{showCurrency}}{{getDiscount}}
					</span>

					<!-- 有可用优惠，但未选择 -->
					<span v-else class="m-text">Unused</span>
				</template>

				<i class="m-icon-pack"></i>
			</div>
		</div>

		<PopTips
			v-if="isShowGiftTips"
			:tipsKey="tipsKey"
		>
			Use gifts to bet
		</PopTips>
	</div>
</template>

<script>
import Vuex, { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import Vue from 'vue';
import coupons from 'store/coupons/modules';
import commonEvent from 'config/eventConfig/commonEvent';
import * as mutationTypes from 'store/coupons/mutationTypes';
import PopTips from 'components/popTips';
import { showCurrency } from 'config/currencyConfig';
import { formatMoneyShow } from 'config/showMoneyConfig';
import contentBrige from './pagelet/contentBrige';

export default {
	name: 'Coupons',
	components: {
		PopTips
	},

	props: {
		// 运动类型
		// 业务类型（1-RealSportsGame，2-VirtualSportsGame，3-Jackpot, 4-bingo）
		sportType: {
			type: [String, Number],
			'default': 'sport'
		},
		// 当前订单的总共金额
		totalStake: {
			required: true,
			type: Number
		},
		contentInsertSelector: {
			type: String,
			'default': 'body'
		},
		isShowGiftTips: {
			type: Boolean,
			'default': false
		},
		tipsKey: {
			type: String,
			'default': 's_gift_tips'
		},
		isShowNote: {
			type: Boolean,
			'default': true
		}
	},
	data() {
		return {
			showCurrency,
			isLogin: window.loginStatus
		};
	},
	computed: {
		...mapState('layout', ['showRight']),
		...mapState('coupons', [
			'couponsCount',
			'errorInfo',
			'isPack',
			'betType',
			'couponsGroupList'
		]),
		...mapGetters('coupons', [
			'checkItem',
			'checkGiftId',
			'availabledCoupons'
		]),
		getDiscount() {
			const checkItem = this.checkItem || {};
			let showValue = checkItem.curBal;
			// 直减金额小于等于stake
			if (checkItem.kind === 1 && checkItem.curBal > this.totalStake) { // 直减
				showValue = this.totalStake;
			}
			return formatMoneyShow(showValue);
		},
		hasData() {
			return !!this.couponsGroupList.length;
		},
		isAvailable() {
			return this.isLogin && this.hasData && this.availabledCoupons && this.availabledCoupons.length;
		}
	},
	methods: {
		...mapActions('coupons', [
			'getCouponsGroup'
		]),
		...mapMutations('coupons', {
			resetCouponsList: mutationTypes.RESETCOUPONSLIST,
			setSportType: mutationTypes.UPDATEBIZTYPE,
			updatecheckedgiftid: mutationTypes.UPDATECHECKEDGIFTID,
			togglePack: mutationTypes.TOGGLE_PACK,
			updateRealCouponsGroupList: mutationTypes.UPDATE_REAL_COUPONS_GROUP_LIST
		}),
		loadData() {
			this.resetCouponsList(false);
			this.getCouponsGroup({
				betType: 0
			}).then(() => {
				this.updateRealCouponsGroupList(this.totalStake);
			});
		}
	},
	watch: {
		isPack(val, oldVal) {
			const errorInfo = this.errorInfo || {};
			if (!val && !this.couponsCount && errorInfo.type !== 'login') {
				this.loadData();
			}
		},
		totalStake (val, oldVal) {
			// 金额为0，清除所有bet下的红包
			if (!val) {
				this.updatecheckedgiftid({
					giftId: ''
				});
			} else if (this.checkItem) { // 有选中的红包
				const leastOrderAmount = this.checkItem.leastOrderAmount;
				// leastOrderAmount如果大于0表示，要用的,不符合使用规则，清空当前选择优惠券
				if (leastOrderAmount && leastOrderAmount > val) {
					this.updatecheckedgiftid({
						giftId: ''
					});
				}
			}
			// totalStake 改变，需要更新实际红包组
			if (val !== oldVal) {
				this.updateRealCouponsGroupList(val);
			}
			if (this.__bridgeIns) {
				this.__bridgeIns.totalStake = val;
			}
		}
	},
	created() {
		// 设置bizType
		this.setSportType(this.sportType);
		window.loginStatus && this.loadData();
	},
	mounted() {
		// 这里修改了mount红包列表的逻辑，允许重复加载coupons组件（红包操作条），共用列表页实例.
		if (!this.__bridgeIns) {
			// 未解决ios的bug
			const Brige = Vue.extend(contentBrige);
			const store = new Vuex.Store({
				modules: {
					coupons
				}
			});
			const brige = new Brige({
				store,
				propsData: {
					totalStake: this.totalStake,
					isShowNote: this.isShowNote
				}
			});
			const wrap = document.createElement('div');
			let ele;
			if (this.contentInsertSelector === 'body') {
				ele = document.body;
			} else {
				ele = document.querySelector(this.contentInsertSelector);
			}
			if (!ele) {
				ele = document.body;
			}
			ele.appendChild(wrap);
			brige.$mount(wrap);
			this.brige = brige;
			Vue.prototype.__bridgeIns = this.brige;
		}

		// 登录状态暂时跳过
		// 页面登陆状态变化时，刷出红包列表，或者重置红包列表
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			this.isLogin = window.loginStatus;

			if (window.loginStatus) {
				this.loadData();
			} else {
				this.resetCouponsList(true);
			}
		});
	}
};
</script>
<style lang="less">
@import url('./index.less');
</style>
