import dateFormat from 'kernel/js/dateFormat';
import * as mutationTypes from './mutationTypes';

const getDateTime = date => {
	const isToday = dateFormat.format(date, 'YYYYMMDD') === dateFormat.format(new Date(), 'YYYYMMDD');
	const startDate = new Date(dateFormat.format(date, 'YYYY/MM/DD 00:00:00'));
	const endDate = new Date(dateFormat.format(date, isToday ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD 23:59:59'));
	return {
		startTime: startDate.valueOf(),
		endTime: endDate.valueOf(),
	};
};

const getData = (url, param = {}) => new Promise((resolve, reject) => {
	const t = new Headers();
	t.append('Content-Type', 'application/json;charset=UTF-8');
	t.append('OperId', window.operId || '1');
	const params = {
		method: 'GET',
		headers: t,
		body: {},
	};
	Object.assign(params, param);
	fetch(url, params)
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode;
			if (code === 10000) {
				resolve(data || {});
			} else {
				reject(data);
			}
		})
		.catch(err => {
			reject(err);
		});
});

export default {
	// 页面初始化数据
	intpageData({
		dispatch
	}) {
		dispatch('getOption');
	},
	getOption({
		commit,
		state,
		dispatch
	}) {
		const dateRange = getDateTime(state.selected.date);
		return new Promise((resolve, reject) => {
			getData('/factsCenter/sportResultOption', {
				body: dateRange,
			}).then(res => {
				const data = res.data;
				let indexSport = {};
				if (data.length > 0) {
					indexSport = {
						name: res.data[0].name || '',
						id: res.data[0].id || ''
					};
				}
				commit(mutationTypes.UPDATE_OPTIONLIST, data);
				commit(mutationTypes.UPDATE_SELECTED, {
					sport: indexSport,
					category: {},
					tournament: {}
				});
				dispatch('getResultList');
				resolve({});
			}).catch(() => {
				reject({});
			});
		});
	},
	getResultList({
		commit,
		state,
		getters
	}, nextPage) {
		const {
			selected,
			resultList,
			count,
		} = state;
		const {
			date,
			sport,
			category,
			tournament
		} = selected;

		const param = {
			count,
			lastId: '',
		};
		if (nextPage) {
			param.lastId = getters.lastId;
		}
		if (sport.id) param.sportId = sport.id;
		if (category.id) param.categoryId = category.id;
		if (tournament.id) param.tournamentId = tournament.id;
		const dateRange = getDateTime(date);
		Object.assign(param, dateRange);
		return new Promise((resolve, reject) => {
			getData('/factsCenter/eventResultList', {
				body: param,
			}).then(res => {
				let list = [].concat(resultList.tournaments || []);
				if (nextPage) {
					list = list.concat(res.data.tournaments);
					res.data.tournaments = list;
				}
				commit(mutationTypes.UPDATE_RESULTLIST, res.data);
				resolve({});
			}, () => {
				commit(mutationTypes.UPDATE_RESULTLIST, {});
				reject({});
			});
		});
	},
	getSearchList({
		commit,
	}, gameId) {
		getData('/factsCenter/eventResultList', {
			body: { gameId: gameId || '' },
		}).then(res => {
			commit(mutationTypes.UPDATE_SEARCHLIST, res.data);
		});
	},
};
