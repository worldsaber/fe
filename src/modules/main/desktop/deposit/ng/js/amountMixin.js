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
			amountPlaceholder: `min.${despositMin}`,
			amountError: ''
		};
	},
	computed: {
		...mapState('deposit', [
			'dpInfo'
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
		}
	},
	watch: {
		amount(val) {
			let temp = val.replace(/[^0-9.]/g, '');

			temp = temp ? modifyMoney(temp) : temp;
			this.amount = temp;

			if (temp) {
				this.amountError = validateAmount(temp, false) || '';
			}
		}
	},
	created() {
		const dpInfo = this.dpInfo || {};

		this.amount = dpInfo.amount || '';
	}
};
