import * as mutationTypes from './mutationTypes';

export default {
	// update balance giftnum
	[mutationTypes.UPDATE_ASSET_INFO](state, data = {}) {
		state.balance = data.balance / 10000 || 0;
		state.auditStatus = data.auditStatus || '';
		if (data.validGiftNum && data.validGiftAmount) {
			state.giftNum = data.validGiftNum;
			state.giftAmount = data.validGiftAmount / 10000;
		}

		if (data.avlCoins) {
			state.coins = data.avlCoins / 10000;
		}
	},
	[mutationTypes.UPDATE_BALANCE](state, balanceOpt) {
		const { balance, updateLet, coins } = balanceOpt;
		if (updateLet === 'userInfo') {
			state.balance = balance;
			state.coins = coins;
		}
	},
	// update phone firstName， lastName，birthday，gender， email
	[mutationTypes.UPDATE_BASE_ACCOUNT_INFO](state, data = {}) {
		['phone', 'firstName', 'lastName', 'gender', 'birthday', 'email'].forEach(value => {
			if (data[value]) {
				state[value] = data[value];
			}
		});
	},
	// update currentTab
	[mutationTypes.UPDATE_CURRENT_TAB](state, tabStr) {
		if (tabStr) {
			state.currentTab = tabStr;
		}
	}
};
