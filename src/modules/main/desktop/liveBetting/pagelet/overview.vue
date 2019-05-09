<template>
<div class="m-overview">
	<div class="sport-name">
		<div
			:class="['sport-name-item', {
				active: currentSportId === sport.id
			}]"
			v-for="sport in preSportList"
			:key="sport.id"
			@click="onChooseSport(sport.id)">
			<div class="text">{{sport.name}}</div>
		</div>
		<SimpleSelect :class="['sport-simple-select', isSelectedActive ? 'sport-simple-select-active' : '' ]" 
			:data="postSportList" placeholder="More Games" 
			@selected="onSelectedSport" :defaultIndex="defaultIndex" ref="select"></SimpleSelect>
	</div>
	<div class="match" v-loading:loadingFail.dark="sportLoading">
		<template v-if="!sportLoading">
			<div
				v-if="productStatus === 1"
				class="m-sport-bet-err">
				Failed to load game data. An error occurred while connecting to server. 
			</div>
			<div v-else-if="!sport || !sport.tournamentOrder || !sport.tournamentOrder.length" class="m-sport-bet-no-data">
				<p>Sorry, there are no games currently available in this category.</p>
				<p>Please try later. Thank you.</p>
			</div>
			<template v-for="tournamentId in sport.tournamentOrder" v-else>
				<AfTable class="match-table live-table" v-if="tournamentId && sport.map[tournamentId]" :key="tournamentId">
					<!-- 循环title -->
					<AfTableRow class="league-row">
						<!-- 日期 -->
						<AfTableCell class="league">{{sport.map[tournamentId].categoryName}} {{sport.map[tournamentId].name}}</AfTableCell>
						<!-- 这里title不好取，就直接用自己生成的 -->
						<AfTableCell :class="['each-module-wrap', {
							'each-module-two-line': true
						}]">
							<div class="market-desc-wrap" v-if="true">
								<div class="market-desc" v-for="marketId in currentMarketIds" :key="marketId">
									{{currentMarketName[marketId]}}
								</div>
							</div>
							<div>
								<div v-for="marketId in currentMarketIds" :key="marketId" :class="[
									'each-module-table',
									{'two-markets': currentMarketIds.length === 2}
								]">
									<div v-for="(title, index) in getTitle(marketId)" :key="index" class="each-module">{{title}}</div>
								</div>
							</div>
						</AfTableCell>
						<!-- ie9站位 -->
						<AfTableCell></AfTableCell>
					</AfTableRow>
					<template v-for="(eventIds, date) in sport.map[tournamentId].eventOrder">
						<!-- 循环event -->
						<LiveEvent v-for="(eventId, index) in eventIds"
							:event="sport.map[tournamentId].events[eventId]"
							:key="eventId"
							:currentMarketIds="currentMarketIds"
							:sportId="currentSportId"
							:productId="productId"
						>
						</LiveEvent>
					</template>
				</AfTable>
			</template>
		</template>	
	</div>
</div>
</template>

<script>
	import { marketsTtile, marketNameForLive } from 'components/eventList/marketConst';
	import { sportType2Id, sportConfigLowerCase } from 'config/sportsType';
	import 'components/loading';
	import LiveEvent from 'components/eventList/liveEvent.vue';
	import { SPORT_LOADING, CHANGE_SPORT } from 'store/eventList/liveBetting/mutationTypes';
	import { mapActions, mapState, mapMutations } from 'vuex';
	import SimpleSelect from 'components/simpleSelect';

	export default {
		name: 'Overview',
		components: {
			LiveEvent,
			SimpleSelect
		},
		data () {
			return {
				// 当前玩法是live
				productId: 1
			};
		},
		watch: {
			currentSportId (val, oldVal) {
				this.unsub(oldVal);
				// 控制路由切换
				this.$router.push({
					name: 'overview',
					params: {
						sportName: sportConfigLowerCase[val.slice(9)] || 'football'
					}
				});
			},
			$route: {
				immediate: false,
				handler (current) {
					const { params = {}} = current;
					const sportName = params.sportName;
					let sportId = sportType2Id[sportName];
					sportId = `sr:sport:${sportId}`;
					// sportId不是默认值 -- 切换运动类型后加载数据
					if (sportId && sportId !== this.currentSportId) {
						this.chooseSport(sportId);
					}
					// 默认足球加载数据
					this.fetchSport();
				}
			}
		},
		computed: {
			...mapState('eventList', ['sportLoading', 'sport', 'marketIds', 'sportList', 'currentSportId', 'productStatus']),
			currentMarketIds () {
				return this.marketIds[this.currentSportId];
			},
			currentMarketName () {
				return marketNameForLive[this.currentSportId];
			},
	
			preSportList() {
				return this.sportList.slice(0, 7);
			},
			postSportList() {
				const list = this.sportList.slice(7);
				return list.map(item => ({
					...item,
					label: item.name
				}));
			},
			defaultIndex() {
				return this.postSportList.findIndex(item => item.id === this.currentSportId);
			},
			postSportId() {
				return this.postSportList.map(item => item.id);
			},
			isSelectedActive() {
				return this.postSportId.includes(this.currentSportId);
			}
		},
		created () {
			const { params = {}} = this.$route;
			const sportName = params.sportName;
			let sportId = sportType2Id[sportName];
			sportId = `sr:sport:${sportId}`;
			this.fetchSportSize({ option: 1, productId: this.productId })
			.then(res => {
				if (res && res.length) {
					const curr = res.find(curr => curr.id === sportId);
					if (!curr || curr.eventSize < 1) {
						this.$router.push({
							name: 'overview',
							params: {
								sportName: sportConfigLowerCase[res[0].id.slice(9)]
							}
						});
						sportId = res[0].id;
					}
				}
			})
			.catch(() => {})
			.then(() => {
				if (sportId && sportId !== this.currentSportId) {
					this.chooseSport(sportId);
				}
				this.fetchSport();
			});
			this.subProductStatus();
		},
		beforeDestroy() {
			this.unsub(this.currentSportId);
			this.unSubProductStatus();
		},
		methods: {
			loadingFail () {
				this.fetchSport();
			},
			fetchSport () {
				// 加载种
				if (this.sportsLoading && this.sportsLoading !== -1) {
					return;
				}
				this.changeTabLoading(true);
				return this.fetchSports(this.currentSportId)
				.then(() => this.changeTabLoading(false))
				.catch(() => this.changeTabLoading(-1));
			},
			...mapActions('eventList', ['fetchSports', 'unsub', 'subProductStatus', 'unSubProductStatus']),
			...mapMutations('eventList', {
				changeTabLoading: SPORT_LOADING,
				chooseSport: CHANGE_SPORT
			}),
			...mapActions('sportSize', ['fetchSportSize']),
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
			onSelectedSport(payload) {
				const id = payload.item.id;
				this.chooseSport(id);
			},
			onChooseSport(sportId) {
				this.chooseSport(sportId);
				const $select = this.$refs.select;
				$select && $select.clear();
			}
		}
	};
</script>
<style lang="less">
@import './overview.less';
</style>

