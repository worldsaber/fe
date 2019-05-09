import Vue from 'vue';
import Broadcast from './index.vue';

let isReadyBroadcast = false;

Broadcast.install = function(Vue) {
	if (isReadyBroadcast) {
		return;
	}
	Vue.component(Broadcast.name, Broadcast);
	isReadyBroadcast = true;
};

Vue.use(Broadcast);

export default Broadcast;
