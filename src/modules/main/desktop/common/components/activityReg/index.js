import Vue from 'vue';
import ActivityReg from './index.vue';

let isReadyActivityReg = false;

ActivityReg.install = function(Vue) {
	if (isReadyActivityReg) {
		return;
	}
	Vue.component(ActivityReg.name, ActivityReg);
	isReadyActivityReg = true;
};

Vue.use(ActivityReg);

export default ActivityReg;
