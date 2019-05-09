import { pushTopic } from 'components/eventList/util';
import detailPush from 'push/betPush';
import { FETCH_SPORTS_LIST, UPDATE_EVENT, UPDATE_OUTCOME, UPDATE_MARKET, UPDATE_PRODUCT_STATUS } from './mutationTypes';
import '../../../../mockData/home/home?debug';

const mt = [
	function eventListener (commit, data) {
		window.__debug__ && console.log('event', new Date(), data);
		data = JSON.parse(data);
		commit(UPDATE_EVENT, data);
	},
	function marketListener (commit, data) {
		window.__debug__ && console.info('market', new Date(), data);
		data = JSON.parse(data);
		commit(UPDATE_MARKET, data);
	},
	function oddsListener (commit, data) {
		window.__debug__ && console.info('odds', new Date(), data);
		data = JSON.parse(data);
		commit(UPDATE_OUTCOME, data);
	}
];

export default {
	// 获取比赛列表
	fetchSports ({ commit, state, dispatch }, sportId) {
		// 异常处理统一由入口home处理
		return fetch('/factsCenter/liveOrPrematchEvents', { body: {
			sportId
		}})
		.then(res => res.json())
		.then(data => {
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
				return d;
			}
			return Promise.reject(data.message);
		})
		.then(data => commit(FETCH_SPORTS_LIST, data))
		.then(() => dispatch('sub', sportId));
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
	},
	unSubProductStatus ({ commit, state }) {
		detailPush.unsub({
			topic: 'product^1^status',
			pushType: 'GROUP'
		});
	},
};
