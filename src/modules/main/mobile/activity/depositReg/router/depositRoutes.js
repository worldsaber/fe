import TermsAndCondtions from '../pages/terms.vue';
import Deposit from '../pages/deposit.vue';
import Success from '../pages/success.vue';
import Paybill from '../pages/paybill.vue';
import Mpesa from '../pages/mpesa.vue';

export default [{
	name: 'terms',
	path: '/terms',
	component: TermsAndCondtions,
}, {
	name: 'success',
	path: '/success',
	component: Success,
}, {
	name: 'paybill',
	path: '/paybill',
	component: Paybill,
}, {
	name: 'mpesa',
	path: '/mpesa',
	component: Mpesa,
}, {
	name: 'home',
	path: '/',
	component: Deposit
}];
