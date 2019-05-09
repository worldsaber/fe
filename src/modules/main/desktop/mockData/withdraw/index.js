import mockjax from 'mock';

/*
用户提现接口
 */
mockjax.post('/pocket/v1/bankTrades/bankTrade/withdraw', {
	bizCode: 10000,
	message: 'ddfsdf',
	data: {
		tradeId: 111,
		acceptTime: '11111',
		auditLimit: 600000000
	}
});

