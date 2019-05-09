import Vue from 'vue';
import {
	FETCH_SPORT_SIZE,
	UPDATE_CATEGORY
} from './mutationTypes';

export default {
	[FETCH_SPORT_SIZE] (state, data = []) {
		state.sportSize = data;
	},
	[UPDATE_CATEGORY] (state, data = []) {
		if (data.length) {
			// 如果没有数据直接覆盖
			if (!state.sportSize || !state.sportSize.length) {
				state.sportSize = data;
			} else {
				const sportSize = state.sportSize;
				data.forEach(sport => {
					// 这里运动类型不多，就采用find查找吧-- 这里应该一次只能更新一个运动类型，在真实的环境中
					const index = sportSize.findIndex(current => current.id === sport.id);
					// 如果没有找到整个运动类型直接忽略，理论上不可能发生这种情况
					if (index > -1) {
						// 通过vue更新
						Vue.set(sportSize, index, sport);
					}
				});
			}
		}
	}
};
