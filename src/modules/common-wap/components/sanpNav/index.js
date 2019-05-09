import Vue from 'vue';
import SnapNavItem from './snapNavItem.vue';
import SnapNav from './snapNav.vue';

import './index.less';

let isReadyTab = false,
	isReadyPane = false;

SnapNavItem.install = function(Vue) {
	if (isReadyTab) {
		return;
	}
	Vue.component(SnapNavItem.name, SnapNavItem);
	isReadyTab = true;
};

SnapNav.install = function(Vue) {
	if (isReadyPane) {
		return;
	}
	Vue.component(SnapNav.name, SnapNav);
	isReadyPane = true;
};

Vue.use(SnapNavItem);
Vue.use(SnapNav);

export {
	SnapNavItem,
	SnapNav
};

export default SnapNav;
