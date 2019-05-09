/**
 * XXX_LOADING 值统一说明：
 * 	-1 表示加载出错， true表示加载中，false表示加载完成
 */
import Vue from 'vue';
import {
	convertEventsToMap,
	updateMarketOutCome
} from 'components/eventUtil/util';
import clearPushData from 'components/eventUtil/clearPushData';
import clearTopicInfo from 'components/eventUtil/clearTopicInfo';
import * as types from './mutationTypes';
import { updateEventByEvt, updateLeagues, deleteLeague } from './commonFun.js';
import topNavs from './topNavs.js';

export default {
	// 获取主要配置
	[types.HOME_CFG] (state, data = {
		// 渠道信息
		ch: '',
		// 顶部广告
		topAd: '',
		// 轮播图
		mainBanner: [],
		// 推荐玩法
		popularList: [],

		// 活动弹窗
		alertBanner: [],
		// today event list 广告
		eventInner: []
	}) {
		if (data.popularList && Array.isArray(data.popularList)) {
			state.homeCfg = Object.assign({}, data, {
				popularList: data.popularList.map(x => Object.assign({}, x, {
					linkUrl: URL.addPara(x.linkUrl, {
						source: 'home'
					})
				}))
			});
		} else {
			state.homeCfg = { ...data };
		}
	},
	// 获取顶部玩法大分类
	[types.TOP_SPORT_LIST](state, data = []) {
		// 优先走后台配置，没有的话，我们有默认值
		if (data && data.length) {
			state.topSportList = data.map(x => ({
				text: x.text || x.btnText,
				imgUrl: x.imgUrl,
				linkUrl: x.linkUrl
			}));
		} else {
			state.topSportList = topNavs;
		}
	},
	// 获取推荐比赛
	[types.FETCH_RECOMMEND_EVENTS](state, data = {}) {
		if (data && data.events && data.events.length) {
			const events = data.events.filter(x => [0, 1, 2].includes(x.status));
			const res = convertEventsToMap(events);
			state.recommendEvents = Object.assign({}, data, {
				events: res.map,
				eventOrder: res.originOrder,
				eventSize: data.eventSize // 注意：这里必须要用后台返回的字段，不能默认用 events.length来补充
			});
		}
	},
	[types.UPDATE_RECOMMEND_EVENT](state, data = []) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');

		const recommendEvents = state.recommendEvents;
		const { events = {}, eventOrder = [] } = recommendEvents;

		// 由于这里可能是preMatch/live，所以手动判断状态删除
		if (eventInfo.status !== 0 && eventInfo.status !== 1 && eventInfo.status !== 2) {
			const eventId = topicInfo.eventId;
			Vue.delete(events, eventId);

			const index = eventOrder.findIndex(cur => cur === eventId);
			if (index > -1) {
				eventOrder.splice(index, 1);
			}
		} else {
			let productId = 3;
			if (eventInfo.status === 1 || eventInfo.status === 2) {
				productId = 1;
			}

			updateEventByEvt(events, eventOrder, eventInfo, topicInfo, productId, false, true);
		}
	},
	[types.UPDATE_RECOMMEND_MARKET](state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const eventId = topicInfo.eventId;

		let marketId = topicInfo.marketId;

		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];

		const recommendEvents = state.recommendEvents;
		if (recommendEvents && recommendEvents.events) {
			const events = recommendEvents.events;
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo);
				}
			}
		}
	},
	[types.UPDATE_RECOMMEND_ODDS](state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const pushOutcomeInfos = clearPushData(data, 'odds') || {};

		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];

		const recommendEvents = state.recommendEvents;
		if (recommendEvents && recommendEvents.events) {
			const events = recommendEvents.events;
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo, pushOutcomeInfos);
				}
			}
		}
	},
	// 获取赛事列表
	[types.FETCH_TODAY_SPORTS_LIST](state, data = []) {
		if (data) {
			state.todaySports = data;
		}
	},
	// 获取 top leagues 列表
	[types.FETCH_TOP_LEAGUES](state, { data } = {}) {
		if (data) {
			const map = {};
			const tournamentOrder = [];
			for (const key of data) {
				map[key.id] = key;
				if (!key.eventSize && key.events) {
					map[key.id].eventSize = key.events.length;
				}
				tournamentOrder.push(key.id);
				const res = convertEventsToMap(map[key.id].events);

				map[key.id].events = res.map;
				map[key.id].eventOrder = res.order;
			}
			state.topLeagues = {
				map,
				tournamentOrder
			};
		}
	},
	// 获取直播列表
	[types.FETCH_LIVE_LIST](state, { id, data } = {}) {
		if (id && data) {
			// 频繁切换数据校验
			if (id !== state.currentLiveId) {
				return;
			}
			const events = { order: {}, map: {}};
			convertEventsToMap(data, events);
			state.live = {
				events: events.map,
				eventOrder: events.order
			};
		}
	},
	[types.CHANGE_LIVE_ID] (state, id) {
		state.currentLiveId = id;
	},
	[types.CHANGE_SPORT_ID] (state, id) {
		state.currentSportId = id;
	},
	// -1 表示加载出错， true表示加载中，false表示加载完成
	[types.RECOMMEND_LOADING](state, data = false) {
		state.recommendLoading = data;
	},
	// -1 表示加载出错， true表示加载中，false表示加载完成
	[types.LIVE_LOADING](state, data = false) {
		state.liveLoading = data;
	},
	// -1 表示加载出错， true表示加载中，false表示加载完成
	[types.TODAY_SPORTS_LOADING](state, data = false) {
		state.todaySportsLoading = data;
	},
	// -1 表示加载出错， true表示加载中，false表示加载完成
	[types.TOP_LEAGUES_LOADING](state, data = false) {
		state.topLeaguesLoading = data;
	},
	// 切换直播loading
	[types.CHANGE_LIVE_LOADING] (state, data = false) {
		state.changeLiveLoading = data;
	},
	// live push更新event
	[types.UPDATE_LIVE_EVENT] (state, data = []) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');
		const live = state.live;
		if (!live.eventOrder) {
			Vue.set(live, 'eventOrder', {});
		}
		if (!live.events) {
			Vue.set(live, 'events', {});
		}
		// 不可以插入比赛
		updateEventByEvt(live.events, live.eventOrder, eventInfo, topicInfo, 1, false, true);
	},
	// live push 更新market
	[types.UPDATE_LIVE_MARKET] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const live = state.live;
		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];
		if (live && live.events) {
			const events = live.events;
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo);
				}
			}
		}
	},
	// live push 更新outcome
	[types.UPDATE_LIVE_OUTCOME] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const pushOutcomeInfos = clearPushData(data, 'odds') || {};
		const live = state.live;
		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];
		if (live && live.events) {
			const events = live.events;
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo, pushOutcomeInfos);
				}
			}
		}
	},
	// 更新推荐比赛的productStatus
	[types.UPDATE_RECOMMEND_PRODUCT_STATUS] (state, data = 0) {
		state.recommendProductStatus = data;
	},
	// 更新premath的productStatus
	[types.UPDATE_SPORT_PRODUCT_STATUS] (state, data = 0) {
		state.sportProductStatus = data;
	},
	// 更新live的productStatus
	[types.UPDATE_LIVE_PRODUCT_STATUS] (state, data = 0) {
		state.liveProductStatus = data;
	},

	// 如果是不停的选择联赛就出发这个 -- 增加或者更新一个tournament
	// 这里的data应该是一条tournament下的数据
	[types.UPDATE_TOURNAMENT] (state, list = []) {
		updateLeagues(state.topLeagues, list);
	},
	// 删除某一个 tournament
	[types.DELETE_TOURNAMENT](state, tournamentId) {
		deleteLeague(state.topLeagues, tournamentId);
	},

	// 获取大数据推荐比赛（定制比赛）
	[types.FETCH_CUSTOM_EVENTS](state, data = []) {
		state.customEvents = data;
	},
	[types.UPDATE_CUSTOM_EVENTS_LOADING](state, data = false) {
		state.customEventsLoading = data;
	},

	// 获取 highlight 下 Top Team 比赛和热门联赛
	[types.FETCH_MIX_HIGHLIGHT_EVENTS](state, { tournaments = [], events = [] }) {
		state.mixHighlightEvents = events;

		// 热门联赛
		const map = {};
		const tournamentOrder = [];
		for (const key of tournaments) {
			map[key.id] = key;
			if (!key.eventSize && key.events) {
				map[key.id].eventSize = key.events.length;
			}
			tournamentOrder.push(key.id);
			const res = convertEventsToMap(map[key.id].events);

			map[key.id].events = res.map;
			map[key.id].eventOrder = res.order;
		}
		state.mixHighlightLeagues = {
			map,
			tournamentOrder
		};
	},
	// 更新 highlight 下单个 league
	[types.UPDATE_MIX_HIGHLIGHT_LEAGUES] (state, list = []) {
		updateLeagues(state.mixHighlightLeagues, list);
	},
	// 删除 mix highlights 下某一个 tournament
	[types.DELETE_MIX_HIGHLIGHT_LEAGUE](state, tournamentId) {
		deleteLeague(state.mixHighlightLeagues, tournamentId);
	},

	[types.UPDATE_MIX_HIGHLIGHT_LOADING](state, data = false) {
		state.mixHighlightLoading = data;
	}
};
