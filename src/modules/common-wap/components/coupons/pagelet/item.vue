<template lang="html">
	<li class="m-coupons-item">
		<div class="m-info-ban">
			<div class="m-icon-left"><div></div></div>
			<div :class="[
					'm-coupons-info',
					{
						'm-coupon--green': isLapse,
						'm-coupon--yellow': !isLapse,
						'm-coupon--gray': isDisabled
					}
				]"
			>
				<div class="m-coupons-title">
					<div class="m-coupons-desc" v-if="conditionsText">{{conditionsText}}</div>
					<div class="m-coupons-value">
						<span class="m-lable">{{showCurrency}}</span>
						<span class="m-value">{{coupon.showCurBal}}{{couponsOffText}}</span>
					</div>
					<div class="m-coupons-origin" v-if="originalValue">{{originalValue}}</div>
				</div>

				<div class="m-coupons-detail">
					<div class="m-coupons-type">{{couponsTypeText}}</div>
					<div class="m-coupons-time">{{coupoonsTimeText}}</div>
				</div>

			</div>
		</div>

		<div class="m-operate">
			<a :class="[
				'm-btn',
				{
					'm-btn--checked': isChecked,
					'm-btn--disabled': isDisabled
				}
			]"  @click="selectCoupons">{{ isChecked ? '' : 'Use'}}</a>
		</div>
	</li>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationTypes from 'store/coupons/mutationTypes';
import { showCurrency } from 'config/currencyConfig';

export default {
	name: 'CouponsItem',
	props: {
		coupon: {
			type: Object,
			default() {
				return {};
			}
		},
		// 当前订单的总共金额
		totalStake: {
			required: true,
			type: Number
		},
		// 红包组别
		type: {
			type: Number
		}
	},
	watch: {
		isDisabled: {
			immediate: true,
			handler (val) {
				// 禁用或者金额为0，当前是选中，就清除掉
				if ((val || this.totalStake === 0) && this.checkGiftId === this.coupon.giftId) {
					this.updatecheckedgiftid({
						giftId: ''
					});
				}
			}
		}
	},

	data() {
		return {
			showCurrency,
		};
	},

	computed: {
		...mapState('coupons', [
			'bizType'
		]),
		...mapGetters('coupons', [
			'checkGiftId',
		]),
		isChecked() {
			return !this.isDisabled && this.checkGiftId === this.coupon.giftId;
		},
		isUsed() {
			return this.coupon.curBal < this.coupon.initBal;
		},
		// 1-直减，2-满减
		isLapse() {
			return +this.coupon.kind === 1;
		},
		conditionsText() {
			if (this.isLapse) {
				return '';
			}

			return `On Stakes of ${this.coupon.showCondition} or More`;
		},
		couponsOffText() {
			return this.isLapse && this.isUsed ? ' Left' : ' OFF';
		},
		originalValue() {
			const coupon = this.coupon;
			if (coupon.kind === 1 && this.isUsed) {
				return `Original Value: ${this.showCurrency}${coupon.showInitBal}`;
			}
		},
		couponsTypeText () {
			if (!this.isLapse) {
				return 'Discount Gift';
			}
			return 'Cash Gift';
		},
		coupoonsTimeText () {
			const { isGtUsableTime, showExpireTime, showUsableTime } = this.coupon;
			// 未到可用时间时，显示可用时间段
			if (!isGtUsableTime) {
				return `${showUsableTime} - ${showExpireTime}`;
			}

			return `Expires ${showExpireTime}`;
		},
		// 判断一个红包是否可以使用，如果不可以使用就显示成半透明，点击提示不可以使用
		isDisabled() {
			// 20-DELIVERED，30-USABLE，40-FULLY_USED，90-EXPIRED
			if (this.coupon.status !== 30) {
				return true;
			}

			// A组红包可用，其他显示不可用
			if (this.type !== 10) {
				return true;
			}

			const leastOrderAmount = this.coupon.leastOrderAmount;
			// 没有stake并不是灰色的显示，而是正常显示，但是不能选择
			if (!this.totalStake) {
				return false;
			}
			// leastOrderAmount如果大于0表示，要用的
			if (leastOrderAmount && leastOrderAmount > this.totalStake) {
				return true;
			}
			return false;
		}
	},
	methods: {
		...mapMutations('coupons', {
			changeClickedCoupon: mutationTypes.UPDATECLICKEDCOUPON,
			updatecheckedgiftid: mutationTypes.UPDATECHECKEDGIFTID,
			togglePack: mutationTypes.TOGGLE_PACK,
		}),
		selectCoupons() {
			// 注意弹窗顺序

			// C组：APP或PC专享
			if (this.type === 30) {
				const { deviceChScope = [] } = this.coupon;
				if (deviceChScope.includes(2) && deviceChScope.includes(1)) {
					return this.$toast('Exclusive to the App / PC');
				} else if (deviceChScope.includes(1)) {
					return this.$toast('Exclusive to the App');
				} else if (deviceChScope.includes(2)) {
					return this.$toast('Exclusive to the PC');
				}
			}

			// D组，or还未生效
			if (this.type === 40 || Date.now() < this.coupon.usableTime) {
				return this.$toast('Not in the Valid Date.');
			}

			// E组红包
			if (this.type === 50) {
				return this.$toast('<div><p>Currently not meeting</p><p>the requirements of usage</p></div>');
			}

			// 未输入金额
			if (!this.totalStake) {
				// jackpot 未选上所有的选项
				if (this.bizType === 3) {
					return this.$toast('Please choose from all of the 11 games first.');
				}
				return this.$toast('Please enter a stake first.');
			}

			// B组, or输入的金额不满足优惠要求
			if (this.type === 20 || this.totalStake < this.coupon.showCondition) {
				return this.$toast('Min. Stake Required Not Met.');
			}

			// 红包不可用
			if (this.isDisabled) {
				return this.$toast('<div><p>Currently not meeting</p><p>the requirements of usage</p></div>');
			}

			const giftId = this.coupon.giftId;
			// 更新当前选中红包
			this.changeClickedCoupon(giftId);
			// 将选中的红包放入对象中，分组放
			// betType应该自动切换
			this.updatecheckedgiftid({
				giftId
			});
			// change success，关闭红包列表页面
			// 关闭红包列表页面
			this.togglePack(true);
		}
	}
};
</script>
