import {
	mapActions,
	mapState,
	mapGetters
} from 'vuex';
import defaultIcon from 'images/bankIcon.png';

export default {
	data() {
		return {
			channelShowName: 'MTN Mobile Money',
			channelSendName: 'mtn-gh',
			channelIconUrl: defaultIcon,
			showBankList: false,
			currentBankIndex: -1,
			fetchingBanks: false,
		};
	},
	computed: {
		...mapState('withdraw', [
			'reqLoading',
			'bankLoadError',
			'bankList'
		]),
		...mapState('withdraw', {
			supportBanks: 'bankList'
		}),
		...mapGetters('withdraw', [
			'defaultCheckedBank'
		])
	},
	methods: {
		...mapActions('withdraw', [
			'getBankList'
		]),
		reload() {
			this.fetchingBanks = true;
			this.getBankList(true);
		},
		changeBank(index) {
			this.currentBankIndex = index;
		},
		toggleBankList() {
			this.showBankList = !this.showBankList;
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
		},
		defaultCheckedBank(val) {
			if (~val) {
				this.currentBankIndex = val;
			}
		}
	},
	mounted() {
		document.body.addEventListener('click', () => {
			this.showBankList = false;
		});

		const defaultCheckedBank = this.defaultCheckedBank;
		if (~defaultCheckedBank) {
			this.currentBankIndex = defaultCheckedBank;
		}
	},
	beforeDestory() {
		document.body.removeEventListener('click');
	}
};
