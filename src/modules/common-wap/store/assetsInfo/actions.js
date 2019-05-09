import * as mutationTypes from './mutationTypes';
import '../../../mockData/me/index?debug';

export default {
	// 获取banlace和红包数量信息，暂时后台不提供一个接口获取个人中心siderbar左侧信息，需要调用多个接口
	fetchAcountInfo ({ commit }) {
		commit(mutationTypes.UPDATE_IS_LOADING, true);
		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/wallet/assetsInfo')
			.then(res => res.json())
			.then(data => {
				// 未登录
				if (data.login === false || data.bizCode === 401) {
					commit(mutationTypes.UPDATE_LOGIN_STATUS, { isLogin: false });
					commit(mutationTypes.UPDATE_ASSET_INFO, {});
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
				commit(mutationTypes.UPDATE_IS_LOADING, false);
			}).catch(() => {
				commit(mutationTypes.UPDATE_LOGIN_STATUS, { isLogin: false });
				commit(mutationTypes.UPDATE_ASSET_INFO, {});
				reject(false);
				commit(mutationTypes.UPDATE_IS_LOADING, false);
			});
		});
	}
};
