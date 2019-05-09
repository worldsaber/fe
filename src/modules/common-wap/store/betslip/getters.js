import {
	checkBoostAuth,
	getBoostOdds
} from './utils';

export default {
	/*
	是否有bet selections
	 */
	hasBet: (state, getters) => !!state.betslips.length,
	// 将betslip转换成map
	betslipsMap (state, getters) {
		return state.betslips.reduce((res, cur, index) => {
			res[cur.key] = index;
			return res;
		}, {});
	},
	/*
	获取 bet selections的数量
	 */
	betCount: (state, getters) => state.betslips.length,

	// 是否支持multiple
	/**
	 * multiple支持的条件当前存在的outcome至少需要在2个event中并且状态都是可以投注的，即不是unavailable和suspended的情况
	 */
	supportMultiple: (state, getters) => getters.validEventSize.size > 1,
	supportSystem: (state, getters) => getters.validEventSize.size > 1 &&
	getters.betCount <= state.systemThreshold,
	/*
	  * 如果存在互斥则不能投注 multipe玩法
	 */
	// 分组有效的投注项目
	// 即将分组的项目依次进行排除，排除掉 状态是unavailable和suspended的情况
	// 并返回map的长度
	validEventSize: (state, getters) => {
		let size = 0;
		// 所有可用投注的outcome的个数
		let outcomeCount = 0;
		const sizeMap = {};
		const eventSizeMap = state.eventSizeMap,
			betslipsMap = getters.betslipsMap,
			betslips = state.betslips;
		for (const key in eventSizeMap) {
			if (Object.prototype.hasOwnProperty.call(eventSizeMap, key)) {
				const current = eventSizeMap[key];
				const res = [];
				for (const one of current) {
					const index = betslipsMap[one];
					if (betslips[index] && betslips[index].outcomeInfo &&
							betslips[index].outcomeInfo.statusDesc !== 'suspended' &&
							betslips[index].outcomeInfo.statusDesc !== 'unavailable') {
						outcomeCount += 1;
						res.push(one);
					}
				}
				if (res.length) {
					sizeMap[key] = res;
					size += 1;
				}
			}
		}
		return {
			size,
			outcomeCount,
			sizeMap
		};
	},
	/*
	  *	是否存在互斥组, 与是否是否选中没有关系
	  * 如果存在互斥则不能投注 multipe玩法
	 */
	hasMutexGroup: (state, getters) => {
		const sizeMap = getters.validEventSize.sizeMap,
			gameKeys = Object.keys(sizeMap);
		let hasMutex = false;
		for (const key of gameKeys) {
			if (sizeMap[key].length >= 2) {
				hasMutex = true;
				break;
			}
		}
		return hasMutex;
	},
	/*
	system模式下，如果有互斥组，需要关闭banker模式
	 */
	supportBanker: (state, getters) => state.currentType === 'system' &&
		// 不存在同一个event选择多个outcome
		!getters.hasMutexGroup &&
		// 至少选择2个以上的outcome
		getters.betCount > 1,
	/*
	获取banker数量
	 */
	bankerCount: (state, getters) => Object.keys(state.bankerMap).length || 0,
	// 如果有赔率变化或者 suspended或者unavailable就不能投注
	// 自动接收赔率，或者没有赔率变化则
	canBet: (state, getters) => getters.hasBet && getters.validEventSize.size > 0 &&
		(!!state.autoAcceptChange || state.changeOutcomes.length === 0),
	hasLive: (state, getters) => {
		const betslips = state.betslips || [];

		for (let i = 0; i < betslips.length; i++) {
			if (betslips[i].marketInfo.product === 1) {
				return true;
			}
		}
		return false;
	},
	// 后台参数是否支持flexibet
	supportFlexibet: (state, getters, rootState) => {
		const flexibetStatus = rootState.betslipStake.flexibetStatus;
		return flexibetStatus === 0 || (flexibetStatus === 1 && !getters.hasLive);
	},
	useFlexibet: (state, getters, rootState) => !getters.hasMutexGroup && getters.supportFlexibet && state.currentType === 'multiple' && getters.flexibetThreshold !== state.flexibetNum,
	flexibetThreshold: (state, getters) => {
		if (state.currentType === 'multiple') {
			return getters.validEventSize.outcomeCount;
		}
		return 0;
	},
	showBoostTips: (state, getters) => {
		const currentType = state.currentType || '';
		if (currentType !== 'single') {
			return false;
		}

		return getters.canBoost;
	},
	canBoost: (state, getters) => {
		const oddsBoostStatus = state.oddsBoostStatus || false;
		if (!oddsBoostStatus) {
			return false;
		}

		const boostOutcome = getters.getBetBoostOdds || {};
		const keys = Object.keys(boostOutcome);

		let count = 0;

		for (const key of keys) {
			if (boostOutcome[key].sptBoost) {
				++count;
			}
		}

		return !!count;
	},
	isBoosting: (state, getters) => {
		const showBoostTips = getters.showBoostTips;

		return showBoostTips && state.usingOddsBoost;
	},
	getBetBoostOdds: (state, getter) => {
		const ret = {};

		const oddsBoostEvents = state.oddsBoostEvents || [],
			betslips = state.betslips || [];

		for (const item of betslips) {
			const sptBoost = checkBoostAuth(item, oddsBoostEvents);
			const boostStatus = getBoostOdds(item, state.boostOddsKey, sptBoost);

			ret[item.key] = {
				sptBoost,
				...boostStatus
			};
		}

		return ret;
	}
};
