import Vue from 'vue';
import AfTextarea from './textarea.vue';

let isReadyTextarea = false;

AfTextarea.install = function(Vue) {
	if (isReadyTextarea) {
		return;
	}
	Vue.component(AfTextarea.name, AfTextarea);
	isReadyTextarea = true;
};

Vue.use(AfTextarea);

export { AfTextarea }; // eslint-disable-line
