import { isEmptyObject } from 'utils';
import * as mutationTypes from './mutationTypes';

// const defaultError = 'No internet connection, try again.',
// 	commonError = 'Sorry，something went wrong. Please try again later.';

export default {
	getHistoryList({
		commit,
		state
	}) {
		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});
		commit(mutationTypes.UPDATEHISTORYLIST, { entityList: [] });

		fetch('/pocket/v1/activity/sportycoins/history', {
			method: 'GET',
			body: {
				pageSize: state.pageSize,
				pageNo: state.pageIndex
			}
		})
		.then(res => res.json())
		.then(ret => {
			commit(mutationTypes.UPDATELOADING, false);

			if (ret.login === false) {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'login'
				});
				return;
			}

			const { bizCode = -1, data = {}} = ret || {};

			if (bizCode === 10000) {
				commit(mutationTypes.UPDATEHISTORYLIST, data);
			} else {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'loadError'
				});
			}
		})
		.catch(() => {
			commit(mutationTypes.UPDATELOADING, false);
			commit(mutationTypes.UPDATEERRORINFO, {
				type: 'loadError'
			});
		});
	},

	getCoinsTransInfo({
		commit,
		state
	}, params) {
		const { activityId = '' } = params || {};

		if (!activityId) {
			return;
		}

		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		fetch('/pocket/v1/activity/sportycoins/records', {
			method: 'GET',
			body: {
				activityId,
				type: state.curTransTab
			}
		})
		.then(res => res.json())
		.then(ret => {
			commit(mutationTypes.UPDATELOADING, false);

			if (ret.login === false) {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'trans_login'
				});
				return;
			}

			const { bizCode = -1, data = [] } = ret || {};

			if (bizCode === 10000) {
				commit(mutationTypes.UPDATECURRENTTRANSACTION, data);
			} else {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'trans_loadError'
				});
			}
		})
		.catch(() => {
			commit(mutationTypes.UPDATELOADING, false);
			commit(mutationTypes.UPDATEERRORINFO, {
				type: 'trans_loadError'
			});
		});
	},

	getCoins({
		commit,
		state
	}) {
		commit(mutationTypes.UPDATELOADING, true);
		commit(mutationTypes.UPDATEERRORINFO, {});

		fetch('/pocket/v1/activity/sportycoins/detail', {
			method: 'GET'
		})
		.then(res => res.json())
		.then(ret => {
			commit(mutationTypes.UPDATELOADING, false);

			if (ret.login === false) {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'login'
				});
				return;
			}

			const { bizCode = -1, data = {}} = ret || {};

			if (bizCode === 10000 && !isEmptyObject(data)) {
				commit(mutationTypes.UPDATECOINSINFO, data);
			} else {
				commit(mutationTypes.UPDATEERRORINFO, {
					type: 'loadError'
				});
			}
		})
		.catch(() => {
			commit(mutationTypes.UPDATELOADING, false);
			commit(mutationTypes.UPDATEERRORINFO, {
				type: 'loadError'
			});
		});
	}
};
