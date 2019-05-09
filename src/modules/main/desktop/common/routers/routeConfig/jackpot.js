import GameMain from '../../../jackpot/pagelet/gameMain.vue';
import ResultMain from '../../../jackpot/pagelet/resultMain.vue';

export const routes = [
	// game
	{
		path: '/',
		name: 'betting',
		meta: {
			name: 'Sporty11',
			module: 'sporty11'
		},
		component: GameMain
	},
	// result
	{
		path: '/result/',
		name: 'result',
		meta: {
			name: 'Result',
			module: 'result'
		},
		component: ResultMain
	},
	// {
	// 	path: '/',
	// 	redirect: '/jackpot'
	// }
];

export default routes;
