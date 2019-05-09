<template lang="html">

<div :class="getInputStyle">
	<div
		class="m-label"
		v-if="showLable"
	>{{focusLable}}</div>

	<div class="m-value">
		<div class="m-input-label" v-if="inputLable">{{inputLable}}</div>
		<input
			ref="input"
			type="input"
			class="m-input"
			:value="inData"
			:placeholder="getPlaceHolder"
			:disabled="disabled"
			:readonly="readonly"
			:maxlength="maxlength"
			:min="minlength"
			:onpaste="getPasteHanle"
			@input="handlInput"
			@focus="handleFocus"
			@blur="handleBlur" />
	</div>
	<i
		v-if="icon && inData"
		class="m-input-icon--clickable"
		@click="handleClear"
	></i>
</div>

</template>

<script>
export default {
	name: 'AfInputLabel',
	props: {
		value: {
			type: [String, Number],
			'default': ''
		},
		placeholder: {
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
		hasError: {
			type: Boolean,
			'default': false
		},
		clear: Function,
		focusTips: {
			type: String,
			'default': ''
		},
		showFocusTips: {
			type: Boolean,
			'default': false
		},
		canPaste: {
			type: Boolean,
			'default': true
		},
		icon: {
			type: String,
			'default': 'delete'
		},
		inputLable: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			inData: this.value,
			showFocusLable: false,
			focusLable: '',
			isActive: false,
			isError: false
		};
	},
	computed: {
		getPlaceHolder() {
			if (this.isActive) {
				return this.placeholder;
			}

			return this.focusLable;
		},
		getInputStyle() {
			const ret = ['m-fix-input'];

			this.isActive && (ret.push('m-fix-input--active'));
			this.isError && (ret.push('m-fix-input--error'));
			this.showLable && (ret.push('on'));
			return ret;
		},
		showLable() {
			return (this.isActive || this.inData) && this.showFocusLable;
		},
		getPasteHanle() {
			return `return ${this.canPaste}`;
		}
	},
	created() {
		if (this.showFocusTips && (this.placeholder || this.focusTips)) {
			this.showFocusLable = true;
		} else {
			this.showFocusLable = false;
		}

		if (this.showFocusLable) {
			this.focusLable = this.focusTips || this.placeholder;
		}
	},
	mounted() {
		this.$el.addEventListener('blur', event => {
			this.handleBlur(event);
		}, true);
	},
	beforeDestory() {
		this.$el.removeEventListener('blur', event => {
			this.handleBlur(event);
		}, true);
	},
	methods: {
		handlInput(event) {
			event.stopPropagation();
			let val = event.target.value;

			val && this.maxlength && val.length > this.maxlength && (val = val.slice(0, this.maxlength));
			this.inData = val;
			this.$emit('change', val);
			this.$emit('input', val);
		},
		handleFocus(event) {
			event.stopPropagation();
			this.isActive = true;
			this.$emit('focus');
		},
		handleBlur(event) {
			event.stopPropagation();
			this.isActive = false;
			this.$emit('blur');
		},
		handleClear(event) {
			const inputDom = this.$refs.input;
			inputDom && inputDom.focus();
			this.clear && this.clear();
		}
	},
	updated() {
		this.inData = this.value;
	},
	watch: {
		value(val, oldVal) {
			this.inData = val;
		},
		hasError(val, oldVal) {
			this.isError = val;
		}
	}
};

</script>

<style lang="less">

@import 'base/style/variable.less';
@import 'base/style/icon.less';
.m-fix-input {
	height: 40px;
	width: 200px;
	border: 1px solid @grayBorder;
	border-radius: 2px;
	padding: 0 35px 0 10px;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
	.m-label {
		height: 100%;
		width: 100%;
		transition: all 0.3s;
		color: @green;
	}
	.m-input-icon--clickable {
		height: 36px;
		line-height: 36px;
	    width: ~'calc(100% - 2px)';
	    margin: 1px;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 22;
		background: @white;
		width: 20px;
		text-align: left;
		color: @midGray;
		.m-icon-delete();
		cursor: pointer;
		&:hover {
			color: @darkGray;
		}
	}
	.m-value {
		height: 36px;
		width: 100%;
		display: table;
		display: flex;
		align-items: center;
	}

	.m-input-label {
		display: none;
	}

	.m-input {
		display: table-cell;
		vertical: middle;
		flex: 1;
		min-width: 1%;
		height: 36px;
		line-height: 36px;
		// fix： 页面缩放时，border渲染不完整问题
		margin-top: 1px;
		border: none;
		outline: none;
	}

	&.m-fix-input--active,
	&.on {
		padding: 4px 0 2px;
		box-sizing: border-box;

		.m-label {
			height: 12px;
			font-size: 11px;
			line-height: 12px;
			padding: 0 10px;
			box-sizing: border-box;
		}
		.m-value {
			height: 22px;
			padding-left: 10px;
			box-sizing: border-box;

			.m-input {
				padding-left: 0;
			}
		}

		.m-input {
			height: 22px;
			line-height: 22px;
			padding: 2px 10px;
			box-sizing: border-box;
			background: transparent;
		}

		.m-input-label {
			display: table-cell;
			vertical-align: middle;
			width: 38px;
			color: @darkGray;
			font-size: 14px;
			height: 20px;
    		line-height: 20px;
    		margin-top: 1px;
		}
	}

	&.m-fix-input--active {
		border-color: @green;

		.m-input-icon--clickable {
			&:hover {
				color: @green !important;
			}
			&:active {
				color: @lightGreen !important;
			}
		}

		.m-value {
			height: 22px;
		}
	}

	&.m-fix-input--error {
		border-color: @red;
		.m-input-icon--clickable {
			&:hover {
				color: @red;
			}
		}
	}
	&:not(.on) {
		.m-label {
			display: none;
		}
	}
}

</style>
