import {
	vCodeDesc
} from './config';

export default {
	data() {
		return {
			vCode: '',
			vCodeErr: '',
			vCodeDesc,
		};
	},
	methods: {
		clearVCode() {
			this.vCode = '';
		},
		showVCodeDesc() {
			this.$dialog({
				title: 'About Voucher Code',
				width: '85%',
				'class': 'm-dp-tips',
				content: this.vCodeDesc,
				button: ['OK']
			});
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
