import Vue from 'vue';
import GiftTips from './pagelet/gifts.vue';

import './style/gifts.less';

let isReadyGiftTips = false;

GiftTips.install = function(Vue) {
	if (isReadyGiftTips) {
		return;
	}
	Vue.component(GiftTips.name, GiftTips);
	isReadyGiftTips = true;
};

Vue.use(GiftTips);

export default GiftTips;
