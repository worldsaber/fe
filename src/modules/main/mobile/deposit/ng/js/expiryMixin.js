import {
	modifyDate
} from './commonFun.js';

export default {
	data() {
		return {
			expiry: '',
			existExpiry: '', // 已存在卡的日期
			expiryErr: ''
		};
	},
	methods: {
		clearExpiry() {
			this.expiry = '';
			this.expiryErr = '';
		}
	},
	watch: {
		expiry(val) {
			this.expiry = modifyDate(this.expiry);
			// this.expiryErr = validateDate(this.expiry) || '';
			this.expiryErr = '';
		}
	}
};
