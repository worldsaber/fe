<template>
	<AfTable :class="[
		'm-sports-table',
		sportName
	]">
		<!-- 循环日期 -->
		<template v-for="(dateEvents, key) in eventOrder">
			<!-- 如果是赛前比赛多一行显示日期和title -->
			<AfTableRow :key="key" class="m-date-row">
				<AfTableCell class="m-date">{{key}}</AfTableCell>
				<!-- 这里title不好取，就直接用自己生成的 -->
				<AfTableCell v-for="marketId in currentMarketIds" :key="marketId" class="market-title">
					<div v-for="(title, index) in getTitle(marketId)" :key="index">{{title}}</div>
				</AfTableCell>
			</AfTableRow>
			<template v-for="(eventId, index) in dateEvents">
				<template v-if="isLive(events[eventId])">
					<div class="m-list-item m-list-item--live" :key="eventId">
						<EventLive
							:event="events[eventId]"
							:currentMarketIds="currentMarketIds"
							:sportId="sportId"
							:productId="1"
							:sportName="sportName"
							:isShowEventLeagueName="isShowEventLeagueName"
							:isShowLiveMark="isShowLiveMark"
							:isEventBoost="isEventBoost">
						</EventLive>
					</div>
				</template>

				<template v-else>
					<div class="m-list-item" :key="eventId">
						<EventSport
							:event="events[eventId]"
							:currentMarketIds="currentMarketIds"
							:sportId="sportId"
							:productId="3"
							:sportName="sportName"
							:isShowEventLeagueName="isShowEventLeagueName">
						</EventSport>
					</div>
				</template>
			</template>
		</template>
	</AfTable>
</template>

<script>
	/**
	 * 针对一个events的列表做显示，prematch 和 live 混排
	 */
	import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
	import { marketsTtile } from 'components/eventsList/util';
	import EventLive from 'components/event/eventLive';
	import EventSport from 'components/event/eventSport';
	import { sportsConfigById } from 'config/sports';

	export default {
		name: 'NormalEventsList',
		components: {
			AfTable,
			AfTableRow,
			AfTableCell,
			EventLive,
			EventSport
		},
		props: {
			// 决定所有比赛排列的顺序，以及如果没有比赛的显示
			eventOrder: {
				required: true,
				type: Object,
				default () {
					return {};
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
			isShowEventLeagueName: {
				type: Boolean,
				'default': false
			},
			isShowNextGoalTitle: {
				type: Boolean,
				'default': true
			},
			isEventBoost: {
				type: Function,
			},
			// 是否显示"LIVE"文案
			isShowLiveMark: {
				type: Boolean,
				'default': false
			}
		},
		computed: {
			sportName () {
				return sportsConfigById[this.sportId].name;
			},
			totalListSize () {
				return Object.values(this.eventOrder).reduce((sum, cur) => sum + cur.length, 0);
			}
		},
		methods: {
			// 这里主要处理特殊情况，比如当前的event下的不存在指定的market则不限制---理论上不存在这种情况
			isHave (eventId) {
				if (this.events[eventId]) {
					const markets = this.events[eventId].markets || {};
					return this.currentMarketIds.every(id => !!markets[id]);
				}
				return true;
			},
			/**
			 * title并不是每个market都由，title只在列表页面中有用，title就是desc的另外一种描述形式
			 * 目前已经有的title
			 */
			getTitle(marketId, originTitle = '') {
				const title = originTitle.split(',');
				if (title.length > 1) {
					return title;
				}
				if (marketsTtile[this.sportId][marketId]) {
					if (+marketId === 8 && !this.isShowNextGoalTitle) {
						const result = [...marketsTtile[this.sportId][marketId]];
						result.shift();
						return result;
					}
					return marketsTtile[this.sportId][marketId];
				}
				return [];
			},
			isLive(event) {
				return event.eventType === 'live';
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-sports-table {
	.m-date-row{
		height: 24/@rem;
		line-height: 24/@rem;
		background: @fogGray;
		padding: 0 10/@rem;
		box-sizing: border-box;

		.m-date{
			font-size: 12/@rem;
			color: @dark;
		}
		.market-title{
			display: flex;
			width: 55%;
			flex: 0 1 auto;
			&>div{
				color: @darkGray;
				font-size: 10/@rem;
				flex: 1;
				text-align: center;
			}
		}
	}

	.m-live-row,
	.m-sports-row {
		margin: 0 10/@rem;
	}

	.m-list-item {
		&:last-child {
			border-bottom: 0;
		}
	}
	.m-list-item--live {
		background: @darker;
		color: @white;

		.m-event-sport,
		.m-event-live {
			.m-market-size {
				font-size: 10/@rem;
				font-weight: normal;

				&:after {
					font-size: 8/@rem;
				}
			}
		}
	}
}
</style>
