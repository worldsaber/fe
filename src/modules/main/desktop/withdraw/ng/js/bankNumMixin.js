import { mapState } from 'vuex';

export default {
	data() {
		return {
			bankNum: '',
			bankPlaceholder: '10 digits',
			bankFocusTips: 'Account Number',
			bankNumError: '',
		};
	},
	computed: {
		...mapState('withdraw', [
			'errorInfo'
		]),
		isBankNumError() {
			return !!this.bankNumError || false;
		}
	},
	methods: {
		// card
		clearBankNum() {
			this.bankNum = '';
			this.bankNumError = '';
		}
	},
	watch: {
		bankNum(val) {
			const temp = val.replace(/\D/g, '');
			this.bankNum = temp.length > 10 ? temp.slice(0, 10) : temp;
			this.bankNumError = '';
		},
		errorInfo(val) {
			if (val && val.isAccountError) {
				this.bankNumError = val.msg;
			}
		}
	}
};
