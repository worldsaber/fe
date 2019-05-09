import 'core/core';
import 'base/base';
import Vue from 'vue';
import store from 'store/register/registerVerify';
import router from 'routers/collectGifts';
import App from './App';

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});
