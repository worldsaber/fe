import Vue from 'vue';
import popupLogin from './popupLogin.vue';

if (!Vue.prototype.$popupLogin) {
	const instance = new Vue(popupLogin);
	const el = document.createElement('div');
	document.body.appendChild(el);
	instance.$mount(el);
	Vue.prototype.$popupLogin = instance;
	window.login = instance;
}
