<template>
<Layout :isNeedScroll="true" :isHaveRightPagelet="true">
	<div class="football-euro-list" slot="mid">
		<BackBar></BackBar>
		<AFSnapNav v-model="currentMarketId" class="m-sport-type">
			<AFSnapNavItem class="m-sport-type-item" v-for="(one, index) in currentMarkets" :key="index" :name="one.id+''">{{one.name}}</AFSnapNavItem>
		</AFSnapNav>
		<div class="m-bet-content" v-loading:loadingFail="changeSportsLoading" >
			<div v-show="!changeSportsLoading">
				<div v-if="productStatus === 1" class="m-sport-bet-error">
					Failed to load game data. An error occurred while connecting to server.
				</div>
				<!-- 整个体育类型下面都没有比赛 -->
				<div v-else-if="tournaments.length === 0" class="no-data">
					<p>Sorry, there are no games currently </p>
					<p>available in this category. Please try later.</p>
					<p>Thank you.</p>
				</div>
				<EventsLeague
					:sportId="currentSportId"
					:currentMarketIds="[currentMarketId]"
					:productId="productId"
					v-for="(tour, index) in tournaments"
					:key="tour.id"
					:tournament="getSimpleTour(tour, index)"
					:events="tour.events"
					:params="leagueParams"
					@deleteTournament="deleteTounament"
					>
				</EventsLeague>
			</div>
		</div>
	</div>
</Layout>
</template>
<script>
import Layout from 'components/layout/main.vue';
import 'components/loading';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { CHANGE_SPORTS_LOADING } from 'store/eventList/preMatch/mutationTypes';
import { mapActions, mapState, mapMutations } from 'vuex';
import 'components/sanpNav';
import 'components/tabs';
import BackBar from 'components/navbar';
import { pagePath } from 'config/pageConfig';
import EventsLeague from 'components/eventsList/eventsLeague';
import sportsConfig from 'config/sports';
import MARKETITEMS from '../config/marketItems';
import { getTimeSelector, getTimeParam, getWapEventsUrl, getTournamentIds } from './commonFun';

const timeData = getTimeSelector();
const fetchUrl = getWapEventsUrl();

export default {
	name: 'TournamentList',
	components: {
		Layout,
		BackBar,
		EventsLeague
	},
	data() {
		return {
			// 当前是赛前
			productId: 3,
			// 当前体育类型
			sportName: 'football',
			currentSportId: 'sr:sport:1',
			// 选多个区域 catgoryId_tournamentId构成，是由 chooseBar组件控制的状态
			currentTournamentIds: [],
			// 注意每个体育类型下的要显示的marketId是不同的
			currentMarketId: '',
			// 默认时间 -- 一旦选定联赛currentTime如果没有值，默认变成all
			currentTime: null,
			tournaments: [],  	// wapEventsByOrder接口返回的数据， tournaments 数组的格式； 当default, time分类是，events 只有一个成员
		};
	},
	created() {
		this.pageLoading(true);

		this.subProductStatus();

		// 根据$route 获取 tournamentId 的相关数据 以及 时间
		const { params = {}, query } = this.$route;

		if (params.sportName) {
			this.currentSportId = sportsConfig[params.sportName].id;
			this.sportName = params.sportName;
		}
		// time
		let time;
		if (query.time) {
			if (+query.time >= 0) {
				time = +query.time;
				time = String(time);
				const t = timeData.find(cur => cur.value === time);
				if (t) {
					time = t;
				}
			} else if (query.time === 'all') {
				time = timeData[0];
			} else if (query.time === 'today') { 	// today
				time = timeData[1];
			}
		}
		this.currentTime = time;

		// currentTournamentIds
		this.currentTournamentIds = getTournamentIds(params.tournamentId);

		// 默认先设置一个market
		this.$nextTick(() => {
			this.currentMarketId = this.currentMarkets[0].id;
		});

		// 请求数据
		this.fetchWapEvents();
	},
	beforeDestroy () {
		this.unSubProductStatus();
	},
	computed: {
		currentMarkets () {
			return MARKETITEMS[this.currentSportId];
		},
		params() {
			return {
				sportId: this.currentSportId,
				marketId: this.marketIds,
				productId: 3,
				...getTimeParam(this.currentTime)
			};
		},
		// 使用wapEventsByOrder接口的请求参数
		leagueParams() {
			const params = Object.assign({}, this.params);
			params.order = 2;
			return params;
		},
		fetchParams() {
			const params = Object.assign({}, this.params);
			params.count = 3;
			params.ignoreEmpty = true;
			params.tournamentId = [this.currentTournamentIds];

			return params;
		},
		marketIds() {
			return this.currentMarkets.map(mark => mark.id).join(',');
		},
		sportsUrl() {
			return pagePath.sports;
		},
		...mapState('eventList', ['changeSportsLoading', 'productStatus']),
	},
	methods: {
		getSimpleTour(tour, index) {
			const { categoryId, categoryName, id: tournamentId, name: tournamentName, eventSize, autoLoad = false, loaded = false } = tour;
			return {
				categoryId,
				categoryName,
				tournamentId,
				tournamentName,
				eventSize,
				autoLoad,
				loaded
			};
		},
		loadingFail() {
			this.fetchWapEvents();
		},
		fetchWapEvents() {
			let data = Object.assign({}, this.fetchParams);

			if (window.countryCode === '254') {
				data = [data];
			}
			fetch(fetchUrl, {
				body: JSON.stringify(data),
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					this.tournaments = res.data.map((tour, index) => {
						if (index < this.fetchParams.count) {
							tour.loaded = true;
						}
						return tour;
					});
					return res.data;
				}
				return Promise.reject(res.message);
			})
			.then(() => {
				this.pageLoading(false);
				this.changeTabLoading(false);
			})
			.catch(() => {
				this.pageLoading(false);
				this.changeTabLoading(-1);
			});
		},
		// 删除一个联赛，当用户选择的自定义联赛下面没有任何一场比赛的情况下发生
		deleteTounament(tournamentId) {
			const index = this.tournaments.findIndex(current => current.id === tournamentId);
			// tournaments 中移除
			this.tournaments = this.tournaments.filter(tour => tour.id !== tournamentId);
			// 如果删除第一个， 则下一个自动展开
			if (index === 0 && this.tournaments.length > 0) {
				const tours = this.tournaments.splice(0, 1);
				this.tournaments.unshift(Object.assign({}, tours[0], { autoLoad: true }));
			}
		},
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		...mapActions('eventList', ['subProductStatus', 'unSubProductStatus']),
		...mapMutations('eventList', {
			changeTabLoading: CHANGE_SPORTS_LOADING
		}),
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
.football-euro-list {
	background-color: @white;
	color: @dark;
	.m-sport-bet-error{
		padding: 30/@rem 0 10/@rem;
		color: @dark;
	}
	.no-data{
		margin-top: 15%;
		margin-bottom: 15%;
		text-align: center;
		.m-icon-exclamation();
		padding: 28/@rem;
		color: @darkGray;
		&:before{
			color: @midGray;
			font-size: 30/@rem;
		}
	}
	.m-sport-type{
		border-bottom: 1px solid @fogGray;
		padding: 0 10/@rem;
		.m-sport-type-item{
			font-size: 14/@rem;
			padding: 11/@rem 15/@rem;
			font-weight: normal;
			&.active{
				border-bottom: 4px solid @green;
			}
		}
	}
}
</style>
