<template>
	<AfTableRow :class="['m-content-row', 'match-row', sportName + '-row']">
		<!-- 为了兼容ie9嵌套多层 -->
		<AfTableCell class="left-team-cell">
			<div class="left-arrow">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12px">
					<polygon id="Rectangle-2" transform="translate(6.325503, 27.500000) scale(1, -1) translate(-6.325503, -27.500000) " points="0 -7.10542736e-15 6.01905469 -3.15544362e-30 12.6510067 55 0 55"></polygon>
				</svg>
			</div>
			<div class="left-team-table">
				<!-- Cricket 不显示比赛时间或者状态 -->
				<div class="time" @click="jump(event)">
					<template v-if="event.status === 1 || event.status === 2">
							<!-- 足球，篮球，Rugby, handball, ice hockey显示 -->
						<div class="clock-time" v-if="isShowPlaySec">{{ sportId === 'sr:sport:2' ? event.remainingTimeInPeriod : event.playedSeconds}}</div>
						<!-- 所有玩法都显示matchStatus -->
						<div class="game-id">
							{{event.matchStatus}}
						</div>
					</template>
					<!-- 没开始 -->
					<template v-else-if="event.status === 0">
						<div>Upcoming</div>
					</template>
					<!-- 其他情况 -->
					<template v-else>
						<div class="game-id">
							{{event.matchStatus}}
						</div>
					</template>
				</div>
				<!-- 队名 -->
				<div class="teams" @click="jump(event)" :title="event.homeTeamName + ' vs ' + event.awayTeamName">
					<!-- 直播比赛显示 当比赛状态是upcoming时显示 upcoming 否则不现实，赛前比赛显示gameId-->
					<div class="home-team">{{event.homeTeamName}}</div>
					<div class="away-team">{{event.awayTeamName}}</div>
				</div>

				<!-- 比分 -->
				<div class="score">
					<div v-for="(one, index) in (event.setScore || '').split(':')" :key="index" class="score-item">
						{{one || ''}}
					</div>
				</div>

				<!-- 网球显示 没有数据显示空表格-->
				<div class="game-score" v-if="hasGameScore">
					<template v-if="isShowGameScore">
						<div v-for="(one, index) in event.gameScore[event.gameScore.length - 1].split(':')"
						:key="index"
						class="score-item">
							{{one || ''}}
						</div>
					</template>
				</div>

				<!-- 网球显示 没有数据显示空表格 -->
				<div class="point" v-if="sportId === 'sr:sport:5'">
					<template v-if="isShowPointScore">
						<div v-for="(one, index) in event.pointScore.split(':')" :key="index" class="score-item">
							{{one || ''}}
						</div>
					</template>
				</div>
			</div>
		</AfTableCell>
		<!-- market显示 -->
		<!-- sportId获取做一个兼容 -->
		<!-- 如果是直播比赛，并且是第一行就显示title -->
		<AfTableCell  :class="[
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
		<!-- 在这场比赛是live的时候跳转live，否则跳转pre match -->
		<AfTableCell @click.native="jump(event)" class="market-size">+{{event.totalMarketSize}}</AfTableCell>
	</AfTableRow>
</template>

<script>
	/**
	 * 针对一个events的列表做显示
	 */
	import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
	import { sportConfigLowerCase } from 'config/sportsType';
	import { baseUrl } from 'config/pageConfig';
	import { marketsTtile } from './marketConst';
	import Market from './market.vue';

	export default {
		name: 'LiveEvent',
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
			}
		},
		computed: {
			isShowPlaySec () {
				// tennis, cricket, volleyball, darts, beach volleyball
				const includes = ['sr:sport:5', 'sr:sport:21', 'sr:sport:23', 'sr:sport:22', 'sr:sport:34'].includes(this.sportId); // 'sr:sport:23', 'sr:sport:22', 'sr:sport:34'
				return !includes;
			},
			sportName () {
				return sportConfigLowerCase[this.sportId.slice(9)] || '';
			},
			hasGameScore() {
				// 网球， volleyball, beach volleyball
				return ['sr:sport:5', 'sr:sport:23', 'sr:sport:34'].includes(this.event.sportId);
			},
			isShowGameScore () {
				return this.event.gameScore && this.event.gameScore.length &&
				this.event.gameScore[this.event.gameScore.length - 1];
			},
			isShowPointScore () {
				return this.sportId === 'sr:sport:5' && this.event.pointScore;
			},
		},
		methods: {
			isHideSelectSpecifiers (marketId) {
				// 网球为5的market下拉列表隐藏
				// if (this.sportId === 'sr:sport:5' && +marketId === 202) {
				// 	return true;
				// }
				if (this.sportId === 'sr:sport:21' && +marketId === 11) {
					return true;
				}
				return false;
			},
			// 跳转到对应的比赛详情页面
			jump (event) {
				// ${baseUrl}sport/live/:sportName/:categoryId/:tournamentId/:eventId/
				let url = `${baseUrl}sport/${this.sportName}/live/${event.categoryId}/${event.tournamentId}/${event.eventId}`;
				if (event.status === 0) {
					url = `${baseUrl}sport/${this.sportName}/${event.categoryId}/${event.tournamentId}/${event.eventId}`;
				}
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
			// 暂时无用，取后台固定字段
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
