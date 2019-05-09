import { isEmptyObject } from 'utils';
import { calCoefficient } from './commonFun';

export default {
	hasData: (state, getters) => !!(state.totalCount || 0),

	pageCount: (state, getters) => Math.ceil(state.totalCount && state.totalCount / state.pageSize) || 1,

	getCashoutInfo: (state, getters) => {
		const ret = {},
			details = state.details || [],
			cashoutInfo = state.cashoutInfo || {},
			cfgInfo = state.cfgInfo || {};

		if (isEmptyObject(cfgInfo) || state.lockCal) {
			return ret;
		}

		for (let i = 0, len = details.length; i < len; i++) {
			const item = details[i];

			if (cashoutInfo.betId === item.id && !cashoutInfo.isUsed) {
				ret[item.id] = cashoutInfo;
				cashoutInfo.isUsed = true;
			} else if (!item.isCashable) {
				continue;
			} else {
				const coefficient = item.unavailableCount ? 0 : calCoefficient(item, cfgInfo);
				const stake = +item.stake || 0;

				ret[item.id] = {
					coefficient,
					maxCashOutAmount: coefficient === -1 ? 0 : (coefficient * stake).toFixed(2)
				};
			}
		}

		return ret;
	}
};
