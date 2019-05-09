// 列表页面可能显示的market对应的title
export const marketsTtile = {
	// 足球
	'sr:sport:1': {
		// 3 way
		1: ['1', 'X', '2'],
		// next goal
		// 暂时不显示'Goal',
		8: ['1', 'No Goal', '2'],
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
		// 11: ['1', '2'],
		// 2 way
		340: ['1', '2'],
		639: ['Fours', 'Over', 'Under'],
	},
	// Volleyball
	'sr:sport:23': {
		// 2 Way
		186: ['1', '2'],
		// O/U
		238: ['Points', 'Over', 'Under']
	},
	// Ice Hockey
	'sr:sport:4': {
		// 3 Way
		1: ['1', 'X', '2'],
		// O/U
		18: ['Goals', 'Over', 'Under'],
		// Double Chance
		10: ['1X', '12', 'X2'],
		// Draw no bet
		11: ['1', '2'],
		// Odd/Even
		26: ['Odd', 'Even']
	},
	// handball
	'sr:sport:6': {
		// 3 Way
		1: ['1', 'X', '2'],
		// O/U
		18: ['Goals', 'Over', 'Under'],
		// Handicap
		16: ['1', '2'],
		// Odd/Even
		26: ['Odd', 'Even'],
		// Double Chance
		10: ['1X', '12', 'X2'],
		// Draw no bet
		11: ['1', '2'],
	},
	// Darts
	'sr:sport:22': {
		// 2 Way
		186: ['1', '2'],
		// Odd/Even
		368: ['Odd', 'Even'],
	},
	// beach volleball
	'sr:sport:34': {
		// 2 Way
		186: ['1', '2'],
		// O/U
		238: ['Points', 'Over', 'Under']
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
		29: 2
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
		// Total Fours
		639: ['Fours', 2],
	},
	// Volleyball
	'sr:sport:23': {
		// 2 Way
		186: 2,
		// O/U
		238: ['Points', 2]
	},
	// Ice Hockey
	'sr:sport:4': {
		// 3 Way
		1: 3,
		// O/U
		18: ['Goals', 2],
		// Double Chance
		10: 3,
		// Draw no bet
		11: 2,
		// Odd/Even
		26: 2
	},
	// handball
	'sr:sport:6': {
		// 3 Way
		1: 3,
		// O/U
		18: ['Goals', 2],
		// Handicap
		16: 2,
		// Odd/Even
		26: 2,
		// Double Chance
		10: 3,
		// Draw no bet
		11: 2,
	},
	// Darts
	'sr:sport:22': {
		// 2 Way
		186: 2,
		// Odd/Even
		368: 2,
	},
	// beach volleball
	'sr:sport:34': {
		// 2 Way
		186: 2,
		// O/U
		238: ['Points', 2]
	}
};
