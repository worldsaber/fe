<template lang="html">
	<div class="m-coupon-wrapper" v-show="showGift">
		<div class="m-coupon-title" @click="toggleGift">
			<span class="m-label">Choose Gifts
				<span v-if="!isAvailable">(None)</span>
				<span v-else class="m-label--green">
					({{confirmedCoupons.length}} available)
				</span>
			</span>
			<div class="m-value">
				<template v-if="isAvailable">
					<!-- 选用红包 -->
					<span v-if="checkGiftId" class="m-text m-text--green">
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
import { mapState, mapGetters, mapMutations } from 'vuex';
import * as mutationTypes from 'store/coupons/mutationTypes';
import PopTips from 'components/popTips';
import { showCurrency } from 'config/currencyConfig';

export default {
	name: 'Coupons',
	components: {
		PopTips
	},

	props: {
		// 运动类型
		// 业务类型（1-RealSportsGame，2-VirtualSportsGame，3-Jackpot）
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
		}
	},
	data() {
		return {
			showCurrency,
			isLogin: window.loginStatus,
			showGift: true

		};
	},
	created() {
		// 未使用时且有可用红包时显示
		this.showGift = this.isAvailable && !this.checkItem;
	},
	computed: {
		...mapState('layout', ['showRight']),
		...mapState('coupons', [
			'couponsCount',
			'errorInfo',
			'isPack',
			'betType',
		]),
		...mapGetters('coupons', [
			'checkItem',
			'checkGiftId',
			'availabledCoupons'
		]),
		getDiscount() {
			const checkItem = this.checkItem || {};
			// 直减金额小于等于stake
			if (checkItem.kind === 1 && checkItem.curBal > this.totalStake) { // 直减
				return this.totalStake;
			}
			return checkItem.curBal;
		},
		// 点击 Place bet 之后，待下单的可用红包，注意这里与 betslip 弹窗中的条件不一样
		confirmedCoupons() {
			return this.availabledCoupons.filter(x => {
				// 满减红包需要满足要求
				if (x.kind === 2) {
					return this.totalStake >= x.leastOrderAmount;
				}
				return true;
			});
		},
		isAvailable() {
			return this.isLogin && this.confirmedCoupons && this.confirmedCoupons.length;
		}
	},
	methods: {
		...mapMutations('coupons', {
			togglePack: mutationTypes.TOGGLE_PACK,
		}),
		toggleGift() {
			this.togglePack();
		}
	}
};
</script>
