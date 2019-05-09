import mockjax from 'mock';

mockjax.get(/\/jackpot\/banner/, {
	bizCode: 10000,
	msg: '',
	data: {
		status: 1,
		bgImage: '',
		maxWinnings: 1000000000,
		leftTime: 1000000
	},
});

mockjax.get(/\/jackpot\/period$/, {
	bizCode: 10000,
	msg: '',
	data: {
		periodNumber: '20170908',
		status: 1,
		deadline: 1506406813,
		elements: [
			{
				index: 1,
				date: 0,
				home: 'Newcastle',
				away: 'Stoke Ham',
				eventId: 'sr:match:11868008',
				outcomes: [
					{
						id: '1',
						desc: 'Newcastle',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Newcastle',
						odds: '1.32'
					}
				]
			},
			{
				index: 2,
				date: 1506393629,
				home: 'Birmingham City',
				away: 'Bristol City',
				eventId: 'sr:match:11868011',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 3,
				date: 1506393629,
				home: 'Birmingham City',
				away: 'Bristol City',
				eventId: 'sr:match:11868013',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 4,
				date: 1506393629,
				home: 'Birmingham City',
				away: 'Bristol City',
				eventId: 'sr:match:11868014',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 5,
				date: 1506393629,
				home: 'Birmingham City',
				away: 'Bristol City',
				eventId: 'sr:match:11868015',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 6,
				date: 1506393629,
				home: 'Birmingham City6',
				away: 'Bristol City',
				eventId: 'sr:match:11868016',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 7,
				date: 1506393629,
				home: 'Birmingham City7',
				away: 'Bristol City',
				eventId: 'sr:match:11868017',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 8,
				date: 1506393629,
				home: 'Birmingham City8',
				away: 'Bristol City',
				eventId: 'sr:match:11868018',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 9,
				date: 1506393629,
				home: 'Birmingham City9',
				away: 'Bristol City',
				eventId: 'sr:match:11868019',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 10,
				date: 1506393610,
				home: 'Birmingham City',
				away: 'Bristol City',
				eventId: 'sr:match:11868010',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			},
			{
				index: 11,
				date: 1506393629,
				home: 'Birmingham City',
				away: 'Bristol City',
				eventId: 'sr:match:11868021',
				outcomes: [
					{
						id: '1',
						desc: 'Birmingham City',
						odds: '1.32'
					},
					{
						id: '2',
						desc: 'draw',
						odds: '1.32'
					},
					{
						id: '3',
						desc: 'Bristol City',
						odds: '1.32'
					}
				]
			}
		]
	}
});

mockjax.get(/\/jackpot\/periodNumbers/, {
	bizCode: 10000,
	msg: '',
	data: [
		'20170926',
		'20170826',
		'20170726',
		'20170926',
		'20170826',
		'20170726',
		'20170926',
		'20170826',
		'20170726',
		'20170926',
		'20170826',
		'20170726',
		'20170926',
		'20170826',
		'20170726'
	]
});

mockjax.get(/\/jackpot\/previous.*/, {
	bizCode: 10000,
	msg: '',
	data: {
		periodNumber: '20170926',
		status: 0,
		winnings: [{
			correctEvents: 11,
			winNum: 5,
			perWinnings: '137000'
		}, {
			correctEvents: 10,
			winNum: 2,
			perWinnings: '32000'
		},
		{
			correctEvents: 8,
			winNum: 2,
			perWinnings: '3000'
		}
		],
		elements: [
			{
				index: 1,
				date: 1506393629,
				home: 'Birmingham',
				away: 'Bristol',
				homeScore: '2',
				awayScore: '1',
				result: 2
			},
			{
				index: 2,
				date: 1506393629,
				home: 'Birmingham',
				away: 'Bristol',
				homeScore: '2',
				awayScore: '1',
				result: 3
			},
			{
				index: 3,
				date: 1506393629,
				home: 'Birmingham',
				away: 'Bristol',
				homeScore: '2',
				awayScore: '1',
				result: 4
			}
		]

	}
});

mockjax.post(/\/orders\/order/, {
	bizCode: 4200,
	innerMsg: 'system reject',
	message: '',
	data: {
		orderId: 'sa12313',
	}
});

mockjax.post('/promotion/v1/gifts/query', { "bizCode": 10000, "innerMsg": "success", "message": "", "data": { "pageSize": 0, "pageNo": 0, "totalNum": 6, "entityList": [{ "giftId": 305, "kind": 2, "displayTitle": "首充满500减30", "displayDesc": "首充满500减30", "status": 30, "currency": "KES", "bizTypeScope": [0], "betTypeScope": [0], "deviceChScope": [0], "leastOrderAmount": 5000000, "effortType": 4, "initBal": 300000, "curBal": 300000, "deliveryTime": 1510262174000, "usableTime": 1508237947000, "expireTime": 1540033147000 }, { "giftId": 306, "kind": 1, "displayTitle": "首充直减50", "displayDesc": "余额50KES直减，剩20", "status": 30, "currency": "KES", "bizTypeScope": [0], "betTypeScope": [0], "deviceChScope": [0], "leastOrderAmount": 0, "effortType": 4, "initBal": 500000, "curBal": 200000, "deliveryTime": 1510262174000, "usableTime": 1508237947000, "expireTime": 1540033147000 }, { "giftId": 307, "kind": 1, "displayTitle": "首充直减50", "displayDesc": "余额50KES直减，仅限PC", "status": 30, "currency": "KES", "bizTypeScope": [0], "betTypeScope": [0], "deviceChScope": [4], "leastOrderAmount": 0, "effortType": 4, "initBal": 500000, "curBal": 500000, "deliveryTime": 1510262174000, "usableTime": 1508237947000, "expireTime": 1540033147000 }, { "giftId": 308, "kind": 1, "displayTitle": "首充直减50", "displayDesc": "余额50KES直减，仅限复式", "status": 30, "currency": "KES", "bizTypeScope": [0], "betTypeScope": [2], "deviceChScope": [0], "leastOrderAmount": 0, "effortType": 4, "initBal": 500000, "curBal": 500000, "deliveryTime": 1510262174000, "usableTime": 1508237947000, "expireTime": 1540033147000 }, { "giftId": 309, "kind": 1, "displayTitle": "首充直减50", "displayDesc": "余额50KES直减，仅限SYSTEM", "status": 30, "currency": "KES", "bizTypeScope": [0], "betTypeScope": [3], "deviceChScope": [0], "leastOrderAmount": 0, "effortType": 4, "initBal": 500000, "curBal": 500000, "deliveryTime": 1510262174000, "usableTime": 1508237947000, "expireTime": 1540033147000 }, { "giftId": 310, "kind": 2, "displayTitle": "首充满500减30", "displayDesc": "首充满1000减70", "status": 30, "currency": "KES", "bizTypeScope": [0], "betTypeScope": [0], "deviceChScope": [0], "leastOrderAmount": 10000000, "effortType": 4, "initBal": 700000, "curBal": 700000, "deliveryTime": 1510262174000, "usableTime": 1508237947000, "expireTime": 1540033147000 }] } });