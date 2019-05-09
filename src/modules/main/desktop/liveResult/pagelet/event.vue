<template>
  <ul class="result-event">
	  <li class="time" v-html="getDate(data.estimateStartTime)"></li>
	  <li class="gameId">{{data.gameId}}</li>
	  <li class="home">{{data.homeTeamName}}</li>
	  <li class="score">
		<div class="score-com cancelled" v-if="data.status === 5">Cancelled</div>
		<div class="score-com" v-else>{{data.setScore}}
			<ScoreDetail v-if="showMore" :data = "data.regularTimeScore" :overTimeScore="data.overTimeScore" :type = "type"/>
		</div>
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
		data: {
			type: Object,
			'default': () => {}
		},
		type: {
			type: String,
			required: true,
		}
	},
	computed: {
		showMore() {
			return !['Rugby', 'Cricket', 'Darts'].includes(this.type);
		}
	},
	methods: {
		getDate(val) {
			const date = new Date(val);
			return `${dateFormat.format(date, 'DD/MM/YYYY')}<span>${dateFormat.format(date, 'HH:mm')}</span>`;
		},
	},
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import '~base/style/icon.less';
.result-event{
	display: table;
	width: 100%;
	height: 100%;
	min-height: 63px;
	li{
		display: table-cell;
		padding-left: 2px;
		vertical-align: middle;
		&.time{
			font-size: 12px;
			line-height: 14px;
			color:@darkGray;
			width:95px;
			span {
				display: block;
				font-size: 16px;
				height: 21px;
				line-height: 21px;
				color: @dark;
			}
		}
		&.gameId{
			width:75px;
			font-size: 16px;
		}
		&.home{
			width:280px;
			text-align: right;
			font-size: 18px;
		}
		&.away{
			width:280px;
			text-align: left;
			font-size: 18px;
		}
		&.score{
			text-align: center;
			.score-com{
				display: inline-block;
				width: 100px;
				height: 47px;
				background-color:@dark;
				color: @white;
				font-size: 20px;
				line-height: 47px; 
				position: relative;
				text-align: center;
				vertical-align: middle;
				&:before,&:after{
					content: "";
					border-width: 47px 8px 0 0 ;
					border-style: solid;
					border-color:  transparent @dark;
					position: absolute;
					left: -8px;
				}
				&:after{
					border-width: 0 0 47px  8px ;
					left: auto;
					right: -8px;
					top: 0;
				}
				&.cancelled{
					background-color: @midGray;
					color: @darkGray;
					&:before,&:after{
						border-color:  transparent @midGray;
					}
				}
			}
		}
	}
}
</style>
