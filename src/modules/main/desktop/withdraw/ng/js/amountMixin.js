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
			return !!this.amountError || false;
		}
	},
	methods: {
		// amount
		clearAmount() {
			this.amount = '';
			this.amountError = '';
		},
		checkAmount() {
			if (+this.amount === 0) {
				this.amount = '';
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
			}
		},
		created() {
			const wdInfo = this.wdInfo || {};

			this.amount = wdInfo.payAmount || '';
		}
	}
};
