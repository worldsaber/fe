import detailPush from 'push/betPush';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import { getParams } from './commonFun';
import { UPDATE_BET_LOADING, UPDATE_ORDER_INFO, RESET_STAKE, UPDATE_BONUS, UPDATE_ODDSKEY, UPDATE_FLEXIBET_STATUS } from './mutationTypes';
import '../../../mockData/betslip/betslip?debug';

let timerId = null;
let handleRes = false;

export default {
	placeBet({
		commit,
		dispatch,
		state,
		rootState,
		rootGetters
	}) {
		handleRes = false;
		const params = getParams(1, rootState.betslip, rootGetters, state, rootGetters['coupons/checkItem'] || null);
		if (!params) {
			return;
		}
		commit(UPDATE_BET_LOADING, true);
		commit(UPDATE_ORDER_INFO, null);
		return new Promise((resolve, reject) => {
			// 超过10s
			timerId = setTimeout(() => {
				clearTimeout(timerId);
				if (!handleRes) {
					reject({
						opt: 'clear',
						title: 'Request Pending',
						msg: 'Seems like we are having some issues processing your order. Please come back and check "Bet History" later.',
					});
					// 清空betslip
					dispatch('betslip/clearAllBetSlip', null, { root: true });
					// 重置红包
					commit('coupons/resetCouponsList', true, { root: true });
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
			.then(res => resolve(res), res => reject(res));
		})
		.catch(res => {
			handleRes = true;
			clearTimeout(timerId);
			timerId = null;
			state.betLoading && commit(UPDATE_BET_LOADING, false);
			return Promise.reject(res);
		})
		.then(res => {
			handleRes = true;
			clearTimeout(timerId);
			timerId = null;
			state.betLoading && commit(UPDATE_BET_LOADING, false);
			return res.json();
		})
		.then(data => {
			if (data.bizCode === 10000) {
				commit(UPDATE_ORDER_INFO, data.data || null);
				EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
				// 清空betslip
				dispatch('betslip/clearAllBetSlip', null, { root: true });
				// 重置红包
				commit('coupons/resetCouponsList', true, { root: true });
				// 重置金额
				commit(RESET_STAKE);
				// 下单成功，刷新余额和红包
				return data;
				// 这里下单成功仍返回完整data，便于增加下单成功的处理
			}
			// 其他情况自己处理
			return data;
		});
	},
	fetchBonusConfig ({
		commit,
		dispatch,
		state,
		rootState,
		rootGetters
	}) {
		return fetch('promotion/v1/bonus/plans/valid')
		.then(res => res.json())
		.then(res => {
			if (res.bizCode === 10000) {
				if (res.data && res.data.entityList) {
					commit(UPDATE_BONUS, res.data.entityList[0]);
				}
			}
		});
	},
	fetchFlexiBetConfig ({
		commit,
		dispatch,
		state,
		rootState,
		rootGetters
	}) {
		return fetch('/factsCenter/flexiblebet/getOddsKey')
		.then(res => res.json())
		.then(res => {
			if (res.bizCode === 10000) {
				commit(UPDATE_ODDSKEY, res.data.oddsKey);
				commit(UPDATE_FLEXIBET_STATUS, res.data.status);
			}
		});
	},
	subFlexiBetPush ({
		commit
	}) {
		detailPush.sub({
			topic: 'flexibleBet^status',
			pushType: 'GROUP',
			listener: data => {
				commit(UPDATE_FLEXIBET_STATUS, {
					val: data
				});
			}
		});
	},
	unSubFlexiBetPush ({
		commit
	}) {
		detailPush.unsub({
			topic: 'flexibleBet^status',
			pushType: 'GROUP'
		});
	}
};
