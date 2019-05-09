
import { CHANGE_SPORTS_LOADING, UPDATE_PRODUCT_STATUS } from './mutationTypes';

export default {
	// 切换比赛loading
	[CHANGE_SPORTS_LOADING] (state, data = false) {
		state[CHANGE_SPORTS_LOADING] = data;
	},
	// 更新productStatus
	[UPDATE_PRODUCT_STATUS] (state, data = 0) {
		state.productStatus = data;
	}
};

