<template>
	<div ref="count" class="count"></div>
</template>

<script>
import { formatNumber } from 'utils';

export default {
	props: {
		value: {
			type: Number,
			'default': 0
		},
		disabled: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			startTime: '',
			animateId: '',
			duration: 2000
		};
	},
	mounted() {
		const ele = this.$refs.count;
		ele.innerHTML = formatNumber(this.value, 2);
	},
	methods: {
		start(val, oldVal) {
			this.startTime = Date.now();
			const ele = this.$refs.count;
			if (this.disabled) {
				ele.innerHTML = formatNumber(val, 2);
				return;
			}
			const count = () => {
				this.animateId = requestAnimationFrame(ts => {
					let now,
						percent,
						value;
					if (window.supportRequestAF) {
						now = Date.now();
					} else {
						now = ts;
					}
					if (now - this.startTime < this.duration) {
						percent = this.timeFun(now - this.startTime, this.duration);
						value = (val - oldVal) * percent + oldVal;
						ele.innerHTML = formatNumber(value, 2);
						count();
					} else {
						cancelAnimationFrame(this.animateId);
						value = val;
						ele.innerHTML = formatNumber(value, 2);
					}
				});
			};
			count();
		},
		timeFun(ts, duration) {
			return Math.sin(ts / duration * Math.PI / 2);
		}
	},
	watch: {
		value (val, oldVal) {
			this.start(val, oldVal);
		}
	}
};
</script>

<style lang="less" scoped>
.count {
	display: inline-block;
	vertical-align: middle;
}
</style>
