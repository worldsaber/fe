import * as mutationTypes from './mutationTypes';

const defaultIcon = require('images/bankIcon.png');

export default {
	// update card history list
	[mutationTypes.UPDATECARDHISTORYLIST](state, opt) {
		const { type } = opt;

		switch (type) {
		case 'init': {
			const tempList = opt.list || [];

			for (const item of tempList) {
				item.showCardName = item.cardBrand && item.cardBrand.toLowerCase() !== 'unknown' ? item.cardBrand : '';
				item.showExpire = `${item.cardExpDate.substr(2, 2)}/${item.cardExpDate.substr(0, 2)}`;
				item.bankIconUrl = item.bankIconUrl || defaultIcon;
			}
			state.cardHistoryList = [...tempList];
			break;
		}
		case 'delete': {
			const cardHistoryList = state.cardHistoryList || [];
			const id = opt.id || state.dpInfo.bankAssetId || '';

			for (let i = 0, len = cardHistoryList.length; i < len; i++) {
				if (cardHistoryList[i] && cardHistoryList[i].id === id) {
					state.cardHistoryList.splice(i, 1);
					break;
				}
			}
			break;
		}
		default:
		}
	},

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
			const id = opt.id || state.dpInfo.bankAssetId || '';

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

		tempList = tempList.filter(item => [0, 1].includes(+item.supportAction) && item.isActive);

		state.bankList = [...tempList];
	},

	// update depositType
	[mutationTypes.UPDATEDEPOSITTYPE](state, type) {
		state.depositType = type || 'card';

		// 切换tab时，需要重置amount
		state.dpInfo.amount = '';
	},

	[mutationTypes.SAVEOPERATEASSETID](state, id) {
		state.dpInfo.bankAssetId = id;
	},

	// loading
	[mutationTypes.UPDATELOADING](state, loading) {
		state.reqLoading = loading;
	},

	[mutationTypes.BANKLOADERROR](state, isError) {
		state.bankLoadError = isError;
	},

	[mutationTypes.UPDATEDEPOSITAMOUNT](state, amount) {
		state.dpInfo.amount = amount;
	},

	[mutationTypes.UPDATEDEPOSITTRADEID](state, data) {
		const { tradeId = '', counterPart = '', counterAuthority = '', counterIconUrl = '' } = data;
		state.tradeId = tradeId;
		state.dpInfo = Object.assign(state.dpInfo, {
			counterPart: counterPart || '',
			counterAuthority: counterAuthority && counterAuthority.toLowerCase() !== 'unknown' ? counterAuthority : '',
			counterIconUrl: counterIconUrl || defaultIcon
		});
	},

	[mutationTypes.UPDATEERRORINFO](state, errorInfo) {
		state.errorInfo = errorInfo;
	},

	[mutationTypes.UPDATEDEPOSITRESULT](state, ret) {
		state.dpSuccess = ret;
	},

	[mutationTypes.UPDATEVERIFYTYPE](state, type) {
		state.verifyType = type || '';
	},

	[mutationTypes.UPDATE_DISPLAY_MSG](state, msg) {
		state.displayMsg = msg;
	}
};
