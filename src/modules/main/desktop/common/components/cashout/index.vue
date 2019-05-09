<template lang="html">
	<div
		:class="[
			'm-cashout',
			{
				'm-cashout-fix': hasMorePage
			}
		]"
	>
		<template v-if="hasData">
			<ul
				class="m-cashout-list"
				v-for="item in cashoutList"
				:key="item.id"
			>
				<li class="m-cashout-item">
					<div class="m-cashout-title">
						<span class="m-label">{{item.showBetType}}</span>
						<span class="m-desc" v-show="getLiveNowList[item.id]">Live Now</span>
					</div>
					<CashoutDetail
						class="m-cashout-detail"
						v-if="showDetail(item)"
						:betInfo="item"
					/>
					<CashoutList
						class="m-cashout-bet"
						v-else
						:betInfo="item"
					/>
					<div
						class="m-operation"
						@click="changeBet(item)"
						v-if="!showDetail(item) || !cashoutInfo.done"
					>
						<i
							v-if="detailLoading && !showDetail(item) && currentBetId === item.id"
							class="m-icon-loading"
						></i>

						<p
							v-else-if="loadDetailError && !showDetail(item) && currentBetId === item.id"
							class="m-load-error"
						>Data failed loading. Please reload.</p>

						<i
							v-else
							:class="[
								'm-fold',
								{
									'm-icon-unfold': !showDetail(item),
									'm-icon-fold': showDetail(item)
								}
							]"
						></i>
					</div>
				</li>
			</ul>
			<Pagination
				v-if="hasMorePage"
				:total="pageCount"
				:current="pageIndex"
				@changePage="handleChangePage"
			/>
		</template>
		<EmptyPage
			v-else
			:isEmpty="noCashout"
			:isLoadError="loadListError"
			:isLoading="loading4List"
		/>
	</div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import cashoutEvent from 'config/cashout/eventCfg';

import * as mutationTypes from 'store/cashout/mutationTypes';

import CashoutList from './pagelet/list.vue';
import CashoutDetail from './pagelet/detail.vue';
import EmptyPage from './pagelet/default.vue';
import Pagination from './pagelet/pagination.vue';

export default {
	name: 'Cashout',

	components: {
		CashoutList,
		CashoutDetail,
		Pagination,
		EmptyPage
	},
	data() {
		return {
			loading4List: false,
			loading4Detail: false
		};
	},

	computed: {
		...mapGetters('cashout', [
			'hasData',
			'hasMorePage',
			'pageCount',
			'getLiveNowList'
		]),
		...mapState('cashout', [
			'cashoutList',
			'currentBetId',
			'pageIndex',
			'loadListError',
			'noCashout',
			'listLoading',
			'loadDetailError',
			'detailLoading',
			'cashoutInfo'
		])
	},
	methods: {
		...mapActions('cashout', {
			getBetInfo: 'fetchCashoutDetail',
			getCashoutList: 'fetchCashoutList'
		}),
		...mapMutations('cashout', {
			changeBetId: mutationTypes.UPDATEBETID,
			changeCurrentpage: mutationTypes.UPDATECURRENTPAGE,
			reset: mutationTypes.RESETCASHOUTLIST,
			resetLoadError: mutationTypes.UPDATEDETAILLOADERROR,
			removeBet: mutationTypes.REMOVEBETITEM
		}),
		showDetail(item) {
			return this.currentBetId &&
				this.currentBetId === item.id &&
				!this.loading4Detail &&
				!this.loadDetailError;
		},
		changeBet(item) {
			const cashoutInfo = this.cashoutInfo || {};
			if (cashoutInfo.done) {
				EventBus.$emit(cashoutEvent.REFRESH_CASHOUT_COUNT, 1);
			}

			this.changeBetId(item.id);
		},
		handleChangePage(val) {
			this.changeCurrentpage(val);
		},
		loadData() {
			this.getCashoutList();
			this.loading4List = this.listLoading;
			this.loading4Detail = this.detailLoading;
		}
	},
	created() {
		this.loadData();
	},
	watch: {
		currentBetId(val, oldVal) {
			if (val !== oldVal && val) {
				this.getBetInfo();
			}
		},
		pageIndex(val) {
			this.reset();
			this.getCashoutList();
		},
		listLoading(val, oldVal) {
			if (!val && oldVal) {
				setTimeout(() => {
					this.loading4List = this.listLoading;
				}, 500);
			} else {
				this.loading4List = this.listLoading;
			}
		},
		detailLoading(val, oldVal) {
			if (!val && oldVal) {
				setTimeout(() => {
					this.loading4Detail = this.detailLoading;
				}, 500);
			} else {
				this.loading4Detail = this.detailLoading;
			}
		},
		// hasData(val, oldVal) {
		// 	if (!val && oldVal) {
		// 		this.reset();
		// 		this.getCashoutList();
		// 	}
		// },
		loadDetailError(val, oldVal) {
			// detail load error 5s中消失
			if (val) {
				setTimeout(() => {
					this.resetLoadError(false);
					this.changeBetId('');
				}, 5000);
			}
		}
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.loadData();
			}
		});
	},
	destroyed() {
		this.reset(true);

		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS);
	}
};
</script>
