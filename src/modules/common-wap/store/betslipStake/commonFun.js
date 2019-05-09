import { formatNumber } from 'utils';
import { getStakeShowName, getStakeIndex } from 'config/betslip/stakeConfig';
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
	* 获取生单数据
	* gameType: 真实体育还是虚拟体育  1真实体育, 2虚拟体育, 3JackPot
 */
export function getParams (gameType = 1, betslip = {}, rootGetters, betslipStake = {}, checkedCoupon) {
	const type = betslip.currentType;
	const useFlexibet = rootGetters['betslip/useFlexibet'];
	const ret = {
		bizType: gameType,
		// currency: betslipStake.currency,
		ticket: {},
		orderType: useFlexibet ? 4 : (betslip.betType.indexOf(type) + 1)
	};
	const betslipMap = rootGetters['betslip/betslipsMap'];
	const validEventSize = rootGetters['betslip/validEventSize'];
	const stakeUnion = rootGetters['betslipStake/stakeUnion'];
	const flexibetNum = betslip.flexibetNum;
	let payMode = betslip.payMode;
	let	selections = [];
	let bets = [];
	let totalStake = 0;
	switch (type) {
	case 'single': {
		const singleStake = betslipStake.singleStake || {};
		const isBoosting = rootGetters['betslip/isBoosting'];
		const boostCount = stakeUnion && stakeUnion[0] && stakeUnion[0].boostCount;
		let count = 0;

		bets = (betslip.betslips || []).reduce((all, current) => {
			let temp;
			if ((temp = current.outcomeInfo) && temp.showOdds) {   // eslint-disable-line
				totalStake += +singleStake[current.key];

				if (singleStake[current.key]) {
					all.push({
						selectedSystems: [1],
						stake: {
							value: singleStake[current.key] * 10000
						},
						selectionRefs: [{
							selectionIndex: count++
						}],
					});
				}
			}
			return all;
		}, []);

		if (isBoosting && boostCount) {
			ret.oddsKey = betslip.boostOddsKey;
			ret.oddsBoost = betslip.boostPeriod;
		}
		break;
	}
	case 'multiple': {
		const param = {
			selectedSystems: [validEventSize.size],
			stake: {
				value: betslipStake.multipleStake * 10000
			}
		};
		if (useFlexibet) {
			param.flexibleMinWinnings = [flexibetNum];
			param.totalOdds = '' + stakeUnion[0].sum.toFixed(2);
			ret.oddsKey = betslipStake.oddsKey;
		}
		bets.push(param);
		totalStake = stakeUnion[0].count * betslipStake.multipleStake;
		break;
	}
	case 'system': {
		bets = stakeUnion.reduce((all, current) => {
			totalStake += +current.stake * current.count;
			const res = {
				selectedSystems: [getStakeIndex(current.name)],
				stake: {
					value: current.stake * 10000
				}
			};
			if (res.stake.value) {
				all.push(res);
			}
			return all;
		}, []);
		payMode = 0; // system 不能使用coin
		break;
	}
	default:
	}

	ret.subBizType = getBetType(validEventSize, betslip, betslipMap);
	selections = getSlections(validEventSize, betslip, betslipMap, betslipStake);

	if (!selections.length) {
		return;
	}

	const couponInfo = getCouponInfo(checkedCoupon);
	couponInfo && (ret.favor = couponInfo);
	// 实际支付金额
	let actualPayAmount;
	if (checkedCoupon) {
		if (checkedCoupon.curBal >= totalStake) {
			actualPayAmount = 0;
		} else {
			actualPayAmount = totalStake * 10000 - checkedCoupon.originBal;
		}
	} else {
		actualPayAmount = totalStake * 10000;
	}

	ret.ticket = {
		selections,
		bets
	};
	ret.actualPayAmount = actualPayAmount;
	ret.paymentType = payMode;
	return ret;
}

/**
 * get stake count & odds
 * @param {Object} betslip  betslip的state
 * @param {Object} rootGetters 根getters
 * @return {Array} ret 表示每种选择情况如果是single或者multiple则返回单种情况
 */
function getStakeInfo (betslip, rootGetters, betslipStake) {
	// 当前可投注的outcome，按照eventId分组 betslip store中的getters的值
	const validEventSize = rootGetters['betslip/validEventSize'];
	const betslipMap = rootGetters['betslip/betslipsMap'];
	const useFlexibet = rootGetters['betslip/useFlexibet'];
	const isBoosting = rootGetters['betslip/isBoosting'];
	const boostBets = rootGetters['betslip/getBetBoostOdds'];
	let ret = [];
	if (!validEventSize || !validEventSize.size) {
		return ret;
	}
	if (useFlexibet && betslip.isFlexiLocked) {
		return ret;
	}
	const mutexObject = getMutexObject(betslip, validEventSize),
		currentType = betslip.currentType;
	let	oddsInfo = null;
	switch (currentType) {
	case 'single':
		{
			oddsInfo = getSingleOddsInfo(mutexObject, betslip, betslipMap, betslipStake, isBoosting, boostBets);
			if (oddsInfo) {
				ret = [Object.assign({
					name: 'Single',
				}, oddsInfo)];
			}
			break;
		}
	case 'multiple':
		{
			oddsInfo = useFlexibet ? getFlexibetMulOddsInfo(mutexObject, betslip, betslipMap, betslipStake) : getMulOddsInfo(mutexObject, betslip, betslipMap, betslipStake);
			if (oddsInfo) {
				ret = [Object.assign({
					name: 'Multiple',
				}, oddsInfo)];
			}
			break;
		}
	case 'system':
		ret = [...getSysOddsInfo(mutexObject, betslip, betslipMap, betslipStake)];
		break;
	default:
	}
	return ret;
}

/*
	get single odds info
 */
function getSingleOddsInfo(mutexObject, betslip, betslipMap, betslipStake, isBoosting, boostBets) {
	const oddsInfoMap = [];
	const bonus = [];
	const qualifyingOddsLimit = betslipStake.qualifyingOddsLimit;
	const bonusRatios = betslipStake.bonusRatios;

	const betslips = betslip.betslips || [];
	const outcomeMap = getOutcomeMap(mutexObject, betslips, betslipMap);
	const keys = Object.keys(outcomeMap);

	let singleCount = 0;
	let boostCount = 0;

	for (const key of keys) {
		const eventObj = outcomeMap[key];
		eventObj && Object.keys(eventObj).forEach(marketId => {// eslint-disable-line
			const outcomes = eventObj[marketId];
			if (outcomes && outcomes.length > 0) {
				const tempOddsInfoMap = getMaxOdds(outcomes, qualifyingOddsLimit, bonusRatios, isBoosting, boostBets);

				singleCount += tempOddsInfoMap.count;
				boostCount += tempOddsInfoMap.boostCount;
				oddsInfoMap.push(tempOddsInfoMap.oddsMap);
				bonus.push(tempOddsInfoMap.bonus);
			}
		});
	}

	return {
		count: singleCount,
		oddsInfoMap,
		bonus,
		boostCount
	};
}

/*
	get flexibet multiple odds info
*/
function getFlexibetMulOddsInfo(mutexObject, betslip, betslipMap, betslipStake) {
	const eventKeys = Object.keys(mutexObject);

	const list = [],
		num = [];
	const betslips = betslip.betslips || [];
	const min = betslip.flexibetNum,
		max = eventKeys.length;

	const probabilityMap = {};

	for (let i = min; i <= max; i++) {
		num.push(i);
	}

	betslips.forEach(slip => {
		if (eventKeys.indexOf(slip.eventId) > -1) {
			list.push([slip]);
			probabilityMap[slip.eventId] = slip.outcomeInfo.probability;
		}
	});
	const combineList = getCombo2(list, num);

	let probability = 0,
		temp = 1;
	/*eslint-disable*/
	Object.keys(combineList).forEach(key => {
		combineList[key].forEach(combine => {
			temp = 1;
			list.forEach(slip => {
				if (combine.indexOf(slip[0]) > -1) {
					temp *= slip[0].outcomeInfo.probability;
				} else {
					temp *= 1 - slip[0].outcomeInfo.probability;
				}
			});
			probability += temp;
		});
	});
	/*eslint-enable*/
	const oddsKey = betslipStake.oddsKey || 0;
	let oddsKeyN = 1;
	for (let i = 0; i < max; i++) {
		oddsKeyN *= oddsKey;
	}
	const oddsInfo = (oddsKey && probability) ? [oddsKeyN / probability] : [0];
	oddsInfo.sort((a, b) => a - b);
	const odds = getShowOdds(oddsInfo);
	return {
		count: 1,
		odds,
		min: oddsInfo[0],
		sum: oddsInfo[0]
	};
}
/*
	get multiple odds info
 */
function getMulOddsInfo(mutexObject, betslip, betslipMap, betslipStake) {
	const eventKeys = Object.keys(mutexObject);
	const qualifyingOddsLimit = betslipStake.qualifyingOddsLimit;
	const bonusRatios = betslipStake.bonusRatios;

	const list = [];
	const betslips = betslip.betslips || [];
	for (const eventkey of eventKeys) {
		list.push(mutexObject[eventkey].map(gameKey => {
			if (betslips[betslipMap[gameKey]]) {
				return +betslips[betslipMap[gameKey]].outcomeInfo.odds;
			}
			return 0;
		}));
	}

	const num = eventKeys.length;
	const combineList = CR2(list, [num], qualifyingOddsLimit);
	let sum = 0;
	let bonus = 0;
	const oddsInfo = combineList[num].map(cur => {
		sum += cur.res || 0;
		if (cur.nf && bonusRatios[cur.nf]) {
			bonus += cur.res * bonusRatios[cur.nf];
		}
		return cur.res || 0;
	});
	oddsInfo.sort((a, b) => a - b);
	const odds = getShowOdds(oddsInfo);
	return {
		count: combineList[num].length,
		odds,
		bonus,
		min: oddsInfo[0],
		sum
	};
}

/*
	get system odds info
 */
function getSysOddsInfo(mutexObject, betslip, betslipMap, betslipStake) {
	const ret = [];
	const eventKeys = Object.keys(mutexObject),
		bankerMap = betslip.bankerStatus ? betslip.bankerMap : {},
		bankerList = Object.keys(bankerMap),
		bankerCount = bankerList.length;
	const qualifyingOddsLimit = betslipStake.qualifyingOddsLimit;
	const bonusRatios = betslipStake.bonusRatios;

	const betslips = betslip.betslips || [];
	const list = [];
	const numList = [];
	eventKeys.forEach((eventkey, index) => {
		list.push(mutexObject[eventkey].map(gameKey => {
			if (betslips[betslipMap[gameKey]]) {
				return +betslips[betslipMap[gameKey]].outcomeInfo.odds;
			}
			return 0;
		}));
		numList.push(index + 1);
	});
	let bankerOddsInfo = 1;
	// banker中大于1.2的个数
	let bankerBigerNum = 0;
	if (bankerCount) {
		const name = getStakeShowName(bankerCount - 1);
		bankerOddsInfo = bankerList.reduce((sum, cur) => {
			const index = betslipMap[cur];
			if (index > -1 && betslips[index]) {
				const odds = +betslips[index].outcomeInfo.odds;
				if (odds >= qualifyingOddsLimit) {
					bankerBigerNum += 1;
				}
				sum *= odds;
			}
			return sum;
		}, 1);
		ret.unshift({
			name,
			count: 1,
			bonus: bankerOddsInfo * (bonusRatios[bankerBigerNum] || 0),
			odds: getShowOdds([bankerOddsInfo]),
			min: bankerOddsInfo,
			sum: bankerOddsInfo
		});
	}
	// 算出所有的组合，如果选择胆码，则已经排除胆码
	const combineList = CR2(list, numList);
	const combineKeys = Object.keys(combineList);

	for (const currentNum of combineKeys) {
		let sum = 0;
		let bonus = 0;
		const oddsInfo = combineList[currentNum].map(cur => { // eslint-disable-line
			const res = (cur.res || 0) * bankerOddsInfo;
			let nf = cur.nf;
			nf += bankerBigerNum;
			if (nf && bonusRatios[nf]) {
				bonus += bonusRatios[nf] * res;
			}
			sum += res;
			return res;
		});
		oddsInfo.sort((a, b) => a - b);
		const name = getStakeShowName(+currentNum + bankerCount - 1);
		const odds = getShowOdds(oddsInfo);
		ret.push({
			name,
			count: combineList[currentNum].length,
			odds,
			bonus,
			min: oddsInfo[0],
			sum
		});
	}
	return ret;
}

/*
	get show odds
	获取一个用于显示的odds范围，只能获取 从m个中选取n个这种的 odds的显示范围
 */
function getShowOdds(oddsList = []) {
	if (!oddsList.length) {
		return '';
	}
	const min = oddsList[0],
		sum = oddsList.reduce((total, item) => total += +item, 0),
		odds = min === sum ? `${formatNumber(sum, 2)}` : `${formatNumber(min, 2)} ~ ${formatNumber(sum, 2)}`;

	return odds;
}
/*
get single show odds
获取一个用于显示的odds范围, 处理了互斥outcome的情况，目前仅用于single
*/
// function getSingleShowOdds(oddsList = [], sum = 0) {
// 	if (!oddsList.length) {
// 		return '';
// 	}
// 	const min = oddsList[0],
// 		odds = min === sum ? `${formatNumber(sum, 2)}` : `${formatNumber(min, 2)} ~ ${formatNumber(sum, 2)}`;
//
// 	return odds;
// }
/*
	return {
		eventId: [选中的key 列表]
	}
	如果是system，排除掉胆码
 */
function getMutexObject(betslip, validEventSize) {
	if (!validEventSize || !validEventSize.size) {
		return {};
	}
	if (!betslip.bankerStatus) {
		return validEventSize.sizeMap;
	}
	if (betslip.currentType !== 'system') {
		return validEventSize.sizeMap;
	}
	// 只有是system并且是banker模式才需要过滤
	const bankerMap = betslip.bankerMap;
	const sizeMap = validEventSize.sizeMap;
	const ret = {};
	const gameKeys = Object.keys(sizeMap);
	for (const gameKey of gameKeys) {
		const res = sizeMap[gameKey].filter(cur => !bankerMap[cur]);
		if (res && res.length) {
			ret[gameKey] = res;
		}
	}

	return ret;
}

/*
	组合算法
	CR2([[1, 2], [2, 3], [3, 5]], [1, 2, 3])
	返回Ojbect每个值对应每个组合
	每个组合是一个数组，数组有2个属性，res表示乘积的值
	nf表示每个组合大于1.2值得个数
 */

function CR2(arr, num, qualifyingOddsLimit = 1.2) {
	const r = {};
	for (const i of num) {
		r[i] = CR(arr, i, qualifyingOddsLimit);
	}
	return r;
}

function CR(arr, k, qualifyingOddsLimit = 1.2) {
	const result = [];
	const dfs = function (result, list, kLeft, from, to) {
		if (kLeft === 0) {
			let res = 1;
			let nf = 0;
			list.forEach(cur => {
				res *= cur;
				if (cur >= qualifyingOddsLimit) {
					nf += 1;
				}
			});
			result.push({ res, nf });
			return;
		}
		for (let i = from; i <= to; ++i) {
			for (let j = 0; j < arr[i - 1].length; j++) {
				list.push(arr[i - 1][j]);
				dfs(result, list, kLeft - 1, i + 1, to + 1);
				list.pop();
			}
		}
	};
	dfs(result, [], k, 1, arr.length - k + 1);
	return result;
}

function getCombo2(arr, num) {
	const r = {};
	for (const i of num) {
		r[i] = getCombo(arr, i);
	}
	return r;
}

function getCombo(arr, k) {
	const result = [];
	const dfs = function(result, list, kLeft, from, to) {
		if (kLeft === 0) {
			result.push(list.slice(0));
			return;
		}
		for (let i = from; i <= to; ++i) {
			for (let j = 0; j < arr[i - 1].length; j++) {
				list.push(arr[i - 1][j]);
				dfs(result, list, kLeft - 1, i + 1, to + 1);
				list.pop();
			}
		}
	};
	dfs(result, [], k, 1, arr.length - k + 1);
	return result;
}
/*
	betslip 生单选项
 */
function getSlections(validEventSize, betslip, betslipMap, betslipStake) {
	const type = betslip.currentType;
	const betslips = betslip.betslips;
	const bankerMap = betslip.bankerMap;
	const sizeMap = validEventSize.sizeMap;
	const gameKeys = Object.keys(sizeMap);
	const selections = [];
	for (const gameKey of gameKeys) {
		const res = sizeMap[gameKey];
		if (res && res.length) {
			for (const key of res) {
				if (betslip.currentType === 'single' && !betslipStake.singleStake[key]) {
					continue;
				}

				const index = betslipMap[key];
				const item = betslips[index];
				const marketInfo = item.marketInfo;
				const outcomeInfo = item.outcomeInfo;
				if (item.eventId && marketInfo.marketId && outcomeInfo.id && item.sportId) {
					selections.push({
						eventId: item.eventId,
						id: `uof:${marketInfo.product}/${item.sportId}/${marketInfo.marketId}/${outcomeInfo.id}${marketInfo.specifier ? '?' + marketInfo.specifier : ''}`,
						odds: outcomeInfo.odds,
						banker: type === 'system' && !!bankerMap[item.key]
					});
				}
			}
		}
	}
	return selections;
}

/*
	判断selections中是否有livebetting
 */
function getBetType(validEventSize, betslip, betslipMap) {
	let hasLive = 0,
		hasPrematch = 0;
	const betslips = betslip.betslips;
	const sizeMap = validEventSize.sizeMap;
	const gameKeys = Object.keys(sizeMap);
	for (const gameKey of gameKeys) {
		const res = sizeMap[gameKey];
		if (res && res.length) {
			for (const key of res) {
				const index = betslipMap[key];
				const one = betslips[index];
				const marketInfo = one.marketInfo || {};
				!hasLive && (hasLive = marketInfo.product === 1 ? 2 : 0);
				!hasPrematch && (hasPrematch = marketInfo.product === 3 ? 1 : 0);
			}
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
	// , kind, curBal
	const { giftId } = couponInfo;
	return {
		favorInfo: [{
			giftId,
			// giftKind: kind,
			// giftAmount: curBal * 10000
		}]
	};
}

function getOutcomeMap(mutexObject, betslips, betslipsMap) { // 通过mutexObject获取eventid到marketId再到具体outcome的三级关系， 用来计算同一market下outcome互斥的逻辑，目前仅single订单使用
	const outcomeMap = {};
	let	tmp,
		outcome,
		marketKey;
	mutexObject && Object.keys(mutexObject).forEach(eventId => {
		tmp = {};
		mutexObject[eventId].forEach(key => {
			outcome = betslips[betslipsMap[key]];
			marketKey = `${outcome.sportId}_${outcome.eventId}_${outcome.marketInfo.id}`;
			if (tmp[marketKey]) {
				tmp[marketKey].push(outcome);
			} else {
				tmp[marketKey] = [outcome];
			}
		});
		outcomeMap[eventId] = tmp;
	});
	return outcomeMap;
}

function getMaxOdds (outcomes, qualifyingOddsLimit, bonusRatios, isBoosting, boostBets = {}) { // 多个outcome求最大odds
	const oddsMap = [];
	let bonus = null,
		count = 0,
		boostCount = 0;

	for (const outcome of outcomes) {
		const tmpOdds = +outcome.outcomeInfo.odds;
		let boostItem = isBoosting ? boostBets[outcome.key] : null;

		boostItem = boostItem && boostItem.sptBoost ? boostItem : null;

		oddsMap.push({
			key: outcome.key,
			value: boostItem ? boostItem.boostOdds : tmpOdds
		});

		if (tmpOdds >= qualifyingOddsLimit && bonusRatios[1]) {
			const tempBonus = tmpOdds * bonusRatios[1],
				temp = bonus && bonus.value || 0;

			if (tempBonus > temp) {
				bonus = {
					key: outcome.key,
					value: tempBonus
				};
			}
		}

		if (outcome.outcomeInfo.showOdds) {
			++count;

			boostItem && (++boostCount);
		}
	}

	return bonus ? { oddsMap, bonus, count, boostCount } : { oddsMap, count, boostCount };
}

export {
	getStakeInfo
};
