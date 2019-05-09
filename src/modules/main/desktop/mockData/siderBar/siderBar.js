import mockjax from 'mock';

/*
比赛分类数量
params: sportId
*/

mockjax.get('/factsCenter/sportList', {
	bizCode: 10000,
	message: 'success',
	data: [{
		id: 'sr:sport:1',
		name: 'Football',
		eventSize: '25',
		categories: [{
			id: 'sr:category:1',
			name: 'International',
			eventSize: 1500,
			tournaments: [{
				id: 'sr:tournament:17',
				name: 'Premier League',
				eventSize: 10
			},
			{
				id: 'sr:tournament:18',
				name: 'Championship',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 54
			},
			{
				id: 'sr:tournament:17',
				name: 'Premier League',
				eventSize: 10
			},
			{
				id: 'sr:tournament:18',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Italy',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Spain',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 125
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 234
			},
			{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 222
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 533
			},
			{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 222
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 533
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Australia',
			eventSize: 28,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 222
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 533
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'France',
			eventSize: 100,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 8
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 67
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Belarus',
			eventSize: 90,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 46
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 52
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 54
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 98
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 10
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Austria',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 23
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 12
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'China',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 12
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 23
			}
			]
		},
		{
			id: 'sr:category:1',
			name: 'England',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:18',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:23',
				name: 'Championship',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:26',
				name: 'Premier League',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Italy',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'Italy',
			eventSize: 10,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 188,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 872,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 389
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 54
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 367,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		},
		{
			id: 'sr:category:31',
			name: 'American',
			eventSize: 235,
			tournaments: [{
				id: 'sr:tournament:23',
				name: 'Premier League',
				eventSize: 5
			},
			{
				id: 'sr:tournament:53',
				name: 'Championship',
				eventSize: 5
			}
			]
		}
		]
	}]
});
