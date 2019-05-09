<template>
	<div class="tracker-pop-wrap">
		<LiveMatchTracker type="h2h" :eventId="eventId"></LiveMatchTracker>
	</div>
</template>
<script>
import LiveMatchTracker from 'components/liveMatchTracker/liveMatchTracker';

export default {
	props: {
		eventId: String
	},
	components: {
		LiveMatchTracker,
	}
};
</script>
<style lang="less">

</style>
