import Vue from 'vue';
import store from 'store/loginRegister';
import dialog from 'components/dialog';
import App from './popLogin.vue';

export default function login(options) {
	const SubApp = Vue.extend(App).mixin({
		data () {
			return Object.assign({}, options);
		},
		store
	});

	return dialog({
		title: null,
		content: SubApp,
		button: []
	});
}
window.login = login;
window.v_store_login = store;

/*
login example
 */
// import './popLogin';
// login({ activeTab: 'Register', account: '123344556' });
