<template lang="html">
	<div class="m-coupon-list">
		<CouponsSkipItem />
		<template v-for="group in realCouponsGroupList">
			<h3 class="m-coupon-group-title" v-if="group.type !== 10">
				{{getGroupTitle(group)}}
			</h3>
			<ul>
				<CouponsItem
					v-for="item in group.gifts"
					:key="item.giftId"
					:coupon="item"
					:type="group.type"
					:totalStake = 'totalStake'
				/>
			</ul>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import CouponsItem from './item.vue';
import CouponsSkipItem from './skip.vue';

export default {
	name: 'CouponsList',
	props: {
		// 当前订单的总共金额
		totalStake: {
			required: true,
			type: Number
		}
	},
	components: {
		CouponsItem,
		CouponsSkipItem
	},
	computed: {
		...mapState('coupons', [
			'realCouponsGroupList'
		])
	},
	methods: {
		getGroupTitle (group) {
			switch (group.type) {
			case 20:
				// B
				return 'Min. Stake Required Not Met';
			case 30: // eslint-disable-line
				// C
				const isPcSpecial = group.gifts.some(x => x.deviceChScope.includes(2));
				// PC 专享
				if (isPcSpecial) {
					return 'Exclusive to the APP / PC';
				}
				return 'Exclusive to the APP';
			case 40:
				// D
				return 'Not in the Valid Date';
			case 50:
				// E
				return 'Other unusable reasons';
			default:
				return '';
			}
		}
	}
};
</script>
