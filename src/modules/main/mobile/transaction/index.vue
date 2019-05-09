<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="false">
		<router-view slot="mid"></router-view>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';

export default {
	name: 'transaction',
	components: {
		Layout
	},
	data () {
		return {
			currentTab: ''
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
