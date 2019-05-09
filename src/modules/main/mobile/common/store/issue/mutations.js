import { isEmptyObject, formatNumber, objType } from 'utils';
import * as type from './mutationTypes';
import { getIssueStatus } from './commonFun';

export default {
	[type.UPDTAE_BASE_INFO](state, data) {
		const { timeConfig = {}, status = -1, startTime = -1, endTime = -1 } = data || {};
		// 没有期次时也需要复活信息
		if (typeof data.totalLives === 'number') {
			state.totalLives = data.totalLives;
		} else {
			state.totalLives = '--';
		}
		// 没有下一期直接返回
		if (isEmptyObject(data) || !data.periodId) {
			state.homeStatus = 2;
			return;
		}

		state.timeConfig = { ...timeConfig };
		state.subjectSize = data.subjectSize;

		state.baseLives = data.totalLives - data.currentPeriodLives;
		state.currentPeriodLives = data.currentPeriodLives;
		if (data && !isEmptyObject(data)) {
			delete data.timeConfig;
			delete data.totalLives;
			delete data.currentPeriodLives;

			if (objType(data.prizeAmount) !== 'undefined') {
				data.prizeAmount /= 10000;
				data.showPrizeAmount = formatNumber(data.prizeAmount, 0);
			} else {
				data.showPrizeAmount = '-';
			}

			if (objType(data.userTotalPrize) !== 'undefined' && window.loginStatus) {
				data.userTotalPrize /= 10000;
				data.showTotalPrize = formatNumber(data.userTotalPrize, 0);
			} else {
				data.showTotalPrize = '-';
			}

			if (objType(data.countryGiftAmount) !== 'undefined') {
				data.countryGiftAmount /= 10000;
				data.showCountryGiftAmount = formatNumber(data.countryGiftAmount, 0);
			} else {
				data.showCountryGiftAmount = '-';
			}

			state.baseInfo = data;
		}

		state.homeStatus = getIssueStatus(status, startTime === -1 ? startTime : startTime + state.deltaTime, endTime === -1 ? endTime : endTime + state.deltaTime);

		// if (status === 30 && state.isLogin) {
		// 	state.pageModule = 'result';
		// }
	},

	[type.UPDATE_LOGIN_STATUS](state) {
		state.isLogin = window.loginStatus;
	},

	[type.UPDATE_SHAREBAR_STATUS](state, status) {
		state.showShareBar = status;
	},

	[type.UPDATE_HOME_STATUS](state, status) {
		state.homeStatus = status;
	},

	[type.UPDATE_PAGE_MODULE](state, name) {
		state.pageModule = name;
	},

	[type.UPDATE_PARTICIPANTS_COUNT](state, count) {
		state.participantsCount = count || 0;
	},

	[type.UPDATE_REQUEST_STATUS](state, status) {
		state.reqLoading = status;
	},

	[type.UPDATE_IS_SPECTATOR](state, val) {
		// 0:观战模式 1:答题模式
		state.isSpectator = !val;
	},

	[type.UPDATE_GIFT](state, val) {
		// 本轮当前红包金额
		state.gift = val;
	},

	[type.UPDATE_HEAT](state, val) {
		// 本轮当前红包金额
		state.heatObj = val;
	},

	[type.UPDATE_JOIN_STATUS](state, val) {
		state.alreayJoin = val;
	},

	[type.UPDATE_FINISH_STATUS](state, val) {
		state.hasFinish = val;
	},

	[type.UPDATE_MUSIC_STATUS](state, val) {
		state.musicStatus = val;
	},

	[type.UPDATE_DELTA_TIME](state, val) {
		state.deltaTime = val;
	},

	[type.RESET_DATA](state) {
		state.homeStatus = 2;
		state.baseInfo = {};
		state.subjectSize = 0;
		state.timeConfig = {};
		state.participantsCount = 0;
		state.isSpectator = false;
		state.gift = 0;
		state.alreayJoin = false;
		state.heatObj = {};
		state.hasRefreshLoginStatus = false;
	},

	[type.UPDATE_TOTAL_GIFTS](state, amount) {
		let showTotalPrize;
		if (state.isLogin) {
			amount /= 10000;
			showTotalPrize = formatNumber(amount, 0);
		} else {
			showTotalPrize = '-';
		}

		state.baseInfo = {
			...state.baseInfo,
			...{
				userTotalPrize: amount,
				showTotalPrize
			}
		};
	},

	[type.REFRESH_LOGIN_STATUS](state, val) {
		if ([1, 4].includes(state.homeStatus)) {
			state.hasRefreshLoginStatus = val;
		}
	},

	[type.UPDATE_CURRENT_LIVES](state, val) {
		state.currentPeriodLives = val;
	},

	[type.UPDATE_ISSUE_AD](state, val) {
		state.adConfig = val;
	},

	[type.UPDATE_SMARTPHONE_URL](state, val) {
		state.smartPhoneUrl = val;
	}
};
