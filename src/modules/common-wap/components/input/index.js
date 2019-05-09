import Vue from 'vue';
import AfInput from './index.vue';

let isReadyInput = false;

AfInput.install = function(Vue) {
	if (isReadyInput) {
		return;
	}
	Vue.component(AfInput.name, AfInput);
	isReadyInput = true;
};

Vue.use(AfInput);

export { AfInput }; // eslint-disable-line
