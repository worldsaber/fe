<template>
<div class="carousel slide" data-ride="carousel">
	 <!-- Wrapper for items -->
	<div class="carousel-inner" role="listbox">
		<slot></slot>
	</div>
	<!-- Indicators -->
	<ol class="carousel-indicators" v-show="indicators">
		<li v-for="i in indicator" :key = "i" @click="indicatorClick(i)" v-bind:class="{active:i === index}"></li>
	</ol>
	<!-- Controls  -->
	<span v-show="controls" class="left carousel-control" role="button" @click="go('prev')">&lt;</span>
	<span v-show="controls" class="right carousel-control" role="button" @click="go('next')">&gt;</span>
</div>
</template>

<script>
	export default {
		name: 'carousel',
		props: {
			indicators: {
				type: Boolean,
				'default': true
			},
			controls: {
				type: Boolean,
				'default': false
			},
			interval: {
				type: Number,
				'default': 5000
			}
		},
		data () {
			return {
				$items: [],
				indicator: [],
				isAnimating: false,
				index: 0,
				length: 0
			};
		},
		watch: {
			index (newVal, oldVal) {
				let direction = newVal > oldVal ? 'left' : 'right';
				direction = (oldVal === 0 && newVal + 1 === this.length) ? 'right' : direction;
				direction = (newVal === 0 && oldVal + 1 === this.length) ? 'left' : direction;
				this.slide(direction, newVal, oldVal);
			},
			indicator () {
			// 缓存dom
				this.$items = this.$children;
				this.length = this.indicator.length;
			}
		},
		methods: {
			slide (direction, next, prev) {
				// 切换item
				if (!this.$el && !this.length) { return false; }
				this.$next = this.$items[next];
				this.$prev = this.$items[prev];
				this.$prev.isActive = false;
				this.$next.isActive = true;
				// 如果支持动画监听
				if (this.transitionendKey) {
					this.$next.direction = this.$prev.direction = direction;
				} else {
					this.isAnimating = false;
				}
			},
			clearAnimation () {
				// 动画结束，清除动画相关配置
				if (this.isAnimating) {
					this.isAnimating = false;
					this.$next.direction = this.$prev.direction = '';
				}
			},
			go (direction = 'next') {
				// 重新计时
				this.toggleInterval(true);
				if (direction === 'next') {
					this.next();
				} else if (direction === 'prev') {
					this.prev();
				}
			},
			pause () {
				// 停止计算器
				this.toggleInterval(false);
			},
			indicatorClick (index) {
				if (this.isAnimating || this.index === index) return false;
				// 重新计时
				this.toggleInterval();
				this.isAnimating = true;
				this.index = index;
			},
			next () {
				if (!this.$el || this.isAnimating) { return false; }
				this.isAnimating = true;
				this.index = this.index + 1 < this.length ? this.index += 1 : this.index = 0;
			},
			prev () {
				if (!this.$el || this.isAnimating) { return false; }
				this.isAnimating = true;
				this.index = this.index === 0 ? this.index = this.length - 1 : this.index -= 1;
			},
			// 定时器
			// 参数：val true 	打开新计时器（有计时器则清除已有计算器，再开启一个新计时器）
			// 			false 关闭计时器
			//			不传	 没有计时器保持现状，有计时器则清除已有计算器，再开启一个新计时器。
			toggleInterval (val) {
				if (val === undefined) { val = this._intervalID; }
				if (this._intervalID) {
					clearInterval(this._intervalID);
					delete this._intervalID;
				}
				if (val && this.interval > 0) {
					this._intervalID = setInterval(this.next, this.interval);
				}
			},
			addEvent () {
				// 缓存dom
				this.$wrap = this.$el.querySelector('.carousel-inner');
				// 监听滑动相关事件
				this._startHandle = startHandle.bind(this);
				this._moveHandle = moveHandle.bind(this);
				this._endHandle = endHandle.bind(this);
				this.$wrap.addEventListener('touchstart', this._startHandle, true);
				this.$wrap.addEventListener('touchmove', this._moveHandle, true);
				this.$wrap.addEventListener('touchend', this._endHandle, true);
				this.$wrap.addEventListener('touchcancel', this._endHandle, true);
				// 监听鼠标相关事件
				this.$wrap.addEventListener('mouseenter', this.pause);
				this.$wrap.addEventListener('mouseleave', this.go);
				// 监听动画停止事件（冒泡)
				if ('webkitTransitionEnd' in document.documentElement || 'ontrawebkitTransitionEndnsitionend' in document.body || 'webkitTransitionEnd' in window) {
					this.transitionendKey = 'webkitTransitionEnd';
				} else if ('ontransitionend' in document.documentElement || 'ontransitionend' in document.body || 'ontransitionend' in window) {
					this.transitionendKey = 'transitionend';
				}
				this.$wrap.addEventListener(this.transitionendKey, this.clearAnimation);
				function startHandle (e) {
					this.pause();
					this.touchData = {
						start: {
							x: e.targetTouches[0].pageX,
							y: e.targetTouches[0].pageY
						}
					};
				}
				function moveHandle (e) {
					const endX = e.targetTouches[0].pageX;
					const endY = e.targetTouches[0].pageY;
					const deltaX = Math.abs(endX - this.touchData.start.x);
					const deltaY = Math.abs(endY - this.touchData.start.y);
					const direction = deltaX > deltaY ? 'x' : 'y';
					// 解决UC浏览器下水平滑动切换到上/下一个标签页的问题
					if (direction === 'x') {
						e.preventDefault();
					}
					this.touchData.delta = {
						x: deltaX,
						y: deltaY
					};
					this.touchData.end = {
						x: endX,
						y: endY
					};
					this.touchData.direction = direction;
				}
				function endHandle (e) {
					const data = this.touchData;
					const direction = data.direction;
					// 暂时只支持横向滚动
					if (direction === 'x') {
						data.delta[direction] > 50 && this[data.end[direction] < data.start[direction] ? 'next' : 'prev']();
					}
					this.toggleInterval(true);
				}
			},
			removeEvent () {
				this.$wrap.removeEventListener('touchstart', this._startHandle);
				this.$wrap.removeEventListener('touchmove', this._moveHandle);
				this.$wrap.removeEventListener('touchend', this._endHandle);
				this.$wrap.removeEventListener('touchcancel', this._endHandle);
				this.$wrap.removeEventListener('mouseenter', this.pause);
				this.$wrap.removeEventListener('mouseleave', this.go);
				this.$wrap.removeEventListener('webkitTransitionEnd', this.clearAnimation);
				this.$wrap.removeEventListener(this.transitionendKey, this.clearAnimation);
			}
		},
		mounted () {
			// 初始化轮播图片数量
			this.length = this.indicator.length;
			// 绑定事件
			this.addEvent();
			// 开启计时器
			this.toggleInterval(true);
		},
		beforeDestroy () {
			this.toggleInterval(false);
			this.removeEvent();
		}
	};
</script>

<style lang="less">
.carousel{
	position: relative;
	z-index: 5;
	.carousel-inner {
		position: relative;
		overflow: hidden;
		z-index: 6;
		width: 100%;
		height:100%;
		> .item {
			display: none;
			position: relative;
			width: 100%;
			height:100%;
			transition:.6s ease-in-out left;

			a,a:hover,a:active{
				display: block;
				width: 100%;
				height: 100%;
			}
			> img,
			> a > img {
				display: block;
				width: 100%;
				height: 100%;
				&[src=""]{
					visibility:hidden;
				}
			}
		}
		> .active,
		> .next,
		> .prev {
			display: block;
		}
		> .active {
			left: 0;
		}
		> .next,
		> .prev {
			position: absolute;
			top: 0;
			width: 100%;
		}
		> .next {
			left: 100%;
		}
		> .prev {
			left: -100%;
		}
		> .next.left,
		> .prev.right {
			left: 0;
		}
		> .active.left {
			left: -100%;
		}
		> .active.right {
			left: 100%;
		}
	}
	ol,li{
		list-style: none;
		padding:0;
		margin: 0;
	}
	.carousel-indicators{
		box-sizing: border-box;
		position: absolute;
		z-index: 7;
		left: 50%;
		bottom: 5%;
		width: 40%;
		padding-left:11/28rem;
		margin-left: -20%;
		text-align: center;
		li {
			box-sizing: border-box;
			display: inline-block;
			border-radius: 100%;
			height: 9/28rem;
			width: 9/28rem;
			min-height: 9px;
			min-width: 9px;
			border: 1px solid #E9CECE;
			background-color: #E9CECE;
			margin-right: 5px;
			&.active {
				border-color: #FF3F3F;
				background-color: #FF3F3F;
			}
		}
	}
	.carousel-control {
		position: absolute;
		z-index: 10;
		top: 0;
		height: 100%;
		width: 5%;
		font: bold 50px/10 'Microsoft Yahei', sans-serif;
		text-align: center;
		color: #ccc;
		.disabled{
			opacity: .3;
		}
		&:focus,&:hover {
			color: #fff;
		}
		&.left {
			left: 0;
		}
		&.right {
			right: 0;
		}
	}
}
</style>
