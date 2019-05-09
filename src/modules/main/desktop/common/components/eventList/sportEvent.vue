<template>
	<AfTableRow class="m-content-row match-row">
		<AfTableCell class="left-team-cell">
			<div class="left-team-table">
				<div class="time" @click="jump(event)">
					<div class="clock-time">{{event.hourMinute}}&nbsp;&nbsp;</div>
					<div class="game-id"><span class="game-id-label">ID: </span>{{event.gameId || ""}}</div>
				</div>
				<div class="teams" @click="jump(event)" :title="event.homeTeamName + ' vs ' + event.awayTeamName">
					<!-- 直播比赛显示 当比赛状态是upcoming时显示 upcoming 否则不现实，赛前比赛显示gameId-->
					<div class="home-team">{{event.homeTeamName}}</div>
					<div class="away-team">{{event.awayTeamName}}</div>
				</div>
				<!-- head to head -->
				<div class="lmt-icon" v-if="isH2H" @click="handleToggleH2h">
					<em class="icon"></em>
				</div>
			</div>
		</AfTableCell>
		<!-- market显示 -->
		<!-- sportId获取做一个兼容 -->
		<!-- 如果是直播比赛，并且是第一行就显示title -->
		<AfTableCell :class="[
				'market-cell',
				{
					'two-markets': currentMarketIds.length === 2,
				}
			]">
			<Market v-for="(marketId, index) in currentMarketIds" :key="index"
				:productId="productId"
				:sportId="event.sportId || sportId"
				:marketId="marketId"
				:event="event"
				:isHideSelectSpecifiers="isHideSelectSpecifiers(marketId)"
				class="market"
				>
			</Market>
		</AfTableCell>
		<AfTableCell @click.native="jump(event)" class="market-size">+{{event.totalMarketSize}}</AfTableCell>
	</AfTableRow>
</template>

<script>
	/**
	 * 针对一个events的列表做显示
	 */
	import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
	import { sportConfigLowerCase, trackerSports } from 'config/sportsType';
	import { baseUrl } from 'config/pageConfig';
	import { marketsTtile } from './marketConst';
	import Market from './market.vue';

	export default {
		components: {
			Market,
			AfTable,
			AfTableRow,
			AfTableCell
		},
		props: {
			// 里面有所有的比赛的map，应该与eventOrder相匹配
			event: {
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
			eventId: String
		},
		computed: {
			isH2H() {
				const trackers = trackerSports.map(item => `sr:sport:${item}`);
				return trackers.includes(this.event.sportId);
			}
		},
		methods: {
			isHideSelectSpecifiers (marketId) {
				// 足球为36的market不显示下拉列表选择
				if (this.sportId === 'sr:sport:1' && +marketId === 36) {
					return true;
				}
				return false;
			},
			// 跳转到对应的比赛详情页面
			jump (event) {
				// ${baseUrl}sport/:sportName/:categoryId/:tournamentId/:eventId/
				const url = `${baseUrl}sport/${sportConfigLowerCase[event.sportId.slice(9)]}/${event.categoryId}/${event.tournamentId}/${event.eventId}`;
				window.location.href = url;
			},
			/**
			 * title并不是每个market都由，title只在列表页面中有用，title就是desc的另外一种描述形式
			 * 目前已经有的title
			 */
			getTitle(marketId, originTitle = '') {
				originTitle = originTitle.split(',');
				if (originTitle.length > 1) {
					return originTitle;
				}
				if (marketsTtile[this.sportId][marketId]) {
					return marketsTtile[this.sportId][marketId];
				}
				return [];
			},
			// 切换head to head 隐藏or显示
			handleToggleH2h() {
				this.$emit('toggleH2h', this.eventId);
			}
		}
	};
</script>
