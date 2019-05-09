import { pushTopic } from 'components/eventUtil/util';
import detailPush from 'push/betPush';
import { FETCH_SPORTS_LIST, UPDATE_EVENT, UPDATE_OUTCOME, UPDATE_MARKET, UPDATE_PRODUCT_STATUS, UPDATE_UPCOMING_EVENTS, UPDATE_SPORT_PRODUCT_STATUS } from './mutationTypes';
import '../../../../mockData/liveBetting?debug';

const mt = [
	function eventListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_EVENT, data);
	},
	function marketListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_MARKET, data);
	},
	function oddsListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_OUTCOME, data);
	}
];

export default {
	// 获取比赛列表
	async fetchSports ({ commit, state, dispatch }, sportId) {
		try {
			const res = await fetch('/factsCenter/liveOrPrematchEvents', { body: {
				sportId,
				marketId: state.marketIds[sportId].join()
			}}, '@liveListLoading');
			const data = await res.json();

			if (data.bizCode === 10000) {
				if (data.message) {
					let productStatus = data.message.split('#');
					if (productStatus.length === 2) {
						productStatus = +productStatus[1];
						// 1表示不能投注 0表示可以投注
						if (productStatus === 1 || productStatus === 0) {
							commit(UPDATE_PRODUCT_STATUS, productStatus);
						}
					}
				}
				const d = data.data || [];
				commit(FETCH_SPORTS_LIST, { data: d, sportId });
				dispatch('sub', sportId);
				return data;
			} else if (data.abort) {
				return null;
			}
			return Promise.reject(data.message);
		} catch (err) {
			return Promise.reject(err.message);
		}
	},
	sub ({ commit, state }, sportId) {
		// 订阅事件 1表示event 2表示market status 3表示market odds
		mt.forEach((current, index) => {
			pushTopic({
				sportId,
				marketIds: state.marketIds[sportId],
				productId: 1
			}, index + 1, data => current(commit, data));
		});
	},
	unsub ({ commit, state }, sportId) {
		if (!sportId) {
			return;
		}
		// 订阅事件 1表示event 2表示market status 3表示market odds
		mt.forEach((current, index) => {
			pushTopic({
				sportId,
				marketIds: state.marketIds[sportId],
				productId: 1
			}, index + 1, undefined, false);
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
							commit(UPDATE_PRODUCT_STATUS, code);
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
	getUpcomingEvents({
		commit,
		state
	}, sportId) {
		commit(UPDATE_UPCOMING_EVENTS, { data: [] });

		return fetch('/factsCenter/wapUpcomingEvents', { body: {
			sportId,
			marketId: state.upComingMarketIds[sportId]
		}}, '@liveUpcomingLoading')
		.then(res => res.json())
		.then(data => {
			const { bizCode, message, abort } = data;
			if (bizCode === 10000) {
				if (message) {
					let productStatus = message.split('#');
					if (productStatus.length === 2) {
						productStatus = +productStatus[0];
						// 1表示不能投注 0表示可以投注
						if (productStatus === 1 || productStatus === 0) {
							commit(UPDATE_SPORT_PRODUCT_STATUS, productStatus);
						}
					}
				}
				commit(UPDATE_UPCOMING_EVENTS, data);
			} else if (abort) {
				return null;
			}
		}).catch(() => {});
	}
};
