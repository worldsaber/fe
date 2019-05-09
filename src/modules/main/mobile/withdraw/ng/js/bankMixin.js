export default {
	data() {
		return {
			bankCode: '',
			bankName: '',
			bankIconUrl: '',
			bankErr: '',
			supportBanks: [],
			showBankList: false,
			currentBankIndex: -1,
			supportBankTips: ' Access Bank, Citibank Nigeria, Diamond Bank, Ecobank Nigeria, Enterprise Bank, Fidelity Bank, First Bank of Nigeria, First City Monument Bank, Guaranty Trust Bank, Heritage Bank, Keystone Bank, MainStreet Bank, Skye Bank, Stanbic IBTC Bank, Standard Chartered Bank, Sterling Bank, Union Bank of Nigeria, United Bank For Africa, Unity Bank, Wema Bank, Zenith Bank, and etc.',
			bankProps: {
				iconUrl: 'bankIconUrl',
				title: 'bankName',
				desc: ''
			}
		};
	},
	created() {
		console.log('created bank');
		this.supportBankDefer = this.getSupportBanks();
	},
	methods: {
		clearBank() {
			this.bankCode = '';
			this.bankName = '';
			this.bankIconUrl = '';
			this.currentBankIndex = -1;
		},
		getSupportBanks() {
			return fetch('/pocket/v1/wallet/supportBanks', {
				method: 'GET',
				body: {
					action: 2
				}
			}).then(res => res.json()).then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					this.supportBanks = data.entityList || [];
					let bankStr = '';
					this.supportBanks.forEach((bank, i) => {
						if (i === this.supportBanks.length - 1) {
							bankStr += ` ${bank.bankName}.`;
						} else {
							bankStr += ` ${bank.bankName},`;
						}
					});
					this.supportBankTips = bankStr === '' ? this.supportBankTips : bankStr;
				}
			});
		}
	},
	computed: {
		localBanksMap() {
			const tmp = [];
			this.supportBanks.forEach(bank => {
				tmp.push(bank.bankName);
			});
			return tmp;
		}
	},
	watch: {
		bankCode() {
			this.bankErr = '';
			this.accountErr = '';
		}
	}
};
