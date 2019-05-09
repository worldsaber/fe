import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';

Vue.use(Router);

const router = new Router({
	routes,
	mode: 'hash',
	base: '/mobile/bingo/index.ftl'
	// base: `${__baseUrl__}m/promotions/scores_prediction`
});

router.beforeEach((to, from, next) => {
	next();
});

export default router;
