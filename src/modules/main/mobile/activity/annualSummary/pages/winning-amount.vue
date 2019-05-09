<template>
	<div class="page-screen winning-amount-wrap">
		<img :src="images.popo" alt="" class="popo" ref="popo"/>
		<img :src="images.bar" alt="" class="bar" ref="bar"/>
		<img :src="images.floor" alt="" class="floor" ref="floor"/>
		<img :src="images.leaf" alt="" class="leaf" ref="leaf"/>
		<div class="winning-container" ref="container">
			<div class="banner-wrap">
				<img :src="images.banner" alt="" class="banner"  ref="banner"/>
				<div class="title" ref="title">{{ 'Biggest Winning' | toUpperCase }}</div>
				<div class="text" ref="text">{{winningText | toUpperCase}}</div>
			</div>
			<!-- <img :src="gift" alt="" class="gift"> -->
			<component :is="gift" v-if="gift" class="gift" ref="gift"></component>
			<div class="content-wrap" ref="content">
				<div class="content-text" v-for="(text, index) in contentText" :key="index">{{text | toUpperCase}}</div>
			</div>
		</div>
		<Next ref="next" @click.native="onNext" />
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import anime from 'animejs';

import vueMixin from '../vue-mixin.js';
import Next from '../components/next.vue';
import GiftMap from './gifts/index';

import { getMoneyFraction } from '../util';
import { getWinningAmount } from '../images/config';
import { getNextRoute } from '../router/config';

// 金额判断 分界点
// const conditionPoints = [100, 1000, 10000, 100000, 500000];

const giftNames = ['coke', 'feast', 'shoe', 'phone', 'travel', 'house'];

const countryGiftNames = {
	// ng1: 'bike',
	ng4: 'car'
};
/**
 * #{day} 日期
 * #{winning} 金额
 */
const winningTexts = [
	[
		'#{day}, you got your biggest winning of #{winning}. You got a sporty energizer in you pocket already!'
	],
	[
		'#{day}, you got your biggest winning of #{winning}. Get yourself a delicious dinner to put on your table!'
	],
	[
		'#{day}, you got your biggest winning of #{winning}. Get yourself ready for 2019 with football boots in your gifts box!'
	],
	[
		'#{day}, you got your biggest winning of #{winning}. Get yourself ready for 2019 with a new smartphone in your gifts box!'
	],
	[
		'#{day}, you got your biggest winning of #{winning}. Where are you planning on travelling to in 2019?!'
	],
	[
		'#{day}, you got your biggest winning of #{winning}. Are you getting yourself ready to buy Sporty Club?'
	]
];
/**
 * `${country}${index}` 作为国家在特定位置的文案 索引
 */
const countryWinningTexts = {
	// ng1: [
	// 	'#{day}, you got your biggest winning of #{winning}. Get yourself ready for 2019 with an Okada in your gifts box!'
	// ],
	ng4: [
		'#{day}, you got your biggest winning of #{winning}. Get yourself ready for 2019 with a keke na pep in your gifts box'
	]
};

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: getWinningAmount(),
		};
	},
	components: {
		Next,
	},
	computed: {
		...mapGetters('annual', [
			'getAmountIndex',
		]),
		...mapState('annual', [
			'bigPrizeSettleTime',
			'bigPrizeWinning',
			'selectionCount', // realSports 投注数目
		]),
		// 没有中大奖 或者 没有投注realSports, 页面不展示
		noBigPrize() {
			return this.bigPrizeWinning === 0;
		},
		// 赢的金额
		winningText() {
			let amount = this.bigPrizeWinning;
			amount = formatNumber(amount / 10000, getMoneyFraction());
			return `${showCurrency}${amount}`;
		},
		dayText() {
			return dateFormat.format(this.bigPrizeSettleTime, 'MMM D');
		},
		contentText() {
			const index = this.getAmountIndex;
			const key = this.countryIndex;
			const texts = countryWinningTexts[key] || winningTexts[index] || [];

			return texts.map(text => text.replace('#{day}', this.dayText).replace('#{winning}', this.winningText));
		},
		countryIndex() {
			const index = this.getAmountIndex;
			return `${window.country}${index}`;
		},
		gift() {
			const index = this.getAmountIndex;
			const key = this.countryIndex;
			const giftName = countryGiftNames[key] || giftNames[index];
			return GiftMap[giftName];
		}
	},
	created() {
		// 未中大奖
		if (this.noBigPrize) {
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
		// 0 - 500
		anime({
			targets: [refs.popo, refs.banner],
			scale: [0, 1],
			opacity: [0.2, 1],
			duration: 500,
			easing: 'easeInSine',
		});
		anime({
			targets: refs.floor,
			translateY: [200, 0],
			opacity: [0, 1],
			duration: 500,
			delay: 200,
			easing: 'easeInSine'
		});
		// 600
		anime({
			targets: refs.leaf,
			translateX: [-100, 0],
			duration: 300,
			delay: 300,
			easing: 'easeInSine'
		});
		// 600 - 1100
		anime({
			targets: [refs.text],
			scale: [3, 1],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 500,
			delay: 600,
		});
		anime({
			targets: refs.title,
			opacity: [0, 1],
			duration: 500,
			delay: 600,
		});
		// 1100 - 1600
		anime({
			targets: refs.gift.$el,
			scale: [3, 1],
			opacity: [0, 1],
			delay: 500,
			duration: 1100,
		});
		// 2000
		anime({
			targets: refs.content,
			opacity: [0, 1],
			delay: 1400,
			duration: 600,
			easing: 'easeInSine'
		});

		anime({
			targets: refs.bar,
			translateX: [200, 0],
			duration: 500,
			delay: 1200,
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
			// anime({
			// 	targets: refs.bar,
			// 	translateX: [0, 300],
			// 	duration: 500,
			// 	easing: 'easeInSine'
			// });
			// anime({
			// 	targets: refs.floor,
			// 	translateY: [0, 200],
			// 	opacity: [1, 0],
			// 	duration: 500,
			// 	easing: 'easeInSine'
			// });
			// anime({
			// 	targets: refs.leaf,
			// 	translateX: [0, -100],
			// 	duration: 300,
			// 	delay: 300,
			// 	easing: 'easeInSine'
			// });
			const am = anime({
				targets: [refs.container], // refs.popo
				translateX: [0, '-100%'],
				opacity: [1, 0],
				duration: 500,
				easing: 'easeOutSine'
			});
			return am.finished;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.winning-amount-wrap{
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
			transform: translateY(-100%);
			font-size: 24/@rem;
			margin-top: -8.1%;
			line-height: 22/@rem;
			color: #FFF;
			// font-weight: bold;
			text-align: center;
			white-space: nowrap;
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
		margin: 2% 0;
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
