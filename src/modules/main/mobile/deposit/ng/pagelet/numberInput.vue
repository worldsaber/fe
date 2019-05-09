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
					'm-input-err': !!isErr
				}
			]" @focus="showKey" tabindex="0" ref="keyboardInput">{{value ? cyphertext : placeholder}}</span>
			<slot name="inputAfter"></slot>
		</div>
		<Keyboard @key="keyboardKey" @focus="keyboardFocus" @blur="keyboardBlur" ref="keyboard"/>
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
			length: {
				type: Number,
				'default': 0
			}
		},
		data () {
			return {
				showKeyboard: false,
				// 是否出错，大于用2，小于用1， 0表示合法
				isErr: 0,
			};
		},
		computed: {
			cyphertext() {
				return this.value.replace(/[0-9]/g, '*');
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
		},
		methods: {
			keyboardKey (val) {
				let value = this.value;
				if (!value) {
					value = '';
				}
				if (val === 'clear') {
					if (value.length > 0) {
						value = value.slice(0, -1);
						this.$emit('input', String(value));
					}
				} else if (val === 'done') {
					this.$emit('input', String(value), 'done');
					this.hideKey();
				} else {
					if (this.length && value.length >= this.length) {
						return;
					}
					value += val;
					this.$emit('input', String(value));
				}
			},
			keyboardFocus (val) {
				this.$emit('focus');
				this.showKeyboard = true;
			},
			keyboardBlur (val, key) {
				const value = this.value;
				// if (!value || value === '0') {
				// 	value = '';
				// }
				this.$emit('input', String(value));
				this.$emit('blur');
				this.showKeyboard = false;
			},
			showKey () {
				const keyboard = this.$refs.keyboard;
				// 显示键盘，并且将焦点给键盘
				if (keyboard) {
					keyboard.showKeyboard = true;
					this.$nextTick(() => keyboard.$el.focus());
				}
			},
			hideKey () {
				const keyboard = this.$refs.keyboard;
				if (keyboard) {
					keyboard.$el.blur();
				}
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
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			width: 90/@rem;
			border: 1px solid @darkGray;
			height: 28/@rem;
			line-height: 28/@rem;
			border-radius: 3/@rem;
			padding: 0 10/@rem;
			display: inline-block;
			color: @dark;
			text-align: left;
			&.m-input-focus{
				border-color: @green;
			}
			&.m-input--placeholder{
				color: @darkGray;
			}
			&.m-input-err{
				border-color: @red;
			}
		}
	}	
</style>
