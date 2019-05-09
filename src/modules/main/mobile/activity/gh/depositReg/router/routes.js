import TermsAndCondtions from '../pages/terms.vue';
import Home from '../pages/home.vue';
import Success from '../pages/success.vue';

export default [{
	name: 'terms',
	path: '/terms',
	component: TermsAndCondtions,
}, {
	name: 'success',
	path: '/success',
	component: Success,
}, {
	name: 'home',
	path: '/',
	component: Home
}];
