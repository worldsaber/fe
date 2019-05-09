import { isEmptyObject } from 'utils';

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

	let temp = marketStatusMap[pushMarketInfo.status];
	if (temp) {
		return {
			statusDesc: temp,
			showOdds: false
		};
	}

	temp = outcomeStatusMap[pushOutcomeInfo.isActive];
	if (temp) {
		return {
			statusDesc: temp,
			showOdds: false
		};
	}

	if (checkOddsChange) {
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

export default getBetStatus;
