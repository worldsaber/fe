<template>
<div class="order-match-tracker">
	<topNavBar/>
	<af-tabs :value="currentTab" @change="handleTabChange">
	    <af-tab-pane label="Match Tracker" name="matchTracker">
			<LiveMatchTracker :eventId="currentEventId" v-if="!isCommentary"/>
		</af-tab-pane>
		<af-tab-pane label="Commentary" name="commentary">
			<LiveMatchTracker :eventId="currentEventId" type="commentary" v-if="isCommentary"/>
		</af-tab-pane>
	</af-tabs>
</div>
</template>

<script>
import topNavBar from 'components/navbar';
import { AfTabs, AfTabPane } from 'packages/tabs';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { mapMutations } from 'vuex';

export default {
	data() {
		return {
			currentEventId: decodeURIComponent(this.$route.query.event_id),
			currentTab: 'matchTracker',
			isCommentary: false
		};
	},
	components: {
		LiveMatchTracker,
		topNavBar,
		AfTabs,
		AfTabPane
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING,
		}),
		handleTabChange() {
			if (!this.isCommentary) {
				this.isCommentary = true;
			} else {
				this.isCommentary = false;
			}
		}
	},
	mounted() {
		this.pageLoading(false);
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";

	.order-match-tracker {
		min-height: 100vh;
		background: @dark;
		.m-tabs-nav {
			margin-bottom: 10/@rem;
			width: 200/@rem;
			margin: 0 auto 2/@rem;
			.m-tabs-tab {
				height: 44/@rem;
				line-height: 44/@rem;
				margin-bottom: 10/@rem;
				color: @white;
				font-size: 14/@rem;
			}
			.m-tabs-tab-active {
				font-weight: 900;
				color: @white !important;
			}
			.m-tabs-ink-bar {
				background: @green;
			}
		}
	}
</style>
