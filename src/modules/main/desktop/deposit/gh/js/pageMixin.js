import {
	mapState
} from 'vuex';

export default {
	data() {
		return {
			loading: false
		};
	},
	computed: {
		...mapState('deposit', [
			'reqLoading'
		]),
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.loading = false;
			}
		}
	},
};
