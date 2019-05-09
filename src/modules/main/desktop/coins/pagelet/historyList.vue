<template lang="html">
  <div class="m-coins--history">
	  <template v-if="pageError">
		   <div class="m-error-wrapper">
			   <div>
				   <span class="m-error-msg">Failed to load data. Please refresh.</span>
  				   <div class="m-btn" @click="loadData">Refresh</div>
			   </div>
		   </div>
	   </template>
	   <template v-else-if="pageLoading">
		   <div class="m-error-wrapper">
			   <div>
				   <i class="m-icon-loading"></i>
				   <span class="m-text-msg">Loading...</span>
			   </div>
		   </div>
		</template>

	  <template v-else>
		  <div class="m-error-wrapper" v-if="!hasData">
 			 <div>
 				 <span class="m-error-msg m-empty">No histories available</span>
 			 </div>
 		  </div>

		  <ul class="m-list" v-else>
			  <CoinItem v-for="item in historyList" :key="item.activityId" :coinInfo="item"/>
		  </ul>
	  </template>

	  <div class="m-pg-container" v-if="pageCount > 1">
		 <Pagination :pageCount="pageCount" :pageRange="pageSize" :forcePage="forcePage" :clickHandler="pageClickHandler" :initialPage="pageIndex"  class="pagination"></Pagination>
	 </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { UPDATECURRENTPAGE } from 'store/coins/mutationTypes';
import Pagination from 'components/pagination/pagination';
import CoinItem from './coinItem.vue';
import PageMixin from '../js/pageMixin';

export default {
	mixins: [
		PageMixin
	],
	data() {
		return {
			forcePage: undefined
		};
	},

	components: {
		Pagination,
		CoinItem
	},
	computed: {
		...mapState('sportycoins', [
			'pageSize',
			'pageIndex',
			'historyList'
		]),
		...mapGetters('sportycoins', [
			'hasData',
			'pageCount'
		])
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.forcePage = undefined;
			}
		}
	},
	methods: {
		...mapMutations('sportycoins', {
			chgPage: UPDATECURRENTPAGE
		}),
		pageClickHandler (page) {
			this.chgPage(page);
			this.loadData();
		},
	}
};
</script>

<style lang="less" scoped>
@import '../style/history.less';
</style>
