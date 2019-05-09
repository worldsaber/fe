<template>
	<AfTable :class="[ 'm-sports-table', sportName ]">
		<!-- 循环日期 -->
		<template v-for="(event, index) in eventsWithDay">
			<!-- inner event 广告 -->
			<template v-if="event.isAd">
				<a class="m-inner-ads" :href="event.linkUrl" :key="event.linkUrl">
					<img :src="event.imgUrl">
				</a>
			</template>

			<template v-else>
				<!-- 如果是赛前比赛多一行显示日期和title -->
				<AfTableRow :key="`${event.dateKey}-${index}`" class="m-date-row" v-if="event.showDateKey">
					<AfTableCell class="m-date">{{event.dateKey}}</AfTableCell>
					<!-- 这里title不好取，就直接用自己生成的 -->
					<AfTableCell v-for="marketId in currentMarketIds" :key="marketId" class="market-title">
						<div v-for="(title, index) in getTitle(marketId)" :key="index">{{title}}</div>
					</AfTableCell>
				</AfTableRow>
				<Event
					:key="event.eventId"
					:event="event"
					:currentMarketIds="currentMarketIds"
					:sportId="sportId"
					:productId="productId"
					:sportName="sportName"
					:isShowLiveMark="isShowLiveMark"
					:isShowEventLeagueName="isShowEventLeagueName">
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
import { marketsTtile } from 'components/eventsList/util';
import { convertMarkets } from 'components/eventUtil/util';
import dateFormat from 'kernel/js/dateFormat';
import { sportsConfigById } from 'config/sports';

import Event from 'components/event';

export default {
	name: 'OrderEventsList',
	components: {
		AfTable,
		AfTableRow,
		AfTableCell,
		Event
	},
	props: {
		// 里面有所有的比赛的
		events: {
			required: true,
			type: Array,
			default () {
				return [];
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
		// 格式化每个event对应的时间
		eventsWithDay() {
			let dateKey = '';
			return this.events.map(event => {
				// 跳过广告
				if (event.isAd) return event;
				const res = this.formatEvent(event);
				// 日期相关的展示
				if (res.dateKey === dateKey) {
					res.showDateKey = false;
				} else {
					res.showDateKey = true;
					dateKey = res.dateKey;
				}
				return res;
			});
		}
	},
	methods: {
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
				return marketsTtile[this.sportId][marketId];
			}
			return [];
		},
		// 格式化赛事
		formatEvent(event) {
			const { sport, markets, ...res } = event;
			const result = Object.assign({}, res);

			// 拍平sport字段
			result.sportId = sport.id;
			result.sportName = sport.name;
			result.categoryId = sport.category.id;
			result.categoryName = sport.category.name;
			result.tournamentName = sport.category.tournament.name;
			result.tournamentId = sport.category.tournament.id;
			if (event.estimateStartTime) {
				result.hourMinute = dateFormat.format(event.estimateStartTime, 'HH:mm') || '';
				result.dayMonth = dateFormat.format(event.estimateStartTime, 'DD/MM') || '';
				// MM/DD dddd
				result.dateKey = dateFormat.format(event.estimateStartTime, 'DD/MM dddd') || ' ';
			}
			if (markets) {
				const res = convertMarkets(this.copy(markets));
				result.markets = res.markets;
			}
			return result;
		},
		copy(obj) {
			return JSON.parse(JSON.stringify(obj));
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

	.m-sports-row {
		margin: 0 10/@rem;
	}

	.m-inner-ads {
		display: block;
		margin: 10/@rem;
		img {
			width: 100%;
			display: block;
		}
	}
}
</style>
