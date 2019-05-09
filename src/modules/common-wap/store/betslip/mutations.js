import {
	isEmptyObject
} from 'utils';
import {
	LS
} from 'storage';
import Vue from 'vue';
import clearPushData from 'components/eventUtil/clearPushData';
import getTopicInfo from 'components/eventUtil/clearTopicInfo';
import { colorLump } from 'config/betslip/stakeConfig';
import * as mutationTypes from './mutationTypes';
import {
	getBetStatus,
	getValidOutComes
} from './utils';

// 删除outcomes的时候更新 eventSizeMap, colorEventOrder colors
function delEvt (state, eventId, key) {
	if (state.eventSizeMap[eventId] && state.eventSizeMap[eventId].length) {
		const i = state.eventSizeMap[eventId].indexOf(key);
		if (i > -1) {
			state.eventSizeMap[eventId].splice(i, 1);
		}
	}
	if (!state.eventSizeMap[eventId] || state.eventSizeMap[eventId].length <= 1) {
		const i = state.colorEventOrder.indexOf(eventId);
		if (i > -1) {
			state.colorEventOrder.splice(i, 1);
			// 全部删光，重置颜色
			if (!state.colorEventOrder.length) {
				state.colors = colorLump.slice(0);
			} else {
				// 如果删除了这个元素，先将这个颜色放到后排 -- 为了保证每次更新，颜色不乱变
				const color = state.colors.splice(i, 1);
				state.colors.push(color);
			}
		}
	}
	const index = state.changeOutcomes.indexOf(key);
	// 更新change
	if (index > -1) {
		state.changeOutcomes.splice(index, 1);
	}
	// 更新banker
	if (state.bankerMap[key]) {
		Vue.delete(state.bankerMap, key);
	}
}

export default {
	// 删除一个选中的投注项
	[mutationTypes.DELETE_BETSLIP_ITEM](state, key) {
		if (!key) {
			return;
		}
		const index = state.betslips.findIndex(bet => key === bet.key);
		if (index !== -1) {
			let originMulCount;
			if (state.multipleMode === 2) { // flexibet
				state.isFlexiLocked = true;// N变化不触发stake计算
				originMulCount = getValidOutComes(state.betslips).length;
			}
			const deleteItem = state.betslips[index];
			const eventId = deleteItem.eventId;
			state.betslips.splice(index, 1);
			LS.set('wapBetslips', JSON.stringify(state.betslips));
			delEvt(state, eventId, key);
			// 有变化的比赛都被删除了
			if (!state.changeOutcomes.length) {
				state.acceptStatus = false;
			}

			if (state.isFlexiLocked && originMulCount === getValidOutComes(state.betslips).length) {
				state.isFlexiLocked = false;
			}
		}
	},

	// 增加一个投注项
	[mutationTypes.ADD_BETSLIP_ITEM](state, opt) {
		if (isEmptyObject(opt) || !opt.key || state.betslips.findIndex(bet => opt.key === bet.key) > -1) {
			return;
		}
		if (state.multipleMode === 2) { // flexibet
			state.isFlexiLocked = true;// N变化不触发stake计算
		}
		const betInfo = opt.betInfo || {},
			eventId = betInfo.eventId;
		const eventSizeMap = state.eventSizeMap;
		opt.betInfo.outcomeInfo = Object.assign(
			opt.betInfo.outcomeInfo, {
				statusDesc: '',
				showOdds: true
			}
		);
		state.betslips.push(Object.assign(
			opt.betInfo, {
				key: opt.key
			}
		));

		if (eventSizeMap[eventId]) {
			eventSizeMap[eventId].push(opt.key);
		} else {
			Vue.set(eventSizeMap, eventId, [opt.key]);
		}
		if (eventSizeMap[eventId] && eventSizeMap[eventId].length > 1 &&
			state.colorEventOrder.indexOf(eventId) === -1) {
			state.colorEventOrder.push(eventId);
		}
		LS.set('wapBetslips', JSON.stringify(state.betslips));
	},

	// 更新一个投注项（主要是status和odds), 包括过期的slip
	[mutationTypes.UPDATE_BETSLIP_ITEM](state, data) {
		let { pushData, type } = data;
		try {
			pushData = JSON.parse(pushData);
		} catch (e) { } // eslint-disable-line
		if (isEmptyObject(pushData) || !Array.isArray(pushData) || !pushData.length) {
			return;
		}

		let originMulCount;
		if (state.multipleMode === 2) {
			state.isFlexiLocked = true;
			originMulCount = getValidOutComes(state.betslips).length;
		}

		const pushMarketInfo = clearPushData(pushData, 'market');
		const topicInfo = getTopicInfo(pushData[0], 'market');
		let baseKey = `sr:sport:${topicInfo.sportId}_${topicInfo.eventId}_${topicInfo.marketId}`;
		baseKey += `${topicInfo.marketSpecifiers ? '?' + topicInfo.marketSpecifiers : ''}`;
		const changeOutcomes = state.changeOutcomes;
		let change = false;
		// 计算当前要更新的market
		const tempOutcomeKeys = [];
		if (type === 'market') {
			const tempKey = `${baseKey}_`;
			for (let i = 0, len = state.betslips.length; i < len; i++) {
				const item = state.betslips[i];
				const key = item.key;
				if (key && key.startsWith(tempKey)) {
					tempOutcomeKeys.push(key.replace(tempKey, ''));
				}
			}
		}
		// console.log(pushMarketInfo.status, tempOutcomeKeys);
		const pushOutcomeInfos = type === 'odds' ? clearPushData(pushData, 'odds') : {};
		const updateOutcomeKeys = type === 'odds' ? Object.keys(pushOutcomeInfos) : tempOutcomeKeys;

		for (const id of updateOutcomeKeys) {
			const pushOutcomeInfo = pushOutcomeInfos[id] || {};
			const key = `${baseKey}_${id}`;
			const index = state.betslips.findIndex(bet => key === bet.key);
			if (index !== -1) {
				const betItem = state.betslips[index];

				if (betItem.marketInfo.product < pushMarketInfo.product) {
					continue;
				}

				if (betItem.marketInfo.status === pushMarketInfo.status && type === 'market') {
					continue;
				}

				let outcomeInfo = {},
					marketInfo = {};
				const pushTime = type === 'market' ? pushData[pushData.length - 1] : pushData[pushData.length - 2];
				if (!betItem.pushTime || betItem.pushTime < pushTime) {
					const outcomeStatus = getBetStatus(pushMarketInfo, pushOutcomeInfo, betItem.outcomeInfo);
					outcomeInfo = {
						...betItem.outcomeInfo,
						...pushOutcomeInfo,
						...outcomeStatus
					};
					marketInfo = {
						...betItem.marketInfo,
						...pushMarketInfo,
					};
					//  不管有没有变化删除旧的- 如果没有statusDesc则从change中移除
					const i = changeOutcomes.indexOf(key);
					// 如果存在直接删除掉
					if (i > -1) {
						changeOutcomes.splice(i, 1);
					}
					// 有status表示发生了变化，否则就是没有变化
					if (outcomeStatus && outcomeStatus.statusDesc) {
						change = true;
						changeOutcomes.push(key);
					}
					if (changeOutcomes.length) {
						// 如果有推送消息，证明数据一定发生变化
						state.acceptStatus = true;
					} else {
						state.acceptStatus = false;
					}
					const res = Object.assign(
						betItem,
						{
							outcomeInfo,
							marketInfo,
							pushTime
						}
					);
					state.betslips.splice(index, 1, res);
				}
			}
		}
		change && LS.set('wapBetslips', JSON.stringify(state.betslips));

		const currentMulCount = getValidOutComes(state.betslips).length;
		if (state.isFlexiLocked && originMulCount === currentMulCount) {
			state.isFlexiLocked = false;
		}

		if (state.multipleMode === 2 && originMulCount > currentMulCount) {
			state.isFlexiAutoChg = true;
		}
	},

	/*
	accept changes
	 */
	[mutationTypes.ACCEPT_BETSLIP_CHANGES](state) {
		if (isEmptyObject(state.betslips)) {
			return;
		}
		const betslips = state.betslips;
		const result = betslips.filter(bet => {
			const statusDesc = bet.outcomeInfo.statusDesc;
			const status = statusDesc === 'unavailable';
			// 如果是 suspended不能删除，只能用户手动删除
			if (statusDesc !== 'suspended') {
				// 清空statusDesc
				bet.outcomeInfo.statusDesc = '';
				bet.outcomeInfo.showOdds = true;
			} else {
				// suspended需要删除胆码
				if (state.bankerMap[bet.key]) { // eslint-disable-line
					Vue.delete(state.bankerMap, bet.key);
				}
			}
			// 所有状态都删除
			// if (statusDesc === 'up' || statusDesc === 'down' || statusDesc === 'unavailable') {
			// }
			const index = state.changeOutcomes.indexOf(bet.key);
			// 更新change
			if (index > -1) {
				state.changeOutcomes.splice(index, 1);
			}
			// unavailable直接删除
			if (status) {
				const eventId = bet.eventId;
				const key = bet.key;
				// 这里面也会修改 chagneOutcomes，但是是按照id清除的，这里其他地方会用到
				delEvt(state, eventId, key);
			}
			// 删除所有unavailable的状态
			return !status;
		});
		state.acceptStatus = false;
		// 覆盖结果
		state.betslips = result;
		LS.set('wapBetslips', JSON.stringify(state.betslips));

		state.isFlexiAutoChg = false;
	},

	// clear all betslips
	[mutationTypes.CLEAR_BETSLIP](state) {
		state.betslips = [];
		// 更新色块
		state.colorEventOrder = [];
		// 更新sameGameMap
		state.eventSizeMap = {};
		// 重置默认玩法类型是single
		state.currentType = 'single';
		// 重置banker列表
		state.bankerMap = {};
		state.changeOutcomes = [];
		state.colors = colorLump.slice(0);
		state.acceptStatus = false;
		state.bankerStatus = false;

		state.isFlexiLocked = false;
		state.multipleMode = 1;
		state.isFlexiAutoChg = false;

		LS.set('wapBetslips', JSON.stringify(state.betslips));
	},

	// update type
	[mutationTypes.UPDATE_BET_TYPE](state, type) {
		if (state.betType.includes(type)) {
			state.currentType = type;
		}
	},
	/*
	update banker list, pass outcome's key
	 */
	[mutationTypes.UPDATE_BANKERS](state, key) {
		// 没有可以全部删除
		if (!key) {
			state.bankerMap = {};
			return;
		}
		const bankerMap = state.bankerMap;
		if (bankerMap[key]) {
			Vue.delete(bankerMap, key);
		} else {
			Vue.set(bankerMap, key, 1);
		}
	},

	/*
	用快照数据刷新betslip列表
	 */
	[mutationTypes.UPDATE_BETSLIP](state, list = []) {
		if (!list || !list.length) {
			return;
		}
		const betslips = state.betslips;
		for (const item of list) {
			const sport = item.sport || {},
				isFinish = [3, 4, 5, 6].includes(+item.status);

			let markets = item.markets || [];
			// marketid和specialfier相同，productid不同时，过滤掉为3的数据
			markets = markets.filter((marketItem, index, arr) => {
				if (arr.length === 1) {
					return true;
				}
				return marketItem.product === 1;
			});

			for (let marketItem of markets) {
				const outcomeList = marketItem.outcomes || [];

				const marketId = marketItem.specifier ? `${marketItem.id}?${marketItem.specifier}` : marketItem.id,
					baseKey = `${sport.id}_${item.eventId}_${marketId}`;

				delete marketItem.outcomes;

				for (let outcomeItem of outcomeList) {
					const key = `${baseKey}_${outcomeItem.id}`,
						index = betslips.findIndex(bet => key === bet.key);

					if (index !== -1) {
						const betItem = betslips[index] || {},
							tempMarket = betItem.marketInfo;

						marketItem = Object.assign(tempMarket, {
							status: isFinish ? 3 : marketItem.status,
							product: marketItem.product
						});

						const updateOutcome = {
							isActive: outcomeItem.isActive,
							odds: outcomeItem.odds,
							probability: outcomeItem.probability
						};

						const outcomeStatus = getBetStatus(marketItem, updateOutcome, betItem.outcomeInfo, true);
						outcomeItem = Object.assign(
							betItem.outcomeInfo,
							updateOutcome,
							outcomeStatus
						);

						betslips.splice(index, 1, Object.assign(betItem, {
							marketInfo: marketItem,
							outcomeInfo: outcomeItem,
							gameId: item.gameId,
							isFinish
						}));
						// 变化的加入 changeOutcomes
						if (outcomeStatus.statusDesc) {
							const index = state.changeOutcomes.indexOf(key);
							if (index === -1) {
								state.changeOutcomes.push(key);
							} else {
								// 将位置移动到最后一个
								state.changeOutcomes.splice(index, 1, key);
							}
						}
					}
				}
			}
			LS.set('wapBetslips', JSON.stringify(betslips));
			// 不可以投注，需要accept changes
			if (state.changeOutcomes.length) {
				state.acceptStatus = true;
			} else {
				state.acceptStatus = false;
			}
		}
	},
	// 修改loading状态
	[mutationTypes.CHANGE_LOADING_STATUS](state, status) {
		state.loading = status;
	},
	// banker的修改
	[mutationTypes.CHANGE_BANKER_STATUS](state, status) {
		state.bankerStatus = status;
	},
	// 使用bet code还原betslips
	[mutationTypes.LOAD_BETSLIP](state, betList = []) {
		const betslips = state.betslips;
		const eventSizeMap = state.eventSizeMap;
		for (const betItem of betList) {
			const sportInfo = betItem.sport || {},
				category = sportInfo.category || {},
				tournament = category.tournament || {},
				eventId = betItem.eventId,
				baseKey = `${sportInfo.id}_${eventId}`;
			let markets = betItem.markets || [];
			// marketid和specialfier相同，productid不同时，过滤掉为3的数据
			markets = markets.filter((marketItem, index, arr) => {
				if (arr.length === 1) {
					return true;
				}
				return marketItem.product === 1;
			});

			const sportId = sportInfo.id && sportInfo.id.replace(/\D/g, '') || -1,
				categoryId = category.id && category.id.replace(/\D/g, '') || -1,
				tournamentId = tournament.id || '';
			if (sportId === -1 || categoryId === -1 || !eventId || !tournamentId) {
				continue;
			}
			const eventInfo = {
				away: betItem.awayTeamName,
				categoryId: category.id,
				eventId,
				gameId: betItem.gameId,
				home: betItem.homeTeamName,
				sportId: sportInfo.id,
				sportName: sportInfo.name,
				tournamentId,
				isFinish: [3, 4, 5, 6].includes(+betItem.status)
			};

			for (const marketItem of markets) {
				const marketId = marketItem.specifier ?
						`${marketItem.id}?${marketItem.specifier}` :
						marketItem.id,
					outcomeList = marketItem.outcomes || [];
				delete marketItem.outcomes;
				const marketInfo = Object.assign(
					marketItem,
					{
						marketId: marketItem.id,
						id: marketId,
						status: eventInfo.isFinish ? 3 : marketItem.status
					}
				);
				for (const outcomeItem of outcomeList) {
					const key = `${baseKey}_${marketId}_${outcomeItem.id}`;
					const betIndex = betslips.findIndex(bet => key === bet.key);
					// 不可以从live变成prematch
					if (betIndex > -1) {
						const betItem = betslips[betIndex];
						if (betItem.marketInfo.product < marketInfo.product) {
							continue;
						}
					}
					const topic = `${sportId}^${categoryId}^${tournamentId}^${eventId}^~^${marketItem.id}^${marketItem.specifier || '~'}`;
					const outcomeStatus = getBetStatus(marketItem, outcomeItem, null, false);
					const outcomeInfo = Object.assign(
						outcomeItem,
						outcomeStatus
					);
					const item = Object.assign(
						eventInfo,
						{
							key,
							topic,
							marketInfo,
							outcomeInfo
						}
					);
					// 变化的加入 changeOutcomes
					if (outcomeStatus.statusDesc) {
						const index = state.changeOutcomes.indexOf(key);
						if (index === -1) {
							state.changeOutcomes.push(key);
						} else {
							// 将位置移动到最后一个
							state.changeOutcomes.splice(index, 1, key);
						}
					}
					// 已经存在替换
					if (betIndex > -1) {
						betslips.splice(betIndex, 1, item);
						continue;
					}
					// 超出长度不在插入
					if (betslips.length >= state.threshold) {
						continue;
					}
					betslips.push(item);
					// 不存在这场比赛
					if (betIndex === -1) {
						if (eventSizeMap[eventId]) {
							eventSizeMap[eventId].push(key);
						} else {
							Vue.set(eventSizeMap, eventId, [key]);
						}
						if (eventSizeMap[eventId] && eventSizeMap[eventId].length > 1 &&
							state.colorEventOrder.indexOf(eventId) === -1) {
							state.colorEventOrder.push(eventId);
						}
					}
				}
			}
		}
		LS.set('wapBetslips', JSON.stringify(betslips));
		// 不可以投注，需要accept changes
		if (state.changeOutcomes.length) {
			state.acceptStatus = true;
		} else {
			state.acceptStatus = false;
		}
	},
	[mutationTypes.UPDATE_REACH_MAX_THRESHOLD](state, res) {
		state.reachMaxThreshold = res;
	},
	[mutationTypes.UPDATE_REACH_CHANGE_MAX_SYSTEM_THRESHOLD](state, res) {
		state.reachChangeMaxSystemThreshold = res;
	},
	[mutationTypes.CHANGE_AUTO_ACCEPT_CHANGES](state, status) {
		state.autoAcceptChange = !!status;
	},
	[mutationTypes.UPDATE_IS_ACCEPT_MORE](state, status) {
		state.isAcceptMore = status;
	},
	[mutationTypes.UPDATE_STAGE_BET_OUTCOMES](state, res) {
		state.stageBetOutcomes = res;
	},

	[mutationTypes.UPDATE_FLEXIBET_NUM](state, num) {
		state.flexibetNum = num;
		state.isFlexiLocked = false; // n变化触发stake计算
	},
	[mutationTypes.UPDATE_MULTIPLE_MODE](state, val) {
		state.multipleMode = val;

		if (val === 1) {
			state.isFlexiLocked = false;
		}
	},
	[mutationTypes.UPDATE_FAST_MODE](state, val) {
		if (state.fastMode !== val) {
			state.fastMode = val;
			LS.set('wap_fast_betslip', val ? 1 : 0);
		}
	},
	[mutationTypes.UPDATE_PAY_MODE](state, val) {
		if (state.payMode !== val) {
			state.payMode = val;
			LS.set(`wap_${state.currentType}_tab_paymode`, val);
		}
	},
	[mutationTypes.UPDATE_ODDS_BOOST_STATUS](state, status) {
		state.usingOddsBoost = status;

		let boostStatus = LS.get('h5_odds_boost');

		if (boostStatus) {
			boostStatus = JSON.parse(boostStatus);

			LS.set('h5_odds_boost', JSON.stringify(Object.assign(boostStatus, {
				status
			})));
		}
	},
	[mutationTypes.UPDATE_ODDS_BOOST_PERMISSION](state, opt) {
		const { periodId = '' } = opt || {};

		if (!periodId) {
			return;
		}

		let boostStatus = LS.get('h5_odds_boost');

		if (boostStatus) {
			boostStatus = JSON.parse(boostStatus);

			const lastPeriodId = boostStatus.pId;

			if (periodId !== lastPeriodId) {
				state.usingOddsBoost = false;
				LS.set('h5_odds_boost', JSON.stringify({
					pId: periodId,
					status: false
				}));
			} else {
				state.usingOddsBoost = boostStatus.status;
			}
		} else {
			LS.set('h5_odds_boost', JSON.stringify({
				pId: periodId,
				status: false
			}));
		}
		state.oddsBoostStatus = !!periodId;
		state.boostPeriod = periodId;
	},
	[mutationTypes.UPDATE_ODDS_BOOST_EVENTS](state, list) {
		if (!list.length) {
			state.oddsBoostEvents = [];
			return;
		}

		for (let i = 0, len = list.length; i < len;) {
			const item = list[i];

			if (item.specifier && !item.marketId) {
				list.splice(i, 1);
				continue;
			}

			if (!item.sportId && !item.eventId && !item.tournamentId && !item.marketId && !item.productId) {
				list.splice(i, 1);
				continue;
			}

			++i;
		}

		if (!list.length) {
			return;
		}

		state.oddsBoostEvents = list;
	},
	[mutationTypes.FETCH_BESLIP_ADS](state, data) {
		state.betslipAds = data;
	}
};
