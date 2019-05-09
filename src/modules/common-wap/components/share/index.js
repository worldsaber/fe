import Vue from 'vue';
import Share from './index.vue';

let isReadyShare = false;

Share.install = function(Vue) {
	if (isReadyShare) {
		return;
	}
	Vue.component(Share.name, Share);
	isReadyShare = true;
};

Vue.use(Share);

export default Share;
