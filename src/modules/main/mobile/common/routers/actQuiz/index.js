import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';

Vue.use(Router);

const router = new Router({
	routes,
	mode: 'hash',
	base: `${__baseUrl__}m/promotion/footballquiz`
});

const routerKeys = [];
for (const routeTtem of routes) {
	if (routeTtem.name !== 'home') {
		routerKeys.push(routeTtem.name);
	}
}

router.beforeEach((to, from, next) => {
	next();
});

export default router;
