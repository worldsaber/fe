import { LS } from 'storage';
import * as type from './mutationTypes';
import { clearData } from './commonFun';

export default {
	[type.UPDATE_DATA_LOAD_STATUS](state, status) {
		state.dataLoading = status;
	},

	[type.UPDATE_MORE_LOAD_STATUS](state, status) {
		state.moreLoading = status;
	},

	[type.UPDATE_EVENTS_LISTS](state, originData) {
		const { moreEvents = false, events = [] } = originData || {};
		const list = clearData(events);

		if (moreEvents) {
			state.events = state.events.concat(list);
		} else {
			state.events = list;
		}

		if (events.length < state.pageSize) {
			state.total = state.events.length;
		} else {
			state.total = originData.totalNum || 0;
		}
	},

	[type.UPDATE_SEARCH_KEY](state, key) {
		let list = state.searchList;

		if (key !== state.searchKey) {
			state.pageIndex = 0;
			state.total = 0;
			state.searchKey = key;

			if (!key) {
				state.events.splice(0);
				return;
			}

			const index = list.indexOf(key);

			if (!!~index) {
				list.splice(index, 1);
			}

			list.unshift(key);
		} else if (!list.length) {
			list.unshift(key);
		}

		list = list.length > 10 ? list.slice(0, 10) : list;

		state.searchList = [...list];

		LS.set('h5_search_list', JSON.stringify(list));
	},

	[type.CLEAR_HISTORY](state) {
		state.searchList = [];
		LS.set('h5_search_list', JSON.stringify([]));
	},

	[type.UPDATE_CURRENT_TYPE](state, type) {
		type = +type;

		state.currentType = type;
		state.pageIndex = 0;
		state.total = 0;
		state.events.splice(0);
	},

	[type.UPDATE_PAGE_MODULE](state, name) {
		state.pageModule = name;
	},

	[type.UPDATE_ERROR_INFO](state, errorInfo) {
		state.errorInfo = errorInfo;
	},

	[type.CLEAR_SEARCH_RESULT](state) {
		state.pageIndex = 0;
		state.total = 0;
		state.events.splice(0);
	}
};
