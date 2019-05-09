import { mapState, mapActions } from 'vuex';
// import {
// 	validateBankCode
// } from './commonFun';

export default {
	data() {
		return {
			checkedBankIndex: '',
			bankCodeError: '',
			showBankList: false,
			bankLoading: false
		};
	},
	computed: {
		...mapState('deposit', [
			'bankList',
			'bankLoadError'
		]),
		selectBank() {
			const bankList = this.bankList || [],
				checkedIndex = this.checkedBankIndex;
			if (checkedIndex !== '') {
				return bankList[checkedIndex].bankName;
			}

			return 'Please select a bank';
		},
		bankCode() {
			const bankList = this.bankList || [],
				checkedIndex = this.checkedBankIndex;
			if (checkedIndex !== '') {
				return bankList[checkedIndex].bankCode;
			}

			return '';
		},
		isBankCodeError() {
			return !!this.bankCodeError || false;
		},
		backIconUrl() {
			const bankList = this.bankList || [],
				checkedIndex = this.checkedBankIndex;
			if (checkedIndex !== '') {
				return bankList[checkedIndex].bankIconUrl;
			}

			return '';
		}
	},
	watch: {
		bankCode(val) {
			this.bankCodeError = '';
			// this.bankCodeError = validateBankCode(val) || '';
		},
		reqLoading(val) {
			if (!val) {
				this.bankLoading = false;
			}
		}
	},
	methods: {
		...mapActions('deposit', [
			'getBankList'
		]),
		reload() {
			this.bankLoading = true;
			this.getBankList(true);
		},
		changeBank(index) {
			this.checkedBankIndex = index;
		},
		toggleBankList() {
			this.showBankList = !this.showBankList;
		}
	},
	mounted() {
		document.body.addEventListener('click', () => {
			this.showBankList = false;
		});
	},
	beforeDestory() {
		document.body.removeEventListener('click');
	}
};
