import Vue from 'vue';
import Router from 'vue-router';

import { baseUrl } from 'config/pageConfig';

import transaction from './routeConfig/transaction';

Vue.use(Router);

const routes = [...transaction];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: 'hash',
	// mode: 'hash',
	base: `${baseUrl}my_accounts/transactions/`
});

router.beforeEach((to, from, next) => {
	// seo相关的change

	next();
});

export default router;
