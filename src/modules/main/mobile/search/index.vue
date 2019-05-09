<template lang="html">
  <div class="m-search">
	<SearchBar />
	<List v-if="pageModule === 'list'" />
  	<History v-show="pageModule === 'history'" />
  </div>
</template>

<script>
import {
	mapState
} from 'vuex';

import History from './pagelet/history.vue';
import SearchBar from './pagelet/searchBar.vue';
import List from './pagelet/list.vue';

export default {
	components: {
		History,
		SearchBar,
		List
	},
	computed: {
		...mapState('searchEvents', [
			'pageModule',
			'errorInfo'
		]),
	},
	watch: {
		errorInfo(val) {
			const { type = '', msg = '' } = val || {};

			if (msg) {
				switch (type) {
				case 'toast':
					this.$dialog();
					this.$toast(msg);
					return;
				case 'dialog':
					this.$dialog();
					this.$dialog({
						content: msg,
						button: ['OK']
					});

				default:
				}
			}
		}
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	}
};
</script>

<style lang="less">
@import './style/layout.less';
</style>
