<template lang="html">
  <Layout class="error-page">
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
	name: 'page500',
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

.s-page.error-page {
	min-height: 0;
}
</style>
