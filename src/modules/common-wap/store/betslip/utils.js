import { isEmptyObject } from 'utils';
/*
生成快照参数
 */
export function getRefreshParams(betslips = []) {
	const params = [];

	for (const item of betslips) {
		const marketInfo = item.marketInfo || {},
			outcomeInfo = item.outcomeInfo || {};
		if (item.eventId && marketInfo.id && outcomeInfo.id) {
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

// market 状态映射的outcome状态
const marketStatusMap = {
	1: 'suspended',
	2: 'suspended',
	3: 'unavailable'
};

// outcome映射的outcome的状态
const outcomeStatusMap = {
	0: 'suspended'
};

export function getBetStatus(pushMarketInfo = {}, pushOutcomeInfo = {}, outcomeInfo = {}, checkOddsChange = true) {
	const ret = {
		statusDesc: '',
		showOdds: true
	};

	if (isEmptyObject(pushMarketInfo) &&
		isEmptyObject(pushOutcomeInfo)) {
		return ret;
	}

	if (isEmptyObject(outcomeInfo) && checkOddsChange) {
		return ret;
	}

	let temp = marketStatusMap[pushMarketInfo.fixStatus];
	if (temp) {
		return {
			statusDesc: temp,
			showOdds: false
		};
	}

	temp = marketStatusMap[pushMarketInfo.status];
	if (temp) {
		return {
			statusDesc: temp,
			showOdds: false
		};
	}

	if (!isEmptyObject(pushOutcomeInfo)) {
		temp = outcomeStatusMap[pushOutcomeInfo.isActive];
		if (temp) {
			return {
				statusDesc: temp,
				showOdds: false
			};
		}
	}

	if (checkOddsChange && !isEmptyObject(outcomeInfo) && !isEmptyObject(pushOutcomeInfo)) {
		if (pushOutcomeInfo.odds > outcomeInfo.odds) {
			return {
				statusDesc: 'up',
				showOdds: true
			};
		}

		if (pushOutcomeInfo.odds < outcomeInfo.odds) {
			return {
				statusDesc: 'down',
				showOdds: true
			};
		}
	}

	return ret;
}

// 对比 betslips, 对 outcomes 去重
export function uniqOutcomes (outcomes, betslips) {
	const result = [];
	for (const betItem of outcomes) {
		const sportInfo = betItem.sport || {},
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

		for (const marketItem of markets) {
			const marketId = marketItem.specifier ?
					`${marketItem.id}?${marketItem.specifier}` :
					marketItem.id,
				outcomeList = marketItem.outcomes || [];

			for (const outcomeItem of outcomeList) {
				const key = `${baseKey}_${marketId}_${outcomeItem.id}`;
				const betIndex = betslips.findIndex(bet => key === bet.key);
				if (betIndex === -1) {
					result.push(betItem);
				}
			}
		}
	}
	return result;
}

export function getValidOutComes(betslips) {
	const valid = [];
	betslips.forEach(betslip => {
		if (betslip && betslip.outcomeInfo &&
			betslip.outcomeInfo.statusDesc !== 'suspended' &&
			betslip.outcomeInfo.statusDesc !== 'unavailable') {
			valid.push(betslip);
		}
	});
	return valid;
}

export function checkBoostAuth(betItem = {}, cfg = []) {
	const marketInfo = betItem.marketInfo || {};

	for (const temp of cfg) {
		if (temp.tournamentId && temp.tournamentId !== betItem.tournamentId) {
			continue;
		}

		if (temp.eventId && temp.eventId !== betItem.eventId) {
			continue;
		}

		if (temp.productId && +temp.productId !== +marketInfo.product) {
			continue;
		}

		if (temp.marketId && +temp.marketId !== +marketInfo.marketId) {
			continue;
		}

		if (temp.specifier && temp.specifier !== marketInfo.specifier) {
			continue;
		}

		return true;
	}

	return false;
}

export function getBoostOdds(betItem = {}, boostOddsKey = 0, sptBoost = false) {
	if (!boostOddsKey) {
		return;
	}

	if (sptBoost) {
		const outcomeInfo = betItem.outcomeInfo || {},
			boostOdds = outcomeInfo.odds * boostOddsKey;
		return {
			sptBoost: true,
			boostOdds,
			showBoostOdds: +boostOdds.toFixed(2)
		};
	}

	return {
		sptBoost: false,
		boostOdds: 0,
		showBoostOdds: 0
	};
}
