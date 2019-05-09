import Vue from 'vue';
import Vuex from 'vuex';

import coupons from 'store/coupons/modules';
import bonus from 'store/bonus/modules';
import betslip from './betslip/modules';
import betslipStake from './betslipStake/modules';
import cashout from './cashout/modules';
import order from './order/modules';
import jackpotOrder from './jackpotOrder/modules';
import userCenter from './usercenter/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		betslip,
		betslipStake,
		coupons,
		bonus,
		cashout,
		order,
		jackpotOrder,
		userCenter
	}
});
