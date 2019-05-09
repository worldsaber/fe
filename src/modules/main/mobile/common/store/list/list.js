import * as types from '../mutation-types';
// import '../../../mockData/sports?debug';

// initial state
const state = {
	lists: []
};

// getters
const getters = {
	allLists: state => state.lists
};

// actions
const actions = {
	getAllLists({ commit }) {
		fetch('test/fucking')
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		})
		.then(data => { commit(types.UPDATE_LIST, data); })
		.catch(err => { throw new Error(err); });
	}
};

// mutations
const mutations = {
	[types.UPDATE_LIST](state, data) {
		state.lists = data;
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
