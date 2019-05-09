<template lang="html">
  <Layout>
		<MainSection slot="main-pagelet" leftWidth="150">
			<div slot="left">
				<sideBar />
			</div>
			<div slot="mid">
				<mainContent />
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import sideBar from 'components/userCenter/sideBar.vue';
import mainContent from './pagelet/index';

export default {
	components: {
		Layout,
		MainSection,
		sideBar,
		mainContent
	}
};
</script>
