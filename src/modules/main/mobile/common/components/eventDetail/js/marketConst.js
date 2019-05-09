
/*
football: 35, 36, 37, 78, 79, 134, 184, 540, 541, 542, 543, 544, 545, 546, 547
basketball: 15、290、292、301
---- tennis: 214 -- 无用
rugby: 15、37、467、470

	comboMarket表示是speciefier是&符号组合，并显示成行列模式的情况
	normalMarket表示正常显示的market，包括 一行2个，一行三个，2行4个和其他

	playerSpeciefierComboMarket表示是palayer玩法中的market，
	多个speciefier组合 足球 Player Assists (Market ID 770) 足球 Player Goals (Market ID 775)

	ouSpeciefierComboMarket表示是overUnder玩法中的market，多个speciefier组合 所有运动 O/U (Market ID 18)
 */
const showType = {
	// 足球
	'sr:sport:1': {
		comboMarket: [35, 36, 37, 78, 79, 134, 184, 540, 541, 542, 543, 544, 545, 546, 547],
		ouSpeciefierComboMarket: [18],
		playerAssistsSpeciefierComboMarket: [770],
		playerGoalSpeciefierComboMarket: [775]
	},
	// 篮球
	'sr:sport:2': {
		comboMarket: [292],
		ouSpeciefierComboMarket: [18]
	},
	// Tennis
	'sr:sport:5': {
		comboMarket: [],
		ouSpeciefierComboMarket: [18]
	},
	// Rugby
	'sr:sport:12': {
		comboMarket: [37, 467],
		ouSpeciefierComboMarket: [18]
	},
	// Cricket
	'sr:sport:21': {
		ouSpeciefierComboMarket: [18]
	},
	// Volleyball
	'sr:sport:23': {
		ouSpeciefierComboMarket: [18]
	},
	// Ice Hockey
	'sr:sport:4': {
		ouSpeciefierComboMarket: [18]
	},
	// Handball
	'sr:sport:6': {
		ouSpeciefierComboMarket: [18]
	},
	// Darts
	'sr:sport:22': {
		ouSpeciefierComboMarket: [18]
	},
	// Beach Volley
	'sr:sport:34': {
		ouSpeciefierComboMarket: [18]
	}
};

// 所有类型的market
const defautlMarketType = ['normalMarket', 'comboMarket'];
// 组合类型的market
const comboSpecifierMarketType = [
	'ouSpeciefierComboMarket',
	'playerAssistsSpeciefierComboMarket',
	'playerGoalSpeciefierComboMarket'];

// 返回所有的market的类型
const marketType = defautlMarketType.concat(comboSpecifierMarketType);

export {
	showType,
	defautlMarketType,
	comboSpecifierMarketType,
	marketType
};
