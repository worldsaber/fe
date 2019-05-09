import Vue from 'vue';
import GrandPrize from './index.vue';

let isReadyGrandPrize = false;

GrandPrize.install = function(Vue) {
	if (isReadyGrandPrize) {
		return;
	}
	Vue.component(GrandPrize.name, GrandPrize);
	isReadyGrandPrize = true;
};

Vue.use(GrandPrize);

export default GrandPrize;
