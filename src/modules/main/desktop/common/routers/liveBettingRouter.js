import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import liveBettingRoutes from './routeConfig/liveBetting';
import navigatorRoutes from './routeConfig/navigator';

Vue.use(Router);

const routes = [...liveBettingRoutes, ...navigatorRoutes];

// 不要改动该处！！！
const router = new Router({
	routes,
	mode: supportsPushState ?
		'history' :
		'hash',
	// mode: 'hash',
	fallback: true,
	base: baseUrlFix
});

let navBar;
router.beforeEach((to, from, next) => {
	// 若果使用url直接跳转过来时，path是'/', 需要手动切到相应的router

	// `to` and `from` are both route objects
	!navBar && (navBar = document.querySelector('#header'));
	if (navBar) {
		const name = to.name,
			meta = to.meta || {};

		if (name && meta.name) {
			navBar.querySelectorAll('.m-flex-item--active').removeClass('m-flex-item--active');
			const itemList = navBar.querySelectorAll('.m-flex-item');

			if (itemList.length) {
				for (let i = 0, len = itemList.length; i < len; i++) {
					const node = itemList[i];

					let tabName = node.innerHTML.replace(/(^\s*|\s*$)/g, '');

					tabName = tabName.toLowerCase();
					if (tabName.startsWith(meta.name.toLowerCase())) {
						node.addClass('m-flex-item--active');
					}
				}
			}
		}
	}

	// seo相关的change

	next();
});

export default router;
