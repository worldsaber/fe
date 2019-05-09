import mockjax from 'mock';

/*
订单列表
params: isSettled、pageSize、pageNo
 */
mockjax.get('/orders/order/jackpotlist', { bizCode: 10000, innerMsg: 'success', message: 'success', data: { pageNo: 1, pageSize: 13, totalNum: 13, orders: [{ orderId: '1711300516067300285269', shortId: '118108', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 90, currency: 'KES', totalStake: '153630.00', paymentAmount: '153600.00', favorAmount: '30.00', favor: { totalAmount: 0, favorInfo: [{ giftId: '305', giftKind: 2, giftAmount: 300000 }] }, totalWinnings: '2.00', createTime: 1512018966000 }, { orderId: '1711300508497300284149', shortId: '440190', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '8857350.00', paymentAmount: '8857350.00', totalWinnings: '0.00', createTime: 1512018529000 }, { orderId: '1711300309527300260908', shortId: '688993', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '100.00', paymentAmount: '50.00', favorAmount: '50.00', favor: { totalAmount: 0, favorInfo: [{ giftId: '301', giftKind: 1, giftAmount: 500000 }] }, totalWinnings: '0.00', createTime: 1512011393000 }, { orderId: '1711300224037300250509', shortId: '667912', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '51200.00', paymentAmount: '51200.00', totalWinnings: '0.00', createTime: 1512008644000 }, { orderId: '1711290632437301869882', shortId: '994336', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '50.00', paymentAmount: '50.00', totalWinnings: '0.00', createTime: 1511937164000 }, { orderId: '1711290630037301869673', shortId: '838551', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '50.00', paymentAmount: '50.00', totalWinnings: '0.00', createTime: 1511937004000 }, { orderId: '1711290629437301869652', shortId: '566907', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '100.00', paymentAmount: '100.00', totalWinnings: '0.00', createTime: 1511936983000 }, { orderId: '1711290255567301822762', shortId: '594453', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '200.00', paymentAmount: '200.00', totalWinnings: '0.00', createTime: 1511924157000 }, { orderId: '1711290254427301822688', shortId: '381897', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '50.00', paymentAmount: '50.00', totalWinnings: '0.00', createTime: 1511924083000 }, { orderId: '1711280849527301488762', shortId: '956478', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '50.00', paymentAmount: '50.00', totalWinnings: '0.00', createTime: 1511858993000 }, { orderId: '1711280846117301488187', shortId: '904344', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '100.00', paymentAmount: '100.00', totalWinnings: '0.00', createTime: 1511858771000 }, { orderId: '1711280815277301483258', shortId: '784610', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '100.00', paymentAmount: '100.00', totalWinnings: '0.00', createTime: 1511856927000 }, { orderId: '1711280811527301482866', shortId: '321303', bizType: 3, betType: '11', periodNumber: '20171203', status: 20, winningStatus: 30, currency: 'KES', totalStake: '50.00', paymentAmount: '50.00', totalWinnings: '0.00', createTime: 1511856713000 }] }});

/*
Bet详情
params: betId
 */
mockjax.get('/jackpot/bet', {
	bizCode: 10000,
	msg: '',
	data: {
		id: '232323232323_lsit',
		periodNumber: '20170908',
		status: 0,
		betType: '11',
		correctEvents: 4,
		totalStake: '300.00',
		winnings: '0.00',
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
						status: 0
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
