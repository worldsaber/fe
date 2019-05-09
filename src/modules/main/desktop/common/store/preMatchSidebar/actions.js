import { FETCH_SIDEBAR } from './mutationTypes';
import '../../../mockData/siderBar/siderBar?debug';

export default {
	/**
	 * @params object 比赛数量获取接口参数
	 *  * params.sportId 赛事大分类，如果不给就返回所有的分类
 		* params.timeline 长整形时间参数，会返回规定时间的比赛分类，传递0表示全部，不传递表示today 传递数字表示小时
 		* params.productId 1表示live，3表示prematch
		* params.option 1 如果只想取大分类的数量，则可以传递1， 如果不想获取tournament的数量，而是只想获取categories和sports则传递2
		// 数据获取错误处理请统一处理，此处不处理，因为错误的commit在别处
	 */
	// 这里获取左侧列表没有调用公共的 sportSize接口，因为有预感，这里这个接口以后可能不会公用
	//  因为左侧列表如果用2个接口调用会导致 一片显示，然后另一片突然插入，非常不好看，所以最好是抽成一个接口，目前先写成2个接口
	fetchSideList ({ commit, state }, params) {
		return fetch('/factsCenter/popularAndSportList', {
			body: params
		})
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const d = data.data || [];
				return d;
			}
			return [];
		})
		.then(data => {
			if (!data.sportList && !data.popularEvents) {
				data = null;
			}
			commit(FETCH_SIDEBAR, data);
			return data;
		});
	}
};
