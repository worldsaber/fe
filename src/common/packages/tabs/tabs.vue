<template>
	<div :class="classes">
		<div :class="['m-tabs-nav']" ref="nav" :style="navStyle || {}">
			<div :class="barClasses" :style="barStyle"></div>
			<div :class="tabCls(item)" v-for="(item, index) in navList" @click="handleChange(index)" :key="index">
				<i v-if="item.icon !== ''" :type="item.icon"></i>
				<Render v-if="item.labelType === 'function'" :render="item.label"></Render>
				<template v-else>{{ item.label }}</template>
			</div>
		</div>
		<div :class="contentClasses" :style="contentStyle">
			<slot></slot>
		</div>
	</div>
</template>
<script>
import Render from './render';

export default {
	name: 'AfTabs',
	components: {
		Render
	},
	props: {
		value: {
			type: [String, Number]
		},
		size: {
			validator (value) {
				return ['small', 'default'].indexOf(value) !== -1;
			},
			'default': 'default'
		},
		animated: {
			type: Boolean,
			'default': false
		}
	},
	data () {
		return {
			navList: [],
			barWidth: 0,
			barOffset: 0,
			navStyle: {},
			activeKey: this.value
		};
	},
	computed: {
		classes () {
			return [
				'm-tabs',
				{
					'm-tabs-mini': this.size === 'small',
					'm-tabs-no-animation': !this.animated
				}
			];
		},
		contentClasses () {
			return [
				'm-tabs-content',
				{
					'm-tabs-content-animated': this.animated
				}
			];
		},
		barClasses () {
			return [
				'm-tabs-ink-bar',
				{
					'm-tabs-ink-bar-animated': this.animated
				}
			];
		},
		contentStyle () {
			const x = this.navList.findIndex(nav => nav.name === this.activeKey);
			const p = x === 0 ? '0%' : `-${x}00%`;

			let style = {};
			if (x > -1) {
				style = {
					transform: `translateX(${p}) translateZ(0px)`
				};
			}
			return style;
		},
		barStyle () {
			const style = {
				display: 'block',
				width: `${this.barWidth}px`
			};

			if (this.animated) {
				style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`;
			} else {
				style.left = `${this.barOffset}px`;
			}

			return style;
		}
	},
	methods: {
		getTabs () {
			return this.$children.filter(item => item.$options.name === 'AfTabPane');
		},
		updateNav () {
			this.navList = [];
			this.getTabs().forEach((pane, index) => {
				this.navList.push({
					labelType: typeof pane.label,
					label: pane.label,
					icon: pane.icon || '',
					name: pane.currentName || index,
					disabled: pane.disabled
				});

				!pane.currentName && (pane.currentName = index);
				(index === 0 && !this.activeKey) && (this.activeKey = pane.currentName || index);
			});
			this.updateStatus();
			this.updateBar();
		},
		updateBar () {
			this.$nextTick(() => {
				const index = this.navList.findIndex(nav => nav.name === this.activeKey);

				if (!this.$refs.nav) {
					return;
				}

				const prevTabs = this.$refs.nav.querySelectorAll('.m-tabs-tab');
				const tab = prevTabs[index];
				if (!tab) {
					return;
				}

				this.barWidth = parseFloat(tab.getBoundingClientRect().width);

				let offset = 0;
				const gutter = this.size === 'small' ? 0 : 8;
				for (let i = 0; i < index; i++) {
					offset += parseFloat(prevTabs[i].getBoundingClientRect().width);
				}
				offset += (index * 2 + 1) * gutter;
				this.barOffset = offset;
			});
		},
		updateStatus () {
			const tabs = this.getTabs();
			tabs.forEach(tab => tab.show = (tab.currentName === this.activeKey) || this.animated);
		},
		tabCls (item) {
			return [
				'm-tabs-tab',
				{
					'm-tabs-tab-disabled': item.disabled,
					'm-tabs-tab-active': item.name === this.activeKey
				}
			];
		},
		handleChange (index) {
			const nav = this.navList[index];
			if (nav.disabled) return;
			this.activeKey = nav.name;
			this.$emit('change', nav.name);
			this.$emit('input', nav.name);
		}
	},
	watch: {
		value (val) {
			this.activeKey = val;
		},
		activeKey () {
			this.updateBar();
			this.updateStatus();
		}
	},
	mounted () {
		this.updateNav();
		// resize时重新计算 tab的样式
		window.addEventListener('resize', this.updateBar, false);
	},
	beforeDestroy () {
		window.removeEventListener('resize', this.updateBar, false);
	}
};
</script>
