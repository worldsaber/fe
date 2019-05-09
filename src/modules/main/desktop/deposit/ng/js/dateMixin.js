import {
	modifyDate,
	// validateDate,
	formatDate
} from './commonFun';

export default {
	data() {
		return {
			date: '',
			datePlaceholder: 'MM/YY',
			dateFocusTips: 'Expiry',
			dateError: '',
			subDate: ''
		};
	},
	computed: {
		isDateError() {
			return !!this.dateError || false;
		}
	},
	methods: {
		// date
		clearDate() {
			this.date = '';
			this.dateError = '';
		}
	},
	watch: {
		date(val) {
			const temp = val.replace(/\D/g, '');
			this.date = modifyDate(temp);
			this.subDate = formatDate(this.date);
			this.dateError = '';
			// this.dateError = validateDate(this.subDate) || '';
		}
	}
};
