import mockjax from 'mock';

/*
 * 查询个人信息，获取手机号
 */
mockjax.get('/patron/account/info', {
	bizCode: 10000,
	msg: '',
	data: {
		phoneCountryCode: '254',
		phone: '16666666666',
		firstName: 'jane',
		lastName: 'Hdowon',
		gender: 1,
		email: 'test@163.com',
		birthday: '19830112'
	}
});

/*
用户充值接口
 */
mockjax.post('/pocket/v1/bankTrades/bankTrade/deposit', {
	bizCode: 10000,
	msg: '',
	data: {
		tradeId: '7120803375840102650720',
		acceptTime: '2017-10-20 12:59:47'
	}
});

/*
	查询交易信息
 */
mockjax.get('/pocket/v1/bankTrades/bankTrade/7120803375840102650720', {
	bizCode: 11000,
	msg: '',
	data: {
		status: 90, // 10-待支付, 20-SUCCESS, 30-FAIL, 90-CLOSED）
		phoneNo: '16666666666',
		amount: 1345,
		feeAmount: 1231
	}
});

// 获取充值优惠配置
const data = {
	bizCode: 10000,
	msg: '',
	data: {
		title: 'Get Extra after Top Up',
		quickInputItems: [{
			order: 1,
			line: 1,
			btnText: '49',
			text: 'Get 51',
			amount: '490000',
			bounty: '20000'
		}, {
			order: 2,
			line: 1,
			btnText: '99',
			text: 'Get 105',
			amount: '990000',
			bounty: '60000'
		},
		{
			order: 3,
			line: 2,
			btnText: '200',
			text: 'Random cash Gift',
			amount: '2000000'
		},
		{
			order: 4,
			line: 2,
			btnText: '500',
			text: 'Random cash Gift',
			amount: '5000000'
		},
		{
			order: 5,
			line: 2,
			btnText: '1000',
			text: 'Random cash Gift',
			amount: '10000000'
		}
		]
	}
};
mockjax.get('/pocket/v1/wallet/quickInput', data);
