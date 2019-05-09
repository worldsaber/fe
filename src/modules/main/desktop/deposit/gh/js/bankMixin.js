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
			needVCode: false
		};
	},
	computed: {
		...mapState('deposit', [
			'reqLoading',
			'bankLoadError',
			'bankList'
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
