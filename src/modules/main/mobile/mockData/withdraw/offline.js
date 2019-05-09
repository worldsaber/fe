import mockjax from 'mock';

mockjax.get('/partner/account/id/byCode', {
    "bizCode": 10000,
    "message": 1,
    "data": "测试内容12345"
});
mockjax.post('/pocket/v1/bankTrades/bankTrade/withdrawFP', {
    "bizCode": 10000,
    "message": "测试内容12345",
    "data": {
        "tradeId": "测试内容12345",
        "acceptTime": 123456,
        "feeAmount": 123456
    }
});
mockjax.get('pocket/v1/flows', {
	"bizCode": 10000,
	"message": "测试内容12345",
	"data": {
		"entityList": [{
			"tradeId": "测试内容12345",
			"requestTime": 123456,
			"ptnCode": "测试内容12345",
			"initAmount": 123456,
			"currency": "测试内容12345",
			"status": 123456,
			"pin": "测试内容12345",
			"cancelFee": 123456
		},{
			"tradeId": "测试内容12345",
			"requestTime": 123456,
			"ptnCode": "测试内容12345",
			"initAmount": 123456,
			"currency": "测试内容12345",
			"status": 123456,
			"pin": "测试内容12345",
			"cancelFee": 123456
		},{
			"tradeId": "测试内容12345",
			"requestTime": 123456,
			"ptnCode": "测试内容12345",
			"initAmount": 123456,
			"currency": "测试内容12345",
			"status": 123456,
			"pin": "测试内容12345",
			"cancelFee": 123456
		},{
			"tradeId": "测试内容12345",
			"requestTime": 123456,
			"ptnCode": "测试内容12345",
			"initAmount": 123456,
			"currency": "测试内容12345",
			"status": 123456,
			"pin": "测试内容12345",
			"cancelFee": 123456
		}],
		"pageSize": 20,
		"pageNo": 1,
		"totalNum": 50,
		"lastId": "测试内容12345"
	}
});
