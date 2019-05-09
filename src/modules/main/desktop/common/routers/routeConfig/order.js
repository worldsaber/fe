import { orderTypeMap } from 'config/order/orderType';

import order from '../../../order/pagelet/order.vue';
import orderDetail from '../../../order/pagelet/orderDetail.vue';
import jackpotDetail from '../../../order/pagelet/jackpotDetail.vue';
import jackpotOrder from '../../../order/pagelet/jackpotOrder.vue';

export const routes = [
	// sport
	{
		path: '/sport_bets',
		name: 'sports',
		meta: {
			name: orderTypeMap.sports,
			module: 'order'
		},
		component: order
	},
	{
		path: '/sport_bets/detail/:id',
		name: 'sportsDetail',
		component: orderDetail
	},
	// jackpot
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
		path: '/jackpot/detail/:id/',
		name: 'jackpotDetail',
		component: jackpotDetail
	},
	// virtual
	{
		path: '/virtual',
		name: 'virtual',
		meta: {
			name: orderTypeMap.virtual,
			module: 'order'
		},
		component: order
	}
];

export default routes;
