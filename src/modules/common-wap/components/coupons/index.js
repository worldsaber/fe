import Vue from 'vue';
import Coupons from './index.vue';

import './index.less';

let isReadyCoupons = false;

Coupons.install = function(Vue) {
	if (isReadyCoupons) {
		return;
	}
	Vue.component(Coupons.name, Coupons);
	isReadyCoupons = true;
};

Vue.use(Coupons);

export default Coupons;
