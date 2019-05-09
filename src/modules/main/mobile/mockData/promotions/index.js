import mockjax from 'mock';

/*
用户活动列表
 */
mockjax.get('/promotion/v1/activities', {
	bizCode: 10000,
	data: {
		totalNum: 100,
		entityList: [] || [
			{
				activityStartTime: 1513699200000,
				activityEndTime: 1516377600000,
				activityId: 1,
				status: 20,
				activityTitle: '活动标题',
				imgUrl: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png',
				linkUrl: 'http://caipiao.163.com'
			},
			{
				activityStartTime: 1513699200000,
				activityEndTime: 1516377600000,
				activityId: 2,
				status: 30,
				activityTitle: '活动标题',
				imgUrl: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png',
				linkUrl: 'http://caipiao.163.com'
			},
			{
				activityStartTime: 1513699200000,
				activityEndTime: 1516377600000,
				activityId: 3,
				status: 90,
				activityTitle: '活动标题',
				imgUrl: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png',
				linkUrl: 'http://caipiao.163.com'
			},
		]
	}
});
