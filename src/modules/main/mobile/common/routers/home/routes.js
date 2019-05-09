import Home from '../../../index/index.vue';

const LoadCode = () => import('../../../loadCode/index.vue');

/*
	注意url: /share_win/xxxx

 */
const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/load_code',
		name: 'loadCode',
		component: LoadCode
	},
	{
		path: '/share_win/:id',
		name: 'shareWin',
		component: Home
	},
	{
		path: '*',
		component: Home
	}
];

export default routes;
