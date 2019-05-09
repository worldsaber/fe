import { orderTypeMap } from 'config/order/orderType';

import jackpotOrder from '../../../order/pagelet/jackpotOrder.vue';
import jackpotDetail from '../../../order/pagelet/jackpotOrderDetail.vue';
import statistics from '../../../order/pagelet/statistics.vue';

export const routes = [
	{
		path: '/jackpot',
		name: 'jackpot',
		meta: {
			name: orderTypeMap.jackpot,
			module: 'jackpotOrder'
		},
		component: jackpotOrder
	},
	{
		path: '/jackpot/detail',
		name: 'jackpotDetail',
		component: jackpotDetail
	},
	{
		path: '/jackpot/detail/statistics',
		name: 'statistics',
		component: statistics
	}
];

export default routes;
