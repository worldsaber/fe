import Vue from 'vue';
import { mapMutations } from 'vuex';
import { UPDATECURRENTTAB } from 'store/coins/mutationTypes';
import PopTrans from '../pagelet/transactions.vue';

export default {
	methods: {
		...mapMutations('sportycoins', {
			chgCurrentTab: UPDATECURRENTTAB,
		}),
		seeDetail(activityId, transTab = 0) {
			this.$dialog();
			this.chgCurrentTab({
				type: transTab,
				tab: 'transTab'
			});
			this.$dialog({
				title: null,
				'class': 'm-coins-popTrans',
				content: Vue.extend(PopTrans).mixin({
					store: window.v_store
				}),
				contentData: {
					id: activityId
				},
				button: []
			});
		}
	}
};
