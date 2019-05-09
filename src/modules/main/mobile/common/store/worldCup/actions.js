import * as mutationTypes from './mutationTypes';

const defaultError = 'No internet connection, try again.',
	commonError = 'Something went wrong. Please try again.';

export default {
	/*
	verify phone
	params: phone
	return: token
	 */
	validatePhone({
		commit
	}, phone) {
		return new Promise((resolve, reject) => {
			fetch('/patron/phone/check', {
				method: 'GET',
				body: {
					phone
				}
			})
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode,
					originData = data.data || {};

				if (code === 10000) {
					const { result = false } = originData || {};
					if (result) {
						commit(mutationTypes.UPDATE_PHONE, phone);
						resolve({
							verify: true
						});
						return;
					}

					reject({
						type: 'inline',
						msg: 'Please enter a valid mobile number.'
					});
					return;
				}

				reject({
					type: 'dialog',
					msg: commonError
				});
			})
			.catch(() => {
				reject({
					type: 'toast',
					msg: defaultError
				});
			});
		});
	},

	share({
		commit,
		getters,
		state
	}, params) {
		const getEventInfo = getters.getEventInfo;

		params = Object.assign(params, {
			eventId: getEventInfo.eventId
		});

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');

			fetch('/promotion/v1/activities/score/predict', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode;

				if (code === 10000) {
					const data = ret.data || {};
					const { eventStatus = -1 } = data;

					if ([1, 2].includes(+eventStatus)) {
						reject({
							type: 'expire',
							stopShare: true
						});
						return;
					}

					if (!+eventStatus) {
						const { predictStatus: status = -1, shareStatus, } = data;
						// 提交predict
						if (params.shareStatus === 0) {
							commit(mutationTypes.UPDATE_SHARED_INFO, data);
						}
						if (+status === 2) { // 重复提交
							if (shareStatus >= 1) { // 重复分享
								reject({
									type: 'hasShared',
									stopShare: true,
								});
							} else {
								reject({
									type: 'hasPredicted',
									stopShare: true,
								});
							}
							return;
						}
					}

					resolve({
						type: 'share'
					});
					return;
				}

				reject({
					type: 'dialog',
					stopShare: true,
					msg: ret.message || commonError
				});
			})
			.catch(() => {
				reject({
					type: 'toast',
					stopShare: true,
					msg: defaultError
				});
			});
		});
	},

	getBaseInfo({
		commit
	}) {
		commit(mutationTypes.UPDATE_REQUEST_STATUS, true);
		commit(mutationTypes.RESETDATA);

		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/score/round', {
				method: 'GET'
			})
			.then(res => {
				commit(mutationTypes.UPDATE_REQUEST_STATUS, false);
				return res.json();
			})
			.then(ret => {
				const code = ret.bizCode,
					originData = ret.data || {};

				switch (code) {
				case 10000:
					commit(mutationTypes.UPDTAE_BASE_INFO, originData);
					commit(mutationTypes.UPDATE_INIT_STATUS, true);
					return;
				default:
					reject({
						type: 'dialog',
						msg: commonError
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

	getconfig({
		commit
	}) {
		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/activities/score/links', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode,
					originData = ret.data || {};

				if (code === 10000) {
					commit(mutationTypes.UPDATEACTCONFIG, originData);
				}
			})
			.catch(() => {});
		});
	}
};
