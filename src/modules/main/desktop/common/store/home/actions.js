import { pushTopic } from 'components/eventList/util';
import detailPush from 'push/betPush';
import {
	UPDATE_SPORT_EVENT,
	UPDATE_SPORT_OUTCOME,
	UPDATE_SPORT_MARKET,
	UPDATE_LIVE_EVENT,
	UPDATE_LIVE_OUTCOME,
	UPDATE_LIVE_MARKET,
	// UPDATE_HOME_PC,
	UPDATE_IMPORTANT_MATCH,
	UPDATE_LIVE_MATCH,
	UPDATE_SPORT_PRODUCT_STATUS,
	UPDATE_LIVE_PRODUCT_STATUS,
	UPDATE_PROMOTION_AD,
	UPDATE_ADS_LOADING
} from './mutationTypes';
import '../../../mockData/home/home?debug';

const mt = [
	/**
	 * sport 比赛event 监听
	 */
	function eventListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_SPORT_EVENT, data);
	},
	function marketListener (commit, data) {
		// console.log('market change', data);
		data = JSON.parse(data);
		commit(UPDATE_SPORT_MARKET, data);
	},
	/**
	 * sport比赛odds push监听
	 */
	function oddsListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_SPORT_OUTCOME, data);
	},
];
const liveMt = [
	/**
	 * live比赛event push监听
	 */
	function liveEventListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_LIVE_EVENT, data);
	},
	function liveMarketListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_LIVE_MARKET, data);
	},
	/**
	 * live比赛odds push监听
	 }*/
	function liveOddsEventListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_LIVE_OUTCOME, data);
	},
];
export default {

	// 1. 获取首页配置 (Popular 部分)
	// fetchHomePC({
	// 	commit,
	// 	state
	// }) {
	// 	return new Promise((resolve, reject) => {
	// 		fetch('/common/config/home/pc', {
	// 			method: 'GET'
	// 		})
	// 		.then(res => res.json())
	// 		.then(res => {
	// 			const code = res.bizCode || '';
	// 			if (code === 10000) {
	// 				commit(UPDATE_HOME_PC, res.data || {});
	// 				resolve(res.data || {});
	// 			} else {
	// 				reject(res.data);
	// 			}
	// 		})
	// 		.catch(err => reject(err));
	// 	});
	// },

	// 3. 获取 important match 列表
	fetchPcImportantEvents({
		commit,
		state,
		dispatch
	}, params) {
		dispatch('unsub');
		return new Promise((resolve, reject) => {
			// 先重置数据
			state.sport = {};
			fetch('/factsCenter/importantEvents', {
				method: 'GET',
				body: params
			}, '@fetchPcImportantEvents')
			.then(res => res.json())
			.then(res => {
				const code = res.bizCode || '';
				if (code === 10000) {
					if (res.message) {
						let productStatus = res.message.split('#');
						if (productStatus.length === 2) {
							productStatus = +productStatus[0];
							// 1表示不能投注 0表示可以投注
							if (productStatus === 1 || productStatus === 0) {
								commit(UPDATE_SPORT_PRODUCT_STATUS, productStatus);
							}
						}
					}
					commit(UPDATE_IMPORTANT_MATCH, res.data || []);
					resolve(res.data || []);
				} else {
					reject(res);
				}
			})
			.then(data => {
				dispatch('sub');
				return data;
			})
			.catch(err => reject(err));
		});
	},

	// 4. 获取 live 比赛或者五场 prematch
	fetchLiveOrPrematchEvents({
		commit,
		state,
		dispatch
	}, params) {
		dispatch('unsubLive');
		return new Promise((resolve, reject) => {
			fetch('/factsCenter/liveOrPrematchEvents', {
				method: 'GET',
				body: params
			}, '@fetchLiveOrPrematchEvents')
			.then(res => res.json())
			.then(res => {
				const code = res.bizCode || '';
				if (code === 10000) {
					if (res.message) {
						let productStatus = res.message.split('#');
						if (productStatus.length === 2) {
							productStatus = +productStatus[1];
							// 1表示不能投注 0表示可以投注
							if (productStatus === 1 || productStatus === 0) {
								commit(UPDATE_LIVE_PRODUCT_STATUS, productStatus);
							}
						}
					}
					commit(UPDATE_LIVE_MATCH, res.data || []);
					resolve(res.data || []);
				} else {
					reject(res);
				}
			})
			.then(data => {
				dispatch('subLive');
				return data;
			})
			.catch(err => reject(err));
		});
	},
	subProductStatus({ commit, state }) {
		detailPush.sub({
			topic: 'product^1^status',
			pushType: 'GROUP',
			listener: data => {
				if (typeof data === 'string') {
					data = JSON.parse(data);
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(UPDATE_LIVE_PRODUCT_STATUS, code);
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
					data = JSON.parse(data);
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(UPDATE_SPORT_PRODUCT_STATUS, code);
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
	sub ({ commit, state }) {
		if (!state.sport || !state.sport.map) {
			return;
		}
		const tournamentMap = state.sport.map;
		for (const tournamentId in tournamentMap) { // eslint-disable-line
			const tournament = tournamentMap[tournamentId] || {};
			const events = tournament.events;
			if (events) {
				for (const key in events) { // eslint-disable-line
					const event = events[key];
					// 订阅事件 1表示event 2表示market status 3表示market odds
					mt.forEach((current, index) => {
						pushTopic({
							sportId: event.sportId,
							productId: 3,
							categoryId: event.categoryId,
							tournamentId: event.tournamentId,
							eventId: event.eventId,
							marketIds: state.sportMarketIds[event.sportId]
						}, index + 1, data => current(commit, data));
					});
				}
			}
		}
	},
	unsub ({ commit, state }) {
		if (!state.sport || !state.sport.map) {
			return;
		}
		const tournamentMap = state.sport.map;
		for (const tournamentId in tournamentMap) { // eslint-disable-line
			const tournament = tournamentMap[tournamentId] || {};
			const events = tournament.events;
			if (events) {
				for (const key in events) { // eslint-disable-line
					const event = events[key];
					// 订阅事件 1表示event 2表示market status 3表示market odds
					mt.forEach((current, index) => {
						pushTopic({
							sportId: event.sportId,
							productId: 3,
							categoryId: event.categoryId,
							tournamentId: event.tournamentId,
							eventId: event.eventId,
							marketIds: state.sportMarketIds[event.sportId]
						}, index + 1, undefined, false);
					});
				}
			}
		}
	},
	subLive ({ commit, state }) {
		if (!state.live || !state.live.map) {
			return;
		}
		const tournamentMap = state.live.map;
		for (const tournamentId in tournamentMap) { // eslint-disable-line
			const tournament = tournamentMap[tournamentId] || {};
			const events = tournament.events;
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
							marketIds: state.liveMarketIds[event.sportId]
						}, index + 1, data => current(commit, data));
					});
				}
			}
		}
	},
	unsubLive ({ commit, state }) {
		if (!state.live || !state.live.map) {
			return;
		}
		const tournamentMap = state.live.map;
		for (const tournamentId in tournamentMap) { // eslint-disable-line
			const tournament = tournamentMap[tournamentId] || {};
			const events = tournament.events;
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
							marketIds: state.liveMarketIds[event.sportId]
						}, index + 1, undefined, false);
					});
				}
			}
		}
	},

	// home广告位
	getPromotionAd({
		commit,
		state
	}, isLogin) {
		commit(UPDATE_ADS_LOADING, true);

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			const adSpots = [];

			for (const adItem of state.adIds) {
				adSpots.push({
					spotId: adItem,
					preserve: ''
				});
			}

			// 登录或者登录状态改变时
			if (isLogin || window.loginStatus) {
				for (const item of state.loginAdIds) {
					adSpots.push({
						spotId: item,
						preserve: ''
					});
				}
			}

			// if (!isLogin) {
			// 	for (const adItem of state.adIds) {
			// 		adSpots.push({
			// 			spotId: adItem,
			// 			preserve: ''
			// 		});
			// 	}
			// }

			if (!adSpots.length) {
				return;
			}

			const params = {
				adSpots
			};

			fetch('/promotion/v1/sp/query', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			}).then(res => {
				setTimeout(() => {
					commit(UPDATE_ADS_LOADING, false);
				}, 200);
				return res.json();
			})
			.then(ret => {
				const code = ret && ret.bizCode;

				if (code === 10000) {
					commit(UPDATE_PROMOTION_AD, ret.data || {});
				}
			})
			.catch(err => { // eslint-disable-line
				setTimeout(() => {
					commit(UPDATE_ADS_LOADING, false);
				}, 200);
			});
		});
	},
};
