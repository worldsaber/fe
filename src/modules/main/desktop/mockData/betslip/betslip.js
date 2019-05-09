import mockjax from 'mock';

/*
betslip 快照
 */
mockjax.post('/factsCenter/Outcomes', {
	bizCode: 10000,
	message: 'sucsess',
	data: [
		{
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
			markets: {
				id: '18',
				desc: '1x2',
				group: '3way',
				status: 3,
				specifier: 'total=1.75',
				product: 1,
				outcomes: {
					id: '3',
					odds: '2.87',
					isActive: 1,
					desc: 'Team2'
				}
			}
		}, {
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
			markets: {
				id: '18',
				specifier: 'total=1.75',
				desc: 'Total',
				group: 'Total',
				status: 1,
				outcomes: {
					id: '2',
					isActive: 0,
					odds: '7.82',
					desc: 'draw'
				}
			}
		}
	]
});

/*
生单接口
 */
mockjax.post('/orders/order', {
	bizCode: 10000,
	message: 'sucsess',
	data: null
});
