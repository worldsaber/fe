import actions from './actions';
import mutations from './mutations';

export default {
	state: {
		resultList: [],
		optionList: [],
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
		pageNum: 1,
		pageSize: 100,
	},
	getters: {
		pageCount(state) {
			let num = 1;
			const { pageSize, resultList } = state;
			if (pageSize < resultList.totalNum) {
				num = Math.ceil(resultList.totalNum / pageSize);
			}
			return num;
		},
		categoriesList(state) {
			let list = [];
			const index = state.selected.sport.id;
			const sportList = state.optionList;
			if (index) {
				for (let i = 0, len = sportList.length; i < len; i++) {
					const val = sportList[i];
					if (index === val.id) {
						list = val.categories;
						break;
					}
				}
			}
			return list;
		},
		tournamentList(state, getters) {
			let list = [];
			const index = state.selected.category.id;
			const categoriesList = getters.categoriesList;
			if (index) {
				for (let i = 0, len = categoriesList.length; i < len; i++) {
					const val = categoriesList[i];
					if (index === val.id) {
						list = val.tournaments;
						break;
					}
				}
			}
			return list;
		},
	},
	mutations,
	actions,
	namespaced: true
};
