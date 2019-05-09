import { getMutexList } from '../betslipStake/commonFun';

export default {
	// 将betslip变成一个map,值是index
	betslipsMap: (state, getters) => state.betslipsKeys.reduce((res, cur, index) => {
		res[cur] = index;
		return res;
	}, {}),
	/*
	获取bet selections list
	 */
	getBetslips: (state, getters) => state.betslips || [],

	/*
	是否有bet selections
	 */
	hasBet: (state, getters) => !!state.betslips.length,

	isSupportCoins: (state, getters) => {
		const currentType = state.currentType;

		if (currentType === 'system') {
			return false;
		}

		return true;
	},

	getCurrentPayMethods: (state, getters) => state.payMethod[state.currentType],

	/*
	live的outcome数量
	 */
	liveCount: (state, getters) => {
		const betslips = state.betslips || [];
		let count = 0;

		for (const item of betslips) {
			const marketInfo = item.marketInfo || {};
			if (marketInfo.product === 1) {
				++count;
			}
		}

		return count;
	},

	mulMutexCounts: (state, getters) => {
		const multipleCheckedList = state.multipleCheckedList;
		const mutexList = getMutexList({
			sameGameMap: state.sameGameMap,
			currentType: 'multiple'
		}, multipleCheckedList) || {};

		return Object.keys(mutexList).length;
	},

	/*
	是否支持flexibet(oddsKey没有拿到时，multiple只能按照正常的方式计算)
	 */
	isSupportFlexiBet: (state, getters) => !state.flexiVal || state.flexiVal === 1 && !getters.liveCount && state.oddsKey !== -1,

	flexiThreshold: (state, getters) => getters.mulMutexCounts,
	isSimpleMultiple: (state, getters) => getters.mulMutexCounts === state.multipleCheckedList.length,
	isFlexi: (state, getters) => state.currentType === 'multiple' && getters.isSupportFlexiBet && state.multipleMode === 2,

	canShowFlexitips: (state, getters) => getters.hasBet && getters.isSupportFlexiBet,

	/*
	根据当前投注类型，取得对应的选中的bet列表
	 */
	getSelectList: (state, getters) => {
		let ret = null;
		switch (state.currentType) {
		case 'single':
			ret = state.singleCheckedList;
			break;
		case 'multiple':
			ret = state.multipleCheckedList;
			break;
		case 'system':
			ret = state.systemCheckedList;
			break;
		default:
		}

		return ret;
	},

	/*
	获取 bet selections的数量
	 */
	getBetCount: (state, getters) => state.betslipsKeys.length,

	/*
	获取bet selections 的key list
	 */
	getOutcomeKeys: (state, getters) => state.betslipsKeys || [],

	/*
	是否存在互斥组, 与是否是否选中没有关系
	 */
	hasMutexGroup: (state, getters) => {
		const sameGameMap = state.sameGameMap,
			gameKeys = Object.keys(sameGameMap).length,
			betCount = state.betslipsKeys.length;

		if (betCount !== gameKeys) {
			return true;
		}

		return false;
	},

	/*
	system模式下，如果有互斥组，需要关闭banker模式
	 */
	supportBanker: (state, getters) => state.currentType === 'system' && !getters.hasMutexGroup,

	/*
	获取banker数量
	 */
	getBankerCount: (state, getters) => state.bankerList.length || 0,

	/*
	是否可以投注，不可以显示accept change
	 */
	canBet: (state, getters) => {
		const currentType = state.currentType,
			checkList = getters.getSelectList || [];

		if (currentType === 'multiple') {
			return !!checkList.length && getters.mulMutexCounts > 1;
		}

		return !!checkList.length;
	}
};
