<template>
	<div class="bingo-published-wrap">
		<MoreList :fetchData="getPublishedList" :params="params">
			<template slot="list" slot-scope="{ list }">
				<div class="bingo-goods-list" v-if="list.length > 0">
					<PublishedGood v-for="(item, index) in list" :key="index" :item="item"/>
				</div>
				<div class="bingo-published-empty" v-else>
					Sorry，there are currently no items available in this category. Please try again later. Thank you.
				</div>
			</template>
		</MoreList>
	</div>
</template>

<script>
import PublishedGood from './publishedGood';
import MoreList from '../../components/moreList';
import { getGoodListByStatus } from '../../js/utils';

export default {
	name: 'Published',
	data() {
		return {
			params: {
				status: -2,
			},
		};
	},
	components: {
		PublishedGood,
		MoreList,
	},
	methods: {
		getPublishedList(params) {
			return getGoodListByStatus(params);
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import '~base/styles/icon.less';
.bingo-published-wrap{
	background-color: #eaecef;
	padding-top: 1/@rem;
	margin-top: -1/@rem;
}
.bingo-published-empty{
	font-size: 12/@rem;
	text-align: center;
	margin-top: 6/@rem;
	background-color: #FFF;
	color: #9ca0ab;
	padding: 40/@rem 20/@rem;
	.m-icon-exclamation();
	&:before{
		display: block;
		margin-bottom: 10/@rem;
		font-size: 36/@rem;
		line-height: 42/@rem;
		padding-right: 15/@rem;
		color: @midGray;
	}
}
</style>

