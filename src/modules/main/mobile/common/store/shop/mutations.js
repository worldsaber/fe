import * as type from './mutationTypes';
import { clearData } from './commonFun';

export default {
	[type.UPDATE_LOADING_STATUS](state, status) {
		state.reqLoading = status;
	},
	[type.UPDATE_ERROR_INFO](state, result) {
		state.errorInfo = result;
	},
	[type.UPDATE_GIFTS_LISTS](state, list = []) {
		const temp = [];
		const tempList = [];
		for (const item of list) {
			temp.push(item.id);
			tempList.push(clearData(item));
		}
		state.listsKeys = [...temp];
		state.lists = [...tempList];
	},
	[type.UPDATE_GIFTS_DETAIL](state, detail = {}) {
		const rulers = detail.conditions || [];

		delete detail.conditions;

		const currentId = state.currentId || '',
			listsKeys = state.listsKeys || [],
			index = listsKeys.indexOf(currentId);

		if (~index) {
			state.lists.splice(index, 1, clearData(detail));
		} else {
			state.lists.push(clearData(detail));
			state.listsKeys.push(detail.id);
		}

		state.rulers = rulers;
	},
	[type.UPDATE_CURRENT_ID](state, id) {
		state.currentId = id || '';
	}
};
