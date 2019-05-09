<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="false">
		<manualCheck slot="mid"></manualCheck>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import manualCheck from './manualCheck';

export default {
	components: {
		Layout,
		manualCheck
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
