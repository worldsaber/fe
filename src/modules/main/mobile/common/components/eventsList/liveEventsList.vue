<template>
	<AfTable :class="[
	'm-live-table',
	sportName
	]">
		<!-- 循环日期 -->
		<AfTableRow class="m-name-row">
			<AfTableCell class="m-name-cell">
				<div v-for="marketId in currentMarketIds" class="m-name" :key="marketId">
					<div class="market-name" v-for="(title, index) in getTitle(marketId)" :key="index">{{title}}</div>
				</div>
			</AfTableCell>
		</AfTableRow>
		<template v-for="(dateEvents, key) in eventOrder">
			<template v-for="(eventId, index) in dateEvents">
				<!-- 比赛行 -->
				<Event
					v-if="!onlyShowLiveStream || onlyShowLiveStream && events[eventId] && events[eventId].liveChannel"
					:key="eventId"
					:event="events[eventId]"
					:currentMarketIds="currentMarketIds"
					:sportId="sportId"
					:productId="productId"
					:sportName="sportName"
					:isShowEventLeagueName="isShowEventLeagueName"
					:isShowLiveMark="isShowLiveMark"
					:isEventBoost="isEventBoost">
				</Event>
			</template>
		</template>
	</AfTable>
</template>

<script>
	/**
	 * 针对一个events的列表做显示
	 */
	import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
	import Event from 'components/event';
	import { marketsTtile } from 'components/eventsList/util';
	import { sportsConfigById } from 'config/sports';

	export default {
		name: 'LiveEventsList',
		components: {
			AfTable,
			AfTableRow,
			AfTableCell,
			Event
		},
		props: {
			// 决定所有比赛排列的顺序，以及如果没有比赛的显示
			eventOrder: {
				required: true,
				type: Object,
				default () {
					return [];
				}
			},
			// 里面有所有的比赛的map，应该与eventOrder相匹配
			events: {
				required: true,
				type: Object,
				default () {
					return {};
				}
			},
			// 当前需要显示的marketId数组-因为后台可能传递多个market，我们不一定显示，我们这里定义要显示的market
			currentMarketIds: {
				required: true,
				type: Array
			},
			sportId: {
				type: String
			},
			// 1(直播),3(赛前)
			productId: {
				type: [String, Number],
				required: true
			},
			isShowEventLeagueName: {
				type: Boolean,
				'default': false
			},
			isEventBoost: {
				type: Function,
			},
			// 是否显示"LIVE"文案
			isShowLiveMark: {
				type: Boolean,
				'default': false
			},
			onlyShowLiveStream: {
				type: Boolean,
				'default': false
			}
		},
		computed: {
			sportName () {
				return sportsConfigById[this.sportId].name;
			}
		},
		methods: {
			/**
			 * title并不是每个market都由，title只在列表页面中有用，title就是desc的另外一种描述形式
			 * 目前已经有的title
			 */
			getTitle(marketId, market) {
				let originTitle = '';
				if (market) {
					//  speciefier的market是数组
					if (market.length) {
						market = market[0];
					}
					originTitle = market.originTitle || '';
				}
				originTitle = originTitle.split(',');
				if (originTitle.length > 1) {
					return originTitle;
				}
				if (marketsTtile[this.sportId] && marketsTtile[this.sportId][marketId]) {
					return marketsTtile[this.sportId][marketId];
				}
				return [];
			},
			// 暂时无用
			converNum (num) {
				if (!num) {
					return '';
				}
				num = String(num);
				const shu = {
					1: 'st',
					2: 'nd',
					3: 'rd'
				};
				const endS = /\d*(1|2|3)$/;
				const res = endS.exec(num);
				return res ? num + shu[res[1]] : num + 'th';
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-live-table {
	.m-live-row {
		margin: 0 10/@rem;
	}
}
</style>
