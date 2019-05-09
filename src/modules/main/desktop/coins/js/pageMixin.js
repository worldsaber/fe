import {
	mapState,
	mapActions
} from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

export default {
	data() {
		return {
			pageLoading: false,
			pageError: false,
		};
	},
	computed: {
		...mapState('sportycoins', [
			'reqLoading',
			'errorInfo',
			'currentTab'
		]),
		showDefault() {
			const pageLoading = this.pageLoading || false,
				pageError = this.pageError || false;

			return pageError || pageLoading;
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.pageLoading && (this.pageLoading = false);
			}
		},
		errorInfo(val) {
			const { type = '' } = val || {};
			if (type === 'loadError' || type === 'login') {
				this.pageError = true;
				return;
			}

			this.pageError = false;
		},
		currentTab(val, oldVal) {
			this.$dialog();
			this.fetchData();
		}
	},
	methods: {
		...mapActions('sportycoins', [
			'getHistoryList',
			'getCoins'
		]),
		loadData() {
			if (this.pageLoading) {
				return;
			}

			this.fetchData();
		},
		fetchData() {
			this.pageError = false;
			this.pageLoading = true;

			const currentTab = this.currentTab;

			if (currentTab === 'coins') {
				this.getCoins();
			}

			if (currentTab === 'history') {
				this.getHistoryList();
			}
		}
	},
	created() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.loadData();
			}
		});

		this.fetchData();
	}
};
