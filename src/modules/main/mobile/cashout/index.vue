<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="true">
	<div slot="mid">
		<topNavBar></topNavBar>
		<Cashout></Cashout>
	</div>
  </Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import Cashout from 'components/cashout/index.vue';
import topNavBar from 'components/navbar';

export default {
	name: 'withdraw',
	components: {
		Layout,
		Cashout,
		topNavBar
	},
	data () {
		return {
		};
	},
	created () {
	},
	methods: {

	}
};
</script>
