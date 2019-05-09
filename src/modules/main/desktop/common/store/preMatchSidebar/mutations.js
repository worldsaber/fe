import { FETCH_SIDEBAR,
	CHANGE_TIME,
	TOGGLE_TOURNAMENTS,
	CHANGE_SPORT,
	DEL_TOURNAMENTS,
	RESET_TOURNAMENTS } from './mutationTypes';
import '../../../mockData/sportSize?debug';

export default {
	// 获取sidebar数据
	[FETCH_SIDEBAR] (state, data = {}) {
		// 因为这里只取一种运动类型，所以直接取第一个就可以
		if (data && data.sportList && data.sportList[0] && data.sportList[0].categories) {
			state.sportList = data.sportList[0].categories;
		} else {
			state.sportList = [];
		}
		if (data && data.popularEvents && data.popularEvents[0] && data.popularEvents[0].categories) {
			state.popularEvents = data.popularEvents[0].categories;
		} else {
			state.popularEvents = [];
		}
	},
	// 当前的time
	[CHANGE_TIME] (state, time) {
		state.currentTime = time;
	},
	// 当前选中的tournament
	[TOGGLE_TOURNAMENTS] (state, data = {}) {
		if (data.tournamentId) {
			const index = state.currentTournaments.findIndex(cur => cur.tournamentId === data.tournamentId);
			if (index > -1) {
				state.currentTournaments.splice(index, 1);
			} else {
				state.currentTournaments.push(data);
			}
		}
	},
	// 删除当前的tournament
	[DEL_TOURNAMENTS] (state, id) {
		const index = state.currentTournaments.findIndex(cur => cur.tournamentId === id);
		if (index > -1) {
			state.currentTournaments.splice(index, 1);
		}
	},
	// 清空当前的tournament
	[RESET_TOURNAMENTS] (state, data = []) {
		state.currentTournaments = data;
	},
	// 切换运动类型
	[CHANGE_SPORT] (state, data) {
		state.currentSportId = data;
	},
};
