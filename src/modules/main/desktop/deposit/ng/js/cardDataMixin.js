import { mapActions } from 'vuex';
import {
	validateCardUnion
} from './commonFun';

export default {
	computed: {
		submitStatus() {
			if (this.hasError) {
				return false;
			}

			const isHistoryCard = this.isHistoryCard || false;

			let validateRet = this.amount && !this.isAmountError;

			if (isHistoryCard) {
				validateRet = (this.cvvItem && !this.isCvvItemError) || validateRet;
			} else {
				validateRet = (this.cardNum && !this.isCardError) ||
					(this.subDate && !this.isDateError) ||
					(this.cvv && !this.isCvvError) ||
					validateRet;
			}

			return validateRet;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Top Up Now';
		},
		hasError() {
			const isHistoryCard = this.isHistoryCard || false;

			let validateRet = this.isAmountError;

			if (isHistoryCard) {
				validateRet = this.isCvvItemError || validateRet;
			} else {
				validateRet = this.isCardError || this.isDateError || this.isCvvError || validateRet;
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

			const isHistoryCard = this.isHistoryCard || false;
			let params = {
				amount: this.amount || ''
			};

			if (!isHistoryCard) {
				params = Object.assign(params, {
					card: this.cardNum || '',
					date: this.subDate || '',
					cvv: this.cvv || '',
					isNew: true
				});
			} else {
				params = Object.assign(params, {
					cvv: this.cvvItem || ''
				});
			}

			const validateRet = validateCardUnion(params);

			if (validateRet) {
				this.cardError = validateRet.cardRet || '';
				this.cvvError = !isHistoryCard && validateRet.cvvRet || '';
				this.cvvItemError = isHistoryCard && validateRet.cvvRet || '';
				this.dateError = validateRet.dateRet || '';
				this.amountError = validateRet.amountRet || '';
				return;
			}

			// request
			params = {
				payAmount: this.amount
			};
			if (isHistoryCard) {
				params = Object.assign(params, {
					bankAssetId: this.cardHistoryList[this.checkedIndex].id,
					cardCvv: this.cvvItem
				});
			} else {
				params = Object.assign(params, {
					cardExpDate: this.subDate,
					cardCvv: this.cvv,
					cardNum: this.cardNum
				});
			}

			// 防止enter健再次发送请求，input blur
			const InputDomArr = document.querySelectorAll('#j_ngCard .m-input');
			for (const inputItem of InputDomArr) {
				inputItem.blur();
			}

			this.loading = true;
			// 添加一个充值方式标识, 供统计用
			params.way = 'card';
			this.deposit(params);
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngCard').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngCard').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
