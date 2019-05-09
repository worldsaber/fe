<template lang="html">
	<Layout>
		<MainSection slot="main-pagelet" leftWidth="150">
			<div slot="left">
				<sideBar />
			</div>
			<div slot="mid">
				<MainPanel />
			</div>
		</MainSection>
  	</Layout>

</template>

<script>
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import sideBar from 'components/userCenter/sideBar.vue';
import MainPanel from './pagelet/index.vue';

export default {
	components: {
		Layout,
		MainSection,
		sideBar,
		MainPanel
	}
};
</script>


<style lang="less">
@import 'base/style/mixin.less';
.s-page{
	.m-me-box();
}
</style>
