import {
	mapState
} from 'vuex';
import {
	formatNumber
} from 'utils';
import {
	validateAmount,
	modifyMoney
} from './commonFun';
import {
	wdMin
} from './config';

export default {
	data() {
		return {
			amount: '',
			amountErr: '',
			minAmountHolder: formatNumber(wdMin, 0),
		};
	},
	computed: {
		...mapState('assetsInfo', ['balance']),
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
				this.amountErr = validateAmount(this.amount, this.balance, false) || '';
			} else {
				this.amountErr = '';
			}
		}
	}
};
