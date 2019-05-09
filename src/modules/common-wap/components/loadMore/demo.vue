<template>
	<div class="m-loadmore-demo">
		<div class="loadmore-wrap">
			<ul class="list" v-loadMore:hasMore="loadMoreConfig">
				<li class="list-item" v-for="(item, index) in list" :key="index">{{item}}</li>
				<li class="list-item" v-if="!hasMore">No More Itens...</li>
				<li class="list-item" v-else-if="showLoading"><i class="icon-loading"/></li>
			</ul>
		</div>
	</div>
</template>

<script>
import 'components/loadMore';

export default {
	data() {
		return {
			list: [],
			loadMoreConfig: {
				className: '.loadmore-wrap',
				onLoadMore: this.fetchData
			},
			pageNo: 1,
			pageSize: 10,
			showLoading: false
		};
	},
	computed: {
		hasMore() {
			return this.list.length < 60;
		}
	},
	created() {
		console.log(this);
		console.log('created');
		this.fetchData();
	},
	beforeMount() {
		console.log('beforeMount');
	},
	mounted() {
		console.log('mounted');
		document.querySelector('#pageLoading').remove();
	},
	methods: {
		fetchData() {
			return new Promise((res, rej) => {
				this.showLoading = true;
				setTimeout(() => {
					const data = [];
					for(let i = this.pageSize * (this.pageNo - 1);i < this.pageSize * this.pageNo; i++) {
						data.push(i);
					}
					if (this.list.length === 0) { // 首页数据
						this.list = data;
					} else {
						this.list = this.list.concat(data);
					}
					this.pageNo++; // 页数递增或者更新lastId
					res();
					this.showLoading = false;
				}, 1500);
			});
			
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

@keyframes circles
{
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.loadmore-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	.list {
		
		.list-item {
			width: 100%;
			text-align: center;
			font-size: 14/@rem;
			line-height: 80/@rem;
			border-top: 1px solid @dark;
			boder-bottom: 1px solid @dark;
			
			.icon-loading {
				display: inline-block;
				.m-icon-loading-circle();
				animation: circles 1s infinite;
				animation-timing-function: linear;
			}
		}
	}
}
</style>
