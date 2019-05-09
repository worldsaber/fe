<template>
  <div class="m-main-wrap">
	  <router-view></router-view>
  </div>
</template>

<script>
export default {
	name: 'App',
	mounted () {
		window.onoffline = () => {
			this.$toast('Please check your internet connection and try again.');
		};
	}
};
</script>
