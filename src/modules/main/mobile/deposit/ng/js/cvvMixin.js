import {
	modifyCvv
} from './commonFun.js';

export default {
	data() {
		return {
			cvv: '',
			cvvErr: ''
		};
	},
	methods: {
		clearCvv() {
			this.cvv = '';
		}
	},
	watch: {
		cvv(val) {
			this.cvv = modifyCvv(this.cvv);
			// this.cvvErr = validateCvv(this.cvv) || '';
			this.cvvErr = '';
		}
	}
};
