import * as mutationTypes from './mutationTypes';

export default {
	// update balance giftnum
	[mutationTypes.UPDATE_ASSET_INFO](state, data = {}) {
		state.balance = data.balance / 10000 || 0;
		state.giftNum = data.validGiftNum || 0;
		state.giftAmount = data.validGiftAmount / 10000 || 0;
	},
	// update phone firstName， lastName，birthday，gender， email
	[mutationTypes.UPDATE_BASE_ACCOUNT_INFO](state, data = {}) {
		['phone', 'firstName', 'lastName', 'gender', 'birthday', 'email', 'nickname', 'avatar'].forEach(value => {
			if (data[value]) {
				state[value] = data[value];
			}
		});
	},
	// 更新登录状态
	[mutationTypes.UPDATE_LOGIN_STATUS](state, data = {}) {
		state.isLogin = !!data.isLogin;
	},
};
