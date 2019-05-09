import Gifts from '../../../gifts/index.vue';
import GiftsDesc from '../../../giftsDesc/index.vue';

const routes = [
	{
		path: '/how_to_use_gifts',
		name: 'giftsDesc',
		component: GiftsDesc
	},
	{
		path: '*',
		name: 'gifts',
		component: Gifts
	}
];

export default routes;
