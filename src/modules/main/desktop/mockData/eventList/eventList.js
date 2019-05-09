import mockjax from 'mock';

/* 获取赛事列表

params: sportId  --  赛事类型 (Football 等5种)
		categoryId -- 国家
		tournamentId --- 联赛 (Premier League , League Cup)
		productId(必带字段) -- 1(Liveodd 直播体育) or 3 (Sport 真实体育)
		data  -- eventStartTime
		marketGroupId --- 玩法组 --- 通过玩法组获取基本玩法信息
		*/
// mockjax.get('/factsCenter/pcEventList', {
// 	bizCode: 10000,
// 	message: '',
// 	data: [{
// 		id: 'sr:tournament:18',
// 		name: 'Championship',
// 		score: 9,
// 		events: [{
// 			eventId: 'sr:match:11868008',
// 			gameId: 3454,
// 			estimateStartTime: 1505795510519,
// 			estimateStopTime: 1505795510519,
// 			score: '1-1', // set score
// 			playedSeconds: '00:33', // game score
// 			eventPeriod: '3',
// 			homeTeamName: 'Birmingham City',
// 			awayTeamName: 'Bristol City',
// 			specifier: 'total=1.5',
// 			favourite: 1,
// 			sport: {
// 				id: 'sr:sport:1',
// 				name: 'Football',
// 				category: {
// 					id: 'sr:category:1',
// 					name: 'England'
// 				}
// 			},
// 			totalMarketSize: 88,
// 			markets: [{
// 				id: '1',
// 				product: 1,
// 				desc: '1x2',
// 				group: 'x',
// 				status: 1,
// 				favourite: 1,
// 				outcomes: [{
// 					id: '1',
// 					odds: '2.37',
// 					isActive: 1,
// 					desc: 'Team1'
// 				},
// 				{
// 					id: '2',
// 					isActive: 1,
// 					odds: '3.1',
// 					desc: 'draw'
// 				},
// 				{
// 					id: '3',
// 					isActive: 1,
// 					odds: '2.8',
// 					desc: 'Team2'
// 				}
// 				]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 1,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '14',
// 					isActive: 1,
// 					odds: '5.5',
// 					desc: 'under 0.5'
// 				}]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=2.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '14',
// 					isActive: 1,
// 					odds: '5.5',
// 					desc: 'under 0.5'
// 				}]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '14',
// 					isActive: 1,
// 					odds: '5.5',
// 					desc: 'under 0.5'
// 				}]
// 			}
// 			]
// 		}, {
// 			eventId: 'sr:match:11868008',
// 			gameId: 3454,
// 			estimateStartTime: 1505795510519,
// 			estimateStopTime: 1505795510519,
// 			score: '1-1',
// 			playedSeconds: '00:33',
// 			eventPeriod: '3',
// 			homeTeamName: 'Birmingham City',
// 			awayTeamName: 'Bristol City',
// 			sport: {
// 				id: 'sr:sport:1',
// 				name: 'Football',
// 				category: {
// 					id: 'sr:category:1',
// 					name: 'England'
// 				}
// 			},
// 			totalMarketSize: 88,
// 			markets: [{
// 				id: '1',
// 				product: 1,
// 				desc: '1x2',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '1',
// 					odds: '2.37',
// 					isActive: 1,
// 					desc: 'Team1'
// 				},
// 				{
// 					id: '2',
// 					isActive: 1,
// 					odds: '3.1',
// 					desc: 'draw'
// 				},
// 				{
// 					id: '3',
// 					isActive: 1,
// 					odds: '2.8',
// 					desc: 'Team2'
// 				}
// 				]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				}]
// 			}
// 			]
// 		}, {
// 			eventId: 'sr:match:11868008',
// 			gameId: 3454,
// 			estimateStartTime: 1505795510519,
// 			estimateStopTime: 1505795510519,
// 			score: '1-1',
// 			playedSeconds: '00:33',
// 			eventPeriod: '3',
// 			homeTeamName: 'Birmingham City',
// 			awayTeamName: 'Bristol City',
// 			sport: {
// 				id: 'sr:sport:1',
// 				name: 'Football',
// 				category: {
// 					id: 'sr:category:1',
// 					name: 'England'
// 				}
// 			},
// 			totalMarketSize: 88,
// 			markets: [{
// 				id: '1',
// 				product: 1,
// 				desc: '1x2',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '1',
// 					odds: '2.37',
// 					isActive: 1,
// 					desc: 'Team1'
// 				},
// 				{
// 					id: '2',
// 					isActive: 1,
// 					odds: '3.1',
// 					desc: 'draw'
// 				},
// 				{
// 					id: '3',
// 					isActive: 1,
// 					odds: '2.8',
// 					desc: 'Team2'
// 				}
// 				]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				}]
// 			}
// 			]
// 		}, {
// 			eventId: 'sr:match:11868008',
// 			gameId: 3454,
// 			estimateStartTime: 1505795510519,
// 			estimateStopTime: 1505795510519,
// 			score: '1-1',
// 			playedSeconds: '00:33',
// 			eventPeriod: '3',
// 			homeTeamName: 'Birmingham City',
// 			awayTeamName: 'Bristol City',
// 			sport: {
// 				id: 'sr:sport:1',
// 				name: 'Football',
// 				category: {
// 					id: 'sr:category:1',
// 					name: 'England'
// 				}
// 			},
// 			totalMarketSize: 88,
// 			markets: [{
// 				id: '1',
// 				product: 1,
// 				desc: '1x2',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '1',
// 					odds: '2.37',
// 					isActive: 1,
// 					desc: 'Team1'
// 				},
// 				{
// 					id: '2',
// 					isActive: 1,
// 					odds: '3.1',
// 					desc: 'draw'
// 				},
// 				{
// 					id: '3',
// 					isActive: 1,
// 					odds: '2.8',
// 					desc: 'Team2'
// 				}
// 				]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				}]
// 			}
// 			]
// 		}]
// 	},
// 	{
// 		id: 'sr:tournament:1',
// 		name: 'Premier League',
// 		score: 1,
// 		events: [{
// 			eventId: 'sr:match:11868008',
// 			gameId: 3454,
// 			estimateStartTime: 1505795510519,
// 			estimateStopTime: 1505795510519,
// 			score: '1-1',
// 			playedSeconds: '00:33',
// 			eventPeriod: '3',
// 			homeTeamName: 'Birmingham City',
// 			awayTeamName: 'Bristol City',
// 			sport: {
// 				id: 'sr:sport:1',
// 				name: 'Football',
// 				category: {
// 					id: 'sr:category:1',
// 					name: 'England'
// 				}
// 			},
// 			totalMarketSize: 88,
// 			markets: [{
// 				id: '1',
// 				product: 1,
// 				desc: '1x2',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 0,
// 				outcomes: [{
// 					id: '1',
// 					odds: '2.37',
// 					isActive: 1,
// 					desc: 'Team1'
// 				},
// 				{
// 					id: '2',
// 					isActive: 1,
// 					odds: '3.1',
// 					desc: 'draw'
// 				},
// 				{
// 					id: '3',
// 					isActive: 1,
// 					odds: '2.8',
// 					desc: 'Team2'
// 				}
// 				]
// 			},
// 			{
// 				id: '18',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				specifier: 'total=0.5',
// 				favourite: 1.5,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				}]
// 			}
// 			]
// 		},
// 		{
// 			eventId: 'sr:match:11868008',
// 			gameId: 3454,
// 			estimateStartTime: 1505795510519,
// 			estimateStopTime: 1505795510519,
// 			score: '1-1',
// 			playedSeconds: '00:33',
// 			eventPeriod: '3',
// 			homeTeamName: 'Birmingham City',
// 			awayTeamName: 'Bristol City',
// 			specifier: [1.5, 0.5, 2.5],
// 			favourite: 1.5,
// 			sport: {
// 				id: 'sr:sport:1',
// 				name: 'Football',
// 				category: {
// 					id: 'sr:category:1',
// 					name: 'England'
// 				}
// 			},
// 			totalMarketSize: 88,
// 			markets: [{
// 				id: '1',
// 				product: 1,
// 				desc: '1x2',
// 				group: 'x',
// 				status: 1,
// 				outcomes: [{
// 					id: '1',
// 					odds: '2.37',
// 					isActive: 1,
// 					desc: 'Team1'
// 				},
// 				{
// 					id: '2',
// 					isActive: 1,
// 					odds: '3.1',
// 					desc: 'draw'
// 				},
// 				{
// 					id: '3',
// 					isActive: 1,
// 					odds: '2.8',
// 					desc: 'Team2'
// 				}
// 				]
// 			},
// 			{
// 				id: '18',
// 				specifier: 'total=0.5',
// 				product: 1,
// 				desc: 'Total',
// 				group: 'x',
// 				status: 1,
// 				outcomes: [{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				},
// 				{
// 					id: '13',
// 					isActive: 1,
// 					odds: '7.8',
// 					desc: 'under 0.5'
// 				}]
// 			}
// 			]
// 		}
// 		]
// 	}
// 	]
// });

mockjax.get('/factsCenter/pcEventList', {
	bizCode: 10000,
	message: '',
	data: [
		{
			id: 'sr:tournament:18',
			name: 'Championship',
			score: 9,
			events: [{
				eventId: 'sr:match:11868008',
				gameId: 3454,
				estimateStartTime: 1505795510519,
				estimateStopTime: 1505795510519,
				score: '1-1', // set score
				playedSeconds: '00:33', // game score
				eventPeriod: '3',
				homeTeamName: 'Birmingham City',
				awayTeamName: 'Bristol City',
				specifier: 'total=1.5',
				favourite: 1,
				sport: {
					id: 'sr:sport:1',
					name: 'Football',
					category: {
						id: 'sr:category:1',
						name: 'England'
					}
				},
				totalMarketSize: 88,
				markets: [{
					id: '1',
					product: 1,
					desc: '1x2',
					group: 'x',
					status: 1,
					favourite: 1,
					outcomes: [{
						id: '1',
						odds: '2.37',
						isActive: 1,
						desc: 'Team1'
					},
					{
						id: '2',
						isActive: 1,
						odds: '3.1',
						desc: 'draw'
					},
					{
						id: '3',
						isActive: 1,
						odds: '2.8',
						desc: 'Team2'
					}
				    ]
				},
				{
					id: '18',
					product: 1,
					desc: 'Total',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 1,
					outcomes: [{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					},
					{
						id: '14',
						isActive: 1,
						odds: '5.5',
						desc: 'under 0.5'
					}
					]
				},
				{
					id: '18',
					product: 1,
					desc: 'Total',
					group: 'x',
					status: 1,
					specifier: 'total=2.5',
					favourite: 0,
					outcomes: [{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					},
					{
						id: '14',
						isActive: 1,
						odds: '5.5',
						desc: 'under 0.5'
					}
					]
				},
				{
					id: '18',
					product: 1,
					desc: 'Total',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					},
					{
						id: '14',
						isActive: 1,
						odds: '5.5',
						desc: 'under 0.5'
					}
					]
				}
				]
			},
			{
				eventId: 'sr:match:11868003',
				gameId: 3454,
				estimateStartTime: 1505795510519,
				estimateStopTime: 1505795510519,
				score: '1-1',
				playedSeconds: '00:33',
				eventPeriod: '3',
				homeTeamName: 'Birmingham City',
				awayTeamName: 'Bristol City',
				sport: {
					id: 'sr:sport:1',
					name: 'Football',
					category: {
						id: 'sr:category:1',
						name: 'England'
					}
				},
				totalMarketSize: 88,
				markets: [{
					id: '1',
					product: 1,
					desc: '1x2',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '1',
						odds: '2.37',
						isActive: 1,
						desc: 'Team1'
					},
					{
						id: '2',
						isActive: 1,
						odds: '3.1',
						desc: 'draw'
					},
					{
						id: '3',
						isActive: 1,
						odds: '2.8',
						desc: 'Team2'
					}
					]
				},
				{
					id: '18',
					product: 1,
					desc: 'Total',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					},
					{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					}
					]
				}
				]
			},
			{
				eventId: 'sr:match:11868018',
				gameId: 3454,
				estimateStartTime: 1505795510519,
				estimateStopTime: 1505795510519,
				score: '1-1',
				playedSeconds: '00:33',
				eventPeriod: '3',
				homeTeamName: 'Birmingham City',
				awayTeamName: 'Bristol City',
				sport: {
					id: 'sr:sport:1',
					name: 'Football',
					category: {
						id: 'sr:category:1',
						name: 'England'
					}
				},
				totalMarketSize: 88,
				markets: [{
					id: '1',
					product: 1,
					desc: '1x2',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '1',
						odds: '2.37',
						isActive: 1,
						desc: 'Team1'
					},
					{
						id: '2',
						isActive: 1,
						odds: '3.1',
						desc: 'draw'
					},
					{
						id: '3',
						isActive: 1,
						odds: '2.8',
						desc: 'Team2'
					}
					]
				},
				{
					id: '18',
					product: 1,
					desc: 'Total',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					},
					{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					}
					]
				}
				]
			}, {
				eventId: 'sr:match:21868008',
				gameId: 3454,
				estimateStartTime: 1505795510519,
				estimateStopTime: 1505795510519,
				score: '1-1',
				playedSeconds: '00:33',
				eventPeriod: '3',
				homeTeamName: 'Birmingham City',
				awayTeamName: 'Bristol City',
				sport: {
					id: 'sr:sport:1',
					name: 'Football',
					category: {
						id: 'sr:category:1',
						name: 'England'
					}
				},
				totalMarketSize: 88,
				markets: [{
					id: '1',
					product: 1,
					desc: '1x2',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '1',
						odds: '2.37',
						isActive: 1,
						desc: 'Team1'
					},
					{
						id: '2',
						isActive: 1,
						odds: '3.1',
						desc: 'draw'
					},
					{
						id: '3',
						isActive: 1,
						odds: '2.8',
						desc: 'Team2'
					}
					]
				},
				{
					id: '18',
					product: 1,
					desc: 'Total',
					group: 'x',
					status: 1,
					specifier: 'total=0.5',
					favourite: 0,
					outcomes: [{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					},
					{
						id: '13',
						isActive: 1,
						odds: '7.8',
						desc: 'under 0.5'
					}
					]
				}
				]
			}
			]
		},
		{
			id: 'sr:tournament:1',
			name: 'Premier League',
			score: 1,
			events: [{
					eventId: 'sr:match:18868023',
					gameId: 3454,
					estimateStartTime: 1505795510519,
					estimateStopTime: 1505795510519,
					score: '1-1',
					playedSeconds: '00:33',
					eventPeriod: '3',
					homeTeamName: 'Birmingham City',
					awayTeamName: 'Bristol City',
					sport: {
						id: 'sr:sport:1',
						name: 'Football',
						category: {
							id: 'sr:category:1',
							name: 'England'
						}
					},
					totalMarketSize: 88,
					markets: [{
							id: '1',
							product: 1,
							desc: '1x2',
							group: 'x',
							status: 1,
							specifier: 'total=0.5',
							favourite: 0,
							outcomes: [{
									id: '1',
									odds: '2.37',
									isActive: 1,
									desc: 'Team1'
								},
								{
									id: '2',
									isActive: 1,
									odds: '3.1',
									desc: 'draw'
								},
								{
									id: '3',
									isActive: 1,
									odds: '2.8',
									desc: 'Team2'
								}
							]
						},
						{
							id: '18',
							product: 1,
							desc: 'Total',
							group: 'x',
							status: 1,
							specifier: 'total=0.5',
							favourite: 1.5,
							outcomes: [{
									id: '13',
									isActive: 1,
									odds: '7.8',
									desc: 'under 0.5'
								},
								{
									id: '13',
									isActive: 1,
									odds: '7.8',
									desc: 'under 0.5'
								}
							]
						}
					]
				},
				{
					eventId: 'sr:match:11828008',
					gameId: 3454,
					estimateStartTime: 1505795510519,
					estimateStopTime: 1505795510519,
					score: '1-1',
					playedSeconds: '00:33',
					eventPeriod: '3',
					homeTeamName: 'Birmingham City',
					awayTeamName: 'Bristol City',
					specifier: [1.5, 0.5, 2.5],
					favourite: 1.5,
					sport: {
						id: 'sr:sport:1',
						name: 'Football',
						category: {
							id: 'sr:category:1',
							name: 'England'
						}
					},
					totalMarketSize: 88,
					markets: [{
							id: '1',
							product: 1,
							desc: '1x2',
							group: 'x',
							status: 1,
							outcomes: [{
									id: '1',
									odds: '2.37',
									isActive: 1,
									desc: 'Team1'
								},
								{
									id: '2',
									isActive: 1,
									odds: '3.1',
									desc: 'draw'
								},
								{
									id: '3',
									isActive: 1,
									odds: '2.8',
									desc: 'Team2'
								}
							]
						},
						{
							id: '18',
							specifier: 'total=0.5',
							product: 1,
							desc: 'Total',
							group: 'x',
							status: 1,
							outcomes: [{
									id: '13',
									isActive: 1,
									odds: '7.8',
									desc: 'under 0.5'
								},
								{
									id: '13',
									isActive: 1,
									odds: '7.8',
									desc: 'under 0.5'
								}
							]
						}
					]
				}
			]
		}
	]
});

/* 常用玩法下拉列表 params: sportId */
mockjax.get('/factsCenter/marketOptions', {
	bizCode: 10000,
	message: '',
	data: [
		[{
			name: '3Way',
			id: 1,
			title: ['1', 'X', '2']
		},
		{
			name: 'O/U',
			id: 18,
			title: ['OVER', 'UNDER']
		}],
		[{
			name: 'Double Chance',
			id: 20,
			title: ['1 X', 'X 2', '2 1']
		}],
		[{
			name: 'GG/NG',
			id: 30,
			title: ['GG', 'NG']
		}],
		[{
			name: 'Draw to Bet',
			id: 11,
			title: ['1', '2']
		}],
		[{
			name: 'Odd/Even',
			id: 372,
			title: ['Odd', 'Even']
		}],
		[{
			name: 'O/U & GG/NG',
			id: 36,
			title: ['Over 2.5 & GG', 'Under 2.5 & GG', 'Over 2.5 & NG', 'Under 2.5 & NG']
		}],
		[{
			name: 'Handicap',
			id: 12,
			title: ['1 H', 'X H', '2 H']
		}]
	]
});
