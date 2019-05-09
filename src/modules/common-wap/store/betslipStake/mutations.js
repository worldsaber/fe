import { isEmptyObject, objType, formatNumber } from 'utils';

import * as mutationTypes from './mutationTypes';

const sportsCfg = window.sportsCfg || {};

export default {
	// update stake
	[mutationTypes.UPDATE_STAKE](state, opt) {
		if (isEmptyObject(opt) || objType(opt.type) === 'undefined') {
			return;
		}

		switch (opt.type) {
		case 'single':
			state.singleStake = { ...state.singleStake, ...opt.stake };
			break;
		case 'multiple':
			state.multipleStake = opt.stake;
			break;
		case 'system':
			state.systemStake = { ...state.systemStake, ...opt.stake };
			break;
		default:
		}
	},
	// rest stake
	[mutationTypes.RESET_STAKE](state) {
		state.singleStake = {
			union: sportsCfg.min || '50'
		};
		state.multipleStake = sportsCfg.min || '50';
		state.systemStake = {
			union: sportsCfg.min || '50'
		};
	},
	// update orderInfo
	[mutationTypes.UPDATE_ORDER_INFO](state, orderInfo = null) {
		if (orderInfo && !isEmptyObject(orderInfo)) {
			orderInfo.totalStake && (orderInfo.showTotalStake = formatNumber(orderInfo.totalStake, 2));
			orderInfo.favorAmount && (orderInfo.showFavorAmount = formatNumber(-orderInfo.favorAmount, 2));
			orderInfo.potentialWinnings && (orderInfo.potentialWinnings = formatNumber(orderInfo.potentialWinnings, 2));
		}
		state.orderInfo = orderInfo;
	},

	[mutationTypes.UPDATE_BET_LOADING](state, loading = false) {
		state.betLoading = loading;
	},
	[mutationTypes.UPDATE_BONUS](state, data) {
		state.bonusRatios = data.bonusRatios.reduce((res, cur) => {
			res[cur.qualifyingSelections] = cur.ratio / 10000;
			return res;
		}, {});
		state.qualifyingOddsLimit = data.qualifyingOddsLimit / 10000;
	},
	[mutationTypes.UPDATE_ODDSKEY](state, key) {
		state.oddsKey = key;
	},
	[mutationTypes.UPDATE_FLEXIBET_STATUS](state, status) {
		state.flexibetStatus = status;
	}
};
