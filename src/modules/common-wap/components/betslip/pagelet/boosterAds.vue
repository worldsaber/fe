<template>
	<AdTips v-if="boosterAds">{{boosterAds.text}}</AdTips>
</template>

<script>
/* betslip booster 广告 */
import { mapState, mapActions } from 'vuex';
import AdTips from './adTips';

export default {
	name: 'BoosterAds',
	components: {
		AdTips
	},
	computed: {
		...mapState('betslip', ['betslipAds']),
		boosterAds () {
			const { betslipAds } = this;
			return betslipAds && betslipAds.oddsBoostBetslip;
		}
	},
	methods: {
		...mapActions('betslip', ['fetchBeslipAds']),
	},
	created () {
		this.fetchBeslipAds();
	}
};
</script>

