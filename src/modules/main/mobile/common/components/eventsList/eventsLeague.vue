<template>
	<League class="event-league" ref="league" :name="tournamentName" :eventSize="tournament.eventSize" :isShowContent="isInitExpand || autoLoad" @change="onLeagueChange">
		<template v-if="loadStatus === 2 || isInitLoaded">
			<EventList v-if="eventLen > 0"
				:events = "eventsMap.events"
				:eventOrder = "eventsMap.orders"
				:currentMarketIds = "currentMarketIds"
				:sportId = "sportId"
				:productId = "productId">
			</EventList>
			<div class="event-league-empty" v-else>
				No Odds Available  <span class="event-leageue-delete" @click="onDeleteTournament">Delete</span>
			</div>
		</template>
		<template v-else>
			<LoadStatus :loadStatus="loadStatus" @reload="reloadData"></LoadStatus>
		</template>
	</League>
</template>

<script>
import { convertEventsToMap } from 'components/eventUtil/util';
import cookie from 'storage/cookie';
import League from './league';
import EventList from './index';
import LoadStatus from './loadStatus';

export default {
	props: {
		tournament: {
			type: Object,
			required: true,
		},
		sportId: {
			type: String,
			required: true,
		},
		productId: {
			type: Number,
			required: true,
		},
		currentMarketIds: {
			type: Array,
			required: true,
		},
		// length > 0 说明初始加载过
		events: {
			type: Array,
			'default': () => []
		},
		params: {
			type: Object,
			'default': () => ({})
		},
		fetchUrl: {
			type: String,
			'default': '/factsCenter/wapEventsByOrder'
		},
		// 应对tournaments 改变后列表重新load, 重置列表展开状态
		tournamentOptions: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			eventList: [],
			loadStatus: 0, // 0 未尝试， 1 loading 2  done 3 fail
		};
	},
	computed: {
		isInitLoaded() {
			const tour = this.tournament;
			return tour.loaded;  // 第一个tournament events为空，此时是加载状态
		},
		isInitExpand() {
			return this.isInitLoaded;
		},
		eventItems() {
			const events = this.isInitLoaded ? this.events : this.eventList;
			return events;
		},
		eventsMap() {
			const events = JSON.parse(JSON.stringify(this.eventItems));  // convert delete sport属性 引用问题
			const map = convertEventsToMap(events);
			const eventsMap = {
				events: map.map,
				orders: map.order
			};
			return eventsMap;
		},
		eventLen() {
			return this.eventItems.length;
		},
		tournamentName() {
			const tour = this.tournament;
			return `${tour.categoryName || ''} - ${tour.tournamentName || ''}`;
		},
		autoLoad() {
			const tour = this.tournament;
			return tour.autoLoad;
		}
	},
	watch: {
		// autoLoad 从 false 变 true
		autoLoad(value) {
			// 第一个 没有events
			if (value && !this.isInitLoaded) {
				this.reloadData();
			}
		},
		// 过滤条件变化时，重置状态
		params() {
			const isShow = this.isInitLoaded || this.autoLoad; 	// 前面的需要展开
			this.$refs.league.setShowDisplay(isShow); 			// 展开

			this.loadStatus = 0;
			this.eventList = []; // 重置数据
		},
		tournamentOptions(nTour, oTour) {
			// 如果是删除导致的变化，忽略
			if (nTour.tournamentIds === oTour.tournamentIds) {
				return;
			}
			// 如果是删除touranment, 则忽略，不进行状态重置
			if (nTour.ignore) {
				return;
			}
			// 仅设置展开状态，不重置数据
			const isShow = this.isInitLoaded || this.autoLoad; 	// 前面的需要展开
			this.$refs.league.setShowDisplay(isShow); 			// 展开
		},
	},
	methods: {
		// league是否展开
		onLeagueChange(isExpand) {
			if (!isExpand || this.isInitLoaded) {
				return;
			}
			// 如果eventSize = 0 ，直接设置loaded， 没有数据
			if (this.tournament.eventSize === 0) {
				this.loadStatus = 2;
				return;
			}
			if (this.loadStatus === 0) {
				this.loadStatus = 1; 	// init -> loading
				this.fetchData();
			}
		},
		fetchData() {
			const userId = cookie('userId');
			const otherParam = {};
			userId && (otherParam.userId = userId);
			return fetch(this.fetchUrl, {
				body: JSON.stringify({
					...this.params,
					...otherParam,
					tournamentId: [[this.tournament.tournamentId]]
				}),
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				method: 'POST'
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const tournaments = res.data.tournaments;
					this.eventList = tournaments[0].events || [];

					return res.data;
				}
				return Promise.reject(data.message);
			})
			.then(data => {
				this.loadStatus = 2;
				return data;
			})
			.catch(msg => {
				this.loadStatus = 3;
				return Promise.reject(msg);
			});
		},
		onDeleteTournament() {
			this.$emit('deleteTournament', this.tournament.tournamentId);
		},
		reloadData() {
			// 如果eventSize = 0 ，直接设置loaded， 没有数据
			if (this.tournament.eventSize === 0) {
				this.loadStatus = 2;
				return;
			}

			this.loadStatus = 1;
			this.fetchData();
		}
	},
	components: {
		League,
		EventList,
		LoadStatus
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
.event-league-empty{
	text-align: center;
	padding: 20/@rem 0;
}
</style>
