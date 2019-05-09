import detailPush from 'push/betPush';
import { isEmptyObject } from 'utils';
import cookie from 'storage/cookie';

import * as mutationTypes from './mutationTypes';
import { clearData, updateBetDetail } from './commonFun';
import { fetchConfigThreshold, cfgKey } from './config';

let eventTopic = {};
let marketTopic = {};

let marketTopicArr = [],
	eventTopicArr = [];

let timerId;
let fetchCfgThreshold = fetchConfigThreshold;

export default {
	getBetList({
		commit,
		state,
		dispatch
	}) {
		// dispatch('unSubAll');

		state.betKeys.length && commit(mutationTypes.RESETDETAILINFO);

		commit(mutationTypes.UPDATEERRORINFO, {});
		!state.reqLoading && commit(mutationTypes.UPDATEREQLOADING, true);

		const reqIndex = state.pageIndex;

		return new Promise((resolve, reject) => {
			fetch('/realSportsGame/openbets', {
				method: 'GET',
				body: {
					pageSize: state.pageSize,
					pageNum: reqIndex
				}
			})
			.then(res => res.json())
			.then(data => {
				if (data.login === false) {
					commit(mutationTypes.UPDATELOGINSTATUS, false);
					commit(mutationTypes.UPDATEREQLOADING, false);
					window.loginStatus = false;
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				const code = data.bizCode,
					originData = data.data || {};

				if (code === 10000) {
					const cashAbleBets = originData.cashAbleBets || [];

					commit(mutationTypes.UPDATEBECOUNT, {
						count: originData.totalNum || 0,
						listCount: cashAbleBets.length
					});

					if (cashAbleBets.length) {
						commit(mutationTypes.UPDATEREQLOADING, false);

						clearData(originData, eventTopic, marketTopic);
						cashAbleBets.length && commit(mutationTypes.UPDATEDETAILINFO, {
							betList: cashAbleBets
						});

						// dispatch('clearSub');
						dispatch('getComments');
					} else {
						commit(mutationTypes.UPDATEREQLOADING, false);
					}
				} else {
					commit(mutationTypes.UPDATEREQLOADING, false);
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'load_error_list'
					});
				}
			})
			.catch(err => {
				 window.__debug__ && console.log(err);

				state.reqLoading && commit(mutationTypes.UPDATEREQLOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'load_error_list'
				});
			});
		});
	},

	fetchBetDetail({
		commit,
		state,
		dispatch
	}, params) {
		const { betId = '', from = '' } = params || {},
			index = state.betKeys.indexOf(betId);

		if (!betId || index === -1) {
			return;
		}

		commit(mutationTypes.UPDATEERRORINFO, {});
		commit(mutationTypes.UPDATEREQLOADING, true);

		return new Promise((resolve, reject) => {
			fetch('/realSportsGame/cashAbleBet', {
				method: 'GET',
				body: {
					betId,
					integrity: 'full'
				}
			})
			.then(res => res.json())
			.then(data => {
				commit(mutationTypes.UPDATEREQLOADING, false);

				if (data.login === false) {
					commit(mutationTypes.UPDATELOGINSTATUS, false);
					window.loginStatus = false;
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					resolve({
						loaded: false
					});
					return;
				}

				const code = data.bizCode,
					originData = data.data || {};

				const cashOut = originData.cashOut || {};
				delete originData.cashOut;

				if (code === 10000) {
					if (originData.stake && +originData.stake === 0 || +originData.status !== 0) {
						commit(mutationTypes.UPDATEERRORINFO, {
							type: 'dialog',
							msg: 'This bet is no longer available for Cashout',
							optType: 'refresh',
							from: 'detail_update'
						});

						resolve({
							loaded: false
						});

						return;
					}

					const updateBetInfo = updateBetDetail(originData, state.details[index], betId, eventTopic, marketTopic);

					commit(mutationTypes.UPDATEDETAILINFO, {
						index,
						updateInfo: updateBetInfo,
						from
					});

					commit(mutationTypes.UPDATECASHOUTINFO, Object.assign(cashOut, { betId }));

					// dispatch('clearSub');

					resolve({
						loaded: true
					});
				} else {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'load_error_detail',
						from
					});
					commit(mutationTypes.UPDATECASHOUTINFO);
					resolve({
						loaded: false
					});
				}
			})
			.catch(err => {
				 window.__debug__ && console.log(err);
				state.reqLoading && commit(mutationTypes.UPDATEREQLOADING, false);
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'load_error_detail',
					from
				});
				commit(mutationTypes.UPDATECASHOUTINFO);

				resolve({
					loaded: false
				});
			});
		});
	},

	cashout({
		commit,
		state
	}, params) {
		const cashoutInfo = state.cashoutInfo || {};
		const isSupportPartial = !isEmptyObject(params);

		commit(mutationTypes.UPDATEERRORINFO, {});
		commit(mutationTypes.UPDATEREQLOADING, true);

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			timerId && clearTimeout(timerId);
			timerId = setTimeout(() => {
				clearTimeout(timerId);
				state.reqLoading && commit(mutationTypes.UPDATEREQLOADING, false);

				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: 'Sorry，something went wrong. Please try again later.',
					from: 'cashout'
				});
			}, 10000);

			fetch('/realSportsGame/cashOut', {
				method: 'POST',
				body: JSON.stringify({
					betId: cashoutInfo.betId,
					usedStake: isSupportPartial ? params.usedStake : cashoutInfo.availableStake,
					isPartial: isSupportPartial,
					amount: isSupportPartial ? params.amount : cashoutInfo.maxCashOutAmount
				}),
				headers: t
			})
			.then(res => {
				timerId && clearTimeout(timerId);
				state.reqLoading && commit(mutationTypes.UPDATEREQLOADING, false);

				return res.json();
			})
			.then(data => {
				if (data.login === false) {
					commit(mutationTypes.UPDATELOGINSTATUS, false);
					window.loginStatus = false;
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				const code = data.bizCode,
					originData = data.data || {};

				switch (code) {
				case 10000:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'success',
						isPartial: isSupportPartial,
						remainCount: originData.remainCount,
						isTotal: isEmptyObject(originData),
						val: isSupportPartial ? params.amount : cashoutInfo.maxCashOutAmount,
						from: 'cashout'
					});
					return;
				case 33001:
				case 33003:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: 'This bet is no longer available for Cashout',
						optType: 'refresh',
						from: 'cashout'
					});
					return;
				case 33004:
					commit(mutationTypes.UPDATECASHOUTINFO, { betId: cashoutInfo.betId, errorMsg: data.message });
					return;
				case 32000:
					commit(mutationTypes.UPDATEBETSTAKE, {
						cashout: originData,
						betId: cashoutInfo.betId
					});
					commit(mutationTypes.UPDATECASHOUTINFO, Object.assign(originData, { betId: cashoutInfo.betId }));
					return;
				default:
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'dialog',
						msg: data.message || 'Sorry，something went wrong. Please try again later.',
						from: 'cashout'
					});
				}
			})
			.catch(err => {
				 window.__debug__ && console.log(err);
				timerId && clearTimeout(timerId);

				state.reqLoading && commit(mutationTypes.UPDATEREQLOADING, false);

				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'dialog',
					msg: err.message || 'Sorry，something went wrong. Please try again later.',
					from: 'cashout'
				});
			});
		});
	},
	getComments({
		commit,
		state
	}) {
		commit(mutationTypes.UPDATECOMMETNSINFO, {});

		const eventIds = [];

		for (const topic of Object.keys(eventTopic)) {
			const temp = topic.split('^');
			eventIds.push(temp[3]);
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
	},
	getCashoutCfg({
		commit,
		dispatch
	}) {
		if (fetchCfgThreshold <= 0) {
			return;
		}

		--fetchCfgThreshold;

		const params = [];

		for (const item of Object.keys(cfgKey)) {
			params.push({
				appId: 'service-realSportsGame',
				namespace: 'application',
				configKey: item,
				operId: +window.operId
			});
		}

		fetch('/common/config/query', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify(params)
		})
		.then(res => res.json())
		.then(res => {
			const { bizCode = -1, data = [] } = res || {};

			if (bizCode === 10000) {
				commit(mutationTypes.STORECONFIG, data);
			} else {
				dispatch('getCashoutCfg');
			}
		})
		.catch(() => {
			dispatch('getCashoutCfg');
		});
	},

	clearSub({
		dispatch
	}) {
		const sub = [],
			unsub = [];

		for (const topicKey of Object.keys(marketTopic)) {
			const mIndex = marketTopicArr.indexOf(topicKey),
				curBetsCount = marketTopic[topicKey].length || 0;

			if (mIndex === -1 && curBetsCount) {
				marketTopicArr.push(topicKey);
				sub.push({
					type: 'market',
					topicKey
				});
			}

			if (mIndex !== -1 && !curBetsCount) {
				marketTopicArr.splice(mIndex, 1);

				delete marketTopic[topicKey];

				unsub.push({
					type: 'market',
					topicKey
				});
			}
		}

		for (const baseTopicKey of Object.keys(eventTopic)) {
			const eIndex = eventTopicArr.indexOf(baseTopicKey),
				curBetsCount = eventTopic[baseTopicKey].length || 0;

			if (eIndex === -1 && curBetsCount) {
				eventTopicArr.push(baseTopicKey);
				sub.push({
					type: 'event',
					topicKey: baseTopicKey
				});
			}

			if (eIndex !== -1 && !curBetsCount) {
				eventTopicArr.splice(eIndex, 1);

				delete eventTopic[baseTopicKey];

				unsub.push({
					type: 'event',
					topicKey: baseTopicKey
				});
			}
		}

		if (sub.length) {
			dispatch('subscription', sub);
		}

		if (unsub.length) {
			dispatch('unSubscription', unsub);
		}
	},

	subscription({
		state,
		commit
	}, subList) {
		for (let i = 0, len = subList.length; i < len; i++) {
			const subItem = subList[i],
				subTopic = subItem.topicKey,
				type = subItem.type;

			if (type === 'event') {
				detailPush.sub({
					topic: `${subTopic}^status`,
					pushType: 'GROUP',
					listener: data => {     // eslint-disable-line
						window.__cashoutEvent__ && console.log(`subscription events--- ${data} --- ${subTopic}`);

						commit(mutationTypes.UPDATESELECTIONSINFO, {
							pushData: data,
							type: 'event',
							betIds: eventTopic[subTopic]
						});
					}
				});
			}

			if (type === 'market') {
				detailPush.sub({
					topic: `${subTopic}^status`,
					pushType: 'GROUP',
					listener: data => {    // eslint-disable-line
						window.__cashoutMarket__ && console.log(`subscription market---${data}---${subTopic}`);
						commit(mutationTypes.UPDATESELECTIONSINFO, {
							pushData: data,
							type: 'market',
							betIds: marketTopic[subTopic]
						});
					}
				});

				detailPush.sub({
					topic: `${subTopic}^odds`,
					pushType: 'GROUP',
					listener: data => {     // eslint-disable-line
						window.__cashoutOdds__ && console.log(`subscription odds --- ${data} -- ${subTopic}`);
						commit(mutationTypes.UPDATESELECTIONSINFO, {
							pushData: data,
							type: 'odds',
							betIds: marketTopic[subTopic]
						});
					}
				});
			}
		}
	},

	unSubAll({
		dispatch
	}) {
		const ret = [];
		for (const topicKey of Object.keys(marketTopic)) {
			ret.push({
				type: 'market',
				topicKey
			});
		}

		for (const baseTopicKey of Object.keys(eventTopic)) {
			ret.push({
				type: 'event',
				topicKey: baseTopicKey
			});
		}

		eventTopic = {};
		marketTopic = {};

		marketTopicArr = [];
		eventTopicArr = [];

		dispatch('unSubscription', ret);
	},

	unSubscription({
		state
	}, unsubList = []) {
		for (let i = 0, len = unsubList.length; i < len; i++) {
			const subItem = unsubList[i],
				subTopic = subItem.topicKey,
				type = subItem.type;

			if (type === 'event') {
				detailPush.unsub({
					topic: `${subTopic}^status`,
					pushType: 'GROUP'
				});
			}

			if (type === 'market') {
				detailPush.unsub({
					topic: `${subTopic}^status`,
					pushType: 'GROUP'
				});

				detailPush.unsub({
					topic: `${subTopic}^odds`,
					pushType: 'GROUP'
				});
			}
		}
	}
};
