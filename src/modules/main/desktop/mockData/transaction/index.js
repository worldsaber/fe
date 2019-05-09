import mockjax from 'mock';

/*
	获取交易记录
 */
mockjax.get('/pocket/v1/statements', {
	bizCode: 10000,
	innerMsg: 'success',
	message: '',
	data: {
		totalNum: 468,
		pageNo: 1,
		pageSize: 20,
		statements: [{
			tradeId: '17121812562440108919813',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0003',
			orderId: '722308',
			payChId: 10,
			payChTxId: 'SIM000000000000000000000',
			status: 20,
			currency: 'KSh',
			amount: 32340000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 30000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34877660399,
			createTime: 1513601784661,
			payFinishTime: 1513601784689,
			counterpart: '****1111'
		}, {
			tradeId: '17121812562440108919813',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'RF0001',
			orderId: '722308',
			payChId: 10,
			payChTxId: 'SIM000000000000000000000',
			status: 20,
			currency: 'KSh',
			amount: 32340000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 30000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34877660399,
			createTime: 1513601784661,
			payFinishTime: 1513601784689,
			counterpart: '****1111'
		}, {
			tradeId: '17121812562440108919813',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'WD0003',
			orderId: '722308',
			payChId: 10,
			payChTxId: 'SIM000000000000000000000',
			status: 20,
			currency: 'KSh',
			amount: 32340000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 30000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34877660399,
			createTime: 1513601784661,
			payFinishTime: 1513601784689,
			counterpart: '****1111'
		}, {
			tradeId: '17121812562440108919813',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'TF0005',
			orderId: '722308',
			payChId: 10,
			payChTxId: 'SIM000000000000000000000',
			status: 10,
			reason: 'Manual process  (Result in 3 working days)',
			currency: 'KSh',
			amount: 32340000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 30000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34877660399,
			createTime: 1513601784661,
			payFinishTime: 1513601784689,
			counterpart: '****1111'
		}, {
			tradeId: '17121812562440108919813',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'TF0005',
			orderId: '722308',
			payChId: 10,
			payChTxId: 'SIM000000000000000000000',
			status: 20,
			currency: 'KSh',
			amount: 32340000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 30000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34877660399,
			createTime: 1513601784661,
			payFinishTime: 1513601784689,
			counterpart: '****1111'
		}, {
			tradeId: '17121812562440108919813',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'AD0002',
			orderId: '722308',
			payChId: 0,
			payChTxId: 'SIM000000000000000000000',
			status: 20,
			currency: 'KSh',
			amount: 32340000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 30000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34877660399,
			createTime: 1513601784661,
			payFinishTime: 1513601784689
		}, {
			tradeId: '17121619221240107657714',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '169708',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 2060000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 2060000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34907660399,
			createTime: 1513452132647,
			payFinishTime: 1513452132671
		}, {
			tradeId: '17121512585840107126878',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '681528',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 3840000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 3840000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34905600399,
			createTime: 1513342738484,
			payFinishTime: 1513342738512
		}, {
			tradeId: '17121511481740107106001',
			bizType: 3,
			subBizType: 0,
			tradeCode: 'PB0001',
			orderId: '222019',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 500000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 500000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34901760399,
			createTime: 1513338497667,
			payFinishTime: 1513338497734
		}, {
			tradeId: '17121511023740107091941',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 25443300,
			amountSign: 1,
			payAmount: 0,
			initAmount: 25443300,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34902260399,
			createTime: 1513335757220,
			payFinishTime: 1513335757280
		}, {
			tradeId: '17121511023740107091935',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 7870200,
			amountSign: 1,
			payAmount: 0,
			initAmount: 7870200,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34876817099,
			createTime: 1513335757182,
			payFinishTime: 1513335757259
		}, {
			tradeId: '17121511023740107091937',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 5550000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 5550000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34868946899,
			createTime: 1513335757188,
			payFinishTime: 1513335757238
		}, {
			tradeId: '17121511023740107091936',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 30323700,
			amountSign: 1,
			payAmount: 0,
			initAmount: 30323700,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34863396899,
			createTime: 1513335757184,
			payFinishTime: 1513335757216
		}, {
			tradeId: '17121509502240107072149',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 4050000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 4050000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34833073199,
			createTime: 1513331422714,
			payFinishTime: 1513331422738
		}, {
			tradeId: '17121509501140107072081',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 3030000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 3030000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34829023199,
			createTime: 1513331411579,
			payFinishTime: 1513331411603
		}, {
			tradeId: '17121509430640107070531',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 3120000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 3120000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34825993199,
			createTime: 1513330986121,
			payFinishTime: 1513330986149
		}, {
			tradeId: '17121509295040107067638',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'PB0001',
			orderId: '750319',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 45000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 45000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34822873199,
			createTime: 1513330190504,
			payFinishTime: 1513330190530
		}, {
			tradeId: '17121509291540107067536',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'PB0001',
			orderId: '681528',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 6000000,
			amountSign: 2,
			payAmount: 0,
			initAmount: 6000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34867873199,
			createTime: 1513330155488,
			payFinishTime: 1513330155514
		}, {
			tradeId: '17121508491240107058111',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '584424',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 13841100,
			amountSign: 1,
			payAmount: 0,
			initAmount: 13841100,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34873873199,
			createTime: 1513327752776,
			payFinishTime: 1513327752806
		}, {
			tradeId: '17121505340940107020936',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '718567',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 3890200,
			amountSign: 1,
			payAmount: 0,
			initAmount: 3890200,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34860032099,
			createTime: 1513316049307,
			payFinishTime: 1513316049330
		}, {
			tradeId: '17121505340640107020931',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '718567',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 1000000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 1000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34856141899,
			createTime: 1513316046580,
			payFinishTime: 1513316046605
		}, {
			tradeId: '17121505335940107020907',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '718567',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 1000000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 1000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34855141899,
			createTime: 1513316039704,
			payFinishTime: 1513316039728
		}, {
			tradeId: '17121505335640107020900',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '718567',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 1000000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 1000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34854141899,
			createTime: 1513316036067,
			payFinishTime: 1513316036089
		}, {
			tradeId: '17121505335240107020895',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '718567',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 1610000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 1610000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34853141899,
			createTime: 1513316032268,
			payFinishTime: 1513316032294
		}, {
			tradeId: '17121505334740107020880',
			bizType: 1,
			subBizType: 0,
			tradeCode: 'CB0002',
			orderId: '718567',
			payChId: 0,
			status: 20,
			currency: 'KSh',
			amount: 1000000,
			amountSign: 1,
			payAmount: 0,
			initAmount: 1000000,
			feeType: 0,
			feeAmount: 0,
			afterBal: 34851531899,
			createTime: 1513316027699,
			payFinishTime: 1513316027723
		}]
	}
});
