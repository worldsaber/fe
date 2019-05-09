<template lang="html">
	<div
		:class="[
			'm-cashout'
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
			<div class="no-more-data" v-if="!hasMorePage && pageCount > 1">
				<p class="m-text-msg">No More bet</p>
			</div>
			<PushLoading v-else-if="hasMorePage" @loading="handlePullLoading" :loadingEnd="!listLoading"></PushLoading>
		</template>
		<!-- 只有第一页用全屏加载 -->
		<EmptyPage
			v-else
			:isEmpty="noCashout"
			:isLoadError="loadListError"
			:isLoading="loading4List && !hasData"
		/>
	</div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

import { EventBus } from 'kernel/js/eventBus.js';
import cashoutEvent from 'config/cashout/eventCfg';

import * as mutationTypes from 'store/cashout/mutationTypes';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import CashoutList from './pagelet/list.vue';
import CashoutDetail from './pagelet/detail.vue';
import EmptyPage from './pagelet/default.vue';
import PushLoading from './pagelet/pushLoading.vue';

export default {
	name: 'Cashout',

	components: {
		CashoutList,
		CashoutDetail,
		PushLoading,
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
		...mapActions('cashout', [
			'getComments'
		]),
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		...mapMutations('cashout', {
			changeBetId: mutationTypes.UPDATEBETID,
			reset: mutationTypes.RESETCASHOUTLIST,
			resetLoadError: mutationTypes.UPDATEDETAILLOADERROR
		}),
		showDetail(item) {
			return this.currentBetId &&
				this.currentBetId === item.id &&
				!this.loading4Detail &&
				!this.loadDetailError;
		},
		changeBet(item) {
			this.changeBetId(item.id);
		},
		handlePullLoading() {
			this.getCashoutList();
		}
	},
	created() {
		this.getCashoutList()
		.then(() => {
			if (this.cashoutList && this.cashoutList.length) {
				this.changeBetId(this.cashoutList[0].id);
				EventBus.$emit(cashoutEvent.REFRESH_CASHOUT_COUNT, this.cashoutList.length || 0);
			}
			window.setTimeout(() => this.pageLoading(false), 300);
		});
		this.loading4List = this.listLoading;
		this.loading4Detail = this.detailLoading;
	},
	watch: {
		currentBetId(val, oldVal) {
			if (val !== oldVal && val) {
				this.getBetInfo().then(() => {
					this.getComments();
				});
			}
		},
		listLoading(val, oldVal) {
			if (!val && oldVal) {
				setTimeout(() => {
					this.loading4List = this.listLoading;
				}, 300);
			} else {
				this.loading4List = this.listLoading;
			}
		},
		detailLoading(val, oldVal) {
			if (!val && oldVal) {
				setTimeout(() => {
					this.loading4Detail = this.detailLoading;
				}, 300);
			} else {
				this.loading4Detail = this.detailLoading;
			}
		},
		hasData(val, oldVal) {
			if (!val && oldVal) {
				this.reset();
				this.getCashoutList();
			}
		},
		loadDetailError(val, oldVal) {
			// detail load error 5s中消失
			if (val) {
				setTimeout(() => {
					this.resetLoadError(false);
					this.changeBetId('');
				}, 5000);
			}
		},
		cashoutList(val) {
			EventBus.$emit(cashoutEvent.REFRESH_CASHOUT_COUNT, val && val.length || 0);
		}
	},
	destroyed() {
		this.reset(true);
	}
};
</script>

<style lang="less">
	@import './index.less';
</style>
