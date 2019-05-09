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
			bankProps: {
				iconUrl: 'bankIconUrl',
				title: 'bankName',
				desc: ''
			},
			fetchingBanks: false
		};
	},
	created() {
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
			this.fetchingBanks = true;
			return fetch('/pocket/v1/wallet/supportBanks', {
				method: 'GET',
				body: {
					action: 1
				}
			}).then(res => res.json()).then(res => {
				this.fetchingBanks = false;
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					this.supportBanks = data.entityList || [];
				}
			}).catch(e => {
				console.log(e);
				this.fetchingBanks = false;
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
