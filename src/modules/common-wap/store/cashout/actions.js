import { isEmptyObject } from 'utils';
import cookie from 'storage/cookie';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';
import * as mutationTypes from './mutationTypes';

import { handleErrorInfo } from './commonFun';

const loginUrl = `${pagePath.login}?okUrl=${encodeURIComponent(location.href)}`;
// import '../../../mockData/cashout/cashout?debug';

let timerId;

export default {
	/*
	获取cashout list (pageSize、firstId)
	 */
	fetchCashoutList({
		commit,
		state,
		// dispatch
	}) {
		// 重置错误消息
		commit(mutationTypes.UPDATEERRORINFO, {});

		// 重置list的load错误信息
		if (state.loadListError) {
			commit(mutationTypes.UPDATELISTLOADERROR, false);
		}

		// 设置list的loading状态
		commit(mutationTypes.UPDATELISTLOADING, true);
		const params = {
			pageSize: state.pageSize
		};
		if (state.lastId) {
			params.lastId = state.lastId;
		}
		return fetch('/realSportsGame/cashAbleBets', {
			method: 'GET',
			body: params
		})
		.then(res => {
			// 重置list的loading状态
			commit(mutationTypes.UPDATELISTLOADING, false);

			return res.json();
		})
		.then(data => {
			// 未登录 - 直接跳转到登录页面去
			if (data.login === false) {
				location.href = loginUrl;
				return;
			}

			const code = data.bizCode,
				originData = data.data || {};

			if (code === 10000) {
				commit(mutationTypes.UPDARECASHOUTLIST, originData);
			} else {
				// 设置load error
				commit(mutationTypes.UPDATELISTLOADERROR, true);
			}
		})
		.catch(() => {
			if (state.listLoading) {
				// 重置list的loading状态
				commit(mutationTypes.UPDATELISTLOADING, false);
			}

			if (!state.loadListError) {
				// 设置load error
				commit(mutationTypes.UPDATELISTLOADERROR, true);
			}
		});
	},

	/*
	获取展开的cashout的详情(betId)
	isRefresh: 是否为刷新，刷新不需要重置
	 */
	fetchCashoutDetail({
		commit,
		state
	}, isRefresh) {
		// 重置错误消息
		commit(mutationTypes.UPDATEERRORINFO, {});

		// 重置detail load error
		if (state.loadDetailError) {
			commit(mutationTypes.UPDATEDETAILLOADERROR, false);
		}

		if (isRefresh) {
			// 重置detail refresh loading
			commit(mutationTypes.UPDATEREFRESHLOADING, true);
		} else {
			// 设置detail的loading状态
			commit(mutationTypes.UPDATEDETAILLOADING, true);
		}

		return new Promise((resolve, reject) => {
			fetch('/realSportsGame/cashAbleBet', {
				method: 'GET',
				body: {
					betId: state.currentBetId,
					integrity: 'full'
				}
			})
			.then(res => {
				if (isRefresh) {
					// 设置detail refresh loading
					commit(mutationTypes.UPDATEREFRESHLOADING, false);
				} else {
					// 设置detail的loading状态
					commit(mutationTypes.UPDATEDETAILLOADING, false);
				}

				return res.json();
			})
			.then(data => {
				// 未登录
				if (data.login === false) {
					location.href = loginUrl;
					return;
				}

				const code = data.bizCode,
					originData = data.data || {};

				let cashOut = originData.cashOut || {};
				cashOut = isEmptyObject(cashOut) ?
					{} :
					Object.assign(cashOut, { isInit: true });

				delete originData.cashOut;

				if (code === 10000) {
					commit(mutationTypes.UPDATECASHOUTINFO, cashOut);
					commit(mutationTypes.UPDATECASHOUTDETAIL, originData);
				} else {
					// 设置detail load error
					commit(mutationTypes.UPDATEDETAILLOADERROR, true);
				}

				resolve(originData);
			})
			.catch(() => {
				if (state.refreshLoading && isRefresh) {
					// 设置detail refresh loading
					commit(mutationTypes.UPDATEREFRESHLOADING, false);
				}

				if (state.detailLoading && !isRefresh) {
					// 设置detail的loading状态
					commit(mutationTypes.UPDATEDETAILLOADING, false);
				}

				if (!state.loadDetailError) {
					// 设置detail load error
					commit(mutationTypes.UPDATEDETAILLOADERROR, true);
				}

				// reject(err);
			});
		});
	},

	/*
	cashout
	params: {
		betId: '201707111400049000001_multiple_1',
		usedStake: '200.00',
		isPartial: true,
		amount: '315.62'
	}
	 */
	cashout({
		commit,
		state
	}, params) {
		const cashoutInfo = state.cashoutInfo || {};
		let isSupportPartial = cashoutInfo.isSupportPartial || false;

		if (isSupportPartial && (!params.usedStake || !params.amount)) {
			return;
		}

		// 重置错误消息
		commit(mutationTypes.UPDATEERRORINFO, {});

		commit(mutationTypes.UPDATECASHOUTLOADING, true);

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			const betId = state.currentBetId;

			isSupportPartial = isSupportPartial ? +params.amount !== +cashoutInfo.maxCashOutAmount : false;

			timerId && clearTimeout(timerId);
			timerId = setTimeout(() => {
				clearTimeout(timerId);
				state.cashoutLoading && commit(mutationTypes.UPDATECASHOUTLOADING, false);

				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: 'Sorry，something went wrong. Please try again later.'
				});

				resolve({
					netError: true
				});
			}, 10000);

			fetch('/realSportsGame/cashOut', {
				method: 'POST',
				body: JSON.stringify({
					betId,
					usedStake: isSupportPartial ? params.usedStake : cashoutInfo.availableStake,
					isPartial: isSupportPartial,
					amount: isSupportPartial ? params.amount : cashoutInfo.maxCashOutAmount
				}),
				headers: t
			})
			.then(res => {
				timerId && clearTimeout(timerId);
				state.cashoutLoading && commit(mutationTypes.UPDATECASHOUTLOADING, false);

				return res.json();
			})
			.then(data => {
				// 未登录
				if (data.login === false) {
					location.href = loginUrl;
					return;
				}

				const code = data.bizCode,
					originData = data.data || {};

				if (code === 10000) {
					commit(mutationTypes.UPDATECASHOUTINFO, Object.assign(
						originData,
						{
							// 是否完成的cashout
							done: isEmptyObject(originData),
							cashoutFaild: false
						}
					));
					EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
					// 更新stake值
					commit(mutationTypes.UPDATEBETSTAKE, originData);

					// 如果全部cashout成功，存储该betId
					if (originData.done) {
						commit(mutationTypes.SAVECASHOUTEDBETID, betId);
					}
				} else if (code === 32000) {
					commit(mutationTypes.UPDATECASHOUTINFO, Object.assign(
						originData,
						{
							cashoutFaild: true
						}
					));

					// 更新stake值
					commit(mutationTypes.UPDATEBETSTAKE, originData);
				} else {
					const errorInfo = handleErrorInfo(code);
					if (errorInfo) {
						commit(mutationTypes.UPDATEERRORINFO, errorInfo);
					}

					commit(mutationTypes.UPDATECASHOUTINFO, {
						cashoutAvailable: false
					});
				}

				resolve(originData);
			})
			.catch(() => {
				// reject(err);
				timerId && clearTimeout(timerId);

				state.cashoutLoading && commit(mutationTypes.UPDATECASHOUTLOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: 'Sorry，something went wrong. Please try again later.'
				});

				resolve({
					netError: true
				});
			});
		});
	},
	getComments({
		commit,
		state
	}) {
		commit(mutationTypes.UPDATECOMMETNSINFO, {});

		const cashoutDetail = state.cashoutDetail || [],
			eventIds = [];

		for (const item of cashoutDetail) {
			eventIds.push(item.eventId);
		}

		if (!eventIds.length) {
			return;
		}

		return new Promise((resolve, reject) => {
			fetch(`#/quanzi/lottery/eventEssentials.html?userToken=${cookie('accessToken')}&productId=${window.country.toUpperCase()}`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(eventIds)
			})
			.then(res => res.json())
			.then(res => {
				const ret = {};
				res.topics.forEach(topic => {
					if (~eventIds.indexOf(topic.eventId)) {
						const num = topic.commentsNum;
						ret[topic.eventId] = num > 999 ? '999+' : num;
					}
				});

				commit(mutationTypes.UPDATECOMMETNSINFO, ret);
			});
		});
	}
};
