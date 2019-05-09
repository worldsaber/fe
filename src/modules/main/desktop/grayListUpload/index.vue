<template lang="html">
  <Layout>
		<MainSection slot="main-pagelet" leftWidth="150">
			<div slot="left">
				<sideBar />
			</div>
			<div slot="mid">
				<mainContent></mainContent>
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import sideBar from 'components/userCenter/sideBar.vue';
import mainContent from './pagelet/main';

export default {
	components: {
		Layout,
		MainSection,
		sideBar,
		mainContent
	},
	methods: {
		...mapMutations('userCenter', ['updateCurrentTab'])
	},
	mounted() {
		const from = URL.getPara('from');
		const tabMap = {
			withdraw: 'Withdraw',
			transaction: 'Transactions'
		};
		this.updateCurrentTab(tabMap[from] || ' ');
	}
};
</script>
