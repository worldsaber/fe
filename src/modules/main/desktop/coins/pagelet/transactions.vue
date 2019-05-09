<template lang="html">
  <div class="m-coins--trans">
	  <div class="m-coins--header">
		  <h3>Transactions</h3>
		  <i
  			class="m-icon-close"
  			data-action="close"
  			data-ret="close"
  		></i>
	  </div>

  	<Nav tabType="transTab" />

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

	<ul class="m-list-wrapper" v-else >
		<template v-if="coinsTransInfo.length">
			<TransItem
				v-for="(item, index) in coinsTransInfo"
				:key="index"
				:item="item"
			/>
		</template>
		<template v-else>
			<div class="m-error-wrapper">
                <div>
                    <span class="m-error-msg m-empty">No records available</span>
                </div>
            </div>
		</template>
	</ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Nav from './nav.vue';
import TransItem from './transItem.vue';

export default {
	data() {
		return {
			pageLoading: false,
			pageError: false,
		};
	},
	components: {
		Nav,
		TransItem
	},
	computed: {
		...mapState('sportycoins', [
			'coinsTransInfo',
			'reqLoading',
			'errorInfo',
			'curTransTab'
		])
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.pageLoading && (this.pageLoading = false);
			}
		},
		errorInfo(val) {
			const { type = '' } = val || {};
			if (type === 'trans_loadError' || type === 'trans_login') {
				this.pageError = true;
				return;
			}

			this.pageError = false;
		},
		curTransTab(val, oldVal) {
			this.loadData();
		}
	},
	methods: {
		...mapActions('sportycoins', [
			'getCoinsTransInfo'
		]),
		loadData() {
			this.pageError = false;
			this.pageLoading = true;

			this.getCoinsTransInfo({ activityId: this.contentData && this.contentData.id });
		}
	},
	created() {
		this.loadData();
	}
};
</script>

<style lang="less">
@import '../style/transItem.less';
</style>
