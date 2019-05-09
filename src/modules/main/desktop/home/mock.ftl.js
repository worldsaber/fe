module.exports = {
	broadcastInfo: {
		bizCode: 10000,
		message: '测试内容12345',
		data: [
			{
				groupType: 1,
				infos: [
					{
						id: '1',
						text: '测试内容12345',
						url: 'http://www.sportybet.com/ke/',
						expireTime: 123456
					}
				]
			}, {
				groupType: 2,
				infos: [
					{
						id: '2',
						text: 'gaungbo',
						url: 'http://www.sportybet.com/ke/',
						expireTime: 123456,
						detail: {
							msgType: 123456,
							bizType: 123456,
							phone: '测试内容12345',
							stake: 123456,
							winning: 123456,
							bizTime: 123456
						}
					}
				]
			}, {
				groupType: 3,
				infos: [
					{
						id: '3',
						text: '测试内容12345',
						url: 'http://www.sportybet.com/ke/',
						expireTime: 123456,
						detail: {
							msgType: 1,
							bizType: 2,
							phone: '07****123',
							stake: 123456,
							winning: 123456789,
							bizTime: 1522725950839
						}
					}
				]
			}
		]
	}
};
