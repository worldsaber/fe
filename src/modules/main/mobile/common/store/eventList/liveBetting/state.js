import sportsConfig from 'config/sports';

// state取默认值
export default {
	// sport 模块整个loading -- 暂时无用
	sportsLoading: true,
	// 切换赛事loading
	changeSportsLoading: true,
	// 赛事数据
	sport: {},
	// 当前每个运动支持的market
	marketIds: {
		// 足球 (3way)
		'sr:sport:1': [1, 18, 10, 8],
		// 篮球 (2way)
		'sr:sport:2': [219],
		// 网球 (Tennis) 2 way
		'sr:sport:5': [186],
		// 橄榄球 (Rugby) Goals over/under
		'sr:sport:12': [18],
		// 板球 (Cricket) 2way
		'sr:sport:21': [340],
		// Volleyball
		'sr:sport:23': [186],
		// Ice Hockey
		'sr:sport:4': [1],
		// Handball
		'sr:sport:6': [1],
		// Darts
		'sr:sport:22': [186],
		// Beach Volleyball
		'sr:sport:34': [186],
	},
	upComingMarketIds: {
		// 足球 (3way)
		'sr:sport:1': 1,
		// 篮球 (2way)
		'sr:sport:2': 219,
		// 网球 (Tennis) 2 way
		'sr:sport:5': 186,
		// 橄榄球 (Rugby) 3way
		'sr:sport:12': 1,
		// 板球 (Cricket) 2way
		'sr:sport:21': 340,
		// Volleyball
		'sr:sport:23': 186,
		// Ice Hockey
		'sr:sport:4': 1,
		// Handball
		'sr:sport:6': 1,
		// Darts
		'sr:sport:22': 186,
		// Beach Volleyball
		'sr:sport:34': 186
	},
	// 所有的运动类型写死
	sportList: Object.values(sportsConfig).map(sport => ({
		id: sport.id,
		icon: sport.icon,
		name: sport.text,
		eventSize: 0
	})),
	currentSportId: null,
	// 标记整个比赛是否可以投注
	productStatus: 0,
	sportProductStatus: 0,
	curMarketId: '',
	upComingEvents: [],
	filterLiveStream: false
};
