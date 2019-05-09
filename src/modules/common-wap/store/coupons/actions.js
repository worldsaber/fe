import * as mutationTypes from './mutationTypes';
import { checkCoupons, getCheckedId } from './commonFun.js';
// import mockData from '../../components/coupons/mock.js';

export default {
	/*
	参数（均可自行覆盖）: bizType,classify,deviceCh,betType
	 */
	getCoupons({
		state,
		commit
	}, params) {
		const options = Object.assign({
			classify: 2,
			deviceCh: state.deviceCh,
			bizType: state.bizType
		}, params);

		if (!options.bizType) {
			return;
		}

		const isComfirm = params.isComfirm;
		const checkedCoupon = getCheckedId(state);

		delete params.isComfirm;

		!state.loading && (commit(mutationTypes.UPDATELOADING, true));
		state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, null));
		state.comfirmError && (commit(mutationTypes.UPFATECOMFIRMERROR, false));

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			fetch('/promotion/v1/gifts/query', {
				method: 'POST',
				body: JSON.stringify(options),
				headers: t
			})
			.then(res => {
				setTimeout(() => {
					commit(mutationTypes.UPDATELOADING, false);
				}, 500);

				return res.json();
			})
			.then(ret => {
				const code = ret.bizCode;

				// 未登录
				if (ret.login === false) {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});

					if (isComfirm) {
						commit(mutationTypes.UPFATECOMFIRMERROR, false);
						resolve({
							conponAviable: false
						});
					}

					return;
				}

				const originData = ret.data || {};
				if (code === 10000) {
					commit(mutationTypes.UPDATECOUPONSLIST, originData);
				} else {
					!state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, {
						type: 'load'
					}));
				}

				if (isComfirm) {
					const couponsStatus = checkCoupons(state.couponsKeys || [], state.couponsList || [], checkedCoupon);

					if (!couponsStatus) {
						commit(mutationTypes.UPFATECOMFIRMERROR, true);
					}

					resolve({
						conponAviable: couponsStatus
					});
				}
			})
			.catch(() => {
				state.loading && setTimeout(() => {
					commit(mutationTypes.UPDATELOADING, false);
				}, 500);

				!state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, {
					type: 'load'
				}));
			});
		});
	},
	/**
	 * 查询分类红包列表
	 * @param {betType} 投注类型（1-Single，2-Multiple，3-System）默认为0-ALL
	 * @param {deviceCh} 设备渠道（1-android，2-web，3-wap，4-sms，5-lite）默认为0-ALL
	 * @param {bizType} 业务类型（1-RealSportsGame，2-VirtualSportsGame，3-Jackpot）默认0-ALL
	 */
	getCouponsGroup ({ state, commit }, params) {
		const body = Object.assign({
			betType: state.betType,
			deviceCh: state.deviceCh,
			bizType: state.bizType
		}, params);

		const isComfirm = params.isComfirm;
		const checkedCoupon = getCheckedId(state);

		delete params.isComfirm;

		!state.loading && (commit(mutationTypes.UPDATELOADING, true));
		state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, null));
		state.comfirmError && (commit(mutationTypes.UPFATECOMFIRMERROR, false));

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			fetch('/promotion/v1/gifts/groupQuery', {
				method: 'GET',
				body,
				headers: t
			})
			.then(response => {
				setTimeout(() => {
					commit(mutationTypes.UPDATELOADING, false);
				}, 500);

				return response.json();
			})
			.then(res => {
				const { bizCode, data = [], login } = res;

				if (login === false) {
					commit(mutationTypes.UPDATEERRORINFO, {
						type: 'login'
					});
					return;
				}

				if (bizCode === 10000) {
					commit(mutationTypes.UPDATE_COUPONS_GROUP_LIST, data);
					commit(mutationTypes.UPDATE_REAL_COUPONS_GROUP_LIST);
				} else {
					!state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, {
						type: 'load'
					}));
				}

				if (isComfirm) {
					const avaliableGifts = state.couponsGroupList.find(x => x.type === 10) || {};
					const couponsStatus = checkCoupons(state.couponsKeys, avaliableGifts.gifts, checkedCoupon);

					if (!couponsStatus) {
						commit(mutationTypes.UPFATECOMFIRMERROR, true);
					}

					resolve({
						conponAviable: couponsStatus
					});
				} else {
					// 需要resolve
					resolve();
				}
			})
			.catch(() => {
				state.loading && setTimeout(() => {
					commit(mutationTypes.UPDATELOADING, false);
				}, 500);

				!state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, {
					type: 'load'
				}));

				reject();
			});
		});
	}
};
