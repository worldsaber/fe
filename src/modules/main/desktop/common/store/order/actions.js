import * as mutationTypes from './mutationTypes';

import '../../../mockData/order/order?debug';

export default {
	/*
	获取订单列表(isSettled、pageSize、lastId)
	 */
	fetchOrderList({
		commit,
		state,
		getters
	}, pageNo) {
		state.isLoading = true;
		// console.log('isSettled:' + (getters.isSettled ? 1 : 0) + ';pageNo:' + pageNo + ';pageSize:' + state.pageSize);
		fetch('/orders/order/realbetlist', {
			method: 'GET',
			body: {
				isSettled: getters.isSettled ? 1 : 0,
				pageSize: state.pageSize,
				pageNo: pageNo || 1
			}
		})
		.then(res => res.json())
		.then(data => {
			const originData = data.data || {};
				// originData.pageNo = pageNo || 1;
			commit(mutationTypes.UPDATEORDERLIST, originData);
			state.isLoading = false;
		}).catch(() => {
			state.isLoading = false;
			// 重置orderList
			commit(mutationTypes.UPDATEORDERLIST, {});
		});
	},

	/*
	获取指定betid的详情betId
	 */
	fetchBetDetail({
		commit,
		state
	}) {
		const currentBetId = state.currentBetId;

		if (!currentBetId) {
			return;
		}

		// 重置betDetail
		commit(mutationTypes.UPDATEBETDETAIL, []);

		fetch('/realSportsGame/selections', {
			method: 'GET',
			body: {
				betId: currentBetId
			}
		})
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode;

			if (code === 10000) {
				commit(mutationTypes.UPDATEBETDETAIL, data.data || []);
			}
		});
	},

	/*
	获取combination的信息
	 */
	fetchCombination({
		commit
	}, params) {
		// 重置combinationInfo
		commit(mutationTypes.UPDATECOMBINATIONINFO, []);

		if (!params || !params.betId) {
			return;
		}

		return new Promise((resolve, reject) => {
			fetch('/realSportsGame/combinations', {
				method: 'GET',
				body: params
			}).then(res => res.json()).then(data => {
				const code = data.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATECOMBINATIONINFO, data.data || []);
					resolve(true);
				}
			});
		});
	},

	/*
	获取指定bet对应的cashout history
	 */
	fetchCashoutHistory({
		commit,
		state
	}) {
		const currentBetId = state.currentBetId;

		if (!currentBetId) {
			return;
		}

		// 重置cashoutHistory
		commit(mutationTypes.UPDATECASHOUTHISTORY, []);

		fetch('/realSportsGame/cashOutHistory', {
			method: 'GET',
			body: {
				betId: currentBetId
			}
		}).then(res => res.json()).then(data => {
			const code = data.bizCode;

			if (code === 10000) {
				commit(mutationTypes.UPDATECASHOUTHISTORY, data.data || []);
			}
		});
	},
};
