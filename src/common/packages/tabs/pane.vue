<template>
<div class="m-tabs-tabpane" v-show="show">
	<slot></slot>
</div>
</template>

<script>
export default {
	name: 'AfTabPane',
	props: {
		name: String,
		label: {
			type: [String, Function],
			'default': ''
		},
		icon: String,
		disabled: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			show: true,
			currentName: this.name
		};
	},
	methods: {
		updateNav() {
			this.$parent.updateNav();
		}
	},
	watch: {
		name(val) {
			this.currentName = val;
			this.updateNav();
		},
		label() {
			this.updateNav();
		},
		icon() {
			this.updateNav();
		},
		disabled() {
			this.updateNav();
		}
	},
	activated () {
		this.updateNav();
	},
	deactivated () {
		this.updateNav();
	},
	destroyed () {
		this.updateNav();
	}
};
</script>
