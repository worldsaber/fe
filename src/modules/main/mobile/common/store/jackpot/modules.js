import actions from './actions';
import mutations from './mutations';

export default {
	state: {
		// 当前投注期次相关数据
		periodData: {},
		// 页面数据
		pageData: {},
		// 历史开奖期次列表
		resultPeriods: [],
		// 历史开奖详情
		previousDetail: {},
		// 选中项列表
		selections: {
			itemList: [],
			selectList: {},
			itemsSize: 0,
		},
		// 比赛场次
		gameSize: 0,
		orderData: {
			total: '',
			combinations: '',
			periodNumber: '',
			type: '',
			time: '',
		},
		betStatus: 'selecting',
		loginStatus: window.loginStatus
	},
	getters: {
		// 页面状态
		status(state) {
			// 可销售且倒计时为零
			const type = state.periodData.status || 0;
			const leftTime = state.pageData.leftTime || 0;
			return (leftTime > 0 && type === 1) ? 'open' : 'closed';
		},
		// 计算注数
		combinations(state) {
			let zhu = 0;
			const ev = state.selections;
			const sizelist = Object.values(ev.selectList);
			if (ev.itemsSize >= state.gameSize && sizelist.length >= state.gameSize) {
				let temp = 1;
				sizelist.forEach(item => {
					temp *= item.length;
				});
				zhu = temp;
			}
			return zhu;
		},
	},
	mutations,
	actions,
	namespaced: true
};
