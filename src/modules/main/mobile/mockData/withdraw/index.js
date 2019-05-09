import mockjax from 'mock';

/*
用户提现接口
 */
mockjax.post('/pocket/v1/bankTrades/bankTrade/withdraw', {
	bizCode: 61100,
	msg: '',
	data: {
		tradeId: 111,
		auditLimit: 60000000,
		acceptTime: '11111'
	}
});

/*
 * 获取账户余额
 */
mockjax.get('/pocket/v1/finAccs/finAcc/userBal', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		userId: '测试内容12345',
		status: 1,
		avlBal: 1539900,
		frzBal: 100,
		canNeg: true
	}
});

