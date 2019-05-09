// state取默认值
export default {
	// loading
	sportLoading: true,
	// 是否显示分页
	isShowPagination: false,
	// 赛事数据
	sport: {
		map: {},
		tournamentOrder: []
	},
	// 记录当前分页的页面，这里 upcomeing today game default game公用数据
	pageSize: 100,
	pageNum: 1,
	totalNum: 0,
	marketGroup: {
		// 足球
		'sr:sport:1': [{
			name: '3 Way & O/U',
			markets: [1, 18]
		}, {
			name: 'Double Chance',
			markets: [10]
		}, {
			name: 'GG/NG',
			markets: [29]
		}, {
			name: 'Draw No Bet',
			markets: [11]
		}, {
			name: 'Odd/Even',
			markets: [26]
		}, {
			name: 'O/U 2.5 & GG/NG',
			markets: [36]
		}, {
			name: 'Handicap',
			markets: [14]
		}],
		// 篮球
		'sr:sport:2': [{
			name: '2 Way & O/U',
			markets: [219, 18]
		}, {
			name: '2 Way Handicap',
			markets: [16]
		}, {
			name: '3 Way',
			markets: [1]
		}, {
			name: '3 Way Handicap',
			markets: [14]
		}, {
			name: 'Draw No Bet',
			markets: [11]
		}],
		// ice hockey
		'sr:sport:4': [{
			name: '3 Way & O/U',
			markets: [1, 18],
		}, {
			name: 'Double Chance',
			markets: [10],
		}, {
			name: 'Draw No Bet',
			markets: [11]
		}, {
			name: 'Odd/Even',
			markets: [26]
		}],
		// 网球 (Tennis)
		'sr:sport:5': [{
			name: '2 Way & O/U',
			markets: [186, 189]
		}, {
			name: 'Set Winner',
			markets: [202]
		}, {
			name: 'Set Handicap',
			markets: [188]
		}, {
			name: 'Game Handicap',
			markets: [187]
		}],
		// handball
		'sr:sport:6': [{
			name: '3 Way & O/U',
			markets: [1, 18],
		}, {
			name: 'Double Chance',
			markets: [10],
		}, {
			name: 'Draw No Bet',
			markets: [11]
		}, {
			name: 'Odd/Even',
			markets: [26],
		}, {
			name: 'Handicap',
			markets: [16],
		}],
		// 橄榄球 (Rugby)
		'sr:sport:12': [{
			name: '3 Way & O/U',
			markets: [1, 18]
		}, {
			name: '3 Way Handicap',
			markets: [14]
		}, {
			name: '2 Way Handicap',
			markets: [16]
		}, {
			name: '1st Half Total Tries',
			markets: [487]
		}],
		// 板球 (Cricket)
		'sr:sport:21': [{
			name: '2 Way',
			markets: [340]
		}, {
			name: 'Total Fours',
			markets: [639]
		}, {
			name: '3 Way',
			markets: [1]
		}, {
			name: 'Total Sixes',
			markets: [640],
		}, {
			name: 'Total Runouts',
			markets: [654],
		}],
		// darts
		'sr:sport:22': [{
			name: '2 Way',
			markets: [186],
		}, {
			name: 'Odd/Even',
			markets: [368],
		}],
		// volleyball
		'sr:sport:23': [{
			name: '2 Way & O/U',
			markets: [186, 238],
		}],
		// beach volleyball
		'sr:sport:34': [{
			name: '2 Way & O/U',
			markets: [186, 238],
		}],
	},
	// live head2head 状态
	h2hStatus: {},
	// 标记整个比赛是否可以投注
	productStatus: 0,
};
