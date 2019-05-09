<template lang="html">
  <div class="m-search--history" v-if="showHistory">
	  <div class="m-title m-col2">
		  <div class="m-l-left">Search History</div>
		  <div class="m-l-right" @click="handleClear">Clear</div>
	  </div>
	  <ul class="m-list">
		  <li
		  	class="m-l-item"
			v-for="item in searchList"
			@click="handleSearch(item)"
		  >{{item}}</li>
	  </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { EventBus } from 'kernel/js/eventBus';
import { CLEAR_HISTORY } from 'store/searchEvents/mutationTypes';

export default {
	computed: {
		...mapState('searchEvents', [
			'searchList'
		]),
		showHistory() {
			return !!this.searchList.length;
		}
	},
	methods: {
		...mapMutations('searchEvents', {
			clearHistory: CLEAR_HISTORY
		}),
		handleSearch(key) {
			EventBus.$emit('changeSKey', key);
		},
		handleClear() {
			this.$dialog();
			this.$dialog({
				content: 'Are you sure you want to delete all search history?',
				button: ['CANCEL', 'CONFIRM']
			}).onBtnClick(btnType => {
				if (btnType === 1) {
					this.clearHistory();
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../style/history.less';
</style>
