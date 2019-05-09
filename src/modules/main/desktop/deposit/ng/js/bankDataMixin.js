import { mapActions } from 'vuex';

import {
	validateBankUnion
} from './commonFun';

export default {
	computed: {
		submitStatus() {
			if (this.hasError) {
				return false;
			}

			const isHistoryBank = this.isHistoryBank || false;

			let validateRet = this.amount && !this.isAmountError;

			if (!isHistoryBank) {
				validateRet = this.bankCode && !this.isBankCodeError ||
					this.bankNum && !this.isBankNumError ||
					validateRet;
			}

			return validateRet;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Top Up Now';
		},
		hasError() {
			const isHistoryBank = this.isHistoryBank || false;

			let validateRet = this.isAmountError;

			if (!isHistoryBank) {
				validateRet = this.isBankCodeError ||
					this.isBankNumError ||
					validateRet;
			}

			return validateRet;
		}
	},
	methods: {
		...mapActions('deposit', [
			'deposit'
		]),
		submit() {
			if (this.loading) {
				return;
			}

			const isHistoryBank = this.isHistoryBank || false;
			let params = {
				amount: this.amount || ''
			};

			if (!isHistoryBank) {
				params = Object.assign(params, {
					bankNum: this.bankNum,
					bankCode: this.bankCode,
					isNew: true
				});
			} else {
				params = Object.assign(params, {
					bankCode: this.bankCode || ''
				});
			}

			const validateRet = validateBankUnion(params);

			if (validateRet) {
				this.bankNumError = validateRet.bankRet || '';
				this.bankCodeError = validateRet.bankCodeRet || '';
				this.amountError = validateRet.amountRet || '';
				return;
			}

			// request
			params = {
				payAmount: this.amount
			};
			if (isHistoryBank) {
				params = Object.assign(params, {
					bankAssetId: this.bankHistoryList[this.checkedIndex].id,
				});
			} else {
				params = Object.assign(params, {
					bankCode: this.bankCode,
					bankAccNum: this.bankNum
				});
			}

			// 防止enter健再次发送请求，input blur
			const InputDomArr = document.querySelectorAll('#j_ngBank .m-input');
			for (const inputItem of InputDomArr) {
				inputItem.blur();
			}

			this.loading = true;
			// 添加一个充值方式标识, 供统计用
			params.way = 'bank';
			this.deposit(params);
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngBank').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngBank').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
