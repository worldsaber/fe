<template>
<!-- 比分详情弹框 -->
	<div :class="['score-com', {open:isOpen}]" @click="showDetail">{{score}}
		<div class="score-detail" v-if="showMore">
			<div class="detail" v-if="isOpen">
				<template v-if="scoreList.length > 0">
					<p v-for="(temp, index) in tempList" :key="index">
						<span>{{sportMap[index]}}</span>
						<em>{{temp}}</em>
					</p>
					<p v-if="isShowOT">
						<span>OT</span>
						<em>{{overTimeScore}}</em>
					</p>
				</template>
				<p class="null" v-else>No Results</p>
			</div>
		</div>
	</div>
</template>

<script>

const scoreMaps = {
	// football
	'sr:sport:1': ['H1', 'FT'],
	// basketball
	'sr:sport:2': {
		common: ['Q1', 'Q2', 'Q3', 'Q4'],
		NCAA: ['H1', 'H2']
	},
	// Tennis
	'sr:sport:5': ['Set1', 'Set2', 'Set3', 'Set4', 'Set5'],
	// Volleyball
	'sr:sport:23': ['1st Set', '2nd Set', '3rd Set', '4th Set', '5th Set', '6th Set', '7th Set'],
	// Ice Hockey
	'sr:sport:4': ['1st Period', '2nd Period', 'FT'],
	// Handball
	'sr:sport:6': ['1st Half', 'FT'],
	// Beach Volleyball
	'sr:sport:34': ['1st Set', '2nd Set', '3rd Set', '4th Set', '5th Set']
};

export default {
	name: 'ScoreDetail',
	props: {
		score: {
			type: String,
			'default': '',
		},
		scoreList: {
			type: Array,
			'default': () => []
		},
		overTimeScore: {
			type: String,
			'default': ''
		},
		sportId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isOpen: false,
		};
	},
	computed: {
		showMore() {
			// Rugby, Cricket, Darts 不显示
			return !['sr:sport:12', 'sr:sport:21', 'sr:sport:22'].includes(this.sportId);
		},
		sportMap() {
			let list = [];
			const { sportId } = this;

			// if length equal to 2, competition system is NCAA
			if (sportId === 'sr:sport:2') {
				if (this.scoreList.length === 2) {
					list = scoreMaps[sportId].NCAA;
				} else {
					list = scoreMaps[sportId].common;
				}
			} else {
				list = scoreMaps[sportId];
			}
			return list;
		},
		tempList() {
			let list = [];
			const { scoreList } = this;

			// 计算累加型比分列表， 即 full time score，每一项都是前面各项元素对应分数之和
			function getFTScores(scoreList = []) {
				if (!Array.isArray(scoreList)) return [];

				const arr = scoreList.map(x => {
					const s = x.split(':');
					return [parseInt(s[0], 10), parseInt(s[1], 10)];
				});

				const result = arr.map((x, i) => (
					arr.slice(0, i + 1)
						.reduce((sum, cur) => {
							const home = sum[0] + cur[0];
							const away = sum[1] + cur[1];
							return [home, away];
						}, [0, 0])
						.join(':')
				));
				return result;
			}

			switch (this.sportId) {
			case 'sr:sport:1': // football
			case 'sr:sport:6': // handball
			case 'sr:sport:4': // ice hockey
				list = getFTScores(scoreList);
				break;
			default:
				list = scoreList;
			}
			return list;
		},
		isShowOT() {
			// Tennis 不显示
			return this.overTimeScore.length && !['sr:sport:5'].includes(this.sportId);
		}
	},
	methods: {
		show() {
			this.isOpen = true;
			document.addEventListener('click', this.clickOutside, false);
		},
		close() {
			this.isOpen = false;
			document.removeEventListener('click', this.clickOutside, false);
		},
		showDetail() {
			if (!this.showMore) return;
			if (this.isOpen) {
				return this.close();
			}
			this.show();
		},
		clickOutside (event) {
			if (this.$el && !this.$el.contains(event.target)) {
				this.close();
				document.removeEventListener('click', this.clickOutside, false);
			}
		},
	}
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.score-detail{
	color: @white;
	display: inline-block;
	position: relative;
	font-size:10/@rem;
	.m-icon-arrow--down();
	&:before{
		font-size:10/@rem;
	}
	.detail{
		@rem: 14rem;
		width:156/@rem;
		position:absolute;
		background-color: #4f545f;
		border-radius: 3px;
		color: @white;
		font-size: 14/@rem;
		left:-85/@rem;
		top:30/@rem;
		font-weight: normal;
		p{
			.clearfix();
			padding:0 10/@rem;
			text-align: right;
			line-height: 33/@rem;
			height: 33/@rem;
			span{
				float: left;
			}
			&:not(:last-of-type){
				border-bottom:1px solid #777d86;
			}
			&.null{
				text-align: center;
			}
		}
	}
}
</style>
