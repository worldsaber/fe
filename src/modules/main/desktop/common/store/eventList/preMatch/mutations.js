import Vue from 'vue';
import { convertEventsToMap, updateMarketOutCome, updateEvent } from 'components/eventList/util';
import clearPushData from 'store/eventDetail/clearPushData';
import clearTopicInfo from 'store/eventDetail/clearTopicInfo';
import {
	FETCH_SPORTS_LIST,
	SPORT_LOADING,
	TOGGLE_SHOW_PAGE,
	FETCH_IMPORT_MATCH,
	UPDATE_TOURNAMENT,
	RESET_SPORT_LIST,
	DEL_TOURNAMENT,
	UPDATE_EVENT,
	UPDATE_OUTCOME,
	UPDATE_MARKET,
	CHANGE_PAGE,
	TOGGLE_H2H_STATUS,
	UPDATE_PRODUCT_STATUS
} from './mutationTypes';

const detailEventData = function (data) {
	const d = { tournamentOrder: [], map: {}};
	for (const tournament of data) {
		d.tournamentOrder.push(tournament.id);
		// 数组为空也必须保存，没有数据表示未加载
		if (tournament.events) {
			const res = convertEventsToMap(tournament.events);
			tournament.events = res.map;
			tournament.eventOrder = res.order;
		}
		d.map[tournament.id] = tournament;
	}
	return d;
};

export default {
	// 获取赛事列表
	[FETCH_SPORTS_LIST](state, data = []) {
		// 倒叙显示
		state.sport = detailEventData(data);
	},
	// 默认进入页面获取重要比赛
	[FETCH_IMPORT_MATCH] (state, data = {}) {
		// today games upcoming games default game有分页
		if (data.totalNum) {
			state.totalNum = data.totalNum;
		}
		state.sport = detailEventData(data.tournaments || []);
	},
	// 翻页
	[CHANGE_PAGE] (state, page) {
		state.pageNum = page;
	},
	[TOGGLE_SHOW_PAGE] (state, data = false) {
		state.isShowPagination = data;
	},
	// 如果是不停的选择联赛就出发这个 -- 增加或者更新一个tournament
	// 这里的data应该是一条tournament下的数据
	[UPDATE_TOURNAMENT] (state, data) {
		const sport = state.sport;
		let map = sport.map;
		let tournamentOrder = sport.tournamentOrder;
		// 如果数据是空就设置数据
		if (!map) {
			map = {};
			tournamentOrder = [];
			Vue.set(sport, 'map', map);
			Vue.set(sport, 'tournamentOrder', tournamentOrder);
		}
		// 转换下面的events数据
		if (data.events) {
			const res = convertEventsToMap(data.events);
			data.events = res.map;
			data.eventOrder = res.order;
		}
		if (data.id) {
			if (!map[data.id]) {
				// 数据更新
				Vue.set(map, data.id, data);
				// order更新
				tournamentOrder.push(data.id);
			} else {
				// 已经存在这个数据，只需要更新数据即可
				Object.assign(map[data.id], data);
			}
		}
	},
	// 删除一个 tournamnt
	[DEL_TOURNAMENT] (state, tournamentId) {
		const sport = state.sport;
		if (sport.map && sport.map[tournamentId]) {
			Vue.delete(sport.map, tournamentId);
			// 这个比赛下的所有event解除 推送订阅
			const index = sport.tournamentOrder.findIndex(cur => cur === tournamentId);
			if (index > -1) {
				sport.tournamentOrder.splice(index, 1);
			}
		}
	},
	// 重置比赛
	[RESET_SPORT_LIST] (state) {
		state.sport = {
			map: {},
			tournamentOrder: []
		};
		state.pageNum = 1;
	},
	// 切换比赛loading
	[SPORT_LOADING] (state, data = false) {
		state[SPORT_LOADING] = data;
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
		// 只删除比赛，不新增比赛
		updateEvent(map, order, eventInfo, topicInfo, 3, false, true);
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
	// 更改 h2hStatus 状态
	[TOGGLE_H2H_STATUS] (state, eventId) {
		state.h2hStatus = {
			[eventId]: !state.h2hStatus[eventId]
		};
	},
	// 更新productStatus
	[UPDATE_PRODUCT_STATUS] (state, data = 0) {
		state.productStatus = data;
	},
};
