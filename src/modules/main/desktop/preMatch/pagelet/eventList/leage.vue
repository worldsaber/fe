<template>
	<div :class="[
		'match-league',
		{
			hide: isHide
		}
	]">
		<div class="league-title" @click="toggleDis">
			<span class="dis-icon"><em>&#xe6a3;</em></span>
			<span class="text">{{showLeague}}</span>
			<span class="del-icon" @click.stop="closeTournament" v-if="isShowClose"></span>
		</div>
		<div class="market-group clearfix" v-show="!isHide">
			<div :class="['market-item', {
				active: currentMarket && currentMarket.name === currentGroupMarketIds[index -1].name
			}]"
			v-for="index in currentGroupMarketIds.length > 5 ? 4 : 5"
			:key="index"
			v-if="!!currentGroupMarketIds[index -1]"
			@click="changeMarket(currentGroupMarketIds[index -1])"
			>{{currentGroupMarketIds[index -1].name}}</div>
			<template v-if="currentGroupMarketIds.length > 5">
				<div :class="[
					'market-item',
					'm-select-market',
					{
						active: currentMarketSelectValue !== ''
					}
				]" tabindex="0" @focus="focusMarket" @blur="blurMarket" ref="selectMarket">
					<div class="select-value">{{currentMarketSelectValue || 'Other Markets'}}<i class="m-icon-fold"></i></div>
					<ul class="select-list">
						<li v-for="current in currentGroupMarketIds.slice(4)" :key="current.name" :class="[
							{
								active: currentMarket.name === current.name
							}
						]"
						@click="changeMarketBySel(current)"
						>
							{{current.name}}
						</li>
					</ul>
				</div>
			</template>
		</div>
		<template v-if="tournamentId && sport.map && sport.map[tournamentId] && sport.map[tournamentId].events">
			<AfTable class="match-table" v-show="!isHide">
				<template v-for="(eventIds, date) in sport.map[tournamentId].eventOrder">
					<!-- 循环title -->
					<AfTableRow :key="date" class="date-row">
						<!-- 日期 -->
						<AfTableCell class="date">{{date}}</AfTableCell>
						<!-- 这里title不好取，就直接用自己生成的 -->
						<AfTableCell class="each-module-wrap">
							<div v-for="marketId in currentMarket.markets" :key="marketId" :class="[
								'each-module-table',
								{'two-markets': currentMarket.markets.length === 2}
							]">
								<div v-for="(title, index) in getTitle(marketId)" :key="index" class="each-module">{{title}}</div>
							</div>
						</AfTableCell>
						<!-- 打印:补充table元素 -->
						<div class="print-element p-table-th">
							<div class="id">ID</div>
							<div class="time">Time</div>
							<div class="event">Event</div>
						</div>
						<!-- ie9站位 -->
						<AfTableCell class="empty-cell"></AfTableCell>
					</AfTableRow>
					<!-- 循环event -->
					<template v-for="(eventId, index) in eventIds">
						<SportEvent
							:event="sport.map[tournamentId].events[eventId]"
							:key="eventId"
							:currentMarketIds="currentMarket.markets"
							:sportId="currentSportId"
							:productId="productId"
							:eventId="eventId"
							@toggleH2h="toggleH2hStatus"
							:class="{
								'active-h2h': !!h2hStatus[eventId]
							}"
						>
						</SportEvent>
						<LiveMatchTracker
							v-if="h2hStatus[eventId]"
							type="h2h"
							:eventId="eventId"
							:key="`tracker-${eventId}`"
						>
						</LiveMatchTracker>
					</template>
				</template>
			</AfTable>
			<div class="view-all" v-show="!isHide"
				v-if="sport.map[tournamentId].showViewAll"
				@click="viewAllImportant()">
				View All
			</div>
		</template>
		<div v-else class="m-sport-bet-no-data" v-show="!isHide">
			<div>
				<p>Sorry, there are no games currently available in this category.</p>
				<p>Please try later. Thank you.</p>
			</div>
		</div>
	</div>
</template>
<script>
	import { marketsTtile } from 'components/eventList/marketConst';
	import { sportConfigLowerCase } from 'config/sportsType';
	import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
	import { DEL_TOURNAMENTS } from 'store/preMatchSidebar/mutationTypes';
	import SportEvent from 'components/eventList/sportEvent.vue';
	import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker';

	export default {
		components: {
			SportEvent,
			LiveMatchTracker
		},
		props: {
			tournamentId: {
				type: String
			},
			isShowClose: {
				type: Boolean,
				'default': false
			}
		},
		watch: {
			// 因为一开始currentSportId是空，必须在currentSportId有值得时候在切换
			currentSportId: {
				immediate: true,
				handler (val, old) {
					this.currentMarket = this.currentGroupMarketIds[0];
				}
			},
		},
		data () {
			return {
				currentMarket: null,
				isHide: false
			};
		},
		computed: {
			...mapState('sidebar', [
				'currentSportId',
				'currentTournaments',
				'currentTime',
				'productId']),
			...mapGetters('sidebar', ['tournamentQuery']),
			...mapState('eventList', [
				'marketGroup',
				'pageSize',
				'sport',
				'h2hStatus'
			]),
			currentGroupMarketIds () {
				return this.marketGroup[this.currentSportId] || [];
			},
			currentMarketSelectList () {
				return this.currentGroupMarketIds.slice(4);
			},
			currentMarketSelectValue () {
				let name = '';
				if (this.currentMarketSelectList && this.currentMarketSelectList.length && this.currentMarket) {
					const cur = this.currentMarketSelectList.find(cur => cur === this.currentMarket);
					if (cur) {
						name = cur.name;
					}
				}
				return name;
			},
			showLeague () {
				if (this.sport && this.sport.map && this.sport.map[this.tournamentId]) {
					const d = this.sport.map[this.tournamentId];
					return `${d.categoryName || ''} ${d.name || ''}`;
				}
				return '';
			}
		},
		methods: {
			...mapActions('eventList', ['delTournament', 'toggleH2hStatus']),
			...mapMutations('sidebar', {
				delCurrentTournament: DEL_TOURNAMENTS
			}),
			// 取消一场联赛
			closeTournament () {
				// 删除这场比赛的数据
				this.delTournament(this.tournamentId);
				this.delCurrentTournament(this.tournamentId);
				const sportName = sportConfigLowerCase[this.currentSportId.slice(9)];
				this.$nextTick(() => {
					if (this.currentTournaments.length) {
						this.$router.push({
							name: 'eventList',
							params: {
								sportName: sportName.toLowerCase(),
								categoryId: this.tournamentQuery.categoryId,
								tournamentId: this.tournamentQuery.tournamentId
							}
						});
					} else {
						this.$router.push({
							name: 'eventListDefault',
							params: {
								sportName: sportName.toLowerCase()
							}
						});
					}
				});
			},
			// 切换一场比赛的显示隐藏
			toggleDis (e) {
				this.isHide = !this.isHide;
			},
			changeMarket (current) {
				this.currentMarket = current;
			},
			// 下拉列表修改market
			changeMarketBySel (current) {
				this.changeMarket(current);
				this.$refs.selectMarket.blur();
			},
			focusMarket (e) {
				e.currentTarget.addClass('show-item');
			},
			blurMarket (e) {
				e.currentTarget.removeClass('show-item');
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
				if (marketsTtile[this.currentSportId][marketId]) {
					return marketsTtile[this.currentSportId][marketId];
				}
				return [];
			},
			viewAllImportant () {
				this.$router.push({
					name: 'eventList',
					params: {
						tournamentId: this.tournamentId,
						categoryId: this.sport.map[this.tournamentId].categoryId
					}
				});
			}
		}
	};
</script>
