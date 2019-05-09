import mockjax from 'mock';

/*
 * 查询个人信息，获取手机号
 */
mockjax.get('/patron/account/info', {
	bizCode: 10000,
	msg: '',
	data: {
		phone: '16666666666',
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
		balance: 0,
		validGiftNum: 0
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

/*
 * 退出登录
 */
mockjax.delete('/patron/accessToken/delete', {
	bizCode: 10000,
});

