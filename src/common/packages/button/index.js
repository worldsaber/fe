import Vue from 'vue';
import afButton from './button.vue';

let isReadyButton = false;
afButton.install = function(Vue) {
	if (isReadyButton) {
		return;
	}
	Vue.component(afButton.name, afButton);
	isReadyButton = true;
};

Vue.use(afButton);

export default afButton;
