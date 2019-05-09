import Vue from 'vue';
import AdBar from './index.vue';

import './index.less';

let isReadyAdBar = false;

AdBar.install = function(Vue) {
	if (isReadyAdBar) {
		return;
	}
	Vue.component(AdBar.name, AdBar);
	isReadyAdBar = true;
};

Vue.use(AdBar);

export default AdBar;
