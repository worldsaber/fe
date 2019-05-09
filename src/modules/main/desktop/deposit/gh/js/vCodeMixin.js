export default {
	data() {
		return {
			vCode: '',
			vCodeErr: '',
			vCodePlaceholder: '',
			vCodeFocusTips: 'Voucher Code',
			showVCTips: false
		};
	},
	computed: {
		isVCodeErr() {
			return !!this.vCodeErr;
		}
	},
	methods: {
		clearVCode() {
			this.vCode = '';
		},
		showVCodeTips() {
			this.showVCTips = true;
		},
		hideVCodeTips() {
			this.showVCTips = false;
		}
	},
	watch: {
		vCode(val) {
			val = val.replace(/\s/g, '');
			val = val.length > 18 ? val.slice(0, 18) : val;

			this.vCode = val;
			this.vCodeErr = '';
		}
	}
};
