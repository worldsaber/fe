<template lang="html">
	<div class="m-coupon-wrapper">
		<div class="m-coupon-title" @click="togglePack">
			<span class="m-label">Gifts <span :class="getShowDesc.class">({{getShowDesc.text}})</span></span>
			<div
				class="m-value"
			>

				<!-- 未登录或者没有红包 -->
				<!-- <span
					v-if="!isLogin || !hasData"
					class="m-text"
				>None</span> -->

				<!-- 不使用 -->
				<!-- <span
					v-else-if="skipStaus"
					class="m-text"
				>Skip</span> -->

				<!-- 选中 -->
				<span
					class="m-text"
					:class="getUsedText.class"
				>{{getUsedText.text}}</span>

				<!-- 未选中 -->
				<!-- <span
					v-else
					class="m-text"
				>{{getShowGiftsTips}}</span> -->
				<div
					:class="['m-icon', {
						'm-icon-pack': isPack,
						'm-icon-unpack': !isPack
					}]"
				>
					<div :class="[
							'g-pop-tips',
							{
								'on': showGiftTips
							}
						]"
						>
					<p>{{giftsTips}}</p>
					</div>
				</div>
			</div>
		</div>

		<template v-if="!isPack">
			<div class="m-coupon-opt">
				<p class="m-coupon-tips" v-if="showCashoutTips">Cashout unavailable with bets using gifts</p>
				<div
					v-if="isLogin"
					:class="[
						'm-refresh',
						{
							'is-disabled': loading
						}
					]"
					@click="handleRefresh"
				>Refresh</div>
			</div>
			<CouponsList v-if="hasData" />
			<CouponsError v-else />
		</template>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { LS } from 'storage';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import { getShowCurrency } from 'config/currencyConfig';
import { formatMoneyShow } from 'config/showMoneyConfig';

import * as mutationTypes from 'store/coupons/mutationTypes';

import CouponsError from './pagelet/error.vue';
import CouponsList from './pagelet/list.vue';

let giftsStatus = LS.get('s_giftsTips');
giftsStatus = giftsStatus ? +giftsStatus : 1;

export default {
	name: 'Coupons',

	props: {
		sportType: {
			type: [String, Number],
			'default': 'sport'
		},
		totalStake: {
			type: Number,
			'default': 0
		},
		showCashoutTips: {
			type: Boolean,
			'default': true
		}
	},

	components: {
		CouponsError,
		CouponsList
	},

	data() {
		return {
			isPack: true,
			showCurrency: getShowCurrency(),
			isLogin: window.loginStatus,
			showGiftTips: null,
			timerId: null
		};
	},

	computed: {
		...mapState('coupons', [
			'loading',
			'couponsCount',
			'couponunavailable',
			'errorInfo',
			'giftsTips'
		]),
		...mapGetters('coupons', [
			'checkItem',
			'getRenderList',
			'checkGiftId',
			'skipStaus'
		]),
		...mapState('coupons', {
			isGiftTipsReady: 'giftsStatus'
		}),
		getDiscount() {
			const checkItem = this.checkItem || {};
			window.__debug__ && console.log(checkItem); // eslint-disable-line
			let showValue = checkItem.curBal;
			if (checkItem.curBal > this.totalStake && checkItem.kind === 1) {
				showValue = this.totalStake;
			}
			return formatMoneyShow(showValue);
		},
		hasData() {
			return !!this.getRenderList.length;
		},
		getShowGiftsTips() {
			const getRenderList = this.getRenderList || [],
				len = getRenderList.length || 0;
			return `${len} available`;
		},
		getShowDesc() {
			if (!this.isLogin || !this.hasData) {
				return {
					'class': 'm-text--gray',
					text: 'None'
				};
			}

			return {
				'class': 'm-text--green',
				text: this.getShowGiftsTips
			};
		},
		getUsedText() {
			if (!this.isLogin || !this.hasData) {
				return {
					'class': '',
					text: ''
				};
			}

			if (this.checkGiftId) {
				return {
					'class': 'm-text--green',
					text: `- ${this.showCurrency}${this.getDiscount}`
				};
			}

			return {
				'class': 'm-text--gray',
				text: 'Unused'
			};
		}
	},
	methods: {
		...mapActions('coupons', [
			'getCoupons'
		]),
		...mapMutations('coupons', {
			resetCouponsList: mutationTypes.RESETCOUPONSLIST,
			setSportType: mutationTypes.UPDATEBIZTYPE,
			updateCouponStatus: mutationTypes.COUPONSUNAVAIABLE,
			changeClickedCoupon: mutationTypes.UPDATECLICKEDCOUPON
		}),
		loadData() {
			this.resetCouponsList(false);
			this.getCoupons({
				betType: 0
			});
		},
		handleRefresh() {
			this.loadData();
		},
		togglePack() {
			this.isPack = !this.isPack;
		},
		hideGiftsTips() {
			this.showGiftTips = 0;

			LS.set('s_giftsTips', 0);
		},
		startShowTips() {
			setTimeout(() => {
				this.hideGiftsTips();
				this.removeEvent();
			}, 2000);
		},
		removeEvent() {
			giftsStatus && document.body.removeEventListener('click', this.hideGiftsTips);
		}
	},
	watch: {
		isPack(val, oldVal) {
			const errorInfo = this.errorInfo || {};
			if (!val && !this.couponsCount && errorInfo.type !== 'login') {
				this.loadData();
			}
		},
		couponunavailable(val, oldVal) {
			if (val) {
				this.timerId = setTimeout(() => {
					this.updateCouponStatus(false);
					this.changeClickedCoupon('');
				}, 3000);
			} else {
				const timerId = this.timerId || null;
				if (timerId) {
					clearTimeout(timerId);
					this.timerId = null;
				}
			}
		},
		isGiftTipsReady(val) {
			if (val && giftsStatus) {
				this.showGiftTips = giftsStatus;
				this.startShowTips();
			}
		}
	},
	created() {
		// 设置bizType
		this.setSportType(this.sportType);
		window.loginStatus && this.loadData();
	},
	mounted() {
		// 页面登陆状态变化时，刷出红包列表，或者重置红包列表
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			this.isLogin = window.loginStatus;

			if (window.loginStatus) {
				this.loadData();
			} else {
				this.resetCouponsList(true);
			}
		});

		giftsStatus && document.body.addEventListener('click', this.hideGiftsTips);
	},
	beforeDestroy() {
		this.removeEvent();
	}
};
</script>
