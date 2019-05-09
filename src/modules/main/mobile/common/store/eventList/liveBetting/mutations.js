import { convertEventsToMap, updateMarketOutCome, updateEvent } from 'components/eventUtil/util';
import clearPushData from 'components/eventUtil/clearPushData';
import clearTopicInfo from 'components/eventUtil/clearTopicInfo';
import {
	FETCH_SPORTS_LIST,
	SPORTS_LOADING,
	CHANGE_SPORTS_LOADING,
	CHANGE_SPORT,
	UPDATE_EVENT,
	UPDATE_OUTCOME,
	UPDATE_MARKET,
	UPDATE_PRODUCT_STATUS,
	UPDATE_CURRENT_MARKETS,
	UPDATE_UPCOMING_EVENTS,
	UPDATE_FILTER_LIVE_STREAM,
	UPDATE_SPORT_PRODUCT_STATUS,
	UPDATE_SPORT_SIZE
} from './mutationTypes';

// 获取 map 结构中 event 的数量
function getMapEventsSize(map = {}) {
	const tournamentList = Object.values(map);
	return tournamentList.reduce((sum, t) => sum + Object.values(t.events).length, 0);
}

export default {
	// 获取赛事列表
	[FETCH_SPORTS_LIST](state, { data = {}, sportId }) {
		if (sportId !== state.currentSportId) return;
		const d = { tournamentOrder: [], map: {}};
		for (const key of data) {
			d.tournamentOrder.push(key.id);
			if (key.events && key.events.length) {
				// 玩法分类放到比赛里面了，向前放置
				const sport = key.events[0].sport;
				key.sportName = sport.name;
				key.sportId = sport.id;
				key.categoryId = sport.category.id;
				key.categoryName = sport.category.name;
				const res = convertEventsToMap(key.events);

				key.events = res.map;
				key.eventOrder = res.order;
				d.map[key.id] = key;
			}
		}
		state.sport = d;

		// 更新 sportList 中对应 sport 的 eventSize 值
		const currentSport = state.sportList.find(x => x.id === state.currentSportId);
		if (currentSport) {
			currentSport.eventSize = getMapEventsSize(d.map);
		}
	},
	[UPDATE_SPORT_SIZE](state, data = []) {
		data.forEach(x => {
			const sport = state.sportList.find(y => y.id === x.id);
			sport.eventSize = x.eventSize;
		});
	},
	// -1 表示加载出错， true表示加载中，false表示加载完成 暂时无用，如果顶部列表动态获取时候游泳
	[SPORTS_LOADING](state, data = false) {
		state[SPORTS_LOADING] = data;
	},
	// 切换比赛loading
	[CHANGE_SPORTS_LOADING] (state, data = false) {
		state[CHANGE_SPORTS_LOADING] = data;
	},
	[CHANGE_SPORT] (state, val) {
		state.currentSportId = val;

		if (val) {
			state.curMarketId = state.marketIds[val][0] + '';
		}
	},
	// push更新event
	[UPDATE_EVENT] (state, data = []) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');

		// 过滤上一个 sport tab 订阅推送过来的运动数据，只保留当前运动, 注意这里推送过来 sportId 是一个字符串数字
		if (topicInfo.sportId !== state.currentSportId.replace(/\D/g, '')) {
			return;
		}

		let map = state.sport.map;
		let order = state.sport.tournamentOrder;
		if (!map) {
			map = {};
			state.sport.map = map;
		}
		if (!order) {
			order = [];
			state.sport.tournamentOrder = order;
		}
		updateEvent(map, order, eventInfo, topicInfo, 1);

		// 更新 sportList 中对应 sport 的 eventSize 值
		const currentSport = state.sportList.find(x => x.id === state.currentSportId);
		if (currentSport) {
			currentSport.eventSize = getMapEventsSize(map);
		}
	},
	// push 更新market
	[UPDATE_MARKET] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const map = state.sport.map;
		const tournamentId = topicInfo.tournamentId;
		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];
		if (map && map[tournamentId]) {
			const events = map[tournamentId].events;
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo);
				}
			}
		}
	},
	// push 更新outcome
	[UPDATE_OUTCOME] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const pushOutcomeInfos = clearPushData(data, 'odds') || {};
		const map = state.sport.map;
		const tournamentId = topicInfo.tournamentId;
		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];
		if (map && map[tournamentId]) {
			const events = map[tournamentId].events;
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo, pushOutcomeInfos);
				}
			}
		}
	},
	// 更新productStatus
	[UPDATE_PRODUCT_STATUS] (state, data = 0) {
		state.productStatus = data;
	},

	[UPDATE_CURRENT_MARKETS](state, markets = '') {
		state.curMarketId = markets || state.marketIds[state.currentSportId][0] + '';
	},

	[UPDATE_UPCOMING_EVENTS](state, { data } = {}) {
		if (data) {
			state.upComingEvents = data;
		}
	},
	[UPDATE_FILTER_LIVE_STREAM](state, isFitler = false) {
		state.filterLiveStream = isFitler;
	},
	// 更新premath的productStatus
	[UPDATE_SPORT_PRODUCT_STATUS] (state, data = 0) {
		state.sportProductStatus = data;
	},
};
