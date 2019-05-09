import detailPush from 'push/betPush';
import { isEmptyObject } from 'utils';

import * as mutationTypes from './mutationTypes';

import { getRefreshParams, getShareParams } from '../betslipStake/commonFun';

import '../../../mockData/betslip/betslip?debug';

const topicList = [];
let topicCountsMap = {};
const topic4Events = [];
let topic4EventsCountsMap = {};

export default {
	addBetSlip({
		commit
	}, params) {
		const betInfo = params.betInfo || {};

		// 增加相关key的push 订阅
		const sportId = betInfo.sportId && betInfo.sportId.replace(/\D/g, '') || -1,
			categoryId = betInfo.categoryId && betInfo.categoryId.replace(/\D/g, '') || -1,
			marketInfo = betInfo.marketInfo || {},
			tournamentId = betInfo.tournamentId || '',
			eventId = betInfo.eventId || '';

		let baseTopic,
			topic;

		if (sportId !== -1 && categoryId !== -1 && eventId && marketInfo.id && tournamentId) {
			// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^odds
			baseTopic = `${sportId}^${categoryId}^${tournamentId}^${eventId}`;
			topic = `${baseTopic}^~^${marketInfo.marketId}^${marketInfo.specifier || '~'}`;
		}

		if (!topic || !baseTopic) {
			return;
		}

		betInfo.topic = topic;
		betInfo.baseTopic = baseTopic;

		commit(mutationTypes.ADD_BETSLIPS_ITEM, params);

		if (!topicList.includes(topic)) {
			// market
			detailPush.sub({
				topic: `${topic}^status`,
				pushType: 'GROUP',
				listener: data => {
// console.log(`add betslip---market---${data}`);
					commit(mutationTypes.UPDATE_BETSLIPS_ITEM, {
						pushData: data,
						type: 'market'
					});
				}
			});

			// odds
			detailPush.sub({
				topic: `${topic}^odds`,
				pushType: 'GROUP',
				listener: data => {
// console.log(`add betslip---odds---${data}`);
					commit(mutationTypes.UPDATE_BETSLIPS_ITEM, {
						pushData: data,
						type: 'odds'
					});
				}
			});

			topicList.push(topic);
			topicCountsMap[topic] = 1;
		} else {
			++topicCountsMap[topic];
		}

		if (!topic4Events.includes(baseTopic)) {
			// event
			detailPush.sub({
				topic: `${baseTopic}^betStatus`,
				pushType: 'GROUP',
				listener: data => {
// console.log(`betslip---event---${data}`);
					commit(mutationTypes.UPDATE_BETSLIPS_ITEM, {
						pushData: data,
						type: 'betEvent'
					});
				}
			});

			topic4Events.push(baseTopic);
			topic4EventsCountsMap[baseTopic] = 1;
		} else {
			++topic4EventsCountsMap[baseTopic];
		}
	},

	deleteBetSlip({
		commit,
		state
	}, key) {
		// 取消相关key的push 订阅
		const index = key && state.betslipsKeys.indexOf(key);
		const deleteItem = index !== -1 ? state.betslips[index] : {},
			topicKey = deleteItem.topic,
			baseTopicKey = deleteItem.baseTopic;

		// market status & odds
		if (topicKey) {
			--topicCountsMap[topicKey];

			if (!topicCountsMap[topicKey]) {
				// 删除topic
				const topicIndex = topicList.indexOf(topicKey);
				(topicIndex !== -1) && topicList.splice(topicIndex, 1);

				// 取消订阅
				detailPush.unsub({
					topic: `${topicKey}^status`,
					pushType: 'GROUP'
				});

				detailPush.unsub({
					topic: `${topicKey}^odds`,
					pushType: 'GROUP'
				});

				// 删除计数对象
				delete topicCountsMap[topicKey];
			}
		}

		// event
		if (baseTopicKey) {
			--topic4EventsCountsMap[baseTopicKey];

			if (!topic4EventsCountsMap[baseTopicKey]) {
				// 删除eventTopic
				const eventTopicIndex = topic4Events.indexOf(baseTopicKey);
				(eventTopicIndex !== -1) && topic4Events.splice(eventTopicIndex, 1);

				// 取消订阅
				detailPush.unsub({
					topic: `${baseTopicKey}^betStatus`,
					pushType: 'GROUP'
				});
// console.log('deleteBetSlip', `${baseTopicKey}^betStatus`);
				// 删除计数对象
				delete topic4EventsCountsMap[baseTopicKey];
			}
		}

		commit(mutationTypes.DELETE_BETSLIPS_ITEM, key);
	},

	/*
	取消outcome的订阅
	 */
	unSubscription() {
		for (const topicKey of topicList) {
			detailPush.unsub({
				topic: `${topicKey}^status`,
				pushType: 'GROUP'
			});

			detailPush.unsub({
				topic: `${topicKey}^odds`,
				pushType: 'GROUP'
			});
		}

		for (const baseTopicKey of topic4Events) {
			detailPush.unsub({
				topic: `${baseTopicKey}^betStatus`,
				pushType: 'GROUP'
			});
// console.log('clearAllBetSlips', `${baseTopicKey}^betStatus`);
		}
	},

	/*
	清空betslip
	 */
	clearAllBetSlips({
		commit,
		state,
		dispatch
	}) {
		dispatch('unSubscription');

		// 清空topic列表
		topicList.splice(0);
		topic4Events.splice(0);

		// 清除计数
		topicCountsMap = {};
		topic4EventsCountsMap = {};

		commit(mutationTypes.CLEAR_BETSLIPS);
	},

	/*
	订阅消息
	 */
	subscription({
		state,
		commit
	}) {
		const betslips = state.betslips || [];

		for (const betItem of betslips) {
			// market status 及 odds
			if (betItem.topic) {
				if (betItem.topic.endsWith('odds')) {
					betItem.topic = betItem.topic.replace('^odds', '');
				}

				if (topicList.includes(betItem.topic)) {
					++topicCountsMap[betItem.topic];
					continue;
				}

				detailPush.sub({
					topic: `${betItem.topic}^status`,
					pushType: 'GROUP',
					listener: data => {
// console.log(`subscription betslip---market---${data}`);
						commit(mutationTypes.UPDATE_BETSLIPS_ITEM, {
							pushData: data,
							type: 'market'
						});
					}
				});

				detailPush.sub({
					topic: `${betItem.topic}^odds`,
					pushType: 'GROUP',
					listener: data => {
// console.log(`subscription betslip---odds---${data}`);
						commit(mutationTypes.UPDATE_BETSLIPS_ITEM, {
							pushData: data,
							type: 'odds'
						});
					}
				});

				topicList.push(betItem.topic);
				topicCountsMap[betItem.topic] = 1;
			}

			// event status
			const eventId = betItem.eventId;
			let baseTopic = betItem.baseTopic || '';
			if (!baseTopic && betItem.topic) {
				const eventIndex = betItem.topic.indexOf(eventId);

				baseTopic = betItem.topic.slice(0, eventIndex + eventId.length);

				if (baseTopic) {
					betItem.baseTopic = baseTopic;
				}
			}

			if (baseTopic) {
				if (topic4Events.includes(baseTopic)) {
					++topic4EventsCountsMap[baseTopic];
					continue;
				}

				detailPush.sub({
					topic: `${baseTopic}^betStatus`,
					pushType: 'GROUP',
					listener: data => {
// console.log(`subscription betslip---event---${data}`);
						commit(mutationTypes.UPDATE_BETSLIPS_ITEM, {
							pushData: data,
							type: 'betEvent'
						});
					}
				});

				topic4Events.push(baseTopic);
				topic4EventsCountsMap[baseTopic] = 1;
			}
		}
	},

	/*
	accept change, 取消unavailable outcome的消息订阅
	 */
	accpetChanges({
		commit,
		state
	}) {
		const unavailableKeys = state.unavailableKeys,
			betslipsKeys = state.betslipsKeys || [],
			betslips = state.betslips || [];

		for (const key of unavailableKeys) {
			const index = betslipsKeys.indexOf(key),
				betItem = index !== -1 ? betslips[index] : {};

			// 更新topic计数
			if (betItem.topic) {
				--topicCountsMap[betItem.topic];
			}

			// 更新event topic计数
			if (betItem.baseTopic) {
				--topic4EventsCountsMap[betItem.baseTopic];
			}
		}

		// market status & odds
		const topicKeys = Object.keys(topicCountsMap);

		for (const topicKey of topicKeys) {
			// topic计数变成0
			if (!topicCountsMap[topicKey]) {
				// 删除topic
				const topicIndex = topicList.indexOf(topicKey);
				(topicIndex !== -1) && topicList.splice(topicIndex, 1);

				// 由于market的状态和outcome的订阅消息不是完全同步，为保证数据的准确性，增加market的订阅
				// 取消订阅
				detailPush.unsub({
					topic: `${topicKey}^status`,
					pushType: 'GROUP'
				});

				detailPush.unsub({
					topic: `${topicKey}^odds`,
					pushType: 'GROUP'
				});

				// 删除计数对象
				delete topicCountsMap[topicKey];
			}
		}

		// event status
		const eventTopicKeys = Object.keys(topic4EventsCountsMap);

		for (const eventTopicKey of eventTopicKeys) {
			// eventTopic计数变成0
			if (!topic4EventsCountsMap[eventTopicKey]) {
				// 删除eventTopic
				const eventTopicIndex = topic4Events.indexOf(eventTopicKey);
				(eventTopicIndex !== -1) && topic4Events.splice(eventTopicIndex, 1);

				// 取消订阅
				detailPush.unsub({
					topic: `${eventTopicKey}^betStatus`,
					pushType: 'GROUP'
				});
// console.log('accpetChanges', `${eventTopicKey}^betStatus`);
				// 删除计数对象
				delete topic4EventsCountsMap[eventTopicKey];
			}
		}

		commit(mutationTypes.ACCEPT_BETSLIPS_CHANGES);
	},

	/*
	用快照刷新betslip
	 */
	refreshBetslip({
		commit,
		state
	}) {
		const betslips = state.betslips || {};

		if (isEmptyObject(betslips)) {
			return;
		}

		const params = getRefreshParams(betslips || []);

		if (!params.length) {
			return;
		}

		!state.betslipLoading && commit(mutationTypes.UPDATEBETSLIPLOADING, true);

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			fetch('/factsCenter/Outcomes', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			})
			.then(res => {
				setTimeout(() => {
					commit(mutationTypes.UPDATEBETSLIPLOADING, false);
				}, 300);

				return res.json();
			})
			.then(data => {
				const code = data.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATEBESLIPS, data.data || []);
				}

				resolve({
					betslipRefresh: 'done'
				});
			})
			.catch(() => {
				state.betslipLoading && setTimeout(() => {
					commit(mutationTypes.UPDATEBETSLIPLOADING, false);
				}, 300);

				resolve({
					betslipRefresh: 'done'
				});
			});
		});
	},

	/*
	分享红包，生成bet code
	 */
	createCode({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			const params = getShareParams(state.betslips);
			window.__debug__ && console.log(`create code params:    ${JSON.stringify(params)}`);

			fetch('/orders/share', {
				method: 'POST',
				body: JSON.stringify({ selections: params }),
				headers: t
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATEBETCODEINFO, ret.data || {});
					resolve(ret.data);
				} else {
					reject({
						share: false
					});
				}
			})
			.catch(err => { // eslint-disable-line
				reject({
					share: false
				});
			});
		});
	},

	/*
	bet code还原betslip列表
	 */
	loadBetslip({
		commit,
		state
	}, params) {
		let shareCode = params && params.betCode || '';

		// 从state中读取
		!shareCode && (shareCode = state.betCodeInfo.shareCode || '');

		if (!shareCode) {
			return;
		}

		return new Promise((resolve, reject) => {
			fetch(`/orders/share/${shareCode}`, {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode,
					orignData = ret.data || {};

				if (code === 10000) {
					commit(mutationTypes.LOADBETSLIPS, orignData.outcomes || []);
					resolve({
						loadBetError: false
					});
				} else {
					reject({
						loadBetError: true,
						msg: ret.message
					});
				}
			})
			.catch(err => { // eslint-disable-line
				reject({
					loadBetError: true
				});
			});
		});
	},

	/*
	flexbet开关
	 */
	subFlex({
		commit
	}) {
		detailPush.sub({
			topic: 'flexibleBet^status',
			pushType: 'GROUP',
			listener: data => {
				window.__debug__ && console.log('flexibleBet---', data);
				commit(mutationTypes.UPDATEFLEXIVAL, {
					val: data
				});
			}
		});
	},

	unsubFlex({
		commit
	}) {
		detailPush.unsub({
			topic: 'flexibleBet^status',
			pushType: 'GROUP'
		});
	},

	/*
	oddskey & flexibet
	 */
	getFlexConfig({
		commit
	}) {
		return new Promise((resolve, reject) => {
			fetch('/factsCenter/flexiblebet/getOddsKey', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode,
					orignData = ret.data || {};

				if (code === 10000) {
					commit(mutationTypes.UPDATEFLEXICONFIG, orignData || {});
				}
			})
			.catch(() => {});
		});
	}
};
