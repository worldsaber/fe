import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { pagePath } from 'config/pageConfig';

import routes from './routes';

Vue.use(Router);

const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	base: pagePath.home
});

export default router;
