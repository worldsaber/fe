import mockjax from 'mock';

/*
用户兑换优惠券接口
 */
mockjax.post('/promotion/v1/gifts/redeem', {
	bizCode: 10000,
});

/*
实时查询可用红包接口
 */
mockjax.get('/promotion/v1/gifts/query', {
	bizCode: 123456,
	message: '测试内容12345',
	data: {
		totalNum: 123456,
		entityList: [{
			0: {
				kind: 123456,
				displayTitle: '测试内容12345',
				displayDesc: '测试内容12345',
				currency: '测试内容12345',
				bizTypeScope: [
					1,
					2,
					3,
					4,
					5
				],
				betTypeScope: [
					1,
					2,
					3,
					4,
					5
				],
				deviceChScope: [
					1,
					2,
					3,
					4,
					5
				],
				leastOrderAmount: 123456,
				effortType: 123456,
				initBal: 123456,
				curBal: 123456,
				deliveryTime: 123456,
				usableTime: 123456,
				expireTime: 123456,
				status: 123456,
				giftId: '测试内容12345'
			}
		}]
	}
});

/*
用户获取红包列表接口
 */
mockjax.get('/promotion/v1/gifts', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		totalNum: 100,
		entityList: [{
			kind: 2,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 20,
			currency: '测试内容12345',
			leastOrderAmount: 1234560000,
			effortType: 123456,
			initBal: 15011000,
			curBal: 100000,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 1,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 30,
			currency: '测试内容12345',
			leastOrderAmount: 100,
			effortType: 123456,
			initBal: 100,
			curBal: 50,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 2,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 20,
			currency: '测试内容12345',
			leastOrderAmount: 200,
			effortType: 123456,
			initBal: 100,
			curBal: 100,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 2,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 30,
			currency: '测试内容12345',
			leastOrderAmount: 200,
			effortType: 123456,
			initBal: 100,
			curBal: 100,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 2,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 90,
			currency: '测试内容12345',
			leastOrderAmount: 200000,
			effortType: 123456,
			initBal: 100,
			curBal: 100,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 2,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 40,
			currency: '测试内容12345',
			leastOrderAmount: 200,
			effortType: 123456,
			initBal: 100,
			curBal: 100,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 1,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 40,
			currency: '测试内容12345',
			leastOrderAmount: 200000,
			effortType: 123456,
			initBal: 200,
			curBal: 5,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		},
		{
			kind: 1,
			displayTitle: '测试内容12345',
			displayDesc: '测试内容12345',
			status: 90,
			currency: '测试内容12345',
			leastOrderAmount: 200,
			effortType: 123456,
			initBal: 100,
			curBal: 99,
			deliveryTime: 1510274812099,
			usableTime: 1510274812099,
			expireTime: 1515340800000,
			giftId: 12345611
		}
		]
	}
});
