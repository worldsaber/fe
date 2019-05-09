import {
	modifyCardNum,
	formatDateFromApi
} from './commonFun.js';

export default {
	data() {
		return {
			cardNum: '', // 真实card值
			showCardNum: '', // 手动输入的显示值
			existCardNum: '', // 选中的已存在卡号的显示值
			showCardList: false, // 控制已存在卡选择列表显示
			cardAssetId: '',
			existCards: [], // 已存在的卡列表
			cardErr: '',
			usingExistCard: false, // 当前卡是否已存在卡号
			cardBrandName: '', // 银行卡品牌名称
			cardIconUrl: '', // 银行卡品牌图标地址
			currentCardIndex: -1,
			cardProps: {
				iconUrl: 'cardBrandIconUrl',
				title: 'formatCardTitle',
				desc: 'formatCardExpiry'
			}
		};
	},
	created() {
		this.getExistList();
	},
	methods: {
		clearCard() {
			this.showCardNum = '';
		},
		getExistList() {
			fetch('/pocket/v1/wallet/bankAssets?type=0&action=1', {
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
					this.existCards = data.cards ? this.formatExistCard(data.cards) : [];
					this.existAccounts = data.accounts ? this.formatExistAccount(data.accounts) : [];
					this.existUssdAccounts = data.ussds ? this.formatExistUssdAccount(data.ussds) : [];

					Promise.all([this.supportBankDefer, this.supportUssdBankDefer]).then(() => {
						if (this.existCards[0]) {
							this.useExistCard(this.existCards[0]);
							this.currentCardIndex = 0;
						}

						if (this.existAccounts[0]) {
							this.useExistAccount(this.existAccounts[0]);
							this.currentAccountIndex = 0;
						}

						if (this.existUssdAccounts[0]) {
							this.useExistUssdAccount(this.existUssdAccounts[0]);
							this.currentUssdAccountIndex = 0;
						}
					});
				}
			});
		},
		formatExistCard(cards) {
			cards.forEach(card => {
				const name = card.cardBrand || '';
				card.formatCardTitle = name ? `${name}(${card.cardNumber})` : (card.cardNumber || '');
				card.formatCardExpiry = formatDateFromApi(card.cardExpDate);
			});
			return cards;
		},
		formatExistAccount(accounts) {
			accounts.forEach(account => {
				const name = account.bankName || '';
				account.formatAccountTitle = name ? `${name}(${account.accountNumber})` : (account.accountNumber || '');
			});
			return accounts;
		},
		formatExistUssdAccount(accounts) {
			accounts.forEach(account => {
				const name = account.bankName || '';
				account.formatAccountTitle = name ? `${name}(${account.accountNumber})` : (account.accountNumber || '');
				account.formatPhoneNo = `Phone ${account.phoneNo}`;
			});
			return accounts;
		}
	},
	watch: {
		showCardNum(val) {
			let temp = val.replace(/\D/g, '');
			this.cardNum = temp;
			// this.cardErr = validateCard(this.cardNum) || '';
			this.cardErr = '';
			temp && (temp = modifyCardNum(temp));
			this.showCardNum = temp;
		}
	}
};
