import Vue from 'vue';
import Vuex from 'vuex';
// 从首页开始的router
import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import me from 'store/me/modules';
import order from 'store/order/modules';
import eventList from './eventList/preMatch/modules';
import sportSize from './eventList/sportSize/modules';
import eventDetail from './eventDetail/modules';
import comment from './comment/modules';
import shareBet from './shareBet/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	actions: {
	},
	modules: {
		me,
		layout,
		eventList,
		sportSize,
		eventDetail,
		betslip,
		betslipStake,
		comment,
		order,
		shareBet
	}
});
