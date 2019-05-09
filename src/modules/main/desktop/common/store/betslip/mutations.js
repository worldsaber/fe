import { isEmptyObject, objType } from 'utils';
import { LS } from 'storage';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent.js';

import * as mutationTypes from './mutationTypes';
import clearPushData from '../eventDetail/clearPushData';
import getTopicInfo from '../eventDetail/clearTopicInfo';
import { getBetStatus } from './getbetStatus';
import { updateList, updateStatusList, checkBetItem } from './baseFun';

import { getMutexList } from '../betslipStake/commonFun';

export default {
	// 删除一个选中的投注项
	[mutationTypes.DELETE_BETSLIPS_ITEM](state, key) {
		if (!key) {
			return;
		}

		// 提交数据的过程中，不能操作选项
		if (state.betslipLoading) {
			return;
		}

		const index = state.betslipsKeys.indexOf(key);

		if (index !== -1) {
			// 记录初始值
			let originMulCount;
			if (state.multipleMode === 2) {
				state.isFlexiLocked = true;
				originMulCount = state.multipleCheckedList.length;
			}

			const deleteItem = state.betslips[index],
				deleteEventId = deleteItem.eventId;
			let mutexItemCount = -1;

			state.betslipsKeys.splice(index, 1);
			state.betslips.splice(index, 1);
			LS.set('betslips', JSON.stringify(state.betslips));

			// 更新sameGameMap对象
			if (deleteEventId) {
				const sameGameMapItem = state.sameGameMap[deleteEventId] || [];
				const tempIndex = sameGameMapItem.indexOf(key);
				(tempIndex !== -1) && sameGameMapItem.splice(tempIndex, 1);
				!sameGameMapItem.length && (delete state.sameGameMap[deleteEventId]);
				mutexItemCount = sameGameMapItem.length || 0;
			}

			const mutexList = getMutexList({
				sameGameMap: state.sameGameMap,
				currentType: 'multiple'
			}, state.betslipsKeys) || {};

			const mutexCounts = Object.keys(mutexList).length;

			if (mutexCounts === 1) {
				state.supportMultiple = false;
			}

			// 重置multiples tab是否可以切换
			if (state.currentType === 'multiple') {
				// multiple方式且outcome不可以成串时，自动切换到single，且更新singleCheckedList
				if (!state.supportMultiple) {
					state.singleCheckedList = [...state.multipleCheckedList];
					state.currentType = 'single';
				}
			}

			// system切到sigle
			if (state.betslipsKeys.length === 1 && state.currentType !== 'single') {
				state.currentType = 'single';
			}

			// 更新checklist
			updateList(key, state.singleCheckedList, 'delete');
			updateList(key, state.multipleCheckedList, 'delete');
			updateList(key, state.systemCheckedList, 'delete');

			// 更新选项的本地存储
			LS.set('betslipsSelections', JSON.stringify({
				single: state.singleCheckedList,
				multiple: state.multipleCheckedList,
				system: state.systemCheckedList
			}));

			// 超过15项，不在支持system
			if (state.betslipsKeys.length <= state.systemThreshold) {
				state.supportSystem = true;
			} else {
				state.supportSystem = false;
			}

			// 更新色块eventColorLump, 一组event中outcome的数量小于2， 不存在互斥组
			if (mutexItemCount !== -1 && mutexItemCount < 2) {
				const colorIndex = state.eventColorLump.indexOf(deleteEventId);
				(colorIndex !== -1) && state.eventColorLump.splice(colorIndex, 1);
			}

			// 更新状态列表suspendedKeys，unavailableKeys， changesKeys
			updateList(key, state.suspendedKeys, 'delete');
			updateList(key, state.unavailableKeys, 'delete');
			updateList(key, state.changesKeys, 'delete');

			// 更新bankerList
			updateList(key, state.bankerList, 'delete');
			LS.set('betslipsBankers', JSON.stringify(state.bankerList));

			// 重置投注状态，可以投注
			!state.suspendedKeys.length &&
				!state.unavailableKeys.length &&
				!state.changesKeys.length &&
				(state.acceptStatus = false);

			if (state.isFlexiLocked && originMulCount === state.multipleCheckedList.length) {
				state.isFlexiLocked = false;
			}
		}

		if (state.betslipsKeys.length < state.threshold) {
			state.betable = true;
		}
	},

	// 增加一个投注项
	[mutationTypes.ADD_BETSLIPS_ITEM](state, opt) {
		const key = opt && opt.key || '';

		if (!key) {
			return;
		}

		// 提交数据的过程中，不能操作选项
		if (state.betslipLoading) {
			return;
		}

		if (!state.betable) {
			EventBus.$emit(commonEvent.NOTIFY_REACH_TRESHOLD);
			return;
		}

		if (state.multipleMode === 2) {
			state.isFlexiLocked = true;
		}

		const index = state.betslipsKeys.indexOf(key),
			betInfo = opt.betInfo || {};

		betInfo.outcomeInfo = Object.assign(
			{
				...betInfo.outcomeInfo
			},
			{
				showOdds: true,
				statusDesc: ''
			}
		);

		// event 从prematch变成liveBetting，直接更新
		if (index !== -1) {
			state.betslips.splice(index, 1, betInfo);
			LS.set('betslips', JSON.stringify(state.betslips));

			return;
		}

		if (betInfo.topic) {
			state.betslipsKeys.push(key);
			state.betslips.push(Object.assign(
				betInfo,
				{
					key
				}
			));
		}

		LS.set('betslips', JSON.stringify(state.betslips));

		// selections默认选中
		updateList(key, state.singleCheckedList, 'add');
		updateList(key, state.multipleCheckedList, 'add');
		updateList(key, state.systemCheckedList, 'add');

		// 更新选项的本地存储
		LS.set('betslipsSelections', JSON.stringify({
			single: state.singleCheckedList,
			multiple: state.multipleCheckedList,
			system: state.systemCheckedList
		}));

		// 更新sameGameMap对象
		const sameGameMap = state.sameGameMap;
		let mutexItemCount = -1;

		const eventId = betInfo.eventId || '';

		if (eventId) {
			!sameGameMap[eventId] && (sameGameMap[eventId] = []);
			sameGameMap[eventId].push(key);
			mutexItemCount = sameGameMap[eventId].length || 0;
		}

		// 重置multiples tab是否可以切换
		const mutexList = getMutexList({
			sameGameMap: state.sameGameMap,
			currentType: 'multiple'
		}, state.betslipsKeys) || {};

		const mutexCounts = Object.keys(mutexList).length;

		if (mutexCounts > 1) {
			state.supportMultiple = true;
		}

		// single方式投注数量变化且outcomes可以成串时，自动切换到single，且更新singleCheckedList
		if (state.currentType === 'single' && state.supportMultiple) {
			state.currentType = 'multiple';
		}

		// 超过15项，不在支持system
		if (state.betslipsKeys.length <= state.systemThreshold) {
			state.supportSystem = true;
		} else {
			state.supportSystem = false;
		}

		if (state.currentType === 'system' && !state.supportSystem) {
			state.currentType = state.supportMultiple ? 'multiple' : 'single';
		}

		// 更新色块eventColorLump, 一组event中outcome的数量大于1且不存在对应的色块组时， 加入互斥组
		if (mutexItemCount === 2) {
			state.eventColorLump.push(eventId);
		}

		if (state.betslipsKeys.length === state.threshold) {
			state.betable = false;
		}

		// system下，不在支持banker时，清空banker列表
		if (state.betslipsKeys.length !== Object.keys(state.sameGameMap || {}).length &&
			state.currentType === 'system') {
			state.bankerList.splice(0);
			LS.set('betslipsBankers', JSON.stringify(state.bankerList));
		}
	},

	// 更新一个投注项（主要是status和odds), 包括过期的slip
	[mutationTypes.UPDATE_BETSLIPS_ITEM](state, data = {}) {
		let { pushData, type } = data;

		if (objType(pushData) === 'undefined') {
			return;
		}

		pushData = JSON.parse(pushData);
// console.table(pushData);
		if (isEmptyObject(pushData) ||
			(type !== 'betEvent' && (!Array.isArray(pushData) || !pushData.length))) {
			return;
		}

		// 记录初始值
		let originMulCount;
		if (state.multipleMode === 2) {
			state.isFlexiLocked = true;
			originMulCount = state.multipleCheckedList.length;
		}

		const betslipsKeys = state.betslipsKeys,
			betslips = state.betslips,
			suspendedKeys = state.suspendedKeys,
			changesKeys = state.changesKeys,
			sameGameMap = state.sameGameMap || {},
			unavailableKeys = state.unavailableKeys;

		let chgStatus = false;

		if (type === 'betEvent') {
			const pushEventInfo = clearPushData(pushData, 'betEvent'),
				eventTopicInfo = getTopicInfo(pushData.topic, 'event'),
				updateEvent = eventTopicInfo.eventId;

			if ([1, 2].includes(pushEventInfo.betStatus) || [3, 4, 5, 6].includes(pushEventInfo.status)) {
				if (window.__betEventDebug__) {
					console.table(pushEventInfo);
				}

				const tempMarketStatus = [3, 4, 5, 6].includes(pushEventInfo.status) ?
					3 :
					pushEventInfo.betStatus;

				for (const outcomeItem of (sameGameMap[updateEvent] || [])) {
					const betIndex = betslipsKeys.indexOf(outcomeItem);

					if (betIndex !== -1) {
						const currentBet = betslips[betIndex] || {},
							updateMarket = Object.assign(currentBet.marketInfo, {
								status: tempMarketStatus
							}),
							status4outcome = getBetStatus(updateMarket, null, null, false),
							updateOutcomeInfo = Object.assign(
								currentBet.outcomeInfo,
								status4outcome
							);

						chgStatus = updateStatusList({
							key: currentBet.key,
							statusInfo: status4outcome,
							changesKeys,
							suspendedKeys,
							unavailableKeys
						});

						if (window.__betEventDebug__) {
							console.table({
								marketStaus: updateMarket.status,
								outcomeStatus: updateOutcomeInfo.statusDesc,
								betStatus: pushEventInfo.betStatus,
								eventStatus: pushEventInfo.status
							});
						}

						state.betslips.splice(betIndex, Object.assign(
							currentBet,
							{
								outcomeInfo: updateOutcomeInfo,
								marketInfo: updateMarket,
								isFinish: [3, 4, 5, 6].includes(pushEventInfo.status)
							}
						));
					}
				}

				LS.set('betslips', JSON.stringify(state.betslips));
			}
		} else {
			const pushMarketInfo = clearPushData(pushData, 'market'),
				topicInfo = getTopicInfo(pushData[0], 'market'),
				baseKey = `sr:sport:${topicInfo.sportId}_${topicInfo.eventId}_${topicInfo.marketId}${topicInfo.marketSpecifiers ? '?' + topicInfo.marketSpecifiers : ''}`;

			const tempOutcomeKeys = [];

			if (type === 'market') {
				const tempKey = `${baseKey}_`;

				for (let i = 0, len = betslipsKeys.length; i < len; i++) {
					const item = betslipsKeys[i];

					if (item && item.startsWith(tempKey)) {
						tempOutcomeKeys.push(item.replace(tempKey, ''));
					}
				}
			}

			const pushOutcomeInfo = type === 'odds' ? clearPushData(pushData, 'odds') : {},
				updateOutcomeKeys = type === 'odds' ? Object.keys(pushOutcomeInfo) : tempOutcomeKeys;

			for (const updateKey of updateOutcomeKeys) {
				const key = `${baseKey}_${updateKey}`,
					index = betslipsKeys.indexOf(key),
					pushItem = pushOutcomeInfo[updateKey] || {};

				if (index !== -1) {
					const betItem = betslips[index];

					// 如果之前是live的数据，现在是prematch的数据，直接跳过
					if (betItem.marketInfo.product < pushMarketInfo.product) {
						continue;
					}

					if (betItem.marketInfo.status === pushMarketInfo.status && type === 'market') {
						continue;
					}

// if (type === 'market') {
// 	console.log(`betslip --- market: {desc: ${betItem.marketInfo.desc}, originstatus: ${betItem.marketInfo.status}, updateStatus: ${pushMarketInfo.status}}`);
// }

					let tempOutcomeInfo = {},
						tempMarketInfo = {};

					const pushTime = type === 'market' ? pushData[pushData.length - 1] : pushData[pushData.length - 2];

					// 订阅的是outcome的数据，outcome更新，联动market更新, 同时更新suspendedKeys，unavailableKeys， changesKeys
					if (!betItem.pushTime || betItem.pushTime < pushTime) {
						const outcomeStatus = getBetStatus(pushMarketInfo, pushItem, betItem.outcomeInfo, type !== 'market');

// console.log(`betslip outcome --- originData: { desc: ${betItem.outcomeInfo.desc}, isActive: ${betItem.outcomeInfo.isActive}, odds: ${betItem.outcomeInfo.odds} }`);
						tempOutcomeInfo = Object.assign(
							betItem.outcomeInfo,
							pushItem,
							outcomeStatus
						);

						tempMarketInfo = Object.assign(
							betItem.marketInfo,
							pushMarketInfo
						);

						chgStatus = updateStatusList({
							key,
							statusInfo: outcomeStatus,
							changesKeys,
							suspendedKeys,
							unavailableKeys
						});

						state.betslips.splice(index, 1, Object.assign(
							betItem,
							{
								pushTime,
								outcomeInfo: tempOutcomeInfo,
								marketInfo: tempMarketInfo,
							}
						));
// console.log(`betslip outcome --- updateData: { desc: ${state.betslips[index].outcomeInfo.desc}, isActive: ${state.betslips[index].outcomeInfo.isActive}, odds: ${state.betslips[index].outcomeInfo.odds} }`);
						LS.set('betslips', JSON.stringify(state.betslips));
					}
				}
			}
		}

		// 变成suspended和unavailable的outcome，取消选中状态
		const disabledList = [...suspendedKeys, ...unavailableKeys];
		for (const suspendItem of disabledList) {
			updateList(suspendItem, state.singleCheckedList, 'delete');
			updateList(suspendItem, state.multipleCheckedList, 'delete');
			updateList(suspendItem, state.systemCheckedList, 'delete');

			// banker状态维护
			updateList(suspendItem, state.bankerList, 'delete');
		}

		// 更新选项的本地存储
		LS.set('betslipsSelections', JSON.stringify({
			single: state.singleCheckedList,
			multiple: state.multipleCheckedList,
			system: state.systemCheckedList
		}));

		// 更新banker本地存储
		LS.set('betslipsBankers', JSON.stringify(state.bankerList));

		// 重置投注状态
		if (chgStatus) {
			state.acceptStatus = true;
		}

		if (state.isFlexiLocked && originMulCount === state.multipleCheckedList.length) {
			state.isFlexiLocked = false;
		}

		if (state.multipleMode === 2 && originMulCount > state.multipleCheckedList.length) {
			state.isFlexiAutoChg = true;
		}
	},

	/*
	accept changes: 删除unavailableKeys中的项, changesKeys的清空
	 */
	[mutationTypes.ACCEPT_BETSLIPS_CHANGES](state) {
		if (isEmptyObject(state.betslips)) {
			return;
		}

		const betslips = state.betslips,
			betslipsKeys = state.betslipsKeys,
			changesKeys = state.changesKeys,
			unavailableKeys = state.unavailableKeys;

		const sameGameMap = state.sameGameMap || {};
		let betItem;

		for (const item of unavailableKeys) {
			const index = betslipsKeys.indexOf(item);

			if (index !== -1) {
				betItem = betslips[index];

				const deleteEventId = betItem.eventId;
				let mutexItemCount = -1;

				// 移除marketStatus为deactived和setted的选项
				betslipsKeys.splice(index, 1);
				betslips.splice(index, 1);

				// 更新sameGameMap
				if (deleteEventId) {
					const currentSameGame = sameGameMap[deleteEventId] || [];
					const tempIndex = currentSameGame.indexOf(item);

					(tempIndex !== -1) && currentSameGame.splice(tempIndex, 1);
					mutexItemCount = currentSameGame.length || 0;
					!mutexItemCount && (delete sameGameMap[deleteEventId]);
				}

				// 更新色块eventColorLump, 一组event中outcome的数量为小于2， 不存在互斥组
				if (mutexItemCount !== -1 && mutexItemCount < 2) {
					const colorIndex = state.eventColorLump.indexOf(deleteEventId);
					(colorIndex !== -1) && state.eventColorLump.splice(colorIndex, 1);
				}
			}
		}

		// 删除unavailableKeys中的项
		state.unavailableKeys.splice(0);

		// changesKeys中对应outcome状态还原
		for (const changItem of changesKeys) {
			const changeIndex = betslipsKeys.indexOf(changItem);

			if (changeIndex !== -1) {
				betItem = betslips[changeIndex];

				betItem = {
					...betItem,
					...Object.assign(
						betItem.outcomeInfo,
						{
							statusDesc: ''
						}
					)
				};
			}
		}

		// changesKeys清空
		state.changesKeys.splice(0);

		LS.set('betslips', JSON.stringify(betslips));

		if (!betslips.length) {
			state.currentType = 'single';
		}

		const mutexList = getMutexList({
			sameGameMap: state.sameGameMap,
			currentType: 'multiple'
		}, state.betslipsKeys) || {};

		const mutexCounts = Object.keys(mutexList).length;

		if (mutexCounts === 1) {
			state.supportMultiple = false;
		}

		// 重置multiples tab是否可以切换
		if (state.currentType === 'multiple') {
			// multiple方式且putcomes不可以成串时，自动切换到single，且更新singleCheckedList
			if (!state.supportMultiple) {
				state.singleCheckedList = [...state.multipleCheckedList];
				state.currentType = 'single';
			}
		}

		// system切到sigle
		if (state.betslipsKeys.length === 1 && state.currentType !== 'single') {
			state.currentType = 'single';
		}

		// 更新选项的本地存储
		LS.set('betslipsSelections', JSON.stringify({
			single: state.singleCheckedList,
			multiple: state.multipleCheckedList,
			system: state.systemCheckedList
		}));

		// 超过15项，不在支持system
		if (state.betslipsKeys.length <= state.systemThreshold) {
			state.supportSystem = true;
		} else {
			state.supportSystem = false;
		}

		// 重置投注状态，可以投注
		state.acceptStatus = false;

		if (state.betslipsKeys.length < state.threshold) {
			state.betable = true;
		} else {
			state.betable = false;
		}

		state.isFlexiAutoChg = false;
	},

	// clear all betslips
	[mutationTypes.CLEAR_BETSLIPS](state) {
		// 提交数据的过程中，不能操作选项
		if (state.betslipLoading) {
			return;
		}

		state.betslipsKeys.splice(0);
		state.betslips.splice(0);
		LS.remove('betslips');
		LS.remove('betslipsSelections');

		// 更新选中列表
		state.singleCheckedList.splice(0);
		state.multipleCheckedList.splice(0);
		state.systemCheckedList.splice(0);

		// 更新状态列表
		state.suspendedKeys.splice(0);
		state.unavailableKeys.splice(0);
		state.changesKeys.splice(0);

		// 更新色块
		state.eventColorLump.splice(0);

		// 更新sameGameMap
		state.sameGameMap = {};

		// 重置默认玩法类型是single
		state.currentType = 'single';

		state.bankerStatus = false;

		// 重置banker列表
		state.bankerList.splice(0);
		LS.remove('betslipsBankers');

		state.supportMultiple = false;
		state.supportSystem = true;

		state.flexiSelect = -1;
		state.isFlexiLocked = false;
		state.multipleMode = 1;
		state.isFlexiAutoChg = false;

		// 重置投注状态，可以投注
		state.acceptStatus = false;

		state.betable = true;

		state.payMethod = {
			single: 0,
			multiple: 0,
			system: 0
		};
	},

	// update type
	[mutationTypes.UPDATEBETTYPE](state, type) {
		if (state.betType.includes(type)) {
			state.currentType = type;
		}
	},

	// update bet item checke status
	[mutationTypes.UPDATECHECKSTATUS](state, opt) {
		// 提交数据的过程中，不能操作选项
		if (state.betslipLoading) {
			return;
		}

		if (objType(opt) === 'undefined' || isEmptyObject(opt)) {
			return;
		}

		if (state.multipleMode === 2) {
			state.isFlexiLocked = true;
		}

		let checkedList = [];
		switch (state.currentType) {
		case 'single':
			checkedList = state.singleCheckedList || [];
			break;
		case 'multiple':
			checkedList = state.multipleCheckedList || [];
			break;
		case 'system':
			checkedList = state.systemCheckedList || [];
			break;
		default:
		}

		const index = checkedList.indexOf(opt.key);
		if (index === -1 && opt.checked) {
			checkedList.push(opt.key);
		}

		if (index !== -1 && !opt.checked) {
			checkedList.splice(index, 1);

			// 更新banker
			if (state.currentType === 'system') {
				updateList(opt.key, state.bankerList, 'delete');
				LS.set('betslipsBankers', JSON.stringify(state.bankerList));
			}
		}

		// 更新选项的本地存储
		LS.set('betslipsSelections', JSON.stringify({
			single: state.singleCheckedList,
			multiple: state.multipleCheckedList,
			system: state.systemCheckedList
		}));
	},

	/*
	update banker list, pass outcome's key
	 */
	[mutationTypes.UPDATEBANKERS](state, key) {
		// 提交数据的过程中，不能操作选项
		if (state.betslipLoading) {
			return;
		}

		if (!key) {
			return;
		}

		const index = state.bankerList.indexOf(key);

		if (index === -1) {
			state.bankerList.push(key);

			// 自动选中
			if (!state.systemCheckedList.includes(key)) {
				state.systemCheckedList.push(key);

				// 更新选项的本地存储
				LS.set('betslipsSelections', JSON.stringify({
					single: state.singleCheckedList,
					multiple: state.multipleCheckedList,
					system: state.systemCheckedList
				}));
			}
		} else {
			state.bankerList.splice(index, 1);
		}

		// banker本地存储
		LS.set('betslipsBankers', JSON.stringify(state.bankerList));
	},

	/*
	update banker switch status
	 */
	[mutationTypes.UPDATEBANKERSTATUS](state, status = false) {
		state.bankerStatus = status;
	},

	/*
	用快照数据刷新betslip列表
	 */
	[mutationTypes.UPDATEBESLIPS](state, list = []) {
		if (!list || !list.length) {
			return;
		}

		const betslips = state.betslips;

		for (const item of list) {
			const sport = item.sport || {},
				// event的status是3, 4, 5, 6，比赛已经结束或者是无效比赛
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
						index = state.betslipsKeys.indexOf(key);

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

						const outcomeStatus = getBetStatus(marketItem, updateOutcome, betItem.outcomeInfo, false);
						outcomeItem = Object.assign(
							betItem.outcomeInfo,
							updateOutcome,
							outcomeStatus
						);

						betslips.splice(index, 1, Object.assign(betItem, {
							marketInfo: marketItem,
							outcomeInfo: outcomeItem,
							gameId: item.gameId,
							estimateStartTime: item.estimateStartTime,
							isFinish
						}));

						// 不在状态列表中加入，之前有，本次没有suspended和unavailable清除，odds升降的
						if (outcomeStatus.statusDesc) {
							updateStatusList({
								key,
								statusInfo: outcomeStatus,
								changesKeys: state.changesKeys,
								suspendedKeys: state.suspendedKeys,
								unavailableKeys: state.unavailableKeys
							});
						}

						// 更新checkList
						if (['suspended', 'unavailable'].includes(outcomeStatus.statusDesc)) {
							updateList(key, state.singleCheckedList, 'delete');
							updateList(key, state.multipleCheckedList, 'delete');
							updateList(key, state.systemCheckedList, 'delete');

							// banker状态维护
							updateList(key, state.bankerList, 'delete');
						}
					}
				}
			}

			LS.set('betslips', JSON.stringify(betslips));

			const betslipsKeys = state.betslipsKeys;
			let i = 0,
				len = 0,
				localItem;
			for (i = 0, len = state.singleCheckedList.length; i < len;) {
				localItem = state.singleCheckedList[i];
				if (!betslipsKeys.includes(localItem)) {
					state.singleCheckedList.splice(i, 1);
					--len;
				} else {
					++i;
				}
			}

			for (i = 0, len = state.multipleCheckedList.length; i < len;) {
				localItem = state.multipleCheckedList[i];
				if (!betslipsKeys.includes(localItem)) {
					state.multipleCheckedList.splice(i, 1);
					--len;
				} else {
					++i;
				}
			}

			for (i = 0, len = state.systemCheckedList.length; i < len;) {
				localItem = state.systemCheckedList[i];
				if (!betslipsKeys.includes(localItem)) {
					state.systemCheckedList.splice(i, 1);
					--len;
				} else {
					++i;
				}
			}

			// 更新选项的本地存储
			LS.set('betslipsSelections', JSON.stringify({
				single: state.singleCheckedList,
				multiple: state.multipleCheckedList,
				system: state.systemCheckedList
			}));

			for (i = 0, len = state.bankerList.length; i < len;) {
				localItem = state.bankerList[i];
				if (!betslipsKeys.includes(localItem)) {
					state.bankerList.splice(i, 1);
					--len;
				} else {
					++i;
				}
			}

			// 更新banker本地存储
			LS.set('betslipsBankers', JSON.stringify(state.bankerList));

			// 不可以投注，需要accept changes
			if (state.changesKeys.length || state.suspendedKeys.length || state.unavailableKeys.length) {
				state.acceptStatus = true;
			}
		}
	},

	// update betslipLoading
	[mutationTypes.UPDATEBETSLIPLOADING](state, loading = false) {
		state.betslipLoading = loading;
	},

	// update shareBetInfo
	[mutationTypes.UPDATEBETCODEINFO](state, betCodeInfo = {}) {
		if (objType(betCodeInfo) === 'object') {
			state.betCodeInfo = { ...betCodeInfo };
		} else {
			// url中share code存储
			state.betCodeInfo = {
				shareCode: betCodeInfo
			};
		}
	},

	// 使用bet code还原betslips
	[mutationTypes.LOADBETSLIPS](state, betList = []) {
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
				estimateStartTime: betItem.estimateStartTime,
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

					const actionsInfo = checkBetItem(
							state.betslipsKeys,
							state.betslips,
							{ key, product: marketItem.product }
						);

					if (actionsInfo.type === 'jmp') {
						continue;
					}

					const baseTopic = `${sportId}^${categoryId}^${tournamentId}^${eventId}`,
						topic = `${baseTopic}^~^${marketItem.id}^${marketItem.specifier || '~'}`;
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
							baseTopic,
							marketInfo,
							outcomeInfo
						}
					);

					// 不在状态列表中加入，之前有，本次没有suspended和unavailable清除，odds升降的
					if (outcomeStatus.statusDesc) {
						updateStatusList({
							key,
							statusInfo: outcomeStatus,
							changesKeys: state.changesKeys,
							suspendedKeys: state.suspendedKeys,
							unavailableKeys: state.unavailableKeys
						});
					}

					// 更新checkList
					if (['suspended', 'unavailable'].includes(outcomeStatus.statusDesc)) {
						updateList(key, state.singleCheckedList, 'delete');
						updateList(key, state.multipleCheckedList, 'delete');
						updateList(key, state.systemCheckedList, 'delete');

						// banker状态维护
						updateList(key, state.bankerList, 'delete');
					}

					if (actionsInfo.type === 'replace') {
						state.betslips.splice(actionsInfo.index, 1, item);
						continue;
					}

					if (state.betslipsKeys.length > state.threshold) {
						continue;
					}

					state.betslipsKeys.push(key);
					state.betslips.push(item);
					window.__debug__ && console.log(`bet code:   ${JSON.stringify(item)}`);

					if (!outcomeStatus.statusDesc) {
						updateList(key, state.singleCheckedList, 'add');
						updateList(key, state.multipleCheckedList, 'add');
						updateList(key, state.systemCheckedList, 'add');
					}
				}
			}
		}

		LS.set('betslips', JSON.stringify(state.betslips));

		// 更新选项的本地存储
		LS.set('betslipsSelections', JSON.stringify({
			single: state.singleCheckedList,
			multiple: state.multipleCheckedList,
			system: state.systemCheckedList
		}));

		// 由于gameId可能会重发，对投注项按照eventId归类, 同时恢复色块组
		const eventColorLump = [];
		const sameGameMap = (() => {
			const ret = {};

			(state.betslips || []).forEach(item => {
				const eventId = item.eventId;
				!ret[eventId] && (ret[eventId] = []);
				ret[eventId].push(item.key);
				if (!eventColorLump.includes(eventId) && ret[eventId].length >= 2) {
					eventColorLump.push(eventId);
				}
			});

			return ret;
		})();

		state.sameGameMap = sameGameMap;
		state.eventColorLump = eventColorLump;

		// 由于优先选择multiple，故type取multiple
		const supportMultiple = (() => {
			const mutexList = getMutexList({ sameGameMap, currentType: 'multiple' }, state.betslipsKeys) || {};
			const mutexCounts = Object.keys(mutexList).length;

			if (mutexCounts <= 1) {
				return false;
			}

			return true;
		})();
		state.supportMultiple = supportMultiple;

		state.currentType = supportMultiple ? 'multiple' : 'single';

		// 超过15项，不支持system
		state.supportSystem = state.betslipsKeys.length <= state.systemThreshold;

		// 达到30项
		state.betable = state.betslipsKeys.length < state.threshold;

		// 重置投注状态，可以投注
		if (state.suspendedKeys.length || state.unavailableKeys.length || state.changesKeys.length) {
			state.acceptStatus = true;
		} else {
			state.acceptStatus = false;
		}
	},

	[mutationTypes.UPDATEINITSTATE](state, isInit = false) {
		state.isInit = isInit;
	},

	[mutationTypes.UPDATEFLEXIVAL](state, opt) {
		let { val = -1 } = opt || {};

		if (objType(val) === 'undefined') {
			return;
		}

		val = JSON.parse(val);
		if (!Array.isArray(val) || !val.length) {
			return;
		}

		val = +val[0];

		state.flexiVal = val;
	},

	[mutationTypes.UPDATEFLEXISELECTOR](state, selected) {
		state.flexiSelect = selected;
		state.isFlexiLocked = false;
	},

	[mutationTypes.UPDATEFLEXICONFIG](state, val) {
		const { oddsKey = 0, status = -1 } = val || {};
		state.flexiVal = status;
		state.oddsKey = oddsKey;
	},
	[mutationTypes.UPDATEFLEXIFLOCKEDSTATUS](state, val) {
		state.isFlexiLocked = val;
	},
	[mutationTypes.UPDATEMULTIPLEMODE](state, val) {
		state.multipleMode = val;

		if (val === 1) {
			state.isFlexiLocked = false;
		}
	},
	[mutationTypes.UPDATEPAYMETHOD](state, method) {
		state.payMethod[state.currentType] = method;
	}
};
