import * as mutationTypes from './mutationTypes';

export default {
	[mutationTypes.UPDATE_SELECTED](state, data) {
		Object.assign(state.selected, data);
	},
	[mutationTypes.UPDATE_RESULTLIST](state, data) {
		state.resultList = data;
	},
	[mutationTypes.UPDATE_SEARCHLIST](state, data) {
		state.searchList = data;
	},
	[mutationTypes.UPDATE_OPTIONLIST](state, data) {
		state.optionList = data;
	},
	[mutationTypes.UPDATE_MOREEVENTS](state, data) {
		state.moreEvents = data;
	}
};
