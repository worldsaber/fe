import AfButton from 'packages/button/button.vue';
import 'packages/input';

export default {
	components: {
		AfButton
	},
	props: {
		loading: {
			type: Boolean,
			'default': false
		}
	}
};
