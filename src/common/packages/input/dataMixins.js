export default {
	props: {
		value: {
			type: [
				String, Number
			],
			'default': ''
		},
		size: {
			type: String,
			'default': 'default',
			validator(val) {
				return !!~['small', 'large', 'default'].indexOf(val);
			}
		},
		placeholder: {
			type: String,
			'default': ''
		},
		name: {
			type: String,
			'default': ''
		},
		disabled: {
			type: Boolean,
			'default': false
		},
		maxlength: Number,
		minlength: Number,
		readonly: {
			type: Boolean,
			'default': false
		},
		error: {
			type: Boolean,
			'default': false
		},
		isReactValidate: {
			type: Boolean,
			'default': true
		},
		canPaste: {
			type: Boolean,
			'default': true
		}
	}
};
