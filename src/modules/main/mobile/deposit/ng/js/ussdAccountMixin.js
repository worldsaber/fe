export default {
	data() {
		return {
			ussdBankAccNum: '',
			ussdBankAssetId: '',
			showUssdAccountList: false,
			ussdAccountErr: '',
			existUssdAccounts: [], // 已存在的银行账户列表
			existUssdBankAccNum: '',
			usingExistUssdAccount: false,
			currentUssdAccountIndex: -1,
			ussdAccountProps: {
				iconUrl: 'bankIconUrl',
				title: 'formatAccountTitle',
				desc: 'formatPhoneNo'
			},
			ussdPhone: '',
			existUssdPhone: '',
			ussdPhoneErr: ''
		};
	},
	methods: {
		clearUssdAccount() {
			this.ussdBankAccNum = '';
		},
		clearUssdPhone() {
			this.ussdPhone = '';
		},
		clearExistUssdAccount(sil, type) {
			this.clearUssdAccount();
			this.usingExistUssdAccount = false;
			this.existUssdBankAccNum = '';
			this.currentUssdAccountIndex = -1;
			this.ussdPhone = '';
			this.existUssdPhone = '';
			if (!sil) {
				if (type === 'account') {
					this.$nextTick(() => {
						this.$refs.ussdAccountInput.$refs['transform-input'].focus();
					});
				}

				if (type === 'phone') {
					this.$nextTick(() => {
						this.$refs.ussdPhoneInput.$refs['transform-input'].focus();
					});
				}
			}
		},
		handleUssdPhoneFocus(event) {
			const target = event.target;

			if (!target) {
				return;
			}

			if (target.scrollIntoView) {
				target.scrollIntoView();
			} else {
				const winHeight = document.documentElement.clientHeight || document.body.clientHeight,
					scrollTop = window.scorllY || window.pageYOffset,
					targetRect = target.getBoundingClientRect(),
					distance = targetRect.top + targetRect.height;

				if (distance - scrollTop > winHeight) {
					window.scrollTo({
						top: distance - winHeight,
						behavior: 'smooth'
					});
				}
			}
		}
	},
	watch: {
		ussdBankAccNum(val) {
			this.ussdBankAccNum = val.replace(/[^0-9]/g, '');
			this.ussdAccountErr = '';
		},
		ussdPhone(val) {
			this.ussdPhone = val.replace(/[^0-9]/g, '');
			this.ussdPhoneErr = '';
		}
	}
};
