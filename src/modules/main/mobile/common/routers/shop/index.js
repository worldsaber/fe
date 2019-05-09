import Vue from 'vue';
import Router from 'vue-router';
import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import routes from './routes';

Vue.use(Router);

const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	fallback: true,
	base: `${baseUrlFix}/shop`
});

router.beforeEach((to, from, next) => {
	const { name = 'list', params = null } = to || {};
	if (name === 'detail' && !params.id) {
		return next({ name: 'list' });
	}

	if (!name) {
		return next({ name: 'list' });
	}
	next();
});

export default router;
