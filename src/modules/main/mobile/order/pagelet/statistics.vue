<template>
	<div class="stat-wrapper">
		<topNavBar/>
		<LiveMatchStatistics :eventId="currentEventId" v-if="jp_showStatistics"/>
	</div>
</template>

<script>
import LiveMatchStatistics from 'packages/liveMatchStatistics/index.vue';
import { mapState, mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import topNavBar from 'components/navbar';
import * as mutationTypes from 'store/order/mutationTypes';

export default {
	components: {
		LiveMatchStatistics,
		topNavBar
	},
	data() {
		return {
			currentEventId: decodeURIComponent(this.$router.currentRoute.query.eventId),
		};
	},
	computed: {
		...mapState('order', [
			'jp_showStatistics',
		]),
	},
	methods: {
		...mapMutations('order', {
			showStatistics: mutationTypes.SHOWJPSTATISTICS
		}),
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING,
		}),
	},
	created() {
		this.showStatistics();
		this.pageLoading(false);
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
	.stat-wrapper {
		min-height: 100vh;
		background: @dark;
	}
</style>
