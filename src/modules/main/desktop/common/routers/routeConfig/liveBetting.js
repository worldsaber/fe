// 不要删除这部分的内容！！！
// const Overview  = () => import('../../../liveBetting/pagelet/overview.vue');
// const EventView = () => import( '../../../liveBetting/pagelet/eventView.vue');
// const Schedule  = () => import('../../../liveBetting/pagelet/schedule.vue');

import Overview from '../../../liveBetting/pagelet/overview.vue';
import EventView from '../../../liveBetting/pagelet/eventView.vue';
import Schedule from '../../../liveBetting/pagelet/schedule.vue';

export const routes = [
	// schedule(default football)
	{
		path: '/sport/:sportName/live_schedule/',
		name: 'schedule',
		meta: {
			name: 'Schedule',
			module: 'schedule'
		},
		component: Schedule
	},
	// eventView (known eventId)
	{
		path: '/sport/:sportName/live/:categoryId/:tournamentId/:eventId/',
		name: 'eventView',
		meta: {
			name: 'Single View',
			module: 'eventDetail'
		},
		component: EventView
	},
	// eventView (unknown eventId)
	{
		path: '/sport/live/',
		name: 'eventViewDefault',
		meta: {
			name: 'Single View',
			module: 'eventDetail'
		},
		component: EventView
	},
	// overview
	{
		path: '/sport/:sportName/live_list/',
		name: 'overview',
		meta: {
			name: 'Multi View',
			module: 'overview'
		},
		component: Overview
	}
];

export default routes;
