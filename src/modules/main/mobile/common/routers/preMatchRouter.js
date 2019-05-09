import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import preMatchRoutes from './routeConfig/preMatch';
import navigatorRoutes from './routeConfig/navigator';

Vue.use(Router);

const routes = [...preMatchRoutes, ...navigatorRoutes];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	fallback: true,
	base: baseUrlFix
});
if (__debug__) { // eslint-disable-line
	router.push({
		path: '/sport/soccer/sr:category:11/sr:tournamentId:22/sr:test:11 '
	});
}

export default router;
