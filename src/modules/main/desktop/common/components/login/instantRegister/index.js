import Vue from 'vue';
import InstantRegister from './index.vue';

import './index.less';

let isReadyRegister = false;

InstantRegister.install = function(Vue) {
	if (isReadyRegister) {
		return;
	}
	Vue.component(InstantRegister.name, InstantRegister);
	isReadyRegister = true;
};

Vue.use(InstantRegister);

export default InstantRegister;
