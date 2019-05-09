import Vue from 'vue';
import PopActivity from './pagelet/activity.vue';

import './style/activity.less';

let isReadyPopActivity = false;

PopActivity.install = function(Vue) {
	if (isReadyPopActivity) {
		return;
	}
	Vue.component(PopActivity.name, PopActivity);
	isReadyPopActivity = true;
};

Vue.use(PopActivity);

export default PopActivity;
