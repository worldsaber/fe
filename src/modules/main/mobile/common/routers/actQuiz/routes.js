import Home from '../../../activity/issue/pagelet/home.vue';
import Rulers from '../../../activity/issue/pagelet/rulers.vue';
import Issue from '../../../activity/issue/pagelet/issue.vue';
import QuizOver from '../../../activity/issue/pagelet/quizOver.vue';
import NationRank from '../../../activity/issue/pagelet/nationRank.vue';
import extraLives from '../../../activity/issue/pagelet/extraLives.vue';

const routes = [
	{
		path: '/issue',
		name: 'issue',
		component: Issue
	},
	{
		path: '/rulers',
		name: 'rulers',
		component: Rulers
	},
	{
		path: '/quizOver',
		name: 'quizOver',
		component: QuizOver
	},
	{
		path: '/nationRank',
		name: 'nationRank',
		component: NationRank
	},
	{
		path: '/extraLive',
		name: 'extraLives',
		component: extraLives
	},
	{
		path: '/',
		name: 'home',
		component: Home
	}
];

export default routes;
