import index from '../../../transaction/pagelet/index.vue';
import search from '../../../transaction/pagelet/search.vue';

export const routes = [
	// 交易列表
	{
		path: '/',
		name: 'index',
		component: index
	},
	// 交易搜索
	{
		path: '/search',
		name: 'search',
		component: search
	}
];

export default routes;
