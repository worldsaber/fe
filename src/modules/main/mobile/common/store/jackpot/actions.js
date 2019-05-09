import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import * as mutationTypes from './mutationTypes';

const getData = (url, param = {}) => new Promise((resolve, reject) => {
	const t = new Headers();
	t.append('Content-Type', 'application/json;charset=UTF-8');
	t.append('OperId', window.operId || '1');
	const params = {
		method: 'GET',
		headers: t,
		body: {},
	};
	Object.assign(params, param);
	fetch(url, params)
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode;
			if (code === 10000) {
				resolve(data || {});
			} else {
				reject(data);
			}
		})
		.catch(err => {
			reject(err);
		});
});

/*
红包生单参数
 */
function getCouponInfo(couponInfo) {
	if (!couponInfo) {
		return;
	}

	const { giftId } = couponInfo;
	return {
		favorInfo: [{
			giftId,
		}]
	};
}

export default {
	// 页面初始化数据
	intBetData({ commit, state }) {
		getData('/jackpot/period').then(res => {
			commit(mutationTypes.UPDATE_PERIOD_DATA, res.data);
		});
		getData('/jackpot/periodOptions').then(res => {
			commit(mutationTypes.UPDATE_RESULT_PERIODS, res.data);
		});
	},
	// 获取banner数据
	getPageData({ commit, state }) {
		getData('/jackpot/banner').then(res => {
			commit(mutationTypes.UPDATE_BANNER, res.data);
			commit(mutationTypes.UPDATE_GAME_SIZE, res.data.firstPrizeCorrect);
		});
	},
	// 获取历史中奖数据
	getPreviousDetail({ commit, state }, data) {
		return getData('/jackpot/previous', {
			body: { periodNumber: data, }
		}).then(res => {
			commit(mutationTypes.UPDATE_PREVIOUS_DETAIL, res.data);
			return res.data;
		});
	},

	// 设置选中项
	setSelectItem({ commit, state }, data) {
		const selectItem = data;
		const index = state.selections.itemList.indexOf(selectItem.item);
		if (index === -1) {
			selectItem.type = 'add';
		} else if (index > -1) {
			selectItem.index = index;
			selectItem.type = 'delete';
		}

		commit(mutationTypes.UPDATE_SELECTIONS, selectItem);
	},
	// 投注
	betting({ commit, state, rootGetters }) {
		const param = {
			bizType: 3,
			period: state.periodData.periodNumber,
			actualPayAmount: +state.orderData.payMoney,
			ticket: {}
		};
		param.actualPayAmount *= 10000;
		param.actualPayAmount = +(param.actualPayAmount.toFixed(0));
		const selections = state.selections.itemList.map(str => JSON.parse(str));
		const checkedCoupon = rootGetters['coupons/checkItem'] || null;
		const couponInfo = getCouponInfo(checkedCoupon);
		couponInfo && (param.favor = couponInfo);
		param.ticket.selections = selections;
		return new Promise((resolve, reject) => {
			getData('/orders/order', {
				method: 'POST',
				body: JSON.stringify(param),
			}).then(res => {
				commit(mutationTypes.SET_ORDER_DATA, res.data);
				resolve(res);
			}, res => {
				const code = res.bizCode;
				commit(mutationTypes.SET_ORDER_DATA, {
					title: '',
					msg: '',
					optType: '',
					buttonList: ['*OK'],
				});
				if (res.login === false) {
					window.loginStatus = false;
					commit(mutationTypes.CHANGE_LOGIN_STATUS, false);
					EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
					commit(mutationTypes.SET_ORDER_DATA, {
						title: '',
						msg: '',
						optType: 'login'
					});
					reject(res);
					return;
				}
				commit(mutationTypes.CHANGE_LOGIN_STATUS, true);
				switch (code) {
				case 4100:
				// 下单被拒
				case 4300:
					commit(mutationTypes.SET_ORDER_DATA, {
						title: 'Submission Failed',
						msg: res.message,
						optType: 'cloesd'
					});
					break;
				// 余额不足
				case 4200:
					commit(mutationTypes.SET_ORDER_DATA, {
						title: 'Balance Insufficient',
						msg: res.message || 'There is not enough balance in your account to place this bet.',
						optType: 'deposit',
						buttonList: ['LATER', '*DEPOSIT'],
					});
					break;
				// 红包生单失败
				case 4210:
					commit(mutationTypes.SET_ORDER_DATA, {
						title: 'Gift Unavailable',
						msg: res.message,
						optType: 'coupons'
					});
					break;
				// 过期/失效
				case 4400:
					commit(mutationTypes.SET_ORDER_DATA, {
						title: 'Round Cloesd',
						msg: 'The current round is closed, please refer to the new round.',
						optType: 'cloesd'
					});
					break;
				case 11000:
					commit(mutationTypes.SET_ORDER_DATA, {
						title: 'Sorry, something went wrong, Please try again later.',
					});
					break;
				default:
					commit(mutationTypes.SET_ORDER_DATA, {
						title: 'Please check your internet connection and try again.',
					});

				}
				reject(res);
			}).catch(() => {
				commit(mutationTypes.SET_ORDER_DATA, {
					title: 'Please check your internet connection and try again.',
				});

				reject({});
			});
		});
	}
};
