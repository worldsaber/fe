import Overview from '../../../liveBetting/pagelet/overview.vue';
import EventView from '../../../liveBetting/pagelet/eventView.vue';
import Schedule from '../../../liveBetting/pagelet/schedule.vue';

export const routes = [
	// schedule(default soccer)
	{
		path: '/sport/:sportName/live_schedule',
		name: 'schedule',
		meta: {
			name: 'Schedule',
			module: 'schedule'
		},
		component: Schedule
	},
	// eventView (known eventId)
	{
		path: '/sport/:sportName/live/:categoryId/:tournamentId/:eventId',
		name: 'eventView',
		meta: {
			name: 'Event View',
			module: 'eventView'
		},
		component: EventView
	},
	// overview
	{
		path: '/sport/:sportName/live_list',
		name: 'overview',
		meta: {
			name: 'Overview',
			module: 'overview'
		},
		component: Overview
	}
];

export default routes;
