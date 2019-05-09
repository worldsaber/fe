import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import offlineWithdraw from './routeConfig/offlineWithdraw';

Vue.use(Router);

const routes = [...offlineWithdraw];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: supportsPushState && !__debug__ ? 'history' : 'hash', // eslint-disable-line
	fallback: true,
	base: `${baseUrlFix}/my_accounts/withdraw`
});

export default router;
