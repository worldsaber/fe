<template lang="html">
  <div class="m-pagination-wrapper">
	  <ul>
	  	<li><i :class="['m-icon-prev', {'is-disabled': !hasPrev}]" @click="goPrev"></i></li>
		<li><span>{{current}}</span><span class="m-total"> / {{total}}</span></li>
		<li><i :class="['m-icon-next', {'is-disabled': !hasNext}]" @click="goNext"></i></li>
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
			if (this.hasPrev) {
				this.$emit('changePage', (this.current - 1));
			}
		},
		goNext() {
			if (this.hasNext) {
				this.$emit('changePage', (this.current + 1));
			}
		}
	}
};
</script>
