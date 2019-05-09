<template>
	<Layout>
		<div slot="main-pagelet" class="main">
			<Top/>
			<ResultOptions/>
			<List/>
		</div>
	</Layout>
</template>
<script>
import { mapActions } from 'vuex';
import Layout from 'components/layout/layout';
import Top from './pagelet/top.vue';
import List from './pagelet/list.vue';
import ResultOptions from './pagelet/resultOptions.vue';

export default {
	components: {
		Layout,
		Top,
		List,
		ResultOptions,
	},
	methods: {
		...mapActions('liveResult', ['intpageData']),
	},
	created() {
		this.intpageData();
	},

};
</script>
<style lang="less">
@import '~base/style/variable.less';
body{
	background-color: @white;
	.s-page{
		background-color: @fogGrayBorder;
		padding: 34px 0 ;
		margin-top:4px;

		.main{
			width: 1000px;
			min-width: 1000px;
			margin: 0 auto;
			background-color: @white;
			padding: 0 30px;
			box-sizing: border-box;
		}
	}
}


</style>
