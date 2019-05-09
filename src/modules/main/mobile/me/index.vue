<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<MainContent slot="mid"></MainContent>
	</Layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import MainContent from './pagelet/index';

export default {
	name: 'myAccountInfo',
	components: {
		Layout,
		MainContent
	},
	created () {
		this.pageLoading(true);
		// 进入页面直接获取名字等基本信息以及账户余额、红包等信息
		Promise.all([
			this.fetchAcountInfo(),
			this.fetchAccountBaseInfo()
		])
		.then(() => {
			this.pageLoading(false);
		})
		.catch(() => {
			this.pageLoading(-1);
		});
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		...mapActions('me', [
			'fetchAcountInfo',
			'fetchAccountBaseInfo'
		])
	}
};
</script>
