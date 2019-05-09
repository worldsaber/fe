<template>
	<div
		:class="[
			'm-bdcast',
			{
				'm-bdcast--vert': this.direction === 'vertical',
				'm-bdcast--horz': this.direction === 'horizon'
			}
		]"
		ref="container"
		:style="getStyle"
		@mouseover="handleMouseOver"
		@mouseleave="handleMouseleave"
		:id="getWrapperId"
	>
		<template v-for="(item, index) in tempList">
			<div
				:key="item.key || index"
				v-if="item.text && item.text.length"
				class="m-item"
			>
				<a v-if="item.link && item.link.length" :href="item.link">
					<span>{{item.text}}<span class="m-t-light">{{item.desc || 'View more >'}}</span></span>
				</a>

				<span v-else>{{item.text}}</span>
			</div>
		</template>
		<slot name="bdcastList"></slot>
		<div :id="fixDomId" v-show="showFix" class="m-item-fix"></div>
	</div>
</template>

<script>
let bdCount = 0;

export default {
	name: 'Broadcast',
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		config: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		const uId = bdCount++;
		return {
			length: '',
			distance: 0,
			cycle: 40000,
			direction: 'horizon',
			currentTime: 0,
			animateId: null,
			isStop: false,
			tempList: [],
			isSlot: false,
			showFix: false,
			getWrapperId: `j_bdcast${uId}`,
			fixDomId: `j_fixAnimation${uId}`,
			needSwipe: true,
			swipeCount: 0,
			fixLength: 0
		};
	},
	computed: {
		speed() {
			return this.length / this.cycle;
		},
		getStyle() {
			const direction = this.direction;

			return {
				transform: direction === 'horizon' ?
					`translateX(-${this.distance}px) translateZ(0)` :
					`translateY(-${this.distance}px) translateZ(0)`
			};
		}
	},
	watch: {
		list(val) {
			this.tempList = [];

			this.reset();

			this.$nextTick(() => {
				this.stop();
				this.initParams();
				this.fixDom();
				// this.length = this.getLength();
				this.start();
			});
		}
	},
	created() {
		this.initParams();
	},
	mounted() {
		const slot = this.$slots.bdcastList;
		if (slot) {
			this.isSlot = true;
		}

		this.fixDom();

		// this.length = this.getLength();
		this.start();
		this.$refs.container.parentNode.style.overflow = 'hidden';
	},
	methods: {
		initParams() {
			const list = this.list || [],
				config = this.config || {};

			list.length && (this.tempList = [...list]);
			this.currentTime = performance.now();
			this.distance = 0;
			this.cycle = config.cycle || 40000;
			this.direction = config.direction || 'horizon';
		},
		reset() {
			const wrapDom = document.querySelector(`#${this.getWrapperId}`),
				fixNode = wrapDom.querySelector(`#${this.fixDomId}`);
			fixNode.innerHTML = '';

			this.showFix = false;
			this.fixLength = 0;
			this.distance = 0;
		},
		fixDom() {
			const wrapDom = document.querySelector(`#${this.getWrapperId}`),
				direction = this.direction,
				parentOffset = this.calContainerOffset();

			this.swipeCount = 0;

			if (this.isSlot) {
				if (wrapDom) {
					const listWrapDom = wrapDom.children[0],
						len = listWrapDom.children && listWrapDom.children.length;

					this.swipeCount = len;

					// 单条数据不轮播
					if (this.swipeCount < 2 && direction === 'vertical') {
						this.needSwipe = false;
						return;
					}

					const tempFragment = document.createDocumentFragment();

					for (let i = 0; i < len; i++) {
						tempFragment.appendChild(listWrapDom.children[i].cloneNode(true));
					}

					wrapDom.replaceChild(tempFragment, listWrapDom);
				}
			} else {
				this.swipeCount = this.tempList.length;
			}

			// 单条数据不轮播
			if (this.swipeCount < 2 && direction === 'vertical') {
				this.needSwipe = false;
				return;
			}

			this.calSwipeOffset(parentOffset);
		},
		calSwipeOffset(parentOffset) {
			const wrapDom = document.querySelector(`#${this.getWrapperId}`),
				parentNode = this.$refs.container.parentNode,
				fixNode = wrapDom.querySelector(`#${this.fixDomId}`),
				tempSwipeCount = this.swipeCount,
				direction = this.direction;

			let fixTotalOffset = 0,
				k = 0,
				tempNode = wrapDom.children[k],
				isDouble = false,
				fixLength = 0;

			while (tempNode && k < tempSwipeCount) {
				const tempStyleObj = window.getComputedStyle(tempNode, null),
					temp = direction === 'horizon' ?
						parseInt(tempStyleObj.getPropertyValue('margin-left'), 10) +
							parseInt(tempStyleObj.getPropertyValue('margin-right'), 10) +
							tempNode.offsetWidth :
						parseInt(tempStyleObj.getPropertyValue('margin-top'), 10) +
							parseInt(tempStyleObj.getPropertyValue('margin-bottom'), 10) +
							tempNode.offsetHeight;

				if (isDouble) {
					fixLength += temp;
				}

				fixTotalOffset += temp;

				if (direction === 'vertical' && k === tempSwipeCount - 1) {
					parentNode.style.height = (fixTotalOffset - temp) + 'px';
					this.length = fixTotalOffset;
					this.showFix = true;
					return;
				}

				if (k === tempSwipeCount - 1 && fixTotalOffset < parentOffset && direction === 'horizon') {
					this.needSwipe = false;
					return;
				}

				if (fixTotalOffset >= parentOffset * 2 && direction === 'horizon') {
					this.fixLength = fixLength;
					this.length = fixTotalOffset;
					this.showFix = true;
					return;
				}

				fixNode && fixNode.appendChild(tempNode.cloneNode(true));

				++k;
				k %= tempSwipeCount;
				(k === 0) && (isDouble = true);
				tempNode = wrapDom.children[k];
			}
		},
		calContainerOffset() {
			const direction = this.direction,
				parentNode = this.$refs.container.parentNode,
				parentStyleObj = window.getComputedStyle(parentNode, null);

			if (direction === 'horizon') {
				return parentNode.offsetWidth - parseInt(parentStyleObj.getPropertyValue('padding-left'), 10) - parseInt(parentStyleObj.getPropertyValue('padding-right'), 10);
			}

			return parentNode.offsetHeight - parseInt(parentStyleObj.getPropertyValue('padding-top'), 10) - parseInt(parentStyleObj.getPropertyValue('padding-bottom'), 10);
		},
		start() {
			this.isStop = false;
			this.animateId = window.requestAnimationFrame(this.move);
		},
		stop() {
			const animateId = this.animateId;
			animateId && window.cancelAnimationFrame(animateId);
			this.isStop = true;
		},
		move(timestamp) {
			if (this.isStop || !this.needSwipe) {
				return;
			}

			const time = timestamp - this.currentTime;
			this.currentTime = timestamp;
			this.distance = this.distance + time * this.speed;
			if (this.distance < this.length) {
				window.requestAnimationFrame(this.move);
			} else {
				this.distance = this.fixLength;
				window.requestAnimationFrame(this.move);
			}
		},
		handleMouseOver() {
			this.stop();
		},
		handleMouseleave() {
			this.start();
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-bdcast {
	height: 100%;

	.m-item {
		font-size: 14px;
        line-height: 16px;
        color: @dark;

		> a:hover {
			text-decoration: none;
		}
	}

	.m-t-light {
		color: @lightGreen;
		font-size: 12px;
		line-height: 16px;
		margin-left: 6px;
	}
}

.m-bdcast--horz {
	white-space: nowrap;
	display: inline-block;
	vertical-align: middle;

	.m-item {
		display: inline-block;
		font-size: 14px;
        line-height: 14px;
	}

	.m-item-fix {
		display: inline-block;
	}
}

.m-bdcast--vert {
	width: 100%;

	.m-item {
		display: block;
		border: 1px solid @fogGrayBorder;
		margin: 5px;
	}
}
</style>
