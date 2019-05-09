export default {
	// 将sportSize转换程map数据
	mapSportSize (state, getters) {
		const result = {};
		(state.sportSize || []).reduce((res, sport) => {
			if (sport) {
				const cp = { ...sport };
				if (cp.categories) {
					cp.categories = cp.categories.reduce((categories, category) => {
						if (category.tournaments) {
							const ca = { ...category };
							ca.tournaments = ca.tournaments.reduce((tournaments, tournament) => {
								tournaments[tournament.id] = tournament;
								return tournaments;
							}, {});
							categories[ca.id] = ca;
						}
						return categories;
					}, {});
				}
				res[cp.id] = cp;
			}
			return res;
		}, result);
		return result;
	}
};
