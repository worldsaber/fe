<template lang="html">
  <Layout>
		<MainSection slot="main-pagelet" leftWidth="150">
			<div slot="left">
				<sideBar />
			</div>
			<div slot="mid">
				<withdrawBlockTip from='transaction'/>
				<mainContent />
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import { userCenter } from 'config/order/userCenterConfig';

import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import sideBar from 'components/userCenter/sideBar.vue';
import withdrawBlockTip from 'components/withdrawBlockTip/index.vue';
import mainContent from './pagelet/index';

export default {
	name: 'transaction',
	components: {
		Layout,
		MainSection,
		sideBar,
		mainContent,
		withdrawBlockTip
	},
	created () {
		this.updatePageTab(userCenter[6]);
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		})
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
.s-page{
	.m-me-box();
}
</style>
