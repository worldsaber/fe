import Vue from 'vue';
import Router from 'vue-router';

import { baseUrl } from 'config/pageConfig';

import sportyCoins from './routeConfig/sportyCoins';

Vue.use(Router);

const routes = [...sportyCoins];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: 'history',
	// mode: 'hash',
	base: `${baseUrl}my_accounts/sportycoins`
});

router.beforeEach((to, from, next) => {
	// seo相关的change

	next();
});

export default router;
