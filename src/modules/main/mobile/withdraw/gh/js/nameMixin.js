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
			nameErr: '',
			isHistoryName: false
		};
	},
	computed: {
		...mapState('withdraw', [
			'bankHistory'
		]),
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
			this.nameErr = '';
		},
		bankHistory(val) {
			this.usingHistoryName();
		}
	},
	mounted() {
		this.usingHistoryName();
	}
};
