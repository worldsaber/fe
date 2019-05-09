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
				name: 'Soccer',
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
				name: 'Soccer',
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
	data: {
		orderId: 'sa12313',
	}
});

/*
load code
 */
mockjax.get('/orders/share/123123', {
    "bizCode":10000,
    "innerMsg":"success",
    "message":"success",
    "data":{
        "shareCode":"4z",
        "outcomes":[
            {
                "eventId":"sr:match:12736730",
                "gameId":"5213",
                "estimateStartTime":1508808900000,
                "status":1,
                "setScore":"1:1",
                "gameScore":[
                    "0:1",
                    "1:0"
                ],
                "playedSeconds":"60:06",
                "homeTeamName":"Arnett Gardens FC",
                "awayTeamName":"Boys Town",
                "sport":{
                    "id":"sr:sport:1",
                    "name":"Soccer",
                    "category":{
                        "id":"sr:category:502",
                        "name":"Jamaica",
                        "tournament":{
                            "id":"sr:tournament:1892",
                            "name":"Premier League"
                        }
                    }
                },
                "markets":[
                    {
                        "id":"16",
                        "specifier":"hcp=-0.5",
                        "product":3,
                        "desc":"Handicap",
                        "status":2,
                        "group":"main",
                        "favourite":0,
                        "outcomes":[
                            {
                                "id":"1714",
                                "odds":"1.79",
                                "isActive":1,
                                "desc":"Arnett Gardens FC (-0.5)"
                            }
                        ]
                    },
                    {
                        "id":"16",
                        "specifier":"hcp=-0.5",
                        "product":1,
                        "desc":"Handicap",
                        "status":0,
                        "group":"main",
                        "favourite":0,
                        "outcomes":[
                            {
                                "id":"1714",
                                "odds":"2.1",
                                "isActive":1,
                                "desc":"Arnett Gardens FC (-0.5)"
                            }
                        ]
                    }
                ]
            }
        ]
    }
})
