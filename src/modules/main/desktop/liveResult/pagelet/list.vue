<template>
  <section class="result-list">
	  <template v-if="!!resultList.tournaments && resultList.tournaments.length > 0">
	  <ul class="title">
		  <li class="time">Time</li>
		  <li class="gameId">Game ID</li>
		  <li class="match">Match and Result</li>
	  </ul>
	  <dl v-for="tournament in resultList.tournaments" :key = "tournament.id" class="list">
		<dt>{{tournament.categoryName}} - {{tournament.name}}</dt>
		<dd  v-for="event in tournament.events" :key="event.eventId">
			<Event :data="event" :type="event.sport.name"/>
		</dd>
	  </dl>
	  <Pagination v-if="pageCount > 1" :pageCount="pageCount" :pageRange="10" :clickHandler="handleChangePage" :initialPage="pageNum"  class="pagination"/>
	  </template>
	  <div class="isEmpty" v-else>No Results</div>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { UPDATE_PAGENUM } from 'store/liveResult/mutationTypes';
import Pagination from 'components/pagination/pagination';
import Event from './event';

export default {
	name: 'list',
	components: {
		Pagination,
		Event
	},
	computed: {
		...mapState('liveResult', ['resultList', 'pageNum']),
		...mapGetters('liveResult', ['pageCount']),
		hasMorePage() {
			return this.pageCount > 1;
		},
	},
	methods: {
		...mapMutations('liveResult', {
			setPageNum: UPDATE_PAGENUM,
		}),
		...mapActions('liveResult', ['getResultList']),
		handleChangePage(val) {
			this.setPageNum(val);
			this.getResultList();
		},
	}
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import '~base/style/icon.less';
.result-list{
	padding-bottom: 30px;
	.title{
		display: table;
		width: 100%;
		height: 35px;
		li{
			display: table-cell;
			vertical-align: middle;
			font-size: 12px;
			color:#5f5f5f;
			padding-left: 2px;
			&.time{
				width: 95px;
			}
			&.gameId{
				width:75px;
			}
			&.match{
				text-align: center;
			}
		}
	}
	.list{
		dt{
			height: 28px;
			background-color: @fogGray;
			line-height: 28px;
			font-size: 12px;
			padding-left: 14px; 
		}
		dd{
			min-height: 63px;
			border-bottom: solid 1px @dimBlack;
		}
	}
	.pagination{
		margin: 27px auto 0;
		font-weight: 500;
		.pageNum{
			height: 24px;
			width: 24px;
			line-height: 24px;
			margin: 0 1px;
		}
		.icon-prev, .icon-next{
			&:before{
				color: @green;
			}
		}
		.icon-disabled{
			&::before{
				color: @darkGray;
			}
		}
		.selected{
			background-color: @green;
			color: @white;
		}
	}
	.isEmpty{
		height: 150px;
		padding-top:100px;
		text-align: center;
		font-size: 14px;
		color: @darkGray;
	}
}

</style>
