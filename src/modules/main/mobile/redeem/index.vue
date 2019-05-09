<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="false">
		<redeem slot="mid"></redeem>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import redeem from './redeem';

export default {
	name: 'withdraw',
	components: {
		Layout,
		redeem
	},
	data () {
		return {
		};
	},
	created () {
		this.pageLoading(false);
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		})
	}
};
</script>
