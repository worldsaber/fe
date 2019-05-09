import { isEmptyObject, objType } from 'utils';
import { LS } from 'storage';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent.js';

import * as mutationTypes from './mutationTypes';
import clearPushData from './clearPushData';
import getTopicInfo from './clearTopicInfo';
// import { getOddsChangeDesc } from './commonFun.js';

export default {
	/*
	update market group
	 */
	[mutationTypes.UPDATE_MARKETGROUP_LIST](state, groupList = []) {
		const originList = groupList || [];

		const clearList = [];
		for (const item of originList) {
			clearList.push(item.name);
		}

		if (clearList.length) {
			state.currentMarketGroup = clearList[0] || '';
		}

		state.marketGroup = [...clearList];
	},

	/*
	update currentMarketGroup
	 */
	[mutationTypes.UPDATE_MARKETGROUP](state, currentGroup) {
		currentGroup && (state.currentMarketGroup = currentGroup);
	},

	/*
	update selected list
	outcomeId、marketId
	 */
	[mutationTypes.UPDATE_SELECT_LIST](state, opt) {
		// 根据localstorage更新还原outcome选中状态
		if (opt && Array.isArray(opt) && state.currentEvent) {
			state.selectList.splice(0);

			for (const betslipsKey of opt) {
				state.selectList.push(betslipsKey);
			}

			return;
		}

		if (isEmptyObject(opt) && (!opt.marketId || !opt.outcomeId)) {
			return;
		}

		const selectList = state.selectList,
			key = `${state.currentSport}_${state.currentEvent}_${opt.marketId}_${opt.outcomeId}`,
			index = selectList.indexOf(key),
			checked = opt.checked;

		if (index !== -1 && !checked) {
			selectList.splice(index, 1);
		}

		if (index === -1 && checked) {
			selectList.push(key);
		}
	},

	/*
	store event detail
	 */
	[mutationTypes.GET_EVENT_DETAIL](state, eventData = {}) {
		if (isEmptyObject(eventData)) {
			// 以错误处理
			state.loadError = true;
			return;
		}

		const sport = eventData.sport || {},
			sportId = sport.id || '',
			marketList = eventData.markets || [];

		// 数据有问题
		if (!sportId) {
			// 以错误处理
			state.loadError = true;
			return;
		}

		// delete eventData.markets;
		delete eventData.sport;

		const eventInfo = Object.assign(
			{
				sportName: sport.name || '',
				sportId: sport.id || -1,
				categoryName: (temp = sport.category || {}) && temp.name || '',
				categoryId: temp.id || -1,
				tournamentName: (temp = temp.tournament || {}) && temp.name || '',
				tournamentId: temp.id || -1
			},
			eventData
		);
		state.eventInfo = { ...eventInfo };

		// 比赛已经结束, 不作为错误处理
		if (objType(eventData.status) !== 'undefined' && +eventData.status > 2) {
			state.eventFinished = true;
			!state.loadError && (state.loadError = false);

			// pre match下，比赛不可玩儿，提示，跳转到list页
			if (!state.isLive) {
				EventBus.$emit(commonEvent.UPDATE_EVENT_BETABLE, {
					type: 'dialog',
					msg: 'This game is no longer available'
				});
			}

			return;
		}

		if (!marketList.length) {
			// 以错误处理
			state.loadError = true;
			return;
		}

		// store eventId & sportID
		state.currentEvent = eventData.eventId;
		state.currentSport = sportId;

		// update priorityMarketKeys
		state.priorityMarketKeys = state.priorityMarketMap[sportId] || [];

		const key = `${sportId}_${eventData.eventId}`;

		// 为方便数据处理，event信息扁平化
		let temp = null;

		// 减少market和outcome操作次数
		const tempMarkets = [];
		const tempMarketKeys = [];
		const tempOutcomes = [];

		for (const market of marketList) {
			const outcomes = market.outcomes || [],
				marketKey = market.specifier ? `${key}_${market.id}?${market.specifier}` : `${key}_${market.id}`,
				marketInfo = {
					id: market.specifier ? `${market.id}?${market.specifier}` : `${market.id}`,
					desc: market.desc,
					group: market.group,
					status: market.status,
					product: market.product,
					specifier: market.specifier,
					marketId: market.id,
					marketGuide: market.marketGuide
				};

			tempMarkets.push(marketInfo);
			tempOutcomes.push(outcomes);
			tempMarketKeys.push(marketKey);
		}

		// 存储markets
		state.marketKeys = [...tempMarketKeys];
		state.marketInfo = [...tempMarkets];

		// 存储outcome
		state.outcomeKeys = [...tempMarketKeys];
		state.outcomeInfo = [...tempOutcomes];

		// 存储直播信息状态
		state.liveChannel = eventData.liveChannel;
	},

	/*
	update pack table list, store marketId
	 */
	[mutationTypes.UPDATE_TABLE_PACKEDLIST](state, packConfig = {}) {
		const userPackedList = state.userPackedList;
		const userUnpackedList = state.userUnpackedList;

		const packItem = packConfig.type,
			opened = packConfig.opened;

		// packItem has no value, reset packedList
		if (!packItem) {
			return;
		}

		const packedIndex = userPackedList.indexOf(packItem),
			unPackedIndex = userUnpackedList.indexOf(packItem);

		// 展开
		if (opened) {
			// 放入展开列表
			if (unPackedIndex === -1) {
				userUnpackedList.push(packItem);
			}

			// 从收起列表移除
			if (packedIndex !== -1) {
				userPackedList.splice(packedIndex, 1);
			}
		}

		// 收起
		if (!opened) {
			// 从展开列表移除
			if (unPackedIndex !== -1) {
				userUnpackedList.splice(unPackedIndex, 1);
			}

			// 放入收起列表
			if (packedIndex === -1) {
				userPackedList.push(packItem);
			}
		}
	},

	// update marketInfo according to push info
	[mutationTypes.UPDATE_MARKETINFO](state, marketInfo) {
		if (objType(marketInfo) === 'undefined') {
			return;
		}

		marketInfo = JSON.parse(marketInfo);
		if (!Array.isArray(marketInfo) || !marketInfo.length) {
			return;
		}

		const topicInfo = getTopicInfo(marketInfo[0], 'market'),
			eventKey = `sr:sport:${topicInfo.sportId}_${topicInfo.eventId}`,
			marketId = topicInfo.marketId,
			marketKeys = state.marketKeys,
			pushTime = marketInfo[marketInfo.length - 1],
			marketKey = `${eventKey}_${marketId}${topicInfo.marketSpecifiers ? '?' + topicInfo.marketSpecifiers : ''}`,
			updateMarketInfo = clearPushData(marketInfo, 'market'),
			index = marketKeys.indexOf(marketKey);

		// 之前存在，则更新数据
		if (index !== -1) {
			const currentMarket = state.marketInfo[index];
// console.log(`market status: origin marketInfo ----- ${currentMarket.desc}--${currentMarket.status}`);

			if (!currentMarket.pushTime ||
				currentMarket.pushTime < pushTime) {
				state.marketInfo.splice(index, 1, Object.assign(
					currentMarket,
					updateMarketInfo
				));
// console.log(`market status: update marketInfo ----- ${currentMarket.desc} -- ${currentMarket.status} -- ${currentMarket.group} -- ${currentMarket.id}`);
			}

			return;
		}

		// 之前不存在，则insert数据
		state.marketKeys.push(marketKey);
		state.marketInfo.push(Object.assign(
			updateMarketInfo,
			{
				marketId,
				specifier: topicInfo.marketSpecifiers,
				id: topicInfo.marketSpecifiers ? `${marketId}?${topicInfo.marketSpecifiers}` : `${marketId}`
			}
		));
// console.log(`market status: new marketInfo ${updateMarketInfo.desc} -- ${updateMarketInfo.status} -- ${updateMarketInfo.group} -- ${updateMarketInfo.id}`);
	},

	// update eventInfo according to push info
	[mutationTypes.UPDATE_EVENTINFO](state, eventInfo) {
		if (objType(eventInfo) === 'undefined') {
			return;
		}

		eventInfo = JSON.parse(eventInfo);
		if (isEmptyObject(eventInfo)) {
			return;
		}

		const pushTime = eventInfo[eventInfo.length - 1],
			pushEventInfo = clearPushData(eventInfo, 'event');
// console.log(`orign eventInfo-----${state.eventInfo.status}`);
// console.log(`push eventInfo-----${pushEventInfo.status}`);
// console.log(`origin eventInfo-----${state.eventInfo.playedSeconds}`);

		// pre match下，比赛不可玩儿，提示，跳转到list页
		if (pushEventInfo.status !== 0 && +state.eventInfo.status === 0 && !state.isLive) {
			EventBus.$emit(commonEvent.UPDATE_EVENT_BETABLE, {
				type: 'dialog',
				msg: 'This game is no longer available'
			});

			return;
		}

		// 没有接收过push消息或者push消息较之前的push消息新才跟新
		if (!state.eventInfo.pushTime ||
			state.eventInfo.pushTime < pushTime) {
			state.eventInfo = {
				...state.eventInfo,
				...{
					gameScore: pushEventInfo.gameScore,
					matchStatus: pushEventInfo.matchStatus,
					period: pushEventInfo.period,
					playedSeconds: pushEventInfo.playedSeconds,
					productStatus: pushEventInfo.productStatus,
					setScore: pushEventInfo.setScore,
					pointScore: pushEventInfo.pointScore,
					status: pushEventInfo.status,
				}
			};
		}
// console.log(`updateInfo eventInfo-----${state.eventInfo.playedSeconds}`);
		// 比赛结束
		if (+state.eventInfo.status > 2) {
			state.eventFinished = true;
		}

		// 12/28
		if (pushEventInfo.betStatus && [1, 2].includes(+pushEventInfo.betStatus)) {
			for (let i = 0, len = state.marketInfo.length; i < len; i++) {
				const metketItem = state.marketInfo[i];
				state.marketInfo.splice(i, 1, Object.assign(metketItem, {
					status: pushEventInfo.betStatus
				}));
			}
		}
	},

	// update outcomeInfo according to push info
	[mutationTypes.UPDATE_OUTCOMEINFO](state, outcomeInfo) {
		if (objType(outcomeInfo) === 'undefined') {
			return;
		}

		outcomeInfo = JSON.parse(outcomeInfo);
		if (!Array.isArray(outcomeInfo) || !outcomeInfo.length) {
			return;
		}

		const topicInfo = getTopicInfo(outcomeInfo[0], 'odds'),
			eventKey = `sr:sport:${topicInfo.sportId}_${topicInfo.eventId}`,
			marketId = topicInfo.marketId,
			outcomeKeys = state.outcomeKeys,
			outcomeKey = `${eventKey}_${marketId}${topicInfo.marketSpecifiers ? '?' + topicInfo.marketSpecifiers : ''}`,
			updateOutcomes = clearPushData(outcomeInfo, 'odds'),
			pushTime = outcomeInfo[outcomeInfo.length - 2],
			index = outcomeKeys.indexOf(outcomeKey),
			updateKeys = Object.keys(updateOutcomes);

		// 之前有对应的market选项，更新
		if (index !== -1) {
			const currentOutcomes = state.outcomeInfo[index];

			if (!state.outcomeUpdateTime[outcomeKey] || state.outcomeUpdateTime[outcomeKey] < pushTime) {
				// update outcomeInfo
				const alreayUpdateKeys = [];

				// outcome之前存在，更新
				currentOutcomes.forEach((outcome, index) => {
					if (updateKeys.includes(outcome.id)) {
						const updateItem = updateOutcomes[outcome.id];
							// statusDesc = getOddsChangeDesc(updateItem, outcome);
// console.log(`outcome odds: origin outcome----${outcomeKey}--{odds: ${currentOutcomes[index].odds}, isActive: ${currentOutcomes[index].isActive}}`);
						currentOutcomes.splice(index, 1, Object.assign(
							outcome,
							updateItem
							// {
							// 	statusDesc,
							// }
						));
// console.log(`outcome odds: update outcome----${outcomeKey}--{odds: ${currentOutcomes[index].odds}, isActive: ${currentOutcomes[index].isActive}}`);
						alreayUpdateKeys.push(outcome.id);
					}
				});

				// outcome之前没有
				if (updateKeys.length !== alreayUpdateKeys.length) {
					const diffKeys = updateKeys.filter(item => !alreayUpdateKeys.includes(item));

					for (const tempKey of diffKeys) {
// console.log(`outcome odds: new outcome----${outcomeKey}--{odds: ${updateOutcomes[tempKey].odds}, isActive: ${updateOutcomes[tempKey].isActive}}`);
						currentOutcomes.push(Object.assign(
							updateOutcomes[tempKey],
							{
								id: tempKey
							}
						));
					}
				}

				// 更新推送时间记录
				state.outcomeUpdateTime[outcomeKey] = pushTime;
			}
		} else {
			state.outcomeKeys.push(outcomeKey);
			const tempOutcome = [];

			for (const updateKey of updateKeys) {
				tempOutcome.push(Object.assign(
					updateOutcomes[updateKey],
					{
						id: updateKey
					}
				));
			}
// console.log(`outcome odds: new market outcomes----${outcomeKey}--${updateKeys}`);
			state.outcomeInfo.push(tempOutcome);

			// 更新推送时间记录
			state.outcomeUpdateTime[outcomeKey] = pushTime;
		}

		// update marketInfo
		const marketIndex = state.marketKeys.indexOf(outcomeKey),
			updateMarketInfo = clearPushData(outcomeInfo, 'market');
		if (marketIndex !== -1) {
			const currentMarket = state.marketInfo[marketIndex];
// console.log(`outcome odds: origin marketInfo -----${currentMarket.desc} -- ${currentMarket.status}`);
			if (!currentMarket.pushTime ||
				currentMarket.pushTime < pushTime) {
				state.marketInfo.splice(marketIndex, 1, Object.assign(
					currentMarket,
					updateMarketInfo
				));
			}
// console.log(`outcome odds: update marketInfo -----${currentMarket.desc} -- ${currentMarket.status} -- ${currentMarket.group}-- ${currentMarket.id}`);
		} else {
			// 之前不存在，则insert数据
			state.marketKeys.push(outcomeKey);
			state.marketInfo.push(Object.assign(
				updateMarketInfo,
				{
					marketId,
					specifier: topicInfo.marketSpecifiers,
					id: topicInfo.marketSpecifiers ? `${marketId}?${topicInfo.marketSpecifiers}` : `${marketId}`
				}
			));
// console.log(`outcome odds: new marketInfo ${updateMarketInfo.desc} -- ${updateMarketInfo.status} -- ${updateMarketInfo.group}-- ${updateMarketInfo.id}`);
		}
	},

	// reset all outcome checked status
	[mutationTypes.RESET_OUTCOMECHECKED_STATUS](state) {
		state.selectList.splice(0);
	},

	// set market priority (marketId包含specifier信息)
	[mutationTypes.SET_MARKET_PRIORITY](state, marketId) {
		if (marketId) {
			const priorityMarketKeys = state.priorityMarketKeys;
			const index = priorityMarketKeys.indexOf(marketId);

			if (index !== -1) {
				priorityMarketKeys.splice(index, 1);
			} else {
				priorityMarketKeys.unshift(marketId);
			}

			if (!priorityMarketKeys.length) {
				delete state.priorityMarketMap[state.currentSport];
			} else {
				state.priorityMarketMap[state.currentSport] = priorityMarketKeys;
			}

			const priorityKeys = Object.keys(state.priorityMarketMap);
			if (priorityKeys.length) {
				LS.set('priorityMarketKeys', JSON.stringify(state.priorityMarketMap));
			} else {
				LS.remove('priorityMarketKeys');
			}
		}
	},

	// update eventID
	[mutationTypes.RESET_DATA](state, opt) {
		// if (!isEmptyObject(opt)) {
		state.currentEvent = opt && opt.eventId || '';
		state.currentSport = opt && opt.sportId || '';

		// market group
		state.marketGroup = [];
		state.currentMarketGroup = '';

		state.eventInfo = {};

		// outcome
		state.outcomeInfo.splice(0);
		state.outcomeKeys.splice(0);
		state.outcomeUpdateTime = {};

		// market
		state.marketInfo.splice(0);
		state.marketKeys.splice(0);
		state.priorityMarketKeys.splice(0);

		// state.selectList.splice(0);
		state.userPackedList.splice(0);
		state.userUnpackedList.splice(0);
		state.autoPackedList.splice(0);

		state.loading = false;
		state.loadError = false;
		state.eventFinished = false;

		// Live
		state.liveChannel = false;
		state.liveChannelUrl = null;
		state.isProductOff = false;
		// }
	},

	[mutationTypes.UPDATEEVENTCOUNT](state, data = []) {
		let count = 0;
		for (const item of data) {
			item.eventSize && (count += +item.eventSize || 0);
		}
		state.eventCount = count;
	},

	// update loading
	[mutationTypes.UPDATEDETAILLOADING](state, loading = false) {
		state.loading = loading;
	},

	[mutationTypes.UPDATELOADERROR](state, isError = false) {
		state.loadError = isError;
	},

	[mutationTypes.UPDATEPRODUCTTYPE](state, isLive = false) {
		state.isLive = isLive;
	},

	// 获取直播流信息
	[mutationTypes.FETCH_LIVE_CHANNEL] (state, data) {
		state.liveChannelUrl = data;
	},

	[mutationTypes.UPDATEPRODUCTOFF] (state, opt) {
		let { status, isPush } = opt;

		if (isPush) {
			if (objType(status) === 'undefined') {
				return;
			}

			status = JSON.parse(status);
			if (!Array.isArray(status) || !status.length) {
				return;
			}

			status = +status[0];

			state.isProductOff = !!status;
		} else {
			state.isProductOff = status;
		}
	}
};
