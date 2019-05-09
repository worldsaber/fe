import cookie from 'storage/cookie';
import md5 from 'blueimp-md5';
import * as mutationTypes from './mutationTypes';
import '../../../mockData/me/index?debug';

export default {
	// 获取banlace和红包数量信息，暂时后台不提供一个接口获取个人中心siderbar左侧信息，需要调用多个接口
	fetchAcountInfo ({ commit }) {
		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/wallet/assetsInfo')
			.then(res => res.json())
			.then(data => {
				// 未登录
				if (data.login === false || data.bizCode === 401) {
					commit(mutationTypes.UPDATE_LOGIN_STATUS, { isLogin: false });
					resolve(data);
				} else {
					const code = data.bizCode;
					if (code === 10000) {
						commit(mutationTypes.UPDATE_ASSET_INFO, data.data || {});
						commit(mutationTypes.UPDATE_LOGIN_STATUS, { isLogin: true });
						resolve(data);
					} else {
						reject(false);
					}
				}
			}).catch(() => {
				reject(false);
			});
		});
	},
	// 获取账户基本信息 包含电话号码，firstName， lastName，birthday，gender， email
	fetchAccountBaseInfo ({ commit }) {
		return new Promise((resolve, reject) => {
			fetch('/patron/account/info')
						.then(res => res.json())
						.then(data => {
								// 未登录
							if (data.login === false || data.bizCode === 401) {
								commit(mutationTypes.UPDATE_LOGIN_STATUS, { isLogin: false });
								resolve(data);
							} else {
								const code = data.bizCode;
								if (code === 10000) {
									commit(mutationTypes.UPDATE_BASE_ACCOUNT_INFO, data.data || {});
									commit(mutationTypes.UPDATE_LOGIN_STATUS, { isLogin: true });
									resolve(data);
								} else {
									reject(false);
								}
							}
						}).catch(() => {
							reject(false);
						});
		});
	},
	updateNickname ({ commit }, nickname) {
		return new Promise((resolve, reject) => {
			fetch('/patron/account/info/nickname', {
				method: 'PUT',
				body: {
					value: nickname
				}
			}).then(res => res.json()).then(data => {
				const code = data.bizCode;
				if (code === 10000) {
					commit(mutationTypes.UPDATE_BASE_ACCOUNT_INFO, {
						nickname
					});
					resolve({
						msg: 'Nickname saved',
						code
					});
				} else if (code === 11011) {
					resolve({
						msg: 'Nickname was taken, please try another one.',
						code
					});
				} else {
					reject('Failed to save nickname, please try again.');
				}
			}).catch(() => {
				reject('Failed to save nickname, please try again.');
			});
		});
	},
	quanziLogin({ commit, state }) {
		const params = {
			productId: window.country.toUpperCase(),
			accountId: cookie('phone'),
			userToken: cookie('accessToken'),
			avatarUrl: state.avatar,
			nickName: state.nickname
		};
		let sortedStr = '';
		Object.keys(params).sort((a, b) => a > b).forEach(key => {
			sortedStr += `${key}=${encodeURIComponent(params[key])}&`;
		});
		sortedStr = sortedStr.substr(0, sortedStr.length - 1);
		sortedStr += 'JFnEj6EwoFhO3zwkyjMim4TwWeotUfI0o4KOuHiuzpnWRbq';
		return fetch('#/quanzi/user/login', {
			method: 'POST',
			body: {
				productId: window.country.toUpperCase(),
				sign: md5(sortedStr),
				accountId: cookie('phone'),
				userToken: cookie('accessToken'),
				avatarUrl: state.avatar,
				nickName: state.nickname
			}
		});
	}
};
