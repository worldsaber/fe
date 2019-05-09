<template lang="html">
	<li class="m-coupons-item"
		@click="selectCoupons"
	>
		<div class="m-select-ban">
			<i
				:class="{
					'm-icon-check': !isChecked,
					'm-icon-checked': isChecked
				}"
			></i>
		</div>

		<div class="m-info-ban">
			<div class="m-icon-left"><div></div></div>
			<div class="m-icon-right"><div></div></div>
			<div :class="[
					'm-coupons-info',
					{
						'm-coupon--green': isLapse,
						'm-coupon--yellow': !isLapse
					}
				]"
			>
				<div class="m-coupons-title">
					<div class="m-desc" v-if="getGiftsDesc">{{getGiftsDesc}}</div>
					<div class="m-gift-value">
						<span class="m-gift-label">{{showCurrency}}</span>
						{{coupon.showCurBal}} {{getGiftDesc}}
					</div>
					<div class="m-original" v-if="getOriginalValue">{{getOriginalValue}}</div>
				</div>

				<div class="m-coupons-detail">
					<p class="m-coupons-desc">{{getShowConditions}}</p>
					<p class="m-coupons-time">Expires {{coupon.showExpireTime}}</p>
				</div>

				<template v-if="isDisabled">
					<div class="m-coupon--gray">
						<p>{{getMaskTips}}</p>
					</div>
				</template>
			</div>
		</div>
	</li>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationTypes from 'store/coupons/mutationTypes';
import { getShowCurrency } from 'config/currencyConfig';

export default {
	name: 'CouponsItem',

	props: {
		coupon: {
			type: Object,
			default() {
				return {};
			}
		}
	},

	data() {
		return {
			showCurrency: getShowCurrency(),
		};
	},

	computed: {
		...mapState('coupons', [
			'clickedGiftId',
			'couponunavailable',
			'disabledTips'
		]),
		...mapGetters('coupons', [
			'checkGiftId',
		]),
		isChecked() {
			return this.checkGiftId === this.coupon.giftId;
		},
		// 1-直减，2-满减
		isLapse() {
			return +this.coupon.kind === 1;
		},
		getShowConditions() {
			if (this.isLapse) {
				return 'Cash Gift';
			}

			return 'Discount Gift';
		},
		getGiftDesc() {
			if (this.isLapse && this.coupon.isUsed) {
				return ' Left';
			}

			return ' OFF';
		},
		getOriginalValue() {
			if (this.isLapse && this.coupon.isUsed) {
				return `Original Value: ${this.showCurrency}${this.coupon.showInitBal}`;
			}
		},
		isDisabled() {
			return (!!this.coupon.maskTips || this.couponunavailable) && (this.clickedGiftId === this.coupon.giftId);
		},
		getMaskTips() {
			return this.coupon.maskTips || this.disabledTips;
		},
		getGiftsDesc() {
			const coupon = this.coupon || {};
			if (this.isLapse) {
				return '';
			}

			return `On Stakes of ${coupon.showCondition} or More`;
		}
	},
	methods: {
		...mapMutations('coupons', {
			changeClickedCoupon: mutationTypes.UPDATECLICKEDCOUPON
		}),
		selectCoupons() {
			// if (this.couponunavailable) {
			// 	return;
			// }

			const giftId = this.coupon.giftId;

			this.changeClickedCoupon('');
			this.$nextTick(() => {
				this.changeClickedCoupon(giftId);
			});
		}
	}
};
</script>
