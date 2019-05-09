import 'core/core';
import 'base/base';
import Vue from 'vue';
import index from './index.vue';

new Vue({
	el: '#app',
	render: h => h(index)
});
