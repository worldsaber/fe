import Vue from 'vue';
import AfSlider from './slider.vue';

import './index.less';

let isReadySlider = false;

AfSlider.install = function(Vue) {
	if (isReadySlider) {
		return;
	}
	Vue.component(AfSlider.name, AfSlider);
	isReadySlider = true;
};

Vue.use(AfSlider);

export { AfSlider };
export default AfSlider;
