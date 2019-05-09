import 'core/core';
import 'base/base';
import Vue from 'vue';
// import Vuex from 'vuex';
import router from './router/deposit2.js';
import index from './deposit2.vue';

// Vue.use(Vuex);

// const store = new Vuex.Store({
// 	modules: {
// 		layout,
// 		issue
// 	}
// });
router.afterEach(() => {
	document.documentElement.scrollTop = 0;
});
// window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	// store,
	router,
	render: h => h(index)
});
