import {
	cvvTips
} from './config';
// import {
// 	validateCvv
// } from './commonFun';

export default {
	data() {
		return {
			cvv: '',
			cvvPlaceholder: '3 digits',
			cvvFocusTips: 'CVV',
			showFocusTips: true,
			cvvError: '',
			cvvTips
		};
	},
	computed: {
		isCvvError() {
			return !!this.cvvError || false;
		}
	},
	methods: {
		// cvv
		clearCvv() {
			this.cvv = '';
			this.cvvError = '';
		}
	},
	watch: {
		cvv(val) {
			const temp = val.replace(/[^0-9]/g, '');
			this.cvv = temp.length > 3 ? temp.slice(0, 3) : temp;
			this.cvvError = '';
			// this.cvvError = validateCvv(temp) || '';
		}
	}
};
