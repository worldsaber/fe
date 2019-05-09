import mockjax from 'mock';

const homeCfg = {
	bizCode: 10000,
	msg: '测试内容12345',
	data: {
		ch: '测试内容12345',
		// 顶部广告
		topAd: {
			text: '测试内容12345',
			imgUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		},
		// 轮播图
		mainBanner: [{
			text: '测试内容12345',
			imgUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}],
		secondBanner: {
			text: '测试内容12345',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		},
		// 流行玩法
		popularList: [{
			text: '测试内容12345',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}, {
			text: '测试内容12345',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}, {
			text: '12323',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}, {
			text: '测试内容12345',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}, {
			text: '测试内容12345',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}, {
			text: '12323',
			iconUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}],
		updateAd: [{
			text: '测试内容12345',
			imgUrl: '测试内容12345',
			linkUrl: '测试内容12345'
		}]
	}
};

mockjax.get('/common/config/home', homeCfg);

const data = {
	bizCode: 10000,
	msg: '测试内容12345',
	data: [{
		id: 'sr:category:1',
		name: 'Championship',
		categoryName: 'Championship',
		categoryId: 'sr:tournament:53',
		score: 2,
		events: [{
			eventId: 'sr:match:11868010',
			gameId: 3454,
			estimateStartTime: 1505896094453,
			estimateStopTime: 1505896094453,
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
						id: 'sr:tournament:53',
						name: 'Championship'
					}
				}
			},
			totalMarketSize: 88,
			markets: [{
				id: '1',
				desc: '1x2',
				group: 'x',
				isActive: 1,
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
			}, {
				id: '186',
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
				}]
			}, {
				id: '340',
				desc: '12',
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
				}]
			}]
		}]
	}]
};

const liveData1 = {
	bizCode: 10000,
	msg: '测试内容12345',
	data: [{
		eventId: 'sr:match:11868010',
		gameId: 3454,
		estimateStartTime: 1505896094453,
		estimateStopTime: 1505896094453,
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
					id: 'sr:tournament:53',
					name: 'Championship'
				}
			}
		},
		totalMarketSize: 88,
		markets: [{
			id: '1',
			desc: '1x2',
			group: 'x',
			isActive: 1,
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
		}]
	}]
};

const liveData5 = {
	bizCode: 10000,
	msg: '测试内容12345',
	data: [{
		eventId: 'sr:match:11868010',
		gameId: 3454,
		estimateStartTime: 1505896094453,
		estimateStopTime: 1505896094453,
		score: '3-1',
		playedSeconds: '00:33',
		homeTeamName: 'Birmingham City',
		awayTeamName: 'Bristol City',
		sport: {
			id: 'sr:sport:5',
			name: 'Soccer',
			category: {
				id: 'sr:category:1',
				name: 'England',
				tournament: {
					id: 'sr:tournament:53',
					name: 'Championship'
				}
			}
		},
		totalMarketSize: 88,
		markets: [{
			id: '186',
			desc: '12',
			group: 'x',
			isActive: 1,
			outcomes: [{
				id: '1',
				odds: '2.37',
				isActive: 1,
				desc: 'test'
			}, {
				id: '2',
				isActive: 1,
				odds: '3.1',
				desc: 'test2'
			}]
		}, {
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
				odds: '7.3',
				desc: 'under 0.5'
			},
			{
				id: '14',
				isActive: 1,
				odds: '3.5',
				desc: 'under 0.5'
			}]
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
			}]
		},
		{
			id: '18',
			product: 1,
			desc: 'Total',
			group: 'x',
			status: 1,
			specifier: 'total=1.5',
			favourite: 0,
			outcomes: [{
				id: '13',
				isActive: 1,
				odds: '7.1',
				desc: 'under 0.5'
			},
			{
				id: '14',
				isActive: 1,
				odds: '5.2',
				desc: 'under 0.5'
			}]
		}]
	}]
};

// 足球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/wapIndexLiveEvents' && opt.body.sportId === 'sr:sport:1') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData1.data[0].sport.id = 'sr:sport:1';
			resolve(liveData1);
		}, 1000);
	});
});
// 篮球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/wapIndexLiveEvents' && opt.body.sportId === 'sr:sport:2') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData1.data[0].sport.id = 'sr:sport:2';
			resolve(liveData1);
		}, 300);
	});
});
// 网球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/wapIndexLiveEvents' && opt.body.sportId === 'sr:sport:5') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData5.data[0].sport.id = 'sr:sport:5';
			liveData5.data[0].markets[0].id = 186;
			resolve(liveData5);
		}, 300);
	});
});
// 橄榄球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/wapIndexLiveEvents' && opt.body.sportId === 'sr:sport:12') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData5.data[0].sport.id = 'sr:sport:12';
			liveData5.data[0].markets[0].id = 1;
			resolve(liveData5);
		}, 300);
	});
});
// 半球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/wapIndexLiveEvents' && opt.body.sportId === 'sr:sport:21') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData5.data[0].sport.id = 'sr:sport:21';
			liveData5.data[0].markets[0].id = 340;
			resolve(liveData5);
		}, 300);
	});
});
mockjax.get('/factsCenter/wapHighlightEvents', data);

// 推荐比赛
mockjax.get('/factsCenter/recommendEvents', {
	"bizCode": 10000,
	"message": "0#0",
	"data": {
		"title": "Feature",
		"events": [{
			"eventId": "sr:match:13474209",
			"gameId": "3773",
			"productStatus": "0#0",
			"estimateStartTime": 1527526800000,
			"status": 4,
			"setScore": "4:2",
			"gameScore": ["1:1", "3:1"],
			"period": "2",
			"matchStatus": "H2",
			"playedSeconds": "90:00",
			"homeTeamName": "Sarpsborg",
			"awayTeamName": "Stabaek Fotball",
			"sport": {
				"id": "sr:sport:1",
				"name": "Football",
				"category": {
					"id": "sr:category:5",
					"name": "Norway",
					"tournament": {
						"id": "sr:tournament:20",
						"name": "Eliteserien"
					}
				}
			},
			"markets": [{
				"id": "1",
				"product": 3,
				"desc": "1x2",
				"status": 3,
				"group": "Main",
				"marketGuide": "What will be the result at full time",
				"title": "1,X,2",
				"name": "3 Way",
				"favourite": 0,
				"outcomes": [{
					"id": "1",
					"odds": "1.75",
					"probability": "0.54217",
					"isActive": 1,
					"desc": "Home",
					"isWinning": 1,
					"refundFactor": 0.0
				}, {
					"id": "2",
					"odds": "3.73",
					"probability": "0.245913",
					"isActive": 1,
					"desc": "Draw",
					"isWinning": 0,
					"refundFactor": 0.0
				}, {
					"id": "3",
					"odds": "4.32",
					"probability": "0.211916",
					"isActive": 1,
					"desc": "Away",
					"isWinning": 0,
					"refundFactor": 0.0
				}]
			}],
			"bookingStatus": "Booked",
			"homeTeamIcon": "https://s.sporty.net/ke/main/res/WechatIMG61.jpeg",
			"awayTeamIcon": "https://s.sporty.net/ke/main/res/WechatIMG62.jpeg"
		}, {
			"eventId": "sr:match:13474213",
			"homeTeamIcon": "https://s.sporty.net/ke/main/res/WechatIMG61.jpeg",
			"awayTeamIcon": "https://s.sporty.net/ke/main/res/WechatIMG62.jpeg"
		}],
		"imgUrl": "https://s.sporty.net/ke/main/res/WechatIMG63.jpeg",
		"linkUrl": "www.163.com",
		"text": "Your ticket must include at least one designated game, and with total odds of 1.5 or above."
	}
}
)

// 
mockjax.get('/factsCenter/wapNewHighlightEvents', {
	"bizCode": 10000,
	"message": "0#0",
	"data": [{
		"eventId": "sr:match:14587874",
		"gameId": "2867",
		"productStatus": "0#0",
		"estimateStartTime": 1527637200000,
		"status": 0,
		"matchStatus": "Not start",
		"homeTeamName": "Deportivo Capiata",
		"awayTeamName": "Nacional Asuncion",
		"sport": {
			"id": "sr:sport:1",
			"name": "Football",
			"category": {
				"id": "sr:category:280",
				"name": "Paraguay",
				"tournament": {
					"id": "sr:tournament:693",
					"name": "Primera Division"
				}
			}
		},
		"totalMarketSize": 122,
		"markets": [{
			"id": "1",
			"product": 3,
			"desc": "1x2",
			"status": 0,
			"group": "Main",
			"marketGuide": "What will be the result at full time",
			"title": "1,X,2",
			"name": "3 Way",
			"favourite": 0,
			"outcomes": [{
				"id": "1",
				"odds": "2.70",
				"probability": "0.348442",
				"isActive": 1,
				"desc": "Home"
			}, {
				"id": "2",
				"odds": "3.30",
				"probability": "0.282415",
				"isActive": 1,
				"desc": "Draw"
			}, {
				"id": "3",
				"odds": "2.55",
				"probability": "0.369149",
				"isActive": 1,
				"desc": "Away"
			}]
		}, {
			"id": "18",
			"specifier": "total=0.5",
			"product": 3,
			"desc": "O/U",
			"status": 0,
			"group": "Main",
			"marketGuide": "Will the match have more or less goals than the allotted Total line at Full time (FT)",
			"title": "Goals,Over,Under",
			"name": "Over/Under",
			"favourite": 0,
			"outcomes": [{
				"id": "12",
				"odds": "1.04",
				"probability": "0.92666",
				"isActive": 1,
				"desc": "Over 0.5"
			}, {
				"id": "13",
				"odds": "8.20",
				"probability": "0.0733398",
				"isActive": 1,
				"desc": "Under 0.5"
			}]
		}, {
			"id": "18",
			"specifier": "total=1.5",
			"product": 3,
			"desc": "O/U",
			"status": 0,
			"group": "Main",
			"marketGuide": "Will the match have more or less goals than the allotted Total line at Full time (FT)",
			"title": "Goals,Over,Under",
			"name": "Over/Under",
			"favourite": 0,
			"outcomes": [{
				"id": "12",
				"odds": "1.27",
				"probability": "0.752369",
				"isActive": 1,
				"desc": "Over 1.5"
			}, {
				"id": "13",
				"odds": "3.45",
				"probability": "0.247632",
				"isActive": 1,
				"desc": "Under 1.5"
			}]
		}, {
			"id": "18",
			"specifier": "total=2.5",
			"product": 3,
			"desc": "O/U",
			"status": 0,
			"group": "Main",
			"marketGuide": "Will the match have more or less goals than the allotted Total line at Full time (FT)",
			"title": "Goals,Over,Under",
			"name": "Over/Under",
			"favourite": 1,
			"outcomes": [{
				"id": "12",
				"odds": "1.85",
				"probability": "0.499936",
				"isActive": 1,
				"desc": "Over 2.5"
			}, {
				"id": "13",
				"odds": "1.85",
				"probability": "0.500064",
				"isActive": 1,
				"desc": "Under 2.5"
			}]
		}, {
			"id": "18",
			"specifier": "total=3.5",
			"product": 3,
			"desc": "O/U",
			"status": 0,
			"group": "Main",
			"marketGuide": "Will the match have more or less goals than the allotted Total line at Full time (FT)",
			"title": "Goals,Over,Under",
			"name": "Over/Under",
			"favourite": 0,
			"outcomes": [{
				"id": "12",
				"odds": "3.05",
				"probability": "0.286932",
				"isActive": 1,
				"desc": "Over 3.5"
			}, {
				"id": "13",
				"odds": "1.33",
				"probability": "0.713068",
				"isActive": 1,
				"desc": "Under 3.5"
			}]
		}, {
			"id": "18",
			"specifier": "total=4.5",
			"product": 3,
			"desc": "O/U",
			"status": 0,
			"group": "Main",
			"marketGuide": "Will the match have more or less goals than the allotted Total line at Full time (FT)",
			"title": "Goals,Over,Under",
			"name": "Over/Under",
			"favourite": 0,
			"outcomes": [{
				"id": "12",
				"odds": "5.60",
				"probability": "0.135196",
				"isActive": 1,
				"desc": "Over 4.5"
			}, {
				"id": "13",
				"odds": "1.11",
				"probability": "0.864804",
				"isActive": 1,
				"desc": "Under 4.5"
			}]
		}, {
			"id": "18",
			"specifier": "total=5.5",
			"product": 3,
			"desc": "O/U",
			"status": 0,
			"group": "Main",
			"marketGuide": "Will the match have more or less goals than the allotted Total line at Full time (FT)",
			"title": "Goals,Over,Under",
			"name": "Over/Under",
			"favourite": 0,
			"outcomes": [{
				"id": "12",
				"odds": "9.20",
				"probability": "0.0571023",
				"isActive": 1,
				"desc": "Over 5.5"
			}, {
				"id": "13",
				"odds": "1.03",
				"probability": "0.942898",
				"isActive": 1,
				"desc": "Under 5.5"
			}]
		}],
		"bookingStatus": "Booked"
	}]
}
)
