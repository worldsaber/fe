
export function getOddsBoost({ commit }) {
	return fetch('/marketing/v1/activities/oddsBoost')
	.then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			const data = res.data;
			commit('UPDATE', data);
			return data;
		}
		return Promise.reject('failed to fetch config ');
	});
}

export default {
	getOddsBoost,
};

