import index from '../../../sportyCoins/pagelet/index.vue';
import history from '../../../sportyCoins/pagelet/history.vue';
import transaction from '../../../sportyCoins/pagelet/transaction.vue';
import coinHelp from '../../../sportyCoins/pagelet/coinHelp.vue';
import stakeHelp from '../../../sportyCoins/pagelet/stakeHelp.vue';

export const routes = [
	{
		path: '/',
		name: 'index',
		component: index
	},
	{
		path: '/history',
		name: 'history',
		component: history
	},
	{
		path: '/transaction/:id',
		name: 'transaction',
		component: transaction
	},
	{
		path: '/coinhelp',
		name: 'coinHelp',
		component: coinHelp
	},
	{
		path: '/stakehelp',
		name: 'stakeHelp',
		component: stakeHelp
	}
];

export default routes;
