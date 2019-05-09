import {
	modifyCardNum,
	// validateCard
} from './commonFun';

export default {
	data() {
		return {
			cardNum: '',
			showCardNum: '',
			cardPlaceholder: 'Visa, Mastercard, Verve',
			cardFocusTips: 'Card Number',
			cardError: '',
		};
	},
	computed: {
		isCardError() {
			return !!this.cardError || false;
		}
	},
	methods: {
		// card
		clearCard() {
			this.showCardNum = '';
			this.cardError = '';
		}
	},
	watch: {
		showCardNum(val) {
			let temp = val.replace(/\D/g, '');
			this.cardNum = temp;
			this.cardError = '';
			// this.cardError = validateCard(temp) || '';

			temp && (temp = modifyCardNum(temp, 0));
			this.showCardNum = temp;
		}
	}
};
