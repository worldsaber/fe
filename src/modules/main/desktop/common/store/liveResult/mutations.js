import * as mutationTypes from './mutationTypes';

export default {
	[mutationTypes.UPDATE_SELECTED](state, data) {
		// 切换修改父层选择项清空子选项
		if (data.sport) {
			data.category = {};
			data.tournament = {};
		} else if (data.category) {
			data.tournament = {};
		}
		Object.assign(state.selected, data);
	},
	[mutationTypes.UPDATE_RESULTLIST](state, data) {
		state.resultList = data;
	},
	[mutationTypes.UPDATE_OPTIONLIST](state, data) {
		state.optionList = data;
	},
	[mutationTypes.UPDATE_PAGENUM](state, data) {
		state.pageNum = data;
	}
};
