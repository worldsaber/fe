<template lang="html">
	<div class="m-pop-dialog" slot="popContent">
		<ul class="m-pop-dialog__wrapper" :style="getContainerStyle">
			<slot></slot>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'slideAnimation',

	componentName: 'slideAnimation',

	props: {
		// 滑动的弹窗数量
		pageCount: {
			type: Number,
			required: true
		},
		// width: {
		// 	type: [String, Number],
		// 	default: '300px',
		// 	validator(value) {
		// 		return /^(\d)+(px|%|rem){0,1}$/.test(value);
		// 	}
		// },
		// height: {
		// 	type: [String, Number],
		// 	default: '300px',
		// 	validator(value) {
		// 		return /^(\d)+(px|%|rem){0,1}$/.test(value);
		// 	}
		// },
		// 点击滑动区域是否隐藏弹窗
		canBubble: {
			type: Boolean,
			'default': false
		},
		activeIndex: {
			type: Number,
			'default': 0
		}
	},
	data() {
		return {
			currentIndex: this.activeIndex
		};
	},
	computed: {
		// getContainerRect() {
		// 	return {
		// 		width: typeof this.width === 'string' ? this.width : this.width + 'px',
		// 		height: typeof this.height === 'string' ? this.height : this.height + 'px'
		// 	};
		// },
		getContainerStyle() {
			return {
				transform: `translate3d(${-this.currentIndex * 100}%,0,0)`
			};
		}
	},
	methods: {
		goPages(index, direction) {
			if (direction === 'next') {
				(index < this.pageCount) && (this.currentIndex = index);
			} else {
				(index >= 0) && (this.currentIndex = index);
			}
		}
	},
	watch: {
		activeIndex(val, oldVal) {
			if (oldVal > val) {
				this.goPages(val, 'prev');
			} else {
				this.goPages(val, 'next');
			}
		}
	}
};
</script>

<style lang="less">
.m-pop-dialog {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);
	overflow: hidden;

	.m-pop-dialog__wrapper{
		width: 100%;
		height: 100%;
		position: relative;
		transition: transform 600ms;
		transform: translate3d(0, 0, 0);
	}
}
</style>
