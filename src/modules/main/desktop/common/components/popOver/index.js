import Vue from 'vue';
import PopOver from './popOver.vue';
import directive from './popOverDirective';

let installed = false;
PopOver.install = function(Vue) {
	if (installed) {
		return;
	}
	Vue.directive('popOver', directive);
	Vue.component(PopOver.name, PopOver);
	installed = true;
};
PopOver.directive = directive;

Vue.use(PopOver);

export default PopOver;
