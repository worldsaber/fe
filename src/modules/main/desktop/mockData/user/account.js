import mockjax from 'mock';

/*
账号余额
钱相关的字段是*10000
 */
mockjax.get(/\pocket\/v1\/finAccs\/finAcc\/userBal/, {
	bizCode: 10000,
	message: 'success',
	data: {
		userId: '0123456789',
		status: 10,
		avlBal: 1230000,
		frzBal: 110000,
		canNeg: true
	}
});
