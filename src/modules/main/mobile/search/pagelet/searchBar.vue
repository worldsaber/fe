<template lang="html">
  <div class="m-search--bar m-col2">
	  <div class="m-l-left">
	  	<i class="m-icon-back" @click="back"></i>
	  </div>
	  <form id="search" class="m-l-right">
		  <af-input
		  	v-model="search"
		  	icon="delete"
		  	:iconClick="clearSearch"
		  	placeholder="Teams/Players, Leagues, Game ID"
			type="search"
			autocomplete="off"
			@change="handleChange"
			@input="handleInput"
		>
  		</af-input>
	  </form>
  </div>
</template>

<script>
import {
	mapState,
	mapActions,
	mapMutations
} from 'vuex';
import {
	UPDATE_PAGE_MODULE,
	CLEAR_SEARCH_RESULT,
	UPDATE_SEARCH_KEY
} from 'store/searchEvents/mutationTypes';
import { EventBus } from 'kernel/js/eventBus';
import { AfInput } from 'components/input';
import debounce from 'utils/debounce';
import { pagePath } from 'config/pageConfig';

let debounced = null;

export default {
	components: {
		AfInput
	},
	data() {
		return {
			search: '',
			timerId: null
		};
	},
	computed: {
		...mapState('searchEvents', [
			'searchKey'
		]),
	},
	watch: {
		search(val) {
			if (!val || val && val.length <= 2) {
				this.updatePageModule('history');
			}
		}
	},
	methods: {
		...mapActions('searchEvents', [
			'getList'
		]),
		...mapMutations('searchEvents', {
			updatePageModule: UPDATE_PAGE_MODULE,
			clearSearchResult: CLEAR_SEARCH_RESULT,
			updateSearchKey: UPDATE_SEARCH_KEY
		}),
		handleChange(opt) {
			let { value } = opt || {};

			const temp = value.replace(/^\s+/, '');

			value = value.length > 27 ? value.slice(0, 27) : temp;

			this.search = value;

			const charCount = value.replace(/\s/g, '').length;

			if (charCount >= 3) {
				this.timerId && clearTimeout(this.timerId);

				this.timerId = setTimeout(() => {
					this.loadData({
						key: value
					});
				}, 1000);
			} else {
				this.timerId && clearTimeout(this.timerId);

				this.timerId = setTimeout(() => {
					this.clearSearchResult();
				}, 1000);
			}
		},
		clearSearch() {
			this.search = '';
			this.focusInput();
			this.updateSearchKey('');
		},
		loadData(opt) {
			if (debounced) {
				debounced.cancel();
			}

			debounced = debounce(() => {
				opt = opt || {
					key: this.search
				};

				this.getList(opt);
			}, 320);
			debounced();
		},
		back() {
			location.href = pagePath.home;
		},
		handleInput() {
			if (debounced) {
				debounced.cancel();
			}
		},
		focusInput() {
			const searchDom = document.querySelector('#search'),
				inputDom = searchDom && searchDom.querySelector('input');

			inputDom && inputDom.focus();
		}
	},
	created() {
		const searchKey = this.searchKey;
		if (searchKey) {
			this.search = searchKey;
			this.getList({
				key: searchKey
			});
		}
	},
	mounted() {
		const searchDom = document.querySelector('#search');

		searchDom && searchDom.addEventListener('submit', e => {
			e.preventDefault();

			const temp = this.search;

			const charCount = temp.replace(/\s/g, '').length;

			if (charCount >= 3) {
				this.loadData();
			} else {
				this.$toast('Please enter at least 3 characters');
			}
		});

		const inputDom = searchDom && searchDom.querySelector('input');

		inputDom && inputDom.addEventListener('click', e => {
			e.stopPropagation();
		});

		// this.$nextTick(() => {
		// 	this.focusInput();
		// });

		EventBus.$on('changeSKey', val => {
			this.search = val;

			const searchDom = document.querySelector('#search'),
				inputDom = searchDom && searchDom.querySelector('input');

			inputDom && inputDom.focus();
			this.loadData();
		});
	},
	destroy() {
		const searchDom = document.querySelector('#search');

		searchDom && searchDom.removeEventListener('submit');

		EventBus.$off('changeSKey');
	}
};
</script>

<style lang="less">
@import '../style/searchBar.less';
</style>
