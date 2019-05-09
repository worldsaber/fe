export default {
	props: {
		account: {
			type: [String, Number],
			'default': ''
		},
		countryCode: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			isPhoneReady: false,
			phone: this.account,
			phoneError: false
		};
	},
	methods: {
		validatorPhone(opt) {
			const val = opt.value;
			this.phone = val.replace(/\s/g, '');
		},
		checkPhone(val) {
			if (val.length > 0) {
				this.isPhoneReady = true;
			} else {
				this.isPhoneReady = false;
			}
		}
	},
	watch: {
		phone(val) {
			this.checkPhone(val);
		},
		account(val) {
			this.phone = val;
		}
	},
	created() {
		this.checkPhone(this.phone);
	}
};
