import mockjax from 'mock';

/*
赛事详情
params: eventId
 */
mockjax.get('/factsCenter/event', {
	bizCode: 10000,
	message: 'sucsess',
	data: {
		gameId: 3235,
		eventId: 'sr:match:11868012',
		estimateStartTime: 1231242344,
		estimateStopTime: 1231242544,
		score: '1-1',
		playedSeconds: '00:33',
		homeTeamName: 'Birmingham City',
		awayTeamName: 'Bristol City',
		sport: {
			id: 'sr:sport:1',
			name: 'Football',
			category: {
				id: 'sr:category:1',
				name: 'England',
				tournament: {
					id: 'sr:tournament:18',
					name: 'Championship'
				}
			}
		},
		markets: [
			{
				id: '18',
				desc: '1x2',
				group: '3way',
				status: 0,
				specifier: 'total=1.75',
				product: 1,
				marketGuide: 'maket test 3way',
				outcomes: [
					{
						id: '1',
						odds: '2.37',
						isActive: 1,
						desc: 'Team1'
					}, {
						id: '2',
						isActive: 1,
						odds: '3.1',
						desc: 'draw'
					}, {
						id: '3',
						isActive: 1,
						odds: '2.8',
						desc: 'Team2'
					}
				]
			}, {
				id: '18',
				specifier: 'total=0.5',
				desc: 'Total',
				group: 'Total',
				status: 0,
				product: 1,
				marketGuide: 'maket test Total',
				outcomes: [
					{
						id: '13',
						isActive: 0,
						odds: '7.8',
						desc: 'under 0.5'
					}
				]
			}
		]
	}
});

/*
常用玩儿法分组
params
 */
mockjax.get('/factsCenter/marketGroups', {
	bizCode: 10000,
	message: 'sucsess',
	data: [
		{
			id: 'sr:marketGroup:1',
			name: '3way'
		}, {
			id: 'sr:marketGroup:1',
			name: 'Total'
		}
	]
});

/*
live betting 赛事列表
 */
// mockjax.get('/factsCenter/liveEvent', {
// 	bizCode: 10000,
// 	message: 'sucsess',
// 	data: {
// 		eventCount: 10,
// 		events: [
// 			{
// 				categoryName: 'England Championship',
// 				list: [
// 					{
// 						eventId: 'sr:match:12455118',
// 						estimateStartTime: 1505127300000,
// 						status: 1,
// 						score: '0:0',
// 						playedSeconds: '30',
// 						categoryId: 'sr:category:1',
// 						tournamentId: 'sr:tournament:18',
// 						homeTeamName: 'Abduraimova N / Frolova A',
// 						awayTeamName: 'Bolkvadze M / Gorgodze E'
// 					}, {
// 						eventId: 'sr:match:12455118',
// 						estimateStartTime: 1505127300000,
// 						status: 1,
// 						score: '0:0',
// 						playedSeconds: '30',
// 						categoryId: 'sr:category:1',
// 						tournamentId: 'sr:tournament:18',
// 						homeTeamName: 'Abduraimova N / Frolova A',
// 						awayTeamName: 'Bolkvadze M / Gorgodze E'
// 					}
// 				]
// 			}, {
// 				categoryName: 'England Championship2',
// 				list: [
// 					{
// 						eventId: 'sr:match:12455118',
// 						estimateStartTime: 1505127300000,
// 						status: 1,
// 						score: '0:0',
// 						playedSeconds: '30',
// 						categoryId: 'sr:category:1',
// 						tournamentId: 'sr:tournament:18',
// 						homeTeamName: 'Abduraimova N / Frolova A',
// 						awayTeamName: 'Bolkvadze M / Gorgodze E'
// 					}, {
// 						eventId: 'sr:match:12455118',
// 						estimateStartTime: 1505127300000,
// 						status: 1,
// 						score: '0:0',
// 						playedSeconds: '30',
// 						categoryId: 'sr:category:1',
// 						tournamentId: 'sr:tournament:18',
// 						homeTeamName: 'Abduraimova N / Frolova A',
// 						awayTeamName: 'Bolkvadze M / Gorgodze E'
// 					}
// 				]
// 			}, {
// 				categoryName: 'England Championship3',
// 				list: [
// 					{
// 						eventId: 'sr:match:12455118',
// 						estimateStartTime: 1505127300000,
// 						status: 1,
// 						score: '0:0',
// 						playedSeconds: '30',
// 						categoryId: 'sr:category:1',
// 						tournamentId: 'sr:tournament:18',
// 						homeTeamName: 'Abduraimova N / Frolova A',
// 						awayTeamName: 'Bolkvadze M / Gorgodze E'
// 					}, {
// 						eventId: 'sr:match:12455118',
// 						estimateStartTime: 1505127300000,
// 						status: 1,
// 						score: '0:0',
// 						playedSeconds: '30',
// 						categoryId: 'sr:category:1',
// 						tournamentId: 'sr:tournament:18',
// 						homeTeamName: 'Abduraimova N / Frolova A',
// 						awayTeamName: 'Bolkvadze M / Gorgodze E'
// 					}
// 				]
// 			}
// 		]
// 	}
// });

/*
获取比赛的数量，不需要category和tourmaline
 */
// mockjax.get('/factsCenter/sportList', {
// 	bizCode: 10000,
// 	message: 'sucsess',
// 	data: {
// 		id: 'sr:sport:1',
// 		name: 'football',
// 		eventSize: 20
// 	}
// });

/*
获取比赛列表
 */
// mockjax.get('/factsCenter/optionalEventsList', {
// 	bizCode: 10000,
// 	data: [
// 		{
// 			id: 'sr:tournament:18',
// 			name: 'Championship',
// 			score: 123456,
// 			events: [
// 				{
// 					gameId: 3235,
// 					eventId: 'sr:match:11868012',
// 					estimateStartTime: 1231242344,
// 					estimateStopTime: 1231242544,
// 					score: '1-1',
// 					status: 1,
// 					playedSeconds: '00:33',
// 					homeTeamName: 'Birmingham City',
// 					awayTeamName: 'Bristol City',
// 					matchStatus: '3rd period',
// 					sport: {
// 						id: 'sr:sport:1',
// 						name: 'Football',
// 						category: {
// 							id: 'sr:category:1',
// 							name: 'England'
// 						}
// 					}
// 				},
// 				{
// 					gameId: 3235,
// 					eventId: 'sr:match:11868022',
// 					estimateStartTime: 1231242344,
// 					estimateStopTime: 1231242544,
// 					score: '1-1',
// 					status: 0,
// 					playedSeconds: '00:33',
// 					homeTeamName: 'Birmingham City',
// 					awayTeamName: 'Bristol City',
// 					matchStatus: '3st set',
// 					sport: {
// 						id: 'sr:sport:1',
// 						name: 'Football',
// 						category: {
// 							id: 'sr:category:1',
// 							name: 'England2'
// 						}
// 					}
// 				},
// 				{
// 					gameId: 3235,
// 					eventId: 'sr:match:11868032',
// 					estimateStartTime: 1231242344,
// 					estimateStopTime: 1231242544,
// 					score: '1-1',
// 					status: 2,
// 					playedSeconds: '00:33',
// 					homeTeamName: 'Birmingham City',
// 					awayTeamName: 'Bristol City',
// 					matchStatus: '3rd period',
// 					sport: {
// 						id: 'sr:sport:1',
// 						name: 'Football',
// 						category: {
// 							id: 'sr:category:1',
// 							name: 'England3'
// 						}
// 					}
// 				}
// 			]
// 		}, {
// 			id: 'sr:tournament:19',
// 			name: 'Championship1',
// 			score: 123456,
// 			events: [
// 				{
// 					gameId: 3235,
// 					eventId: 'sr:match:11868013',
// 					estimateStartTime: 1231242344,
// 					estimateStopTime: 1231242544,
// 					score: '1-3',
// 					status: 1,
// 					playedSeconds: '00:33',
// 					homeTeamName: 'Birmingham City',
// 					awayTeamName: 'Bristol City',
// 					matchStatus: '1st half',
// 					sport: {
// 						id: 'sr:sport:1',
// 						name: 'Football',
// 						category: {
// 							id: 'sr:category:1',
// 							name: 'England1'
// 						}
// 					}
// 				}
// 			]
// 		}, {
// 			id: 'sr:tournament:20',
// 			name: 'Championship',
// 			score: 123456,
// 			events: [
// 				{
// 					gameId: 3235,
// 					eventId: 'sr:match:11868014',
// 					estimateStartTime: 1231242344,
// 					estimateStopTime: 1231242544,
// 					score: '',
// 					status: 2,
// 					playedSeconds: '',
// 					homeTeamName: 'Birmingham City',
// 					awayTeamName: 'Bristol City',
// 					matchStatus: '3rd period',
// 					sport: {
// 						id: 'sr:sport:1',
// 						name: 'Football',
// 						category: {
// 							id: 'sr:category:1',
// 							name: 'England'
// 						}
// 					}
// 				}
// 			]
// 		}, {
// 			id: 'sr:tournament:21',
// 			name: 'Championship',
// 			score: 123456,
// 			events: [
// 				{
// 					gameId: 3235,
// 					eventId: 'sr:match:11868021',
// 					estimateStartTime: 1231242344,
// 					estimateStopTime: 1231242544,
// 					score: '3-2',
// 					status: 0,
// 					playedSeconds: '00:43',
// 					homeTeamName: 'Birmingham City',
// 					awayTeamName: 'Bristol City',
// 					matchStatus: '3rd period',
// 					sport: {
// 						id: 'sr:sport:1',
// 						name: 'Football',
// 						category: {
// 							id: 'sr:category:1',
// 							name: 'England'
// 						}
// 					}
// 				}
// 			]
// 		}
// 	],
// 	message: 'sucess'
// });
