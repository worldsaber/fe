import { objType } from 'utils';
import dateFormat from 'kernel/js/dateFormat';

import { getScheduleDesc } from 'base/js/utils';
import { getBetStatus } from 'store/betslip/utils';

import { clearConfig } from './config';

export function clearData(data = {}, eventTopic = {}, marketTopic = {}) {
	const list = data.cashAbleBets || [];

	for (let i = 0, len = list.length; i < len; i++) {
		const item = list[i];

		clearBetData(item);
		clearSelectionInfo(item, eventTopic, marketTopic);
	}
}

export function calPotWin(potWin, stake, originStake) {
	if (potWin && originStake) {
		return (potWin * stake / originStake).toFixed(2);
	}
	return '';
}

export function updateBetDetail(bet = {}, originBet = {}, betId = '', eventTopic = {}, marketTopic = {}) {
	const selections = bet.selections || [];
	const oldSelections = originBet.selections || {};
	const chgSelections = {};

	let liveCount = 0;
	let unavailableCount = 0;

	clearBaseInfo(bet);

	for (let i = 0, len = selections.length; i < len; i++) {
		const sItem = selections[i],
			sKey = sItem.id,
			oldItem = oldSelections[sKey] || {};

		clearEventInfo(sItem);
		clearMarketInfo(sItem);
		const lockUpdate = clearOutcomeInfo(sItem);

		if ([3, 4, 5, 6].indexOf(sItem.eventInfo.status) !== -1) {
			sItem.marketInfo.status = 3;
		}

		if (sItem.isMarketBettable && oldItem.marketInfo.status !== 0) {
			sItem.marketInfo.status = 0;
		}

		sItem.outcomeInfo = Object.assign(oldItem.outcomeInfo, sItem.outcomeInfo, getBetStatus(sItem.marketInfo, sItem.outcomeInfo, null, false));
		sItem.eventInfo = Object.assign(oldItem.eventInfo, sItem.eventInfo);
		sItem.marketInfo = Object.assign(oldItem.marketInfo, sItem.marketInfo);

		liveCount += clearSelPeriodInfo(sItem);

		chgSelections[sKey] = sItem;

		if (!sItem.outcomeInfo.lockUpdate && !sItem.outcomeInfo.showOdds) {
			unavailableCount += 1;
		}

		updatePush(betId, sItem, marketTopic, eventTopic, lockUpdate, true);
	}

	bet.liveCount = liveCount;
	bet.unavailableCount = unavailableCount;

	delete bet.selections;

	bet.selections = chgSelections;

	bet.originOdds = calOdds(originBet.mutexList, chgSelections, originBet.banker, 'bOdds');

	return Object.assign(originBet, bet);
}

export function calOdds(list = [], selectionMap = {}, bankerList = [], key = 'odds') {
	const ret = [];
	let bankerOdds = 1;

	if (!list.length && !bankerList.length) {
		return ret;
	}

	let tmpOdds = 0;

	for (let i = 0, len = bankerList.length; i < len; i++) {
		const item = bankerList[i];

		const { outcomeInfo = {}} = selectionMap[item] || {};
		tmpOdds = outcomeInfo[key];
		tmpOdds = +tmpOdds;

		bankerOdds *= tmpOdds;

		tmpOdds = 0;
	}

	for (let i = 0, len = list.length; i < len; i++) {
		const comboItem = list[i];

		let tempOdds = 1;

		for (let j = 0, len2 = comboItem.length; j < len2; j++) {
			const betItem = comboItem[j];

			const { outcomeInfo = {}} = selectionMap[betItem] || {};
			tmpOdds = outcomeInfo[key];
			tmpOdds = +tmpOdds;

			tempOdds *= tmpOdds;

			tmpOdds = 0;
		}

		ret.push(tempOdds * bankerOdds);
	}

	return ret.length ? ret : bankerOdds ? [bankerOdds] : [];
}

export function calCoefficient(betInfo, cfg) {
	const { selections = {}, originOdds = [], mutexList = [], banker = [], combinationType = 0 } = betInfo || {};

	const curOdds = calOdds(mutexList, selections, banker, 'odds');

	let coefficient = 0;

	for (let i = 0, len = originOdds.length; i < len; i++) {
		const newOdds = curOdds[i],
			oldOdds = originOdds[i];

		coefficient += calComboCoefficient(oldOdds, newOdds, combinationType === 1, cfg);
	}

	if (originOdds.length > 1) {
		coefficient /= originOdds.length;
	}

	return coefficient.toFixed(8);
}

function clearBaseInfo(betData = {}) {
	if (!betData.isCashable && (+betData.status !== 0 || +betData.stake === 0)) {
		betData.isCashable = true;
	}

	if (betData.notCashableReason && !betData.notCashableReason.startsWith('*')) {
		betData.notCashableReason = '*' + betData.notCashableReason;
	}

	betData.hasCashouted = !!(betData.originStake - betData.stake);

	betData.bonus = +betData.bonus;

	betData.showPotWinnings = calPotWin(betData.potentialWinnings, betData.stake, betData.originStake);
	betData.showBetType = `${betData.orderType}${betData.betType ? '-' + betData.betType : ''}${betData.combinationNum > 1 ? '(x' + betData.combinationNum + ')' : ''}`;
}
function clearBetData(betData = {}) {
	const selections = betData.selections || [];

	clearBaseInfo(betData);

	const showSelection = [];
	const tempArr = [];
	let temp;

	for (let i = 0, len = selections.length; i < len; i++) {
		const item = selections[i],
			home = item.home,
			away = item.away;

		temp = `${home}___${away}`;

		if (tempArr.indexOf(temp) !== -1) {
			continue;
		}
		tempArr.push(temp);
		showSelection.push({
			home,
			away,
			key: item.id
		});
	}

	const selectionLen = showSelection.length;
	if (selectionLen === 4) {
		betData.showMores = 'and 1 other match';
	}

	if (selectionLen > 4) {
		betData.showMores = `and ${selectionLen - 3} other matches`;
	}

	betData.showSelection = showSelection.slice(0, 3);
	return betData;
}

function clearSelectionInfo(bet = {}, eventTopic = {}, marketTopic = {}) {
	const betId = bet.id || '',
		selections = bet.selections || [],
		sameGameMap = {},
		banker = [];

	let liveCount = 0;
	let unavailableCount = 0;
	const chgSelections = {},
		selOrder = [];

	for (let i = 0, len = selections.length; i < len; i++) {
		const sItem = selections[i];

		const sKey = sItem.id,
			eventId = sItem.eventId || '';

		selOrder.push(sKey);

		if (sItem.banker && banker.indexOf(sKey) === -1) {
			banker.push(sKey);
		}

		!sameGameMap[eventId] && (sameGameMap[eventId] = []);
		sameGameMap[eventId].push(sKey);

		clearEventInfo(sItem);
		clearMarketInfo(sItem);

		const lockUpdate = clearOutcomeInfo(sItem);

		sItem.outcomeInfo = Object.assign(sItem.outcomeInfo, getBetStatus(sItem.marketInfo, sItem.outcomeInfo, null, false));

		liveCount += clearSelPeriodInfo(sItem);

		chgSelections[sItem.id] = sItem;

		if (!sItem.outcomeInfo.lockUpdate && !sItem.outcomeInfo.showOdds) {
			unavailableCount += 1;
		}

		updatePush(betId, sItem, marketTopic, eventTopic, lockUpdate, false);
	}

	bet.liveCount = liveCount;
	bet.banker = banker;
	bet.unavailableCount = unavailableCount;

	delete bet.selections;

	bet.selections = chgSelections;
	bet.selOrder = selOrder;

	const comboList = getComboList(bet, sameGameMap);

	bet.mutexList = comboList;
	bet.sameGameMap = sameGameMap;
	bet.originOdds = calOdds(comboList, chgSelections, banker, 'bOdds');
}

function updatePush(betId = '', sItem = {}, marketTopic = {}, eventTopic = {}, lockUpdate = false, isUpdate = false) {
	let temp = '',
		baseTopic,
		topic;

	const sportId = (temp = sItem.sportId) && temp.replace(/\D/g, '') || -1,
		categoryId = (temp = sItem.categoryId) && temp.replace(/\D/g, '') || -1,
		marketId = sItem.marketId || -1,
		marketSpe = (temp = sItem.marketInfo) && temp.specifier || '',
		tournamentId = sItem.tournamentId || '',
		eventStatus = (temp = sItem.eventInfo) && +temp.status,
		eventId = sItem.eventId || '';

	if (sportId !== -1 && categoryId !== -1 && eventId && marketId !== -1 && tournamentId) {
		baseTopic = `${sportId}^${categoryId}^${tournamentId}^${eventId}`;
		topic = `${baseTopic}^1^${marketId}^${marketSpe || '~'}`;
	}

	if (!topic || !baseTopic) {
		return;
	}

	const selKey = `${betId}__${sItem.id}`;

	if (lockUpdate && !isUpdate) {
		return;
	}

	if (lockUpdate && isUpdate) {
		temp = marketTopic[topic] || [];
		temp = temp.indexOf(selKey);
		(temp !== -1) && (marketTopic[topic].splice(temp, 1));

		temp = eventTopic[baseTopic] || [];
		temp = temp.indexOf(selKey);
		(temp !== -1) && (eventTopic[baseTopic].splice(temp, 1));
		return;
	}

	if (eventStatus !== 1 && eventStatus !== 2) {
		return;
	}

	!marketTopic[topic] && (marketTopic[topic] = []);
	!marketTopic[topic].includes(selKey) && (marketTopic[topic].push(selKey));

	!eventTopic[baseTopic] && (eventTopic[baseTopic] = []);
	!eventTopic[baseTopic].includes(selKey) && (eventTopic[baseTopic].push(selKey));
}

function clearEventInfo(selItem = {}) {
	const eventCfg = clearConfig.event || {},
		eventKeys = eventCfg.originKey || [],
		renameKeys = eventCfg.chgKeys || {};

	selItem.eventInfo = {};

	for (let i = 0, len = eventKeys.length; i < len; i++) {
		const item = eventKeys[i];

		if (objType(selItem[item]) !== 'undefined') {
			selItem.eventInfo[renameKeys[item] || item] = selItem[item];
			delete selItem[item];
		}
	}

	if ([3, 4, 5, 6].indexOf(selItem.eventInfo.status) !== -1) {
		selItem.isFinish = true;
	}
}

function clearMarketInfo(selItem = {}) {
	const marketCfg = clearConfig.market || {},
		marketKeys = marketCfg.originKey || [],
		renameKeys = marketCfg.chgKeys || {};

	selItem.marketInfo = {};

	for (let i = 0, len = marketKeys.length; i < len; i++) {
		const item = marketKeys[i];

		if (objType(selItem[item]) !== 'undefined') {
			selItem.marketInfo[renameKeys[item] || item] = selItem[item];
			delete selItem[item];
		}
	}

	const eventInfo = selItem.eventInfo || {};

	if ([3, 4, 5, 6].indexOf(+eventInfo.status) !== -1) {
		selItem.marketInfo.status = 3;
	}
}

function clearOutcomeInfo(selItem = {}) {
	const outcomeCfg = clearConfig.odds || {},
		outcomeKeys = outcomeCfg.originKey || [],
		renameKeys = outcomeCfg.chgKeys || {};

	selItem.outcomeInfo = {};

	const oldOdss = selItem.odds,
		newOdds = selItem.currentOdds;

	const tempOdds = fixOdds(oldOdss, newOdds, selItem.status);

	selItem.odds = tempOdds.odds;
	selItem.currentOdds = tempOdds.currentOdds;
	selItem.outcomeInfo.ogOdds = tempOdds.ogOdds;

	tempOdds.lockUpdate && (selItem.outcomeInfo.lockUpdate = true);

	for (let i = 0, len = outcomeKeys.length; i < len; i++) {
		const item = outcomeKeys[i];

		if (item === 'isOutcomeActive') {
			selItem.outcomeInfo.isActive = selItem.isOutcomeActive || selItem.isOutComeBettable ? 1 : 0;
			delete selItem.isOutcomeActive;
		} else if (objType(selItem[item]) !== 'undefined') {
			selItem.outcomeInfo[renameKeys[item] || item] = selItem[item];
			delete selItem[item];
		}
	}

	return tempOdds.lockUpdate;
}

function fixOdds(oldOdss, newOdds, status) {
	switch (status) {
	case 1:
		return {
			odds: oldOdss,
			ogOdds: oldOdss,
			currentOdds: 1,
			lockUpdate: true
		};
	case 2:
		return {
			odds: 0,
			ogOdds: oldOdss,
			currentOdds: 1,
			lockUpdate: true
		};
	case 3:
	case 4:
		return {
			odds: 1,
			ogOdds: oldOdss,
			currentOdds: 1,
			lockUpdate: true
		};
	default:
		return {
			odds: oldOdss,
			ogOdds: oldOdss,
			currentOdds: newOdds
		};
	}
}

export function clearSelPeriodInfo(selItem = {}) {
	const eventInfo = selItem.eventInfo || {},
		eventStatus = eventInfo.status;

	const result = getSelectionStatusDesc(selItem.status);
	selItem.showResult = result === 'Ongoing' && (eventStatus === 0 || eventStatus === 7) ?
		'Not Start' : result;

	const sportId = selItem.sportId.replace(/\D/g, '');
	selItem.showPeriod = [1, 2].includes(+eventStatus) ?
		getScheduleDesc(eventInfo, sportId, false) :
		eventInfo.estimateStartTime && dateFormat.format(eventInfo.estimateStartTime, 'DD/MM HH:mm') || '';

	if ([1, 2].includes(+eventStatus)) {
		selItem.isLiveEvent = true;
	}

	return selItem.isLiveEvent ? 1 : 0;
}

function getComboList(bet = {}, sameGameMap = {}) {
	const selections = bet.selections || {},
		bankerList = bet.banker || [];

	const mutexList = getMutexList(Object.keys(selections), sameGameMap, bankerList);

	const list = [];

	for (const eventkey of Object.keys(mutexList)) {
		list.push(mutexList[eventkey]);
	}

	const count = bet.combinationType - bet.banker.length;
	if (count) {
		const comboList = CR2(list, [count]);

		return comboList[count];
	}

	return [];
}

function getMutexList(checkedList = [], sameGameMap = {}, bankerList = []) {
	const ret = {};

	for (const gameKey of Object.keys(sameGameMap)) {
		const curGame = sameGameMap[gameKey];

		for (let i = 0, len = curGame.length; i < len; i++) {
			const item = curGame[i];

			if (!bankerList.includes(item)) {
				!ret[gameKey] && (ret[gameKey] = []);
				ret[gameKey].push(item);
			}
		}
	}

	return ret;
}

function getCombo(arr, num) {
	const result = [];
	const rec = function(arr, result, current, start, num) {
		let m,
			i,
			j;
		const l = arr.length - num;

		for (i = start; i <= l; i++) {
			for (j = 0; j < arr[i].length; j++) {
				m = current.slice(0);
				m.push(arr[i][j]);
				if (num === 1) {
					result.push(m);
				} else {
					rec(arr, result, m, i + 1, num - 1);
				}
			}
		}
	};

	rec(arr, result, [], 0, num || arr.length);
	return result;
}

function CR2(list, num) {
	const ret = {};

	if (!list || !Array.isArray(list) || !num) {
		return ret;
	}

	if (!Array.isArray(num)) {
		num = [num];
	}

	for (let i = 0, len = num.length; i < len; i++) {
		const item = num[i];
		ret[item] = getCombo(list, item);
	}

	return ret;
}

function calComboCoefficient(oldTotalOdds, newTotalOdds, isSigle, cfg) {
	const perc = oldTotalOdds / newTotalOdds;
	let ret = 0;

	if (perc <= 1) {
		ret = perc * cfg.C1;
	} else {
		ret = cfg.C1 + (perc - 1) * (isSigle ? cfg.C2 : cfg.C3);
	}
	return ret;
}

function getSelectionStatusDesc(status) {
	const statusDescMap = {
		0: 'Ongoing',
		1: 'Won',
		2: 'Lost',
		3: 'Void',
		4: 'Refund All'
	};
	return statusDescMap[status] || '';
}
