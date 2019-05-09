<template lang="html">
	<div class="m-coupons-skip">
		<span :class="['btn', {active:skipStaus}]" @click="skipCoupon">Skip Using Gifts</span>
	</div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import * as mutationTypes from 'store/coupons/mutationTypes';

export default {
	name: 'CouponsSkipItem',

	computed: {
		...mapGetters('coupons', [
			'skipStaus'
		])
	},
	methods: {
		...mapMutations('coupons', {
			updateSkipCoupons: mutationTypes.UPDATESKIPCOUPONS,
			togglePack: mutationTypes.TOGGLE_PACK,
		}),
		skipCoupon() {
			this.togglePack(true);
			if (!this.skipStaus) {
				this.updateSkipCoupons(true);
			}
		}
	}
};
</script>
