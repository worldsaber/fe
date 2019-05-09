<template>
<Layout :isNeedScroll="true" :isHaveRightPagelet="true">
<div class="m-event-list" ref="eventList" slot="mid">
	<BackBar>
		<template slot="right">
			<Sort ref="sort" @selected="onSortChanged" v-show="isShowSort"/>
		</template>
	</BackBar>
	<LiveInPlay />
	<ChooseBar @change="changeChoose" ref="chooseBar" v-show="isShowChooseBar"></ChooseBar>
	<div class="m-sanp-nav-container" ref="container">
		<AFSnapNav v-model="currentMarketId" :class="['m-sport-type', isTypeFixed ? 'm-sport-type-fixed' : '']" ref="marketsNavs">
			<AFSnapNavItem class="m-sport-type-item" v-for="(one, index) in currentMarkets" :key="index" :name="one.id+''">{{one.name}}</AFSnapNavItem>
		</AFSnapNav>
	</div>
	<div class="m-bet-content" v-loading:loadingFail="changeSportsLoading">
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
			<!-- league 类型排序 -->
			<template v-if="sortValue === 2">
				<EventsLeague
					:sportId="currentSportId"
					:currentMarketIds="[currentMarketId]"
					:productId="productId"
					v-for="(tour, index) in tournaments"
					:key="index"
					:tournament="getSimpleTour(tour, index)"
					:events="tour.events"
					:params="params"
					:tournamentOptions="tournamentOptions"
					@deleteTournament="deleteTounament"
					>
				</EventsLeague>
			</template>
			<!-- default time 排序 -->
			<template v-else>
				<OrderEventsList
					v-if="events.length > 0"
					:sportId="currentSportId"
					:currentMarketIds="[currentMarketId]"
					:productId = "productId"
					:events="events"
					:isShowEventLeagueName="true"
					>
				</OrderEventsList>
			</template>
			<div class="m-bet-load-more" v-show="isShowMore">
				<div class="bet-load-more-content" v-if="moreEvents">
					<LoadStatus :loadStatus="moreLoading" v-if="!isMoreReady" @reload="loadNextPage"></LoadStatus>
				</div>
				<div class="bet-load-more-none" v-else>No More Games</div>
			</div>
		</div>
	</div>
</div>
</Layout>
</template>

<script>
	import Layout from 'components/layout/main.vue';
	import 'components/loading';
	import cookie from 'storage/cookie';
	import OrderEventsList from 'components/eventsList/orderEventsList';
	import League from 'components/eventsList/league.vue';
	import LoadStatus from 'components/eventsList/loadStatus.vue';
	import { CHANGE_LOADING } from 'store/layout/mutationTypes';
	import { CHANGE_SPORTS_LOADING } from 'store/eventList/preMatch/mutationTypes';
	import { mapActions, mapState, mapMutations } from 'vuex';
	import 'components/sanpNav';
	import 'components/tabs';
	import BackBar from 'components/navbar';
	import { pagePath } from 'config/pageConfig';
	import EventsLeague from 'components/eventsList/eventsLeague';
	import { sportsConfigById } from 'config/sports';
	import ChooseBar from './chooseBar.vue';
	import { getTimeParam } from './commonFun';
	import Sort from './sort.vue';
	import MARKETITEMS from '../config/marketItems';
	import LiveInPlay from './liveInPlay';

	export default {
		name: 'EventList',
		components: {
			Layout,
			OrderEventsList,
			League,
			ChooseBar,
			BackBar,
			Sort,
			EventsLeague,
			LoadStatus,
			LiveInPlay
		},
		data () {
			return {
				// 当前是赛前
				productId: 3,
				// 当前体育类型
				currentSportId: 'sr:sport:1',
				// 选多个区域 catgoryId_tournamentId构成，是由 chooseBar组件控制的状态
				currentTournaments: [],
				// 注意每个体育类型下的要显示的marketId是不同的
				currentMarketId: '',
				// 默认时间 -- 一旦选定联赛currentTime如果没有值，默认变成all
				currentTime: null,
				isShowChooseBar: true,
				isShowSort: true,
				sortValue: 0,
				pageNum: 1,
				pageSize: 20,
				tournaments: [],  	// wapEventsByOrder接口返回的数据， tournaments 数组的格式； 当default, time分类是，events 只有一个成员
				moreEvents: false,	// 标识是否存在更多events
				moreLoading: 0,		// 更多加载loadign 状态
				ignoreDeleteChange: false, // 移除空的tournament ，不需要更新接口
				isFirstTournamentChange: false, 	// chooseBar 中 league 是否是首次
				ignoreFirstSort: false, // 忽略路由初次 sort
				isTypeFixed: false, // sport martet nav 是否置顶
			};
		},
		watch: {
			$route: {
				immediate: true,
				handler (route, from) {
					const query = route.query;
					if (query) {
						if (String(query.change_game) === '1') {
							this.isShowChooseBar = false;
							this.isShowSort = false;
						}
					} else {
						this.isShowChooseBar = true;
						this.isShowSort = true;
					}
					// 如果是删除某个tour, 不重置位置
					if (this.ignoreDeleteChange) {
						return;
					}
					this.$nextTick(() => {
						this.scorllEle.scrollTop = 0;
					});
				}
			},
			// 滚动加载更多
			scrollPayload(value) {
				// 顶部置顶
				const $container = this.$refs.container;
				if ($container) {
					const rect = $container.getBoundingClientRect();
					this.isTypeFixed = rect.top <= 0;
				}

				// 滚动架子啊
				const eventList = this.$refs.eventList;
				// 没有更多了
				if (!this.moreEvents) {
					return;
				}
				const bottom = eventList.offsetTop + eventList.clientHeight;
				// 需要加载更多
				if (value.scrollTop + value.clientHeight > bottom) {
					this.onLoadMore();
				}
			},
			currentMarkets(val) {
				if (val) {
					// 重新计算ul容器的宽度及定位
					this.$nextTick(() => {
						this.$refs.marketsNavs.$emit('computeWidth');
					});
				}
			}
		},
		created () {
			// 首次加载处理
			// 全屏幕加载中，等待changeChoose触发，并取列表数据,这里必须先有条件触发
			this.pageLoading(true);
			// 默认先设置一个market
			this.currentMarketId = this.currentMarkets[0].id;
			this.subProductStatus();

			const query = this.$route.query;

			if (query.change_game === '1') {
				this.isShowChooseBar = false;
				this.isShowSort = false;
				this.sortValue = 2;
			}
			if (query.sort) {
				const querySort = parseInt(query.sort, 10) || 0;
				this.sortValue = querySort;
				// sortValue = 0 时没有 触发change
				if (querySort) {
					this.ignoreFirstSort = true;
				}
			}
			// 设置sort的状态
			if (this.sortValue !== 0) {
				this.$nextTick(() => {
					const sort = this.$refs.sort;
					sort && sort.setActiveIndex(this.sortValue);
				});
			}
			// 注册fetchParams 监听事件；减少不必要的初始接口重复请求
			this.$watch('fetchParams', this.fetchParamsHandler);
		},
		mounted () {
			this.scorllEle = document.querySelector('.m-main-mid');
		},
		beforeDestroy () {
			this.unSubProductStatus();
		},
		computed: {
			homeUrl() {
				return pagePath.home;
			},
			sportsUrl() {
				return pagePath.sports;
			},
			currentMarkets () {
				return MARKETITEMS[this.currentSportId];
			},
			// tournaments 按 category 分组
			tournamentIds() {
				return this.currentTournaments.map(tour => [tour.tournamentId]);
			},
			params() {
				const params = {
					sportId: this.currentSportId,
					marketId: this.currentMarkets.map(market => market.id).join(','),
					productId: 3,
					order: this.sortValue,
					...getTimeParam(this.currentTime)
				};
				return params;
			},
			// 请求wapEventByOrder接口 参数
			fetchParams() {
				const params = Object.assign({}, this.params);

				if (this.tournamentIds.length > 0) {
					params.tournamentId = this.tournamentIds;
				}
				return params;
			},
			// default, time 排序时 数据格式 [sortValue = [0, 1]]
			events() {
				const tournaments = this.tournaments;
				const events = tournaments.map(tour => tour.events || []);
				let result = [];
				events.forEach(event => {
					result = [...result, ...event];
				});

				return result;
			},
			// events 从 数组 convert 到 map 输出{ orders, map }结构，适配 EventsList组件props
			// eventsMap() {
			// 	let result = this.events;
			// 	// deepClone  convertEventsToMap 会 delete event.sport 导致属性丢失； 多处引用统一sport对象导致的问题
			// 	result = JSON.stringify(result);
			// 	result = JSON.parse(result);
			// 	return convertEventsToMap(result);
			// },
			// 是否需要 分页加载
			isPageLoad() {
				return [0, 1].includes(this.sortValue);
			},
			// 分页加载下 是否 多余 1页 显示 更多部分
			isShowMore() {
				const noMore = this.pageNum === 1 && this.moreEvents === false;
				return !noMore && this.isPageLoad;
			},
			isMoreReady() {
				return [0, 2].includes(this.moreLoading);
			},
			tournamentOptions() {
				return {
					tournamentIds: this.tournamentIds,
					ignore: this.ignoreDeleteChange
				};
			},
			currentSportName () {
				return sportsConfigById[this.currentSportId].name;
			},
			routeQuery() {
				return this.$route.query || {};
			},
			...mapState('eventList', ['changeSportsLoading', 'productStatus']),
			...mapState('layout', ['scrollPayload'])
		},
		methods: {
			handleBack () {
				// 不显示 chooseBar 时， 使用浏览器go回退
				if (!this.isShowChooseBar) {
					window.history.go(-1);
					return;
				}
				location.href = URL.addPara(this.sportsUrl, {
					sport: this.currentSportName
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

				// 当在league 选择列表中存在 该删除tour时， 进行列表变更
				const tour = this.currentTournaments.find(cur => cur.tournamentId === tournamentId);
				if (tour) {
					// 当league 只有一个的时候，删除就没有了，需要重新更新，不能忽略了
					if (this.currentTournaments.length > 1) {
						this.ignoreDeleteChange = true;
					}
					// 会导致 页面重新加载
					const chooseBar = this.$refs.chooseBar;
					if (chooseBar) {
						chooseBar.deleteTournament(tournamentId);
					}
				}
			},
			// choosBar 过滤器 change 响应，更新过滤条件
			changeChoose ({ currentTime, currentSportId, currentTournaments, fromRouter, resetStatus } = {}) {
				this.currentSportId = currentSportId;
				this.currentTime = currentTime;
				// currentTournaments 变化
				if (this.currentTournaments !== currentTournaments && currentTournaments.length > 0) {
					// 第一次，来自路由
					if (fromRouter && this.$route.query.sort) {
						this.isFirstTournamentChange = true;
					} else {
						this.onTournamentChange();
					}
				}
				// 重置tournaments; 没有tournament时reset 不会 重置sort
				if (resetStatus && this.currentTournaments.length > 0) {
					this.sortValue = 0;
					this.isFirstTournamentChange = false;
					const sort = this.$refs.sort;
					sort && sort.setActiveIndex(0);
				}
				this.currentTournaments = currentTournaments;
				this.currentMarketId = MARKETITEMS[currentSportId][0].id;
				// 来自路由的数据变化，不再次改变路由
				if (!fromRouter) {
					this.changeRouter();
				}
			},
			loadingFail () {
				const params = this.fetchParams;
				params.pageSize = this.pageSize;
				params.pageNum = 1;
				this.fetchEventList(params);
			},
			// sort 排序
			onSortChanged(data) {
				this.sortValue = data.value;
				if (this.isShowSort && !this.ignoreFirstSort) {
					this.changeRouter();
				}

				this.ignoreFirstSort = false;
			},
			fetchWapEvents(params) {
				const userId = cookie('userId');
				if (userId) {
					params.userId = userId;
				}
				return fetch('/factsCenter/wapEventsByOrder', {
					body: JSON.stringify(params),
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/json'
					}),
				})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						// 根据 order 分为两类 [event-list, tournament-list]
						const pageNum = params.pageNum || 1;
						if (pageNum === 1) {
							const tours = res.data.tournaments || [];
							// league 模式下第一个默认加载
							if (this.sortValue === 2 && tours[0]) {
								tours[0].loaded = true;
							}
							this.tournaments = tours;
						} else {
							this.tournaments = [...this.tournaments, ...res.data.tournaments];
						}
						this.moreEvents = res.data.moreEvents;
						return res.data;
					}
					return Promise.reject(res.message);
				});
			},
			// 封装了 tab 的loading 状态
			fetchEventList(params) {
				// tab loading 状态
				this.changeTabLoading(true);
				return this.fetchWapEvents(params)
				.then(() => {
					this.changeTabLoading(false);
					this.pageLoading(false);
				})
				.catch(() => {
					this.changeTabLoading(-1);
					this.pageLoading(false);
				});
			},
			// 加载下一页 请求
			loadNextPage() {
				const params = this.fetchParams;
				params.pageSize = this.pageSize;
				params.pageNum = this.pageNum;

				this.moreLoading = 1; // loading
				this.fetchWapEvents(params)
				.then(() => {
					this.moreLoading = 2;
				}).catch(() => {
					this.moreLoading = 3;
				});
			},
			onLoadMore() {
				// loading, fail 状态不会重复load
				if (!this.isMoreReady) {
					return;
				}
				this.pageNum++;
				this.loadNextPage();
			},
			...mapMutations('layout', {
				pageLoading: CHANGE_LOADING
			}),
			...mapActions('eventList', ['subProductStatus', 'unSubProductStatus']),
			...mapMutations('eventList', {
				changeTabLoading: CHANGE_SPORTS_LOADING
			}),
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
			// league选定 ，调整 sort 分类
			onTournamentChange() {
				// 仅第一次tournaments变化时 设置 sort
				if (!this.isFirstTournamentChange) {
					this.sortValue = 2;
					const sort = this.$refs.sort;
					sort && sort.setActiveIndex(2);
					this.isFirstTournamentChange = true;
				}
			},
			// 过滤条件 变化时，触发列表更新
			fetchParamsHandler(params) {
				// 忽略此次变更
				if (this.ignoreDeleteChange) {
					// 传递给eventsLeague, 用来阻止重置状态
					this.$nextTick(() => {
						this.ignoreDeleteChange = false;
					});
					return;
				}
				// 重置loadMore 相关状态
				this.pageNum = 1;
				this.moreLoading = 0;
				this.moreEvents = false;

				// 条件变化，分页重置，从第一页开始
				if (this.isPageLoad) {
					params.pageNum = 1;
					params.pageSize = this.pageSize;
				}
				this.$nextTick(() => {
					this.fetchEventList(params);
				});
			},
			/**
			 *  根据当前参数修改路由
			 * ！！！important 这里用到了 replace改变路由，需要特别注意
			*/
			changeRouter () {
				// 不穿表示全部， today传递空，取全部
				const time = this.currentTime && this.currentTime.value ? this.currentTime.value : undefined;
				// 没有选择联赛，则进入默认路由
				if (!this.currentTournaments.length) {
					const query = time && time !== 'today' ? { time } : {};
					query.sort = this.sortValue;
					this.$router.replace({
						name: time === 'today' ? 'eventListToday' : 'eventListDefault',
						params: {
							sportName: this.currentSportName
						},
						query: Object.assign({}, this.routeQuery, query)
					});
				} else {
					const is = {};
					const result = this.currentTournaments.reduce((result, current) => {
						const { tournaments, categories } = result;
						const { categoryId, tournamentId } = current;
						if (!is[categoryId]) {
							categories.push(categoryId);
							is[categoryId] = true;
						}
						tournaments.push(tournamentId);
						return result;
					}, {
						tournaments: [],
						categories: [],
					});
					this.$router.replace({
						name: 'eventList',
						params: {
							sportName: this.currentSportName,
							categoryId: result.categories.join('_'),
							tournamentId: result.tournaments.join('_')
						},
						query: Object.assign({}, this.routeQuery, {
							time,
							sort: this.sortValue
						})
					});
				}
			},
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
.m-event-list {
	background-color: @white;
	color:@dark;
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
	.m-loading-wrap{
		margin-top: 15%;
	}
	.m-sanp-nav-container{
		height: 48/@rem;
		width: 100%;
	}
	.m-sport-type{
		border-bottom: 1px solid @fogGray;

		.m-sport-type-item{
			font-size: 14/@rem;
			padding: 11/@rem 15/@rem;
			font-weight: normal;
			&.active{
				border-bottom: 4px solid @green;
			}

			&:first-child {
				margin-left: 10/@rem;
			}
			&:last-child {
				margin-right: 10/@rem;
			}
		}
		&.m-sport-type-fixed{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			background-color: #FFF;
		}
	}
	.m-bet-load-more {
		position: relative;
		min-height: 20/@rem;
		padding: 20/@rem 0;
		line-height: 20/@rem;
		text-align: center;
	}
	.bet-load-more-loading {
		display: flex;
		justify-content: center;
		height: 100%;
		text-align: center;
	}
	.bet-load-more-loading-text{
		margin-left: 5/@rem;
		font-size: 14/@rem;
	}
	.bet-load-more-loading-icon {
		width: 16/@rem;
		height: 16/@rem;
		background: @white;
		.m-icon-loading-circle();
		animation: circles 1s infinite;
		animation-timing-function: linear;
		&:before {
			height: 16/@rem;
			width: 16/@rem;
			line-height: 1;
			font-size: 16/@rem;
			color: @midGray;
		}
	}
}
</style>
