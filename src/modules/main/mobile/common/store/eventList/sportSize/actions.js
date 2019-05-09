import { FETCH_SPORT_SIZE, UPDATE_CATEGORY } from './mutationTypes';

// 取到国家编码
// const countryCode = window.countryCode || 254;
// const fetchUrl = {
// 	234: '/factsCenter/wapSportOption',
// 	// popularAndSportList
// 	254: '/factsCenter/popularAndSportList',
// 	233: '/factsCenter/wapSportOption',
// };
const fetchData = function (params) {
	return fetch('/factsCenter/wapPopularAndSportOption', {
		body: params
	})
	.then(res => res.json())
	.then(data => {
		if (data.bizCode === 10000) {
			let d = [];
			const originData = data.data;
			if (originData.sportList) {
				// 注意这里的popularEvents表示置顶的，sportList表示列表，他们可能有重复的，将他们合并，但是重复的是数组中的2个元素，但是在map中会变成一个，所以在选中的时候，相同的会同时选中
				let popularEvents = originData.popularEvents || [[]];
				let sportList = originData.sportList || [[]];
				// 因为每次就取一个体育类型，所以直接取低0个
				popularEvents = popularEvents[0];
				sportList = sportList[0];
				// 2个都存在就合并
				if (popularEvents && sportList) {
					// eventSize 在这里已经不准确了，只是某个体育类型下的不准确，建议删除掉
					const res = {
						id: sportList.id,
						name: sportList.name,
						popularCategory: popularEvents.categories.find(category => category.id === 'sr:category:top'),
						categories: popularEvents.categories.concat(sportList.categories)
					};
					d = [res];
				} else {
					d = [sportList];
				}
			} else if (Array.isArray(originData)) {
				d = originData;
			}
			return d;
		}
		return [];
	});
};

export default {
	/**
	 * @params object 比赛数量获取接口参数
	 *  * params.sportId 赛事大分类，如果不给就返回所有的分类
 		* params.timeline 长整形时间参数，会返回规定时间的比赛分类，传递0表示全部，不传递表示today 传递数字表示小时
 		* params.productId 1表示live，3表示prematch
		* params.option 1 如果只想取大分类的数量，则可以传递1， 如果不想获取tournament的数量，而是只想获取categories和sports则传递2
		// 数据获取错误处理请统一处理，此处不处理，因为错误的commit在别处
	 */
	[FETCH_SPORT_SIZE] ({ commit }, params) {
		return fetchData(params)
		.then(data => {
			commit(FETCH_SPORT_SIZE, data);
			return data;
		});
	},
	[UPDATE_CATEGORY] ({ commit }, params) {
		return fetchData(params)
		.then(data => {
			commit(UPDATE_CATEGORY, data);
			return data;
		});
	}
};
