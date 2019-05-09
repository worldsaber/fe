import List from '../../../shop/pagelet/list.vue';
import Detail from '../../../shop/pagelet/detail.vue';

const routes = [
	{
		path: '/cashgifts/:id',
		name: 'detail',
		component: Detail
	},
	{
		path: '/',
		name: 'list',
		component: List
	}
];

export default routes;
