// 通过css3的translate实现滚动
import debounce from 'utils/debounce';

const isSupportTouch = 'ontouchend' in window;
const ease = {
	quadratic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
	circular: 'cubic-bezier(0.1, 0.57, 0.1, 1)',

	back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};
// 使用要求滚动元素的style是 navStyle，是一个object,滚动元素应该在refs中的引用为nav
/**
 *
 * @param {string} refName 提供的ref的名称
 * @param {string} childCls 滚动条的下拉元素的名称
 */
export default function (refName = 'nav', childCls = 'li') {
	return	{
		props: {
			bounceTime: {
				type: Number,
				'default': 500
			},
			// 每次选择是否自动剧中
			isCenter: {
				type: Boolean,
				'default': true
			}
		},
		mounted () {
			const ulEle = this.$refs[refName];
			this.tabClientWidth = ulEle.parentNode.clientWidth;
			ulEle.parentNode.style.overflow = 'hidden';
			this.$nextTick(() => {
				this.computedWidth();
			});
			// 总移动距离
			this.__moveX = 0;
			// 当前点击的点X
			this.__pointX = 0;
			// 当前点击的点Y
			this.__pointY = 0;
			// 标记一个开始
			this.__startX = 0;
			// 结束时间
			this.__endTime = 0;
			// 开始时间
			this.__startTime = 0;
			this.__resize = debounce(() => {
				this.computedWidth();
			}, 300);
			window.addEventListener('resize', this.__resize);
			if (isSupportTouch) {
				ulEle.addEventListener('touchstart', this.touchStart, false);
				ulEle.addEventListener('touchmove', this.touchMove, false);
				ulEle.addEventListener('touchend', this.touchEnd, false);
				ulEle.addEventListener('cancel', this.touchEnd, false);
			} else {
				ulEle.addEventListener('mousedown', this.touchStart, false);
				ulEle.addEventListener('mousemove', this.touchMove, false);
				window.addEventListener('mouseup', this.touchEnd, false);
			}
			ulEle.addEventListener('transitionend', this.transitionEnd, false);
			ulEle.addEventListener('webkitTransitionEnd', this.transitionEnd, false);
			ulEle.addEventListener('oTransitionEnd', this.transitionEnd, false);
			ulEle.addEventListener('MSTransitionEnd', this.transitionEnd, false);
			this.$on('computeWidth', this.computedWidth);
		},
		data () {
			return {
				tabClientWidth: 0,
				tabNavWidth: 0,
				navStyle: {
					transform: 'translate(0px,0px)',
					transitionDuration: '0s',
					transitionTimingFunction: ease.quadratic
				}
			};
		},
		computed: {
			maxScrollX () {
				return this.tabNavWidth - this.tabClientWidth;
			}
		},
		methods: {
			touchStart (e) {
				this.startTime = new Date();
				const point = e.touches ? e.touches[0] : e;
				// 有的时候组件已进入是隐藏的，计算出的高度是0，这个时候从新计算
				if (this.tabNavWidth === 0) {
					this.computedWidth();
				}
				this.__start = true;
				// 开始移动位置
				this.__pointX = point.pageX;
				this.__pointY = point.pageY;
				this.__startX = this.__moveX;
				this.__startTime = this.getTime();
				// 总共移动位置
				this.navStyle.transitionDuration = '0s';
			},
			touchMove (e) {
				if (!this.__start) {
					return;
				}
				const point = e.touches ? e.touches[0] : e;
				// e.preventDefault();
				// e.stopPropagation();
				// 取当前移动的位置
				const deltaX = point.pageX - this.__pointX;
				const deltaY = point.pageY - this.__pointY;
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					e.preventDefault();
				}
				const timestamp = this.getTime();
				let newX;
				// 刷新当前位置
				this.__pointX = point.pageX;
				this.__pointY = point.pageY;
				newX = this.__moveX + deltaX;
				if (timestamp - this.__endTime > 300 && Math.abs(newX) < 10) {
					return;
				}
				// 大于0在左边界,
				if (newX >= 0 || (-this.newX) >= (this.maxScrollX)) {
					// e.preventDefault();
					// e.stopPropagation();
					newX = this.__moveX + (deltaX / 3);
				}
				this.__moveX = newX;
				this.scrollTo(this.__moveX);
				if (timestamp - this.__startTime > 300) {
					this.__startTime = timestamp;
					this.__startX = this.__moveX;
				}
			},
			touchEnd (e) {
				this.__endTime = this.getTime();
				// 距离太小认为没有移动
				if (Math.abs(this.__moveX) < 1) {
					return;
				}
				// 边界处理
				if (!this.reSetPos()) {
					const duration = this.__endTime - this.__startTime;
					let newX = Math.round(this.__moveX);
					let time = 0;
					// 快速滑动处理
					if (duration < 300) {
						const momentumX = this.momentum(this.__moveX, this.__startX, duration, -this.maxScrollX, this.tabClientWidth);
						newX = momentumX.destination;
						time = momentumX.duration;
					}
					if (newX !== this.__moveX) {
						let easing;
						if (newX > 0 || (-newX) >= this.maxScrollX) {
							easing = ease.quadratic;
						}
						this.__moveX = newX;
						this.scrollTo(newX, 0, time, easing);
					}
				}
				this.__start = false;
			},
			momentum (current, start, time, lowerMargin, wrapperSize, deceleration = 0.0006) {
				// console.log(current, start, time, lowerMargin, wrapperSize);
				let distance = current - start,
					speed = Math.abs(distance) / time,
					destination,
					duration;
				destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
				duration = speed / deceleration;
				if (destination < lowerMargin) {
					destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
					distance = Math.abs(destination - current);
					duration = distance / speed;
				} else if (destination > 0) {
					destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
					distance = Math.abs(current) + destination;
					duration = distance / speed;
				}
				return {
					destination: Math.round(destination),
					duration
				};
			},
			transitionEnd () {
				this.reSetPos();
			},
			// 超出边界重置
			reSetPos () {
				let x = this.__moveX;
				if (this.__moveX > 0) {
					x = 0;
				} else if ((-this.__moveX) >= this.maxScrollX) {
					x = -this.maxScrollX;
				}
				if (x === this.__moveX) {
					return false;
				}
				this.__moveX = x;
				this.scrollTo(x, 0, this.bounceTime);
				return true;
			},
			// 滚动到制定位置 time不带默认值，
			scrollTo(x, y = 0, time = 0, easing = ease.circular) {
				// 如果用户直接调用这个方法，就需要同步移动距离
				if (this.__moveX !== x) {
					this.__moveX = x;
				}
				this.navStyle.transitionDuration = time + 'ms';
				this.navStyle.transitionTimingFunction = easing;
				this.navStyle.transform = `translate(${x}px,${y}px)  translateZ(0px)`;
			},
			computedWidth () {
				let tempWidth = 0;
				let current;

				this.tabClientWidth = (current = this.$refs[refName]) && (current = current.parentNode) && current.clientWidth || 0;
				this.liList = (current = this.$refs[refName]) && current.querySelectorAll(childCls) || [];
				for (let i = 0; i < this.liList.length; i++) {
					const { marginLeft = 0, marginRight = 0 } = window.getComputedStyle(this.liList[i]);
					tempWidth += this.liList[i].getBoundingClientRect().width + parseInt(marginLeft, 10) + parseInt(marginRight, 10);
				}
				this.tabNavWidth = Math.max(tempWidth, this.tabClientWidth);
				if (tempWidth > 0) {
					this.$refs[refName].style.width = tempWidth + 'px';
				}
			},
			getTime () {
				return Date.now() || function getTime () { return new Date().getTime(); };
			},
			destroyed () {
				const ulEle = this.$refs[refName];
				if (isSupportTouch) {
					ulEle.removeEventListener('touchstart', this.touchStart, false);
					ulEle.removeEventListener('touchmove', this.touchMove, false);
					ulEle.removeEventListener('touchend', this.touchEnd, false);
				} else {
					ulEle.removeEventListener('mousedown', this.mouseDown, false);
					ulEle.removeEventListener('mousemove', this.touchMove, false);
					window.removeEventListener('mouseup', this.mouseUp, false);
				}
				ulEle.removeEventListener('transitionend', this.transitionEnd, false);
				ulEle.removeEventListener('webkitTransitionEnd', this.transitionEnd, false);
				ulEle.removeEventListener('oTransitionEnd', this.transitionEnd, false);
				ulEle.removeEventListener('MSTransitionEnd', this.transitionEnd, false);
			}
		}
	};
}
