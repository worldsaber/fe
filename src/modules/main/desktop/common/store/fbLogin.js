import Vue from 'vue';
import Vuex from 'vuex';

import login from 'store/loginRegister/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		fbLogin: login
	}
});
