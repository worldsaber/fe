<template>
	<Layout>

		<MainSection slot="main-pagelet" leftWidth="150" rightWidth="235px">

			<div slot="left">
				<sideBar />
			</div>

			<div slot="mid">
				<topPrint />
				<router-view></router-view>
			</div>

			<div slot="right">
				<RightPagelet :showRegister="true"/>
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
import RightPagelet from 'components/layout/right.vue';
import sideBar from 'components/userCenter/sideBar.vue';
import topPrint from 'components/print/top';
import 'components/loading';

export default {
	components: {
		Layout,
		MainSection,
		RightPagelet,
		sideBar,
		topPrint
	},
	created () {
		this.updatePageTab(userCenter[2]);
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		})
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/mixin.less';
.s-page{
	.m-me-box();
}
@media screen {
	.m-main-left {
		z-index: 2;
	}
}

@media print {
	@import './style/print.less';
}
</style>
