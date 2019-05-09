import Vue from 'vue';
import AfSelect from './index.vue';

let isReadyInput = false;

AfSelect.install = function(Vue) {
	if (isReadyInput) {
		return;
	}
	Vue.component(AfSelect.name, AfSelect);
	isReadyInput = true;
};

Vue.use(AfSelect);

export { AfSelect };

export default AfSelect;
