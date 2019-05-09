export default {
	data() {
		return {
			bankAccNum: '',
			bankAssetId: '',
			showAccountList: false,
			accountErr: '',
			existAccounts: [], // 已存在的银行账户列表
			existbankAccNum: '',
			usingExistAccount: false,
			currentAccountIndex: -1,
			accountProps: {
				iconUrl: 'bankIconUrl',
				title: 'formatAccountTitle',
				desc: ''
			}
		};
	},
	created() {
		this.getExistList();
	},
	methods: {
		clearAccount() {
			this.bankAccNum = '';
		},
		clearExistAccount(sil) {
			this.clearAccount();
			this.usingExistAccount = false;
			this.existbankAccNum = '';
			this.currentAccountIndex = -1;
			if (!sil) {
				this.$nextTick(() => {
					this.$refs.accountInput.$refs['transform-input'].focus();
				});
			}
		},
		getExistList() {
			fetch('/pocket/v1/wallet/bankAssets?type=2&action=2', {
				method: 'GET'
			}).then(res => {
				console.log();
				return res.json();
			}).then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const bizCode = res.bizCode;
				const data = res.data;
				if (bizCode === 10000) {
					this.existAccounts = data.accounts ? this.formatExistAccount(data.accounts) : [];

					this.supportBankDefer.then(() => {
						if (this.existAccounts[0]) {
							this.useExistAccount(this.existAccounts[0]);
							this.currentAccountIndex = 0;
						}
					});
				}
			});
		},
		formatExistAccount(accounts) {
			accounts.forEach(account => {
				account.formatAccountTitle = account.bankName + '  ' + account.accountNumber;
			});
			return accounts;
		}
	},
	watch: {
		bankAccNum(val) {
			this.bankAccNum = val.replace(/[^0-9]/g, '');
			this.accountErr = '';
		}
	}
};
