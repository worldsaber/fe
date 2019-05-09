import {
	formatNumber
} from 'utils';
import {
	validateAmount,
	modifyMoney
} from './commonFun';
import {
	despositMin
} from './config';

export default {
	data() {
		return {
			amount: '',
			amountErr: '',
			minAmountHolder: formatNumber(despositMin, 0),
		};
	},
	created() {
		// amount
		try {
			let amount = URL.getPara(location.href, 'amount');
			amount = parseInt(amount, 10);
			if (amount) {
				this.amount = amount;
			}
		} catch (err) {
			console.log(err);
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
			this.amount = val ? modifyMoney(val) : '';
			if (val !== '') {
				this.amountErr = validateAmount(this.amount, false) || '';
			} else {
				this.amountErr = '';
			}
		}
	}
};
