<template>
<div class="m-step" :style="[style]" :class="['is-' + $parent.direction]">
	<div class="m-step__head" :class="['is-' + currentStatus, { 'is-text': !icon }]">
		<div class="m-step__line" :style="[processStyle]" :class="['is-' + $parent.direction]">
			<i class="m-step__line-inner" :style="lineStyle"></i>
		</div>

		<span class="m-step__icon">
		  <i v-if="showIcon" :class="['m-icon-' + showIcon]"></i>
		  <div v-else>{{ index + 1 }}</div>
	  </span>
	</div>
	<div class="m-step__main" :style="{ marginLeft: mainOffset }">
		<div class="m-step__title" ref="title" :class="['is-' + currentStatus]">
			<slot name="title">{{ title }}</slot>
		</div>
		<div class="m-step__description" :class="['is-' + currentStatus]">
			<slot name="description">{{ description }}</slot>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'AfStep',

	props: {
		title: String,
		icon: String,
		description: String,
		status: String,
		changeSuccessStatus: {
			type: Boolean,
			'default': true
		}
	},

	data() {
		return {
			index: -1,
			lineStyle:
			{},
			mainOffset: 0,
			internalStatus: ''
		};
	},
	beforeCreate() {
		this.$parent.steps.push(this);
	},

	beforeDestroy() {
		const steps = this.$parent.steps;
		const index = steps.indexOf(this);
		if (index >= 0) {
			steps.splice(index, 1);
		}
	},

	computed: {
		showIcon() {
			if (this.changeSuccessStatus && this.currentStatus === 'success') {
				return this.currentStatus;
			}

			return this.icon;
		},
		currentStatus() {
			return this.status || this.internalStatus;
		},
		isLast() {
			const parent = this.$parent;
			return parent.steps[parent.steps.length - 1] === this;
		},
		style() {
			const parent = this.$parent;
			const isCenter = parent.center;
			const len = parent.steps.length;

			if (isCenter && this.isLast) {
				return {};
			}

			const space = (typeof parent.space === 'number' ?
				parent.space + 'px' :
				parent.space ?
				parent.space :
				100 / (isCenter ? len - 1 : len) + '%');
			if (parent.direction === 'horizontal') {
				return {
					width: space
				};
			} else if (!this.isLast) {
				return {
					height: space
				};
			}
		},
		processStyle() {
			const parent = this.$parent;

			if (this.isLast) {
				return '';
			}

			if (parent.direction === 'horizontal') {
				return {
					margin: `0 ${parent.processPad}px`
				};
			} else if (!this.isLast) {
				return {
					margin: `${parent.processPad}px 0`
				};
			}
		}
	},

	methods: {
		updateStatus(val) {
			const prevChild = this.$parent.$children[this.index - 1];

			if (val > this.index) {
				this.internalStatus = this.$parent.finishStatus;
			} else if (val === this.index) {
				this.internalStatus = this.$parent.processStatus;
			} else {
				this.internalStatus = 'wait';
			}

			if (prevChild) prevChild.calcProgress(this.internalStatus);
		},

		calcProgress(status) {
			let step = 100;
			const style = {};

			style.transitionDelay = 150 * this.index + 'ms';
			if (status === this.$parent.processStatus && this.$parent.showProcess) {
				step = 50;
			} else if (status === 'wait') {
				step = 0;
				style.transitionDelay = (-150 * this.index) + 'ms';
			}

			style.borderWidth = step ? '1px' : 0;

			if (this.$parent.direction === 'vertical') {
				style.height = step + '%';
			} else {
				style.width = step + '%';
			}

			this.lineStyle = style;
		}
	},

	mounted() {
		const parent = this.$parent;

		if (parent.direction === 'horizontal') {
			if (parent.alignCenter) {
				this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
			}
		}

		const unwatch = this.$watch('index', val => {
			this.$watch('$parent.active', this.updateStatus, {
				immediate: true
			});
			unwatch();
		});
	}
};
</script>
