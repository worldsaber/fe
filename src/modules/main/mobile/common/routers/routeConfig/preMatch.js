import EventList from '../../../preMatch/pagelet/eventList.vue';
import EventDetail from '../../../preMatch/detail';
import TournamentList from '../../../preMatch/pagelet/tournamentList.vue';

const routes = [
	// event detail
	{
		path: '/sport/:sportName/:categoryId/:tournamentId/:eventId/',
		name: 'eventDetail',
		component: EventDetail,
		meta: {
			module: 'eventDetail'
		}
	},
	// eventList today
	{
		path: '/sport/:sportName/today/',
		name: 'eventListToday',
		component: EventList,
		meta: {
			module: 'eventList'
		}
	},
	// euro list
	{
		path: '/sport/:sportName/tournamentlist/:tournamentId',
		name: 'tournamentList',
		component: TournamentList,
		meta: {
			module: 'tournamentList'
		}
	},
	// eventList (known categoryId & tournamentId)- 如果取到 query‘参数是noselect则不显示顶部的比赛选择
	{
		path: '/sport/:sportName/:categoryId/:tournamentId/',
		name: 'eventList',
		component: EventList,
		meta: {
			module: 'eventList'
		}
	},
	// eventList (default)
	{
		path: '/sport/:sportName/',
		name: 'eventListDefault',
		component: EventList,
		meta: {
			module: 'eventList'
		}
	}
];

export default routes;
