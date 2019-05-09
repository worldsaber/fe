import OpenBet from '../../../openBet/pagelet/openBet.vue';
import BetHistory from '../../../openBet/pagelet/betHistory.vue';
import sportsRoute from './sportsBetHistory.js';

export const routes = [
	{
		path: '/open_bets',
		name: 'openBet',
		meta: {
			tabName: 'openBet'
		},
		component: OpenBet
	},
	{
		path: '/open_bets',
		component: BetHistory,
		children: sportsRoute
	}
];

export default routes;
