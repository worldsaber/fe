<template>
<div class="m-steps" :class="['is-' + direction, center ? 'is-center' : '']">
	<slot></slot>
</div>
</template>

<script>
export default {
	name: 'AfSteps',
	props: {
		space: [Number, String],
		active: Number,
		direction: {
			type: String,
			'default': 'horizontal'
		},
		alignCenter: Boolean,
		center: Boolean,
		finishStatus: {
			type: String,
			'default': 'finish'
		},
		processStatus: {
			type: String,
			'default': 'process'
		},

		// process 之间是否有间隙
		processPad: {
			type: Number,
			'default': 0
		},

		// 进度条是否占满
		showProcess: {
			type: Boolean,
			'default': false
		}
	},

	data() {
		return {
			steps: [],
		};
	},
	watch: {
		active(newVal, oldVal) {
			this.$emit('change', newVal, oldVal);
		},
		steps(steps) {
			steps.forEach((child, index) => {
				child.index = index;
			});
		}
	}
};
</script>
