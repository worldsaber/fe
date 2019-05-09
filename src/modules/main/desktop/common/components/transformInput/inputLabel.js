import Vue from 'vue';
import AfInputLabel from './pagelet/focusWithLablePlaceholder.vue';

let isReadyAfInputLabel = false;

AfInputLabel.install = function(Vue) {
	if (isReadyAfInputLabel) {
		return;
	}
	Vue.component(AfInputLabel.name, AfInputLabel);
	isReadyAfInputLabel = true;
};

Vue.use(AfInputLabel);

export default AfInputLabel;
