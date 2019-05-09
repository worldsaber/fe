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
		...mapState('withdraw', [
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
