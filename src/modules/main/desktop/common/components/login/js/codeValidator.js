export default {
	data() {
		return {
			isCodeReady: false,
			codeError: false,
			code: ''
		};
	},
	methods: {
		validatorCode(opt) {
			const val = opt.value,
				isFinish = opt.finish,
				codeReg = /^(\d){6}$/,
				tempVal = val.replace(/\D/g, '');
			this.code = tempVal.length > 6 ? tempVal.slice(0, 6) : tempVal;

			if (isFinish && !codeReg.test(this.code)) {
				this.codeError = true;
			} else {
				this.codeError = false;
			}

			if (codeReg.test(this.code)) {
				this.isCodeReady = true;
			} else {
				this.isCodeReady = false;
			}
		}
	}
};
