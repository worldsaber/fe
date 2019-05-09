import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { pagePath } from 'config/pageConfig';

import openBet from './routeConfig/openBet';

Vue.use(Router);

const routes = [...openBet];

// 不要改动该处！！！
const router = new Router({
	routes,
	// mode: 'hash',
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	base: pagePath.myCenter
});

router.beforeEach((to, from, next) => {
	// seo相关的change

	next();
});

export default router;
