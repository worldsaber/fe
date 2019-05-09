import * as mutationTypes from './mutationTypes';
import { checkCoupons, getCheckedId } from './commonFun.js';

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
			// deviceCh: state.deviceCh,
			deviceChs: state.deviceCh,
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
			.catch(err => { // eslint-disable-line
				state.loading && setTimeout(() => {
					commit(mutationTypes.UPDATELOADING, false);
				}, 500);

				!state.errorInfo && (commit(mutationTypes.UPDATEERRORINFO, {
					type: 'load'
				}));
			});
		});
	}
};
