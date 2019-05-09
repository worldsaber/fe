<template>
<div ref="container" class="m-picker-wrap">
  <div :style="'position: relative; overflow: hidden;'">
    <div class="mask left" v-show="showLeft" :style="`width:${extraX}px`" @click="setValue(value - 1, 500)"><i class="icon-arrow-left"/></div>
    <div class="mask right" v-show="showRight" :style="`width:${extraX}px`" @click="setValue(value + 1, 500)"><i class="icon-arrow-right"/></div>
    <ul class="m-picker-container" ref="pickers" :style="`width: ${wrapWidth}px; transition-property: transform; transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1); transition-duration: 0ms;`">
      <li :class="['m-picker-item', {'selected': value === index}]" v-for="(item, index) in data" :key="index">
		  <img class="item-image" :src="item.imageUrl">
		  <div v-if="value === index" class="selected-wrap"><i class="icon-selected"/></div>
	  </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
	name: 'Picker',
	props: {
		value: {
			type: Number,
			'default': 0
		},
		data: {
			type: Array,
			'default': () => []
		},
		height: {
			type: Number,
			'default': 36
		},
		visibleDeg: { // 可视范围最大旋转度数
			type: Number,
			'default': 60
		},
		rotate: { // 使用旋转效果
			type: Boolean,
			'default': false
		},
		base: {
			type: String,
			'default': 'px'
		}
	},
	data () {
		return {
			movedDistance: 0,
			width: 170,
			margin: 33,
			shadowWidth: 0,
			scale: 0.9,
			opacity: 0.4
		};
	},
	computed: {
		extraX () {
			return this.shadowWidth + this.margin;
		},
		singleX () {
			return this.width + this.margin;
		},
		wrapWidth () {
			return this.data.length * this.width + (this.data.length - 1) * this.margin;
		},
		minX () {
			return this.extraX - (this.data.length - 1) * this.singleX - 50;
		},
		maxX () {
			return this.extraX + 50;
		},
		showLeft () {
			return this.value !== 0;
		},
		showRight () {
			return this.value !== this.data.length - 1;
		}
	},
	created () {
	},
	mounted () {
		const scrollEl = this.$refs.pickers;
		const isSupportTouch = 'ontouchend' in window;

		this._startTime = 0;
		this._startY = 0;
		this._start = false;
		if (isSupportTouch) {
			scrollEl.addEventListener('touchstart', this.start, false);
			scrollEl.addEventListener('touchmove', this.move, false);
			scrollEl.addEventListener('touchend', this.end, false);
		} else {
			scrollEl.addEventListener('mousedown', this.start, false);
			scrollEl.addEventListener('mousemove', this.move, false);
			window.addEventListener('mouseup', this.end, false);
		}
		scrollEl.addEventListener('transitionend', this.transitionEnd, false);
		scrollEl.addEventListener('webkitTransitionEnd', this.transitionEnd, false);
		scrollEl.addEventListener('oTransitionEnd', this.transitionEnd, false);
		scrollEl.addEventListener('MSTransitionEnd', this.transitionEnd, false);

		this.shadowWidth = (document.body.offsetWidth - this.width - 2 * this.margin) / 2;
		this.translate(this.movedDistance);
		this.setValue(this.value);
	},
	watch: {
		value (val) {
			this.setValue(val);
		},
		data () {
			if (this.value < 0 || this.value > this.data.length - 1) {
				this.$nextTick(() => {
					this.setValue(this.value);
				});
				this.$emit('change', 0);
				this.$emit('input', 0);
				return;
			}
			this.$nextTick(() => {
				this.setValue(this.value);
			});
		}
	},
	methods: {
		setValue (val, time) {
			const distance = this.extraX - val * this.singleX;
			if (this.movedDistance !== distance) {
				if (val < 0 || val > this.data.length - 1) { // 无效value
					console.log('wrong value: ' + val);
				} else {
					console.log('dp watcher');
					this.movedDistance = distance;
					if (time) {
						this.transformTo(this.movedDistance, time);
					} else {
						this.translate(this.movedDistance);
					}
				}
			}
		},
		transitionEnd (e) {
			if (e.target === this.$refs.pickers && !this._start) {
				const index = Math.abs((this.movedDistance - this.extraX) / this.singleX);
				this.$emit('change', index);
				this.$emit('input', index);

				this.$refs.pickers.style.transitionDuration = '';
				[].forEach.call(this.$refs.pickers.children, (item, index) => {
					item.style.transitionDuration = '';
				});
			}
		},
		start (e) {
			const point = e.touches ? e.touches[0] : e;
			this._startX = point.pageX;
			this._startY = point.pageY;
			this._startTime = (new Date()).getTime();
			this._start = true;
			this._distance = 0;
			this._startDistance = this.movedDistance;
		},
		move (e) {
			const point = e.touches ? e.touches[0] : e;
			if (!this._start || Math.abs(point.pageX - this._startX) < Math.abs(point.pageY - this._startY)) {
				return;
			}
			e.preventDefault();
			this._distance = point.pageX - this._startX;
			const currentX = this._startDistance + this._distance;
			if (currentX < this.minX) {
				this.movedDistance = this.minX + (currentX - this.minX) / 5;
			} else if (currentX > this.maxX) {
				this.movedDistance = this.maxX + (currentX - this.maxX) / 5;
			} else {
				this.movedDistance = currentX;
			}
			this.translate(this.movedDistance);
		},
		end (e) {
			e.preventDefault();
			this._start = false; // 先处理惯性再确定位置

			const endTime = (new Date()).getTime();
			const timestamp = endTime - this._startTime;
			const distanceX = timestamp < 300 ? this.getDuration(this._distance, timestamp) + this.movedDistance : this.movedDistance;
			if (distanceX > this.extraX) {
				this.movedDistance = this.extraX;
				this.transformTo(this.movedDistance, 500);
			} else if (distanceX < this.extraX - this.singleX * (this.data.length - 1)) {
				this.movedDistance = this.extraX - this.singleX * (this.data.length - 1);
				this.transformTo(this.movedDistance, 500);
			} else {
				this.movedDistance = this.extraX + this.filterIndex((distanceX - this.extraX) / this.singleX) * this.singleX;
				this.transformTo(this.movedDistance, 500);
			}
		},

		translate (x) {
			const pickers = this.$refs.pickers;
			pickers.style.transform = `translate(${x}px, 0px) translateZ(0)`;

			for (let i = 0; i < pickers.children.length; i++) {
				let distance = Math.abs(this.extraX - i * this.singleX - x);
				distance = distance > this.singleX ? this.singleX : distance;
				pickers.children[i].style.transform = `scale(${1 - (1 - this.scale) * distance / this.singleX})`;
				pickers.children[i].style.opacity = 1 - (1 - this.opacity) * distance / this.singleX;
			}
		},

		transformTo (x, time = 0) {
			const pickers = this.$refs.pickers.children;
			const formatX = this.extraX + this.filterIndex((x - this.extraX) / this.singleX) * this.singleX;
			this.movedDistance = formatX;
			this.$refs.pickers.style.transitionDuration = time + 'ms';
			this.$refs.pickers.style.transform = 'translate(' + formatX + 'px, 0px) translateZ(0)';
			this.$refs.pickers.style.transitionTimingFunction = 'cubic-bezier(0.1, 0.57, 0.1, 1)';

			Array.prototype.forEach.call(pickers, (item, i) => {
				let distance = Math.abs(this.extraX - i * this.singleX - x);
				distance = distance > this.singleX ? this.singleX : distance;
				item.style.transform = `scale(${1 - (1 - this.scale) * distance / this.singleX})`;
				item.style.transitionDuration = time + 'ms';
				item.style.transitionTimingFunction = 'cubic-bezier(0.1, 0.57, 0.1, 1)';
				item.style.opacity = 1 - (1 - this.opacity) * distance / this.singleX;
			});
		},
		getDuration (y, time, acceleration = 0.0006) {
			const speed = y / time;
			const duration = (speed * speed) / (2 * acceleration) * (y > 0 ? 1 : -1);

			return duration;
		},
		filterIndex (index) {
			return (index - Math.floor(index)) > 0.5 ? Math.ceil(index) : Math.floor(index);
		}
	}
};
</script>

<style lang='less'>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-picker-wrap {
    position: relative;

    .mask {
		display: flex;
		align-items: center;
		justify-content: center;
        position: absolute;
        z-index: 100;
        background: transparent;
        // pointer-events: none;
        top: 0;
        height: 188px;
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
		.icon-arrow-left {
			margin: auto;
			.m-icon-back();
			&::before {
				color: @white;
				font-size: 36/@rem;
			}
		}
		.icon-arrow-right {
			margin: auto;
			.m-icon-arrow--right();
			&::before {
				color: @white;
				font-size: 36/@rem;
			}
		}
    }
    .m-picker-container {
        margin: 0;
        padding-right: 8/@rem;
        padding-bottom: 16/@rem;
        overflow: hidden;
        white-space: nowrap;
        .m-picker-item {
			position: relative;
            display: inline-block;
            vertical-align: middle;
            width: 170px;
            height: 180px;
            line-height: 180px;
            margin-right: 33px;
            list-style: none;
            text-align: center;
			.item-image {
				width: 100%;
				height: 100%;
			}
            &:last-child {
              margin-right: 0;
            }
			&.selected {
				border: solid 4/@rem @lightGreen;
				border-radius: 4/@rem;	
			}
			.selected-wrap {
				position: absolute;
				top: 0;
				left: 0;
				width: 22/@rem;
				height: 18/@rem;
				line-height: 18/@rem;
				background-color: @lightGreen;
				border-bottom-right-radius: 8/@rem;
				.icon-selected {
					color: #7b0911;
					.m-icon-success();
				}
			}
        }
    }
}
</style>
