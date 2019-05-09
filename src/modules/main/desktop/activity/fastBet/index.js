import 'core/core';
import 'base/base';

import Vue from 'vue';
import App from './index.vue';

new Vue({
	el: '#appWrap',
	render: h => h(App),
});
