import Vue from 'vue';
import Router from 'vue-router';

import { supportsPushState } from 'utils';

import { sportType2Id } from 'config/sportsType';
import { baseUrlFix } from 'config/pageConfig';

import preMatchRoutes from './routeConfig/preMatch';

Vue.use(Router);

const routes = [...preMatchRoutes];

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
	// `to` and `from` are both route objects
	if (to.params && to.params.sportName) {
		to.meta.name = to.params.sportName;
	}

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

					const tabName = node.getAttribute('data-key');
					if (tabName.toLowerCase() === meta.name.toLowerCase()) {
						node.addClass('m-flex-item--active');

						to.meta.sportId = sportType2Id[tabName.toLowerCase()];
					}
				}
			}
		}
	}
	// seo相关的change

	next();
});

export default router;
