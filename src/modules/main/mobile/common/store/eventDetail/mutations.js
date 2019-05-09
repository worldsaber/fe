import { converEventToMap, updateMarketOutCome, updateMarketStatus } from 'components/eventUtil/util';
import clearPushData from 'components/eventUtil/clearPushData';
import clearTopicInfo from 'components/eventUtil/clearTopicInfo';
import Vue from 'vue';
import { LS } from 'storage';
import { isEmptyObject } from 'utils';
import { FETCH_MARKET_GROUP,
		FETCH_EVENT,
		SET_MARKET_PRIORITY,
		SET_SPORT,
		SET_CURRENT_MARKET_GROUP,
		FETCH_THUMBNAIL_MATCH,
		UPDATE_EVENT,
		UPDATE_MARKET,
		UPDATE_OUTCOME,
		FETCH_LIVE_CHANNEL,
		UPDATE_FAVORMARKETIDS,
		SPLICE_FAVORMARKETID,
		UNSHIFT_FAVORMARKETID,
	} from './mutationTypes';

export default {
	[FETCH_MARKET_GROUP] (state, data = []) {
		state.marketGroup = data;
	},

	[FETCH_EVENT] (state, data = {}) {
		state.currentEventId = data.eventId;
		state.event = converEventToMap(data);
		state.currentSportId = state.event.sportId;
		state.liveChannel = data.liveChannel;
	},
	// 置顶或者取消置顶一场比赛一场比赛 (marketId?speciefier)
	[SET_MARKET_PRIORITY](state, marketId) {
		if (marketId) {
			const sportId = state.currentSportId;
			const priorityMarketMap = state.priorityMarketMap;
			let markets = priorityMarketMap[sportId];
			if (!markets) {
				markets = [];
				Vue.set(priorityMarketMap, sportId, markets);
			}
			const index = markets.indexOf(marketId);
			if (index !== -1) {
				markets.splice(index, 1);
			} else {
				markets.unshift(marketId);
			}
			if (!markets.length) {
				Vue.delete(priorityMarketMap, sportId);
			}
			const is = isEmptyObject(priorityMarketMap);
			if (!is) {
				LS.set('priorityMarketKeys', JSON.stringify(priorityMarketMap));
			} else {
				LS.remove('priorityMarketKeys');
			}
		}
	},
	[SET_CURRENT_MARKET_GROUP] (state, group) {
		state.currentMarketGroup = group;
	},
	// 获取比赛缩略图
	[FETCH_THUMBNAIL_MATCH] (state, data) {
		if (data && data.length) {
			// liveThumbnailMatch
			state.liveThumbnailMatch = data.reduce((res, current) => {
				// 拍平sport字段
				if (current.events) {
					current.events.forEach(event => {
						const sport = event.sport;
						delete event.sport;
						event.sportId = sport.id;
						event.sportName = sport.name;
						event.categoryName = sport.category.name;
						event.categoryId = sport.category.id;
						event.tournamentId = sport.category.tournament.id;
						event.tournamentName = sport.category.tournament.name;
					});
					res.push(current);
				}
				return res;
			}, []);
		} else {
			state.liveThumbnailMatch = [];
		}
	},
	// 重置整个比赛 每次切换比赛的时候应该重置下数据
	// eventId默认为空就取最近的一场比赛
	// 请调用actions触发，因为action中有取消订阅
	[SET_SPORT] (state, {
		eventId,
		sportId
	}) {
		if (sportId) {
			state.event = {};
			state.marketGroup = [];
			state.currentMarketGroup = null;
			state.currentEventId = eventId || null;
			state.currentSportId = sportId;
		}
	},
	// push更新event
	[UPDATE_EVENT] (state, data = []) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');
		const eventId = topicInfo.eventId;
		const productId = +topicInfo.productId;
		const event = state.event;
		// 只有新增的时候更新 totalMarketSize
		const bmLcooCount = eventInfo.bmLcooCount;
		const bmLiveCount = eventInfo.bmLiveCount;
		delete eventInfo.bmLcooCount;
		delete eventInfo.bmLiveCount;
		if (event && event.eventId === eventId && eventInfo) {
			if (productId === 3) {
				eventInfo.totalMarketSize = bmLcooCount;
			} else {
				eventInfo.totalMarketSize = bmLiveCount;
			}
			state.event = { ...event, ...eventInfo };
			const betStatus = event.betStatus;
			if (betStatus && (betStatus === 1 || betStatus === 2)) {
				updateMarketStatus(event.markets, betStatus);
			}
		}
	},
	// push 更新market
	[UPDATE_MARKET] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		// console.log('start markets');
		// console.log(JSON.stringify(topicInfo));
		// console.log(JSON.stringify(pushMarketInfo));
		marketId = marketId.split('?');
		marketId = marketId[0];
		const event = state.event;
		if (event && event.eventId === eventId) {
			const market = event.markets ? event.markets[marketId] : undefined;
			updateMarketOutCome(event, market, pushMarketInfo, topicInfo);
		}
	},
	// push 更新outcome
	[UPDATE_OUTCOME] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const pushOutcomeInfos = clearPushData(data, 'odds') || {};
		const eventId = topicInfo.eventId;
		let marketId = topicInfo.marketId;
		if (!marketId) {
			return;
		}
		// console.log('start odds');
		// console.log(JSON.stringify(topicInfo));
		// console.log(JSON.stringify(pushOutcomeInfos));
		marketId = marketId.split('?');
		marketId = marketId[0];
		const event = state.event;
		if (event && event.eventId === eventId) {
			const market = event.markets ? event.markets[marketId] : undefined;
			updateMarketOutCome(event, market, pushMarketInfo, topicInfo, pushOutcomeInfos);
		}
	},
	// 获取直播流信息
	[FETCH_LIVE_CHANNEL] (state, data) {
		state.liveChannelUrl = data;
	},
	[UPDATE_FAVORMARKETIDS](state, marketIds) {
		state.favorMarketIds = marketIds;
	},
	[SPLICE_FAVORMARKETID](state, index) {
		state.favorMarketIds.splice(index, 1);
	},
	[UNSHIFT_FAVORMARKETID](state, marketId) {
		state.favorMarketIds.unshift(marketId);
	}
};
