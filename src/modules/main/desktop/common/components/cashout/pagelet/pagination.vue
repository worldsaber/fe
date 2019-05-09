<template lang="html">
  <div class="m-pagination-wrapper">
	  <ul>
	  	<li v-if="hasPrev"><i class="m-icon-prev" @click="goPrev"></i></li>
		<li><span>{{current}}</span><span class="m-total"> / {{total}}</span></li>
		<li v-if="hasNext"><i class="m-icon-next" @click="goNext"></i></li>
	  </ul>
  </div>
</template>

<script>
export default {
	props: {
		total: {
			type: [String, Number],
			required: true
		},

		// 从1开始
		current: {
			type: [String, Number],
			'default': 1
		}
	},

	computed: {
		hasPrev() {
			return this.current > 1;
		},
		hasNext() {
			return this.current < this.total;
		}
	},

	methods: {
		goPrev() {
			this.$emit('changePage', (this.current - 1));
		},
		goNext() {
			this.$emit('changePage', (this.current + 1));
		}
	}
};
</script>
