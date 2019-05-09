import { mapState } from 'vuex';

import { wdMin } from './config';
import {
	validateAmount,
	modifyMoney
} from './commonFun';

export default {
	data() {
		return {
			amount: '',
			// 1.3 改成根据后台配置显示最小值
			amountPlaceholder: wdMin ? `min.${wdMin}` : '',
			amountError: ''
		};
	},
	computed: {
		...mapState('withdraw', [
			'wdInfo'
		]),
		...mapState('userCenter', [
			'balance'
		]),
		isAmountError() {
			return !!this.amountError;
		}
	},
	methods: {
		// amount
		clearAmount() {
			this.amount = '';
		},
		checkAmount() {
			if (+this.amount === 0) {
				this.amount = '';
				return;
			}

			const temp = +this.amount + '';
			if (temp !== this.amount) {
				this.amount = temp;
			}
		}
	},
	watch: {
		amount(val) {
			let temp = val.replace(/[^0-9.]/g, '');

			temp = temp ? modifyMoney(temp) : temp;
			this.amount = temp;

			if (temp) {
				this.amountError = validateAmount(temp, this.balance, false) || '';
			} else {
				this.amountError = '';
			}
		},
		created() {
			const wdInfo = this.wdInfo || {};

			this.amount = wdInfo.payAmount || '';
		}
	}
};
