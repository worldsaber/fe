<template>
	<div class="m-buy-counts-wrap">
		<div class="m-buy-counts">
			<div class="m-counter">
				<a :class="['m-counter-btn', 'm-reduce-btn', {
					disabled: +value < 2
				}]" @click="reduce"></a>
				<div :class="['m-input', {
					'is-error': !!errInfo,
					focus: focus
				}]" @click="showKey">
					<div class="m-input-value" ref="valueWrap">
						<span class="center" ref="showValue">{{value}}</span>
					</div>
					<div class="m-label">{{value > 1 ? 'Shares': 'Share'}}</div>
				</div>
				<a class="m-counter-btn m-add-btn" @click="add"></a>
			</div>
			<a class="m-counter-btn m-all-left-btn" @click="getAllLeft">All Left</a>
		</div>
		<div class="m-error-info" v-show="!!errInfo">{{errInfo}}</div>

		<Keyboard @key="keyboardKey" @focus="keyboardFocus" @blur="keyboardBlur" ref="keyboard"/>
	</div>
</template>

<script>
import Keyboard from './keyboard.vue';

export default {
	name: 'BingoCounter',
	components: {
		Keyboard
	},
	props: {
		min: {
			'default': 1,
			type: Number
		},
		max: {
			'default': 0,
			type: Number
		},
		value: {
			'default': '1',
			type: String
		},
		maxLength: {
			'default': 0,
			type: Number
		}
	},
	data() {
		return {
			// errInfo: '',
			focus: false
		};
	},
	computed: {
		errInfo() {
			if (+this.value > this.max) {
				return `${this.max} share(s) left. Please reduce the amount of shares.`;
			}
			return '';
		}
	},
	watch: {
		value(val) {
			this.$nextTick(() => {
				const targetWidth = this.$refs.showValue.offsetWidth;
				const parentWidth = this.$refs.valueWrap.offsetWidth;
				const diff = targetWidth - parentWidth;
				if (diff > 0) {
					this.$refs.showValue.removeClass('center').addClass('right');
				} else {
					this.$refs.showValue.removeClass('right').addClass('center');
				}
			});
		}
	},
	methods: {
		reduce() {
			let value = this.value;
			if (+value > 1) {
				value--;
				this.$emit('input', String(value));
			}
		},
		add() {
			let value = this.value;
			value++;
			this.$emit('input', String(value));
		},
		getAllLeft() {
			let value = this.value;
			if (value !== this.max) {
				value = this.max;
				this.$emit('input', String(value));
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
				value += val;

				if (this.maxLength && value.length > this.maxLength) {
					return;
				}
				this.$emit('input', String(value));
			}
		},
		keyboardFocus () {
			this.focus = true;
		},
		keyboardBlur (val, key) {
			let value = +this.value;
			if (!value || value === '0') {
				value = '1';
			}
			this.focus = false;
			this.$emit('input', String(value));
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
@import 'base/styles/variable.less';

.m-buy-counts {
	margin-top: 14/@rem;
	padding: 0 16/@rem;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.m-counter-btn {
		display: block;
		height: 44/@rem;
		line-height: 44/@rem;
		border: 1px solid @green;
		border-radius: 2/@rem;
		box-sizing: border-box;
		color: @green;
		text-align: center;
		text-decoration: none;

		&:active, &:visited, &:hover {
			text-decoration: none;
		}

		&:active{
			background-color: @lightGray;
		}
	}

	.m-counter {
		width: 208/(360-32)*100%; // 63.41%
		flex: auto;
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.inner-bar() {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 17/@rem;
			height: 3/@rem;
			margin-left: -17/2/@rem;
			margin-top: -3/2/@rem;
			background: @green;
		}

		.m-reduce-btn,
		.m-add-btn {
			flex: none;
			display: block;
			width: 44/@rem;
			font-size: 17/@rem;
			position: relative;

			&:before {
				.inner-bar();
			}

			&.disabled {
				border-color: @lightGray;
				background: @fogGray;

				&:before, &:after {
					background: @darkGray;
				}
			}
		}

		.m-add-btn {
			&:after {
				.inner-bar();
				transform: rotate(90deg);
			}
		}


		.m-input {
			flex: auto;
			width: 112/@rem;
			height: 44/@rem;
			color: @darkGray;
			border: 1px solid @darkGray;
			border-radius: 2/@rem;
			box-sizing: border-box;
			padding: 4/@rem 0;
			margin: 0 4/@rem;
			color: @darker;
			text-align: center;

			&.is-error {
				border-color: @red;
			}

			&.focus {
				border-color: @green;
			}

			.m-input-value {
				font-size: 20/@rem;
				font-weight: bold;
				line-height: 24/@rem;
				height: 24/@rem;
				box-sizing: border-box;
				margin: 0 8/@rem;
				overflow: hidden;
				position: relative;

				span {
					display: inline-block;
					position: absolute;

					&.center {
						left: 50%;
						transform: translateX(-50%);
					}
					&.right {
						right: 0;
					}
				}
			}

			.m-label {
				font-size: 10/@rem;
				line-height: 1;
			}
		}
	}

	.m-all-left-btn {
		flex: none;
		width: 94/(360-32)*100%; // 28.66%
		margin-left: 26/(360-32)*100%; // 7.93%
		font-size: 14/@rem;
		font-weight: bold;
		text-align: center;
	}
}

.m-buy-counts-wrap {
	.m-error-info {
		padding: 3/@rem 16/@rem;
		font-size: 10/@rem;
		color: @red;
	}

	.m-keyboard{
		margin-top: 10/@rem;
	}
}

</style>
