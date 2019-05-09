import mockjax from 'mock';

/*
广告位
 */
mockjax.get('/common/config/ad/pc', {
	bizCode: 10000,
	message: 'success',
	data: {
		ch: 'pc',
		updateAd: [
			{
				imgUrl: 'http://cms-bucket.nosdn.127.net/9d81114baedd44a299fbbcfa3d03acd420170918151925.png?imageView&thumbnail=190y120',
				linkUrl: 'http://sports.163.com/17/0918/15/CUKIAR8N00058781.html',
				text: 'updateAd1'
			}, {
				imgUrl: 'http://cms-bucket.nosdn.127.net/9d81114baedd44a299fbbcfa3d03acd420170918151925.png?imageView&thumbnail=190y120',
				linkUrl: 'http://sports.163.com/17/0918/15/CUKIAR8N00058781.html',
				text: 'updateAd2'
			}
		]
	}
});
