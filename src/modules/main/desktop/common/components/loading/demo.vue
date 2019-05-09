<template>
	<div class="test-loading" v-loading:loadingFail.dark="isLoading">
		test
	</div>
</template>

<script>
	import './index';

	export default {
		data () {
			return {
				isLoading: true
			};
		},
		created () {
			window.test = this;
		},
		methods: {
			loadingFail () {
				window.setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			}
		}
	};
</script>
