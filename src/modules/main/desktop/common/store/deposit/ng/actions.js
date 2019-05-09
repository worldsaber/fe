import { isEmptyObject, formatNumber } from 'utils';
import dialog from 'components/dialog';

import { getShowCurrency } from 'config/currencyConfig';

import * as mutationTypes from './mutationTypes';
import { despositMax } from './config';
import {
	getPayChannel,
	getVerityType,
	getVerifyCode,
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
		delete params.way;
		if (isEmptyObject(params)) {
			return;
		}

		const { bankAssetId = '', payAmount } = params;
		params = Object.assign(params, {
			currency: state.currency,
			payChId: getPayChannel(state.depositType, !bankAssetId),
			payAmount: +params.payAmount * 10000
		});

		window.__debug__ && console.log(params);

		commit(mutationTypes.UPDATEDEPOSITAMOUNT, payAmount);
		commit(mutationTypes.SAVEOPERATEASSETID, bankAssetId);
		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		commit(mutationTypes.UPDATEDEPOSITRESULT, false);
		commit(mutationTypes.UPDATEVERIFYTYPE, '');

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
					dialog();
					window.login({ activeTab: 'Log In' });
					reject();
					return;
				}

				const code = ret.bizCode,
					originData = ret.data || {};

				originData.tradeId && commit(mutationTypes.UPDATEDEPOSITTRADEID, originData);

				switch (code) {
				case 10000: {
					const status = originData.status;

					if (status === 20 || status === 71) {
						commit(mutationTypes.UPDATEDEPOSITRESULT, true);
					} else {
						const verityType = getVerityType(status);
						if (verityType) {
							commit(mutationTypes.UPDATEVERIFYTYPE, verityType);
						} else {
							commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
						}

						if (originData.displayMsg) {
							commit(mutationTypes.UPDATE_DISPLAY_MSG, originData.displayMsg);
						}
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
						msg: ret.message || 'Sorry，something went wrong. Please try again later.',
						deleteRecord: code === 65001
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

	/*
	获取充值历史记录（卡列表和银行列表）
	action: 0-ALL，1-充值，2-提现
	type: 0-ALL，1-银行卡，2-银行账户
	 */
	getHistoryList({
		commit,
		state
	}, params) {
		const { type = 0, action = 1 } = params || {};

		commit(mutationTypes.UPDATELOADING, true);
		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/wallet/bankAssets', {
				method: 'GET',
				body: {
					type,
					action
				}
			})
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					dialog();
					window.login({ activeTab: 'Log In' });
					reject({
						hasLoad: false
					});
					return;
				}

				const { bizCode } = ret;
				const originData = ret.data || {};

				if (bizCode === 10000) {
					commit(mutationTypes.UPDATECARDHISTORYLIST, {
						type: 'init',
						list: originData.cards || []
					});
					commit(mutationTypes.UPDATEBANKHISROEYLIST, {
						type: 'init',
						list: originData.accounts || []
					});

					resolve({
						hasLoad: true
					});
				} else {
					reject({
						hasLoad: false
					});
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				reject({
					hasLoad: false
				});
			});
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
			fetch('/pocket/v1/wallet/supportBanks', {
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
					dialog();
					window.login({ activeTab: 'Log In' });
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
	delete
	 */
	deleteBank({
		commit
	}, params) {
		const { id, type } = params || {};
		if (!id) {
			return;
		}

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			fetch(`/pocket/v1/wallet/bankAssets/${id}`, {
				method: 'DELETE'
			})
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					dialog();
					window.login({ activeTab: 'Log In' });
					reject({
						delSuccess: false
					});
					return;
				}

				const { bizCode } = ret;

				if (bizCode === 10000) {
					if (type === 'card') {
						commit(mutationTypes.UPDATECARDHISTORYLIST, {
							type: 'delete',
							id
						});
					} else {
						commit(mutationTypes.UPDATEBANKHISROEYLIST, {
							type: 'delete',
							id
						});
					}
					resolve({
						delSuccess: true
					});
				} else {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: ret.message || 'Sorry，something went wrong. Please try again later.'
					});
					reject({
						delSuccess: false
					});
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: commonError
				});
				reject({
					delSuccess: false
				});
			});
		});
	},
	/*
	pocket/v1/bankTrades/bankTrade/{tradeId}/additional（post）
	参数：
	tradeId、pin、otp、reservedPhone、birthday（YYYYMMDD）、sms
	type（1-afbet sms, 2-afbet sms upstream, 3-pin, 4-otp, 5-reserved phone, 6-birthday，7-bank gateway）
	响应：
	tradeId、acceptTime、feeType、feeAmount、status、jumpUrl
	 */
	tradeAddtional({
		commit,
		state
	}, params) {
		const type = getVerifyCode(state.verifyType);
		if (!state.tradeId || !type) {
			return;
		}

		const lockKey = params.lockKey || '';
		delete params.lockKey;

		params = Object.assign(params || {}, {
			tradeId: state.tradeId,
			type
		});

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch(`pocket/v1/bankTrades/bankTrade/${state.tradeId}/additional`, {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			}, lockKey)
			.then(res => {
				commit(mutationTypes.UPDATELOADING, false);
				return res.json();
			})
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					dialog();
					window.login({ activeTab: 'Log In' });

					// 验证过程登录状态失效，回到初态
					commit(mutationTypes.UPDATEVERIFYTYPE, '');
					return;
				}

				const code = ret.bizCode,
					originData = ret.data || {};

				switch (code) {
				case 10000: {
					const status = originData.status;
					if (status === 20 || status === 71) {
						commit(mutationTypes.UPDATEDEPOSITRESULT, true);
						commit(mutationTypes.UPDATEVERIFYTYPE, '');
					} else {
						const verityType = getVerityType(status);

						// 拦截 holding 状态，以免重置
						if (verityType === state.verifyType && status === 11) {
							return resolve();
						}
						if (verityType) {
							commit(mutationTypes.UPDATEVERIFYTYPE, verityType);
						} else {
							commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
						}

						if (originData.displayMsg) {
							commit(mutationTypes.UPDATE_DISPLAY_MSG, originData.displayMsg);
						}
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
						msg: ret.message || 'Sorry，something went wrong. Please try again later.',
						deleteRecord: code === 65001
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
	}
};
