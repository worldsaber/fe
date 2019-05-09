import 'core/core';
import 'base/base';
import Vue from 'vue';
import store from 'store/index';
import index from './index.vue';

window.v_store = store;
// window.v_router = router;

new Vue({
	el: '#app',
	store,
	// router,
	render: h => h(index)
});
