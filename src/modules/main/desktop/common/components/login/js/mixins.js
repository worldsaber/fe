import AfButton from 'packages/button/button.vue';
import 'packages/input';
import AfHeader from '../pagelet/titleBar.vue';

export default {
	components: {
		AfHeader,
		AfButton
	},
	props: {
		hasHeader: {
			type: Boolean,
			'default': true
		},
		loading: {
			type: Boolean,
			'default': false
		}
	}
};
