<template>

<div class="number-grow-warp">
    <span ref="numberGrow" class="number-grow">{{origin}}</span>
</div>

</template>

<script>

export default {
	props: {
		time: {
			type: Number,
			'default': 2
		},
		value: {
			type: [Number, String],
			'default': 0
		},
		origin: {
			type: [Number, String],
			'default': 0
		},
		showChg: {
			type: Boolean,
			'default': true
		},
		interval: {
			type: Number,
			'default': 10
		}
	},
	data() {
		return {
			t: null
		};
	},
	watch: {
		value(val) {
			if (this.t) {
				setInterval(this.t);
				this.t = null;
			}

			if (!this.showChg) {
				this.$refs.numberGrow.innerHTML = this.value.toFixed(2);
				return;
			}

			this.beginChg();
		},
		showChg(val) {
			if (val) {
				this.beginChg();
			} else {
				if (this.t) {
					setInterval(this.t);
					this.t = null;
				}
				this.$refs.numberGrow.innerHTML = this.value.toFixed(2);
			}
		}
	},
	methods: {
		numberGrow(ele) {
			const _this = this;
			const type = _this.value > _this.origin;

			let current = 0;
			let start = +_this.origin;
			const dis = Math.abs(_this.value - _this.origin);

			const step = dis / 50;

			_this.t = setInterval(() => {
				if (type) {
					start += step;
					if (start >= _this.value) {
						clearInterval(_this.t);
						start = +_this.value;
						_this.t = null;
					}
				} else {
					start -= step;
					if (start <= _this.value) {
						clearInterval(_this.t);
						start = +_this.value;
						_this.t = null;
					}
				}

				if (current.toFixed(2) === start.toFixed(2)) {
					return;
				}
				current = start;
				ele.innerHTML = current.toFixed(2);

				if (current === _this.value) {
					_this.$emit('chgNumDone');
				}
			}, _this.interval);
		},
		beginChg() {
			if (+this.origin !== +this.value) {
				this.$nextTick(() => {
					this.t && clearInterval(this.t);
					this.numberGrow(this.$refs.numberGrow);
				});
			}
		}
	},
	mounted() {
		if (!this.showChg) {
			this.$refs.numberGrow.innerHTML = (+this.value).toFixed(2);
			return;
		}

		this.beginChg();
	},
	destroy() {
		if (this.t) {
			setInterval(this.t);
			this.t = null;
		}
	}
};

</script>
<style lang="less">
@import 'base/styles/variable.less';

.number-grow-warp {
    transform: translateZ(0);
	display: table;
	display: flex;
	display: grid;

	grid-template-columns: 1fr;
	grid-template-rows: 1fr;
	align-items: center;
	align-content: flex-end;
	text-align: right;

	padding: 0 3/@rem;
	box-sizing: border-box;

	.number-grow {
		display: table-cell;
		vertical-align: middle;
		flex: 1;

		font-size: 16/@rem;
		line-height: 1;
		font-weight: bold;
		color: @white;
	}
}

</style>
