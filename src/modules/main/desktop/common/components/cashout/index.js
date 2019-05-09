import Vue from 'vue';
import Cashout from './index.vue';

import './index.less';

let isReadyCashout = false;

Cashout.install = function(Vue) {
	if (isReadyCashout) {
		return;
	}
	Vue.component(Cashout.name, Cashout);
	isReadyCashout = true;
};

Vue.use(Cashout);

export default Cashout;
