import * as types from './mutationTypes';

export default {
	[types.TOOGLE_BET_VISIBLE](state, status) {
		if (typeof status === 'boolean') {
			state.betVisible = status;
		} else {
			state.betVisible = !state.betVisible;
		}
	},

	// 添加 img
	[types.ADD_IMG_DATA_LIST](state, data) {
		if (data) {
			state.imgDataList.push(data);
		}
	},

	// 删除 img
	[types.DELETE_IMG_DATA_LIST](state, index) {
		if (typeof index === 'number') {
			state.imgDataList.splice(index, 1);
		} else {
			state.imgDataList.splice(0);
		}
	},

	// update booking code
	[types.UPDATE_BOOKING_CODE](state, code) {
		state.bookingCode = code || '';
	}
};
