import mockjax from 'mock';
const liveData1 = {
	bizCode: 10000,
	msg: '测试内容12345',
	data: [{
		id: 'sr:tournament:53',
		name: 'Championship',
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
			}]
		}]
	}]
};

const liveData5 = {
	bizCode: 10000,
	msg: '测试内容12345',
	data: [{
		id: 'sr:tournament:53',
		name: 'Championship',
		events: [{
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
	}]
};

// 足球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/liveOrPrematchEvents' && opt.body.sportId === 'sr:sport:1') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData1.data[0].events[0].sport.id = 'sr:sport:1';
			resolve(liveData1);
		}, 1000);
	});
});
// 篮球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/liveOrPrematchEvents' && opt.body.sportId === 'sr:sport:2') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData1.data[0].events[0].sport.id = 'sr:sport:2';
			resolve(liveData1);
		}, 300);
	});
});
// 网球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/liveOrPrematchEvents' && opt.body.sportId === 'sr:sport:5') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData5.data[0].events[0].sport.id = 'sr:sport:5';
			liveData5.data[0].events[0].markets[0].id = 186;
			resolve(liveData5);
		}, 300);
	});
});
// 橄榄球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/liveOrPrematchEvents' && opt.body.sportId === 'sr:sport:12') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData5.data[0].events[0].sport.id = 'sr:sport:12';
			liveData5.data[0].events[0].markets[0].id = 1;
			resolve(liveData5);
		}, 300);
	});
});
// 半球
mockjax.get((url, opt) => {
	if (url === '/factsCenter/liveOrPrematchEvents' && opt.body.sportId === 'sr:sport:21') {
		return true;
	}
}, function () {
	return new Promise(function (resolve) {
		window.setTimeout(function () {
			liveData5.data[0].events[0].sport.id = 'sr:sport:21';
			liveData5.data[0].events[0].markets[0].id = 340;
			resolve(liveData5);
		}, 300);
	});
});
