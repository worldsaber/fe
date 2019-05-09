import { isEmptyObject } from 'utils';
import { getSelectionInfo, getScore } from './commonFun';

/*
football: 35, 36, 37, 78, 79, 134, 184, 540, 541, 542, 543, 544, 545, 546, 547
basketball: 292
tennis:
rugby: 37、467
 */
const showType = {
	1: {
		B: [35, 36, 37, 78, 79, 134, 184, 540, 541, 542, 543, 544, 545, 546, 547]
	},
	2: {
		B: [292]
	},
	12: {
		B: [37, 467]
	}
};

function getShowType(marketID, sportId = '') {
	if (!sportId || !marketID) {
		return 'A';
	}

	sportId = sportId.replace(/\D/g, '');

	const currentSportConfig = showType[sportId] || {},
		showTypeKeys = Object.keys(currentSportConfig);

	for (const key of showTypeKeys) {
		if (currentSportConfig[key].includes(+marketID)) {
			return key;
		}
	}

	return 'A';
}

export default {
	/*
	获取当前event的数据, 根据currentGroup返回
	合并marketId一样的market
	 */
	getRenderList: (state, getters) => {
		const outcomeList = state.outcomeInfo,
			outcomeKeys = state.outcomeKeys,
			eventKey = `${state.currentSport}_${state.currentEvent}`,
			sportId = state.currentSport,
			packedList = [];

		let ret = [],
			prioritySet = [];

		for (let i = 0, len = outcomeKeys.length; i < len; i++) {
			const outcomeKey = outcomeKeys[i];

			if (!outcomeKey.startsWith(eventKey)) {
				continue;
			}

			if (!state.marketKeys.includes(outcomeKey)) {
				continue;
			}

			const marketIndex = state.marketKeys.indexOf(outcomeKey);
			const { id, desc, group, status, marketId, marketGuide, specifier } = state.marketInfo[marketIndex];
			const showType = getShowType(marketId, sportId);

			// 0: active, 1: suspened, 2: deactivated, 3: setted
			if (+status === 2 || +status === 3) {
				// state.marketKeys.splice(marketIndex, 1);
				// state.marketInfo.splice(marketIndex, 1);
				continue;
			}
			const currentGroup = state.currentMarketGroup;
			if (currentGroup && (currentGroup !== group && currentGroup !== 'All')) { // 增加All Tab
				continue;
			}

			// const outcomes = showType === 'B'
			// 	? outcomeList[i]
			// 	: (outcomeList[i] || []).filter(item => item.isActive && showType === 'A');
			const outcomes = outcomeList[i];

			if (window.__outcomeDebug__ && showType === 'A') {
				const idList = [];
				const tempOutcomes = (outcomeList[i] || []).filter(item => {
					if (item.isActive) {
						return true;
					}

					idList.push(item.desc);
					return false;
				});

				if (outcomes.length !== tempOutcomes.length) {
					window.__debug__ && console.table({ marketId: id, group, marketDesc: desc, 'locked outcomes': idList });
				}
			}

			// 跳过没有outcome的marekt
			if (!outcomes || !outcomes.length) {
				continue;
			}

			// A类型table，outcome数量超过4个，默认收起
			if (outcomes.length > 4 && showType === 'A') {
				packedList.push(id);
			}

			const marketData = {
				marketId: id,
				mid: marketId,
				desc,
				specifier,
				status,
				marketGuide,
				list: outcomes,
				showType
			};

			const index = state.priorityMarketKeys.indexOf(id);
			if (index !== -1) {
				prioritySet.push({
					index,
					data: marketData
				});
			} else {
				ret.push(marketData);
			}
		}

		// 如果packedList和autoPackedList不完全一样，更新autoPackedList
		let updatePackedList = false;
		for (const packedItem of packedList) {
			if (!state.autoPackedList.includes(packedItem)) {
				updatePackedList = true;
				break;
			}
		}

		// 更新自动展开table
		if (updatePackedList) {
			state.autoPackedList = [...packedList];
		}

		// sort
		prioritySet = prioritySet.sort((a, b) => a.index - b.index);
		prioritySet = prioritySet.map(item => item = item.data);

		// marketId优先，specifier按字母顺序排序
		ret = ret.sort((a, b) => +a.mid - +b.mid || (a.specifier > b.specifier ? 1 : a.specifier === b.specifier ? 0 : -1));

		// 删除没有market信息的outcome
		// for (const tempKey of outcomeKeys) {
		// 	const mdIndex = state.marketKeys.indexOf(tempKey);
		// 	if (mdIndex === -1) {
		// 		outcomeList.splice(mdIndex, 1);
		// 		outcomeKeys.splice(mdIndex, 1);
		// 	}
		// }

		return [...prioritySet, ...ret];
	},

	/*
	获取当前event选中的checklist
	 */
	currentCheckedList: (state, getters) => {
		const checkList = state.selectList || [],
			baseKey = `${state.currentSport}_${state.currentEvent}`;

		const ret = [];
		for (const selectItem of checkList) {
			if (selectItem.startsWith(baseKey)) {
				ret.push(selectItem.replace(`${baseKey}_`, ''));
			}
		}

		return ret;
	},
	/*
	get sportID
	 */
	getSportId: (state, getters) => state.currentSport,

	/*
	get eventID
	 */
	getEventId: (state, getters) => state.currentEvent,

	/*
	get current marketGroup
	 */
		// 从后台取到MarketGroup后，先去掉1 min. markes，然后判断event里的markets有没有1 min. markes，有就把它加到数组的第二个位置，没有就返回
	getMarketGroup: (state, getters) => {
		const markets = state.eventInfo.markets || [];
		const marketGroup = state.marketGroup.filter(item => item !== '1 Min. Markets') || [];
		const insertItem = state.marketGroup.filter(item => item === '1 Min. Markets');
		if (markets.length > 0 && insertItem[0]) {
			for (const item of markets) {
				if (item.group === '1 Min. Markets') {
					marketGroup.splice(1, 0, insertItem[0]);
					return marketGroup;
				}
			}
		}
		return marketGroup;
	},

	/*
	get packed table
	 */
	getPackMarket: (state, getters) => {
		const userPackedList = state.userPackedList || [],
			userUnpackedList = state.userUnpackedList || [];

		const ret = [...userPackedList];

		for (const packedItem of state.autoPackedList) {
			if (!ret.includes(packedItem) && !userUnpackedList.includes(packedItem)) {
				ret.push(packedItem);
			}
		}

		return ret;
	},

	/*
	get market detail info according to key
	key: sportId_eventId_marketId_specifier_outcomeId,
	 */
	getBetDetail: (state, getters) => opt => {
		if (isEmptyObject(opt)) {
			return [];
		}

		return getSelectionInfo(state, opt);
	},

	/*
	params: {marketId、outcomeId}
	return: ${sportId}_${eventId}_${opt.marketId}_${opt.outcomeId}
	 */
	getOutcomeKey: (state, getters) => opt => {
		if (!opt || !opt.marketId || !opt.outcomeId) {
			return '';
		}

		const eventId = state.currentEvent || '',
			sportId = state.currentSport || '';

		if (!eventId || !sportId) {
			return '';
		}

		return `${sportId}_${eventId}_${opt.marketId}_${opt.outcomeId}`;
	},

	/*
	反解outcomeKey中各部分，与getOutcomeKey互为逆操作
	return: sportId、eventId、opt.marketId、opt.outcomeId
	 */
	formatOutcomeKey: (state, getters) => key => {
		if (!key) {
			return;
		}

		const keySet = key.split('_');

		// 不是当前event detail页中的outcome，直接返回
		if (keySet[0] !== state.currentSport || keySet[1] !== state.currentEvent) {
			return;
		}

		return {
			sportId: keySet[0],
			eventId: keySet[1],
			marketId: keySet[2],
			outcomeId: keySet[3]
		};
	},

	/*
	outcome（push消息）的topic格式：#{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{marketId}^odds
	所有的sportId和categoryId都不需要sr:xxx:的前缀，所有的tournamentId和eventId都需要sr:xxx的前缀
	 */
	getOddsTopic: (state, getters) => marketId => {
		if (!marketId) {
			return '';
		}

		let sportId = state.currentSport || -1;

		const eventId = state.currentEvent || -1,
			eventInfo = state.eventInfo && {},
			tournamentId = eventInfo.tournamentId;

		let categoryId = eventInfo.categoryId;

		if (sportId === -1 || categoryId === -1 || tournamentId === -1 || eventId === -1) {
			return '';
		}

		sportId = sportId && sportId.replace(/\D/g, '') || '';
		categoryId = categoryId && categoryId.replace(/\D/g, '') || '';

		return `${state.currentSport}^${categoryId}^${tournamentId}^${eventId}^${marketId}^odds`;
	},

	getTeamNames: (state, getters) => {
		const eventInfo = state.eventInfo;
		return `${eventInfo.homeTeamName} vs ${eventInfo.awayTeamName}`;
	},

	getHomeSore: (state, getters) => getScore(state.eventInfo, 'home'),

	getAwaySore: (state, getters) => getScore(state.eventInfo, 'away'),

	getStartTime: (state, getters) => {
		const eventInfo = state.eventInfo || {};

		return eventInfo.estimateStartTime || '';
	},
};
