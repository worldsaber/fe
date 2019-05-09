import Vue from 'vue';
import Winnings from './pagelet/winnings.vue';

import './style/winnings.less';

let isReadyWinnings = false;

Winnings.install = function(Vue) {
	if (isReadyWinnings) {
		return;
	}
	Vue.component(Winnings.name, Winnings);
	isReadyWinnings = true;
};

Vue.use(Winnings);
export default Winnings;
