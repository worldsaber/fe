<template>
	<div class="winning-ratio-wrap">
		<img :src="images.popo" alt="" class="popo" ref="popo"/>
		<img :src="images.bar" alt="" class="bar" ref="bar"/>
		<img :src="images.floor" alt="" class="floor" ref="floor"/>
		<img :src="images.leaf" alt="" class="leaf" ref="leaf"/>
		<div class="winning-container" ref="container">
			<div class="banner-wrap">
				<img :src="images.banner" alt="" class="banner" ref="banner"/>
				<div class="title" ref="title">{{title | toUpperCase}}</div>
				<div class="text" ref="text">
					<span>{{winningText | toUpperCase}}</span>
					<span class="bets" v-if="isNoWonSelection">BETS</span>
					<span class="suffix" v-else>CORRECT <br/>GAMES</span>
				</div>
			</div>
			<!-- <img :src="gift" alt="" class="gift"> -->
			<component :is="gift" v-if="gift" class="gift" ref="gift"></component>
			<div class="content-wrap" ref="content">
				<template v-if="isNoWonSelection">
					<div class="total-selection">YOU PLACED {{selectionCount}} BETS AT THE SPORTY CLUB.</div>
					<div class="ratio-by-day" v-if="ratioByDay > 1"> YOU NEARLY PLACED {{ratioByDay}} BETS A DAY. </div>
				</template>
				<template v-else>
					<div class="content-text" v-for="(text, index) in contentText" :key="index">{{text | toUpperCase}}</div>
				</template>
			</div>
		</div>
		<Next ref="next" @click.native="onNext"/>
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import anime from 'animejs';

import vueMixin from '../vue-mixin.js';
import Next from '../components/next.vue';
import { getWinningRatio } from '../images/config';
import GiftMap from './gifts/index';
import { getNextRoute } from '../router/config';

/**
 * #{ratio} 胜率
 * #{winningsSelection} 获胜场数
 */
const ratioTexts = [
	[
		'You got #{winningsSelection} correct games out of all your selections this year in the Sporty Club! ',
		// 'You are the Sporty boss!'
	],
	[
		'You got #{ratio}% correct games out of all your selections this year in the Sporty Club! ',
		// 'You are the Sporty professor!'
	],
	[
		'You got #{ratio}% correct games out of all your selections this year in the Sporty Club! ',
		// 'You are the Sporty master!'
	]
];

const giftNames = ['bronze', 'silver', 'gold'];
const titleNames = ['Bronze Medal', 'Silver Medal', 'Gold Medal'];

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: getWinningRatio(),
		};
	},
	components: {
		Next,
	},
	computed: {
		...mapGetters('annual', [
			'getRatioIndex',
		]),
		...mapState('annual', [
			'registTime',
			'selectionCount',
			'winningsSelectionCount',
			'updateTime'
		]),
		// TODO 没有realSports 投注不显示
		isNoWonSelection() {
			return this.winningsSelectionCount === 0;
		},
		ratioByDay() {
			let day = (this.updateTime - this.registTime) / (1000 * 60 * 60 * 24);
			day = Math.floor(day);
			if (day < 1) {
				day = 1;
			}
			return Math.floor(this.selectionCount / day);
		},
		ratioOfWin() {
			return Math.floor(this.winningsSelectionCount / this.selectionCount * 100);
		},
		contentText() {
			const index = this.getRatioIndex;
			const texts = ratioTexts[index] || [];

			return texts.map(text => text.replace('#{ratio}', this.ratioOfWin).replace('#{winningsSelection}', this.winningsSelectionCount));
		},
		winningText() {
			const index = this.getRatioIndex;
			if (index === 0) {
				return this.winningsSelectionCount;
			}
			return `${this.ratioOfWin}%`;
		},
		gift() {
			const index = this.getRatioIndex;
			const giftName = giftNames[index];
			return GiftMap[giftName];
		},
		title() {
			const index = this.getRatioIndex;
			return titleNames[index];
		}
	},
	created() {
		// 没有投注
		if (this.selectionCount === 0) {
			const routeName = getNextRoute.call(this);
			if (routeName) {
				this.$router.replace({
					name: routeName,
				});
			}
		}
	},
	mounted() {
		const refs = this.$refs;

		anime({
			targets: refs.container,
			translateX: ['100%', 0],
			opacity: [0, 1],
			duration: 500,
			easing: 'easeInSine'
		});
	},
	methods: {
		onNext() {
			const prom = this.leaveAnimate();
			prom.then(() => {
				this.$refs.next.goNext();
			});
		},
		leaveAnimate() {
			const refs = this.$refs;
			anime({
				targets: refs.bar,
				translateX: [0, 300],
				duration: 500,
				easing: 'easeInSine'
			});
			anime({
				targets: refs.floor,
				translateY: [0, 200],
				opacity: [1, 0],
				duration: 500,
				easing: 'easeInSine'
			});
			anime({
				targets: refs.leaf,
				translateX: [0, -100],
				duration: 300,
				delay: 300,
				easing: 'easeInSine'
			});
			const am = anime({
				targets: [refs.container, refs.popo],
				translateY: [0, '-100%'],
				opacity: [1, 0],
				duration: 500,
				delay: 300,
				easing: 'easeOutSine'
			});
			return am.finished;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.winning-ratio-wrap{
	.popo{
		position: absolute;
		width: 100%;
		top: 0;
		right: 0;
		z-index: 10;
		transform-origin: right top;
	}
	.bar{
		position: absolute;
		bottom: 0;
		right: 0;
		width: 57.5%;
		z-index: 5;
	}
	.leaf{
		position: absolute;
		left: 0;
		top: 0;
		margin-top: 85.5%;
		width: 11.7%;
	}
	.floor{ 
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
	}
	.winning-container{
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
	}
	.banner-wrap{
		width: 75%;
		margin-top: 12%;
		z-index: 100;
		.banner{
			width: 100%;
		}
		.text{
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			justify-content: center;
			align-content: center;
			font-size: 30/@rem;
			margin-top: 20%;
			line-height: 30/@rem;
			color: #FFF;
			// font-weight: bold;
			text-align: center;
			white-space: nowrap;
			.suffix{
				flex: 0 0;
				font-size: 12/@rem;
				line-height: 12/@rem;
				margin: 2/@rem 0 0 20/@rem;
				text-align: left;
			}
			.bets{
				margin-left: 20/@rem;
				font-size: 24/@rem;
			}
		}
		.title{
			position: absolute;
			top: 0;
			left: 50%;
			margin-top: 11%;
			transform: translateX(-50%);
			font-size: 16/@rem;
			// font-style: italic;
			// font-weight: bold;
			color: #1b017c;
			letter-spacing: 0.4px;
		}
	}
	.gift{
		width: 100%;
		text-align: center;
		margin: 2% 0 4%;
	}
	.content-wrap{
		width: 66%;
		// margin-top: 10/@rem;
		// font-weight: bold;
		z-index: 100;
		line-height: 1.3;
		font-size: 16/@rem;
	}
}
</style>

