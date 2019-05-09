export default {
	data() {
		return {
			ussdBankCode: '',
			ussdBankName: '',
			ussdBankIconUrl: '',
			ussdBankErr: '',
			supportUssdBanks: [],
			showUssdBankList: false,
			currentUssdBankIndex: -1,
			ussdBankProps: {
				iconUrl: 'bankIconUrl',
				title: 'bankName',
				desc: ''
			},
			fetchingUssdBanks: false
		};
	},
	created() {
		this.supportUssdBankDefer = this.getSupportUssdBanks();
	},
	methods: {
		clearUssdBank() {
			this.ussdBankCode = '';
			this.ussdBankName = '';
			this.ussdBankIconUrl = '';
			this.currentUssdBankIndex = -1;
		},
		getSupportUssdBanks() {
			this.fetchingUssdBanks = true;
			return fetch('/pocket/v1/wallet/supportBanks', {
				method: 'GET',
				body: {
					action: 11
				}
			}).then(res => res.json()).then(res => {
				this.fetchingUssdBanks = false;
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					this.supportUssdBanks = data.entityList || [];
				}
			}).catch(e => {
				console.log(e);
				this.fetchingUssdBanks = false;
			});
		}
	},
	computed: {
		localUssdBanksMap() {
			const tmp = [];
			this.supportUssdBanks.forEach(bank => {
				tmp.push(bank.bankName);
			});
			return tmp;
		}
	},
	watch: {
		ussdBankCode() {
			this.ussdBankErr = '';
			this.ussdAccountErr = '';
			this.ussdPhoneErr = '';
		}
	}
};
