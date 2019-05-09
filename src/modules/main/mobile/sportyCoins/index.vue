<template>
	<Layout :isHaveBottomNav="false" :isHaveNavBar="hasHeader" :isHasFooter="false">
		<router-view slot="mid"></router-view>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import { isInApp } from 'appCore/util';

export default {
	name: 'sportyCoins',
	components: {
		Layout
	},
	data () {
		return {
			currentTab: '',
			hasHeader: false
		};
	},
	created () {
		this.pageLoading(false);

		// 判断是否在app中
		this.hasHeader = !isInApp();
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		})
	}
};
</script>
