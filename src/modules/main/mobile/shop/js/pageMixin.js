import {
	mapState
} from 'vuex';

export default {
	data() {
		return {
			pageLoading: true,
			pageError: false
		};
	},
	computed: {
		...mapState('shop', [
			'reqLoading',
			'errorInfo'
		]),
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.pageLoading = false;
			}
		},
		errorInfo() {
			this.pageError = this.checkPageError();
		}
	},
	methods: {
		checkPageError() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.type === 'loadError' || errorInfo.type === 'goodsError';
		}
	},
	created() {
		this.pageError = this.checkPageError();
	}
};
