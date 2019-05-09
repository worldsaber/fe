<template>
	<div class="m-snap-nav-wrap">
		<slot name="before"></slot>
		<ul
			:class="['m-snap-nav', displayFlex? 'flex' : '']"
			ref="nav"
			:style="navStyle || {}" >
			<slot></slot>
		</ul>
		<!-- 左右切换工具，目前没用先保留 -->
		<i v-show="isShowLeftCtr" @click="prev" class="controls left-controls"></i>
		<i v-show="isShowRightCtr" @click="next" class="controls right-controls"></i>
		<slot name="after"></slot>
	</div>
</template>

<script>
	import translateScroll from 'components/translateScrollX';
	import setCenter from './setCenter';

	const mixins = [translateScroll(), setCenter];
	export default {
		name: 'AFSnapNav',
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			value: {
				type: [Number, String],
				'default': 0
			},
			controls: {
				type: Boolean,
				'default': true
			},
			displayFlex: {
				type: Boolean,
				'default': true
			}
		},
		mixins,
		data () {
			return {
				isShowRightCtr: true,
				isShowLeftCtr: true,
				activeId: null
			};
		},
		watch: {
			value: {
				handler (val) {
					const child = this.__$children;
					const index = child.findIndex((current, index) => current.name === val || index === val);
					if (index > -1) {
						// 如果不是禁止的
						if (!child[index].disable) {
							this.activeId = index;
						} else {
							// 否则就还原
							this.$emit('change', child[this.activeId].name || this.activeId);
						}
					} else if (child[this.activeId]) {
						// 将value变回去
						this.$emit('change', child[this.activeId].name || this.activeId);
					}
				},
				immediate: false
			},
			activeId (val, oldVal) {
				const child = this.__$children;
				let cur;
				let old;
				child.forEach((current, index) => {
					if (index === val) {
						cur = current;
					} else if (index === oldVal) {
						old = current;
					}
				});
				// 设置值是正确的
				if (cur) {
					if (old) {
						old.active = false;
					}
					cur.active = true;
					this.$emit('change', cur.name || val);
				} else {
					this.$emit('change', old.name || oldVal);
				}
				if (child.length < val) {
					this.isShowRightCtr = false;
				} else {
					this.isShowRightCtr = true;
				}
				if (val >= 0) {
					this.isShowLeftCtr = true;
				} else {
					this.isShowLeftCtr = false;
				}
			}
		},
		updated () {
			const child = this.getChild();
			// 子节点数量发生变化
			if (child.length !== 0 && child.length !== this.__$children.length) {
				this.updateChild();
				this.computedWidth();
			}
		},
		mounted () {
			this.__$children = this.getChild();
			// 获取所有的child
			const child = this.__$children;
			const index = child.findIndex((current, index) => current.name === this.value || index === this.value);
			if (index > -1) {
				this.activeId = index;
			}
			if (child[this.activeId]) {
				this.$emit('change', child[this.activeId].name || this.activeId);
			}
			this.$on('changeItem', ch => {
				const index = this.__$children.findIndex(current => current === ch);
				if (index > -1) {
					this.activeId = index;
				}
			});
		},
		methods: {
			prev () {
				if (!this.controls) {
					return;
				}
				let active = this.activeId - 1;
				const child = this.__$children;
				while (child[active]) {
					if (!child[active].disable) {
						this.activeId = active;
						return;
					}
					active -= 1;
				}
			},
			next () {
				if (!this.controls) {
					return;
				}
				let active = this.activeId + 1;
				const child = this.__$children;
				while (child[active]) {
					if (!child[active].disable) {
						this.activeId = active;
						return;
					}
					active += 1;
				}
			},
			// 给子组件调用
			updateChild () {
				this.__$children = this.getChild();
				const c = this.__$children[this.activeId];
				if (c) {
					if (this.value !== c.name && this.value !== this.activeId) {
						this.$emit('change', c.name || this.activeId);
					}
				} else {
					this.activeId = 0;
				}
			},
			getChild () {
				return this.$children.filter(child => child.$options.name && child.$options.name === 'AFSnapNavItem');
			}
		}
	};
</script>
