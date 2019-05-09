import * as mutationTypes from './mutationTypes';

export default {
	[mutationTypes.UPDATE_BANNER](state, data) {
		state.pageData = data;
	},
	[mutationTypes.UPDATE_GAME_SIZE](state, data) {
		state.gameSize = data;
	},
	[mutationTypes.UPDATE_PERIOD_DATA](state, data) {
		state.periodData = data;
	},
	[mutationTypes.UPDATE_RESULT_PERIODS](state, data) {
		state.resultPeriods = data;
	},
	[mutationTypes.UPDATE_PREVIOUS_DETAIL](state, data) {
		state.previousDetail = data;
	},
	[mutationTypes.UPDATE_SELECTIONS](state, data) {
		if (data.type === 'add') {
			state.selections.itemList.push(data.item);
		} else if (data.type === 'delete') {
			state.selections.itemList.splice(data.index, 1);
		} else if (data.type === 'clearAll') {
			state.selections.itemList = [];
			state.selections.selectList = {};
		} else if (data.type === 'allData') {
			if (data.allData.itemList) {
				state.selections = data.allData;
			} else {
				state.selections.itemList = [];
				state.selections.selectList = {};
				state.selections.itemsSize = 0;
			}
			return;
		}

		if ((data.selected || '').length > 0) {
			state.selections.selectList[data.key] = data.selected;
		} else {
			delete state.selections.selectList[data.key];
		}

		state.selections.itemsSize = state.selections.itemList.length;
	},
	[mutationTypes.UPDATE_SELECT_NUM](state, data) {
		state.tempSelect = data;
	},
	[mutationTypes.SET_ORDER_DATA](state, data) {
		Object.assign(state.orderData, data);
	},
	[mutationTypes.UPDATE_BET_TATUS](state, data) {
		state.betStatus = data;
	},
	[mutationTypes.CHANGE_LOGIN_STATUS] (state, data) {
		if (typeof data !== 'boolean') {
			return (state.loginStatus = window.loginStatus);
		}
		state.loginStatus = data;
	}
};
