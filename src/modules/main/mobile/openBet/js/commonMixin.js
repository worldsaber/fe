import 'components/login/popupLogin';
import AdBanner from '../pagelet/adBanner.vue';

export default {
	components: {
		AdBanner
	},
	methods: {
		login() {
			this.$dialog();
			this.$popupLogin.show();
		}
	}
};
