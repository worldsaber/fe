import {
	mapActions,
	mapState,
	mapGetters
} from 'vuex';
import defaultIcon from '../img/default-card.png';

export default {
	data() {
		return {
			channelShowName: 'MTN Mobile Money',
			channelSendName: 'mtn-gh',
			channelIconUrl: defaultIcon,
			showBankList: false,
			currentBankIndex: -1,
			bankProps: {
				iconUrl: 'channelIconUrl',
				title: 'channelShowName',
				desc: ''
			},
			fetchingBanks: false,
			needVCode: false
		};
	},
	computed: {
		...mapState('deposit', [
			'reqLoading',
			'bankLoadError',
			'bankList',
			'errorInfo',
			'bankHistory'
		]),
		...mapState('deposit', {
			supportBanks: 'bankList'
		}),
		...mapGetters('deposit', [
			'defaultCheckedBank'
		])
	},
	methods: {
		...mapActions('deposit', [
			'getBankList'
		]),
		getSupportBanks() {
			if (this.fetchingBanks) {
				return;
			}

			this.fetchingBanks = true;
			this.getBankList(true);
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.fetchingBanks = false;
			}
		},
		currentBankIndex(val) {
			const currentBank = this.supportBanks[val];

			if (!currentBank || !currentBank.channelSendName) {
				return;
			}

			this.channelShowName = currentBank.channelShowName;
			this.channelSendName = currentBank.channelSendName;
			this.channelIconUrl = currentBank.channelIconUrl ? currentBank.channelIconUrl : defaultIcon;

			this.showBankList = false;

			if (currentBank.channelShowName === 'Vodafone Cash') {
				this.needVCode = true;
			} else {
				this.needVCode = false;
			}
		},
		defaultCheckedBank(val) {
			if (~val) {
				this.currentBankIndex = val;
			}
		},
		errorInfo(val) {
			const { type = '' } = val || {};
			if (type === 'login' && this.showBankList) {
				this.showBankList = false;
			}
		},
		bankHistory(val) {
			if (~val) {
				this.currentBankIndex = this.defaultCheckedBank;
			}
		}
	},
	mounted() {
		const defaultCheckedBank = this.defaultCheckedBank;
		if (~defaultCheckedBank) {
			this.currentBankIndex = defaultCheckedBank;
		}
	}
};
