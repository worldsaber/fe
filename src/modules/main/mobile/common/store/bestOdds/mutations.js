import {
	convertEventsToMap,
	updateMarketOutCome,
	updateEvent
} from 'components/eventUtil/util';
import clearPushData from 'components/eventUtil/clearPushData';
import clearTopicInfo from 'components/eventUtil/clearTopicInfo';

import * as types from './mutationTypes.js';

function getEventType(status, bookingStatus) {
	if ((status === 1 || status === 2)) {
		// live
		// getBestOddsList 接口返回的数据需要判断下bookingStatus
		if (!bookingStatus || /^Booked$/i.test(bookingStatus)) {
			return 'live';
		}
	} else if (status === 0 || status === 7) {
		// prematch
		return 'prematch';
	}
}

export default {
	[types.FETCH_BEST_ODDS](state, data = []) {
		if (data && Array.isArray(data)) {
			const map = {};
			const tournamentOrder = [];

			data.forEach(item => {
				map[item.id] = item;
				// if (!item.eventSize && item.events) {
				// 	map[item.id].eventSize = item.events.length;
				// }

				// 这里直接用events.length来统计数量，会随着比赛的删减而变化
				map[item.id].eventSize = item.events.length;

				tournamentOrder.push(item.id);

				// 判断并添加 event 类型，是 live，还是 prematch ?
				const events = map[item.id].events.filter((x, index) => {
					const eventType = getEventType(x.status, x.bookingStatus);
					x.eventType = eventType;
					return !!eventType;
				});

				const res = convertEventsToMap(events);

				map[item.id].events = res.map;
				map[item.id].eventOrder = res.order;
			});

			state.bestOdds = {
				map,
				tournamentOrder
			};
		}
	},

	[types.UPDATE_PRODUCT_STATUS](state, data = 0) {
		state.productStatus = data;
	},

	[types.UPDATE_EVENT](state, data) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');

		const bestOdds = state.bestOdds;

		const eventType = getEventType(eventInfo.status);
		eventInfo.eventType = eventType;
		const productId = eventType === 'live' ? 1 : 3;

		let map = bestOdds.map;
		let order = bestOdds.tournamentOrder;
		if (!map) {
			map = {};
			bestOdds.map = map;
		}
		if (!order) {
			order = [];
			bestOdds.tournamentOrder = order;
		}
		updateEvent(map, order, eventInfo, topicInfo, productId, false);
	},

	[types.UPDATE_MARKET](state, data) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');

		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];

		const { tournamentId, eventId } = topicInfo;
		const { map } = state.bestOdds;
		if (map && map[tournamentId]) {
			const { events } = map[tournamentId];
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo);
				}
			}
		}
	},

	[types.UPDATE_ODDS](state, data) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const pushOutcomeInfos = clearPushData(data, 'odds') || {};

		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		marketId = marketId.split('?');
		marketId = marketId[0];

		const { tournamentId, eventId } = topicInfo;
		const { map } = state.bestOdds;
		if (map && map[tournamentId]) {
			const { events } = map[tournamentId];
			if (events) {
				const event = events[eventId];
				if (event) {
					const market = event.markets ? event.markets[marketId] : undefined;
					updateMarketOutCome(event, market, pushMarketInfo, topicInfo, pushOutcomeInfos);
				}
			}
		}
	}
};
