<template lang="html">
	<ul class="m-coupon-list">
		<CouponsSkipItem />
		<CouponsItem
			v-for="item in getRenderList"
			:key="item.giftId"
			:coupon="item"
		/>
	</ul>
</template>

<script>
import { mapGetters } from 'vuex';

import CouponsItem from './item.vue';
import CouponsSkipItem from './skip.vue';

export default {
	name: 'CouponsList',

	components: {
		CouponsItem,
		CouponsSkipItem
	},

	computed: {
		...mapGetters('coupons', [
			'getRenderList'
		])
	}
};
</script>
