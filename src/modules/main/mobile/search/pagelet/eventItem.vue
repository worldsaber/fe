<template lang="html">
	<li class="m-search--event m-col2" @click="jmpDetail">
		<div class="m-l-left">
			<div class="m-line m-time-wrapper">
				<span class="m-icon-live" v-if="event.isLive"></span>
				<span class="m-time">{{event.showDate}}</span>
				<span class="m-game">{{getShowGame}}</span>
			</div>
			<div class="m-line m-caty">{{getShowCaty}}</div>
			<div class="m-line m-against">{{getShowAgainst}}</div>
		</div>
		<div class="m-l-right">
			<i class="m-icon-more"></i>
		</div>
	</li>
</template>

<script>
import { pagePath } from 'config/pageConfig';

export default {
	props: {
		event: {
			type: Object,
			required: true
		}
	},
	computed: {
		getShowCaty() {
			const ret = [],
				item = this.event || {};

			item.catyName && ret.push(item.catyName);
			item.tourName && ret.push(item.tourName);

			return ret.join(' - ');
		},
		getShowAgainst() {
			const ret = [],
				item = this.event || {};

			item.homeTeamName && ret.push(item.homeTeamName);
			item.awayTeamName && ret.push(item.awayTeamName);

			return ret.join(' - ');
		},
		getShowGame() {
			const item = this.event || {};

			if (item.gameId) {
				return `ID ${item.gameId}`;
			}

			return '';
		}
	},
	methods: {
		jmpDetail() {
			const event = this.event || {};

			if (event.isLive) {
				location.href = `${pagePath.home}sport/${event.sportName.toLowerCase()}/live/${event.catyId}/${event.tourId}/${event.eventId}`;
				return;
			}

			location.href = `${pagePath.home}sport/${event.sportName.toLowerCase()}/${event.catyId}/${event.tourId}/${event.eventId}/`;
		}
	}
};
</script>

<style lang="less">
@import '../style/eventItem.less';
</style>
