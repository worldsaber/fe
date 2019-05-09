<template>
	<!-- <LiveMatchStatistics class="dialog-statistcs" :eventId="contentData.eventId"/> -->
	<LiveMatchTracker class="dialog-live-tracker" :eventId="contentData.eventId"/>
</template>

<script>
// import LiveMatchStatistics from 'packages/liveMatchStatistics/index.vue';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker.vue';

export default {
	data() {
		return {};
	},
	components: {
		LiveMatchTracker
	},
};
</script>

<style lang="less">
.dialog-live-tracker {
	width: 575px;
}
</style>
