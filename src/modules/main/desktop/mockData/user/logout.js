import mockjax from 'mock';

/*
退出
 */
mockjax.delete('/patron/accessToken/delete', {
	bizCode: 10000,
	message: 'success',
	data: null
});
