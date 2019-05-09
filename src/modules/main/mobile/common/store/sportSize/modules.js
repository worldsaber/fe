import mutations from './mutations';
import state, { getState } from './state';
import actions from './actions';
import getters from './getters';

export default {
	state,
	mutations,
	actions,
	getters,
	namespaced: true
};
// 该模块被重复导入，如果store不想是公共数据，而是独立的，则需要这样导出
export function modules() {
	return {
		state: getState(),
		mutations,
		actions,
		getters,
		namespaced: true
	};
}
