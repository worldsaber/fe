import mockjax from 'mock';

/*
用户兑换优惠券接口
 */
mockjax.post('/promotion/v1/gifts/redeem', {
	bizCode: 10000,
});

/*
用户获取红包列表接口
 */
mockjax.get('/promotion/v1/gifts', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		totalNum: 10,
		entityList: [
			{
				kind: 1,
				displayTitle: '测试内容12345',
				displayDesc: '测试内容12345',
				status: 20,
				currency: '测试内容12345',
				leastOrderAmount: 123456,
				effortType: 123456,
				initBal: 15000000,
				curBal: 1000000,
				deliveryTime: 1510274812099,
				usableTime: 1510274812099,
				expireTime: 1515340800000,
				giftId: 12345611
			},
			{
				kind: 1,
				displayTitle: '测试内容12345',
				displayDesc: 'left; the usage rules are shown on the right. In the above example, the user can only use this coupon for 8 days (until 11 September 2012 19:53:47) and can only use it on orders over US $25 when paying with a MasterCard credit card.',
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
				initBal: 1000000,
				curBal: 1000000,
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
				initBal: 1000000,
				curBal: 1000000,
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
				leastOrderAmount: 200,
				effortType: 123456,
				initBal: 100,
				curBal: 99,
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
