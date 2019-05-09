import 'core/core';
import 'base/base';
import Vue from 'vue';
import store from 'store/shop';
import router from 'routers/shop';
import App from './index.vue';

window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});
