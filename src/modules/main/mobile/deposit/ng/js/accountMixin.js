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
		}
	},
	watch: {
		bankAccNum(val) {
			this.bankAccNum = val.replace(/[^0-9]/g, '');
			this.accountErr = '';
		}
	}
};
