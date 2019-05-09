<template>
	<Layout>
		<MainSection slot="main-pagelet" leftWidth="150px" rightWidth="235px">
			<div slot="left">
				<siderBar></siderBar>
			</div>
			<div slot="mid">
				<Crumb></Crumb>
				<router-view></router-view>
			</div>
			<div slot="right">
				<RightPagelet
					:showRegister="true"
					reigsterTheme="white"
				/>
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import RightPagelet from 'components/layout/right.vue';
import siderBar from './pagelet/siderBar/siderBar.vue';
import Crumb from './pagelet/crumb/crumb.vue';

export default {
	name: 'preMatch',

	data() {
		return {};
	},

	components: {
		Layout,
		MainSection,
		siderBar,
		RightPagelet,
		Crumb
	}
};
</script>

<style lang="less">
@import 'base/style/icon.less';
.m-main {
	background: @lightGray;


	.m-eventDetail {
		background: @white;
	}
}

.m-main-bottom{
	padding: 15px 0;
	& > .m-table-row{
		 align-items: normal!important;
	}

	.m-main-mid {
		padding: 0 20px;
		box-sizing: border-box;
	}
}
</style>
