import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { pagePath } from 'config/pageConfig';

import order from './routeConfig/order';

Vue.use(Router);

const routes = [...order];

// 不要改动该处！！！
const router = new Router({
	routes,
	// mode: 'hash',
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	base: pagePath.orderBase
});

router.beforeEach((to, from, next) => {
	// seo相关的change

	next();
});

export default router;

if (__debug__) { // eslint-disable-line
	router.replace({
		path: '/sport_bets'
	});
}
