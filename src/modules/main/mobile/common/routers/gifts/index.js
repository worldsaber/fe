import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: 'hash',
	// base: '/mobile/gifts/index.ftl'
	base: `${__baseUrl__}m/my_accounts/gifts`
});

export default router;
