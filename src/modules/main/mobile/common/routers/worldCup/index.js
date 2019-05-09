import Vue from 'vue';
import Router from 'vue-router';
import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import routes from './routes';

Vue.use(Router);

const router = new Router({
	routes,
	mode: supportsPushState ? 'history' : 'hash',
	base: `${baseUrlFix}/promotions/sporty_predict_and_win`
});

router.beforeEach((to, from, next) => {
	next();
});

export default router;
