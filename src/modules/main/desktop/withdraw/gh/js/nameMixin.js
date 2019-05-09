import {
	mapState
} from 'vuex';
import {
	modifyName,
	formatName
} from './commonFun';

export default {
	data() {
		return {
			usrName: '',
			nameError: '',
			namePlaceholder: '',
			nameFocusTips: 'Mobile Owner Full Name',
			isHistoryName: false
		};
	},
	computed: {
		...mapState('withdraw', [
			'bankHistory'
		]),
		isNameError() {
			return !!this.nameError;
		}
	},
	methods: {
		clearUsrName() {
			this.usrName = '';
			this.isHistoryName = false;
		},
		chgName() {
			if (this.isHistoryName) {
				this.clearUsrName();
			}
		},
		usingHistoryName() {
			const bankHistory = this.bankHistory || {};
			const { name = '' } = bankHistory;
			this.usrName = formatName(name) || '';
			this.isHistoryName = !!name;
		}
	},
	watch: {
		usrName(val) {
			this.usrName = val ? modifyName(val) : '';
			this.nameError = '';
		},
		bankHistory(val) {
			this.usingHistoryName();
		}
	},
	mounted() {
		this.usingHistoryName();
	}
};
