import mockjax from 'mock';

mockjax.post('/promotion/v1/sp/query', {
	bizCode: 10000,
	data: {
		adSpots: [{
			spotId: 'orderBottom',
			isCarousel: 0, // 是否多张轮播（0-否，1-是）
			ads: {
				imgUrl: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png',
				text: '200% Karibu Gifts on your 1st Deposit of 50 KSh.',
				linkUrl: 'http://caipiao.163.com',
				btnText: 'Go Deposit'
			}
		},
		{
			spotId: 'banner',
			isCarousel: 1, // 是否多张轮播（0-否，1-是）
			ads: [
				{
					imgUrl: '',
					text: '',
					linkUrl: ''
				}
			]
		}]
	}
});
