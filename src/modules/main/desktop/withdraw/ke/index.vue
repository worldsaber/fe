<template lang="html">
  <Layout>
		<MainSection slot="main-pagelet" leftWidth="150">
			<div slot="left">
				<sideBar />
			</div>
			<div slot="mid">
				<withdrawBlockTip from="withdraw"/>
				<mainContent />
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import sideBar from 'components/userCenter/sideBar.vue';
import withdrawBlockTip from 'components/withdrawBlockTip/index.vue';
import mainContent from './pagelet/index';

export default {
	name: 'withdraw',
	components: {
		Layout,
		MainSection,
		sideBar,
		mainContent,
		withdrawBlockTip
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
.s-page{
	.m-me-box();
}
</style>
