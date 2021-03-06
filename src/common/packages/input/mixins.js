export default {
	data() {
		return { active: false, currentValue: this.value };
	},
	computed: {
		getWrapperClass() {
			const classList = ['m-input-wrapper'];
			const $slots = this.$slots;

			(this.size !== 'default') && classList.push(`m-input-wrapper--${this.size}`);
			($slots.prepend || $slots.append) && classList.push('m-input-group');
			$slots.append && classList.push('m-input-group--append');
			$slots.prepend && classList.push('m-input-group--prepend');
			this.disabled && classList.push('m-input-wrapper--disabled');
			this.error && classList.push('m-input-wrapper--error');
			this.active && classList.push('m-input-wrapper--active');
			return classList;
		},
		getPasteHanle() {
			return `return ${this.canPaste}`;
		}
	},
	methods: {
		// 输入时校验
		handlInput(event) {
			event.stopPropagation();
			let val = event.target.value;

			val && this.maxlength && val.length > this.maxlength && (val = val.slice(0, this.maxlength));
			this.$emit('input', val);
			this.currentValue = val;
			if (this.isReactValidate) {
				this.$emit('change', {
					value: val,
					finish: false
				}, event);
			}
		},

		// 失去焦点时校验
		handleBlur(event) {
			event.stopPropagation();
			this.validatorEvent && this.$emit('change', {
				value: event.target.value,
				finish: true
			}, event);

			this.active = false;
			this.$emit('blur', event);
		},

		handleFocus(event) {
			event.stopPropagation();
			this.active = true;
			this.$emit('focus', event);
		}
	},
	updated() {
		this.currentValue = this.value;
	},
	watch: {
		value(val) {
			this.currentValue = val;
		}
	}
};
