import mockjax from 'mock';

const a = { bizCode: 10000, message: 'success', data: { id: '1711300516067300285269', periodNumber: '20171203', status: 2, betType: '11', totalStake: '153600.00', winnings: '0.00', correctEvents: 8, elements: [{ id: '1711220952441011099709', index: 1, date: 1512235800000, home: 'Arsenal', away: 'Manchester United', homeScore: '1', awayScore: '3', eventId: 'sr:match:11830362', gameId: '4437', selections: [{ id: '1', desc: 'Arsenal', status: 0 }, { id: '3', desc: 'Manchester United', status: 1 }] }, { id: '1711220952441011099711', index: 2, date: 1512240300000, home: 'CS Universitatea Craiova', away: 'FC Viitorul Constanta', homeScore: '3', awayScore: '1', eventId: 'sr:match:11967998', gameId: '3916', selections: [{ id: '1', desc: 'CS Universitatea Craiova', status: 1 }, { id: '2', desc: 'draw', status: 0 }] }, { id: '1711220952441011099713', index: 3, date: 1512243900000, home: 'FC Torino', away: 'Atalanta Bergamasca', homeScore: '1', awayScore: '1', eventId: 'sr:match:12090292', gameId: '1432', selections: [{ id: '1', desc: 'FC Torino', status: 0 }, { id: '3', desc: 'Atalanta Bergamasca', status: 0 }, { id: '2', desc: 'draw', status: 1 }] }, { id: '1711220952441011099712', index: 4, date: 1512271800000, home: 'Wellington Phoenix FC', away: 'Melbourne Victory', homeScore: '2', awayScore: '3', eventId: 'sr:match:12439898', gameId: '3178', selections: [{ id: '3', desc: 'Melbourne Victory', status: 1 }, { id: '2', desc: 'draw', status: 0 }] }, { id: '1711220952441011099706', index: 5, date: 1512298800000, home: 'CD Leganes', away: 'Villarreal CF', homeScore: '3', awayScore: '1', eventId: 'sr:match:12055342', gameId: '1564', selections: [{ id: '2', desc: 'draw', status: 0 }, { id: '3', desc: 'Villarreal CF', status: 0 }] }, { id: '1711220952441011099710', index: 6, date: 1512307800000, home: 'AFC Bournemouth', away: 'Southampton FC', homeScore: '1', awayScore: '1', eventId: 'sr:match:11830628', gameId: '4439', selections: [{ id: '2', desc: 'draw', status: 1 }, { id: '1', desc: 'AFC Bournemouth', status: 0 }] }, { id: '1711220952441011099707', index: 7, date: 1512311400000, home: 'Hertha BSC', away: 'Eintracht Frankfurt', homeScore: '1', awayScore: '2', eventId: 'sr:match:11914160', gameId: '3004', selections: [{ id: '2', desc: 'draw', status: 0 }, { id: '3', desc: 'Eintracht Frankfurt', status: 1 }] }, { id: '1711220952441011099715', index: 8, date: 1512314100000, home: 'Getafe CF', away: 'Valencia CF', homeScore: '1', awayScore: '0', eventId: 'sr:match:12055326', gameId: '1571', selections: [{ id: '3', desc: 'Valencia CF', status: 0 }, { id: '2', desc: 'draw', status: 0 }] }, { id: '1711220952441011099705', index: 9, date: 1512316800000, home: 'Csm Politehnica Iasi', away: 'AFC Astra Giurgiu', homeScore: '1', awayScore: '0', eventId: 'sr:match:11967992', gameId: '4647', selections: [{ id: '2', desc: 'draw', status: 0 }, { id: '1', desc: 'Csm Politehnica Iasi', status: 1 }] }, { id: '1711220952441011099714', index: 10, date: 1512320400000, home: 'VfL Wolfsburg', away: 'Monchengladbach', homeScore: '3', awayScore: '0', eventId: 'sr:match:11914182', gameId: '3011', selections: [{ id: '2', desc: 'draw', status: 0 }, { id: '3', desc: 'Monchengladbach', status: 0 }] }, { id: '1711220952441011099708', index: 11, date: 1512322200000, home: 'SD Eibar', away: 'Espanyol Barcelona', homeScore: '3', awayScore: '1', eventId: 'sr:match:12055328', gameId: '1572', selections: [{ id: '1', desc: 'SD Eibar', status: 1 }, { id: '2', desc: 'draw', status: 0 }] }], periodWinnings: [{ correctEvents: 9, winNum: 4, perWinnings: '5.0', totalWinnings: '0' }, { correctEvents: 11, winNum: 2, perWinnings: '0.00', totalWinnings: '0' }] }};
/*
订单列表
params: isSettled、pageSize、pageNo
 */
mockjax.get('/orders/order/jackpotlist', {
	bizCode: 10000,
	msg: '',
	data: {
		totalNum: 30,
		pageNo: 1,
		pageSize: 5,
		lastId: '1707241725051000000001',
		orders: [
			{
				orderId: '1707241725051000000001',
				shortId: '123456',
				status: 0,
				subBizType: 11,
				correctEvents: 4,
				totalStake: '238.32',
				totalWinnings: '0.00',
				totalBonus: '232.32',
				potentialWinnings: '2323.232',
				createTime: 1506031331424,
				periodNumber: '20170908',
				winningStatus: 90,
				favorAmount: '32.32',
				favor: {
					favorInfo: [{
						giftId: '11',
						giftKind: 1,
						giftAmount: 2000
					}]
				},
			},
			{
				orderId: '1707241725051000000002',
				shortId: '136169',
				status: 0,
				subBizType: 11,
				correctEvents: 4,
				totalStake: '232.32',
				totalWinnings: '2323.22',
				totalBonus: '232.32',
				potentialWinnings: '2323.232',
				createTime: 1506031331424,
				periodNumber: '20170908'
			}
		]
	}
});

/*
Bet详情
params: betId
 */
mockjax.get('/jackpot/bet', a || {
	bizCode: 10000,
	msg: '',
	data: {
		id: '232323232323_lsit',
		periodNumber: '20170908',
		status: 0,
		betType: '11',
		correctEvents: 4,
		totalStake: '300.00',
		winnings: '12344534',
		elements: [
			{
				index: 1,
				date: 1506031331424,
				home: 'Newcastle',
				away: 'Stoke Ham',
				score: '2-1',
				homeScore: '2',
				awayScore: '1',
				selections: [
					{
						id: '1',
						desc: 'Newcastle',
						status: 1
					}
				]
			},
			{
				index: 2,
				date: 1506031331424,
				home: 'Birmingham City',
				away: 'Bristol City',
				score: '2-2',
				selections: [
					{
						id: '2',
						desc: 'Draw',
						status: 0
					},
					{
						id: '3',
						desc: 'Bristol City',
						status: 1
					}
				]
			}
		],
		periodWinnings: [{
			correctEvents: '5',
			winNum: 5,
			perWinnins: '100000'
		}]
	}
});
