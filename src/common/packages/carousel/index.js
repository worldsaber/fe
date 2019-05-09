import Vue from 'vue';
import AfCarousel from './main.vue';

let isReadyCarousel = false;

AfCarousel.install = function(Vue) {
	if (isReadyCarousel) {
		return;
	}
	Vue.component(AfCarousel.name, AfCarousel);
	isReadyCarousel = true;
};

Vue.use(AfCarousel);

export { AfCarousel };
export default AfCarousel;
