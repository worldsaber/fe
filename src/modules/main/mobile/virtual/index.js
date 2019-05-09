import 'core/core';
import 'base/base';
import Vue from 'vue';
import store from 'store/order';
import router from 'routers/orderRouter';
import App from './index.vue';

window.v_router = router;
window.v_store = store;

new Vue({
	el: '#app',
	render: h => h(App),
	store,
	router
});
