<template>
	<div class="prematch-live-banner" v-if="liveSize" @click="onJumpLive">
		<span class="banner-text"><span class="live-label">Live In-Play</span> <span class="live-num">{{ liveSize }}</span> </span>
		<i class="arrow-right"></i>
	</div>
</template>
<script>
import { baseUrl } from 'config/pageConfig';
import { sportsConfigById } from 'config/sports';

export default {
	data() {
		return {
			liveSize: 0,
			events: [],
		};
	},
	created() {
		this.getLiveMatchSize();
	},
	computed: {
		link() {
			const event = this.events[0];
			const sportId = event ? event.id : 'sr:sport:1';
			const sport = sportsConfigById[sportId];
			const name = sport.name;
			return `${baseUrl}sport/${name}/live_list`;
		}
	},
	methods: {
		// 获取live比赛个数，product=1表示live
		getLiveMatchSize () {
			fetch('/factsCenter/sportList', {
				method: 'GET',
				body: {
					productId: 1,
					option: 1
				}
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const events = res.data || [];
					this.events = events;
					this.liveSize = events.reduce((sum, event) => sum += event.eventSize, 0);
				}
			});
		},
		onJumpLive() {
			window.location.href = this.link;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.prematch-live-banner{
	display: flex;
	justify-content: space-between;
	height: 40/@rem;
	padding: 0 10/@rem 0 16/@rem;
	line-height: 40/@rem;
	font-size: 16/@rem;
	color: @dark;
	background: #1B1E25;
	border-bottom: 1px solid @fogGrayBorder;
	.live-label{
		color: #FFF;
		font-size: 14/@rem;
	}
	.live-num{
		line-height: 16/@rem;
		padding: 0 5/@rem;
		color: #32ce62;
		background: #393c43;
		border-radius: 2/@rem;
		font-size: 14/@rem;
		line-height: 16/@rem;
	}
	.arrow-right{
		.m-icon-arrow--right();
		color: #9ca0ab;
	}
}
</style>

