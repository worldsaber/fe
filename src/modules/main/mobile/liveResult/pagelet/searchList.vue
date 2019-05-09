<template>
  <section class="result-list search-list">
	<template v-if="length">
		<dl class="list" v-for="tournament in searchList.tournaments" :key="tournament.name">
			<dt >{{tournament.categoryName}} - {{tournament.name}}</dt>
			<dd v-for="event in tournament.events" :key="event.eventId">
				<Event :data="event"/>
			</dd>
		</dl>
	</template>
	<div class="isEmpty" v-else>No results at this time</div>
  </section>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { UPDATE_SEARCHLIST } from 'store/liveResult/mutationTypes';
import Event from './event';

export default {
	name: 'searchList',
	components: {
		Event
	},
	computed: {
		...mapState('liveResult', ['searchList']),
		length() {
			return !!this.searchList.tournaments ? this.searchList.tournaments.length : 0;
		}
	},
	methods: {
		...mapMutations('liveResult', {
			clearList: UPDATE_SEARCHLIST
		}),
	},
	destroyed() {
		this.clearList([]);
	}
};
</script>
<style lang="less">
@import './list.less';
.search-list{
	padding-top: 10/@rem;
}
</style>
