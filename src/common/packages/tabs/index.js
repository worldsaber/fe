import Vue from 'vue';
import AfTabs from './tabs.vue';
import AfTabPane from './pane.vue';

import './index.less';

let isReadyTab = false,
	isReadyPane = false;

AfTabs.install = function(Vue) {
	if (isReadyTab) {
		return;
	}
	Vue.component(AfTabs.name, AfTabs);
	isReadyTab = true;
};

AfTabPane.install = function(Vue) {
	if (isReadyPane) {
		return;
	}
	Vue.component(AfTabPane.name, AfTabPane);
	isReadyPane = true;
};

Vue.use(AfTabs);
Vue.use(AfTabPane);

export {
	AfTabs,
	AfTabPane
};
