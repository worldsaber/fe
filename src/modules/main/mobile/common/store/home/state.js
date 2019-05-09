// state取默认值
export default {
	homeCfg: {
		// 渠道信息
		ch: '',
		// 顶部广告
		topAd: '',
		// 轮播图
		mainBanner: [],
		// 推荐玩法
		popularList: []
	},
	// 顶级分类
	topSportList: [],
	// 推荐比赛
	recommendEvents: null,
	// 直播比赛
	live: {
		events: {},
		eventOrder: {}
	},
	// 当前的liveId
	currentLiveId: '',
	// today sports比赛
	todaySports: [],
	// top leagues 比赛
	topLeagues: {},
	// 默认football
	currentSportId: 'sr:sport:1',
	// recommend 模块loading
	recommendLoading: true,
	// 直播模块整个loading
	liveLoading: true,
	// today sport 模块loading
	todaySportsLoading: true,

	// top leagues 模块loading
	topLeaguesLoading: true,

	// 暂时无用
	// 切换赛事loading
	// changeSportsLoading: false,
	// 切换liveloaiding
	// changeLiveLoading: false,
	// sport比赛要显示的id
	marketIds: {
		// 足球 (3way)
		'sr:sport:1': 1,
		// 篮球 (2way)
		'sr:sport:2': 219,
		// 网球 (Tennis) 2 way
		'sr:sport:5': 186,
		// 橄榄球 (Rugby) 3way
		'sr:sport:12': 1,
		// 板球 (Cricket) 2way
		'sr:sport:21': 340
	},
	// live比赛要显示的marketid
	liveMarketIds: {
		// 足球 (3way)
		'sr:sport:1': 1,
		// 篮球 (2way)
		'sr:sport:2': 219,
		// 网球 (Tennis) 2 way
		'sr:sport:5': 186,
		// 橄榄球 (Rugby) Goals over/under
		'sr:sport:12': 18,
		// 板球 (Cricket) 2way
		'sr:sport:21': 340,
		// Volleyball: 2 Way
		'sr:sport:23': 186,
		// Ice Hockey: 3 Way
		'sr:sport:4': 1,
		// Handball: 3 Way
		'sr:sport:6': 1,
		// Darts: 2 Way
		'sr:sport:22': 186,
		// Beach Volleyball: 2 Way
		'sr:sport:34': 186
	},
	// product status
	liveProductStatus: 0,
	sportProductStatus: 0,
	recommendProductStatus: 0,

	// 大数据推荐比赛（定制比赛）
	customEvents: [],
	customEventsLoading: true,

	mixHighlightLoading: true,

	// Top Team 比赛
	mixHighlightEvents: [],
	// highlights top leagues
	mixHighlightLeagues: {}
};
