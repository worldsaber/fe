import mockjax from 'mock';

/*
 * 查询个人信息，获取手机号
 */
mockjax.get('/patron/account/info', {
	bizCode: 10000,
	msg: '',
	data: {
		phoneCountryCode: '254',
		phone: '0741133344',
		firstName: 'jane',
		lastName: 'Hdowon',
		gender: 1,
		email: 'test@163.com',
		birthday: '19830110'
	}
});

/*
 * 获取balance 红包数量
 */
mockjax.get('/pocket/v1/wallet/assetsInfo', {
	bizCode: 10000,
	msg: '',
	data: {
		balance: 1539900,
		validGiftNum: 3
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
		avlBal: 580000,
		frzBal: 100,
		canNeg: true
	}
});

