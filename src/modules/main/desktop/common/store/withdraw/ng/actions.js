import dialog from 'components/dialog';
import { formatNumber, isEmptyObject } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';

import * as mutationTypes from './mutationTypes';
import {
	getPayChannel,
	getVerityType,
	getVerifyCode,
	getDpReqTips,
	commonError,
	getErrorTips
} from './commonFun';

const showCurrency = getShowCurrency();

export default {
	/*
	参数：
	currency、 payAmount、
	payChId（1-BankAssets, 10-Mpesa，20-Paystack Card，21-Paystack Bank）
	phoneNo
	isConfirmAudit：是否确认审核（0-否，1-是）
	cardNum、cardCvv、cardExpDate
	bankCode、bankAccNum、bankAssetId
	响应：
	tradeId、acceptTime、feeAmount、feeType、status、jumpUrl
	ACC_BAL_NOT_ENOUGH(61100, "account balance not enough"),
	ACC_ALREADY_FROZEN(61300, "account already frozen"),
	OVER_BANK_DAILY_LIMIT(62100, "over bank daily limit"),
	OVER_AUDIT_LIMIT(62200, "over audit limit, need admin audit"),
	 */
	withdraw({
		state,
		commit
	}) {
		const wdInfo = state.wdInfo || {},
			payAmount = +wdInfo.payAmount || 0,
			isNew = wdInfo.isNew;
		let params;

		if (isNew) {
			params = {
				currency: state.currency,
				payChId: getPayChannel(state.depositType, true),
				payAmount: payAmount * 10000,
				bankCode: wdInfo.bankCode,
				bankAccNum: wdInfo.bankAccNum,
				isConfirmAudit: state.needAudit ? 1 : 0
			};
		} else {
			params = {
				currency: state.currency,
				payChId: getPayChannel(state.depositType),
				payAmount: payAmount * 10000,
				bankAssetId: wdInfo.bankAssetId,
				isConfirmAudit: state.needAudit ? 1 : 0
			};
		}

		window.__debug__ && console.log(params);

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		commit(mutationTypes.UPDATEWITHDRAWRESULT, false);
		commit(mutationTypes.UPDATEVERIFYTYPE, '');

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch('/pocket/v1/bankTrades/bankTrade/withdraw', {
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

				originData.tradeId && commit(mutationTypes.UPDATEWITHDRAWTRADEID, originData);

				switch (code) {
				case 10000: {
					const status = originData.status;
					if (status === 20 || status === 71) {
						commit(mutationTypes.UPDATEWITHDRAWRESULT, true);
					} else {
						const verityType = getVerityType(status);
						if (verityType) {
							commit(mutationTypes.UPDATEVERIFYTYPE, verityType);
						} else {
							commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
						}
					}
					break;
				}
				case 62200: {
					commit(mutationTypes.UPDATEAUDITSTATUS, true);

					const amount = originData.auditLimit,
						msg = originData.message;

					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'confirmAudit',
						msg: (!amount && msg) ?
							msg :
							`The amount exceeds ${showCurrency}${formatNumber(amount / 10000, 2)}, manual process would be applied. You can expect the result in 3 working days.`,
					});

					break;
				}
				default: {
					const errorMsg = getErrorTips(ret) || 'Sorry，something went wrong. Please try again later.';
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: errorMsg,
						deleteRecord: code === 65001
					});
				}
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, commonError);
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
		const { type = 0, action = 2 } = params || {};

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
					action: 2
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
		const { id } = params || {};
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
					commit(mutationTypes.UPDATEBANKHISROEYLIST, {
						type: 'delete',
						id
					});
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

		if (!isEmptyObject(params)) {
			commit(mutationTypes.SAVEVERIFYINFO, params);
		} else {
			params = state.verfiyInfo;
		}

		params = Object.assign(params || {}, {
			tradeId: state.tradeId,
			type
		});

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch(`/pocket/v1/bankTrades/bankTrade/${state.tradeId}/additional`, {
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

					// 验证过程登录状态失效，回到初态
					commit(mutationTypes.UPDATEVERIFYTYPE, '');
					commit(mutationTypes.UPDATEAUDITSTATUS, false);
					return;
				}

				const code = ret.bizCode,
					originData = ret.data || {};

				switch (code) {
				case 10000: {
					const status = originData.status;
					if (status === 20 || status === 71) {
						commit(mutationTypes.UPDATEWITHDRAWRESULT, true);
						commit(mutationTypes.UPDATEVERIFYTYPE, '');
						commit(mutationTypes.SUPPLEMENTWITHDRAWINFO, originData);
					} else {
						const verityType = getVerityType(status);
						if (verityType) {
							commit(mutationTypes.UPDATEVERIFYTYPE, verityType);
						} else {
							commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
						}
					}
					break;
				}
				case 11800:
					// 没有发上行短信
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						title: 'Certificate validation failure',
						msg: 'We have not received your SMS. Please try again or contact us.',
						showSmsPop: true
					});
					break;
				case 11810:
					// token过期
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						isTimeout: true,
						msg: 'Your session has timed out. Please try again.'
					});
					break;
				case 11700:
				case 11701:
				case 11702:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: '',
						msg: ret.message || commonError,
						isCodeError: true
					});
					break;
				case 62200: {
					commit(mutationTypes.UPDATEAUDITSTATUS, true);

					const amount = originData.auditLimit,
						msg = originData.message;

					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'confirmAudit',
						msg: (!amount && msg) ?
							msg :
							`The amount exceeds ${showCurrency}${formatNumber(amount / 10000, 2)}, manual process would be applied. You can expect the result in 3 working days.`,
					});

					break;
				}
				default: {
					const errorMsg = getErrorTips(ret) || 'Sorry，something went wrong. Please try again later.';
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: errorMsg,
						clearAmount: code === 61100,
						deleteRecord: code === 65001
					});
				}
				}
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
	/*
	bankCode、bankAccNum
	 */
	getAccountInfo({
		commit,
		state
	}) {
		const wdInfo = state.wdInfo || {},
			params = {
				bankCode: wdInfo.bankCode,
				bankAccNum: wdInfo.bankAccNum
			};

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/bankTrades/bankTrade/resolve', {
				method: 'GET',
				body: params,
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

					// 验证过程登录状态失效，回到初态
					commit(mutationTypes.UPDATEVERIFYTYPE, '');

					reject({
						loadAccName: false
					});
					return;
				}

				const code = ret.bizCode,
					originData = ret.data || {};

				switch (code) {
				case 10000: {
					const accName = originData.bankAccName;
					commit(mutationTypes.UPDATEBANKACCOUNT, accName);
					resolve({
						loadAccName: true,
						accName
					});
					break;
				}
				default:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'mark',
						msg: 'Invalid account number.',
						isAccountError: true
					});

					reject({
						loadAccName: false
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
					loadAccName: false
				});
			});
		});
	},
	withdrawAgain({
		dispatch,
		state
	}) {
		if (state.verifyType) {
			dispatch('tradeAddtional');
		} else {
			dispatch('withdraw');
		}
	}
};
