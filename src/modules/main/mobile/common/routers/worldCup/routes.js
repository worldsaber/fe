import Home from '../../../activity/worldCup/pagelet/home.vue';
import History from '../../../activity/worldCup/pagelet/history.vue';
import MatchInfo from '../../../activity/worldCup/pagelet/match-info.vue';
import Terms from '../../../activity/worldCup/pagelet/terms.vue';
import Winners from '../../../activity/worldCup/pagelet/winner-info.vue';

const routes = [
	{
		path: '/history',
		name: 'history',
		component: History
	},
	{
		path: '/match',
		name: 'match',
		component: MatchInfo
	},
	{
		path: '/terms',
		name: 'terms',
		component: Terms
	},
	{
		path: '/winners',
		name: 'winners',
		component: Winners
	},
	{
		path: '/:id', // 分享后面跟的字段
		name: 'share',
		component: Home
	},
	{
		path: '/',
		name: 'home',
		component: Home
	}
];

export default routes;
