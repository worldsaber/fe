import Home from '../../../bingo/pages/home/index';
import Popular from '../../../bingo/pages/home/popular';
import Published from '../../../bingo/pages/home/published';

import Mine from '../../../bingo/pages/mine';
// import MineAll from '../../../bingo/pages/mine/all';
// import MineOngoing from '../../../bingo/pages/mine/ongoing';
// import MinePublished from '../../../bingo/pages/mine/published';

import detail from '../../../bingo/pages/detail/detail';
import participation from '../../../bingo/pages/participation/index';

const routes = [{
	path: '/',
	exact: true,
	redirect: { name: 'popular' },
}, {
	name: 'home',
	path: '/home',
	component: Home,
	children: [{
		path: '',
		redirect: { name: 'popular' },
	}, {
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
		component: Mine
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
