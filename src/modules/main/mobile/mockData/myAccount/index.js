import mockjax from 'mock';

mockjax.put('/patron/account/info/firstName', {
	bizCode: 10000
});
mockjax.put('/patron/account/info/birthday', {
	bizCode: 10000
});
mockjax.put('/patron/account/info/lastName', {
	bizCode: 10000
});
mockjax.put('/patron/account/info/gender', {
	bizCode: 10000
});
mockjax.put('/patron/account/info/email', {
	bizCode: 10000
});

mockjax.put('/patron/password', {
	bizCode: 10000
});

mockjax.get('/patron/password/check', {
	bizCode: 10000,
	data: {
		token: 'qwe2123123'
	}
});
mockjax.put('/patron/password/changeWithToken', {
	bizCode: 10000
});
