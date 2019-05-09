import offlineWithdrawList from '../../../withdraw/ng/pagelet/offline/list';
import Withdraw from '../../../withdraw/ng/pagelet/index.vue';

export const routes = [
	{
		path: '/request_list',
		name: 'list',
		component: offlineWithdrawList
	},
	{
		path: '/',
		name: 'withdraw',
		component: Withdraw
	}
];

export default routes;
