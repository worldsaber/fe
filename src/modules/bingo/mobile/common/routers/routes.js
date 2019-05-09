import Home from '../../pages/home/index';
import Popular from '../../pages/home/popular';
import Published from '../../pages/home/published';

import Mine from '../../pages/mine';
import detail from '../../pages/detail/detail';
import participation from '../../pages/participation/index';

const routes = [{
	path: '/',
	exact: true,
	redirect: { name: 'popular' },
}, {
	name: 'home',
	path: '/home',
	component: Home,
	redirect: { name: 'popular' },
	children: [{
		name: 'popular',
		path: 'popular',
		component: Popular
	}, {
		name: 'published',
		path: 'published',
		component: Published,
	}, {
		name: 'mine',
		path: 'mine',
		component: Mine,
		children: [{
			path: '*',
			redirect: { name: 'mine' }
		}]
	}, {
		path: '*',
		redirect: { name: 'popular' },
	}]
}, {
	name: 'detail',
	path: '/detail/:id',
	component: detail
}, {
	name: 'participation',
	path: '/participation/:id',
	component: participation
}
];

export default routes;
