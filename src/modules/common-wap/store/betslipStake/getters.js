import { getStakeInfo } from './commonFun';

export default {
	/*
	获取的system play all时的历史输入值
	 */
	uStake: (state, getters) => state.systemStake.union,

	/*
	根据当前选中的投注类型，获取填入的历史stake值
	 */
	getStake: (state, getters, rootState) => {
		const ret = [];

		switch (rootState.betslip.currentType) {
		case 'signle': {
			const sStakeKeys = Object.keys(state.singleStake);
			for (const key of sStakeKeys) {
				if (key !== 'union') {
					ret.push(state.singleStake[key]);
				}
			}
			break;
		}
		case 'multiple': {
			ret.push(state.multipleStake);
			break;
		}
		case 'system': {
			const stakeKeys = Object.keys(state.systemStake);
			for (const key of stakeKeys) {
				if (key !== 'union') {
					ret.push(state.systemStake[key]);
				}
			}
			break;
		}
		default:
		}

		return ret;
	},

	/*
		[ {name, count, odds} ]
		统计不同串关的odd范围，当前输入的stake最小赔率值
		这里没有添加当前用户输入的钱数，这里只管计算出 赔率大小 count数据，不管钱数，是为了避免钱数发生变化的时候触发这个getter从新计算消耗性能
	 */
	stakeNum: (state, getters, rootState, rootGetters) => {
		const betslip = rootState.betslip;
		return getStakeInfo(betslip, rootGetters, state);
	},

	// 加工stakerNum，带上每个组合用户输入的stake,这样stake变化的时候只有这个getter计算，stakeNum的getter在stake变化的时候值不变
	stakeUnion: (state, getters, rootState) => {
		const stakeNum = getters.stakeNum;
		const betslip = rootState.betslip;
		const currentType = betslip.currentType;
		switch (currentType) {
		case 'single': {
			return [Object.assign({}, stakeNum[0] || {}, {
				stake: betslip.betslips.reduce((sum, item) => {
					if (item.outcomeInfo && item.outcomeInfo.showOdds) {
						sum += +state.singleStake[item.key] || 0;
					}
					return sum;
				}, 0)
			})];
		}
		case 'multiple': {
			return [Object.assign({}, stakeNum[0] || {}, {
				stake: state.multipleStake || '',
			})];
		}
		case 'system': {
			return stakeNum.map(cur => Object.assign({}, cur, {
				stake: state.systemStake[cur.name] || '',
			}));
		}
		default:
			return [];
		}
	},
};
