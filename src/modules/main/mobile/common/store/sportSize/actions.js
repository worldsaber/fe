import { FETCH_SPORT_SIZE, UPDATE_CATEGORY } from './mutationTypes';
import '../../../mockData/sportSize?debug';

const fetchData = function (params) {
	return fetch('/factsCenter/sportList', {
		body: params
	})
	.then(res => res.json())
	.then(data => {
		if (data.bizCode === 10000) {
			const d = data.data || [];
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
