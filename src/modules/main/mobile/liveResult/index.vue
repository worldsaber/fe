<template v-pageLoading="isLoading">
	<div class="page-wrap" v-pageLoading="isLoading">
		<Navbar v-if="!isSearch">
			<span slot="right" class="btn-search" @click="showSearch"></span>
		</Navbar>
		<Top v-else :hidden="showSearch"/>
		<div class="main">
			<ResultOptions v-show="!isSearch"/>
			<List v-if="!isSearch"/>
			<SearchList v-if="isSearch"/>
		</div>
	</div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Navbar from 'components/navbar/index.vue';
import 'components/pageLoading/index.js';
import Top from './pagelet/top.vue';
import List from './pagelet/list.vue';
import SearchList from './pagelet/searchList.vue';
import ResultOptions from './pagelet/resultOptions.vue';

export default {
	name: 'LiveResult',
	components: {
		Navbar,
		Top,
		List,
		ResultOptions,
		SearchList,
	},
	computed: {
		...mapState('liveResult', ['resultList']),
	},
	methods: {
		...mapActions('liveResult', ['intpageData']),
		showSearch() {
			this.isSearch = !this.isSearch;
		},
	},
	data() {
		return {
			isLoading: true,
			isSearch: false,
		};
	},
	created() {
		this.intpageData();
		this.isLoading = false;
	},

};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
body{
	background-color: @white;
	.m-navbar{
		position: fixed;
		width: 100%;
		z-index: 50;
		padding-right: 0;
	}
	.page-content{
		.m-navbar .btn-search{
			width: 50/@rem;
			display: block;
			text-align: center;
			.m-icon-search();
			&:before{
				font-size: 18/@rem;
			}
		}
	}
}


</style>
