<template>
	<div class="m-deposit-reg-wrap">
		<router-view></router-view>
	</div>
</template>
<script>
import 'statistics/tj';

export default {
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
	created() {
		if (this.$route.name !== 'home') {
			const query = this.$route.query;
			this.$router.replace({
				name: 'home',
				query,
			});
		}
	}
};
</script>
<style lang="less">

</style>
