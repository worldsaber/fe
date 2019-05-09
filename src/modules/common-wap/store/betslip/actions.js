import detailPush from 'push/betPush';
// import { isEmptyObject } from 'utils';
import { getComplexAdConfig } from 'utils/getAdConfig';

import * as mutationTypes from './mutationTypes';

import { getRefreshParams, uniqOutcomes } from './utils';

import '../../../mockData/betslip/betslip?debug';

const topicList = [];
let topicCountsMap = {};

export default {
	// 添加到betslip
	addBetSlip({
		commit,
		state,
		getters
	}, params) {
		const betInfo = params.betInfo || {};
		// 增加相关key的push 订阅
		const sportId = betInfo.sportId && betInfo.sportId.replace(/\D/g, '') || -1,
			categoryId = betInfo.categoryId && betInfo.categoryId.replace(/\D/g, '') || -1,
			marketInfo = betInfo.marketInfo || {},
			tournamentId = betInfo.tournamentId || '',
			eventId = betInfo.eventId || '';

		let topic;

		if (sportId !== -1 && categoryId !== -1 && eventId && marketInfo.id && tournamentId) {
			topic = `${sportId}^${categoryId}^${tournamentId}^${eventId}^~^${marketInfo.marketId}^${marketInfo.specifier || '~'}`;
			betInfo.topic = topic;
		}
		// 已经存在或者数据不正确直接返回
		if (!params.key || getters.betslipsMap[params.key] >= 0) {
			return;
		}
		if (!topic) {
			return;
		}
		// 如果超过了最大值
		if (getters.betCount >= state.threshold) {
			commit(mutationTypes.UPDATE_REACH_MAX_THRESHOLD, true);
			return;
		}
		commit(mutationTypes.ADD_BETSLIP_ITEM, params);
		// single方式投注数量变化且selections可以成串时，自动切换到multiple
		if (getters.supportMultiple && state.currentType === 'single') {
			state.currentType = 'multiple';
		}
		if (!getters.supportSystem && state.currentType === 'system') {
			commit(mutationTypes.UPDATE_REACH_CHANGE_MAX_SYSTEM_THRESHOLD, true);
			if (getters.supportMultiple) {
				state.currentType = 'multiple';
			} else {
				state.currentType = 'single';
			}
		}
		// 不支持banker- 清除掉所有的banker
		if (!getters.supportBanker) {
			commit(mutationTypes.UPDATE_BANKERS);
		}
		if (!topicList.includes(topic)) {
			// market
			detailPush.sub({
				topic: `${topic}^status`,
				pushType: 'GROUP',
				listener: data => {
					// console.log(`add betslip---market---${data}`);
					commit(mutationTypes.UPDATE_BETSLIP_ITEM, {
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
					commit(mutationTypes.UPDATE_BETSLIP_ITEM, {
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
	},
	// 从betslip删除
	deleteBetSlip({
		commit,
		state,
		getters,
	}, key) {
		// 取消相关key的push 订阅
		const deleteItem = state.betslips.find(cur => cur.key === key) || {},
			topicKey = deleteItem.topic;
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
		commit(mutationTypes.DELETE_BETSLIP_ITEM, key);
		if (state.currentType === 'multiple' && !getters.supportMultiple) {
			state.currentType = 'single';
		}
		if (state.currentType === 'system' && !getters.supportSystem) {
			state.currentType = 'single';
		}
	},
	/*
	取消所有outcome的odds消息的订阅
	 */
	clearAllBetSlip({
		commit,
		state
	}) {
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

		// 清空topic列表
		topicList.splice(0);

		// 清除计数
		topicCountsMap = {};
		commit(mutationTypes.CLEAR_BETSLIP);
	},

	/*
	accept change, 取消unavailable outcome的消息订阅
	 */
	accpetChanges({
		commit,
		state,
		getters,
	}) {
		// 删除unavailable的推送
		commit(mutationTypes.ACCEPT_BETSLIP_CHANGES);
		if (!getters.supportMultiple && state.currentType === 'multiple') {
			commit(mutationTypes.UPDATE_BET_TYPE, 'single');
		}
	},
	/*
		重新订阅所有消息订阅消息
	 */
	subscription({
		state,
		commit
	}) {
		const betslips = state.betslips || [];

		for (const betItem of betslips) {
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
						commit(mutationTypes.UPDATE_BETSLIP_ITEM, {
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
						commit(mutationTypes.UPDATE_BETSLIP_ITEM, {
							pushData: data,
							type: 'odds'
						});
					}
				});
				topicList.push(betItem.topic);
				topicCountsMap[betItem.topic] = 1;
			}
		}
	},

	/*
	用快照刷新betslip
	 */
	refreshBetslip({
		commit,
		state,
		getters,
		dispatch
	}) {
		const betslips = state.betslips || [];
		if (!betslips.length) {
			return;
		}
		const params = getRefreshParams(betslips || []);
		const t = new Headers();
		t.append('Content-Type', 'application/json;charset=UTF-8');
		if (!params.length) {
			return;
		}
		fetch('/factsCenter/Outcomes', {
			method: 'POST',
			headers: t,
			body: JSON.stringify(params)
		})
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode;
			if (code === 10000) {
				commit(mutationTypes.UPDATE_BETSLIP, data.data || []);
				// 刷完快照如果支持 multiple，直接切换到multiple
				commit(mutationTypes.UPDATE_BET_TYPE, getters.supportMultiple ? 'multiple' : 'single');
				// 将缓存中加载的数据全部订阅
				dispatch('subscription');
			}
		})
		.catch(() => {
		});
	},
	/*
	bet code还原betslip列表
	 */
	loadBetslip({
		commit,
		getters,
		state
	}, params) {
		const shareCode = (params && params.betCode) || '';
		const defMsg = 'The code was not loaded successfully. Please try again.';
		if (!shareCode) {
			return Promise.reject();
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
					const outcomes = orignData.outcomes || [];
					// 数量超出限制时，先暂存，弹窗询问用户是否接受删除多余的比赛
					const result = uniqOutcomes(outcomes, state.betslips);
					if (state.betslips.length + result.length > state.threshold) {
						commit(mutationTypes.UPDATE_STAGE_BET_OUTCOMES, outcomes);
						commit(mutationTypes.UPDATE_IS_ACCEPT_MORE, true);
						return resolve();
					}
					commit(mutationTypes.LOAD_BETSLIP, outcomes);
					// 刷完快照如果支持 multiple，直接切换到multiple
					commit(mutationTypes.UPDATE_BET_TYPE, getters.supportMultiple ? 'multiple' : 'single');
					resolve();
				}
				reject(ret.message || defMsg);
			})
			.catch(e => reject(defMsg));
		});
	},

	verifyOddsBoost({
		commit
	}) {
		commit(mutationTypes.UPDATE_ODDS_BOOST_EVENTS, []);

		return new Promise((resolve, reject) => {
			fetch('/marketing/v1/activities/oddsBoost/getQualify', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				const { bizCode = 0, data = [] } = ret || {};

				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_ODDS_BOOST_PERMISSION, data.length && data[0] || {});
					commit(mutationTypes.UPDATE_ODDS_BOOST_EVENTS, data.length && data[0].details || []);
				}
			})
			.catch(e => {});
		});
	},

	// 获取广告位配置信息
	async fetchBeslipAds({ commit }) {
		// 异常处理统一由入口home处理
		try {
			const adData = await getComplexAdConfig([
				// booster 广告
				{ spotId: 'oddsBoostBetslip' }
			]);

			if (adData) {
				const data = adData.reduce((res, cur) => {
					if (cur.spotId && cur.ads) {
						res[cur.spotId] = cur.ads;
					}
					return res;
				}, {});
				commit(mutationTypes.FETCH_BESLIP_ADS, data);
				return data;
			}
			return Promise.reject();
		} catch (err) {
			console.log('err', err);
		}
	},
};
