<template>
  <div class="score-detail">
		<PopOver position="bottom" :isCenter="false" :arrowCenter="false">
			<div class="detail">
				<template v-if="length > 0">
				<p v-for="(temp, index) in tempList" :key="index"><span>{{sportMap[index]}}</span><em>{{temp}}</em></p>
				<p v-if="overTimeScore.length && !notOT"><span>OT</span><em>{{overTimeScore}}</em></p>
				</template>
				<p class="no-data" v-else>No Results</p>
			</div>
		</PopOver>
	</div>
</template>
<script>
import PopOver from 'components/popOver';

export default {
	name: 'ScoreDetail',
	components: {
		PopOver
	},
	props: {
		data: {
			type: Array,
			'default': () => []
		},
		overTimeScore: {
			type: String,
			'default': ''
		},
		type: {
			type: String,
			required: true,
		}
	},
	computed: {
		length() {
			return +this.data.length;
		},
		sportMap() {
			let list = [];
			const type = this.type;
			const maps = {
				Football: ['H1', 'FT'],
				Basketball: {
					common: ['Q1', 'Q2', 'Q3', 'Q4'],
					NCAA: ['H1', 'H2']
				},
				Tennis: ['Set1', 'Set2', 'Set3', 'Set4', 'Set5'],
				Volleyball: ['1st Set', '2nd Set', '3rd Set', '4th Set', '5th Set', '6th Set', '7th Set'],
				'Ice Hockey': ['1st Period', '2nd Period', 'FT'],
				Handball: ['1st Half', 'FT'],
				Darts: ['1st Set', '2nd Set', '3rd Set', '4th Set'],
				'Beach Volley': ['1st Set', '2nd Set', '3rd Set', '4th Set', '5th Set'],
			};
			// if length equal to 2, competition system is NCAA
			if (type === 'Basketball') {
				if (this.length === 2) {
					list = maps.Basketball.NCAA;
				} else {
					list = maps.Basketball.common;
				}
			} else {
				list = maps[type];
			}
			return list;
		},
		tempList() {
			let list = [];
			if (this.type === 'Football') {
				// if data length equal to 2, first half score ＋ second half score ＝ full time score
				if (this.length === 2) {
					const h1 = this.data[0].split(':');
					const h2 = this.data[1].split(':');
					const home = parseInt(h1[0], 10) + parseInt(h2[0], 10);
					const away = parseInt(h1[1], 10) + parseInt(h2[1], 10);
					// first data is first half score, second data is full time score
					list.push(this.data[0], `${home}:${away}`);
				} else {
					list = this.data;
				}
			} else if (['Handball', 'Ice Hockey'].includes(this.type)) {
				this.data.forEach((item, index) => {
					const preItem = index > 0 ? list[index - 1] : '0:0';
					const preVal = preItem.split(':');
					const val = item.split(':');
					list[index] = `${parseInt(val[0], 10) + parseInt(preVal[0], 10)}:${parseInt(val[1], 10) + parseInt(preVal[1], 10)}`;
				});
			} else {
				list = this.data;
			}
			return list;
		},
		notOT() {
			return ['Tennis'].includes(this.type);
		}
	}
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import '~base/style/icon.less';
.score-detail{
	color: @white;
	display: inline-block;
	position: relative;
	top: -1px;
	.m-icon-arrow--down();
	&:before{
		cursor: pointer;
		font-size:14px;
	}

	.m-popOver-wrapper{
		width: 150px;
		margin-bottom: 20px;
		padding: 10px 15px;
		border: none;
		position: absolute;
		left: -8px;

		.m-popOver-arrow.m-popOver-arrow--bottom{
			top: -5px;
			border: none;
		}
	}
	.detail{
		color: @dark;
		font-size: 12px;
		p{
			.clearfix();
			text-align: right;
			line-height: 28px;
			height: 28px;
			span{
				float: left;
			}
			em{
				font-size: 14px;
				font-weight: bold;
			}
		}
		.no-data{
			text-align: center;
		}
	}
}
</style>
