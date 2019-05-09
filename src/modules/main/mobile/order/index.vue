<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="true" :isHasFooter="false">
		<router-view slot="mid"></router-view>
  </Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import { mapActions } from 'vuex';

export default {
	name: 'order',
	components: {
		Layout
	},
	created() {
		this.getOddsBoost();
	},
	methods: {
		...mapActions('oddsBoost', [
			'getOddsBoost'
		])
	}
};
</script>

<style>
body {
	background: #fff;
}
</style>
