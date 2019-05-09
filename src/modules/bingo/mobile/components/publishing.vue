<template>
	<div class="bingo-publishing">
		Publishing <span class="bingo-publishing-time">{{time}}</span>
	</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import timer from '../js/timer.js';

export default {
	props: {
		timeout: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			time: '00:00',
			isOut: false,
		};
	},
	created() {
		timer.start();
		this.timeHandler = now => {
			const diff = this.timeout - now;
			if (diff > 0) {
				this.time = dateFormat.format(diff, 'mm:ss');
			} else if (!this.isOut) { // 仅一次out
				// 移除handle
				timer.removeHandler(this.timeHandler);
				this.$emit('timeout');
				this.isOut = true;
				this.time = '00:00';
			}
		};

		timer.addHandler(this.timeHandler);
	},
	destroyed() {
		timer.removeHandler(this.timeHandler);
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.bingo-publishing{
	border: 1px solid #0d9737;
	border-radius: 10/@rem;
	padding: 0 8/@rem;
	height: 20/@rem;
	line-height: 20/@rem;
	font-size: 12/@rem;
	color: #0d9737;
}
.bingo-publishing-time{
	font-weight: bold;
	font-size: 14/@rem;
}
</style>




