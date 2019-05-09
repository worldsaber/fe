import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'store/layout/modules';
import router from 'routers/helpRouter';
import index from './index.vue';

const store = new Vuex.Store({
	modules: {
		layout
	}
});

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(index)
});

window.zE(() => {
	const zE = window.zE;
	zE.setLocale('english');
	// zE.setHelpCenterSuggestions({ search: 'credit card' });
	if (URL.getPara('showChat')) {
		// 这里官方文档地址 https://api.zopim.com/files/meshim/widget/controllers/liveChatAPI/Window-js.html
		zE.activate();
	}
});
