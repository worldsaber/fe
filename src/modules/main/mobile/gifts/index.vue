<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="false">
		<MainContent slot="mid"></MainContent>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import MainContent from './pagelet/index';

export default {
	name: 'Gifts',
	components: {
		Layout,
		MainContent
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
