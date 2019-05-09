import * as mutationTypes from './mutationTypes';

const defaultIcon = require('images/bankIcon.png');

export default {
	// update bank history list
	[mutationTypes.UPDATEBANKHISROEYLIST](state, opt) {
		const { type } = opt;

		switch (type) {
		case 'init': {
			const tempList = opt.list || [];

			for (const item of tempList) {
				item.bankIconUrl = item.bankIconUrl || defaultIcon;
			}

			state.bankHistoryList = [...tempList];
			break;
		}
		case 'delete': {
			const bankHistoryList = state.bankHistoryList || [];
			const id = opt.id || state.wdInfo.bankAssetId || '';

			for (let i = 0, len = bankHistoryList.length; i < len; i++) {
				if (bankHistoryList[i] && bankHistoryList[i].id === id) {
					state.bankHistoryList.splice(i, 1);
					break;
				}
			}
			break;
		}
		default:
		}
	},

	// update bank list
	[mutationTypes.UPDATEBANKLIST](state, list) {
		let tempList = list || [];

		tempList = tempList.filter(item => [0, 2].includes(+item.supportAction) && item.isActive);

		state.bankList = [...tempList];
	},

	// loading
	[mutationTypes.UPDATELOADING](state, loading) {
		state.reqLoading = loading;
	},

	[mutationTypes.BANKLOADERROR](state, isError) {
		state.bankLoadError = isError;
	},

	[mutationTypes.UPDATEWITHDRAWINFO](state, wdBaseInfo) {
		const { bankAccount = '' } = wdBaseInfo || {};

		if (bankAccount) {
			delete wdBaseInfo.bankAccount;
		}

		state.wdInfo = wdBaseInfo;
		state.bankAccount = bankAccount;
	},

	[mutationTypes.UPDATEWITHDRAWTRADEID](state, data) {
		const { tradeId = '' } = data;
		state.tradeId = tradeId;
	},

	[mutationTypes.SUPPLEMENTWITHDRAWINFO](state, data) {
		state.wdInfo = Object.assign(state.wdInfo, {
			counterPart: data.counterPart || '',
			counterAuthority: data.counterAuthority || '',
			counterIconUrl: data.counterIconUrl || defaultIcon
		});
	},

	[mutationTypes.UPDATEERRORINFO](state, errorInfo) {
		state.errorInfo = errorInfo;
	},

	[mutationTypes.UPDATEWITHDRAWRESULT](state, ret) {
		state.wdSuccess = ret;
	},

	[mutationTypes.UPDATEAUDITSTATUS](state, ret) {
		state.needAudit = ret;
	},

	[mutationTypes.UPDATEVERIFYTYPE](state, type) {
		state.verifyType = type || '';
	},

	[mutationTypes.UPDATEBANKACCOUNT](state, account) {
		state.bankAccount = account;
	},

	[mutationTypes.SAVEVERIFYINFO](state, info) {
		state.verfiyInfo = info;
	}
};
