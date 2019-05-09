import dateFormat from 'kernel/js/dateFormat';

import * as mutationTypes from './mutationTypes';
import '../../../mockData/order/order?debug';

export default {
	/*
	获取订单列表(isSettled、pageSize、lastId)
	 */
	fetchTicketList({
		commit,
		state,
		getters
	}) {
		if (state.isLoading) {
			return;
		}

		if (state.noMore) {
			return;
		}

		commit(mutationTypes.UPDATE_LOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		const param = {
			isSettled: getters.isSettled,
			pageSize: state.pageSize,
			onlyWinnings: state.settleType === 'Unsettled' ? 0 : state.onlyWinnings,
			isHistory: state.isHistory,
		};
		if (state.from && state.to) {
			param.startTime = new Date(dateFormat.format(state.from, 'YYYY/MM/DD 00:00:00')).valueOf();
			param.endTime = new Date(dateFormat.format(state.to, 'YYYY/MM/DD 23:59:59')).valueOf();
		}
		if (state.lastOrderNo) {
			param.lastId = state.lastOrderNo;
		}
		if (state.isHistory) {
			param.endTime = new Date().setDate(new Date().getDate() - 180);
		}
		return fetch('orders/order/v2/realbetlist', {
			method: 'GET',
			body: param
		})
			.then(res => res.json())
			.then(data => {
				commit(mutationTypes.UPDATE_LOADING, false);

				if (data.login === false) {
					window.loginStatus = false;
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				if (data.bizCode === 10000) {
					const originData = data.data;
					commit(mutationTypes.UPDATETICKETLIST, originData);
					commit(mutationTypes.UPDATE_LOADING, false);
				} else {
					commit(mutationTypes.UPDATE_LOADING, false);
					commit(mutationTypes.UPDATETICKETLIST, data.data || {});
				}
				return data;
			})
			.catch(e => {
				commit(mutationTypes.UPDATE_LOADING, false);
				commit(mutationTypes.UPDATETICKETLIST, []);
			});
	},

	fetchTicketDetail({
		commit,
		state,
		dispatch
	}, orderId) {
		commit(mutationTypes.RESETTICKETDETAIL);
		commit(mutationTypes.UPDATE_LOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		return fetch('orders/order/realsports/ticketDetail', {
			method: 'GET',
			body: {
				orderId
			}
		})
			.then(res => res.json())
			.then(data => {
				if (data.login === false) {
					window.loginStatus = false;
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					commit(mutationTypes.UPDATE_LOADING, false);
					return;
				}

				const originData = data || {};
				const winningStatus = originData.data && originData.data.winningStatus || -1;

				commit(mutationTypes.UPDATETICKETDETAIL, originData);
				if (window.country === 'ke' && winningStatus === 20) {
					dispatch('getShareInfo', orderId);
				} else {
					commit(mutationTypes.UPDTAEGIFTSLOADSTATUS, true);
				}
				commit(mutationTypes.UPDATE_LOADING, false);
			})
			.catch(e => {
				commit(mutationTypes.UPDATE_LOADING, false);
				commit(mutationTypes.UPDATETICKETDETAIL, {});
			});
	},

	/*
	获取指定betid的详情betId
	 */
	fetchBetDetail({
		commit,
		state
	}, orderId) {
		commit(mutationTypes.UPDATEBETDETAIL, []);
		commit(mutationTypes.UPDATE_LOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		fetch('/realSportsGame/order', {
			method: 'GET',
			body: {
				orderId,
				integrity: 'full'
			}
		})
			.then(res => res.json())
			.then(data => {
				commit(mutationTypes.UPDATE_LOADING, false);

				if (data.login === false) {
					window.loginStatus = false;
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				if (data.bizCode === 10000) {
					commit(mutationTypes.UPDATEBETDETAIL, data.data || []);
				}
			})
			.catch(e => {
				commit(mutationTypes.UPDATEBETDETAIL, []);
				commit(mutationTypes.UPDATE_LOADING, false);
			});
	},

	getShareInfo({
		commit
	}, orderId) {
		fetch(`promotion/v1/groupGift/share/${orderId}`, {
			method: 'POST'
		})
		.then(res => res.json())
		.then(ret => {
			commit(mutationTypes.UPDTAEGIFTSLOADSTATUS, true);
			if (ret.bizCode === 10000) {
				commit(mutationTypes.UPDATESHAREGIFTID, ret.data && ret.data.sth || '');
			}
		}).catch(() => {
			commit(mutationTypes.UPDTAEGIFTSLOADSTATUS, true);
		});
	},

};
