<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<MainContent slot="mid" :mobile="mobile" :wholeMobile="wholeMobile"/>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import depositConfig from 'config/deposit/record';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import MainContent from './pagelet/index';
import getMobile from './js/fetchMobile';

export default {
	name: 'deposit',
	components: {
		Layout,
		MainContent
	},
	data () {
		return {
			mobile: '',
			wholeMobile: ''
		};
	},
	created () {
		getMobile().then(data => {
			if (typeof data === 'object') {
				this.mobile = data.mobile;
				this.wholeMobile = data.wholeMobile;
				this.pageLoading(false);
			}
		});
	},
	mounted() {
		depositConfig.check();
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		})
	}
};
</script>
