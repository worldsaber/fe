import mockjax from 'mock';

const cfg = {
	bizCode: 10000,
	message: 'error',
	data: [{
		id: 'sr:sport:1',
		name: 'Soccer',
		eventSize: 20,
		categories: [{
			id: 'sr:category:1',
			name: 'England',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:1',
				name: 'Championship',
				eventSize: 15
			}, {
				id: 'sr:tournament:12',
				name: 'Championship1',
				eventSize: 15
			}, {
				id: 'sr:tournament:13',
				name: 'Championship2',
				eventSize: 15
			}, {
				id: 'sr:tournament:14',
				name: 'Championship2',
				eventSize: 53
			}]
		}, {
			id: 'sr:category:2',
			name: 'England1',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:15',
				name: 'test1',
				eventSize: 15
			}, {
				id: 'sr:tournament:16',
				name: 'test2',
				eventSize: 15
			}, {
				id: 'sr:tournament:17',
				name: 'test3',
				eventSize: 15
			}]
		}]
	}, {
		id: 'sr:sport:2',
		name: 'Basketball',
		eventSize: 20,
		categories: [{
			id: 'sr:category:3',
			name: 'England2',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:18',
				name: 'Championship',
				eventSize: 15
			}, {
				id: 'sr:tournament:19',
				name: 'Championship1',
				eventSize: 15
			}, {
				id: 'sr:tournament:20',
				name: 'Championship2',
				eventSize: 15
			}]
		}, {
			id: 'sr:category:4',
			name: 'England3',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:21',
				name: 'test1',
				eventSize: 15
			}, {
				id: 'sr:tournament:22',
				name: 'test2',
				eventSize: 15
			}, {
				id: 'sr:tournament:23',
				name: 'test3',
				eventSize: 15
			}]
		}]
	}, {
		id: 'sr:sport:5',
		name: 'Tennis',
		eventSize: 20,
		categories: [{
			id: 'sr:category:5',
			name: 'England5',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:24',
				name: 'Championship',
				eventSize: 15
			}, {
				id: 'sr:tournament:25',
				name: 'Championship1',
				eventSize: 15
			}, {
				id: 'sr:tournament:26',
				name: 'Championship2',
				eventSize: 15
			}]
		}, {
			id: 'sr:category:2',
			name: 'England',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:1',
				name: 'test1',
				eventSize: 15
			}, {
				id: 'sr:tournament:2',
				name: 'test2',
				eventSize: 15
			}, {
				id: 'sr:tournament:3',
				name: 'test3',
				eventSize: 15
			}]
		}]
	}, {
		id: 'sr:sport:12',
		name: 'Rugby Union',
		eventSize: 20,
		categories: [{
			id: 'sr:category:6',
			name: 'England6',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:27',
				name: 'Championship',
				eventSize: 15
			}, {
				id: 'sr:tournament:28',
				name: 'Championship1',
				eventSize: 15
			}, {
				id: 'sr:tournament:29',
				name: 'Championship2',
				eventSize: 15
			}]
		}, {
			id: 'sr:category:2',
			name: 'England',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:1',
				name: 'test1',
				eventSize: 15
			}, {
				id: 'sr:tournament:2',
				name: 'test2',
				eventSize: 15
			}, {
				id: 'sr:tournament:3',
				name: 'test3',
				eventSize: 15
			}]
		}]
	}, {
		id: 'sr:sport:21',
		name: 'Cricket',
		eventSize: 20,
		categories: [{
			id: 'sr:category:7',
			name: 'England7',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:30',
				name: 'Championship',
				eventSize: 15
			}, {
				id: 'sr:tournament:31',
				name: 'Championship1',
				eventSize: 15
			}, {
				id: 'sr:tournament:32',
				name: 'Championship2',
				eventSize: 15
			}]
		}, {
			id: 'sr:category:8',
			name: 'England8',
			eventSize: 20,
			tournaments: [{
				id: 'sr:tournament:33',
				name: 'test1',
				eventSize: 15
			}, {
				id: 'sr:tournament:34',
				name: 'test2',
				eventSize: 15
			}, {
				id: 'sr:tournament:35',
				name: 'test3',
				eventSize: 15
			}]
		}]
	}]
};
// 通过该接口可以获取 sport分类，categoriy分类,tournaments分类,以及每个分类下的event数量
/**
 * @sportId 赛事大分类，如果不给就返回所有的分类
 * @timeline 长整形时间参数，会返回规定时间的比赛分类，可以不给
 * @productId 1表示live，3表示prematch
 * @option 1。如果只想取大分类的数量，则可以传递1， 如果不想获取tournament的数量，而是只想获取categories和sports则传递2
 */
mockjax.get('/factsCenter/sportList', () => new Promise((resolve, reject) => {
	window.setTimeout(() => {
		cfg.data[0].categories[0].name = 'test' + Math.round(Math.random() * 10);
		resolve(cfg);
	}, 1000);
}));
