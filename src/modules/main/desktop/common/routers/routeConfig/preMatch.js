// 不要删除这部分的内容！！！
// const Sports = () => import('components/eventDetail/index.vue');
// const eventList = () => import('components/eventList/eventList.vue');
// const preMatch = () => import('../../preMatch/index.vue');
// const demo = () => import('../../demo/index.vue');

import EventList from '../../../preMatch/pagelet/eventList/eventList.vue';
import EventDetail from '../../../preMatch/pagelet/eventDetail/eventDetail.vue';
// import demo from '../../../demo/index.vue';

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
			module: 'eventListToday'
		}
	},
	// eventList upcoming
	{
		path: '/sport/:sportName/upcoming/',
		name: 'eventListUpcoming',
		component: EventList,
		meta: {
			module: 'eventListUpcoming'
		}
	},
	// eventList (known categoryId & tournamentId)
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
	},
	// home
	{
		path: '/',
		name: 'home',
		meta: {
			name: 'Home',
		},
		component: EventList
	}
];

export default routes;
