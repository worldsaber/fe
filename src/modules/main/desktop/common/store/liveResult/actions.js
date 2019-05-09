import dateFormat from 'kernel/js/dateFormat';
import * as mutationTypes from './mutationTypes';

const getDateTime = date => {
	const isToday = dateFormat.format(date, 'YYYYMMDD') === dateFormat.format(new Date(), 'YYYYMMDD');
	const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const endDate = isToday ? date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
	return {
		startTime: startDate.getTime(),
		endTime: endDate.getTime(),
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
				sport: indexSport
			});
			dispatch('getResultList');
		});
	},
	getResultList({
		commit,
		state
	}, gameId) {
		const {
			selected,
			pageNum,
			pageSize
		} = state;
		const {
			date,
			sport,
			category,
			tournament
		} = selected;
		const param = {
			pageNum,
			pageSize,
		};
		if (gameId) {
			param.gameId = gameId;
			param.pageNum = 1;
		} else {
			if (sport.id) param.sportId = sport.id;
			if (category.id) param.categoryId = category.id;
			if (tournament.id) param.tournamentId = tournament.id;
			const dateRange = getDateTime(date);
			Object.assign(param, dateRange);
		}
		getData('/factsCenter/eventResultList', {
			body: param,
		}).then(res => {
			commit(mutationTypes.UPDATE_RESULTLIST, res.data);
		});
	},
};
