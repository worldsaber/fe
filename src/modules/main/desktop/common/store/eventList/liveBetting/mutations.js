import { convertEventsToMap, updateMarketOutCome, updateEvent } from 'components/eventList/util';
import clearPushData from 'store/eventDetail/clearPushData';
import clearTopicInfo from 'store/eventDetail/clearTopicInfo';
import {
	FETCH_SPORTS_LIST,
	SPORT_LOADING,
	CHANGE_SPORT,
	UPDATE_EVENT,
	UPDATE_OUTCOME,
	UPDATE_MARKET,
	UPDATE_PRODUCT_STATUS
} from './mutationTypes';

export default {
	// 获取赛事列表
	[FETCH_SPORTS_LIST](state, data = {}) {
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
	},
	// -1 表示加载出错， true表示加载中，false表示加载完成 暂时无用，如果顶部列表动态获取时候游泳
	[SPORT_LOADING](state, data = false) {
		state.sportLoading = data;
	},
	[CHANGE_SPORT] (state, val) {
		state.currentSportId = val;
	},
	// push更新event
	[UPDATE_EVENT] (state, data = []) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');
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
};
