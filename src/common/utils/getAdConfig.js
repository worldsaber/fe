import '../../mockData/adConfig?debug';

/**
 * 获取多个广告位配置
 * @postConfig: [] Array
 * 	 	传值示例：[{spotId: 'adname',preserve: '此字段非必须'}]
 * @promise return : [] Array
 * 		返回值示例：[{spotId: 'a', isCarousel: 0, ads: {} },{spotId: 'b', isCarousel: 1, ads: [] }]
 *
 * *  ---------------------------------
 * 详情请参看接口 http://idoc.ms.netease.com/idoc/inter/index.html?projectId=158&interfaceId=4314
 * 	ajax返回的data.data对象说明:
 * 		isCarousel: 是否多张轮播（0-否，1-是）如果为0，则ads返回的是对象，如果为1，ads返回的是数组
 */
export function getComplexAdConfig (postConfig = []) {
	return new Promise((resolve, reject) => {
		if (!postConfig.length) {
			reject('参数有误！');
		}
		fetch('/promotion/v1/sp/query', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				adSpots: postConfig
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const adData = (data.data || {}).adSpots || [];
 				resolve(adData);
			} else {
				reject('failed');
			}
		})
		.catch(err => reject(err));
	});
}

/**
 * 获取单个广告位配置
 * @spotId: String
 * @promise return：[] 统一返回数组，各自根据数组长度来判断是否有多张
 *  如果没有广告返回空数组
 *    示例：[{imgUrl: '', text:'文案内容', linkUrl:'点击的链接地址'}]
 *
 */
export function getAdConfig (spotId = '') {
	return new Promise((resolve, reject) => {
		if (!spotId) {
			reject('参数有误！');
		}
		fetch('/promotion/v1/sp/query', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				adSpots: [{
					spotId
				}]
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const adData = ((data.data || {}).adSpots || [])[0];
				let returned = [];
				if (adData) {
					if (adData.ads && ({}).toString.call(adData.ads) === '[object Object]') {
						returned.push(adData.ads);
					} else {
						returned = adData.ads || [];
					}
				}
 				resolve(returned);
			} else {
				reject('failed');
			}
		})
		.catch(err => reject(err));
	});
}
