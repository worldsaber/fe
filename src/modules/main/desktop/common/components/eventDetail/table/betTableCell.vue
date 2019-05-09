<template lang="html">
  <AfTableCell @click.native="handleClick" :class="getCellStyle">
	  	<slot></slot>
  </AfTableCell>
</template>
<script>
import 'packages/tableLayout';
import tableMixin from '../js/tableMixin.js';

export default {

	name: 'BetTableCell',

	componentName: 'BetTableCell',

	mixins: [tableMixin],

	props: {
		cellKey: {
			type: String
		},
		checked: {
			type: Boolean,
			'default': false
		},
		operable: {
			type: Boolean,
			'default': true
		},
		disabled: {
			type: Boolean,
			'default': false
		},
		responsive: {
			type: Boolean,
			'default': true
		},
		cellData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	computed: {
		getCellStyle() {
			return {
				'm-table-cell--checked': this.checked,
				'm-table-cell--disable': this.disabled,
				'm-table-cell--responsive': this.responsive,
				'm-table-cell--transparent': !this.cellKey
			};
		}
	},
	data() {
		return {
			checkStatus: this.checked
		};
	},
	methods: {
		handleClick() {
			if (!this.operable) {
				return;
			}

			if (!this.$el.childNodes.length) {
				return;
			}

			this.checkStatus = !this.checkStatus;
			this.$emit('click', this);
		}
	},
	watch: {
		checked(val) {
			this.checkStatus = this.checked;
		}
	}
};
</script>
