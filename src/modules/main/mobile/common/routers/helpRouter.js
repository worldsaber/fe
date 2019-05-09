import Vue from 'vue';
import Router from 'vue-router';

import { pagePath } from 'config/pageConfig';

import help from './routeConfig/help';

Vue.use(Router);

const routes = [...help];

const router = new Router({
	routes,
	mode: 'hash',
	base: pagePath.help
});

export default router;
