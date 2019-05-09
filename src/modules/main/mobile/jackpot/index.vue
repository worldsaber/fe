<template>
<Layout :isHaveBottomNav="noBottomNav" >
	<template slot="mid">
	<Navbar backText="Back" :link="homeUrl"/>
	<top />
	<sideBar />
	<router-view></router-view>

	</template>
	<template slot="right">

	</template>
</Layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import 'components/loading';
import 'components/pageLoading/index.js';
import Layout from 'components/layout/main.vue';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Navbar from 'components/navbar/index.vue';
import { pagePath } from 'config/pageConfig';
import top from './pagelet/top.vue';
import sideBar from './pagelet/sideBar.vue';
import mainGame from './pagelet/gameMain.vue';

export default {
	components: {
		Layout,
		top,
		sideBar,
		mainGame,
		Navbar,
	},
	data() {
		return {
			isLoading: true,
			noBottomNav: false,
			homeUrl: pagePath.home
		};
	},
	methods: {
		...mapActions('jackpot', ['intBetData', 'getPageData']),
		...mapMutations('layout', {
			setLoading: CHANGE_LOADING,
		})
	},
	created() {
		this.intBetData();
		this.getPageData();
		this.setLoading(false);
	},
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
body {
	background: @blueBlack;
	height: 100%;
}
.s-page {
	font-family: 'AvenirNext';
	background: @blueBlack no-repeat top center;
	color: @white;
}
</style>
