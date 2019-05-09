import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';

import { baseUrlFix } from 'config/pageConfig';

import liveBettingRoutes from './routeConfig/liveBetting';
import navigatorRoutes from './routeConfig/navigator';

Vue.use(Router);

const routes = [...liveBettingRoutes, ...navigatorRoutes];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	fallback: true,
	base: baseUrlFix
});

export default router;

if (__debug__) { // eslint-disable-line
	router.replace({
		path: '/sport/basketball/live_list'
	});
}
