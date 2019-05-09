import 'core/core';
import 'base/base';
// import { domain, protocol, pagePath } from 'config/pageConfig';
import Vue from 'vue';
import App from './index.vue';

// if (!window.loginStatus) {
// 	location.href = `${protocol}//${domain}${pagePath.login}`;
// } else {
new Vue({
	el: '#app',
	render: h => h(App),
});
// }

