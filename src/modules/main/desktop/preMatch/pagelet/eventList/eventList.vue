
<template>
	<div
		class="import-match"
		v-loading:refresh="sportLoading"
		id="importMatch">
		<div class="print-title print-element">{{ printName }}</div>
		<template v-if="!sportLoading">
			<!-- 当前玩法不可以玩 -->
			<div
				class="m-sport-bet-err"
				v-if="productStatus === 1">
				<div>Failed to load game data. An error occurred while connecting to server. </div>
			</div>
			<template v-else-if="tournamentOrder.length">
				<div class="match-league-wrap"
					v-for="tournamentId in tournamentOrder"
					v-loading:test="loadingLeague[tournamentId] === undefined ? false : loadingLeague[tournamentId]"
					:key="tournamentId">
					<League v-if="!loadingLeague[tournamentId]"
						:isShowClose="currentTournaments.length > 0"
						:tournamentId='tournamentId'></League>
				</div>
				<Pagination
					v-if="isShowPagination"
					:pageCount="Math.ceil(totalNum/pageSize)"
					:clickHandler="pageClickHandler"
					:initialPage="pageNum"
					class="pagination"></Pagination>
			</template>
			<div
				v-else
				class="m-sport-bet-no-data">
				<div>
					<p>Sorry, there are no games currently available in this category.</p>
					<p>Please try later. Thank you.</p>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
	import { getTodayTime } from 'components/eventList/util';
	import Pagination from 'components/pagination/pagination';
	import 'components/loading';
	import { CHANGE_PAGE } from 'store/eventList/preMatch/mutationTypes';
	import {
		sportConfigUpperCase,
		getSportIdByName
	} from 'config/sportsType';
	import League from './leage.vue';

	export default {
		name: 'EventsList',
		components: {
			League,
			Pagination
		},
		data () {
			return {
				currentMarket: null,
				loadingLeague: {},
			};
		},
		watch: {
			$route: {
				immediate: true,
				handler (route, from) {
					const { name } = route;
					// 这3个请求 importMatch方法 /factsCenter/pcUpcomingEvents接口
					if (name === 'eventListUpcoming' || name === 'eventListDefault' || name === 'eventListToday') {
						let timeline = this.currentTime;
						// 查询参数
						const params = {
							sportId: this.currentSportId,
							marketId: this.currentAllMarketIds.join(','),
							pageSize: this.pageSize,
							pageNum: 1
						};
						if (name === 'eventListToday') {
							timeline = this.getTodayTime();
							params.todayGames = true;
						}
						// 默认比赛只显示10个
						if (name === 'eventListDefault') {
							params.option = 1;
						}
						if (+timeline > 0) {
							params.timeline = timeline;
						}
						// 重置比赛数据
						this.resetSportList();
						document.documentElement.scrollTop = 0;
						this.getImportMatch(params);
					} else if (name === 'eventList') {
						// 查询参数
						const params = {
							sportId: this.currentSportId,
							marketId: this.currentAllMarketIds.join(','),
						};
						const timeline = this.currentTime;
						if (+timeline > 0) {
							params.timeline = timeline;
						}
						// 证明是在增加或者删除tournament
						if (from && from.name === 'eventList') {
							// 理论上不会有空的,有空就出错了
							let oldIds = from.params.tournamentId || '';
							oldIds = oldIds.split('_');
							const oldIdsMap = oldIds.reduce((res, cur) => {
								res[cur] = 1;
								return res;
							}, {});
							// 增加tournament- 或初始化tournament
							if (this.currentTournaments.length > oldIds.length) {
								for (const one of this.currentTournaments) {
									if (!oldIdsMap[one.tournamentId]) {
										params.tournamentId = [[one.tournamentId]];
										break;
									}
								}
								document.documentElement.scrollTop = 0;
								this.fetchOneTournament(params);
							} else {
								// 删除了一个tournament
								// DEL_TOURNAMENT
								for (const one of oldIds) {
									if (!this.mapTournament[one]) {
										this.delTournament(one);
										break;
									}
								}
							}
						} else {
							// 首次进入页面
							const ids = Object.keys(this.mapTournament);
							params.tournamentId = [ids];
							if (+this.currentTime > 0) {
								params.timeline = this.currentTime;
							}
							// 重置比赛数据
							this.resetSportList();
							this.getTournameMatch(JSON.stringify([params]));
							document.documentElement.scrollTop = 0;
						}
					}
				}
			},
			currentTime () {
				// 在eventList下如果时间变，并不改变路由，但是数据需要刷新
				if (this.$route.name === 'eventList') {
					this.refresh();
				}
			}
		},
		computed: {
			...mapState('sidebar', [
				'currentSportId',
				'currentTime',
				'currentTournaments']),
			...mapGetters('sidebar', ['tournamentQuery', 'mapTournament']),
			...mapState('eventList', ['marketGroup',
				'sport',
				'sportLoading',
				'isShowPagination',
				'pageSize',
				'pageNum',
				'productStatus',
				'totalNum']),
			currentAllMarketIds () {
				const res = this.marketGroup[this.currentSportId];
				if (res) {
					return res.reduce((result, cur) => {
						result = result.concat(cur.markets);
						return result;
					}, []);
				}
				return [];
			},
			// 计算一个用于更新的order
			tournamentOrder () {
				if (this.currentTournaments && this.currentTournaments.length) {
					return this.currentTournaments.reduceRight((all, cur) => {
						all.push(cur.tournamentId);
						return all;
					}, []);
				}
				if (this.sport && this.sport.tournamentOrder) {
					return this.sport.tournamentOrder;
				}
				return [];
			},
			printName() {
				if (this.$route) {
					const name = this.$route.params.sportName;
					const id = getSportIdByName(name);
					return sportConfigUpperCase[id];
				}
			}
		},
		beforeDestroy () {
			this.resetSportList();
			this.unSubProductStatus();
		},
		created () {
			this.subProductStatus();
		},
		methods: {
			...mapActions('eventList', ['fetchImportMatch', 'fetchTournament',
				'fetchSports', 'delTournament', 'resetSportList',
				'subProductStatus', 'unSubProductStatus']),
			...mapMutations('eventList', [CHANGE_PAGE]),
			pageClickHandler (pageIndex) {
				const name = this.$route.name;
				if (name === 'eventListUpcoming' || name === 'eventListDefault' || name === 'eventListToday') {
					this.changePage(pageIndex);
					const params = {
						sportId: this.currentSportId,
						marketId: this.currentAllMarketIds.join(','),
						pageSize: this.pageSize,
						pageNum: pageIndex,
					};
					if (name === 'eventListDefault') {
						params.option = 1;
					}
					if (name === 'eventListToday') {
						params.todayGames = true;
					}
					if (+this.currentTime > 0) {
						params.timeline = this.currentTime;
					}
					this.getImportMatch(params);
					document.documentElement.scrollTop = 0;
				}
			},
			// 获取关键赛事，比如  今天比赛，upcoming比赛 default Event
			getImportMatch (params) {
				return this.fetchImportMatch(params);
			},
			getTournameMatch (params) {
				return this.fetchSports(params);
			},
			// 每次选择获取一个tournament
			fetchOneTournament (params) {
				const id = params.tournamentId.toString();
				this.$set(this.loadingLeague, id, true);
				const par = JSON.stringify([params]);
				return this.fetchTournament(par)
				.then(() => this.$set(this.loadingLeague, id, false))
				.catch(() => this.$set(this.loadingLeague, id, -1));
			},
			refresh () {
				const params = {
					sportId: this.currentSportId,
					marketId: this.currentAllMarketIds.join(',')
				};
				const name = this.$route.name;
				if (name === 'eventListUpcoming' || name === 'eventListDefault' || name === 'eventListToday') {
					params.pageNum = this.pageNum;
					params.pageSize = this.pageSize;
					if (name === 'eventListToday') {
						params.timeline = this.getTodayTime();
					} else if (+this.currentTime > 0) {
						params.timeline = this.currentTime;
					}
					// 默认比赛只显示10个
					if (name === 'eventListDefault') {
						params.option = 1;
					}
					this.fetchImportMatch(params);
				} else if (name === 'eventList') {
					params.tournamentId = [this.tournamentQuery.tournamentId.split('_')];
					if (+this.currentTime > 0) {
						params.timeline = this.currentTime;
					}
					this.fetchSports(JSON.stringify([params]));
				}
			},
			getTodayTime
		}
	};
</script>

<style lang="less">
	@media screen {
		@import './screen.less';
	}

	@media print {
		@import './print.less';
	}

	.print-element {
		display: none;
	}
</style>
