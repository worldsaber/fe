import { objType } from 'utils';
import * as mutationTypes from './mutationTypes';

const defaultError = 'No internet connection, try again.',
	commonError = 'Sorry，something went wrong. Please try again later.';

let timerId = null;
let handleRes = false;
let hasTimeout = false;

export default {
	getList({
		commit,
		state,
		getters
	}) {
		commit(mutationTypes.UPDATE_LOADING_STATUS, true);
		commit(mutationTypes.UPDATE_ERROR_INFO, {});

		return new Promise((resolve, reject) => {
			fetch('/marketing/v1/shop/gift/list', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				commit(mutationTypes.UPDATE_LOADING_STATUS, false);
				const code = ret.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATE_GIFTS_LISTS, ret.data || []);
					return;
				}

				commit(mutationTypes.UPDATE_ERROR_INFO, {
					type: 'loadError'
				});
			})
			.catch(() => {
				commit(mutationTypes.UPDATE_LOADING_STATUS, false);
				commit(mutationTypes.UPDATE_ERROR_INFO, {
					type: 'loadError'
				});
			});
		});
	},

	purchase({
		commit,
		state
	}, params) {
		commit(mutationTypes.UPDATE_LOADING_STATUS, true);
		commit(mutationTypes.UPDATE_ERROR_INFO, {});
		handleRes = false;

		return new Promise((resolve, reject) => {
			hasTimeout = false;

			// 超过10s
			timerId = setTimeout(() => {
				clearTimeout(timerId);
				hasTimeout = true;
				if (!handleRes) {
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'timeout',
						msg: 'Your purchase request has been submitted, awaiting for confirmation. You can check the records in a short while.',
					});

					state.reqLoading && commit(mutationTypes.UPDATE_LOADING_STATUS, false);
					reject({
						timeout: true
					});
				}
			}, 60000);

			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			fetch('/marketing/v1/shop/gift/buy', {
				method: 'POST',
				body: JSON.stringify({ goodsId: params || state.currentId }),
				headers: t
			})
			.then(res => {
				if (hasTimeout) {
					reject({
						timeout: true
					});
				} else {
					handleRes = true;
					clearTimeout(timerId);

					state.reqLoading && commit(mutationTypes.UPDATE_LOADING_STATUS, false);
					return res.json();
				}
			})
			.then(ret => {
				// 未登录
				if (ret.login === false) {
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'login'
					});
					return;
				}

				const code = ret.bizCode;

				switch (code) {
				case 10000:
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'success',
						msg: 'Your purchase was successful.'
					});
					return;
				case 61100:
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'deposit',
						title: 'Balance Insufficient',
						msg: 'There is not enough balance in your account to buy the gift.'
					});
					return;
				// 卖完
				case 4300:
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'soldOut',
						msg: 'Sorry, the cash gift has been sold out. Please check on other items.'
					});
					return;
				case 61300:
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'locked',
						msg: ret.message || 'This account is currently locked. If you have any questions, please contact us for more information.'
					});
					return;
				default:
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'dialog',
						msg: ret.message || commonError
					});
				}
			})
			.catch(err => {
				if (hasTimeout) {
					reject({
						timeout: true
					});
				} else {
					commit(mutationTypes.UPDATE_LOADING_STATUS, false);
					let msg = defaultError;
					if (err) {
						if (objType(err) === 'string') {
							msg = err;
						} else if (err.message) {
							msg = err.message;
						}
					}
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'toast',
						msg
					});
					if (timerId) {
						clearTimeout(timerId);
						timerId = null;
					}
				}
			});
		});
	},
	getDetail({
		commit,
		state
	}) {
		if (!state.currentId) {
			return;
		}

		commit(mutationTypes.UPDATE_LOADING_STATUS, true);
		commit(mutationTypes.UPDATE_ERROR_INFO, {});

		return new Promise((resolve, reject) => {
			fetch('/marketing/v1/shop/gift/info', {
				method: 'GET',
				body: {
					goodsId: state.currentId
				}
			})
			.then(res => {
				commit(mutationTypes.UPDATE_LOADING_STATUS, false);
				return res.json();
			})
			.then(ret => {
				const { bizCode = -1 } = ret || {};

				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_GIFTS_DETAIL, ret.data || {});
					return;
				}

				if (bizCode === 19000) {
					commit(mutationTypes.UPDATE_ERROR_INFO, {
						type: 'goodsError',
						msg: 'Sorry, the cash gift has been sold out. Please check on other items.'
					});
					return;
				}

				commit(mutationTypes.UPDATE_ERROR_INFO, {
					type: 'loadError'
				});
			})
			.catch(() => {
				commit(mutationTypes.UPDATE_LOADING_STATUS, false);
				commit(mutationTypes.UPDATE_ERROR_INFO, {
					type: 'loadError'
				});
			});
		});
	}
};
