import mockjax from 'mock';

// 删除投注项
mockjax.post(/\/delete\/bet/, {
	resStatus: 0,
	msg: 'success'
});

// 增加投注项
mockjax.post(/\/add\/bet/, {
	resStatus: 0,
	msg: 'success'
});

// 删除所有投注
mockjax.post(/\/deleteAll\/bet/, {
	resStatus: 0,
	msg: 'success'
});

// 投注
mockjax.post(/\/bet/, {
	resStatus: 0,
	msg: 'success'
});
