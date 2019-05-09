<template>
  <li @click="activeEle" :class="['m-snap-nav-item', {'m-snap-nav-item--disabled': disabled, active: active}]"><slot></slot></li>
</template>
<script>
	// 标记初始 active 动作
	let isInitActive = false;

	export default {
		name: 'AFSnapNavItem',
		props: {
			name: {
				type: String,
				'default': ''
			},
			disabled: {
				type: Boolean,
				'default': false
			}
		},
		data () {
			return {
				active: false,
			};
		},
		watch: {
			disable () {
				this.$parent.updateChild();
			},
			name () {
				this.$parent.updateChild();
			},
			active(val) {
				// 组件初始化后，用来执行 activeEle，并定位到相应位置
				if (val && !isInitActive) {
					this.activeEle();
					isInitActive = true;
				}
			}
		},
		mounted () {
			if (!this.name) {
				console.warn('每个选项最好给一个name属性');
			}
		},
		methods: {
			activeEle () {
				if (!this.disabled) {
					this.$parent.$emit('changeItem', this);
				}
			}
		}
	};
</script>

<style lang="less">

</style>
