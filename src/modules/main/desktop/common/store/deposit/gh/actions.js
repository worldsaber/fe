import { isEmptyObject, formatNumber } from 'utils';

import { getShowCurrency } from 'config/currencyConfig';

import * as mutationTypes from './mutationTypes';
import { despositMax } from './config';
import {
	getDpReqTips,
	commonError,
	defaultError
} from './commonFun';

export default {
	/*
	参数（均可自行覆盖）:
	currency,payAmount(*10000)
	card: cardNum、cardCvv、cardExpDate、payChId（20）
	bank: bankCode、bankAccNum、bankAssetId、payChId（21）
	phone: phoneNo、payChId（10）
	 */
	deposit({
		state,
		commit
	}, params) {
		if (isEmptyObject(params)) {
			return;
		}

		commit(mutationTypes.UPDATEDEPOSITINFO, params);

		const { payAmount, channel, phoneNo, token } = params;
		let payMoney = payAmount * 10000;
		payMoney = +payMoney;
		payMoney = payMoney.toFixed(0);

		params = {
			currency: state.currency,
			payChId: 40,
			channel,
			phoneNo,
			payAmount: +payMoney
		};

		token && (params.token = token);

		window.__debug__ && console.log(params);

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch('/pocket/v1/bankTrades/bankTrade/deposit', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			})
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				const code = ret.bizCode,
					originData = ret.data || {};

				originData.tradeId && commit(mutationTypes.UPDATEDEPOSITTRADEID, originData);

				switch (code) {
				case 10000: {
					const status = originData.status;

					if (status === 20) {
						commit(mutationTypes.UPDATEPAGEMODULE, 'success');
					} else if ([10, 72].includes(status)) {
						commit(mutationTypes.UPDATEERRORINFO, {
							type: 'confirm'
						});
					} else {
						commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
					}
					break;
				}
				case 62100:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: ret.message || `Maximum Daily Transaction Value is ${getShowCurrency()}${formatNumber(despositMax, 2)}. The maximum you can send in a day is ${getShowCurrency()}${formatNumber(despositMax, 2)}.`
					});
					break;
				// 验证过程中信息没对上
				case 11000:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						title: 'Error during transaction',
						msg: ret.message || defaultError
					});
					break;
				default:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						title: 'Error during transaction',
						msg: ret.message || 'Sorry，something went wrong. Please try again later.'
					});
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: commonError
				});
				reject();
			});
		});
	},

	getHistoryList({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/wallet/bankAssets', {
				method: 'GET',
				body: {
					type: 4,
					action: 1
				}
			})
			.then(res => res.json())
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				const { bizCode } = ret;
				const originData = ret.data || {};

				if (bizCode === 10000) {
					commit(mutationTypes.UPDATEBANKHISROEY, originData.mobileMoneys || []);
				}
			})
			.catch(() => {});
		});
	},

	/*
	bank list
	 */
	getBankList({
		commit,
		state
	}, needLogin) {
		commit(mutationTypes.UPDATELOADING, true);
		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/wallet/supportChannels', {
				method: 'GET',
				body: {
					action: 1
				}
			})
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				if (needLogin && ret.login === false) {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				const { bizCode } = ret;
				const originData = ret.data || {};

				if (bizCode === 10000) {
					const bankList = originData.entityList || [];
					commit(mutationTypes.UPDATEBANKLIST, bankList);
					commit(mutationTypes.BANKLOADERROR, !bankList.length);
				} else {
					commit(mutationTypes.BANKLOADERROR, true);
					reject();
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.BANKLOADERROR, true);
				reject();
			});
		});
	},

	/*
	pocket/v1/bankTrades/bankTrade/{tradeId}（post）
	参数：
	tradeId
	响应：
	tradeId、feeType、feeAmount、status
	 */
	queryInfo({
		commit,
		state
	}, params) {
		if (!state.tradeId) {
			return;
		}

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			fetch(`pocket/v1/bankTrades/bankTrade/${state.tradeId}`, {
				method: 'GET'
			})
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				const code = ret.bizCode,
					originData = ret.data || {};

				switch (code) {
				case 10000: {
					const status = originData.status;
					if (status === 20) {
						commit(mutationTypes.UPDATEPAGEMODULE, 'success');
					} else {
						commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
					}
					break;
				}
				case 62100:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: ret.message || `Maximum Daily Transaction Value is ${getShowCurrency()}${formatNumber(despositMax, 2)}. The maximum you can send in a day is ${getShowCurrency()}${formatNumber(despositMax, 2)}.`
					});
					break;
				// 验证过程中信息没对上
				case 11000:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						showIcon: true,
						title: 'Failed to Deposit',
						msg: ret.message || defaultError
					});
					break;
				default:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: ret.message || 'Sorry，something went wrong. Please try again later.'
					});
				}
				resolve();
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: commonError
				});
			});
		});
	},
	getSysNote({
		commit
	}) {
		commit(mutationTypes.UPDATESYSNOTEINFO, '');

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch('/common/config/query', {
				method: 'POST',
				headers: t,
				body: JSON.stringify([{
					appId: 'pocket',
					namespace: 'application',
					configKey: 'paych.notify.content'
				}])
			})
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				const { bizCode = 0, data = [] } = ret || [];

				if (bizCode === 10000) {
					commit(mutationTypes.UPDATESYSNOTEINFO, data[0] && data[0].configValue);
				}
			}).catch(() => {});
		});
	}
};
