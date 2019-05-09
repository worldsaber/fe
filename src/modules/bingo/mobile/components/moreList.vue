<template>
	<div class="m-more-list-wrap" ref="list">
		<div class="m-more-list" v-show="listData">
			<slot :list="listData || []" name="list">
				<div class="m-more-list-content">Please use scope to define the template.</div>
			</slot>
		</div>
		<div class="m-more-list-more">
			<LoadStatus :loadStatus="moreLoading" @reload="loadNextPage" class="m-more-list-load-status"></LoadStatus>
			<div class="m-more-list-none" v-if="isShowNoMore">
				<slot name="noMore">No More Items</slot>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import LoadStatus from './loadStatus';

export default {
	props: {
		fetchData: {
			type: Function,
			required: true,
		},
		params: {
			type: Object,
			'default': () => ({})
		},
		bottomDist: {
			type: Number,
			 'default': 20
		}
	},
	data() {
		return {
			listData: null, // 初始表示还没有数据，不需要展示
			moreLoading: 1, // 0 1 2 3
			pageSize: 20,
			pageNo: 1,
			noMore: false,
			lastId: '',
		};
	},
	components: {
		LoadStatus,
	},
	computed: {
		...mapState('layout', [
			'scrollPayload'
		]),
		isShowNoMore() {
			return this.noMore && this.pageNo > 1;
		}
	},
	watch: {
		params: {
			immediate: true,
			handler(value) {
				// 重置状态
				this.pageNo = 1;
				this.moreLoading = 1;
				this.noMore = false;
				this.listData = null;
				this.lastId = '';

				// 加载数据
				this.fetchList();
			}
		},
		scrollPayload(value) {
			// 没有更多了
			if (this.noMore) {
				return;
			}
			// loading, fail 状态不会重复load
			if ([1, 3].includes(this.moreLoading)) {
				return;
			}

			const $list = this.$refs.list;
			const rect = $list.getBoundingClientRect();
			const bottom = rect.bottom;
			// 需要加载更多
			if (value.clientHeight + this.bottomDist >= bottom) {
				this.onLoadMore();
			}
		}
	},
	methods: {
		fetchList() {
			const params = {
				pageSize: this.pageSize,
				// pageNo: this.pageNo,
				...this.params
			};
			if (this.lastId) {
				params.lastId = this.lastId;
			}
			const promise = this.fetchData(params);
			this.moreLoading = 1; // loading
			promise.then(data => {
				this.moreLoading = 2; // 成功
				if (this.pageNo === 1) {
					this.listData = data.list;
				} else if (this.pageNo > 1) {
					this.listData = [...this.listData, ...data.list]; // 追加
				}
				this.lastId = data.lastId;
				// no more
				this.noMore = !data.hasMore;
			}).catch(() => {
				this.moreLoading = 3; // 失败
			});
		},
		loadNextPage() {
			this.fetchList();
		},
		onLoadMore() {
			this.pageNo++;
			this.loadNextPage();
		}
	},
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.m-more-list-none{
	padding: 20/@rem;
	text-align: center;
	margin-top: 6/@rem;
}
.m-more-list-load-status{
	background-color: #FFF;
}
</style>


