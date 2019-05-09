import * as mutationTypes from './mutationTypes';

export default {
	/*
	bonus
	 */
	getBonus({
		state,
		commit
	}) {
		return new Promise((resolve, reject) => {
			fetch('/promotion/v1/bonus/plans/valid')
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATEBONUS, ret.data || {});
				}
			})
			.catch(err => { // eslint-disable-line
			});
		});
	}
};
