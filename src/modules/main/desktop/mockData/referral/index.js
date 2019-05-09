import mockjax from 'mock';

mockjax.get('promotion/v1/gifts/invites', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		totalNum: 120,
		entityList: [{
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 1500000,
			referredName: '12345678',
			referredCurStake: 10000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 100000000,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}, {
			giftAmount: 0,
			referredName: '12345678',
			referredCurStake: 4000000,
			referredTgtStake: 123456,
			entranceDate: 1519726186520,
			completeDate: 123456
		}],
		pageNo: 1,
		pageSize: 12,
		totalGiftAmount: 12000000
	}
});
mockjax.get('/marketing/v1/activities/activityId', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		isQualified: 123456,
		participantsNum: 123456,
		activityTitle: '测试内容12345',
		activityStartTime: 123456,
		activityEndTime: 123456,
		status: 123456,
		activityDesc: '测试内容12345',
		totalGiftAmount: 123456
	}
});
