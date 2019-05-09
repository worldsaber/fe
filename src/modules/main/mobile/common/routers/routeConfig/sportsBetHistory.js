import { orderTypeMap } from 'config/order/orderType';

import orderNew from '../../../order/pagelet/orderNew.vue';
import ticketDetailNew from '../../../order/pagelet/ticketDetailNew.vue';
import betDetailNew from '../../../order/pagelet/betDetailNew.vue';

import order from '../../../order/pagelet/order.vue';
import ticketDetail from '../../../order/pagelet/ticketDetail.vue';
import matchTracker from '../../../order/pagelet/matchTacker.vue';

import betDetail from '../../../order/pagelet/betDetail.vue';

export const routes = [
	{
		path: 'bet_history/six_months_ago',
		name: 'sixMonthsAgo',
		component: orderNew
	},
	{
		path: 'bet_history/detail/:id',
		name: 'sportsDetail',
		component: ticketDetailNew
	},
	{
		path: 'bet_history/match_tracker',
		name: 'matchTraker',
		component: matchTracker
	},
	{
		path: 'bet_history/detail/:id/bet_detail',
		name: 'betDetail',
		component: betDetailNew
	},
	{
		path: 'bet_history',
		name: 'sports',
		meta: {
			name: orderTypeMap.sports,
			module: 'order'
		},
		component: orderNew
	}
];

export const fixRoutes = [
	{
		path: '/sport_bets/six_months_ago',
		name: 'sixMonthsAgo',
		component: order
	},
	{
		path: '/sport_bets/detail/:id',
		name: 'sportsDetail',
		component: ticketDetail
	},
	{
		path: '/sport_bets/match_tracker',
		name: 'matchTraker',
		component: matchTracker
	},
	{
		path: '/sport_bets/detail/:id/bet_detail',
		name: 'betDetail',
		component: betDetail
	},
	{
		path: '/sport_bets',
		name: 'sports',
		meta: {
			name: orderTypeMap.sports,
			module: 'order'
		},
		component: order
	}
];

export default routes;
