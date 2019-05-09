<template>
	<div class="m-input-keyboard-wrapper">
		<slot name="wrapperBefore"></slot>
		<div class="m-input-wrapper">
			<slot name="inputBefore"></slot>
			<span :class="[
				'm-keybord-input',
				{
					'm-input--placeholder': value === '' || value === null && placeholder!== '',
					'm-input-focus': showKeyboard,
					'm-input-err': !!isErr,
					'm-input--disable': !!disable
				}
			]" @focus="showKey" tabindex="0" ref="keyboardInput">{{value ? value : placeholder}}</span>
			<slot name="inputAfter"></slot>
		</div>
		<div class="m-error-info" v-if="isErr !== 0">
			<p v-if="isErr === 2">Please enter a value less than {{max.toLocaleString()}}, </p>
			<p v-if="isErr === 2">as the toal stake cannot exceed {{max.toLocaleString()}}</p>
			<p v-if="isErr === 1">Please enter a value no less than {{min}}</p>
		</div>
		<Keyboard v-if="useDefaultKeyboard" @key="keyboardKey" @focus="keyboardFocus" @blur="keyboardBlur" ref="keyboard"/>
		<slot name="wrapperAfter"></slot>
	</div>
</template>
<script>
	import Keyboard from './keyboard.vue';

	export default {
		components: {
			Keyboard
		},
		props: {
			min: {
				'default': null,
				type: Number
			},
			max: {
				'default': null,
				type: Number
			},
			value: {
				'default': '',
				type: String
			},
			placeholder: {
				'default': '',
				type: String
			},
			// 整数最大输入位数（不算小数部分）
			length: {
				type: Number
			},
			disable: {
				type: Boolean,
				'default': false
			},
			// 小数精度，默认两位
			decimalLength: {
				type: Number,
				'default': 2
			}
		},
		data () {
			return {
				showKeyboard: false,
				useDefaultKeyboard: true,
				// 是否出错，大于用2，小于用1， 0表示合法
				isErr: 0
			};
		},
		watch: {
			value(val) {
				if (!this.showKeyboard && this.isErr) {
					this.$nextTick(() => {
						this.checkValue(val);
					});
				}
			}
		},
		destroyed () {
			if (this._mountKeyboardEle && this._keyboard) {
				const ele = this._keyboard.$el;
				this._keyboard.$destroy();
				this._mountKeyboardEle.removeChild(ele);
			}
		},
		created () {
			// 只校验最大值
			this.$on('input', val => {
				this.checkValue(val);
			});
			this.$on('blur', () => {
				const v = +this.value;
				if (this.value === '') {
					this.isErr = 0;
				} else if (this.min && v < this.min) {
					this.isErr = 1;
				} else if (this.max && v > this.max) {
					this.isErr = 2;
				} else {
					this.isErr = 0;
				}
			});
		},
		methods: {
			checkValue (val) {
				const v = +val;
				if (val === '') {
					this.isErr = 0;
				} else if (this.max && v > this.max) {
					this.isErr = 2;
				} else {
					this.isErr = 0;
				}
			},
			bindKeyboard(component) {
				if (component) {
					this.useDefaultKeyboard = false;
					this._keyboardComp = component;
					this._keyboardComp.$on('key', val => {
						this.keyboardKey(val);
					});

					this._keyboardComp.$on('focus', val => {
						this.keyboardFocus(val);
					});

					this._keyboardComp.$on('blur', (val, key) => {
						this.keyboardBlur(val, key);
					});
				}
			},
			keyboardKey (val) {
				let value = this.value;
				if (!value) {
					value = '';
				}
				if (val === 'delete') {
					if (value.length > 0) {
						value = value.slice(0, -1);
						this.$emit('input', String(value));
					}
				} else if (val === 'clear') {
					// 清除全部
					if (value.length > 0) {
						this.$emit('input', '');
					}
				} else if (val === 'done') {
					value = +value;
					if (value === 0) {
						value = '';
					}
					this.$emit('input', String(value), 'done');
					this.hideKey();
				} else {
					// 限制输入
					value += val;
					const { integerPart, decimalPart, pointCount } = this.parseValue(value);

					// 最多只能输入一个小数点
					if (pointCount > 1 && val === '.') {
						return;
					}
					// 不能超过指定位数的小数
					if (decimalPart.length > this.decimalLength) {
						return;
					}
					// 限制最大输入长度
					if (this.length && integerPart.length > this.length) {
						return;
					}

					this.$emit('input', String(value));
				}
			},
			keyboardFocus (val) {
				this.$emit('focus');
				this.showKeyboard = true;
			},
			keyboardBlur (val, key) {
				let value = +this.value;
				if (!value || value === '0') {
					value = '';
				}
				this.$emit('input', String(value));
				this.$emit('blur');
				this.showKeyboard = false;
			},
			showKey () {
				if (this.disable) {
					return;
				}

				const keyboard = this._keyboardComp ? this._keyboardComp : this.$refs.keyboard;
				// 显示键盘，并且将焦点给键盘
				if (keyboard) {
					keyboard.showKeyboard = true;
					this.$nextTick(() => keyboard.$el.focus());
				}
			},
			hideKey () {
				const keyboard = this._keyboardComp ? this._keyboardComp : this.$refs.keyboard;
				if (keyboard) {
					keyboard.$el.blur();
				}
			},
			parseValue(value) {
				const [integerPart = '', decimalPart = ''] = value.split('.');
				const length = integerPart.length + decimalPart.length;
				return {
					// 整数部分
					integerPart,
					// 小数部分
					decimalPart,
					// 小数点长度
					pointCount: value.length - length
				};
			}
		},
		beforeDestroy() {
			if (this._keyboardComp) {
				this.useDefaultKeyboard = true;

				this._keyboardComp.$off('key');
				this._keyboardComp.$off('focus');
				this._keyboardComp.$off('blur');

				delete this._keyboardComp;
			}
		}
	};
</script>

<style lang="less">
	@import '~base/styles/variable.less';
	.m-input-keyboard-wrapper{
		.m-input-wrapper{
			display: block;
		}
		.m-error-info{
			padding: 3/@rem 16/@rem;
			&>p{
				font-size: 10/@rem;
				color: @red;
				text-align: right;
			}
		}
		.m-keybord-input{
			position: relative;
			outline: none;
			background-color: @white;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			width: 90/@rem;
			border: 1px solid @darkGray;
			height: 28/@rem;
			line-height: 28/@rem;
			border-radius: 3/@rem;
			padding: 0 10/@rem;
			display: inline-block;
			color: @dark;
			text-align: right;
			&.m-input-focus{
				border-color: @green;
			}
			&.m-input--placeholder{
				color: @darkGray;
			}
			&.m-input-err{
				border-color: @red;
			}
			&.m-input--disable {
				border: @darkGray;
				background: @fogGrayBorder;
			}
		}
	}
</style>
