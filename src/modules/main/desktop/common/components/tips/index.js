import Vue from 'vue';
import Tips from './index.vue';

let installed = false;

Tips.install = function(Vue) {
	if (installed) {
		return;
	}
	Vue.component(Tips.name, Tips);
	installed = true;
};

Vue.use(Tips);

export default Tips;
