import mockjax from 'mock';

const getSport = function (id) {
	return {
		id: 'sr:sport:' + id,
		name: 'Soccer',
		category: {
			id: 'sr:category:1',
			name: 'England',
			tournament: {
				id: 'sr:tournament:53',
				name: 'Championship'
			}
		}
	};
};

const get3Way = function (id = 1) {
	return {
		id,
		desc: '1x2',
		group: 'x',
		status: 0,
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
		}]
	};
};

const get2Way = function (id) {
	return {
		id,
		desc: '12',
		group: 'x',
		status: 0,
		outcomes: [{
			id: '1',
			odds: '2.37',
			isActive: 1,
			desc: 'Team1'
		}, {
			id: '2',
			isActive: 1,
			odds: '3.1',
			desc: 'draw'
		}]
	};
};

const getOverUnder = function (id = 18) {
	return [{
		id,
		product: 1,
		desc: 'Total',
		group: 'x',
		status: 0,
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
		id,
		product: 1,
		desc: 'Total',
		group: 'x',
		status: 0,
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
		id,
		product: 1,
		desc: 'Total',
		group: 'x',
		status: 0,
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
	}];
};

const getDoubleChance = function (id) {
	return {
		id,
		desc: 'db',
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
	};
};

const getData = function (markets, sport, categoryId = 1) {
	return {
		bizCode: 10000,
		msg: '测试内容12345',
		data: [{
			id: 'sr:tournament:1',
			name: 'Championship' + Math.round(Math.random() * 10),
			categoryName: 'Championship',
			categoryId: 'sr:category:1',
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
				sport,
				totalMarketSize: 88,
				markets
			}]
		}, {
			id: 'sr:tournament:12',
			name: 'asdf',
			categoryName: 'Championship12',
			categoryId: 'sr:category:1',
			score: 2
		}, {
			id: 'sr:tournament:2',
			name: 'china',
			categoryName: 'Championship1',
			categoryId: 'sr:category:2',
			score: 2
		}, {
			id: 'sr:tournament:3',
			name: 'abc',
			categoryName: 'Championship1',
			categoryId: 'sr:category:3',
			score: 2
		}, {
			id: 'sr:tournament:4',
			name: 'eft',
			categoryName: 'Championship1',
			categoryId: 'sr:category:4',
			score: 2
		}, {
			id: 'sr:tournament:5',
			name: 'hmk',
			categoryName: 'Championship1',
			categoryId: 'sr:category:5',
			score: 2
		}, {
			id: 'sr:tournament:6',
			name: 'vafs',
			categoryName: 'Championship1',
			categoryId: 'sr:category:6',
			score: 2
		}, {
			id: 'sr:tournament:7',
			name: 'asdf',
			categoryName: 'Championship1',
			categoryId: 'sr:category:7',
			score: 2
		}]
	};
};

const getData1 = function (markets) {
	return {
		bizCode: 10000,
		msg: '测试内容12345',
		data: [{
			id: 'sr:tournament:12',
			name: 'Championship' + Math.round(Math.random() * 10),
			categoryName: 'Championship',
			categoryId: 'sr:category:1',
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
							id: 'sr:tournament:12',
							name: 'Championship'
						}
					}
				},
				totalMarketSize: 88,
				markets
			}]
		}]
	};
};


mockjax.get((url, opt) => {
	if (url === '/factsCenter/importantEvents' && opt.body.sportId === 'sr:sport:1') {
		return true;
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get3Way(1), ...getOverUnder(21), getDoubleChance(10), get2Way(29)],
			getSport(1),
			1
		));
	});
});

mockjax.get((url, opt) => {
	if (url === '/factsCenter/importantEvents' && opt.body.sportId === 'sr:sport:2') {
		return true;
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get3Way(1), ...getOverUnder(18), get2Way(219)],
			getSport(2),
			2
		));
	});
});

mockjax.get((url, opt) => {
	if (url === '/factsCenter/importantEvents' && opt.body.sportId === 'sr:sport:5') {
		return true;
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get2Way(186), ...getOverUnder(189), get2Way(202)],
			getSport(5),
			5
		));
	});
});

mockjax.get((url, opt) => {
	if (url === '/factsCenter/importantEvents' && opt.body.sportId === 'sr:sport:12') {
		return true;
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get2Way(1), ...getOverUnder(18)],
			getSport(12),
			12
		));
	});
});

mockjax.get((url, opt) => {
	if (url === '/factsCenter/importantEvents' && opt.body.sportId === 'sr:sport:21') {
		return true;
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get2Way(340), ...getOverUnder(605)],
			getSport(21),
			21
		));
	});
});
mockjax.post((url, opt) => {
	if (url === '/factsCenter/wapEvents') {
		const test = opt.body.test;
		if (test) {
			return true;
		}
	}
}, () => {
	return new Promise(function (resolve) {
		let data = getData1(
			[get3Way(1), ...getOverUnder(21), getDoubleChance(10), get2Way(29)],
			getSport(1),
			1
		);
		resolve(data);
	});
});

mockjax.post((url, opt) => {
	if (url === '/factsCenter/wapEvents') {
		let data = opt.body.data || '';
		data = JSON.parse(data);
		return data.sportId === 'sr:sport:1';
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get3Way(1), ...getOverUnder(21), getDoubleChance(10), get2Way(29)],
			getSport(1),
			1
		));
	});
});

mockjax.post((url, opt) => {
	if (url === '/factsCenter/wapEvents') {
		let data = opt.body.data || '';
		data = JSON.parse(data);
		return data.sportId === 'sr:sport:2';
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get3Way(1), ...getOverUnder(18), get2Way(219)],
			getSport(2),
			2
		));
	});
});

mockjax.post((url, opt) => {
	if (url === '/factsCenter/wapEvents') {
		let data = opt.body.data || '';
		data = JSON.parse(data);
		return data.sportId === 'sr:sport:5';
	}
}, () => {
	return new Promise(function (resolve) {
		window.setTimeout(() => {
			resolve(getData(
				[get2Way(186), ...getOverUnder(189), get2Way(202)],
				getSport(5),
				5
			));
		}, 1000);
	});
});

mockjax.post((url, opt) => {

	if (url === '/factsCenter/wapEvents') {
		let data = opt.body.data || '';
		data = JSON.parse(data);
		return data.sportId === 'sr:sport:12';
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get2Way(1), ...getOverUnder(18)],
			getSport(12),
			12
		));
	});
});

mockjax.post((url, opt) => {
	if (url === '/factsCenter/wapEvents') {
		let data = opt.body.data || '';
		data = JSON.parse(data);
		return data.sportId === 'sr:sport:21';
	}
}, () => {
	return new Promise(function (resolve) {
		resolve(getData(
			[get2Way(340), ...getOverUnder(605)],
			getSport(21),
			21
		));
	});
});
