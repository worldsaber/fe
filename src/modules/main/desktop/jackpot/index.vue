<template>
	<Layout :style="{'background-image':headbge}">
		<MainSection slot="main-pagelet" leftWidth="150px" rightWidth="235px">
			<template slot="top">
				<topPrint/>
				<top />
			</template>
			<sideBar slot="left" />
			
			<router-view slot="mid"></router-view>

			<RightPagelet :showRegister="true" slot="right" />

		</MainSection>
	</Layout>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Layout from 'components/layout/layout';
import 'components/loading';
import MainSection from 'components/layout/main';
import topPrint from 'components/print/top';
import RightPagelet from './pagelet/right.vue';
import top from './pagelet/top.vue';
import sideBar from './pagelet/sideBar.vue';
import mainGame from './pagelet/gameMain.vue';

const topBg = require('./img/background.jpg');

export default {
	components: {
		Layout,
		MainSection,
		top,
		RightPagelet,
		sideBar,
		mainGame,
		topPrint
	},
	data() {
		return {
			defaultBg: topBg,
		};
	},
	computed: {
		...mapState('jackpot', ['pageData']),
		headbge() {
			return `url(${this.pageData.bgImage || this.defaultBg})`;
		},
	},
	methods: {
		...mapActions('jackpot', ['intBetData', 'getPageData']),
	},
	created() {
		this.intBetData();
		this.getPageData();
	},

};
</script>
<style lang="less">
@import '~base/style/variable.less';
body{
	background: @blueBlack;
}
.s-page{
	font-family: 'AvenirNext';
	background: @blueBlack no-repeat top center;
	color:@white;
}
@media print{
	@import './print.less';
}
</style>
