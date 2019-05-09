import { mapState } from 'vuex';

import {
	// modifyAmount,
	validateAmount
} from '../../../deposit/ng/js/commonFun.js';

export default {
	data() {
		return {
			amount: '',
			amountErr: '',
		};
	},
	computed: {
		...mapState('assetsInfo', ['balance']),
	},
	methods: {
		blurAmount() {
			// if (this.amountErr === '') {
			// 	this.amount = modifyAmount(this.amount, true);
			// }
		},
		clearAmount() {
			this.amount = '';
		}
	},
	watch: {
		amount(val) {
			this.amount = ('' + val).replace(/[^0-9.]/g, '');
			if (val !== '') {
				this.amountErr = validateAmount(this.amount, 'withdraw', true, false, this.balance) || '';
			} else {
				this.amountErr = '';
			}
		}
	}
};
