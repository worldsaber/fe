<template>
  <ul class="result-event">
	  <li class="date">{{getDate(data.estimateStartTime)}}<br><span>{{data.gameId}}</span></li>
	  <li class="home">{{data.homeTeamName}}</li>
	  <li class="score">
		<div class="tiem">{{getTime(data.estimateStartTime)}}</div>
		<!-- 比分 -->
		<div class="score-com cancelled" v-if="data.status === 5">Cancelled</div>
		<!-- 比分详情 -->
		<ScoreDetail v-else
			:score="data.setScore"
			:scoreList="data.regularTimeScore"
			:sportId="data.sport.id"
			:overTimeScore="data.overTimeScore"/>
	  </li>
	  <li class="away">{{data.awayTeamName}}</li>
  </ul>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import ScoreDetail from './scoreDetail.vue';

export default {
	name: 'event',
	components: {
		ScoreDetail,
	},
	props: {
		// 比赛数据
		data: {
			type: Object,
			'default': () => {}
		},
	},
	computed: {
		// 比赛类型
		type() {
			return this.data.sport.name;
		}
	},
	methods: {
		// 格式化日期
		getDate(val) {
			const date = new Date(val);
			return dateFormat.format(date, 'DD/MM/YYYY');
		},
		// 格式化时间
		getTime(val) {
			const date = new Date(val);
			return dateFormat.format(date, 'HH:mm');
		},
	},
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.result-event{
	display: table;
	width: 100%;
	height: 100%;
	min-height: 59/@rem;
	font-size:10/@rem;
	li{
		display: table-cell;
		padding-left: 2/@rem;
		vertical-align: middle;
		&.date{
			line-height: 17/@rem;
			color:@darkGray;
			width:70/@rem;
			span {
				display: block;
				color: @dark;
			}
		}
		&.home{
			width:100/@rem;
			text-align: right;
		}
		&.away{
			width:100/@rem;
			text-align: left;
		}
		&.score{
			text-align: center;
			padding:0 10/@rem;
			.score-com{
				display: inline-block;
				font-weight:bold;
				width: 60/@rem;
				height: 22/@rem;
				background-color:@dark;
				color: @white;
				line-height: 22/@rem;
				position: relative;
				text-align: center;
				vertical-align: middle;
				&:before,&:after{
					content: "";
					border-width: 22/@rem 3px 0 0 ;
					border-style: solid;
					border-color:  transparent @dark;
					position: absolute;
					left: -3px;
					bottom: 0;
				}
				&:after{
					border-width: 0 0 22/@rem 3px ;
					left: auto;
					right: -3px;
					bottom: auto;
					top: 0;
				}
				&.cancelled{
					background-color: @midGray;
					color: @darkGray;
					&:before,&:after{
						border-color:  transparent @midGray;
					}
				}
				&.open{
					z-index:30;
				}
			}
		}
	}
}
</style>
