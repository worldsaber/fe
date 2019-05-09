import * as mutationTypes from './mutationTypes';

const defaultError = 'No internet connection, try again.',
	commonError = 'Something went wrong. Please try again.';

let lastParams = null;

export default {
	getList({
		commit,
		state,
		getters
	}, params) {
		const { key = '', isMore = false, isRefresh = false } = params || {};
		let keyword = key || state.searchKey;

		keyword = keyword.replace(/\s+$/g, '');

		if (!keyword) {
			return;
		}

		const searchParams = {
			keyword,
			offset: isMore ? ++state.pageIndex * state.pageSize : 0,
			pageSize: state.pageSize
		};

		const sportId = getters.getSportId;
		sportId && (searchParams.sport = sportId);

		if (!isRefresh && lastParams && lastParams.key === JSON.stringify(searchParams)) {
			const diff = Date.now() - lastParams.time;

			if (diff < 1500) {
				return;
			}

			if (state.total && diff < 60000) {
				commit(mutationTypes.UPDATE_PAGE_MODULE, 'list');
				return;
			}
		}

		lastParams = {
			key: JSON.stringify(searchParams),
			time: Date.now()
		};

		commit(mutationTypes.UPDATE_PAGE_MODULE, 'list');
		commit(mutationTypes.UPDATE_ERROR_INFO, null);

		if (!isMore) {
			commit(mutationTypes.UPDATE_SEARCH_KEY, keyword);
			commit(mutationTypes.UPDATE_DATA_LOAD_STATUS, true);
		} else {
			commit(mutationTypes.UPDATE_MORE_LOAD_STATUS, true);
		}

		return new Promise((resolve, reject) => {
			fetch('/factsCenter/event/search', {
				method: 'GET',
				body: searchParams
			})
			.then(res => res.json())
			.then(ret => {
				if (!isMore) {
					commit(mutationTypes.UPDATE_DATA_LOAD_STATUS, false);
				} else {
					commit(mutationTypes.UPDATE_MORE_LOAD_STATUS, false);
				}

				const code = ret.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATE_EVENTS_LISTS, Object.assign(ret.data || {}, {
						moreEvents: isMore
					}));
					return;
				}

				commit(mutationTypes.UPDATE_ERROR_INFO, {
					type: 'dialog',
					msg: commonError
				});
			})
			.catch(() => {
				if (!isMore) {
					commit(mutationTypes.UPDATE_DATA_LOAD_STATUS, false);
				} else {
					commit(mutationTypes.UPDATE_MORE_LOAD_STATUS, false);
				}

				commit(mutationTypes.UPDATE_ERROR_INFO, {
					type: 'replace',
					msg: defaultError
				});
			});
		});
	}
};
