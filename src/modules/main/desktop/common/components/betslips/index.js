import Vue from 'vue';
import Betslips from './index.vue';

import './index.less';

let isReadyBetslips = false;

Betslips.install = function(Vue) {
	if (isReadyBetslips) {
		return;
	}
	Vue.component(Betslips.name, Betslips);
	isReadyBetslips = true;
};

Vue.use(Betslips);

export default Betslips;
