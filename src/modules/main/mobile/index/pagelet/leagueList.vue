<template>
	<div class="m-league-list">
		<League
			v-for="(id, index) in leagues.tournamentOrder"
			:isShowContent="tournamentLoading[id] !== undefined"
			:key="index"
			:name="getLeagueName(id)"
			:eventSize="leagues.map[id].eventSize"
			@change="changeLeageStatus(id, $event)">
			<template v-if="tournamentLoading[id] === false">
				<EventsList
					v-if="hasEvents(leagues.map[id].events)"
					:eventOrder="leagues.map[id].eventOrder"
					:events="leagues.map[id].events"
					:currentMarketIds="[marketIds[currentSportId]]"
					:sportId="currentSportId"
					:productId="productId">
				</EventsList>

				<!-- 已经有联赛，但是该联赛下没有比赛 -->
				<template v-else>
					<div class="m-del-league-wrap">
						No Odds Available <span @click="delTournament(id)">Delete</span>
					</div>
				</template>
			</template>

			<!-- 这种情况是取到了联赛，却没有取联赛下的比赛，所以需要动态加载，这里无法用通用的加载指令，因为太多，无法做到加载失败方法通用 -->
			<div class="m-league-loading" v-else>
				<div class="loading" v-if="tournamentLoading[id] !== -1"></div>
				<div class="loading-fail" v-if="tournamentLoading[id] === -1">
					<p class="fail-text">Data failed loading. Please reload.</p>
					<div class="fail-btn" @click="loadingLeague(sport.map[id].categoryId, id)">Reload</div>
				</div>
			</div>
		</League>
  	</div>
</template>

<script>
/**
 * League 联赛列表，动态加载联赛数据
 */
import { mapActions, mapState } from 'vuex';
import League from 'components/eventsList/league.vue';
import EventsList from 'components/eventsList';
import { isEmptyObject } from 'utils';

export default {
	name: 'LeagueList',
	components: {
		League,
		EventsList
	},
	props: {
		// 联赛列表，结构为 { map, tournamentOrder } 类型
		leagues: {
			type: Object,
			required: true
		},
		loading: {
			type: Boolean,
			'default': true
		},
		// 1(直播),3(赛前)
		productId: {
			type: [String, Number],
			required: true
		},
		// 选择性展示 league content
		showLeaguesIndex: {
			type: Array,
			'default': () => []
		}
	},
	data () {
		return {
			tournamentLoading: {}
		};
	},
	computed: {
		...mapState('home', [
			'marketIds',
			'currentSportId',
		])
	},
	watch: {
		leagues: {
			immediate: true,
			handler(val) {
				if (val.tournamentOrder && this.showLeaguesIndex) {
					this.showLeaguesIndex.forEach(i => {
						this.$set(this.tournamentLoading, val.tournamentOrder[i], false);
					});
				}
			}
		}
	},
	methods: {
		...mapActions('home', ['fetchLeagueEvents']),
		getLeagueName(tournament) {
			if (this.leagues && this.leagues.map && this.leagues.map[tournament]) {
				return (this.leagues.map[tournament].categoryName || '') +
				' - ' + this.leagues.map[tournament].name;
			}
			return '';
		},
		hasEvents (events) {
			return !isEmptyObject(events);
		},
		changeLeageStatus (tournamentId, status) {
			if (status) {
				// 当前模块没被加载过
				if (this.tournamentLoading[tournamentId] === undefined) {
					this.loadingLeague(tournamentId);
				}
			}
		},
		// 加载一个联赛下的数据
		async loadingLeague (tournamentId) {
			this.$set(this.tournamentLoading, tournamentId, true);
			const params = {
				sportId: this.currentSportId,
				marketId: this.marketIds[this.currentSportId],
				productId: this.productId,
				tournamentId: [[tournamentId]]
			};
			try {
				const data = await this.fetchLeagueEvents(params);
				this.$emit('updateLeagues', data);
				this.tournamentLoading[tournamentId] = false;
			} catch (err) {
				this.tournamentLoading[tournamentId] = -1;
			}
		},
		delTournament (tournamentId) {
			const index = this.leagues.tournamentOrder.findIndex(x => x === tournamentId);

			// 删除 store 中对应的 tournament
			this.$emit('deleteTournament', tournamentId);
			// 如果删除的是第一个，则需要顺序查询下一个league的数据，如果下一个存在的话
			this.$nextTick(() => {
				const { tournamentOrder } = this.leagues;
				if (index === 0 && tournamentOrder.length > 0) {
					const cur = tournamentOrder[0];
					this.changeLeageStatus(cur, true);
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-league-loading {
	min-height: 180/@rem;
	text-align: center;
	position: relative;
	.loading{
		background: @white;
		top: 50%;
		left: 50%;
		position: absolute;
		margin-left: -15/@rem;
		margin-top: -15/@rem;
		.m-icon-loading-circle();
		animation: circles 1s infinite;
		animation-timing-function: linear;
		text-align: center;

		&:before{
			height: 30/@rem;
			width: 30/@rem;
			line-height: 30/@rem;
			font-size: 30/@rem;
			color: @midGray;
			vertical-align: top;
		}
	}
	.loading-fail{
		text-align: center;
		margin: 10/@rem 0;
		.m-icon-exclamation();
		&:before{
			display: block;
			font-size: 36/@rem;
			color: @midGray;
		}
		.fail-text{
			margin-top: 10/@rem;
			white-space: nowrap;
			word-break: keep-all;
			margin-bottom: 36/@rem;
			color: @darkGray;
		}
		.fail-btn{
			color: @green;
			height: 36/@rem;
			line-height: 36/@rem;
			padding: 0 28/@rem;
			display: inline-block;
			border: 1px solid @green;
			border-radius: 3/@rem;
		}
	}
}

.m-league-list {
	.m-league {
		.m-league-conent {
			margin-bottom: 10/@rem;
		}
	}
}

.m-del-league-wrap {
	text-align: center;
	padding: 20/@rem 0;
}
</style>
