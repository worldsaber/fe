<template lang="html">
  <div class="m-table-cell" @click="handleClick">
  	<slot></slot>
  </div>
</template>

<script>
export default {
	name: 'AfTableCell',

	methods: {
		handleClick(e) {
			this.$emit('click', e);
		}
	}
};
</script>
