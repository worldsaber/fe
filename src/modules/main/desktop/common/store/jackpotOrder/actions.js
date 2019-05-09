import * as mutationTypes from './mutationTypes';

import '../../../mockData/order/jackpotOrder?debug';

export default {
	/*
	获取订单列表(isSettled、pageSize、lastId)
	 */
	fetchOrderList({
		commit,
		state,
		getters
	}, pageNo) {
		const postData = {
			isSettled: getters.isSettled ? 1 : 0
		};
		if (getters.isSettled) {
			postData.pageSize = state.pageSize;
			postData.pageNo = pageNo || 1;
		}
		// console.log('isSettled:' + postData.isSettled + ';pageNo:' + postData.pageNo + ';pageSize:' + postData.pageSize);
		state.isLoading = true;
		fetch('/orders/order/jackpotlist', { // 接口文档地址：https://note.youdao.com/group/#/47583200/(folder/155013031//full:md/165153244)
			method: 'GET',
			body: postData
		})
		.then(res => res.json())
		.then(data => {
			const originData = data.data || {};
			// 设置orderList
			commit(mutationTypes.UPDATEORDERLIST, originData);
			state.isLoading = false;
		}).catch(() => {
			commit(mutationTypes.UPDATEORDERLIST, {});
			state.isLoading = false;
		});
	},

	/*
	获取指定orderId的详情orderId
	 */
	fetchOrderDetail({
		commit,
		state
	}) {
		const currentOrderId = state.currentOrderId;

		if (!currentOrderId) {
			return;
		}
		commit(mutationTypes.UPDATEORDERDETAIL, {});
		fetch('/jackpot/bet', {
			method: 'GET',
			body: {
				id: currentOrderId
			}
		})
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode;

			if (code === 10000) {
				commit(mutationTypes.UPDATEORDERDETAIL, data.data || {});
			}
		});
	},
};
