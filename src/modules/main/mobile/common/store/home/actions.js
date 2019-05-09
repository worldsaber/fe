import { pushTopic } from 'components/eventUtil/util';
import detailPush from 'push/betPush';
import { getComplexAdConfig } from 'utils/getAdConfig';
import Vue from 'vue';
import cookie from 'storage/cookie';
import { getProductStatus } from './commonFun.js';
import * as mutationTypes from './mutationTypes';
import '../../../mockData/home?debug';

const countryCode = window.countryCode;

const liveMt = [
	/**
	 * live比赛event push监听
	 */
	function liveEventListener (commit, data) {
		data = JSON.parse(data); // eslint-disable-line
		commit(mutationTypes.UPDATE_LIVE_EVENT, data);
	},
	function liveMarketListener (commit, data) {
		data = JSON.parse(data); // eslint-disable-line
		commit(mutationTypes.UPDATE_LIVE_MARKET, data);
	},
	/**
	 * live比赛odds push监听
	 }*/
	function liveOddsEventListener (commit, data) {
		data = JSON.parse(data); // eslint-disable-line
		commit(mutationTypes.UPDATE_LIVE_OUTCOME, data);
	},
];

export default {
	// 获取整个首页的配置，包括顶部广告，轮播，popular菜单
	fetchHomeCfg({ commit }) {
		// 先用假数据
		// return Promise.resolve(commit(mutationTypes.HOME_CFG, []));
		// 异常处理统一由入口home处理
		return getComplexAdConfig([
			// { spotId: 'bottomBanner', preserve: '' },
			// 顶部大分类列表
			{ spotId: 'sportsBanner' },
			{ spotId: 'mainBanner' },
			{ spotId: 'secondBanner' },
			{ spotId: 'popularList' },
			{ spotId: 'downloadApp' },
			{ spotId: 'mainGiftBox' },

			// today games inner 广告
			{ spotId: 'eventInner' },

			// 1.2增加活动弹窗
			{ spotId: 'alertBanner' }])
		.then(adData => {
			if (adData) {
				return adData.reduce((res, cur) => {
					if (cur.spotId && cur.ads) {
						res[cur.spotId] = cur.ads;
					}
					return res;
				}, {});
			}
			return Promise.reject();
		})
		.then(data => {
			commit(mutationTypes.HOME_CFG, data || []);
			// 更新导航列表
			commit(mutationTypes.TOP_SPORT_LIST, data.sportsBanner);
		})
		.catch(err => {
			console.log(err); // eslint-disable-line
			// 使用默认配置
			commit(mutationTypes.TOP_SPORT_LIST);
		});
	},
	// 获取推荐比赛
	fetchRecommendEvents ({ commit, state, dispatch }) {
		dispatch('unsubRecommendEvents');
		return fetch('/factsCenter/recommendScrollEvents')
		.then(res => res.json())
		.then(res => {
			const { bizCode, data, message, abort } = res;
			if (bizCode === 10000) {
				// 判断是否product down, 不区分live还是prematch product down了，都不显示。
				const productStatus = getProductStatus(message, 'all');
				commit(mutationTypes.UPDATE_RECOMMEND_PRODUCT_STATUS, productStatus);

				const d = data || {};
				Vue.nextTick(() => commit(mutationTypes.RECOMMEND_LOADING, false));
				return d;
			// abort认为还在加载中
			} else if (abort) {
				return null;
			}
			return Promise.reject(new Error(message));
		})
		.then(data => commit(mutationTypes.FETCH_RECOMMEND_EVENTS, data))
		.catch(err => {
			commit(mutationTypes.RECOMMEND_LOADING, -1);
			return Promise.reject(err);
		});
	},
	// 获取直播比赛列表
	fetchLive ({ commit, state, dispatch }, sportId) {
		dispatch('unsubLive');
		commit(mutationTypes.LIVE_LOADING, true);
		// 异常处理统一由入口home处理
		return fetch('/factsCenter/wapIndexLiveEvents', { body: {
			sportId
		}}, '@homeLiveLoading')
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const productStatus = getProductStatus(data.message, 'live');
				commit(mutationTypes.UPDATE_LIVE_PRODUCT_STATUS, productStatus);
				const d = data.data || [];
				Vue.nextTick(commit(mutationTypes.LIVE_LOADING, false));
				return d;
			} else if (data.abort) {
				return null;
			}
			return Promise.reject(new Error(data.message));
		})
		.then(data => commit(mutationTypes.FETCH_LIVE_LIST, { data, id: sportId }))
		.then(() => {
			dispatch('subLive');
		})
		.catch(err => {
			commit(mutationTypes.LIVE_LOADING, -1);
			return Promise.reject(err);
		});
	},
	// 获取 Today sports 比赛列表, 当前接口默认获取football赛事
	async fetchTodaySports ({ commit, state, dispatch }) {
		const param = {};
		const userId = cookie('userId');
		if (userId) {
			param.userId = userId;
		}
		commit(mutationTypes.TODAY_SPORTS_LOADING, true);

		try {
			const res = await fetch('/factsCenter/wapNewHighlightEvents', {
				body: param
			}).then(response => response.json());
			const { bizCode, data, message, abort } = res;
			if (bizCode === 10000) {
				const productStatus = getProductStatus(message, 'preMatch');
				commit(mutationTypes.UPDATE_SPORT_PRODUCT_STATUS, productStatus);

				commit(mutationTypes.TODAY_SPORTS_LOADING, false);
				commit(mutationTypes.FETCH_TODAY_SPORTS_LIST, data || []);
				return res;
			// abort认为还在加载中
			} else if (abort) {
				return Promise.reject(new Error(message));
			}
		} catch (err) {
			commit(mutationTypes.TODAY_SPORTS_LOADING, -1);
			return Promise.reject(err);
		}
	},
	// 获取 top leagues 列表
	fetchTopLeagues ({ commit, state, dispatch }) {
		commit(mutationTypes.TOP_LEAGUES_LOADING, true);
		// 异常处理统一由入口home处理
		return fetch('/factsCenter/topLeaguesEvents')
		.then(res => res.json())
		.then(res => {
			const { bizCode, data, message, abort } = res;
			if (bizCode === 10000) {
				const productStatus = getProductStatus(message, 'preMatch');
				commit(mutationTypes.UPDATE_SPORT_PRODUCT_STATUS, productStatus);

				const d = data || [];
				Vue.nextTick(() => commit(mutationTypes.TOP_LEAGUES_LOADING, false));
				return d;
			// abort认为还在加载中
			} else if (abort) {
				return null;
			}
			return Promise.reject(new Error(message));
		})
		.then(data => commit(mutationTypes.FETCH_TOP_LEAGUES, { data }))
		.catch(err => {
			commit(mutationTypes.TOP_LEAGUES_LOADING, -1);
			return Promise.reject(err);
		});
	},
	// 更新某个联赛下的数据
	async fetchLeagueEvents ({ commit, state, dispatch }, params) {
		const fetchSportUrl = {
			234: '/factsCenter/wapChosenEvents',
			233: '/factsCenter/wapChosenEvents',
			254: '/factsCenter/wapEvents'
		};

		// wapEvents接口外围需要是数组
		const p = JSON.stringify(countryCode === '254' ? [params] : params);
		try {
			const res = await fetch(fetchSportUrl[countryCode], {
				body: p,
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				method: 'POST'
			})
			.then(response => response.json());

			const { data = [], bizCode, message } = res;

			if (bizCode === 10000) {
				// 由于是单个 league 列表请求，是否product down了在父级列表上就有显示，此处不单独处理
				// const productStatus = getProductStatus(data.message, 'preMatch');
				// commit(mutationTypes.xxx, productStatus);
				return data;
			}
			return Promise.reject(new Error(message));
		} catch (err) {
			return Promise.reject(err);
		}
	},
	// 获取大数据推荐比赛（定制比赛）列表
	async fetchCustomEvents({ commit }) {
		const userId = cookie('userId');
		const params = userId ? `?userId=${userId}` : '';
		commit(mutationTypes.UPDATE_CUSTOM_EVENTS_LOADING, true);
		try {
			const res = await fetch(`/factsCenter/customEvents${params}`)
				.then(response => response.json());

			const { bizCode, data, message } = res;
			if (bizCode === 10000) {
				if (message) {
					const productStatus = getProductStatus(message, 'preMatch');
					commit(mutationTypes.UPDATE_SPORT_PRODUCT_STATUS, productStatus);
				}
				commit(mutationTypes.FETCH_CUSTOM_EVENTS, data || []);
				commit(mutationTypes.UPDATE_CUSTOM_EVENTS_LOADING, false);
			} else {
				commit(mutationTypes.UPDATE_CUSTOM_EVENTS_LOADING, -1);
			}
		} catch (err) {
			console.log(err); // eslint-disable-line
			commit(mutationTypes.UPDATE_CUSTOM_EVENTS_LOADING, -1);
		}
	},

	// 获取 highlight 下 Top Team 比赛和热门联赛
	async fetchMixHighlightEvents({ commit }) {
		commit(mutationTypes.UPDATE_MIX_HIGHLIGHT_LOADING, true);
		try {
			const res = await fetch('/factsCenter/wapMixHighlightEvents')
				.then(response => response.json());

			const { bizCode, data, message } = res;
			if (bizCode === 10000) {
				if (message) {
					const productStatus = getProductStatus(message, 'preMatch');
					commit(mutationTypes.UPDATE_SPORT_PRODUCT_STATUS, productStatus);
				}
				commit(mutationTypes.FETCH_MIX_HIGHLIGHT_EVENTS, data || []);
				commit(mutationTypes.UPDATE_MIX_HIGHLIGHT_LOADING, false);
			} else {
				commit(mutationTypes.UPDATE_MIX_HIGHLIGHT_LOADING, -1);
			}
		} catch (err) {
			console.log(err); // eslint-disable-line
			commit(mutationTypes.UPDATE_MIX_HIGHLIGHT_LOADING, -1);
		}
	},

	subRecommendEvents ({ commit, state, getters }) {
		if (!state.recommendEvents || !state.recommendEvents.events) {
			return;
		}

		const cb = (data, type) => {
			const result = JSON.parse(data);
			if (type === 1) {
				commit(mutationTypes.UPDATE_RECOMMEND_EVENT, result);
			} else if (type === 2) {
				commit(mutationTypes.UPDATE_RECOMMEND_MARKET, result);
			} else {
				commit(mutationTypes.UPDATE_RECOMMEND_ODDS, result);
			}
		};

		const { events } = state.recommendEvents;
		if (events) {
			for (const key in events) { // eslint-disable-line
				const event = events[key];
				// 订阅事件 1表示event 2表示market status 3表示market odds
				[1, 2, 3].forEach(x => {
					pushTopic({
						sportId: event.sportId,
						categoryId: event.categoryId,
						tournamentId: event.tournamentId,
						eventId: event.eventId,
						marketIds: ['1']
					}, x, data => cb(data, x));
				});
			}
		}
	},
	unsubRecommendEvents ({ commit, state }) {
		if (!state.recommendEvents || !state.recommendEvents.events) {
			return;
		}
		const { events } = state.recommendEvents;
		if (events) {
			for (const key in events) { // eslint-disable-line
				const event = events[key];
				// 订阅事件 1表示event 2表示market status 3表示market odds
				[1, 2, 3].forEach(x => {
					pushTopic({
						sportId: event.sportId,
						categoryId: event.categoryId,
						tournamentId: event.tournamentId,
						eventId: event.eventId,
						marketIds: ['1']
					}, x, undefined, false);
				});
			}
		}
	},
	subLive ({ commit, state }) {
		if (!state.live || !state.live.events) {
			return;
		}
		const events = state.live.events;
		if (events) {
			for (const key in events) { // eslint-disable-line
				const event = events[key];
				// 订阅事件 1表示event 2表示market status 3表示market odds
				liveMt.forEach((current, index) => {
					pushTopic({
						sportId: event.sportId,
						productId: 1,
						categoryId: event.categoryId,
						tournamentId: event.tournamentId,
						eventId: event.eventId,
						marketIds: [state.liveMarketIds[event.sportId]],
					}, index + 1, data => current(commit, data));
				});
			}
		}
	},
	unsubLive ({ commit, state }) {
		if (!state.live || !state.live.events) {
			return;
		}
		const events = state.live.events;
		if (events) {
			for (const key in events) { // eslint-disable-line
				const event = events[key];
				// 订阅事件 1表示event 2表示market status 3表示market odds
				liveMt.forEach((current, index) => {
					pushTopic({
						sportId: event.sportId,
						productId: 1,
						categoryId: event.categoryId,
						tournamentId: event.tournamentId,
						eventId: event.eventId,
						marketIds: [state.liveMarketIds[event.sportId]],
					}, index + 1, undefined, false);
				});
			}
		}
	},
	subProductStatus({ commit, state }) {
		detailPush.sub({
			topic: 'product^1^status',
			pushType: 'GROUP',
			listener: data => {
				if (typeof data === 'string') {
					data = JSON.parse(data); // eslint-disable-line
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(mutationTypes.UPDATE_LIVE_PRODUCT_STATUS, code);
						}
					}
				}
			}
		});
		detailPush.sub({
			topic: 'product^3^status',
			pushType: 'GROUP',
			listener: data => {
				if (typeof data === 'string') {
					data = JSON.parse(data); // eslint-disable-line
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(mutationTypes.UPDATE_SPORT_PRODUCT_STATUS, code);
						}
					}
				}
			}
		});
	},
	unSubProductStatus ({ commit, state }) {
		detailPush.unsub({
			topic: 'product^1^status',
			pushType: 'GROUP'
		});
		detailPush.unsub({
			topic: 'product^3^status',
			pushType: 'GROUP'
		});
	},
};
