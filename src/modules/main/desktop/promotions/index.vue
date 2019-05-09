<template lang="html">
  <Layout>
		<MainSection slot="main-pagelet">
			<div slot="mid">
				<mainContent />
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import mainContent from './pagelet/index';

export default {
	name: 'withdraw',
	components: {
		Layout,
		MainSection,
		mainContent
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
.s-page{
	background: @lightGray;
}
</style>
