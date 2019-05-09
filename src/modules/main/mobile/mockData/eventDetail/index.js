import mockjax from 'mock';
/*
赛事详情
params: eventId
 */
mockjax.get('/factsCenter/event', {
	bizCode: 10000,
	message: '',
	data: {
		eventId: 'sr:match:11439789',
		estimateStartTime: 1506798000000,
		status: 0,
		playedSeconds: '62:00',
		setScore: '2:3',
		homeTeamName: 'EC Bahia BA',
		awayTeamName: 'Coritiba PR',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:13',
				name: 'Brazil',
				tournament: {
					id: 'sr:tournament:325',
					name: 'Brasileiro Serie A'
				}
			}
		},
		markets: [{
			id: '1',
			product: 3,
			desc: '1x2',
			status: 0,
			group: 'main',
			marketGuide: '玩法说明',
			title: '1,X,2',
			name: '3Way',
			outcomes: [{
				id: '1',
				odds: '1.77',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '2',
				odds: '3.25',
				isActive: 1,
				desc: 'draw'
			}, {
				id: '3',
				odds: '4.4',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '8',
			specifier: 'goalnr=1',
			product: 3,
			desc: 'first goal',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '7',
				odds: '8.2',
				isActive: 1,
				desc: 'none'
			}, {
				id: '6',
				odds: '1.61',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '8',
				odds: '2.8',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '9',
			product: 3,
			desc: 'Last goal',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '7',
				odds: '8.2',
				isActive: 1,
				desc: 'none'
			}, {
				id: '6',
				odds: '1.61',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '8',
				odds: '2.8',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '10',
			product: 3,
			desc: 'Double chance',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '9',
				odds: '1.17',
				isActive: 1,
				desc: 'EC Bahia BA or draw'
			}, {
				id: '10',
				odds: '1.27',
				isActive: 1,
				desc: 'EC Bahia BA or Coritiba PR'
			}, {
				id: '11',
				odds: '1.78',
				isActive: 1,
				desc: 'draw or Coritiba PR'
			}]
		}, {
			id: '11',
			product: 3,
			desc: 'Draw no bet',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '4',
				odds: '1.29',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '5',
				odds: '3.05',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '12',
			product: 3,
			desc: 'EC Bahia BA no bet',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '776',
				odds: '1.58',
				isActive: 1,
				desc: 'draw'
			}, {
				id: '778',
				odds: '2.13',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '13',
			product: 3,
			desc: 'Coritiba PR no bet',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '780',
				odds: '1.42',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '782',
				odds: '2.5',
				isActive: 1,
				desc: 'draw'
			}]
		}, {
			id: '14',
			specifier: 'hcp=0:1',
			product: 3,
			desc: 'Handicap 0:1',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1711',
				odds: '3.3',
				isActive: 1,
				desc: 'EC Bahia BA (0:1)'
			}, {
				id: '1712',
				odds: '3.5',
				isActive: 1,
				desc: 'draw (0:1)'
			}, {
				id: '1713',
				odds: '1.95',
				isActive: 1,
				desc: 'Coritiba PR (0:1)'
			}]
		}, {
			id: '14',
			specifier: 'hcp=0:2',
			product: 3,
			desc: 'Handicap 0:2',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1711',
				odds: '7.4',
				isActive: 1,
				desc: 'EC Bahia BA (0:2)'
			}, {
				id: '1712',
				odds: '5.2',
				isActive: 1,
				desc: 'draw (0:2)'
			}, {
				id: '1713',
				odds: '1.3',
				isActive: 1,
				desc: 'Coritiba PR (0:2)'
			}]
		}, {
			id: '14',
			specifier: 'hcp=1:0',
			product: 3,
			desc: 'Handicap 1:0',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1711',
				odds: '1.18',
				isActive: 1,
				desc: 'EC Bahia BA (1:0)'
			}, {
				id: '1712',
				odds: '5.8',
				isActive: 1,
				desc: 'draw (1:0)'
			}, {
				id: '1713',
				odds: '12.0',
				isActive: 1,
				desc: 'Coritiba PR (1:0)'
			}]
		}, {
			id: '14',
			specifier: 'hcp=2:0',
			product: 3,
			desc: 'Handicap 2:0',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1711',
				odds: '1.03',
				isActive: 1,
				desc: 'EC Bahia BA (2:0)'
			}, {
				id: '1712',
				odds: '10.0',
				isActive: 1,
				desc: 'draw (2:0)'
			}, {
				id: '1713',
				odds: '30.0',
				isActive: 1,
				desc: 'Coritiba PR (2:0)'
			}]
		}, {
			id: '15',
			specifier: 'variant=sr:winning_margin:3+',
			product: 3,
			desc: 'Winning margin',
			status: 0,
			group: 'main',
			outcomes: [{
				id: 'sr:winning_margin:3+:119',
				odds: '3.3',
				isActive: 1,
				desc: 'X'
			}, {
				id: 'sr:winning_margin:3+:115',
				odds: '8.2',
				isActive: 1,
				desc: 'HT > 2'
			}, {
				id: 'sr:winning_margin:3+:114',
				odds: '5.6',
				isActive: 1,
				desc: 'HT 2'
			}, {
				id: 'sr:winning_margin:3+:113',
				odds: '3.6',
				isActive: 1,
				desc: 'HT 1'
			}, {
				id: 'sr:winning_margin:3+:116',
				odds: '6.6',
				isActive: 1,
				desc: 'AT 1'
			}, {
				id: 'sr:winning_margin:3+:117',
				odds: '19.0',
				isActive: 1,
				desc: 'AT 2'
			}, {
				id: 'sr:winning_margin:3+:118',
				odds: '60.0',
				isActive: 1,
				desc: 'AT > 2'
			}]
		}, {
			id: '16',
			specifier: 'hcp=-0.25',
			product: 3,
			desc: 'Handicap',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1714',
				odds: '1.52',
				isActive: 1,
				desc: 'EC Bahia BA (-0.25)'
			}, {
				id: '1715',
				odds: '2.27',
				isActive: 1,
				desc: 'Coritiba PR (0.25)'
			}]
		}, {
			id: '16',
			specifier: 'hcp=-0.5',
			product: 3,
			desc: 'Handicap',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1714',
				odds: '1.74',
				isActive: 1,
				desc: 'EC Bahia BA (-0.5)'
			}, {
				id: '1715',
				odds: '1.91',
				isActive: 1,
				desc: 'Coritiba PR (0.5)'
			}]
		}, {
			id: '16',
			specifier: 'hcp=-0.75',
			product: 3,
			desc: 'Handicap',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1714',
				odds: '1.97',
				isActive: 1,
				desc: 'EC Bahia BA (-0.75)'
			}, {
				id: '1715',
				odds: '1.69',
				isActive: 1,
				desc: 'Coritiba PR (0.75)'
			}]
		}, {
			id: '16',
			specifier: 'hcp=-1',
			product: 3,
			desc: 'Handicap',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1714',
				odds: '2.41',
				isActive: 1,
				desc: 'EC Bahia BA (-1.0)'
			}, {
				id: '1715',
				odds: '1.46',
				isActive: 1,
				desc: 'Coritiba PR (1.0)'
			}]
		}, {
			id: '16',
			specifier: 'hcp=-1.25',
			product: 3,
			desc: 'Handicap',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1714',
				odds: '2.75',
				isActive: 1,
				desc: 'EC Bahia BA (-1.25)'
			}, {
				id: '1715',
				odds: '1.36',
				isActive: 1,
				desc: 'Coritiba PR (1.25)'
			}]
		}, {
			id: '18',
			specifier: 'total=0.5',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '1.07',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '6.0',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '18',
			specifier: 'total=1.5',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '1.39',
				isActive: 1,
				desc: 'over 1.5'
			}, {
				id: '13',
				odds: '2.65',
				isActive: 1,
				desc: 'under 1.5'
			}]
		}, {
			id: '18',
			specifier: 'total=1.75',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '1.49',
				isActive: 1,
				desc: 'over 1.75'
			}, {
				id: '13',
				odds: '2.33',
				isActive: 1,
				desc: 'under 1.75'
			}]
		}, {
			id: '18',
			specifier: 'total=2',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '1.66',
				isActive: 1,
				desc: 'over 2'
			}, {
				id: '13',
				odds: '2.01',
				isActive: 1,
				desc: 'under 2'
			}]
		}, {
			id: '18',
			specifier: 'total=2.25',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '1.93',
				isActive: 1,
				desc: 'over 2.25'
			}, {
				id: '13',
				odds: '1.72',
				isActive: 1,
				desc: 'under 2.25'
			}]
		}, {
			id: '18',
			specifier: 'total=2.5',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '2.19',
				isActive: 1,
				desc: 'over 2.5'
			}, {
				id: '13',
				odds: '1.55',
				isActive: 1,
				desc: 'under 2.5'
			}]
		}, {
			id: '18',
			specifier: 'total=2.75',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '2.55',
				isActive: 1,
				desc: 'over 2.75'
			}, {
				id: '13',
				odds: '1.41',
				isActive: 1,
				desc: 'under 2.75'
			}]
		}, {
			id: '18',
			specifier: 'total=3.5',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '3.85',
				isActive: 1,
				desc: 'over 3.5'
			}, {
				id: '13',
				odds: '1.19',
				isActive: 1,
				desc: 'under 3.5'
			}]
		}, {
			id: '18',
			specifier: 'total=4.5',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '6.8',
				isActive: 1,
				desc: 'over 4.5'
			}, {
				id: '13',
				odds: '1.05',
				isActive: 1,
				desc: 'under 4.5'
			}]
		}, {
			id: '18',
			specifier: 'total=5.5',
			product: 3,
			desc: 'Total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '12',
				odds: '9.2',
				isActive: 1,
				desc: 'over 5.5'
			}, {
				id: '13',
				odds: '1.008',
				isActive: 1,
				desc: 'under 5.5'
			}]
		}, {
			id: '19',
			specifier: 'total=1.5',
			product: 3,
			desc: 'EC Bahia BA total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '2.04',
				isActive: 1,
				desc: 'over 1.5'
			}, {
				id: '13',
				odds: '1.64',
				isActive: 1,
				desc: 'under 1.5'
			}]
		}, {
			id: '20',
			specifier: 'total=0.5',
			product: 3,
			desc: 'Coritiba PR total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '1.65',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '2.03',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '21',
			specifier: 'variant=sr:exact_goals:6+',
			product: 3,
			desc: 'Exact goals',
			status: 0,
			group: 'main',
			outcomes: [{
				id: 'sr:exact_goals:6+:68',
				odds: '8.6',
				isActive: 1,
				desc: '0'
			}, {
				id: 'sr:exact_goals:6+:69',
				odds: '4.1',
				isActive: 1,
				desc: '1'
			}, {
				id: 'sr:exact_goals:6+:70',
				odds: '3.4',
				isActive: 1,
				desc: '2'
			}, {
				id: 'sr:exact_goals:6+:71',
				odds: '4.5',
				isActive: 1,
				desc: '3'
			}, {
				id: 'sr:exact_goals:6+:72',
				odds: '7.6',
				isActive: 1,
				desc: '4'
			}, {
				id: 'sr:exact_goals:6+:73',
				odds: '17.0',
				isActive: 1,
				desc: '5'
			}, {
				id: 'sr:exact_goals:6+:74',
				odds: '29.0',
				isActive: 1,
				desc: '6+'
			}]
		}, {
			id: '23',
			specifier: 'variant=sr:exact_goals:3+',
			product: 3,
			desc: 'EC Bahia BA exact goals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: 'sr:exact_goals:3+:88',
				odds: '4.0',
				isActive: 1,
				desc: '0'
			}, {
				id: 'sr:exact_goals:3+:89',
				odds: '2.75',
				isActive: 1,
				desc: '1'
			}, {
				id: 'sr:exact_goals:3+:90',
				odds: '3.65',
				isActive: 1,
				desc: '2'
			}, {
				id: 'sr:exact_goals:3+:91',
				odds: '4.7',
				isActive: 1,
				desc: '3+'
			}]
		}, {
			id: '24',
			specifier: 'variant=sr:exact_goals:3+',
			product: 3,
			desc: 'Coritiba PR exact goals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: 'sr:exact_goals:3+:88',
				odds: '2.09',
				isActive: 1,
				desc: '0'
			}, {
				id: 'sr:exact_goals:3+:89',
				odds: '2.5',
				isActive: 1,
				desc: '1'
			}, {
				id: 'sr:exact_goals:3+:90',
				odds: '6.0',
				isActive: 1,
				desc: '2'
			}, {
				id: 'sr:exact_goals:3+:91',
				odds: '18.0',
				isActive: 1,
				desc: '3+'
			}]
		}, {
			id: '25',
			specifier: 'variant=sr:point_range:6+',
			product: 3,
			desc: 'Goal range',
			status: 0,
			group: 'main',
			outcomes: [{
				id: 'sr:point_range:6+:1124',
				odds: '28.0',
				isActive: 1,
				desc: '6+'
			}, {
				id: 'sr:point_range:6+:1121',
				odds: '2.75',
				isActive: 1,
				desc: '0-1 goals'
			}, {
				id: 'sr:point_range:6+:1122',
				odds: '1.97',
				isActive: 1,
				desc: '2-3 goals'
			}, {
				id: 'sr:point_range:6+:1123',
				odds: '5.0',
				isActive: 1,
				desc: '4-5 goals'
			}]
		}, {
			id: '26',
			product: 3,
			desc: 'Odd/even',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '70',
				odds: '1.87',
				isActive: 1,
				desc: 'odd'
			}, {
				id: '72',
				odds: '1.77',
				isActive: 1,
				desc: 'even'
			}]
		}, {
			id: '27',
			product: 3,
			desc: 'EC Bahia BA odd/even',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '70',
				odds: '1.9',
				isActive: 1,
				desc: 'odd'
			}, {
				id: '72',
				odds: '1.74',
				isActive: 1,
				desc: 'even'
			}]
		}, {
			id: '28',
			product: 3,
			desc: 'Coritiba PR odd/even',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '70',
				odds: '2.2',
				isActive: 1,
				desc: 'odd'
			}, {
				id: '72',
				odds: '1.55',
				isActive: 1,
				desc: 'even'
			}]
		}, {
			id: '29',
			product: 3,
			desc: 'Both teams to score',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '74',
				odds: '2.05',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.63',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '30',
			product: 3,
			desc: 'Which team to score',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '784',
				odds: '8.4',
				isActive: 1,
				desc: 'none'
			}, {
				id: '788',
				odds: '2.7',
				isActive: 1,
				desc: 'only EC Bahia BA'
			}, {
				id: '790',
				odds: '7.4',
				isActive: 1,
				desc: 'only Coritiba PR'
			}, {
				id: '792',
				odds: '2.11',
				isActive: 1,
				desc: 'both teams'
			}]
		}, {
			id: '31',
			product: 3,
			desc: 'EC Bahia BA clean sheet',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '2.03',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.65',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '32',
			product: 3,
			desc: 'Coritiba PR clean sheet',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '3.6',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.22',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '33',
			product: 3,
			desc: 'EC Bahia BA win to nil',
			status: 0,
			group: 'specials',
			outcomes: [{
				id: '74',
				odds: '2.55',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.41',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '34',
			product: 3,
			desc: 'Coritiba PR win to nil',
			status: 0,
			group: 'specials',
			outcomes: [{
				id: '74',
				odds: '5.6',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.09',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '35',
			product: 3,
			desc: '1x2 & both teams to score',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '78',
				odds: '4.8',
				isActive: 1,
				desc: 'EC Bahia BA & yes'
			}, {
				id: '80',
				odds: '2.75',
				isActive: 1,
				desc: 'EC Bahia BA & no'
			}, {
				id: '82',
				odds: '5.2',
				isActive: 1,
				desc: 'draw & yes'
			}, {
				id: '84',
				odds: '8.6',
				isActive: 1,
				desc: 'draw & no'
			}, {
				id: '86',
				odds: '12.0',
				isActive: 1,
				desc: 'Coritiba PR & yes'
			}, {
				id: '88',
				odds: '7.4',
				isActive: 1,
				desc: 'Coritiba PR & no'
			}]
		}, {
			id: '36',
			specifier: 'total=2.5',
			product: 3,
			desc: 'Total & both teams to score',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '90',
				odds: '2.9',
				isActive: 1,
				desc: 'over 2.5 & yes'
			}, {
				id: '92',
				odds: '7.0',
				isActive: 1,
				desc: 'under 2.5 & yes'
			}, {
				id: '94',
				odds: '9.2',
				isActive: 1,
				desc: 'over 2.5 & no'
			}, {
				id: '96',
				odds: '1.98',
				isActive: 1,
				desc: 'under 2.5 & no'
			}]
		}, {
			id: '37',
			specifier: 'total=1.5',
			product: 3,
			desc: '1x2 & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '794',
				odds: '6.2',
				isActive: 1,
				desc: 'EC Bahia BA & under 1.5'
			}, {
				id: '798',
				odds: '8.6',
				isActive: 1,
				desc: 'draw & under 1.5'
			}, {
				id: '802',
				odds: '11.0',
				isActive: 1,
				desc: 'Coritiba PR & under 1.5'
			}, {
				id: '796',
				odds: '2.44',
				isActive: 1,
				desc: 'EC Bahia BA & over 1.5'
			}, {
				id: '800',
				odds: '5.2',
				isActive: 1,
				desc: 'draw & over 1.5'
			}, {
				id: '804',
				odds: '7.4',
				isActive: 1,
				desc: 'Coritiba PR & over 1.5'
			}]
		}, {
			id: '37',
			specifier: 'total=2.5',
			product: 3,
			desc: '1x2 & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '794',
				odds: '3.6',
				isActive: 1,
				desc: 'EC Bahia BA & under 2.5'
			}, {
				id: '798',
				odds: '3.95',
				isActive: 1,
				desc: 'draw & under 2.5'
			}, {
				id: '802',
				odds: '8.2',
				isActive: 1,
				desc: 'Coritiba PR & under 2.5'
			}, {
				id: '796',
				odds: '3.35',
				isActive: 1,
				desc: 'EC Bahia BA & over 2.5'
			}, {
				id: '800',
				odds: '20.0',
				isActive: 1,
				desc: 'draw & over 2.5'
			}, {
				id: '804',
				odds: '10.0',
				isActive: 1,
				desc: 'Coritiba PR & over 2.5'
			}]
		}, {
			id: '37',
			specifier: 'total=3.5',
			product: 3,
			desc: '1x2 & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '794',
				odds: '2.33',
				isActive: 1,
				desc: 'EC Bahia BA & under 3.5'
			}, {
				id: '798',
				odds: '3.9',
				isActive: 1,
				desc: 'draw & under 3.5'
			}, {
				id: '802',
				odds: '5.4',
				isActive: 1,
				desc: 'Coritiba PR & under 3.5'
			}, {
				id: '796',
				odds: '7.0',
				isActive: 1,
				desc: 'EC Bahia BA & over 3.5'
			}, {
				id: '800',
				odds: '20.0',
				isActive: 1,
				desc: 'draw & over 3.5'
			}, {
				id: '804',
				odds: '28.0',
				isActive: 1,
				desc: 'Coritiba PR & over 3.5'
			}]
		}, {
			id: '37',
			specifier: 'total=4.5',
			product: 3,
			desc: '1x2 & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '794',
				odds: '2.0',
				isActive: 1,
				desc: 'EC Bahia BA & under 4.5'
			}, {
				id: '798',
				odds: '3.35',
				isActive: 1,
				desc: 'draw & under 4.5'
			}, {
				id: '802',
				odds: '4.9',
				isActive: 1,
				desc: 'Coritiba PR & under 4.5'
			}, {
				id: '796',
				odds: '14.0',
				isActive: 1,
				desc: 'EC Bahia BA & over 4.5'
			}, {
				id: '800',
				odds: '101.0',
				isActive: 1,
				desc: 'draw & over 4.5'
			}, {
				id: '804',
				odds: '50.0',
				isActive: 1,
				desc: 'Coritiba PR & over 4.5'
			}]
		}, {
			id: '41',
			specifier: 'score=0:0',
			product: 3,
			desc: 'Correct score [0:0]',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '114',
				odds: '6.2',
				isActive: 1,
				desc: '1.0:0.0'
			}, {
				id: '116',
				odds: '8.2',
				isActive: 1,
				desc: '2.0:0.0'
			}, {
				id: '130',
				odds: '10.0',
				isActive: 1,
				desc: '2.0:1.0'
			}, {
				id: '118',
				odds: '16.0',
				isActive: 1,
				desc: '3.0:0.0'
			}, {
				id: '132',
				odds: '20.0',
				isActive: 1,
				desc: '3.0:1.0'
			}, {
				id: '144',
				odds: '50.0',
				isActive: 1,
				desc: '3.0:2.0'
			}, {
				id: '120',
				odds: '45.0',
				isActive: 1,
				desc: '4.0:0.0'
			}, {
				id: '134',
				odds: '50.0',
				isActive: 1,
				desc: '4.0:1.0'
			}, {
				id: '146',
				odds: '101.0',
				isActive: 1,
				desc: '4.0:2.0'
			}, {
				id: '122',
				odds: '101.0',
				isActive: 1,
				desc: '5.0:0.0'
			}, {
				id: '136',
				odds: '101.0',
				isActive: 1,
				desc: '5.0:1.0'
			}, {
				id: '124',
				odds: '101.0',
				isActive: 1,
				desc: '6.0:0.0'
			}, {
				id: '110',
				odds: '8.6',
				isActive: 1,
				desc: '0.0:0.0'
			}, {
				id: '128',
				odds: '7.0',
				isActive: 1,
				desc: '1.0:1.0'
			}, {
				id: '142',
				odds: '23.0',
				isActive: 1,
				desc: '2.0:2.0'
			}, {
				id: '154',
				odds: '101.0',
				isActive: 1,
				desc: '3.0:3.0'
			}, {
				id: '126',
				odds: '12.0',
				isActive: 1,
				desc: '0.0:1.0'
			}, {
				id: '138',
				odds: '28.0',
				isActive: 1,
				desc: '0.0:2.0'
			}, {
				id: '140',
				odds: '19.0',
				isActive: 1,
				desc: '1.0:2.0'
			}, {
				id: '148',
				odds: '101.0',
				isActive: 1,
				desc: '0.0:3.0'
			}, {
				id: '150',
				odds: '70.0',
				isActive: 1,
				desc: '1.0:3.0'
			}, {
				id: '152',
				odds: '90.0',
				isActive: 1,
				desc: '2.0:3.0'
			}, {
				id: '156',
				odds: '101.0',
				isActive: 1,
				desc: '0.0:4.0'
			}, {
				id: '158',
				odds: '101.0',
				isActive: 1,
				desc: '1.0:4.0'
			}, {
				id: '160',
				odds: '101.0',
				isActive: 1,
				desc: '2.0:4.0'
			}, {
				id: '162',
				odds: '101.0',
				isActive: 1,
				desc: '0.0:5.0'
			}, {
				id: '164',
				odds: '101.0',
				isActive: 1,
				desc: '1.0:5.0'
			}, {
				id: '166',
				odds: '101.0',
				isActive: 1,
				desc: '0.0:6.0'
			}]
		}, {
			id: '45',
			product: 3,
			desc: 'Correct score',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '276',
				odds: '6.4',
				isActive: 1,
				desc: '1:0'
			}, {
				id: '278',
				odds: '8.4',
				isActive: 1,
				desc: '2:0'
			}, {
				id: '288',
				odds: '10.0',
				isActive: 1,
				desc: '2:1'
			}, {
				id: '280',
				odds: '17.0',
				isActive: 1,
				desc: '3:0'
			}, {
				id: '290',
				odds: '20.0',
				isActive: 1,
				desc: '3:1'
			}, {
				id: '300',
				odds: '50.0',
				isActive: 1,
				desc: '3:2'
			}, {
				id: '282',
				odds: '45.0',
				isActive: 1,
				desc: '4:0'
			}, {
				id: '292',
				odds: '50.0',
				isActive: 1,
				desc: '4:1'
			}, {
				id: '302',
				odds: '101.0',
				isActive: 1,
				desc: '4:2'
			}, {
				id: '274',
				odds: '8.8',
				isActive: 1,
				desc: '0:0'
			}, {
				id: '286',
				odds: '7.2',
				isActive: 1,
				desc: '1:1'
			}, {
				id: '298',
				odds: '23.0',
				isActive: 1,
				desc: '2:2'
			}, {
				id: '310',
				odds: '101.0',
				isActive: 1,
				desc: '3:3'
			}, {
				id: '284',
				odds: '12.0',
				isActive: 1,
				desc: '0:1'
			}, {
				id: '294',
				odds: '28.0',
				isActive: 1,
				desc: '0:2'
			}, {
				id: '296',
				odds: '19.0',
				isActive: 1,
				desc: '1:2'
			}, {
				id: '304',
				odds: '101.0',
				isActive: 1,
				desc: '0:3'
			}, {
				id: '306',
				odds: '70.0',
				isActive: 1,
				desc: '1:3'
			}, {
				id: '308',
				odds: '90.0',
				isActive: 1,
				desc: '2:3'
			}, {
				id: '314',
				odds: '101.0',
				isActive: 1,
				desc: '0:4'
			}, {
				id: '316',
				odds: '101.0',
				isActive: 1,
				desc: '1:4'
			}, {
				id: '318',
				odds: '101.0',
				isActive: 1,
				desc: '2:4'
			}, {
				id: '320',
				odds: '101.0',
				isActive: 1,
				desc: '3:4'
			}, {
				id: '312',
				odds: '101.0',
				isActive: 1,
				desc: '4:3'
			}, {
				id: '322',
				odds: '101.0',
				isActive: 1,
				desc: '4:4'
			}, {
				id: '324',
				odds: '45.0',
				isActive: 1,
				desc: 'other'
			}]
		}, {
			id: '46',
			product: 3,
			desc: 'Halftime/fulltime correct score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '326',
				odds: '8.8',
				isActive: 1,
				desc: '0:0 0:0'
			}, {
				id: '334',
				odds: '11.0',
				isActive: 1,
				desc: '0:0 1:0'
			}, {
				id: '328',
				odds: '20.0',
				isActive: 1,
				desc: '0:0 0:1'
			}, {
				id: '340',
				odds: '25.0',
				isActive: 1,
				desc: '0:0 2:0'
			}, {
				id: '336',
				odds: '22.0',
				isActive: 1,
				desc: '0:0 1:1'
			}, {
				id: '330',
				odds: '90.0',
				isActive: 1,
				desc: '0:0 0:2'
			}, {
				id: '344',
				odds: '90.0',
				isActive: 1,
				desc: '0:0 3:0'
			}, {
				id: '342',
				odds: '60.0',
				isActive: 1,
				desc: '0:0 2:1'
			}, {
				id: '338',
				odds: '101.0',
				isActive: 1,
				desc: '0:0 1:2'
			}, {
				id: '332',
				odds: '101.0',
				isActive: 1,
				desc: '0:0 0:3'
			}, {
				id: '346',
				odds: '70.0',
				isActive: 1,
				desc: '0:0 4+'
			}, {
				id: '374',
				odds: '15.0',
				isActive: 1,
				desc: '1:0 1:0'
			}, {
				id: '380',
				odds: '17.0',
				isActive: 1,
				desc: '1:0 2:0'
			}, {
				id: '376',
				odds: '29.0',
				isActive: 1,
				desc: '1:0 1:1'
			}, {
				id: '384',
				odds: '40.0',
				isActive: 1,
				desc: '1:0 3:0'
			}, {
				id: '382',
				odds: '35.0',
				isActive: 1,
				desc: '1:0 2:1'
			}, {
				id: '378',
				odds: '101.0',
				isActive: 1,
				desc: '1:0 1:2'
			}, {
				id: '386',
				odds: '27.0',
				isActive: 1,
				desc: '1:0 4+'
			}, {
				id: '348',
				odds: '29.0',
				isActive: 1,
				desc: '0:1 0:1'
			}, {
				id: '354',
				odds: '30.0',
				isActive: 1,
				desc: '0:1 1:1'
			}, {
				id: '350',
				odds: '60.0',
				isActive: 1,
				desc: '0:1 0:2'
			}, {
				id: '358',
				odds: '70.0',
				isActive: 1,
				desc: '0:1 2:1'
			}, {
				id: '356',
				odds: '70.0',
				isActive: 1,
				desc: '0:1 1:2'
			}, {
				id: '352',
				odds: '101.0',
				isActive: 1,
				desc: '0:1 0:3'
			}, {
				id: '360',
				odds: '50.0',
				isActive: 1,
				desc: '0:1 4+'
			}, {
				id: '400',
				odds: '45.0',
				isActive: 1,
				desc: '2:0 2:0'
			}, {
				id: '404',
				odds: '50.0',
				isActive: 1,
				desc: '2:0 3:0'
			}, {
				id: '402',
				odds: '90.0',
				isActive: 1,
				desc: '2:0 2:1'
			}, {
				id: '406',
				odds: '30.0',
				isActive: 1,
				desc: '2:0 4+'
			}, {
				id: '388',
				odds: '35.0',
				isActive: 1,
				desc: '1:1 1:1'
			}, {
				id: '392',
				odds: '45.0',
				isActive: 1,
				desc: '1:1 2:1'
			}, {
				id: '390',
				odds: '90.0',
				isActive: 1,
				desc: '1:1 1:2'
			}, {
				id: '394',
				odds: '30.0',
				isActive: 1,
				desc: '1:1 4+'
			}, {
				id: '362',
				odds: '101.0',
				isActive: 1,
				desc: '0:2 0:2'
			}, {
				id: '366',
				odds: '101.0',
				isActive: 1,
				desc: '0:2 1:2'
			}, {
				id: '364',
				odds: '101.0',
				isActive: 1,
				desc: '0:2 0:3'
			}, {
				id: '368',
				odds: '101.0',
				isActive: 1,
				desc: '0:2 4+'
			}, {
				id: '412',
				odds: '101.0',
				isActive: 1,
				desc: '3:0 3:0'
			}, {
				id: '414',
				odds: '70.0',
				isActive: 1,
				desc: '3:0 4+'
			}, {
				id: '408',
				odds: '101.0',
				isActive: 1,
				desc: '2:1 2:1'
			}, {
				id: '410',
				odds: '45.0',
				isActive: 1,
				desc: '2:1 4+'
			}, {
				id: '396',
				odds: '101.0',
				isActive: 1,
				desc: '1:2 1:2'
			}, {
				id: '398',
				odds: '80.0',
				isActive: 1,
				desc: '1:2 4+'
			}, {
				id: '370',
				odds: '101.0',
				isActive: 1,
				desc: '0:3 0:3'
			}, {
				id: '372',
				odds: '101.0',
				isActive: 1,
				desc: '0:3 4+'
			}, {
				id: '416',
				odds: '45.0',
				isActive: 1,
				desc: '4+ 4+'
			}]
		}, {
			id: '47',
			product: 3,
			desc: 'Halftime/fulltime',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '418',
				odds: '3.1',
				isActive: 1,
				desc: 'EC Bahia BA/EC Bahia BA'
			}, {
				id: '424',
				odds: '4.6',
				isActive: 1,
				desc: 'draw/EC Bahia BA'
			}, {
				id: '430',
				odds: '28.0',
				isActive: 1,
				desc: 'Coritiba PR/EC Bahia BA'
			}, {
				id: '420',
				odds: '17.0',
				isActive: 1,
				desc: 'EC Bahia BA/draw'
			}, {
				id: '426',
				odds: '5.2',
				isActive: 1,
				desc: 'draw/draw'
			}, {
				id: '432',
				odds: '18.0',
				isActive: 1,
				desc: 'Coritiba PR/draw'
			}, {
				id: '422',
				odds: '45.0',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR'
			}, {
				id: '428',
				odds: '10.0',
				isActive: 1,
				desc: 'draw/Coritiba PR'
			}, {
				id: '434',
				odds: '10.0',
				isActive: 1,
				desc: 'Coritiba PR/Coritiba PR'
			}]
		}, {
			id: '48',
			product: 3,
			desc: 'EC Bahia BA to win both halves',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '74',
				odds: '4.7',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.13',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '50',
			product: 3,
			desc: 'EC Bahia BA to win either half',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '74',
				odds: '1.46',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '2.4',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '51',
			product: 3,
			desc: 'Coritiba PR to win either half',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '74',
				odds: '2.65',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.39',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '52',
			product: 3,
			desc: 'Highest scoring half',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '436',
				odds: '3.15',
				isActive: 1,
				desc: '1st half'
			}, {
				id: '438',
				odds: '2.13',
				isActive: 1,
				desc: '2nd half'
			}, {
				id: '440',
				odds: '3.15',
				isActive: 1,
				desc: 'equal'
			}]
		}, {
			id: '53',
			product: 3,
			desc: 'EC Bahia BA highest scoring half',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '436',
				odds: '3.4',
				isActive: 1,
				desc: '1st half'
			}, {
				id: '438',
				odds: '2.46',
				isActive: 1,
				desc: '2nd half'
			}, {
				id: '440',
				odds: '2.5',
				isActive: 1,
				desc: 'equal'
			}]
		}, {
			id: '54',
			product: 3,
			desc: 'Coritiba PR highest scoring half',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '436',
				odds: '4.3',
				isActive: 1,
				desc: '1st half'
			}, {
				id: '438',
				odds: '3.2',
				isActive: 1,
				desc: '2nd half'
			}, {
				id: '440',
				odds: '1.8',
				isActive: 1,
				desc: 'equal'
			}]
		}, {
			id: '55',
			product: 3,
			desc: '1st/2nd half both teams to score',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '806',
				odds: '1.4',
				isActive: 1,
				desc: 'no/no'
			}, {
				id: '808',
				odds: '7.2',
				isActive: 1,
				desc: 'yes/no'
			}, {
				id: '810',
				odds: '28.0',
				isActive: 1,
				desc: 'yes/yes'
			}, {
				id: '812',
				odds: '4.8',
				isActive: 1,
				desc: 'no/yes'
			}]
		}, {
			id: '56',
			product: 3,
			desc: 'EC Bahia BA to score in both halves',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '3.1',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.29',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '57',
			product: 3,
			desc: 'Coritiba PR to score in both halves',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '6.0',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.07',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '58',
			specifier: 'total=1.5',
			product: 3,
			desc: 'Both halves over 1.5',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '6.2',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.07',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '59',
			specifier: 'total=1.5',
			product: 3,
			desc: 'Both halves under 1.5',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '1.97',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.68',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '60',
			product: 3,
			desc: '1st half - 1x2',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1',
				odds: '2.46',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '2',
				odds: '2.0',
				isActive: 1,
				desc: 'draw'
			}, {
				id: '3',
				odds: '5.2',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '62',
			specifier: 'goalnr=1',
			product: 3,
			desc: '1st half - first goal',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '7',
				odds: '2.46',
				isActive: 1,
				desc: 'none'
			}, {
				id: '6',
				odds: '2.24',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '8',
				odds: '4.0',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '63',
			product: 3,
			desc: '1st half - double chance',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '9',
				odds: '1.15',
				isActive: 1,
				desc: 'EC Bahia BA or draw'
			}, {
				id: '10',
				odds: '1.61',
				isActive: 1,
				desc: 'EC Bahia BA or Coritiba PR'
			}, {
				id: '11',
				odds: '1.42',
				isActive: 1,
				desc: 'draw or Coritiba PR'
			}]
		}, {
			id: '64',
			product: 3,
			desc: '1st half - draw no bet',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '4',
				odds: '1.36',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '5',
				odds: '2.75',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '65',
			specifier: 'hcp=0:1',
			product: 3,
			desc: '1st half - handicap 0:1',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1711',
				odds: '7.8',
				isActive: 1,
				desc: 'EC Bahia BA (0:1)'
			}, {
				id: '1712',
				odds: '3.35',
				isActive: 1,
				desc: 'draw (0:1)'
			}, {
				id: '1713',
				odds: '1.49',
				isActive: 1,
				desc: 'Coritiba PR (0:1)'
			}]
		}, {
			id: '66',
			specifier: 'hcp=-0.25',
			product: 3,
			desc: '1st half - handicap',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1714',
				odds: '1.88',
				isActive: 1,
				desc: 'EC Bahia BA (-0.25)'
			}, {
				id: '1715',
				odds: '1.76',
				isActive: 1,
				desc: 'Coritiba PR (0.25)'
			}]
		}, {
			id: '66',
			specifier: 'hcp=-0.5',
			product: 3,
			desc: '1st half - handicap',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1714',
				odds: '2.37',
				isActive: 1,
				desc: 'EC Bahia BA (-0.5)'
			}, {
				id: '1715',
				odds: '1.47',
				isActive: 1,
				desc: 'Coritiba PR (0.5)'
			}]
		}, {
			id: '66',
			specifier: 'hcp=0',
			product: 3,
			desc: '1st half - handicap',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1714',
				odds: '1.36',
				isActive: 1,
				desc: 'EC Bahia BA (0.0)'
			}, {
				id: '1715',
				odds: '2.75',
				isActive: 1,
				desc: 'Coritiba PR (-0.0)'
			}]
		}, {
			id: '68',
			specifier: 'total=0.5',
			product: 3,
			desc: '1st half - total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '12',
				odds: '1.47',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '2.37',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '68',
			specifier: 'total=0.75',
			product: 3,
			desc: '1st half - total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '12',
				odds: '1.67',
				isActive: 1,
				desc: 'over 0.75'
			}, {
				id: '13',
				odds: '1.99',
				isActive: 1,
				desc: 'under 0.75'
			}]
		}, {
			id: '68',
			specifier: 'total=1',
			product: 3,
			desc: '1st half - total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '12',
				odds: '2.11',
				isActive: 1,
				desc: 'over 1'
			}, {
				id: '13',
				odds: '1.6',
				isActive: 1,
				desc: 'under 1'
			}]
		}, {
			id: '68',
			specifier: 'total=1.5',
			product: 3,
			desc: '1st half - total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '12',
				odds: '3.1',
				isActive: 1,
				desc: 'over 1.5'
			}, {
				id: '13',
				odds: '1.29',
				isActive: 1,
				desc: 'under 1.5'
			}]
		}, {
			id: '68',
			specifier: 'total=2.5',
			product: 3,
			desc: '1st half - total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '12',
				odds: '6.8',
				isActive: 1,
				desc: 'over 2.5'
			}, {
				id: '13',
				odds: '1.05',
				isActive: 1,
				desc: 'under 2.5'
			}]
		}, {
			id: '69',
			specifier: 'total=0.5',
			product: 3,
			desc: '1st half - EC Bahia BA total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '1.89',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '1.75',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '70',
			specifier: 'total=0.5',
			product: 3,
			desc: '1st half - Coritiba PR total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '2.85',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '1.33',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '71',
			specifier: 'variant=sr:exact_goals:2+',
			product: 3,
			desc: '1st half - exact goals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: 'sr:exact_goals:2+:85',
				odds: '2.46',
				isActive: 1,
				desc: '0'
			}, {
				id: 'sr:exact_goals:2+:86',
				odds: '2.55',
				isActive: 1,
				desc: '1'
			}, {
				id: 'sr:exact_goals:2+:87',
				odds: '3.3',
				isActive: 1,
				desc: '2+'
			}]
		}, {
			id: '74',
			product: 3,
			desc: '1st half - odd/even',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '70',
				odds: '2.1',
				isActive: 1,
				desc: 'odd'
			}, {
				id: '72',
				odds: '1.6',
				isActive: 1,
				desc: 'even'
			}]
		}, {
			id: '75',
			product: 3,
			desc: '1st half - both teams to score',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '4.9',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.11',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '76',
			product: 3,
			desc: '1st half - EC Bahia BA clean sheet',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '1.33',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '2.85',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '77',
			product: 3,
			desc: '1st half - Coritiba PR clean sheet',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '1.75',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.89',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '78',
			product: 3,
			desc: '1st half - 1x2 & both teams to score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '78',
				odds: '23.0',
				isActive: 1,
				desc: 'EC Bahia BA & yes'
			}, {
				id: '80',
				odds: '2.75',
				isActive: 1,
				desc: 'EC Bahia BA & no'
			}, {
				id: '82',
				odds: '9.8',
				isActive: 1,
				desc: 'draw & yes'
			}, {
				id: '84',
				odds: '2.49',
				isActive: 1,
				desc: 'draw & no'
			}, {
				id: '86',
				odds: '50.0',
				isActive: 1,
				desc: 'Coritiba PR & yes'
			}, {
				id: '88',
				odds: '6.0',
				isActive: 1,
				desc: 'Coritiba PR & no'
			}]
		}, {
			id: '79',
			specifier: 'total=1.5',
			product: 3,
			desc: '1st half - 1x2 & total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '794',
				odds: '3.9',
				isActive: 1,
				desc: 'EC Bahia BA & under 1.5'
			}, {
				id: '798',
				odds: '2.5',
				isActive: 1,
				desc: 'draw & under 1.5'
			}, {
				id: '802',
				odds: '7.2',
				isActive: 1,
				desc: 'Coritiba PR & under 1.5'
			}, {
				id: '796',
				odds: '6.6',
				isActive: 1,
				desc: 'EC Bahia BA & over 1.5'
			}, {
				id: '800',
				odds: '9.8',
				isActive: 1,
				desc: 'draw & over 1.5'
			}, {
				id: '804',
				odds: '20.0',
				isActive: 1,
				desc: 'Coritiba PR & over 1.5'
			}]
		}, {
			id: '81',
			product: 3,
			desc: '1st half - correct score',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '480',
				odds: '24.0',
				isActive: 1,
				desc: 'other'
			}, {
				id: '468',
				odds: '3.9',
				isActive: 1,
				desc: '1:0'
			}, {
				id: '470',
				odds: '11.0',
				isActive: 1,
				desc: '2:0'
			}, {
				id: '472',
				odds: '30.0',
				isActive: 1,
				desc: '2:1'
			}, {
				id: '462',
				odds: '2.5',
				isActive: 1,
				desc: '0:0'
			}, {
				id: '464',
				odds: '11.0',
				isActive: 1,
				desc: '1:1'
			}, {
				id: '466',
				odds: '101.0',
				isActive: 1,
				desc: '2:2'
			}, {
				id: '474',
				odds: '7.2',
				isActive: 1,
				desc: '0:1'
			}, {
				id: '476',
				odds: '40.0',
				isActive: 1,
				desc: '0:2'
			}, {
				id: '478',
				odds: '60.0',
				isActive: 1,
				desc: '1:2'
			}]
		}, {
			id: '83',
			product: 3,
			desc: '2nd half - 1x2',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1',
				odds: '2.17',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '2',
				odds: '2.36',
				isActive: 1,
				desc: 'draw'
			}, {
				id: '3',
				odds: '4.6',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '84',
			specifier: 'goalnr=1',
			product: 3,
			desc: '2nd half - first goal',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '7',
				odds: '3.3',
				isActive: 1,
				desc: 'none'
			}, {
				id: '6',
				odds: '1.96',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '8',
				odds: '3.45',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '85',
			product: 3,
			desc: '2nd half - double chance',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '9',
				odds: '1.17',
				isActive: 1,
				desc: 'EC Bahia BA or draw'
			}, {
				id: '10',
				odds: '1.45',
				isActive: 1,
				desc: 'EC Bahia BA or Coritiba PR'
			}, {
				id: '11',
				odds: '1.52',
				isActive: 1,
				desc: 'draw or Coritiba PR'
			}]
		}, {
			id: '86',
			product: 3,
			desc: '2nd half - draw no bet',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '4',
				odds: '1.36',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '5',
				odds: '2.75',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '87',
			specifier: 'hcp=0:1',
			product: 3,
			desc: '2nd half - handicap 0:1',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1711',
				odds: '6.0',
				isActive: 1,
				desc: 'EC Bahia BA (0:1)'
			}, {
				id: '1712',
				odds: '3.2',
				isActive: 1,
				desc: 'draw (0:1)'
			}, {
				id: '1713',
				odds: '1.61',
				isActive: 1,
				desc: 'Coritiba PR (0:1)'
			}]
		}, {
			id: '88',
			specifier: 'hcp=-0.25',
			product: 3,
			desc: '2nd half - handicap',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1714',
				odds: '1.74',
				isActive: 1,
				desc: 'EC Bahia BA (-0.25)'
			}, {
				id: '1715',
				odds: '1.9',
				isActive: 1,
				desc: 'Coritiba PR (0.25)'
			}]
		}, {
			id: '88',
			specifier: 'hcp=-0.5',
			product: 3,
			desc: '2nd half - handicap',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1714',
				odds: '2.11',
				isActive: 1,
				desc: 'EC Bahia BA (-0.5)'
			}, {
				id: '1715',
				odds: '1.59',
				isActive: 1,
				desc: 'Coritiba PR (0.5)'
			}]
		}, {
			id: '88',
			specifier: 'hcp=-0.75',
			product: 3,
			desc: '2nd half - handicap',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1714',
				odds: '2.6',
				isActive: 1,
				desc: 'EC Bahia BA (-0.75)'
			}, {
				id: '1715',
				odds: '1.39',
				isActive: 1,
				desc: 'Coritiba PR (0.75)'
			}]
		}, {
			id: '90',
			specifier: 'total=0.5',
			product: 3,
			desc: '2nd half - total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '1.29',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '3.1',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '90',
			specifier: 'total=1',
			product: 3,
			desc: '2nd half - total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '1.59',
				isActive: 1,
				desc: 'over 1'
			}, {
				id: '13',
				odds: '2.12',
				isActive: 1,
				desc: 'under 1'
			}]
		}, {
			id: '90',
			specifier: 'total=1.25',
			product: 3,
			desc: '2nd half - total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '1.98',
				isActive: 1,
				desc: 'over 1.25'
			}, {
				id: '13',
				odds: '1.68',
				isActive: 1,
				desc: 'under 1.25'
			}]
		}, {
			id: '90',
			specifier: 'total=1.5',
			product: 3,
			desc: '2nd half - total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '2.36',
				isActive: 1,
				desc: 'over 1.5'
			}, {
				id: '13',
				odds: '1.48',
				isActive: 1,
				desc: 'under 1.5'
			}]
		}, {
			id: '90',
			specifier: 'total=2.5',
			product: 3,
			desc: '2nd half - total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '5.0',
				isActive: 1,
				desc: 'over 2.5'
			}, {
				id: '13',
				odds: '1.11',
				isActive: 1,
				desc: 'under 2.5'
			}]
		}, {
			id: '91',
			specifier: 'total=0.5',
			product: 3,
			desc: '2nd half - EC Bahia BA total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '1.62',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '2.08',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '92',
			specifier: 'total=0.5',
			product: 3,
			desc: '2nd half - Coritiba PR total',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '12',
				odds: '2.38',
				isActive: 1,
				desc: 'over 0.5'
			}, {
				id: '13',
				odds: '1.47',
				isActive: 1,
				desc: 'under 0.5'
			}]
		}, {
			id: '93',
			specifier: 'variant=sr:exact_goals:2+',
			product: 3,
			desc: '2nd half - exact goals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: 'sr:exact_goals:2+:85',
				odds: '3.35',
				isActive: 1,
				desc: '0'
			}, {
				id: 'sr:exact_goals:2+:86',
				odds: '2.55',
				isActive: 1,
				desc: '1'
			}, {
				id: 'sr:exact_goals:2+:87',
				odds: '2.45',
				isActive: 1,
				desc: '2+'
			}]
		}, {
			id: '94',
			product: 3,
			desc: '2nd half - odd/even',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '70',
				odds: '1.94',
				isActive: 1,
				desc: 'odd'
			}, {
				id: '72',
				odds: '1.71',
				isActive: 1,
				desc: 'even'
			}]
		}, {
			id: '95',
			product: 3,
			desc: '2nd half - both teams to score',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '3.8',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.19',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '96',
			product: 3,
			desc: '2nd half - EC Bahia BA clean sheet',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '1.47',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '2.38',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '97',
			product: 3,
			desc: '2nd half - Coritiba PR clean sheet',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '74',
				odds: '2.08',
				isActive: 1,
				desc: 'yes'
			}, {
				id: '76',
				odds: '1.62',
				isActive: 1,
				desc: 'no'
			}]
		}, {
			id: '98',
			product: 3,
			desc: '2nd half - correct score',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '552',
				odds: '3.95',
				isActive: 1,
				desc: '1:0'
			}, {
				id: '558',
				odds: '9.2',
				isActive: 1,
				desc: '2:0'
			}, {
				id: '560',
				odds: '21.0',
				isActive: 1,
				desc: '2:1'
			}, {
				id: '546',
				odds: '3.4',
				isActive: 1,
				desc: '0:0'
			}, {
				id: '554',
				odds: '8.4',
				isActive: 1,
				desc: '1:1'
			}, {
				id: '562',
				odds: '90.0',
				isActive: 1,
				desc: '2:2'
			}, {
				id: '548',
				odds: '7.2',
				isActive: 1,
				desc: '0:1'
			}, {
				id: '550',
				odds: '30.0',
				isActive: 1,
				desc: '0:2'
			}, {
				id: '556',
				odds: '35.0',
				isActive: 1,
				desc: '1:2'
			}, {
				id: '564',
				odds: '14.0',
				isActive: 1,
				desc: 'other'
			}]
		}, {
			id: '100',
			specifier: 'goalnr=1',
			product: 3,
			desc: 'When will the first goal be scored (15 min interval)',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '596',
				odds: '8.6',
				isActive: 1,
				desc: 'none'
			}, {
				id: '584',
				odds: '3.6',
				isActive: 1,
				desc: '1-15'
			}, {
				id: '586',
				odds: '4.3',
				isActive: 1,
				desc: '16-30'
			}, {
				id: '588',
				odds: '5.4',
				isActive: 1,
				desc: '31-45'
			}, {
				id: '590',
				odds: '8.2',
				isActive: 1,
				desc: '46-60'
			}, {
				id: '592',
				odds: '11.0',
				isActive: 1,
				desc: '61-75'
			}, {
				id: '594',
				odds: '14.0',
				isActive: 1,
				desc: '76-90'
			}]
		}, {
			id: '101',
			specifier: 'goalnr=1',
			product: 3,
			desc: 'When will the first goal be scored (10 min interval)',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '616',
				odds: '8.8',
				isActive: 1,
				desc: 'none'
			}, {
				id: '598',
				odds: '5.4',
				isActive: 1,
				desc: '1-10'
			}, {
				id: '600',
				odds: '5.6',
				isActive: 1,
				desc: '11-20'
			}, {
				id: '602',
				odds: '6.8',
				isActive: 1,
				desc: '21-30'
			}, {
				id: '604',
				odds: '8.2',
				isActive: 1,
				desc: '31-40'
			}, {
				id: '606',
				odds: '9.2',
				isActive: 1,
				desc: '41-50'
			}, {
				id: '608',
				odds: '12.0',
				isActive: 1,
				desc: '51-60'
			}, {
				id: '610',
				odds: '16.0',
				isActive: 1,
				desc: '61-70'
			}, {
				id: '612',
				odds: '21.0',
				isActive: 1,
				desc: '71-80'
			}, {
				id: '614',
				odds: '20.0',
				isActive: 1,
				desc: '81-90'
			}]
		}, {
			id: '105',
			specifier: 'from=1|to=10',
			product: 3,
			desc: '10 minutes - 1x2 from 1 to 10',
			status: 0,
			group: 'specials',
			outcomes: [{
				id: '1',
				odds: '6.8',
				isActive: 1,
				desc: 'EC Bahia BA'
			}, {
				id: '2',
				odds: '1.14',
				isActive: 1,
				desc: 'draw'
			}, {
				id: '3',
				odds: '13.0',
				isActive: 1,
				desc: 'Coritiba PR'
			}]
		}, {
			id: '184',
			specifier: 'goalnr=1',
			product: 3,
			desc: 'first goal & 1x2',
			status: 0,
			group: 'specials',
			outcomes: [{
				id: '814',
				odds: '1.99',
				isActive: 1,
				desc: 'EC Bahia BA goal & EC Bahia BA'
			}, {
				id: '816',
				odds: '10.0',
				isActive: 1,
				desc: 'EC Bahia BA goal & draw'
			}, {
				id: '818',
				odds: '35.0',
				isActive: 1,
				desc: 'EC Bahia BA goal & Coritiba PR'
			}, {
				id: '820',
				odds: '16.0',
				isActive: 1,
				desc: 'Coritiba PR goal & EC Bahia BA'
			}, {
				id: '822',
				odds: '10.0',
				isActive: 1,
				desc: 'Coritiba PR goal & draw'
			}, {
				id: '824',
				odds: '5.2',
				isActive: 1,
				desc: 'Coritiba PR goal & Coritiba PR'
			}, {
				id: '826',
				odds: '8.6',
				isActive: 1,
				desc: 'no goal'
			}]
		}, {
			id: '540',
			product: 3,
			desc: 'Double chance (match) & 1st half both teams score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1718',
				odds: '7.0',
				isActive: 1,
				desc: 'EC Bahia BA/draw & yes'
			}, {
				id: '1719',
				odds: '1.38',
				isActive: 1,
				desc: 'EC Bahia BA/draw & no'
			}, {
				id: '1720',
				odds: '8.4',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & yes'
			}, {
				id: '1721',
				odds: '1.49',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & no'
			}, {
				id: '1722',
				odds: '11.0',
				isActive: 1,
				desc: 'draw/Coritiba PR & yes'
			}, {
				id: '1723',
				odds: '2.23',
				isActive: 1,
				desc: 'draw/Coritiba PR & no'
			}]
		}, {
			id: '541',
			product: 3,
			desc: 'Double chance (match) & 2nd half both teams score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1718',
				odds: '5.0',
				isActive: 1,
				desc: 'EC Bahia BA/draw & yes'
			}, {
				id: '1719',
				odds: '1.48',
				isActive: 1,
				desc: 'EC Bahia BA/draw & no'
			}, {
				id: '1720',
				odds: '6.2',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & yes'
			}, {
				id: '1721',
				odds: '1.59',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & no'
			}, {
				id: '1722',
				odds: '7.8',
				isActive: 1,
				desc: 'draw/Coritiba PR & yes'
			}, {
				id: '1723',
				odds: '2.45',
				isActive: 1,
				desc: 'draw/Coritiba PR & no'
			}]
		}, {
			id: '542',
			product: 3,
			desc: '1st half - double chance & both teams to score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1718',
				odds: '6.6',
				isActive: 1,
				desc: 'EC Bahia BA/draw & yes'
			}, {
				id: '1719',
				odds: '1.35',
				isActive: 1,
				desc: 'EC Bahia BA/draw & no'
			}, {
				id: '1720',
				odds: '15.0',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & yes'
			}, {
				id: '1721',
				odds: '1.87',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & no'
			}, {
				id: '1722',
				odds: '7.8',
				isActive: 1,
				desc: 'draw/Coritiba PR & yes'
			}, {
				id: '1723',
				odds: '1.75',
				isActive: 1,
				desc: 'draw/Coritiba PR & no'
			}]
		}, {
			id: '543',
			product: 3,
			desc: '2nd half - 1x2 & both teams to score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '78',
				odds: '14.0',
				isActive: 1,
				desc: 'EC Bahia BA & yes'
			}, {
				id: '80',
				odds: '2.55',
				isActive: 1,
				desc: 'EC Bahia BA & no'
			}, {
				id: '82',
				odds: '7.6',
				isActive: 1,
				desc: 'draw & yes'
			}, {
				id: '84',
				odds: '3.4',
				isActive: 1,
				desc: 'draw & no'
			}, {
				id: '86',
				odds: '30.0',
				isActive: 1,
				desc: 'Coritiba PR & yes'
			}, {
				id: '88',
				odds: '5.6',
				isActive: 1,
				desc: 'Coritiba PR & no'
			}]
		}, {
			id: '544',
			specifier: 'total=1.5',
			product: 3,
			desc: '2nd half - 1x2 & total',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '794',
				odds: '3.95',
				isActive: 1,
				desc: 'EC Bahia BA & under 1.5'
			}, {
				id: '798',
				odds: '3.4',
				isActive: 1,
				desc: 'draw & under 1.5'
			}, {
				id: '802',
				odds: '7.2',
				isActive: 1,
				desc: 'Coritiba PR & under 1.5'
			}, {
				id: '796',
				odds: '4.7',
				isActive: 1,
				desc: 'EC Bahia BA & over 1.5'
			}, {
				id: '800',
				odds: '7.6',
				isActive: 1,
				desc: 'draw & over 1.5'
			}, {
				id: '804',
				odds: '14.0',
				isActive: 1,
				desc: 'Coritiba PR & over 1.5'
			}]
		}, {
			id: '545',
			product: 3,
			desc: '2nd half - double chance & both teams to score',
			status: 0,
			group: 'half',
			outcomes: [{
				id: '1718',
				odds: '4.8',
				isActive: 1,
				desc: 'EC Bahia BA/draw & yes'
			}, {
				id: '1719',
				odds: '1.49',
				isActive: 1,
				desc: 'EC Bahia BA/draw & no'
			}, {
				id: '1720',
				odds: '9.4',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & yes'
			}, {
				id: '1721',
				odds: '1.76',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & no'
			}, {
				id: '1722',
				odds: '5.8',
				isActive: 1,
				desc: 'draw/Coritiba PR & yes'
			}, {
				id: '1723',
				odds: '2.1',
				isActive: 1,
				desc: 'draw/Coritiba PR & no'
			}]
		}, {
			id: '546',
			product: 3,
			desc: 'Double chance & both teams to score',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1718',
				odds: '2.55',
				isActive: 1,
				desc: 'EC Bahia BA/draw & yes'
			}, {
				id: '1719',
				odds: '2.08',
				isActive: 1,
				desc: 'EC Bahia BA/draw & no'
			}, {
				id: '1720',
				odds: '3.4',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & yes'
			}, {
				id: '1721',
				odds: '2.01',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & no'
			}, {
				id: '1722',
				odds: '3.6',
				isActive: 1,
				desc: 'draw/Coritiba PR & yes'
			}, {
				id: '1723',
				odds: '3.95',
				isActive: 1,
				desc: 'draw/Coritiba PR & no'
			}]
		}, {
			id: '547',
			specifier: 'total=1.5',
			product: 3,
			desc: 'Double chance & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1724',
				odds: '3.55',
				isActive: 1,
				desc: 'EC Bahia BA/draw & under 1.5'
			}, {
				id: '1725',
				odds: '3.95',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & under 1.5'
			}, {
				id: '1726',
				odds: '4.8',
				isActive: 1,
				desc: 'draw/Coritiba PR & under 1.5'
			}, {
				id: '1727',
				odds: '1.69',
				isActive: 1,
				desc: 'EC Bahia BA/draw & over 1.5'
			}, {
				id: '1728',
				odds: '1.85',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & over 1.5'
			}, {
				id: '1729',
				odds: '3.05',
				isActive: 1,
				desc: 'draw/Coritiba PR & over 1.5'
			}]
		}, {
			id: '547',
			specifier: 'total=2.5',
			product: 3,
			desc: 'Double chance & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1724',
				odds: '1.91',
				isActive: 1,
				desc: 'EC Bahia BA/draw & under 2.5'
			}, {
				id: '1725',
				odds: '2.5',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & under 2.5'
			}, {
				id: '1726',
				odds: '2.65',
				isActive: 1,
				desc: 'draw/Coritiba PR & under 2.5'
			}, {
				id: '1727',
				odds: '2.85',
				isActive: 1,
				desc: 'EC Bahia BA/draw & over 2.5'
			}, {
				id: '1728',
				odds: '2.5',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & over 2.5'
			}, {
				id: '1729',
				odds: '6.6',
				isActive: 1,
				desc: 'draw/Coritiba PR & over 2.5'
			}]
		}, {
			id: '547',
			specifier: 'total=3.5',
			product: 3,
			desc: 'Double chance & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1724',
				odds: '1.49',
				isActive: 1,
				desc: 'EC Bahia BA/draw & under 3.5'
			}, {
				id: '1725',
				odds: '1.64',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & under 3.5'
			}, {
				id: '1726',
				odds: '2.26',
				isActive: 1,
				desc: 'draw/Coritiba PR & under 3.5'
			}, {
				id: '1727',
				odds: '5.0',
				isActive: 1,
				desc: 'EC Bahia BA/draw & over 3.5'
			}, {
				id: '1728',
				odds: '5.4',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & over 3.5'
			}, {
				id: '1729',
				odds: '11.0',
				isActive: 1,
				desc: 'draw/Coritiba PR & over 3.5'
			}]
		}, {
			id: '547',
			specifier: 'total=4.5',
			product: 3,
			desc: 'Double chance & total',
			status: 0,
			group: 'main',
			outcomes: [{
				id: '1724',
				odds: '1.29',
				isActive: 1,
				desc: 'EC Bahia BA/draw & under 4.5'
			}, {
				id: '1725',
				odds: '1.43',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & under 4.5'
			}, {
				id: '1726',
				odds: '1.95',
				isActive: 1,
				desc: 'draw/Coritiba PR & under 4.5'
			}, {
				id: '1727',
				odds: '12.0',
				isActive: 1,
				desc: 'EC Bahia BA/draw & over 4.5'
			}, {
				id: '1728',
				odds: '10.0',
				isActive: 1,
				desc: 'EC Bahia BA/Coritiba PR & over 4.5'
			}, {
				id: '1729',
				odds: '35.0',
				isActive: 1,
				desc: 'draw/Coritiba PR & over 4.5'
			}]
		}, {
			id: '548',
			product: 3,
			desc: 'Multigoals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '1804',
				odds: '7.6',
				isActive: 1,
				desc: 'no goal'
			}, {
				id: '1730',
				odds: '1.79',
				isActive: 1,
				desc: '1-2'
			}, {
				id: '1731',
				odds: '1.34',
				isActive: 1,
				desc: '1-3'
			}, {
				id: '1732',
				odds: '1.18',
				isActive: 1,
				desc: '1-4'
			}, {
				id: '1733',
				odds: '1.12',
				isActive: 1,
				desc: '1-5'
			}, {
				id: '1734',
				odds: '1.1',
				isActive: 1,
				desc: '1-6'
			}, {
				id: '1735',
				odds: '1.87',
				isActive: 1,
				desc: '2-3'
			}, {
				id: '1736',
				odds: '1.54',
				isActive: 1,
				desc: '2-4'
			}, {
				id: '1737',
				odds: '1.43',
				isActive: 1,
				desc: '2-5'
			}, {
				id: '1738',
				odds: '1.39',
				isActive: 1,
				desc: '2-6'
			}, {
				id: '1739',
				odds: '2.65',
				isActive: 1,
				desc: '3-4'
			}, {
				id: '1740',
				odds: '2.29',
				isActive: 1,
				desc: '3-5'
			}, {
				id: '1741',
				odds: '2.18',
				isActive: 1,
				desc: '3-6'
			}, {
				id: '1742',
				odds: '4.7',
				isActive: 1,
				desc: '4-5'
			}, {
				id: '1743',
				odds: '4.2',
				isActive: 1,
				desc: '4-6'
			}, {
				id: '1744',
				odds: '10.0',
				isActive: 1,
				desc: '5-6'
			}, {
				id: '1745',
				odds: '30.0',
				isActive: 1,
				desc: '7+'
			}]
		}, {
			id: '549',
			product: 3,
			desc: 'EC Bahia BA multigoals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '1805',
				odds: '3.8',
				isActive: 1,
				desc: 'no goal'
			}, {
				id: '1746',
				odds: '1.57',
				isActive: 1,
				desc: '1-2'
			}, {
				id: '1747',
				odds: '1.33',
				isActive: 1,
				desc: '1-3'
			}, {
				id: '1748',
				odds: '2.36',
				isActive: 1,
				desc: '2-3'
			}, {
				id: '1749',
				odds: '13.0',
				isActive: 1,
				desc: '4+'
			}]
		}, {
			id: '550',
			product: 3,
			desc: 'Coritiba PR multigoals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '1805',
				odds: '2.05',
				isActive: 1,
				desc: 'no goal'
			}, {
				id: '1746',
				odds: '1.8',
				isActive: 1,
				desc: '1-2'
			}, {
				id: '1747',
				odds: '1.68',
				isActive: 1,
				desc: '1-3'
			}, {
				id: '1748',
				odds: '4.6',
				isActive: 1,
				desc: '2-3'
			}, {
				id: '1749',
				odds: '30.0',
				isActive: 1,
				desc: '4+'
			}]
		}, {
			id: '551',
			product: 3,
			desc: 'Multiscores',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '1803',
				odds: '3.3',
				isActive: 1,
				desc: 'draw'
			}, {
				id: '1750',
				odds: '3.0',
				isActive: 1,
				desc: '1:0, 2:0 or 3:0'
			}, {
				id: '1751',
				odds: '7.6',
				isActive: 1,
				desc: '0:1, 0:2 or 0:3'
			}, {
				id: '1752',
				odds: '30.0',
				isActive: 1,
				desc: '4:0, 5:0 or 6:0'
			}, {
				id: '1753',
				odds: '101.0',
				isActive: 1,
				desc: '0:4, 0:5 or 0:6'
			}, {
				id: '1754',
				odds: '6.0',
				isActive: 1,
				desc: '2:1, 3:1 or 4:1'
			}, {
				id: '1755',
				odds: '14.0',
				isActive: 1,
				desc: '1:2, 1:3 or 1:4'
			}, {
				id: '1756',
				odds: '28.0',
				isActive: 1,
				desc: '3:2, 4:2, 4:3 or 5:1'
			}, {
				id: '1757',
				odds: '70.0',
				isActive: 1,
				desc: '2:3, 2:4, 3:4 or 1:5'
			}, {
				id: '1758',
				odds: '101.0',
				isActive: 1,
				desc: 'other homewin'
			}, {
				id: '1759',
				odds: '101.0',
				isActive: 1,
				desc: 'other awaywin'
			}]
		}, {
			id: '552',
			product: 3,
			desc: '1st half - multigoals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '1805',
				odds: '2.4',
				isActive: 1,
				desc: 'no goal'
			}, {
				id: '1746',
				odds: '1.69',
				isActive: 1,
				desc: '1-2'
			}, {
				id: '1747',
				odds: '1.53',
				isActive: 1,
				desc: '1-3'
			}, {
				id: '1748',
				odds: '3.45',
				isActive: 1,
				desc: '2-3'
			}, {
				id: '1749',
				odds: '30.0',
				isActive: 1,
				desc: '4+'
			}]
		}, {
			id: '553',
			product: 3,
			desc: '2nd half - multigoals',
			status: 0,
			group: 'goals',
			outcomes: [{
				id: '1805',
				odds: '3.2',
				isActive: 1,
				desc: 'no goal'
			}, {
				id: '1746',
				odds: '1.56',
				isActive: 1,
				desc: '1-2'
			}, {
				id: '1747',
				odds: '1.37',
				isActive: 1,
				desc: '1-3'
			}, {
				id: '1748',
				odds: '2.65',
				isActive: 1,
				desc: '2-3'
			}, {
				id: '1749',
				odds: '20.0',
				isActive: 1,
				desc: '4+'
			}]
		}]
	}
});

/*
常用玩儿法分组
params
 */
mockjax.get('/factsCenter/marketGroups', {
	bizCode: 10000,
	message: 'sucsess',
	data: [{
		id: 'sr:marketGroup:1',
		name: 'Main'
	}, {
		id: 'sr:marketGroup:2',
		name: 'Goals'
	}, {
		id: 'sr:marketGroup:3',
		name: 'Booking'
	}, {
		id: 'sr:marketGroup:4',
		name: 'Corners'
	}, {
		id: 'sr:marketGroup:5',
		name: 'Specials'
	}]
});

mockjax.get('/factsCenter/commonThumbnailEvents', {
	bizCode: 10000,
	message: '',
	data: [{
		eventId: 'sr:match:12148410',
		estimateStartTime: 1506747600000,
		status: 1,
		setScore: '28:5',
		playedSeconds: '62:00',
		homeTeamName: 'Queensland Country',
		awayTeamName: 'Melbourne Rising',
		sport: {
			id: 'sr:sport:12',
			name: 'Rugby',
			category: {
				id: 'sr:category:82',
				name: 'Rugby Union',
				tournament: {
					id: 'sr:tournament:1828',
					name: 'NRC'
				}
			}
		}
	},
	{
		eventId: 'sr:match:12648634',
		estimateStartTime: 1506751200000,
		status: 1,
		setScore: '0:0',
		homeTeamName: 'Istomin, Denis',
		awayTeamName: 'Sugita, Yuichi',
		sport: {
			id: 'sr:sport:5',
			name: 'Tennis',
			category: {
				id: 'sr:category:3',
				name: 'ATP',
				tournament: {
					id: 'sr:tournament:14133',
					name: 'ATP Chengdu, China Men Singles'
				}
			}
		}
	},
	{
		eventId: 'sr:match:11865996',
		estimateStartTime: 1506751200000,
		status: 1,
		setScore: '0:0',
		playedSeconds: '28:49',
		homeTeamName: 'FK Tosno',
		awayTeamName: 'FC Akhmat Grozny Youth',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:21',
				name: 'Russia',
				tournament: {
					id: 'sr:tournament:879',
					name: 'Youth League'
				}
			}
		}
	},
	{
		eventId: 'sr:match:12620206',
		estimateStartTime: 1506749700000,
		status: 1,
		setScore: '39:40',
		playedSeconds: '19:58',
		homeTeamName: 'Niigata Albirex BB',
		awayTeamName: 'Shimane Susanoo Magic',
		sport: {
			id: 'sr:sport:2',
			name: 'Basketball',
			category: {
				id: 'sr:category:483',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:1502',
					name: 'B.League '
				}
			}
		}
	},
	{
		eventId: 'sr:match:12620208',
		estimateStartTime: 1506749700000,
		status: 1,
		setScore: '34:23',
		playedSeconds: '19:57',
		homeTeamName: 'Ryukyu Golden Kings Okinawa',
		awayTeamName: 'Hitachi Sunrockers Tokyo',
		sport: {
			id: 'sr:sport:2',
			name: 'Basketball',
			category: {
				id: 'sr:category:483',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:1502',
					name: 'B.League '
				}
			}
		}
	},
	{
		eventId: 'sr:match:11842550',
		estimateStartTime: 1506747600000,
		status: 1,
		setScore: '2:0',
		playedSeconds: '69:43',
		homeTeamName: 'Avispa Fukuoka',
		awayTeamName: 'Renofa Yamaguchi',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:52',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:402',
					name: 'J.League 2'
				}
			}
		}
	},
	{
		eventId: 'sr:match:11842532',
		estimateStartTime: 1506747600000,
		status: 1,
		setScore: '0:0',
		playedSeconds: '68:36',
		homeTeamName: 'Montedio Yamagata',
		awayTeamName: 'V-Varen Nagasaki',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:52',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:402',
					name: 'J.League 2'
				}
			}
		}
	},
	{
		eventId: 'sr:match:11842538',
		estimateStartTime: 1506751200000,
		status: 1,
		setScore: '0:0',
		playedSeconds: '25:51',
		homeTeamName: 'Kyoto Sanga FC',
		awayTeamName: 'JEF United Ichihara Chiba',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:52',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:402',
					name: 'J.League 2'
				}
			}
		}
	},
	{
		eventId: 'sr:match:11842534',
		estimateStartTime: 1506751200000,
		status: 1,
		setScore: '0:0',
		playedSeconds: '26:20',
		homeTeamName: 'Mito Hollyhock',
		awayTeamName: 'Matsumoto Yamaga FC',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:52',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:402',
					name: 'J.League 2'
				}
			}
		}
	},
	{
		eventId: 'sr:match:11879798',
		estimateStartTime: 1506751200000,
		status: 1,
		setScore: '0:0',
		playedSeconds: '25:58',
		homeTeamName: 'Sagan Tosu',
		awayTeamName: 'Kashima Antlers',
		sport: {
			id: 'sr:sport:1',
			name: 'Soccer',
			category: {
				id: 'sr:category:52',
				name: 'Japan',
				tournament: {
					id: 'sr:tournament:196',
					name: 'J.League'
				}
			}
		}
	},
	{
		eventId: 'sr:match:12649474',
		estimateStartTime: 1506747600000,
		status: 1,
		setScore: '52:39',
		playedSeconds: '34:39',
		homeTeamName: 'Fiji',
		awayTeamName: 'Solomon Islands',
		sport: {
			id: 'sr:sport:2',
			name: 'Basketball',
			category: {
				id: 'sr:category:103',
				name: 'International',
				tournament: {
					id: 'sr:simple_tournament:63344',
					name: 'FIBA Melanesia Cup'
				}
			}
		}
	},
	{
		eventId: 'sr:match:11858744',
		estimateStartTime: 1506751200000,
		status: 1,
		setScore: '19:13',
		playedSeconds: '6:57',
		homeTeamName: 'De La Salle Green Archers',
		awayTeamName: 'UST Growling Tigers',
		sport: {
			id: 'sr:sport:2',
			name: 'Basketball',
			category: {
				id: 'sr:category:539',
				name: 'Philippines',
				tournament: {
					id: 'sr:simple_tournament:16322',
					name: 'UAAP, Senior'
				}
			}
		}
	}
	]
});
