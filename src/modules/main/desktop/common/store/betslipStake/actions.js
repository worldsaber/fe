import { isEmptyObject, objType } from 'utils';
import { createOrderTips4Coins } from 'store/coins/config';
import { getParams } from './commonFun';

import * as mutationTypes from './mutationTypes';

import '../../../mockData/betslip/betslip?debug';

let timerId = null;
let handleRes = false;
let hasTimeout = false;

export default {
	placeBet({
		commit,
		state,
		getters,
		rootState,
		rootGetters
	}, payAmount) {
		// 重置数据
		commit(mutationTypes.UPDATEERRORINFO, null);
		commit(mutationTypes.UPDATEORDERINFO, null);
		handleRes = false;

		if (!rootState || isEmptyObject(rootState) || !rootState.betslip || isEmptyObject(rootState.betslip)) {
			return;
		}

		const isFlexi = rootGetters['betslip/isFlexi'] || false,
			payMethod = rootGetters['betslip/getCurrentPayMethods'],
			params = getParams(1, rootState.betslip, state, rootGetters['coupons/checkItem'] || null, isFlexi, getters.stakeUnion, payMethod);

		window.__debug__ && console.log(params);

		if (!params) {
			return;
		}

		params.actualPayAmount = payAmount;

		commit(mutationTypes.UPDATEBETLOADING, true);

		return new Promise((resolve, reject) => {
			hasTimeout = false;

			// 超过10s
			timerId = setTimeout(() => {
				clearTimeout(timerId);
				hasTimeout = true;

				if (!handleRes) {
					commit(mutationTypes.UPDATEERRORINFO, {
						title: 'Request Pending',
						msg: 'Seems like we are having some issues processing your order. Please come back and check "Bet History" later.',
						optType: 'clear'
					});

					state.betLoading && commit(mutationTypes.UPDATEBETLOADING, false);

					reject({
						timeout: true
					});
				}
			}, 60000);

			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			fetch('/orders/order', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			})
			.then(res => {
				if (hasTimeout) {
					reject({
						timeout: true
					});
				} else {
					handleRes = true;
					clearTimeout(timerId);

					state.betLoading && commit(mutationTypes.UPDATEBETLOADING, false);

					return res.json();
				}
			})
			.then(data => {
				// 未登录
				if (data.login === false) {
					window.login({ activeTab: 'Log In' });
					reject({
						createOrder: false
					});
				}

				const code = data.bizCode;

				switch (code) {
				case 10000:
					commit(mutationTypes.UPDATEORDERINFO, data.data || null);
					reject({
						createOrder: true
					});
					return;
				// 下注金额不在范围内
				case 4100:
				// 下单被拒
				case 4300:
					commit(mutationTypes.UPDATEERRORINFO, {
						title: 'Submission Failed',
						msg: data.message,
						optType: isFlexi ? 'flexibet' : ''
					});
					reject({
						createOrder: false
					});
					return;
				case 4310:
					commit(mutationTypes.UPDATEERRORINFO, {
						msg: data.message,
						optType: 'flexibet'
					});
					break;
				// 余额不足
				case 4200:
					if (payMethod === 1) {
						commit(mutationTypes.UPDATEERRORINFO, {
							title: createOrderTips4Coins.title,
							msg: data.message || createOrderTips4Coins.msg,
							optType: 'refreshAsset'
						});
					} else {
						commit(mutationTypes.UPDATEERRORINFO, {
							title: 'Account Balance Insufficient',
							msg: data.message,
							optType: 'deposit'
						});
					}
					break;
				// 红包生单失败
				case 4210:
					commit(mutationTypes.UPDATEERRORINFO, {
						title: 'Gift unavailable',
						msg: data.message,
						optType: 'coupons'
					});
					break;
				default:
					commit(mutationTypes.UPDATEERRORINFO, {
						msg: data.message
					});
					break;
				}

				reject({
					createOrder: false
				});
			})
			.catch(err => {
				if (hasTimeout) {
					reject({
						timeout: true
					});
				} else {
					let msg = 'No internet connection, try again.';
					if (err) {
						if (objType(err) === 'string') {
							msg = err;
						} else if (err.message) {
							msg = err.message;
						}
					}
					commit(mutationTypes.UPDATEERRORINFO, {
						msg
					});
					reject({
						createOrder: false
					});
					clearTimeout(timerId);

					state.betLoading && commit(mutationTypes.UPDATEBETLOADING, false);
				}
			});
		});
	}
};
