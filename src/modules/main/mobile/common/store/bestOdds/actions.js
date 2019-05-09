import { pushTopic } from 'components/eventUtil/util';
import detailPush from 'push/betPush';
import * as mutationTypes from './mutationTypes.js';
import marketItems from '../../../bestOdds/config/marketItems.js';

// 默认football
const marketIds = marketItems['sr:sport:1'].map(x => x.id);

export default {
	async getBestOddsList({ commit }, { tournamentId }) {
		const params = {
			marketId: marketIds.join(',')
		};

		if (tournamentId) {
			params.tournamentId = tournamentId;
		}

		try {
			const res = await fetch('factsCenter/wapBestOddsEvents', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(params)
			}).then(response => response.json());

			const { bizCode, data, message, abort } = res;

			if (bizCode === 10000) {
				// 判断是否product down, 不区分live还是prematch product down了，都不显示。
				if (message) {
					const productStatus = message.split('#');
					if (productStatus.length === 2) {
						// 1表示不能投注 0表示可以投注
						if (+productStatus[0] > 0 || +productStatus[1] > 0) {
							commit(mutationTypes.UPDATE_PRODUCT_STATUS, 1);
						} else {
							commit(mutationTypes.UPDATE_PRODUCT_STATUS, 0);
						}
					}
				}
				commit(mutationTypes.FETCH_BEST_ODDS, data || {});
				return data;
			// abort认为还在加载中
			} else if (abort) {
				return null;
			}
			return Promise.reject(message);
		} catch (err) {
			console.log(err); // eslint-disable-line
			return Promise.reject(err);
		}
	},

	subBestOdds ({ commit, state }) {
		if (!state.bestOdds || !state.bestOdds.map) {
			return;
		}

		const cb = (data, type) => {
			const result = JSON.parse(data);
			if (type === 1) {
				commit(mutationTypes.UPDATE_EVENT, result);
			} else if (type === 2) {
				commit(mutationTypes.UPDATE_MARKET, result);
			} else {
				commit(mutationTypes.UPDATE_ODDS, result);
			}
		};

		Object.values(state.bestOdds.map).forEach(tournament => {
			const events = tournament.events;

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
							marketIds
						}, x, data => cb(data, x));
					});
				}
			}
		});
	},
	unsubBestOdds ({ commit, state }) {
		if (!state.bestOdds || !state.bestOdds.map) {
			return;
		}

		Object.values(state.bestOdds.map).forEach(tournament => {
			const events = tournament.events;

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
							marketIds
						}, x, undefined, false);
					});
				}
			}
		});
	},

	subProductStatus({ commit, state }) {
		detailPush.sub({
			topic: 'product^~^status',
			pushType: 'GROUP',
			listener: data => {
				if (typeof data === 'string') {
					data = JSON.parse(data); // eslint-disable-line
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(mutationTypes.UPDATE_PRODUCT_STATUS, code);
						}
					}
				}
			}
		});
	},
	unSubProductStatus ({ commit, state }) {
		detailPush.unsub({
			topic: 'product^~^status',
			pushType: 'GROUP'
		});
	},
};
