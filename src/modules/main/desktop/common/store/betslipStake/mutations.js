import { isEmptyObject, objType, formatNumber } from 'utils';

import * as mutationTypes from './mutationTypes';

export default {
	// update stake
	[mutationTypes.UPDATESTAKE](state, opt) {
		if (isEmptyObject(opt) || objType(opt.type) === 'undefined') {
			return;
		}

		switch (opt.type) {
		case 'single':
			state.singleStake = opt.stake;
			break;
		case 'multiple':
			state.multipleStake = opt.stake;
			break;
		case 'system':
			state.systemStake = { ...opt.stake };
			break;
		default:
		}
	},

	// update orderInfo
	[mutationTypes.UPDATEORDERINFO](state, orderInfo = null) {
		if (orderInfo && !isEmptyObject(orderInfo)) {
			orderInfo.totalStake && (orderInfo.showTotalStake = formatNumber(orderInfo.totalStake, 2));
			orderInfo.favorAmount && (orderInfo.showFavorAmount = formatNumber(-orderInfo.favorAmount, 2));
			orderInfo.potentialWinnings && (orderInfo.potentialWinnings = formatNumber(orderInfo.potentialWinnings, 2));
		}

		state.orderInfo = orderInfo;
	},

	// update errorInfo
	[mutationTypes.UPDATEERRORINFO](state, errorInfo = null) {
		state.errorInfo = errorInfo;
	},

	[mutationTypes.UPDATEBETLOADING](state, loading = false) {
		state.betLoading = loading;
	},

	[mutationTypes.RESETSTAKE](state) {
		state.singleStake = '';
		state.multipleStake = '';
		state.systemStake = {
			union: ''
		};
	}
};
