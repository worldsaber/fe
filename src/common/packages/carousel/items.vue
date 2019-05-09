<template>
	<div class="item" ref="item" :class="className">
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'carousel-item',
	data () {
		return {
			index: 0,
			isActive: false,
			parentIndex: 0,
			direction: '',
			className: {
				active: false,
				left: false,
				right: false,
				next: false,
				prev: false
			}
		};
	},
	watch: {
		// 支持动画 监听direction(动画方向)，设置动画class（添加｜清空）
		direction () {
			this.changeClass();
		},
		// 不支持动画 监听isActive，设置class（添加｜清空）
		isActive () {
			if (!this.direction) {
				this.className.active = this.isActive;
			}
		}
	},
	methods: {
		changeClass () {
			// 根据参数，设置动画class（添加｜清空）
			this.className.next = this.direction === 'left';
			this.className.prev = this.direction === 'right';
			if (this.direction) {
				setTimeout(() => {
					this.className[this.direction] = true;
				}, 0);
			} else {
				this.className.left = this.className.right = false;
				this.className.active = this.isActive;
			}
		}
	},
	mounted () {
		// 初始化序号
		for (const c in this.$parent.$children) {
			if (this.$parent.$children[c] === this) {
				this.index = parseInt(c, 10);
				break;
			}
		}
		if (this.index === this.parentIndex) {
			this.className.active = this.isActive = true;
		}
		// 子组件数据变更时，重置父组件数据(indicator)；
		if (this.index === 0) {
			this.$parent.indicator = [];
		}
		// 初始化父组件数据
		this.$parent.indicator.push(this.index);
		// this.bindEvent();
	}
};
</script>
