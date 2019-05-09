import Vue from 'vue';
import Vuex from 'vuex';
// 从首页开始的router
import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import me from 'store/me/modules';
import eventList from './eventList/liveBetting/modules';
import eventDetail from './eventDetail/modules';
import oddsBoost from './oddsBoost/modules';
import { modules as sportSizeModules } from './sportSize/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	actions: {
	},
	modules: {
		me,
		layout,
		eventList,
		eventDetail,
		betslip,
		betslipStake,
		oddsBoost,
		liveSportSize: sportSizeModules()
	}
});
