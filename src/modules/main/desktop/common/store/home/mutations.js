import { isEmptyObject } from 'utils';
import { convertEventsToMap, updateMarketOutCome, updateEvent } from 'components/eventList/util';
import clearPushData from 'store/eventDetail/clearPushData';
import clearTopicInfo from 'store/eventDetail/clearTopicInfo';
import * as mutationTypes from './mutationTypes';

export default {

	// 获取首页配置 (Popular 部分)
	// [mutationTypes.UPDATE_HOME_PC](state, data) {
	// 	if (!data) return;
    //
	// 	data.mainBanner.forEach(banner => {
	// 		const obj = {};
	// 		obj.link = banner.linkUrl;
	// 		obj.img = banner.imgUrl;
	// 		state.mainBanner.push(obj);
	// 	});
	// 	state.secondBanner = data.secondBanner;
	// 	state.popularList = data.popularList;
	// },
	// 获取 important match 列表
	[mutationTypes.UPDATE_IMPORTANT_MATCH](state, data) {
		if (!data) {
			return;
		}
		const map = {};
		const tournamentOrder = [];
		for (const key of data) {
			map[key.id] = key;
			tournamentOrder.push(key.id);
			// 玩法分类放到比赛里面了，向前放置
			// const sport = map[key.id].events[0].sport;
			// key.sportName = sport.name;
			// key.sportId = sport.id;
			// key.categoryId = sport.category.id;
			// key.categoryName = sport.category.name;
			const res = convertEventsToMap(map[key.id].events);
			map[key.id].events = res.map;
			map[key.id].eventOrder = res.order;
		}
		state.sport = { map, tournamentOrder };
	},

	// 获取 live match 列表
	[mutationTypes.UPDATE_LIVE_MATCH](state, data) {
		// 此处最多显示10场比赛，但是后台跟live的列表页面公用一个接口所有数据
		// 吕文凯要求前端自动截取前10场比赛，并承诺以后不在换接口!!!!
		// 吕文凯要求前端自动截取前10场比赛，并承诺以后不在换接口!!!!
		// 吕文凯要求前端自动截取前10场比赛，并承诺以后不在换接口!!!!
		if (!data) {
			return;
		}
		const map = {};
		let matchSize = 0;
		const tournamentOrder = [];
		let showViewAll = false;
		for (const key of data) {
			map[key.id] = key;
			tournamentOrder.push(key.id);
			const size = matchSize + key.events.length || 0;
			if (size - 10 > 0) {
				showViewAll = true;
				key.events = key.events.slice(0, 10 - matchSize);
			}
			const res = convertEventsToMap(map[key.id].events);
			map[key.id].events = res.map;
			map[key.id].eventOrder = res.order;
			if (size - 10 > 0) {
				break;
			} else {
				matchSize = size;
			}
		}
		state.live = { map, tournamentOrder, showViewAll };
	},
	// sport push更新event
	[mutationTypes.UPDATE_SPORT_EVENT] (state, data = []) {
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
		updateEvent(map, order, eventInfo, topicInfo, 3, false, true);
	},
	// sport push 更新market
	[mutationTypes.UPDATE_SPORT_MARKET] (state, data = []) {
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
	// sport push 更新outcome
	[mutationTypes.UPDATE_SPORT_OUTCOME] (state, data = []) {
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
	// live push更新event
	[mutationTypes.UPDATE_LIVE_EVENT] (state, data = []) {
		const eventInfo = clearPushData(data, 'event');
		const topicInfo = clearTopicInfo(data.topic, 'event');
		let map = state.live.map;
		let order = state.live.tournamentOrder;
		if (!map) {
			map = {};
			state.live.map = map;
		}
		if (!order) {
			order = [];
			state.live.tournamentOrder = order;
		}
		// 不可以插入比赛
		updateEvent(map, order, eventInfo, topicInfo, 1, false, true);
	},
	// live push 更新market
	[mutationTypes.UPDATE_LIVE_MARKET] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const map = state.live.map;
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
	// live push 更新outcome
	[mutationTypes.UPDATE_LIVE_OUTCOME] (state, data = []) {
		const pushMarketInfo = clearPushData(data, 'market');
		const topicInfo = clearTopicInfo(data[0], 'market');
		const pushOutcomeInfos = clearPushData(data, 'odds') || {};
		const map = state.live.map;
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
	// 更新premath的productStatus
	[mutationTypes.UPDATE_SPORT_PRODUCT_STATUS] (state, data = 0) {
		state.sportProductStatus = data;
	},
	// 更新live的productStatus
	[mutationTypes.UPDATE_LIVE_PRODUCT_STATUS] (state, data = 0) {
		state.liveProductStatus = data;
	},

	// update success ad
	[mutationTypes.UPDATE_PROMOTION_AD](state, adObj = {}) {
		const adSpots = adObj.adSpots || [];

		const promotionAd = {};
		for (const adItem of adSpots) {
			const spotId = adItem.spotId,
				tempKeys = [...state.adIds, ...state.loginAdIds];

			if (spotId && spotId === 'popularList') {
				state.popularList = adItem.ads || [];
			} else if (spotId && tempKeys.includes(adItem.spotId) && adItem.ads) {
				promotionAd[spotId] = adItem.ads;
			}
		}

		if (!isEmptyObject(promotionAd)) {
			state.promotionAd = {
				...state.promotionAd,
				...promotionAd
			};
		}
	},

	[mutationTypes.UPDATE_ADS_LOADING](state, loading) {
		state.adLoading = loading;
	}
};
