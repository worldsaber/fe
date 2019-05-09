export default {
	// 左侧sidebar的列表
	// sidebar其实在 eventList和eventView都会显示，但是只会操作 eventList，所以store放到eventList中
	// a-z的菜单
	sportList: [],
	// 当前流行玩法菜单
	popularEvents: [],
	currentTime: '0',
	/**
	 * 当前选择的联赛，sidebar操作的一个结果
	 * [{
	 * 		tournamentName,
	 * 		tournamentId,
	 * 		categoryId,
	 * 		categoryName
	 * }]
	 */
	currentTournaments: [],
	// 当前运动类型
	currentSportId: null,
	productId: 3
};
