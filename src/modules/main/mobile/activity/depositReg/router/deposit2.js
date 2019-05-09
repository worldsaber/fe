import Vue from 'vue';
import Router from 'vue-router';
import {
	supportsPushState
} from 'utils';
import {
	baseUrlFix
} from 'config/pageConfig';
import routes from './depositRoutes2';

Vue.use(Router);

const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	base: `${baseUrlFix}/mkt/sp/fd2`
});

export default router;
