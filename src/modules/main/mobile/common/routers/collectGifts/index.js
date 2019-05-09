import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: 'hash',
	// base: '/mobile/activity/collectGifts/index.ftl'
	base: `${__baseUrl__}m/promotions/share_and_collect_gifts`
});

router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth && !window.loginStatus) {
		return next({ name: 'collectGifts' });
	}

	next();
});

export default router;
