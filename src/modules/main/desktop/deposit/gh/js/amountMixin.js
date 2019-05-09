import { mapState } from 'vuex';

import { despositMin } from './config';
import {
	validateAmount,
	modifyMoney
} from './commonFun';

export default {
	data() {
		return {
			amount: '',
			amountPlaceholder: despositMin ? `min.${despositMin}` : '',
			amountError: ''
		};
	},
	computed: {
		...mapState('deposit', [
			'dpInfo'
		]),
		isAmountError() {
			return !!this.amountError;
		}
	},
	methods: {
		blurAmount() {
			if (+this.amount === 0) {
				this.amount = '';
				return;
			}

			const temp = +this.amount + '';
			if (temp !== this.amount) {
				this.amount = temp;
			}
		},
		clearAmount() {
			this.amount = '';
		}
	},
	watch: {
		amount(val) {
			const temp = val ? modifyMoney(val) : val;
			this.amount = temp;

			if (temp) {
				this.amountError = validateAmount(temp, false) || '';
			} else {
				this.amountError = '';
			}
		}
	},
	created() {
		const dpInfo = this.dpInfo || {};

		this.amount = dpInfo.amount || '';
	}
};
