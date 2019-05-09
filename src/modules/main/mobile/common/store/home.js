import Vue from 'vue';
import Vuex from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { FETCH_SPORT_SIZE } from 'store/sportSize/mutationTypes';
import { LIVE_LOADING, CHANGE_LIVE_LOADING, CHANGE_LIVE_ID } from 'store/home/mutationTypes';
// 从首页开始的router
import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import home from './home/modules';
import { modules as sportSizeModules } from './sportSize/modules';
import oddsBoost from './oddsBoost/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	actions: {
		// 入口控制
		initHome ({ commit, state, dispatch }) {
			// 直接请求相关的数据,如果数据返回则切换loading状态
			// 请求的数据分别是一级导航和二级导航
			commit(`layout/${CHANGE_LOADING}`, true);
			// 加载推荐比赛
			dispatch('home/fetchRecommendEvents');
			// 加载首页配置
			return dispatch('home/fetchHomeCfg')
			.then(() => {
				// 加载成功显示主要逻辑
				commit(`layout/${CHANGE_LOADING}`, false);
			})
			.catch(() => {
				// 显示加载失败
				commit(`layout/${CHANGE_LOADING}`, -1);
			});
		},
		// 初始化直播比赛列表
		fetchLive ({ commit, dispatch }, sportId) {
			commit(`home/${LIVE_LOADING}`, true);
			// 先获取比赛的大分类和比赛的数量-- 默认取24小时的
			return dispatch(`liveSportSize/${FETCH_SPORT_SIZE}`, {
				option: 1,
				productId: 1
			})
			.then(sportSize => {
				// 默认取第一个体育类型玩法
				if (sportSize && sportSize.length) {
					commit(`home/${CHANGE_LIVE_ID}`, sportId || sportSize[0].id);
					return dispatch('home/fetchLive', sportId || sportSize[0].id);
				}
				return {};
			})
			.then(data => {
				// 加载完成
				commit(`home/${LIVE_LOADING}`, false);
			})
			.catch(e => commit(`home/${LIVE_LOADING}`, -1));
		},
		// 切换直播类型
		changeLive ({ commit, dispatch, state }, sportId) {
			commit(`home/${CHANGE_LIVE_LOADING}`, true);
			return dispatch('home/fetchLive', sportId)
			.then(() => commit(`home/${CHANGE_LIVE_LOADING}`, false))
			.catch(() => commit(`home/${CHANGE_LIVE_LOADING}`, -1));
		}
	},
	modules: {
		// 这里调用同一个模块存取live和sports的比赛分类数据
		liveSportSize: sportSizeModules(),
		sportsSize: sportSizeModules(),
		layout,
		home,
		betslip,
		betslipStake,
		oddsBoost
	}
});
