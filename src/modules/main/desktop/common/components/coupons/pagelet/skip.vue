<template lang="html">
	<li class="m-coupons-skip" @click="skipCoupon">
		<div class="m-select-ban">
			<i
				:class="{
					'm-icon-check': !skipStaus,
					'm-icon-checked': skipStaus
				}"
			></i>
		</div>

		<div class="m-info-ban">
			<div>Skip Using Gifts</div>
		</div>
	</li>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import * as mutationTypes from 'store/coupons/mutationTypes';

export default {
	name: 'CouponsSkipItem',

	computed: {
		...mapState('coupons', [
			'couponunavailable'
		]),
		...mapGetters('coupons', [
			'skipStaus'
		])
	},
	methods: {
		...mapMutations('coupons', {
			updateSkipCoupons: mutationTypes.UPDATESKIPCOUPONS
		}),
		skipCoupon() {
			if (!this.skipStaus && !this.couponunavailable) {
				this.updateSkipCoupons(true);
			}
		}
	}
};
</script>
