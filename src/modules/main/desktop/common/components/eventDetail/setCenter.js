// 设置一个元素剧中，依赖 translateScroll
export default {
	props: {
		// 每次选择是否自动剧中
		isCenter: {
			type: Boolean,
			'default': true
		}
	},
	mounted () {
		// 找到当前点击元素的对象
		this.$on('changeItem', item => {
			window.setTimeout(() => {
				if (this.isCenter) {
					this.center(item);
				}
			});
		});
	},
	methods: {
		// 设置 中心位置
		center (item) {
			let left = 0;
			let el;
			const child = this.getChild();
			for (let i = 0, l = child.length; i < l; i++) {
				if (child[i] === item) {
					el = child[i].$el;
					break;
				} else {
					left += child[i].$el.getBoundingClientRect().width;
				}
			}
			if (!el) {
				return;
			}
			const centerPoint = (this.tabClientWidth / 2) - (el.getBoundingClientRect().width / 2);
			// const reg = /.*translate\s*\(\s*(-{0,1}[\d.]+)px.*/;
			// const current = +(this.navStyle.transform.match(reg) || [0, 0])[1];
			// 如果到中心点需要移动的距离
			const needMv = centerPoint - left;
			if (needMv < 0 && -needMv < this.maxScrollX) {
				this.scrollTo(needMv, 0, 350);
			}
		}
	}
};
