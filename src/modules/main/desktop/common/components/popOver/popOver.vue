<template lang="html">
  <!-- <transition name="fade"> -->
	  <div v-show="showPop" class="m-popOver-wrapper" :style="popStyle" :class="[calPopPos,cssList]">
		<div class="m-popOver">
			<slot>
				<div v-if="showTitle" class="m-popOver-title">{{showTitle}}</div>
				<div v-if="showContent" class="m-popOver-content">{{showContent}}</div>
			</slot>
		</div>
		<i v-if="showArrow" class="m-popOver-arrow" :class="calcArrowPos"></i>
	  </div>
  <!-- </transition> -->
</template>

<script>
export default {
	name: 'PopOver',
	props: {
		position: {
			type: String,
			'default': 'bottom',
			validator(val) {
				return ['top', 'left', 'right', 'bottom'].indexOf(val) !== -1;
			}
		},
		isCenter: {
			type: Boolean,
			'default': true
		},
		arrowCenter: {
			type: Boolean,
			'default': true
		},
		title: {
			type: String,
			'default': ''
		},
		content: {
			type: String,
			'default': ''
		},
		showArrow: {
			type: Boolean,
			'default': true
		},
		triggerType: {
			type: String,
			'default': 'hover',
			validator(val) {
				return ['click', 'hover', 'focus'].indexOf(val) !== -1;
			}
		},
		refParent: null,
		cssList: String,
		width: {
			type: [String, Number],
			'default': '100%',
			validator(val) {
				return /(%|px|rem|\S)$/.test(val);
			}
		}
	},
	data() {
		return {
			showPop: false,
			popStyle: {},
			hasInit: false,
			showContent: this.content || this.title,
			showTitle: this.content ? this.title : '',
			reference: this.refParent,
			timer: null
		};
	},
	computed: {
		calcArrowPos() {
			return [
				`m-popOver-arrow--${this.position}`,
				{
					'm-popOver-arrow--center': this.arrowCenter
				}
			];
		},
		calPopPos() {
			return [
				`m-popOver-wrapper--${this.position}`,
				{
					'm-popOver-wrapper--center': this.isCenter
				}
			];
		}
	},
	watch: {
		showPop(val) {
			if (this.hasInit) {
				return;
			}

			this.$nextTick(() => {
				this.calcPopDialogPos();
				this.hasInit = true;
			});
		}
	},
	methods: {
		init() {
			if (this.reference) {
				return;
			}

			const parentNode = this.$el.parentElement;
			if (!parentNode) {
				return;
			}

			if (parentNode.querySelectorAll('.m-popOver-wrapper').length > 1) {
				throw new Error('must containe only one popOver in an node!');
			}
			this.reference = parentNode;
		},
		show() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}

			this.timer = setTimeout(() => {
				this.showPop = true;
			}, 0);
		},
		hide() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}

			this.timer = setTimeout(() => {
				this.showPop = false;
			}, 60);
		},
		getTriggerType() {
			const reference = this.reference;

			if (!reference) {
				return;
			}

			if (this.triggerType === 'hover') {
				return {
					triggerType: 'mouseover',
					offType: 'mouseleave'
				};
			}

			if (this.triggerType === 'focus' &&
				reference.nodeName !== 'INPUT' &&
				reference.nodeName !== 'TEXTAREA') {
				return {
					triggerType: 'focus',
					offType: 'blur'
				};
			}

			return {
				triggerType: this.triggerType,
				offType: this.triggerType
			};
		},
		bind() {
			const reference = this.reference;

			if (!reference) {
				return;
			}

			const { triggerType, offType } = this.getTriggerType();

			if (triggerType && offType) {
				reference.addEventListener(triggerType, this.show, true);

				const offTarget = offType === 'click' ? document.body : reference;

				offTarget.addEventListener(offType, this.hide, true);
			}
		},
		unbind() {
			const reference = this.reference;

			const { triggerType, offType } = this.getTriggerType();

			reference.removeEventListener(triggerType, this.show, true);

			const offTarget = offType === 'click' ? document.body : reference;

			offTarget.removeEventListener(offType, this.hide, true);
		},
		calcPopDialogPos() {
			const bindRect = this.$el.getBoundingClientRect(),
				direction = this.position;
			let baseSize = bindRect.width;

			if (direction === 'bottom' || direction === 'top') {
				baseSize = bindRect.height;
			}

			if (this.showArrow) {
				baseSize += 15;
			} else {
				baseSize += 5;
			}

			this.popStyle = {
				[direction]: `${-baseSize}px`,
				'min-width': this.width
			};
		}
	},
	mounted() {
		this.init();
		const reference = this.reference;
		if (!reference) {
			return;
		}
		// 必须先设置width，因为如果width发生变化可能导致元素的重汇
		this.popStyle = {
			'min-width': this.width
		};
		const posType = window.getComputedStyle(reference, null).getPropertyValue('position');
		if (!['relative', 'position', 'fixed'].includes(posType)) {
			reference.style.position = 'relative';
		}

		this.bind();
	},
	beforeDestory() {
		this.unbind();
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-popOver-wrapper{
	position: absolute;
	border: 1px solid @fogGrayBorder;
	z-index: 2000;
	padding: 15px;
	border-radius: 2px;
	box-sizing: border-box;
	box-shadow: 0 0 5px 0 fadeout(@black, 80%);
	background: @white;

	&.m-popOver-wrapper--right,
	&.m-popOver-wrapper--left{
		&.m-popOver-wrapper--center {
			top: 50%;
			transform: translate3d(0,-50%,0);
		}
	}

	&.m-popOver-wrapper--bottom,
	&.m-popOver-wrapper--top{
		&.m-popOver-wrapper--center {
			left: 50%;
			transform: translate3d(-50%,0,0);
		}
	}

	.m-popOver-arrow{
		width: 12px;
		height: 12px;
		position: absolute;
		border: 1px solid @fogGrayBorder;
		background: @white;
		box-shadow: 0 2px 5px -1px fadeout(@black, 92%), 2px 0 5px -1px fadeout(@black, 92%);
		border-top-color: transparent;
		border-left-color: transparent;

		&.m-popOver-arrow--top {
			left: 10%;
			transform: rotate(45deg);
			bottom: -7px;
			margin-left: -6px;
			&.m-popOver-arrow--center {
				left: 50%;
				transform: translate3d(-50%,0,0) rotate(45deg);
			}
		}

		&.m-popOver-arrow--bottom {
			left: 10%;
			transform: rotate(-135deg);
			top: -7px;
			margin-left: -6px;

			&.m-popOver-arrow--center {
				left: 50%;
				transform: translate3d(-50%,0,0) rotate(-135deg);
			}
		}

		&.m-popOver-arrow--left {
			top: 10%;
			transform: rotate(-45deg);
			right: -7px;
			margin-top: -6px;

			&.m-popOver-arrow--center {
				top: 50%;
				transform: translate3d(0,-50%,0) rotate(-45deg);
			}
		}

		&.m-popOver-arrow--right {
			top: 10%;
			transform: rotate(135deg);
			left: -7px;
			margin-top: -6px;

			&.m-popOver-arrow--center {
				top: 50%;
				transform: translate3d(0,-50%,0) rotate(135deg);
			}
		}
	}

	.m-popOver-content{
		font-size: 13px;
		color: @darkGray;
		line-height: 1.1;
		white-space: nowrap;
	}

	.m-popOver-title{
		font-size: 16px;
		white-space: nowrap;
		color: @dark;
		text-align: center;
		padding: 5px 0;
		box-sizing: border-box;
		border-bottom: 1px solid @fogGrayBorder;

		& + .m-popOver-content{
			text-indent: 13px;
			margin-top: 10px;
		}
	}
}
@keyframes fadeIn {
  from {
	opacity: 0;
  }
  to {
	opacity: 1;
  }
}
@keyframes fadeOut {
  from {
	opacity: 1;
  }
  to {
	opacity: 0;
  }
}
.fade-enter-active,
.fade-leave-active{
  animation-duration: .5s;
  animation-fill-mode: both;
}
.fade-enter-active{
  animation-name: fadeIn;
}
.fade-leave-active{
  animation-name: fadeOut;
}
</style>
