/**
 * 获取年终数据
 */
export function fetchData({ commit }) {
	return fetch('promotion/v1/activities/summary/data')
		.then(res => res.json())
		.then(res => {
			if (res.bizCode === 10000) {
				const data = res.data;
				commit('UPDATE_DATA', data);
			} else {
				return Promise.reject();
			}
		}).catch(() => {});
}

export default {
	fetchData
};
