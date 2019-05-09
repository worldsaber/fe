import { cookie } from 'storage';
import { getComplexAdConfig } from 'utils/getAdConfig';
import * as mutationTypes from './mutationTypes';

const defaultError = 'No internet connection, try again.',
	commonError = 'Something went wrong. Please try again.';

export default {
	// 获取首页基本信息
	getBaseInfo({
		commit,
		state
	}) {
		commit(mutationTypes.UPDATE_REQUEST_STATUS, true);

		const { hasFinish = false } = state;

		// 重置期次状态
		hasFinish && commit(mutationTypes.UPDATE_FINISH_STATUS, false);

		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/quiz/period', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				commit(mutationTypes.UPDATE_REQUEST_STATUS, false);

				const { bizCode, data = {}} = ret;
				if (bizCode === 10000) {
					const fetchEnd = (new Date()).getTime();
					commit(mutationTypes.UPDATE_DELTA_TIME, fetchEnd - data.ts);
					commit(mutationTypes.UPDTAE_BASE_INFO, data);
				} else {
					reject({
						type: 'toast',
						msg: ret.message || commonError
					});
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATE_REQUEST_STATUS, false);
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},

	// 参加人数
	getParticipantsCount({
		commit
	}) {
		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/quiz/currentUser', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				const { bizCode, data = {}} = ret;
				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_PARTICIPANTS_COUNT, data.amount);
				} else {
					reject({
						type: 'toast',
						msg: ret.message || commonError
					});
				}
			})
			.catch(() => {
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},

	verifyAuthority({
		commit
	}) {
		commit(mutationTypes.UPDATE_REQUEST_STATUS, true);

		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/quiz/userStatus', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				commit(mutationTypes.UPDATE_REQUEST_STATUS, false);

				const { bizCode, data = {}} = ret;
				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_IS_SPECTATOR, data.userStatus);
					resolve({
						userStatus: !data.userStatus
					});
				} else {
					reject({
						type: 'toast',
						msg: ret.message || commonError
					});
				}
			})
			.catch(() => {
				commit(mutationTypes.UPDATE_REQUEST_STATUS, false);
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},

	// 加入答题
	joinQuiz({
		commit,
		state
	}) {
		if (state.alreayJoin) {
			return;
		}

		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/quiz/join', {
				method: 'POST'
			})
			.then(res => res.json())
			.then(ret => {
				if (ret.login === false) {
					reject({
						type: 'login'
					});
					return;
				}

				const { bizCode, data = {}} = ret;
				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_PARTICIPANTS_COUNT, data.amount);
					commit(mutationTypes.UPDATE_JOIN_STATUS, true);
					resolve();
				} else {
					reject({
						type: 'toast',
						msg: ret.message || commonError
					});
				}
			})
			.catch(() => {
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},

	// 获取登录用户红包总数
	getGiftsAmount({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/quiz/giftAmount', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				const { bizCode, data = {}} = ret;
				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_TOTAL_GIFTS, data.giftAmount);
				} else {
					reject({
						type: 'toast',
						msg: ret.message || commonError
					});
				}
			})
			.catch(() => {
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},

	/*
	刷新登录状态
	 */
	refreshLoginStatus({
		commit
	}) {
		const refreshToken = cookie('refreshToken');

		return new Promise((resolve, reject) => {
			fetch('/patron/refreshToken', {
				method: 'PUT',
				body: {
					refreshToken
				}
			})
			.then(res => res.json())
			.then(ret => {
				const { bizCode } = ret;
				if (bizCode !== 10000) {
					reject({
						type: 'login'
					});
				} else {
					commit(mutationTypes.REFRESH_LOGIN_STATUS, true);
					resolve({
						refresh: true
					});
				}
			})
			.catch(() => {
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},
	// 获取广告配置
	getIssueAd({ commit }) {
		return getComplexAdConfig([
			{ spotId: 'quizShowMainBanner' },
			{ spotId: 'quizShowRule' },
			{ spotId: 'quizShowResult' },
			{ spotId: 'quizShowPartnerLogo' },
			{ spotId: 'quizShowBigAward' },
			{ spotId: 'quizShowPopup' }
		]).then(spots => {
			const spotMap = {};
			for (const spot of spots) {
				spotMap[spot.spotId] = spot;
			}
			commit(mutationTypes.UPDATE_ISSUE_AD, spotMap);
			return spotMap;
		});
	},
	getSmartPhoneUrl({ commit }) {
		fetch('/promotion/v1/activities/quiz/prize')
		.then(res => res.json())
		.then(res => {
			if (res.bizCode === 10000) {
				commit(mutationTypes.UPDATE_SMARTPHONE_URL, res.data);
			}
		});
	}
};
