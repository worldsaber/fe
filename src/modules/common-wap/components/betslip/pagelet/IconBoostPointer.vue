<template>
	<div :class="['i-icon-boost-pointer', 'i-boost-wrapper', {
		'on': playing
	}]">
		<div class="i-semicircle"></div>
		<div :class="['i-pointer', {
			'on': active,
			'off': !active,
			'start': start
		}]">
			<!-- 指针 -->
			<div class="icon-pointer">
				<svg viewBox="0 0 6 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="pointer-render" transform="translate(-12.000000, -1.000000)" fill="#F2AF00">
							<path d="M15,22 C16.6568542,22 18,20.6568542 18,19 C18,17.8954305 17,11.8954305 15,1 C13,11.8954305 12,17.8954305 12,19 C12,20.6568542 13.3431458,22 15,22 Z" id="Oval-2"></path>
						</g>
					</g>
				</svg>
			</div>
		</div>
	</div>
</template>

<script>
// 动画结束事件 兼容性事件名
const animationendEventList = ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd'];

export default {
	name: 'IconBoostPointer',
	props: {
		// 动画过渡状态
		playing: {
			type: Boolean,
			'default': false
		},
		start: {
			type: Boolean,
			'default': false
		},
		// 指针激活
		active: {
			type: Boolean,
			'default': false
		}
	},
	methods: {
		transitionEnd() {
			this.$emit('end');
		},
	},
	beforeDestroy() {
		const pointerDom = document.querySelector('.i-icon-boost-pointer .i-pointer');
		if (pointerDom) {
			animationendEventList.forEach(animationend => {
				pointerDom.removeEventListener(animationend, this.transitionEnd, false);
			});
		}
	},
	mounted () {
		const pointerDom = document.querySelector('.i-icon-boost-pointer .i-pointer');
		if (pointerDom) {
			animationendEventList.forEach(animationend => {
				pointerDom.addEventListener(animationend, this.transitionEnd, false);
			});
		}
	}
};
</script>


<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

@boostWrapperWidth: 20/@rem;  // 容器 witdh
@pointerWidth: 5/@rem; // 指针 width
@pointerHeight: 13/@rem; // 指针 height

.i-boost-wrapper {
	flex-shrink: 0;
	width: @boostWrapperWidth;
	position: relative;
	transform-origin: right center;

	&.on {
		.i-pointer {
			&.on {
				animation: slideOpen 1s cubic-bezier(.02,.73,.96,.68);
			}

			&.off {
				animation: slideClose 1s ease;
			}

			&.start {
				animation: slideTip 1.2s cubic-bezier(.05,.45,.84,.56) 0.32s;
			}
		}
	}
}

.i-semicircle {
	width: @boostWrapperWidth;
	height: 10/@rem;
	background: url(../image/semicircle.svg) no-repeat;
	background-size: contain;
	z-index: 1;
}

.i-pointer {
	width: @pointerWidth;
	height: @pointerHeight;
	position: absolute;
	bottom: -1/@rem;
	right: (@boostWrapperWidth - @pointerWidth)/2;
	z-index: 2;
	transform-origin: bottom center;

	.icon-pointer {
		display: block;
		position: absolute;
		width: @pointerWidth;
		height: @pointerHeight;
		z-index: 2;
		background: #1e0e53;

		svg {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
	}

	// 指针颜色过渡
	#pointer-render {
		transition: 1s ease;
	}

	&.on {
		transform: translateZ(0) rotate(16deg);
	}
	&.off {
		transform: translateZ(0) rotate(-45deg);

		#pointer-render {
			fill: #fff;
		}
	}
}

@keyframes slideOpen {
	0% {
		transform: translateZ(0) rotate(-45deg);
	}

	45% {
		transform: translateZ(0) rotate(50deg);
	}
	100% {
		transform: translateZ(0) rotate(16deg);
	}
}
@keyframes slideClose {
	0% {
		transform: translateZ(0) rotate(16deg);
	}
	100% {
		transform: translateZ(0) rotate(-45deg);
	}
}
@keyframes slideTip {
	0% {
		transform: translateZ(0) rotate(-45deg);
	}
	45% {
		transform: translateZ(0) rotate(50deg);
	}
	100% {
		transform: translateZ(0) rotate(-45deg);
	}
}
</style>
