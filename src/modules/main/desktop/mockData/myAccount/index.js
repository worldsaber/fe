import mockjax from 'mock';

mockjax.put('/patron/account/info/whole', {
	bizCode: 10000
});

mockjax.put('/patron/password', {
	bizCode: 10000
});
