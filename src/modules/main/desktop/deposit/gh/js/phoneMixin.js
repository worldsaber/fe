import {
	mapState
} from 'vuex';
import { cookie } from 'storage';
import {
	modifyPhone
} from './commonFun';

export default {
	data() {
		const phoneNo = cookie('phone');
		return {
			originPhoneNo: phoneNo,
			phoneNo: modifyPhone(phoneNo.trim()),
			phoneErr: '',
			countryCode: `+${window.countryCode || '233'}`,
			phonePlaceholder: '',
			phoneFocusTips: 'Mobile Number',
			isHistoryPhone: false
		};
	},
	computed: {
		...mapState('deposit', [
			'bankHistory'
		]),
		isPhoneErr() {
			return !!this.phoneErr;
		}
	},
	methods: {
		clearPhone() {
			this.phoneNo = '';
			this.isHistoryPhone = false;
		},
		chgPhone() {
			if (this.isHistoryPhone) {
				this.clearPhone();
			}
		},
		usingHistoryPhone() {
			// const bankHistory = this.bankHistory || {};
			// const { phoneNo = '' } = bankHistory;
			// const phoneNo = cookie('phone');
			// this.phoneNo = modifyPhone(phoneNo.trim());
			this.isHistoryPhone = false; // !!phoneNo;
		}
	},
	watch: {
		phoneNo(val) {
			val = val.replace(/\s/g, '');
			val = val.length >= 18 ? val.slice(0, 18) : val;

			this.phoneNo = val;
			this.phoneErr = '';
		},
		// bankHistory(val) {
		// 	this.usingHistoryPhone();
		// }
	},
	mounted() {
		// this.usingHistoryPhone();
	}
};
