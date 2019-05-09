import mockjax from 'mock';

/*
用户充值接口
 */
mockjax.post('/pocket/v1/bankTrades/bankTrade/deposit', {
	bizCode: 10000,
	msg: '',
	data: {
		tradeId: '111',
		acceptTime: '2017-10-20 12:59:47'
	}
});

/*
	查询交易信息
 */
mockjax.get('/pocket/v1/bankTrades/bankTrade/111', {
	bizCode: 10000,
	msg: '',
	data: {
		status: 30, // 10-待支付, 20-SUCCESS, 30-FAIL, 90-CLOSED）
		phoneNo: '16666666666',
		amount: 1345,
		feeAmount: 1231
	}
});

/*
BankList
 */
mockjax.get('pocket/v1/wallet/supportBanks', {
	bizCode: 123456,
	message: '',
	data: {
		entityList: [
			{
				bankName: 'Access',
				bankCode: '测试内容12345',
				isActive: 123456,
				supportAction: 123456,
				bankIconUrl: '测试内容12345'
			}
		],
		totalNum: 123456
	}
});
