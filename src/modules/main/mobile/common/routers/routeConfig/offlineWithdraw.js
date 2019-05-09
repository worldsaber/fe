import offlineWithdrawList from '../../../withdraw/ng/pagelet/offline/list';
import offlineWithdrawDetail from '../../../withdraw/ng/pagelet/offline/detail';
import Withdraw from '../../../withdraw/ng/pagelet/index.vue';

export const routes = [
	{
		path: '/request_list',
		name: 'list',
		component: offlineWithdrawList
	},
	{
		path: '/request_list/details',
		name: 'detail',
		component: offlineWithdrawDetail
	},
	{
		path: '/',
		name: 'withdraw',
		component: Withdraw
	}
];

export default routes;
