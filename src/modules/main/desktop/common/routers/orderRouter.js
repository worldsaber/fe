import Vue from 'vue';
import Router from 'vue-router';
import dialog from 'components/dialog';
import { supportsPushState } from 'utils';
import { pagePath } from 'config/pageConfig';

import order from './routeConfig/order';

Vue.use(Router);

const routes = [...order];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: supportsPushState ?
		'history' :
		'hash',
	// mode: 'hash',
	fallback: true,
	base: pagePath.orderBase
});

router.beforeEach((to, from, next) => {
	// seo相关的change
	dialog();
	next();
});

export default router;
