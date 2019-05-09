// 列表页面可能显示的market对应的title
export const marketsTtile = {
	// 足球
	'sr:sport:1': {
		// 3 way
		1: ['1', 'X', '2'],
		// next goal
		8: ['Goal', '1', 'No Goal', '2'],
		// Double Chance
		10: ['1X', '12', 'X2'],
		// Draw No Bet
		11: ['1', '2'],
		// Handicap
		14: ['Handicap', '1H', 'XH', '2H'],
		// Over/Under
		18: ['Goals', 'Over', 'Under'],
		// Odd/Even
		26: ['Odd', 'Even'],
		// Total O/U & GG/NG
		36: ['O&GG', 'U&GG', 'O&NG', 'U&NG'],
		// GG /NG Both teams to score
		29: ['GG', 'NG']
	},
	// 篮球
	'sr:sport:2': {
		// 3 way
		1: ['1', 'X', '2'],
		// Draw No Bet
		11: ['1', '2'],
		// 3 Way Handicap
		14: ['Handicap', '1H', 'XH', '2H'],
		// 2 Way Handicap
		16: ['Handicap', '1H', '2H'],
		// Over/Under
		18: ['Points', 'Over', 'Under'],
		// 2 way
		219: ['1', '2'],
	},
	// ice hockey
	'sr:sport:4': {
		// 3 way
		1: ['1', 'X', '2'],
		// double change
		10: ['1X', '12', 'X2'],
		// Draw no bet
		11: ['1', '2'],
		//  3 way Handicap
		14: ['Handicap', '1', 'X', '2'],
		// Total
		18: ['Goals', 'Over', 'Under'],
		// odd/even
		26: ['Odd', 'Even'],
		// 进球最多period
		// 432: ['1st', '2nd', '3rd', 'equal'],
	},
	// 网球 (Tennis)
	'sr:sport:5': {
		// 2 way
		186: ['1', '2'],
		// Game handicap
		187: ['Handicap', '1H', '2H'],
		// Set handicap
		188: ['Handicap', '1H', '2H'],
		// Over/Under
		189: ['Games', 'Over', 'Under'],
		// Set Winner
		202: ['Set', '1', '2']
	},
	// handball
	'sr:sport:6': {
		// 3 way
		1: ['1', 'X', '2'],
		// double change
		10: ['1X', '12', 'X2'],
		// Draw no bet
		11: ['1', '2'],
		// handicap 2 way
		16: ['Handicap', '1', '2'],
		// Total Over/Under
		18: ['Goals', 'Over', 'Under'],
		// // Home Total Odd/Even
		// 19: ['Odd', 'Even'],
		// // Away Total Odd/Even
		// 20: ['Odd', 'Even'],
		// 总进球 Odd/Even
		26: ['Odd', 'Even'],
		// // 1st half - 1x2
		// 60: ['1', 'X', '2'],
		// // 1st - Odd/Even
		// 74: ['Odd', 'Even'],
	},
	// 橄榄球 (Rugby)
	'sr:sport:12': {
		// 3 way
		1: ['1', 'X', '2'],
		// 3 Way Handicap
		14: ['Handicap', '1H', 'XH', '2H'],
		// 2 Way Handicap
		16: ['Handicap', '1H', '2H'],
		// Over/Under
		18: ['Points', 'Over', 'Under'],
		// 1st Half Total Tries
		487: ['Tries', 'Over', 'Under']
	},
	// 板球 (Cricket)
	'sr:sport:21': {
		// 3 way
		1: ['1', 'X', '2'],
		// Draw No Bet
		11: ['1', '2'],
		// 2 way
		340: ['1', '2'],
		// Total Fours
		639: ['Fours', 'Over', 'Under'],
		// Total Sixes
		640: ['Sixes', 'Over', 'Under'],
		// Total Runouts
		654: ['Runouts', 'Over', 'Under'],
	},
	// darts
	'sr:sport:22': {
		// winner
		186: ['1', '2'],
		// Odd/Even sets
		368: ['Odd', 'Even']
	},
	// volleyball
	'sr:sport:23': {
		// winner
		186: ['1', '2'],
		// Total Points Over/Under
		238: ['Points', 'Over', 'Under'],
	},
	'sr:sport:34': {
		// winner
		186: ['1', '2'],
		// Total Points Over/Under
		238: ['Points', 'Over', 'Under'],
	}
};

// 每个market下用的outcome数量，如果是 overunder则带上overunder的类型
export const marketsOutComeSize = {
	// 足球
	'sr:sport:1': {
		// 3 way
		1: 3,
		// next goal
		8: ['Goal', 3],
		// Double Chance
		10: 3,
		// Draw No Bet
		11: 2,
		// Over/Under
		18: ['Goals', 2],
		// Odd/Even
		26: 2,
		// Total O/U & GG/NG
		36: 4,
		// GG/NG
		29: 2,
		14: ['Handicap', 3]
	},
	// 篮球
	'sr:sport:2': {
		// 3 way
		1: 3,
		// Draw No Bet
		11: 2,
		// 3 Way Handicap
		14: ['Handicap', 3],
		// 2 Way Handicap
		16: ['Handicap', 2],
		// Over/Under
		18: ['Points', 2],
		// 2 way
		219: 2
	},
	'sr:sport:4': {
		// 3 way
		1: 3,
		// double change
		10: 3,
		// Draw no bet
		11: 2,
		//  3 way Handicap
		14: ['Hanicap', 3],
		// Total
		18: ['Goals', 2],
		// odd/even
		26: 2,
		// 进球最多period
		432: 4,
	},
	// 网球 (Tennis)
	'sr:sport:5': {
		// 2 way
		186: 2,
		// Game handicap
		187: ['Handicap', 2],
		// 1st Set handicap
		188: ['Handicap', 2],
		// Over/Under
		189: ['Games', 2],
		// 1st Set Winner
		202: ['set', 2]
	},
	// handball
	'sr:sport:6': {
		// 3 way
		1: 3,
		// double change
		10: 3,
		// Draw no bet
		11: 2,
		// handicap 2 way
		16: ['Handicap', 2],
		// Total Over/Under
		18: ['Goals', 2],
		// Home Total Odd/Even
		19: 2,
		// Away Total Odd/Even
		20: 2,
		// 总进球 Odd/Even
		26: 2,
		// 1st half - 1x2
		60: 3,
		// 1st - Odd/Even
		74: 2,
	},
	// 橄榄球 (Rugby)
	'sr:sport:12': {
		// 3 way
		1: 3,
		// 3 Way Handicap
		14: ['Handicap', 3],
		// 2 Way Handicap
		16: ['Handicap', 2],
		// Over/Under
		18: ['Points', 2],
		// 1st Half Total Tries
		487: ['Tries', 2]
	},
	// 板球 (Cricket)
	'sr:sport:21': {
		// 3 way
		1: 3,
		// draw no bet
		11: 2,
		// 2 way
		340: 2,
		639: ['Fours', 2],
		640: ['Sixes', 2],
		654: ['Runouts', 2],
	},
	// darts
	'sr:sport:22': {
		// winner
		186: 2,
		// Odd/Even sets
		368: 2
	},
	// volleyball
	'sr:sport:23': {
		// winner
		186: 2,
		// Total Points Over/Under
		238: ['Points', 2],
	},
	'sr:sport:34': {
		// winner
		186: 2,
		// Total Points Over/Under
		238: ['Points', 2],
	}
};

// 当前列表页面可能用到的marketName
export const marketNameForLive = {
	// 足球
	'sr:sport:1': {
		1: '3 Way',
		8: 'Next Goals',
	},
	// 篮球
	'sr:sport:2': {
		1: '3 Way',
		18: 'Points',
		219: '2 Way'
	},
	// ice hockey
	'sr:sport:4': {
		1: '3 Way',
		18: 'Goals'
	},
	// 网球 (Tennis)
	'sr:sport:5': {
		186: '2 Way',
		202: 'Set Winner'
	},
	// handball
	'sr:sport:6': {
		1: '3 Way',
		18: 'Goals'
	},
	// 橄榄球 (Rugby)
	'sr:sport:12': {
		1: '3 Way',
		18: 'Points'
	},
	// 板球 (Cricket)
	'sr:sport:21': {
		11: 'Draw No Bet',
		340: '2 Way',
		639: 'Total Fours',
	},
	// darts
	'sr:sport:22': {
		// winner
		186: '2 Way',
		// Odd/Even sets
		368: 'Odd/Even'
	},
	// volleyball
	'sr:sport:23': {
		// winner
		186: '2 Way',
		// Total Points Over/Under
		238: 'Points',
	},
	'sr:sport:34': {
		// winner
		186: '2 Way',
		// Total Points Over/Under
		238: 'Points',
	}
};
