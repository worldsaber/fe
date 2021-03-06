import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'store/layout/modules';
import issue from 'store/issue/modules';
import router from 'routers/actQuiz';
import index from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		layout,
		issue
	}
});

window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(index)
});
