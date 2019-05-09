import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { pagePath } from 'config/pageConfig';

import jackpot from './routeConfig/jackpot';

Vue.use(Router);

const routes = [...jackpot];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: supportsPushState ?
		'history' :
		'hash',
	// mode: 'hash',
	fallback: true,
	base: pagePath.jackpot
});

router.beforeEach((to, from, next) => {
	// seo相关的change

	next();
});

export default router;
