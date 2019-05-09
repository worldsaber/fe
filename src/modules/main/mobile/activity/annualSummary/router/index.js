import Vue from 'vue';
import VueRouter from 'vue-router';
import { supportsPushState } from 'utils';
import { baseUrlFix } from 'config/pageConfig';

import Entry from '../pages/entry.vue';
import Favorite from '../pages/favorite.vue';
import FirstWinningTime from '../pages/first-winning-time.vue';
import Games from '../pages/games.vue';
import NewCustomer from '../pages/new-customer.vue';
import PromotionGift from '../pages/promotion-gift.vue';
import Registration from '../pages/registration.vue';
import Share from '../pages/share.vue';
import StakeLocation from '../pages/stake-location.vue';
import WinningAmount from '../pages/winning-amount.vue';
import WinningRatio from '../pages/winning-ratio.vue';

Vue.use(VueRouter);

const routes = [{
	path: '/',
	name: 'entry',
	component: Entry,
}, {
	path: '/favorite',
	name: 'favorite',
	component: Favorite
}, {
	path: '/first-winning-time',
	name: 'first-winning-time',
	component: FirstWinningTime
}, {
	path: '/games',
	name: 'games',
	component: Games
},
{
	path: '/new-customer',
	name: 'new-customer',
	component: NewCustomer
}, {
	path: '/promotion-gift',
	name: 'promotion-gift',
	component: PromotionGift
}, {
	path: '/registration',
	name: 'registration',
	component: Registration
}, {
	path: '/share',
	name: 'share',
	component: Share
}, {
	path: '/stake-location',
	name: 'stake-location',
	component: StakeLocation
}, {
	path: '/winning-amount',
	name: 'winning-amount',
	component: WinningAmount
}, {
	path: '/winning-ratio',
	name: 'winning-ratio',
	component: WinningRatio
}];

const router = new VueRouter({
	routes,
	mode: supportsPushState ? 'history' : 'hash',
	base: `${baseUrlFix}/promotion/annual_summary`,
	// base: 'modules/main/mobile/activity/annualSummary/index.ftl',
});

export default router;
