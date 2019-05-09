import Vue from 'vue';
import Router from 'vue-router';
import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import routes from './routes';

Vue.use(Router);

const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	// base: '/mobile/bingo/index.ftl',
	base: `${baseUrlFix}/sportybingo`,
	name: 'bingo' // 区分路由实例
});

router.beforeEach((to, from, next) => {
	next();
});

export default router;
