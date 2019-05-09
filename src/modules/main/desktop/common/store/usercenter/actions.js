import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

import * as mutationTypes from './mutationTypes';
import '../../../mockData/usercenter/index?debug';

export default {
	// 获取banlace和红包数量信息，暂时后台不提供一个接口获取个人中心siderbar左侧信息，需要调用多个接口
	fetchAcountInfo ({ commit }) {
		fetch('/pocket/v1/wallet/assetsInfo')
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode;
				if (code === 10000) {
					commit(mutationTypes.UPDATE_ASSET_INFO, data.data || {});
				}
			});
	},
	// 获取账户基本信息 包含电话号码，firstName， lastName，birthday，gender， email
	fetchAccountBaseInfo ({ commit }) {
		fetch('/patron/account/info')
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode;
				if (code === 10000) {
					commit(mutationTypes.UPDATE_BASE_ACCOUNT_INFO, data.data || {});
				}
			});
	},
	// 获取账户balance
	getBalance ({ commit }) {
		fetch('/pocket/v1/finAccs/finAcc/userBal/' + window.currency)
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode;
				const originData = data.data || {};
				if (code === 10000) {
					originData.balance = originData.avlBal || 0;
					commit(mutationTypes.UPDATE_ASSET_INFO, originData);

					// SYNC_ACCOUNT_BALANCE
					EventBus.$emit(commonEvent.SYNC_ACCOUNT_BALANCE, {
						balance: +originData.balance / 10000,
						coins: +originData.avlCoins / 10000,
						updateLet: 'pageHeader'
					});
				}
			});
	}
};
