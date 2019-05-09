import { isEmptyObject, formatNumber } from 'utils';
import { getStakeShowName, getStakeIndex } from 'config/stakeConfig';

/*
生成快照参数
 */
export function getRefreshParams(betslips = []) {
	const params = [];

	for (const item of betslips) {
		const marketInfo = item.marketInfo || {},
			outcomeInfo = item.outcomeInfo || {};
		if (item.eventId && marketInfo.marketId && outcomeInfo.id) {
			params.push({
				eventId: item.eventId,
				marketId: marketInfo.marketId,
				outcomeId: outcomeInfo.id,
				specifier: marketInfo.specifier || null
			});
		}
	}

	return params;
}

/*
获取share 参数
 */
export function getShareParams(betslip = []) {
	const selections = [];

	for (const item of betslip) {
		const marketInfo = item.marketInfo || {},
			outcomeInfo = item.outcomeInfo || {};

		if (item.eventId && marketInfo.marketId && outcomeInfo.id) {
			selections.push({
				eventId: item.eventId,
				marketId: marketInfo.marketId,
				specifier: marketInfo.specifier || null,
				outcomeId: outcomeInfo.id
			});
		}
	}

	return selections;
}

/*
获取生单数据
gameType: 真实体育还是虚拟体育
 */
export function getParams (gameType = 1, betslip = {}, betslipStake = {}, checkedCoupon = null, isFlexi = false, stakeUnion, CurrentPayMethods) {
	const type = betslip.currentType;

	const ret = {
		bizType: gameType,
		// currency: betslipStake.currency,
		ticket: {},
		orderType: getOrderTypes(betslip, isFlexi),
		paymentType: CurrentPayMethods
	};
	let selections = [];
	const bets = [];

	let checkedList = [],
		mutexList;
	switch (type) {
	case 'single': {
		checkedList = betslip.singleCheckedList || [];
		bets.push({
			selectedSystems: [1],
			stake: {
				value: betslipStake.singleStake * 10000
			}
		});
		break;
	}
	case 'multiple': {
		checkedList = betslip.multipleCheckedList || [];
		mutexList = getMutexList(betslip, checkedList) || {};

		const temp = {
			selectedSystems: [Object.keys(mutexList).length],
			stake: {
				value: betslipStake.multipleStake * 10000
			}
		};

		if (isFlexi) {
			temp.flexibleMinWinnings = [betslip.flexiSelect];
			temp.totalOdds = stakeUnion.length && stakeUnion[0].odds + '' || '0';
		}

		bets.push(temp);
		break;
	}
	case 'system': {
		checkedList = betslip.systemCheckedList || [];
		const systemStake = betslipStake.systemStake;
			// systemStakeKeys = Object.keys(systemStake);
		for (const stakeItem of stakeUnion) {
			const name = stakeItem.name;
			if (name !== 'union' && systemStake[name]) {
				bets.push({
					selectedSystems: [getStakeIndex(name)],
					stake: {
						value: systemStake[name] * 10000
					}
				});
			}
		}
		break;
	}
	default:
	}

	ret.subBizType = getBetType(betslip, checkedList);
	selections = getSlections(betslip, checkedList);

	if (!selections.length) {
		return;
	}

	const couponInfo = getCouponInfo(checkedCoupon);
	couponInfo && (ret.favor = couponInfo);

	ret.ticket = {
		selections,
		bets
	};

	isFlexi && (ret.oddsKey = betslip.oddsKey + '');

	return ret;
}

export function getOrderTypes(betslip, isFlexi) {
	const type = betslip.currentType;

	if (type === 'multiple' && isFlexi) {
		return 4;
	}

	return betslip.betType.indexOf(type) + 1;
}

/*
get stake count & odds
 */
export function getStakeInfo(betslip, bonus, bonusConf, betStake, isFlexi, flexiThreshold) {
	if (!betslip || isEmptyObject(betslip) || !betslip.isInit || isFlexi && betslip.isFlexiLocked) {
		return [];
	}

	if (!bonus) {
		bonus = {};
	}

	const mutexList = getMutexList(betslip),
		currentType = betslip.currentType;

	let ret = [],
		oddsInfo = null;

	switch (currentType) {
	case 'single':
		{
			if (!mutexList || !mutexList.length) {
				return [];
			}

			oddsInfo = getSingleOddsInfo(mutexList, betslip, bonus, bonusConf);
			ret = [Object.assign({
				name: 'Single',
				// stake: betStake.singleStake,
			}, oddsInfo)];
			break;
		}
	case 'multiple':
		{
			const mutexCounts = Object.keys(mutexList).length;

			if (!mutexCounts) {
				return [];
			}

			oddsInfo = isFlexi ?
				getFlexiOddsInfo(mutexList, betslip, flexiThreshold) :
				getMulOddsInfo(mutexList, betslip, bonus, bonusConf);
			ret = [Object.assign({
				name: 'Multiple',
				// stake: betStake.multipleStake
			}, oddsInfo)];
			break;
		}
	case 'system':
		ret = [...getSysOddsInfo(mutexList, betslip, betStake.systemStake, bonus, bonusConf)];
		break;
	default:
	}

	return ret;
}

/*
计算赔率， list每一项为排列组合的一项
 */
function calOdds(list = [], betslip = {}, calBanker = false) {
	const ret = [];
	let bankerOdds = 1;

	if (isEmptyObject(list)) {
		return ret;
	}

	const betslipsKeys = betslip.betslipsKeys || [],
		betslips = betslip.betslips || [];

	let temp = {},
		tmpOdds = 0;

	if (calBanker) {
		let bankerList = betslip.bankerStatus ? betslip.bankerList : [];

		bankerList = bankerList.filter(item => betslip.systemCheckedList.includes(item));

		for (const item of bankerList) {
			tmpOdds = temp[item];
			if (!tmpOdds) {
				const bankerIndex = betslipsKeys.indexOf(item);

				tmpOdds = (bankerIndex !== -1) && betslips[bankerIndex].outcomeInfo.odds || 0;
				temp[item] = +tmpOdds;
			}

			if (tmpOdds) {
				bankerOdds *= tmpOdds;
			}

			tmpOdds = 0;
		}
	}

	for (const comboItem of list) {
		let tempOdds = 1;

		for (const betItem of comboItem) {
			tmpOdds = temp[betItem];
			if (!tmpOdds) {
				const index = betslipsKeys.indexOf(betItem);

				tmpOdds = (index !== -1) && betslips[index].outcomeInfo.odds || 0;
				temp[betItem] = +tmpOdds;
			}

			if (tmpOdds) {
				tempOdds *= tmpOdds;
			}

			tmpOdds = 0;
		}
		ret.push(tempOdds * bankerOdds);
	}

	return ret.length ? ret : bankerOdds ? [bankerOdds] : [];
}

/*
计算概率
 */
function calP(list = [], betslip = {}) {
	const ret = [];

	if (isEmptyObject(list)) {
		return ret;
	}

	const betslipsKeys = betslip.betslipsKeys || [],
		betslips = betslip.betslips || [];

	let temp = {},
		tmpP = 0;

	for (const comboItem of list) {
		let tempProbability = 1;

		for (const betItem of comboItem) {
			tmpP = temp[betItem];

			if (!tmpP) {
				const index = betslipsKeys.indexOf(betItem);
				tmpP = (index !== -1) && betslips[index].outcomeInfo.probability || 0;

				temp[betItem] = +tmpP;
			}

			if (tmpP) {
				tempProbability *= tmpP;
			}

			tmpP = 0;
		}

		ret.push(tempProbability);
	}

	return ret;
}

function sortOdds(oddsList = []) {
	return oddsList.sort((a, b) => a - b);
}

function getBonusConf(list = [], betslip = {}, bonus = {}, calBanker = false) {
	const ret = [];
	let bankerBonusCount = 0;

	if ((!list.length && !calBanker) ||
		isEmptyObject(bonus) ||
		!bonus.oddsLimit) {
		return [0];
	}

	const betslipsKeys = betslip.betslipsKeys || [],
		betslips = betslip.betslips || [];

	if (calBanker) {
		let bankerList = betslip.bankerStatus ? betslip.bankerList : [];

		bankerList = bankerList.filter(item => betslip.systemCheckedList.includes(item));

		for (const item of bankerList) {
			const bankerIndex = betslipsKeys.indexOf(item),
				odds = (bankerIndex !== -1) && betslips[bankerIndex].outcomeInfo.odds || 0;
			if (odds >= bonus.oddsLimit) {
				++bankerBonusCount;
			}
		}
	}

	for (const comboItem of list) {
		let bonusCount = 0;

		for (const betItem of comboItem) {
			const index = betslipsKeys.indexOf(betItem),
				odds = (index !== -1) && betslips[index].outcomeInfo.odds || 0;
			if (odds >= bonus.oddsLimit) {
				++bonusCount;
			}
		}

		ret.push(bonusCount + bankerBonusCount);
	}

	return ret.length ? ret : bankerBonusCount ? [bankerBonusCount] : [];
}

function calBounsRatio(bonus = {}, oddsList = [], bounsConf = [], bonusConfig = {}) {
	if (!oddsList.length ||
		isEmptyObject(bonus) ||
		isEmptyObject(bonusConfig) ||
		!bounsConf.length) {
		return 0;
	}

	let ret = 0;

	for (let i = 0, len = oddsList.length; i < len; i++) {
		const bonusReq = bounsConf[i],
			ratio = bonusConfig[bonusReq] || 0;

		ret += ratio * oddsList[i];
	}

	return ret;
}

/*
get single odds info
 */
export function getSingleOddsInfo(mutexList, betslip, bonus = {}, bonusConfig = {}) {
	const tempArr = [];

	for (const betItem of mutexList) {
		tempArr.push([
			betItem
		]);
	}

	const outcomeMap = getOutcomeMap(mutexList, betslip);

	const oddsInfo = calSingleOdds(outcomeMap),
		sortedOdds = sortOdds([...oddsInfo]),
		oddsSum = getOddsSum(outcomeMap),
		odds = getSingleShowOdds(sortedOdds, oddsSum),
		bonusconf = getBonusConf(tempArr, betslip, bonus);

	return {
		count: mutexList.length || 0,
		odds,
		min: sortedOdds[0],
		sum: oddsSum,
		bonusRatio: calBounsRatio(bonus, oddsInfo, bonusconf, bonusConfig)
	};
}

/*
get multiple odds info
 */
export function getMulOddsInfo(mutexList, betslip, bonus = {}, bonusConfig = {}) {
	const eventKeys = Object.keys(mutexList),
		list = [];

	for (const eventkey of eventKeys) {
		list.push(mutexList[eventkey]);
	}

	window.__betslip__ && console.time('multiple');
	const num = eventKeys.length;
	const combineList = CR2(list, [num]);
	const oddsInfo = calOdds(combineList[num], betslip),
		sortedOdds = sortOdds([...oddsInfo]),
		odds = getShowOdds(sortedOdds),
		bonusconf = getBonusConf(combineList[num], betslip, bonus);

	window.__betslip__ && console.timeEnd('multiple');

	return {
		count: combineList[num].length,
		odds,
		min: sortedOdds[0],
		sum: sortedOdds.reduce((total, odds) => total += +odds, 0),
		bonusRatio: calBounsRatio(bonus, oddsInfo, bonusconf, bonusConfig)
	};
}

export function getFlexiOddsInfo(mutexList, betslip, flexiThreshold) {
	const eventKeys = Object.keys(mutexList),
		list = [];

	for (const eventkey of eventKeys) {
		list.push(...mutexList[eventkey]);
	}

	window.__betslip__ && console.time('flexibet');
	const num = eventKeys.length;

	let temp = calverageOdds(list, betslip, betslip.flexiSelect, num);

	const oddsKey = betslip.oddsKey || 0;

	// temp = temp ? oddsKey / temp : 0;
	temp = temp ? Math.pow(oddsKey, flexiThreshold) / temp : 0;

	window.__betslip__ && console.timeEnd('flexibet');
	return {
		count: 1,
		odds: getShowOdds([temp]),
		min: temp,
		sum: temp
	};
}

export function calverageOdds(list = [], betslip, min, max) {
	const tempList = [],
		num = [];

	let oddsMap = {},
		combineCountsMap = {},
		ret = 0;

	for (const item of list) {
		tempList.push([item]);
	}

	for (let i = min; i <= max; i++) {
		num.push(i);
	}

	const combineList = CR2(tempList, num);
	const combineKeys = Object.keys(combineList);

	combineKeys.sort((a, b) => a - b);

	for (const currentNum of combineKeys) {
		const oddsInfo = calP(combineList[currentNum], betslip, false),
			sum = oddsInfo.reduce((total, p) => total += +p, 0);

		oddsMap[currentNum] = sum;
	}

	// console.log('oddsMap');
	// console.table(oddsMap);

	let combMap = {},
		tempCombCount;
	for (let i = min; i <= max; i++) {
		for (let j = i; j <= max; j++) {
			!combineCountsMap[j] && (combineCountsMap[j] = 0);

			tempCombCount = combMap[`${j}_${i}`];
			if (!tempCombCount) {
				tempCombCount = calCombine(j, i);
				combMap[`${j}_${i}`] = tempCombCount;
				combMap[`${j}_${j - i}`] = tempCombCount;
			}
			combineCountsMap[j] += +(Math.pow(-1, (j - i)) * tempCombCount).toFixed(0);

			tempCombCount = 0;
		}
	}

	// console.log('combineCountsMap');
	// console.table(combineCountsMap);

	const comKeys = Object.keys(combineCountsMap);
	for (const item of comKeys) {
		ret += combineCountsMap[item] * oddsMap[item];
	}

	return ret;
}

function calCombine(n, m) {
	n = +n;
	m = +m;

	if (!n > 0 || !m > 0) {
		return 0;
	}

	let n1 = 1,
		n2 = 1;
	for (let i = n, j = 1; j <= m; n1 *= i--, n2 *= j++);
	return n1 / n2;
}

/*
get system odds info
 */
export function getSysOddsInfo(mutexList, betslip, stake, bonus = {}, bonusConfig = {}) {
	const ret = [];
	const eventKeys = Object.keys(mutexList),
		bankerList = betslip.bankerStatus ? betslip.bankerList : [],
		bankerCount = bankerList.filter(item => betslip.systemCheckedList.includes(item)).length;

	const list = [];
	const numList = [];

	eventKeys.forEach((eventkey, index) => {
		list.push(mutexList[eventkey]);
		numList.push(index + 1);
	});

	const combineList = CR2(list, numList),
		combineKeys = Object.keys(combineList);

	for (const currentNum of combineKeys) {
		const tempArr = [];

		if (currentNum === 1) {
			for (const betItem of combineList[currentNum]) {
				tempArr.push([
					betItem
				]);
			}
		}

		const oddsInfo = calOdds(currentNum === 1 ? tempArr : combineList[currentNum], betslip, true),
			name = getStakeShowName(+currentNum + bankerCount - 1),
			sortedOdds = sortOdds([...oddsInfo]),
			odds = getShowOdds(sortedOdds),
			bonusconf = getBonusConf(currentNum === 1 ? tempArr : combineList[currentNum], betslip, bonus, true);

		ret.push({
			name,
			// stake: stake[name] || 0,
			count: combineList[currentNum].length,
			odds,
			min: sortedOdds[0],
			sum: sortedOdds.reduce((total, odds) => total += +odds, 0),
			bonusRatio: calBounsRatio(bonus, oddsInfo, bonusconf, bonusConfig)
		});
	}

	if (bankerCount) {
		const tempName = getStakeShowName(bankerCount - 1),
			tempOddsInfo = calOdds([], betslip, true),
			tempOdds = getShowOdds(tempOddsInfo),
			tempBonusconf = getBonusConf([], betslip, bonus, true);

		ret.unshift({
			name: tempName,
			// stake: stake[tempName] || 0,
			count: 1,
			odds: tempOdds,
			min: tempOddsInfo[0],
			sum: tempOddsInfo[0],
			bonusRatio: calBounsRatio(bonus, tempOddsInfo, tempBonusconf, bonusConfig)
		});
	}

	return ret;
}

/*
get show odds
 */
function getShowOdds(oddsList = []) {
	if (!oddsList.length) {
		return '';
	}

	const min = oddsList[0],
		// max = oddsList[oddsList.length - 1],
		sum = oddsList.reduce((total, item) => total += +item, 0),
		// odds = min === max ? `${formatNumber(max, 2)}` : `${formatNumber(min, 2)} ~ ${formatNumber(max, 2)}`;
		odds = min === sum ? `${formatNumber(sum, 2)}` : `${formatNumber(min, 2)} ~ ${formatNumber(sum, 2)}`;

	return odds;
}

/*
return {
		eventId: [选中的key 列表]
	} 或者 【key】（single）
 */
export function getMutexList(betslip, list) {
	if (!betslip || isEmptyObject(betslip)) {
		return;
	}

	const type = betslip.currentType;
	const ret = {};
	let checkedList = list;

	if (!list) {
		switch (type) {
		case 'single':
			return betslip.singleCheckedList;
		case 'multiple':
			checkedList = betslip.multipleCheckedList;
			break;
		case 'system':
			checkedList = betslip.systemCheckedList;
			break;
		default:
		}
	}

	const gameKeys = Object.keys(betslip.sameGameMap);
	const bankerList = betslip.bankerStatus ? betslip.bankerList : [];

	for (const gameKey of gameKeys) {
		for (let i = 0, len = betslip.sameGameMap[gameKey].length; i < len; i++) {
			const item = betslip.sameGameMap[gameKey][i];
			if (checkedList.includes(item) &&
				(type === 'multiple' ||
					type === 'system' && !bankerList.includes(item))) {
				!ret[gameKey] && (ret[gameKey] = []);
				ret[gameKey].push(item);
			}
		}
	}

	return ret;
}

/*
组合算法
 */
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

	// console.time();
	if (!list || !Array.isArray(list) || !num) {
		return ret;
	}

	if (!Array.isArray(num)) {
		num = [num];
	}

	for (const item of num) {
		ret[item] = getCombo(list, item);
	}

	// console.timeEnd();
	return ret;
}

// function CR2(arr, num) {
// 	console.time();
// 	let r = {};
// 	for (const i of num) {
// 		r[i] = [];
// 	}
//
// 	(function f(t, a, n) {
// 		let m,
// 			l,
// 			i,
// 			j;
//
// 		if (n > 0) {
// 			for (i = 0; i < num.length; i++) {
// 				if (n === num[i]) {
// 					r[num[i]].push(t);
// 				}
// 			}
// 		}
// 		for (i = 0, l = a.length; i < l; i++) {
// 			for (j = 0; j < a[i].length; j++) {
// 				m = t.slice(0);
// 				m.push(a[i][j]);
// 				f(m, a.slice(i + 1), n + 1);
// 			}
// 		}
// 	})([], arr, 0);
// 	console.timeEnd();
// 	return r;
// }

/*
betslip 生单选项
 */
function getSlections(betslip = {}, checkedList = []) {
	const betslips = betslip.betslips || {},
		type = betslip.currentType,
		bankerList = betslip.bankerStatus ? betslip.bankerList : [];

	const selections = [];

	for (const item of betslips) {
		if (item.key && checkedList.includes(item.key)) {
			const marketInfo = item.marketInfo || {},
				outcomeInfo = item.outcomeInfo || {};

			if (item.eventId && marketInfo.marketId && outcomeInfo.id && item.sportId) {
				selections.push({
					eventId: item.eventId,
					id: `uof:${marketInfo.product}/${item.sportId}/${marketInfo.marketId}/${outcomeInfo.id}${marketInfo.specifier ? '?' + marketInfo.specifier : ''}`,
					odds: outcomeInfo.odds,
					banker: type === 'system' && bankerList.includes(item.key)
				});
			}
		}
	}

	return selections;
}

/*
判断selections中是否有livebetting
 */
function getBetType(betslip = {}, checkedList = []) {
	let hasLive = 0,
		hasPrematch = 0;

	for (const selection of checkedList) {
		const index = betslip.betslipsKeys.indexOf(selection);

		if (index !== -1) {
			const betItem = betslip.betslips[index],
				marketInfo = betItem.marketInfo || {};

			!hasLive && (hasLive = marketInfo.product === 1 ? 2 : 0);
			!hasPrematch && (hasPrematch = marketInfo.product === 3 ? 1 : 0);
		}
	}

	return hasLive + hasPrematch;
}

/*
红包生单参数
 */
function getCouponInfo(couponInfo) {
	if (!couponInfo) {
		return;
	}

	const { giftId } = couponInfo;
	return {
		favorInfo: [{
			giftId
		}]
	};
}
/*
	按marketId将所选outcome分组，目前仅用于single处理互斥outcome, 后期全面修改时替换成通用逻辑
*/
function getOutcomeMap(mutexList = [], betslip = {}) {
	const betslips = betslip.betslips || [];
	const betslipsKeys = betslip.betslipsKeys || [];
	const outcomeMap = {};
	let outcome,
		marketKey;

	mutexList.forEach(key => {
		const index = betslipsKeys.indexOf(key);
		if (index > -1) {
			outcome = betslips[index];
			marketKey = `${outcome.sportId}_${outcome.eventId}_${outcome.marketInfo.id}`;

			if (outcomeMap[marketKey]) {
				outcomeMap[marketKey].push(+outcome.outcomeInfo.odds);
			} else {
				outcomeMap[marketKey] = [+outcome.outcomeInfo.odds];
			}
		}
	});
	return outcomeMap;
}
/*
	处理single互斥outcome逻辑，后期multiple/system加互斥处理时可删除，使用通用处理
*/
function calSingleOdds(outcomeMap = {}) {
	const oddsList = [];
	Object.keys(outcomeMap).forEach(key => {
		outcomeMap[key].forEach(odds => {
			oddsList.push(odds);
		});
	});
	return oddsList;
}

function getOddsSum(outcomeMap = {}) {
	let sum = 0;
	Object.keys(outcomeMap).forEach(key => {
		const oddsList = outcomeMap[key];
		sum += oddsList.length === 1 ? oddsList[0] : getMaxOdds(oddsList);
	});
	return sum;
}

function getMaxOdds(oddsList = []) {
	let max = 0;
	oddsList.forEach(odds => {
		if (max < odds) {
			max = odds;
		}
	});
	return max;
}

function getSingleShowOdds(sortedOdds = [], sum = 0) {
	if (sortOdds.length === 0) {
		return '';
	}
	const min = sortedOdds[0],
		odds = min === sum ? `${formatNumber(sum, 2)}` : `${formatNumber(min, 2)} ~ ${formatNumber(sum, 2)}`;

	return odds;
}
