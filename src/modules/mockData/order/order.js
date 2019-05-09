import mockjax from 'mock';

const a = {
	bizCode: 10000,
	innerMsg: 'success',
	message: 'success',
	data: {
		pageNo: 1,
		pageSize: 5,
		totalNum: 12,
		orders: [{
			orderId: '1711290711577101872920',
			shortId: '126766',
			bizType: 1,
			subBizType: 0,
			status: 20,
			winningStatus: 30,
			currency: 'KES',
			totalStake: '444.00',
			paymentAmount: '444.00',
			favorAmount: '32.32',
			favor: {
				favorInfo: [{
					giftId: '11',
					giftKind: 1,
					giftAmount: 2000
				}]
			},
			totalWinnings: '0.00',
			totalBonus: '3.00',
			potentialWinnings: '861.36',
			bets: [{
				id: '1711290711571001872922',
				status: 2,
				orderType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '444.00',
				stake: '444.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '861.36',
				createTime: 1511939517833,
				selectionDescs: [{
					id: '1711290711571001872921',
					home: 'AFC Bournemouth',
					away: 'Burnley FC'
				}]
			}],
			createTime: 1511939518000
		},
		{
			orderId: '1711290619017101868664',
			shortId: '346199',
			bizType: 1,
			subBizType: 1,
			status: 20,
			winningStatus: 30,
			currency: 'KES',
			totalStake: '750.00',
			paymentAmount: '750.00',
			totalWinnings: '0.00',
			totalBonus: '0.00',
			potentialWinnings: '41737.04',
			bets: [{
				id: '1711290619011001868669',
				status: 2,
				orderType: 'System',
				betType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '50.00',
				stake: '50.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '156.00',
				createTime: 1511936342228,
				selectionDescs: [{
					id: '1711290619011001868665',
					home: 'AFC Bournemouth',
					away: 'Burnley FC'
				}]
			},
			{
				id: '1711290619011001868671',
				status: 2,
				orderType: 'System',
				betType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '50.00',
				stake: '50.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '302.50',
				createTime: 1511936342235,
				selectionDescs: [{
					id: '1711290619011001868666',
					home: 'Arsenal',
					away: 'Huddersfield Town'
				}]
			},
			{
				id: '1711290619021001868673',
				status: 2,
				orderType: 'System',
				betType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '50.00',
				stake: '50.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '157.00',
				createTime: 1511936342240,
				selectionDescs: [{
					id: '1711290619011001868667',
					home: 'Everton FC',
					away: 'West Ham United'
				}]
			},
			{
				id: '1711290619021001868675',
				status: 2,
				orderType: 'System',
				betType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '50.00',
				stake: '50.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '297.50',
				createTime: 1511936342244,
				selectionDescs: [{
					id: '1711290619011001868668',
					home: 'Manchester City',
					away: 'Southampton FC'
				}]
			},
			{
				id: '1711290619021001868677',
				status: 0,
				orderType: 'System',
				betType: 'Doubles',
				isSubscribe: 0,
				combinationNum: 6,
				originStake: '300.00',
				stake: '300.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '6045.72',
				createTime: 1511936342249,
				selectionDescs: [{
					id: '1711290619011001868665',
					home: 'AFC Bournemouth',
					away: 'Burnley FC'
				},
				{
					id: '1711290619011001868666',
					home: 'Arsenal',
					away: 'Huddersfield Town'
				},
				{
					id: '1711290619011001868667',
					home: 'Everton FC',
					away: 'West Ham United'
				},
				{
					id: '1711290619011001868668',
					home: 'Manchester City',
					away: 'Southampton FC'
				}]
			},
			{
				id: '1711290619021001868684',
				status: 2,
				orderType: 'System',
				betType: 'Trebles',
				isSubscribe: 0,
				combinationNum: 4,
				originStake: '200.00',
				stake: '200.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '17145.30',
				createTime: 1511936342277,
				selectionDescs: [{
					id: '1711290619011001868665',
					home: 'AFC Bournemouth',
					away: 'Burnley FC'
				},
				{
					id: '1711290619011001868666',
					home: 'Arsenal',
					away: 'Huddersfield Town'
				},
				{
					id: '1711290619011001868667',
					home: 'Everton FC',
					away: 'West Ham United'
				},
				{
					id: '1711290619011001868668',
					home: 'Manchester City',
					away: 'Southampton FC'
				},
				{
					id: '1711290619011001868669',
					home: 'Manchester City121',
					away: 'Southampton FC'
				}]
			},
			{
				id: '1711290619021001868689',
				status: 2,
				orderType: 'System',
				betType: '4 Folds',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '50.00',
				stake: '50.00',
				winnings: '0.00',
				bonus: '0.00',
				potentialWinnings: '17633.02',
				createTime: 1511936342308,
				selectionDescs: [{
					id: '1711290619011001868665',
					home: 'AFC Bournemouth',
					away: 'Burnley FC'
				},
				{
					id: '1711290619011001868666',
					home: 'Arsenal',
					away: 'Huddersfield Town'
				},
				{
					id: '1711290619011001868667',
					home: 'Everton FC',
					away: 'West Ham United'
				},
				{
					id: '1711290619011001868668',
					home: 'Manchester City',
					away: 'Southampton FC'
				}]
			}],
			createTime: 1511936342000
		},
		{
			orderId: '1711280828357101485088',
			shortId: '232608',
			bizType: 1,
			subBizType: 0,
			status: 20,
			winningStatus: 20,
			currency: 'KES',
			totalStake: '333.00',
			paymentAmount: '333.00',
			totalWinnings: '336.33',
			totalBonus: '0.00',
			potentialWinnings: '336.33',
			bets: [{
				id: '1711280828401001485125',
				status: 1,
				orderType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '333.00',
				stake: '333.00',
				winnings: '336.33',
				bonus: '0.00',
				potentialWinnings: '336.33',
				createTime: 1511857720425,
				selectionDescs: [{
					id: '1711280828401001485124',
					home: 'Sinclair, Colin',
					away: 'Sabanin, Yan'
				}]
			}],
			createTime: 1511857715000
		},
		{
			orderId: '1711280810107101482362',
			shortId: '805418',
			bizType: 1,
			subBizType: 0,
			status: 20,
			winningStatus: 20,
			currency: 'KES',
			totalStake: '444.00',
			paymentAmount: '444.00',
			totalWinnings: '621.60',
			totalBonus: '0.00',
			potentialWinnings: '621.60',
			bets: [{
				id: '1711280810151001482364',
				status: 1,
				orderType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '444.00',
				stake: '444.00',
				winnings: '621.60',
				bonus: '0.00',
				potentialWinnings: '621.60',
				createTime: 1511856615748,
				selectionDescs: [{
					id: '1711280810151001482363',
					home: 'Sinclair, Colin',
					away: 'Sabanin, Yan'
				}]
			}],
			createTime: 1511856611000
		},
		{
			orderId: '1711280732077101478302',
			shortId: '643005',
			bizType: 1,
			subBizType: 0,
			status: 20,
			winningStatus: 10,
			currency: 'KES',
			totalStake: '888.00',
			paymentAmount: '888.00',
			totalWinnings: '541.68',
			totalBonus: '0.00',
			potentialWinnings: '2029.08',
			bets: [{
				id: '1711280732131001478308',
				status: 2,
				orderType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '444.00',
				stake: '444.00',
				winnings: '9.00',
				bonus: '0.00',
				potentialWinnings: '1487.40',
				createTime: 1511854333093,
				selectionDescs: [{
					id: '1711280732131001478306',
					home: 'Chamarthi, Sai Samhitha',
					away: 'Jain, Mahak'
				}]
			},
			{
				id: '1711280732131001478310',
				status: 1,
				orderType: 'Single',
				isSubscribe: 0,
				combinationNum: 1,
				originStake: '444.00',
				stake: '444.00',
				winnings: '541.68',
				bonus: '0.00',
				potentialWinnings: '541.68',
				createTime: 1511854333097,
				selectionDescs: [{
					id: '1711280732131001478307',
					home: 'Chamarthi, Sai Samhitha',
					away: 'Jain, Mahak'
				}]
			}],
			createTime: 1511854328000
		}]
	}
};
/*
订单列表
params: isSettled、pageSize、lastId
 */
mockjax.get('/orders/order/realbetlist', a || {
	bizCode: 10000,
	message: '',
	data: {
		totalNum: 28,
		pageNo: 3,
		orders: [
			{
				orderId: '1707241725051000000001',
				totalStake: '232.32',
				totalWinnings: '2323.22',
				totalBonus: '232.32',
				potentialWinnings: '2323.232',
				createTime: 1506031331424,
				bets: [
					{
						id: '1709221402111000000123',
						status: 1,
						orderType: 'System',
						betType: 'Doubles',
						isSubscribe: 0,
						combinationNum: 3,
						originStake: '300.00',
						stake: '300.00',
						winning: '0.00',
						bonus: '0.00',
						potentialWinnings: '0.00',
						createTime: 1506031331424,
						selectionDescs: [
							{
								id: '1709221402111000000120',
								home: 'Bourchier, Harry',
								away: 'Mousley, Bradley'
							}, {
								id: '1709221402111000000121',
								home: 'Gibraltar',
								away: 'Estonia'
							}, {
								id: '1709221402111000000122',
								home: 'Croatia',
								away: 'Finland'
							}
						]
					}, {
						id: '1709221402111000000126',
						status: 2,
						orderType: 'System',
						betType: 'Doubles',
						isSubscribe: 0,
						combinationNum: 3,
						originStake: '300.00',
						stake: '300.00',
						winning: '0.00',
						bonus: '0.00',
						potentialWinnings: '0.00',
						createTime: 1506031331424,
						selectionDescs: [
							{
								id: '1709221402111000000120',
								home: 'Bourchier, Harry',
								away: 'Mousley, Bradley'
							}, {
								id: '1709221402111000000121',
								home: 'Gibraltar',
								away: 'Estonia'
							}, {
								id: '1709221402111000000122',
								home: 'Croatia',
								away: 'Finland'
							}
						]
					}, {
						id: '1709221402111000000116',
						status: 0,
						orderType: 'System',
						betType: 'Doubles',
						isSubscribe: 0,
						combinationNum: 3,
						originStake: '300.00',
						stake: '300.00',
						winning: '0.00',
						bonus: '0.00',
						potentialWinnings: '0.00',
						createTime: 1506031331252,
						selectionDescs: [
							{
								id: '1709221402111000000113',
								home: 'Bourchier, Harry',
								away: 'Mousley, Bradley'
							}, {
								id: '1709221402111000000114',
								home: 'Gibraltar',
								away: 'Estonia'
							}, {
								id: '1709221402111000000115',
								home: 'Croatia',
								away: 'Finland'
							}
						]
					}
				]
			}
		]
	}
});

/*
Bet详情
params: betId
 */
mockjax.get('/realSportsGame/selections', { bizCode: 10000, message: 'success', data: [{ id: '1712050934031001725311', eventId: 'sr:match:12330502', sportId: 'sr:sport:1', status: 1, matchStatus: 'Not started', eventStatus: 4, banker: false, odds: '1.08', marketDesc: '1x2', outcomeDesc: 'AS Roma', correctOutcome: 'AS Roma', home: 'AS Roma', away: 'Qarabag FK', period: '2', playedSeconds: '90:00', gameScore: ['0:0', '1:0'], setScore: '1:0', startTime: 1512503100000 }, { id: '1712050934031001725312', eventId: 'sr:match:12330462', sportId: 'sr:sport:1', status: 1, matchStatus: 'Not started', eventStatus: 4, banker: false, odds: '2.20', marketDesc: '1x2', outcomeDesc: 'Bayern Munich', correctOutcome: 'Bayern Munich', home: 'Bayern Munich', away: 'Paris Saint-Germain', period: '2', playedSeconds: '90:00', gameScore: ['2:0', '1:1'], setScore: '3:1', startTime: 1512503100000 }, { id: '1712050934031001725313', eventId: 'sr:match:12330444', sportId: 'sr:sport:1', status: 1, matchStatus: 'Not started', eventStatus: 4, banker: false, odds: '2.45', marketDesc: '1x2', outcomeDesc: 'FC Basel', correctOutcome: 'FC Basel', home: 'Benfica Lisbon', away: 'FC Basel', period: '2', playedSeconds: '90:00', gameScore: ['0:1', '0:1'], setScore: '0:2', startTime: 1512503100000 }, { id: '1712050934031001725314', eventId: 'sr:match:12330460', sportId: 'sr:sport:1', status: 2, matchStatus: 'Not started', eventStatus: 4, banker: false, odds: '1.79', marketDesc: '1x2', outcomeDesc: 'Celtic FC', correctOutcome: 'RSC Anderlecht', home: 'Celtic FC', away: 'RSC Anderlecht', period: '2', playedSeconds: '90:00', gameScore: ['0:0', '0:1'], setScore: '0:1', startTime: 1512503100000 }, { id: '1712050934031001725315', eventId: 'sr:match:12330460', sportId: 'sr:sport:1', status: 2, matchStatus: 'Not started', eventStatus: 4, banker: false, odds: '3.66', marketDesc: '1x2', outcomeDesc: 'draw', correctOutcome: 'RSC Anderlecht', home: 'Celtic FC', away: 'RSC Anderlecht', period: '2', playedSeconds: '90:00', gameScore: ['0:0', '0:1'], setScore: '0:1', startTime: 1512503100000 }, { id: '1712050934031001725316', eventId: 'sr:match:12330462', sportId: 'sr:sport:1', status: 2, matchStatus: 'Not started', eventStatus: 4, banker: false, odds: '3.56', marketDesc: '1x2', outcomeDesc: 'draw', correctOutcome: 'Bayern Munich', home: 'Bayern Munich', away: 'Paris Saint-Germain', period: '2', playedSeconds: '90:00', gameScore: ['2:0', '1:1'], setScore: '3:1', startTime: 1512503100000 }] });

/*
获取一个bet的combination
params: betId
return:
	status: 0Runnig,1won,2,lost,3void
 */
mockjax.get('/realSportsGame/combinations', {
	bizCode: 10000,
	message: '',
	data: [
		{
			id: '1709181906551000001963',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001964',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '0.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001965',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		},
		{
			id: '1709181906551000001966',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001967',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001968',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001969',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001960',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001951',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001952',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001953',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001965',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001954',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001955',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001956',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001957',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001958',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001959',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001940',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001941',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001942',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001963',
			combo: '1/2',
			stake: '100.00',
			status: 1,
			odds: '1.90',
			bonus: '100.00',
			winnings: '190.00'
		}, {
			id: '1709181906551000001964',
			combo: '1/3',
			stake: '100.00',
			status: 0,
			odds: '5.90',
			bonus: '100.00',
			winnings: '0.00'
		}, {
			id: '1709181906551000001965',
			combo: '2/3',
			stake: '100.00',
			status: 2,
			odds: '3.20',
			bonus: '100.00',
			winnings: '0.00'
		}
	]
});

/*
获取指定bet的cashout history
params：betId
 */
mockjax.get('/realSportsGame/cashOutHistory', {
	bizCode: 10000,
	message: '',
	data: [
		{
			id: '1709221549311000000057',
			betId: '1709221549311000000057',
			usedStake: '50.00',
			amount: '1247.50',
			createTime: 1506037924077
		}, {
			id: '1709221549311000000057',
			betId: '1709221549311000000057',
			usedStake: '50.00',
			amount: '47.50',
			createTime: 1506037925644
		}, {
			id: '1709221549311000000057',
			betId: '1709221549311000000057',
			usedStake: '50.00',
			amount: '47.50',
			createTime: 1506037926561
		}
	]
});

mockjax.get('254/orders/order/realsports/ticketDetail', {
	orderId: '测试内容12345',
	shortId: '测试内容12345',
	orderType: 123456,
	totalStake: '测试内容12345',
	totalWinnings: '测试内容12345',
	winningStatus: 123456,
	totalBonus: '测试内容12345',
	potentialWinnings: '测试内容12345',
	favorAmount: '测试内容12345',
	favorType: 123456,
	selections: [{
		eventId: '测试内容12345',
		sportId: '测试内容12345',
		product: 123456,
		marketId: '测试内容12345',
		status: 123456,
		matchStatus: 123456,
		eventStatus: 123456,
		banker: true,
		odds: '测试内容12345',
		marketDesc: '测试内容12345',
		outcomeDesc: '测试内容12345',
		correctOutcome: '测试内容12345',
		home: '测试内容12345',
		away: '测试内容12345',
		period: '测试内容12345',
		playedSeconds: '测试内容12345',
		remainingTimeInPeriod: '测试内容12345',
		gameScore: [
			'string1',
			'string2',
			'string3',
			'string4',
			'string5'
		],
		setScore: '测试内容12345',
		pointScore: '测试内容12345',
		startTime: 123456,
		gameId: '测试内容12345'
	}],
	cashOutHistory: [{
		createTime: '2018-03-26 17:14:20',
		usedStake: '测试内容12345',
		amount: '测试内容12345'
	}],
	remainStake: '测试内容12345',
	remainPotentialWinnings: '测试内容12345',
	betSize: 1
});

mockjax.get('254/orders/order/v2/realbetlist', {
	pageNo: 1,
	pageSize: 6,
	totalNum: 10,
	lastId: 1,
	entityList: [{
		orderType: 'multiple',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'single',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'multiple',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'single',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'multiple',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'single',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'multiple',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}, {
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}, {
		orderType: 'single',
		shortId: '测试内容12345',
		orderId: 123123,
		totalStake: '1000000',
		winningStatus: 123456,
		totalWinnings: '5000000',
		selections: [{
			home: '测试内容12345',
			away: '测试内容54321'
		}]
	}],
	createTime: 1522068448
});
