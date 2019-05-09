import * as mutationTypes from './mutationTypes.js';

export default {
	async getStakeLimit({ commit }) {
		try {
			const res = await fetch('/highfreq/roulette/markets')
				.then(response => response.json());

			const { bizCode, data } = res;

			if (bizCode === 10000 && data) {
				// gameType游戏类型，0为轮盘赌
				const list = data.filter(x => x.gameType === 0);

				commit(mutationTypes.UPDATE_GUIDES_DESC, list);
				commit(mutationTypes.UPDATE_STAKE_LIMIT, list);
			}
		} catch (err) {
			console.log(err); // eslint-disable-line
		}
	},
	getChips({ commit }) {
		return fetch('/highfreq/roulette/tokens').then(res => res.json()).then(res => {
			const { bizCode, data } = res;
			if (bizCode === 10000 && data) {
				commit(mutationTypes.UPDATE_CHIPS, data);
			}
		}).catch(e => {
			console.log(e);
		});
	}
};
