import * as mutationTypes from './mutationTypes';

export default {
	// update balance giftnum
	[mutationTypes.UPDATE_ASSET_INFO](state, data = {}) {
		state.balance = data.balance / 10000 || 0;
		state.coin = data.coins / 10000 || 0;
		state.giftNum = data.validGiftNum || 0;
		state.giftAmount = data.validGiftAmount / 10000 || 0;
		state.auditStatus = data.auditStatus || '';
	},
	// 更新登录状态
	[mutationTypes.UPDATE_LOGIN_STATUS](state, data = {}) {
		state.isLogin = !!data.isLogin;
	},
	// 更新登录状态
	[mutationTypes.UPDATE_IS_LOADING](state, data) {
		state.isLoading = !!data;
	},
};
