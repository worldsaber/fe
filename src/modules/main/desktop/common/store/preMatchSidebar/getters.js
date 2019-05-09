export default {
	mapTournament (state, getters) {
		const currentTournaments = state.currentTournaments;
		return currentTournaments.reduce((res, current) => {
			res[current.tournamentId] = current;
			return res;
		}, {});
	},
	tournamentQuery (state, getters) {
		const tmp = {};
		const res = state.currentTournaments.reduce((res, cur) => {
			if (!tmp[cur.categoryId]) {
				tmp[cur.categoryId] = 1;
				res.categoryId.push(cur.categoryId);
			}
			res.tournamentId.push(cur.tournamentId);
			return res;
		}, {
			categoryId: [],
			tournamentId: []
		});
		return {
			categoryId: res.categoryId.join('_'),
			tournamentId: res.tournamentId.join('_')
		};
	}
};
