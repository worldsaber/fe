import { mapState } from 'vuex';

export default {
	data() {
		return {
			pageLoading: false
		};
	},
	computed: {
		...mapState('openBet', [
			'reqLoading'
		]),
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.pageLoading = false;
			}
		}
	}
};
