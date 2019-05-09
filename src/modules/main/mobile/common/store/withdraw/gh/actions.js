import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';

import * as mutationTypes from './mutationTypes';
import {
	commonError,
	getErrorTips,
	getDpReqTips
} from './commonFun';

export default {
	/*
	参数：
	currency、 payAmount、
	payChId（40-Hubtel Online Payment）
	phoneNo
	isConfirmAudit：是否确认审核（0-否，1-是）
	payAmount
	name，
	channel
	响应：
	tradeId、acceptTime、feeAmount、feeType、status、jumpUrl
	ACC_BAL_NOT_ENOUGH(61100, "account balance not enough"),
	ACC_ALREADY_FROZEN(61300, "account already frozen"),
	OVER_BANK_DAILY_LIMIT(62100, "over bank daily limit"),
	OVER_AUDIT_LIMIT(62200, "over audit limit, need admin audit"),
	 */
	withdraw({
		state,
		commit,
		dispatch
	}) {
		const wdInfo = state.wdInfo || {};
		const { payAmount = 0/* , name*/, channel, phoneNo } = wdInfo;
		let payMoney = payAmount * 10000;
		payMoney = +payMoney;
		payMoney = payMoney.toFixed(0);

		const params = {
			currency: state.currency,
			payChId: 40,
			payAmount: +payMoney,
			// name,
			channel,
			phoneNo,
			isConfirmAudit: state.needAudit ? 1 : 0,
		};

		window.__debug__ && console.log(params);

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		commit(mutationTypes.UPDATEWITHDRAWRESULT, false);
		commit(mutationTypes.UPDATEWITHDRAWTRADEID, {});

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch('/pocket/v1/bankTrades/bankTrade/withdraw', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
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

				const code = ret.bizCode,
					originData = ret.data || {};

				originData.tradeId && commit(mutationTypes.UPDATEWITHDRAWTRADEID, originData);

				switch (code) {
				case 10000: {
					const status = originData.status;
					if (status === 20 || status === 71) {
						commit(mutationTypes.UPDATEWITHDRAWRESULT, true);
						commit(mutationTypes.SUPPLEMENTWITHDRAWINFO, originData);
					} else if ([10, 72].includes(status)) {
						setTimeout(() => {
							dispatch('queryInfo');
						}, 2000);
					} else {
						commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
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
				default:
					commit(mutationTypes.UPDATEERRORINFO, getErrorTips(ret));
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, commonError);
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
					action: 2
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
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			fetch('/pocket/v1/wallet/supportChannels', {
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
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATELOADING, false);
				commit(mutationTypes.BANKLOADERROR, true);
			});
		});
	},

	/*
	pocket/v1/bankTrades/bankTrade/{tradeId}（post）
	参数：
	tradeId
	响应：
	counterPart、status、counterAuthority、counterIconUrl、bankAccName
	 */
	queryInfo({
		commit,
		state
	}) {
		commit(mutationTypes.UPDATEERRORINFO, {});

		return new Promise((resolve, reject) => {
			fetch(`/pocket/v1/bankTrades/bankTrade/${state.tradeId}`, {
				method: 'GET'
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

				const code = ret.bizCode,
					originData = ret.data || {};

				switch (code) {
				case 10000: {
					const status = originData.status;
					if (status === 20 || status === 71) {
						commit(mutationTypes.UPDATEWITHDRAWRESULT, true);
						commit(mutationTypes.SUPPLEMENTWITHDRAWINFO, originData);
					} else {
						commit(mutationTypes.UPDATEERRORINFO, getDpReqTips(ret));
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
				default:
					commit(mutationTypes.UPDATEERRORINFO, getErrorTips(ret));
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: commonError
				});
			});
		});
	},
};
