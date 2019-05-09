const errorInfo = {
	0: 'sucess',
	1: {
		type: 'error',
		msg: 'Password cannot be shorter than 6 characters.'
	},
	2: {
		type: 'error',
		msg: 'Password cannot be longer than 14 characters.'
	},
	3: {
		type: 'error',
		msg: 'Password must contain at least one letter and one number.'
	}
};

function validator(password) {
	if (password.length < 6) {
		return 1;
	}

	if (password.length > 14) {
		return 2;
	}

	if (!/[a-z]/gi.test(password) || !/[0-9]/.test(password)) {
		return 3;
	}
}

export default {
	data() {
		return {
			isPsdReady: false,
			psdErrorInfo: null,
			password: '',
			passwordError: false
		};
	},
	methods: {
		validatorPsd(opt) {
			if (this.password.length > 0) {
				this.isPsdReady = true;
			} else {
				this.isPsdReady = false;
			}
		},
		checkPassword() {
			const testRet = validator(this.password);

			if (!testRet) {
				this.passwordError = false;
				this.psdErrorInfo = null;
				return true;
			}

			this.passwordError = true;
			this.psdErrorInfo = errorInfo[testRet];
			return false;
		}
	}
};
