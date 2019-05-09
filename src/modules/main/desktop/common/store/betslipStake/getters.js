import { isEmptyObject } from 'utils';
import { getStakeInfo } from './commonFun';

export default {
	/*
	获取的system play all时的历史输入值
	 */
	uStake: (state, getters) => state.systemStake.union,

	/*
	根据当前选中的投注类型，获取填入的历史stake值
	 */
	getStake: (state, getters, rootState) => {
		const ret = [];

		switch (rootState.betslip.currentType) {
		case 'signle': {
			ret.push(state.singleStake);
			break;
		}
		case 'multiple': {
			ret.push(state.multipleStake);
			break;
		}
		case 'system': {
			const stakeKeys = Object.keys(state.systemStake);
			for (const key of stakeKeys) {
				if (key !== 'union') {
					ret.push(state.systemStake[key]);
				}
			}
			break;
		}
		default:
		}

		return ret;
	},
	/*
	[ {name, count, odds} ]
	 */
	selectionInfo: (state, getters, rootState, rootGetters) => getStakeInfo(rootState.betslip, rootState.bonus, rootGetters['bonus/currentBonusConf'] || {}, state, rootGetters['betslip/isFlexi'], rootGetters['betslip/flexiThreshold']),

	/*
	[ {name, count, odds, stake} ]
	 */
	stakeUnion: (state, getters, rootState) => {
		const betslip = rootState && rootState.betslip || {};
		if (isEmptyObject(betslip)) {
			return [];
		}

		const selections = getters.selectionInfo || [],
			currentType = betslip.currentType;

		// single下，如果存在suspend和unavailable的情况时，没有选项列表，直接返回空数组
		if (!selections.length) {
			return [];
		}

		switch (currentType) {
		case 'single':
			selections[0].stake = state.singleStake || '';
			break;
		case 'multiple':
			selections[0].stake = state.multipleStake || '';
			break;
		case 'system':
			{
				const systemStake = state.systemStake;
				for (const selectItem of selections) {
					selectItem.stake = systemStake[selectItem.name] || '';
				}
			}
		default:
		}

		return selections;
	}
};
