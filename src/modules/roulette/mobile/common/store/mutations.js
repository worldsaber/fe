import { showCurrencyOrigin as showCurrency } from 'config/currencyConfig';
import { formatNumber } from 'utils';
import * as types from './mutationTypes.js';

export default {
	// 更新play guides
	[types.UPDATE_GUIDES_DESC](state, list = []) {
		// id对应后台返回值的id
		const descs = [{
			id: '1',
			title: 'Red/Black',
			desc: 'A bet that the winning number will be either red or black.',
			label: 'Odds: 2',
			limit: 'Limit per Option:'
		}, {
			id: '2',
			title: 'Low/High',
			desc: 'A bet that the winning number will be either a low (1-6) or high (7-12).',
			label: 'Odds: 2',
			limit: 'Limit per Option:'
		}, {
			id: '3',
			title: 'Odd/Even',
			desc: 'A bet on even or odd numbers',
			label: 'Odds: 2',
			limit: 'Limit per Option:'
		}, {
			id: '4',
			title: 'Column',
			desc: 'Choose one of the three columns',
			label: 'Odds: 3',
			limit: 'Limit per Option:'
		}, {
			id: '5',
			title: 'Straight',
			desc: 'Any single number including 0',
			label: 'Odds: 12',
			limit: 'Limit per Option:'
		}];

		if (list) {
			state.guidesList = descs.map(x => {
				const t = list.find(m => m.id === x.id) || {};
				const min = formatNumber(t.minBetStake / 10000, 2);
				const max = formatNumber(t.maxBetStake / 10000, 2);
				return {
					title: t.name || x.title,
					desc: t.description || x.desc,
					label: x.label,
					limit: `${x.limit} ${showCurrency} ${min} - ${max}`
				};
			});
		}
	},
	[types.UPDATE_STAKE_LIMIT](state, list = []) {
		const limitMap = {};
		state.stakeLimit = list.forEach(x => {
			limitMap[x.id] = {
				name: x.name,
				max: x.maxBetStake
			};
		});
		state.stakeLimit = limitMap;
	},
	[types.UPDATE_CHIPS](state, chips = []) {
		state.chips = chips;
	}
};
