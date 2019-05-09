import actions from './actions';
import mutations from './mutations';

export default {
	state: {
		resultList: {},
		optionList: [],
		searchList: {},
		selected: {
			date: (() => {
				const d = new Date();
				d.setDate(d.getDate() - 1);
				return d;
			})(),
			sport: {},
			category: {},
			tournament: {},
		},
		moreEvents: false,
		count: 20,
	},
	getters: {
		lastId(state) {
			let id = '';
			const list = state.resultList.tournaments || [];
			if (list.length) {
				id = list[list.length - 1].id;
			}
			return id;
		},
		moreEvents(state) {
			const flag = state.resultList.moreEvents || false;
			return flag;
		}
	},
	mutations,
	actions,
	namespaced: true
};
