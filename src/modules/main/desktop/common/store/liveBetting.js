import Vue from 'vue';
import Vuex from 'vuex';

import coupons from 'store/coupons/modules';
import bonus from 'store/bonus/modules';
import betslip from './betslip/modules';
import betslipStake from './betslipStake/modules';
import cashout from './cashout/modules';
import eventDetail from './eventDetail/modules';
import eventList from './eventList/liveBetting/modules';
import sportSize from './sportSize/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		betslip,
		betslipStake,
		cashout,
		coupons,
		bonus,
		eventDetail,
		eventList,
		sportSize
	}
});
