import Vue from 'vue';
import CommonPop from './pagelet/commonPop.vue';

import './style/commonPop.less';

let isReadyCommonPop = false;

CommonPop.install = function(Vue) {
	if (isReadyCommonPop) {
		return;
	}
	Vue.component(CommonPop.name, CommonPop);
	isReadyCommonPop = true;
};

Vue.use(CommonPop);

export default CommonPop;
