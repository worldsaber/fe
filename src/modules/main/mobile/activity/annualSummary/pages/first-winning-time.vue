<template>
	<div class="page-screen first-winning-wrap">
		<img :src="images.flagTop" alt="" class="flag-top" ref="flagTop"/>
		<img :src="images.firework" alt="" class="firework" ref="firework"/>
		<div class="stage-wrap" ref="stageWrap">
			<img :src="images.stage" alt="" class="stage" ref="stage"/>
			<img :src="images.gift" alt="" class="gift" ref="gift" v-if="isNeverWin"/>
			<img :src="images.trophy" alt="" class="trophy" ref="trophy" v-else/>
			<img :src="images.football" alt="" class="football" ref="football"/>
		</div>
		<img :src="images.photo" alt="" class="photo" ref="photo"/>
		<img :src="images.flagBottom" alt="" class="flag-bottom" ref="flagBottom"/>
		<img :src="images.leafLeft" alt="" class="leaf-left" ref="leafLeft"/>
		<img :src="images.leafRight" alt="" class="leaf-right" ref="leafRight"/>
		<div class="content-wrap" ref="content">
			<Border color="#18BBC7" :left="-6" :top="6"/>
			<div class="sporty-logo"></div>
			<div class="content-text" v-for="(text, index) in contentText" :key="index" v-html="text"> </div>
		</div>
		<Next @click.native="onNext" ref="next" />
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import dateFormat from 'kernel/js/dateFormat';
import anime from 'animejs';
import vueMixin from '../vue-mixin.js';

import { getFirstWinning } from '../images/config';
import { getMoneyFraction } from '../util';
import Next from '../components/next.vue';
import Border from '../components/border.vue';

/**
 * #{firstOrderTimeText} 首次投注的时间
 * #{day} 表示注册后第几天 赢了第一注
 * #{winning} 表示 投注赢得的金额
 * #{betOrder} 表示 第几个投注
 */
const winningGreetings = [
	[
		'ON <em>#{firstOrderTime}</em>, YOU PLACED THE FIRST BET AND WON <em>#{winning}!!</em>',
		'WOAH, WHAT A <em>LUCKY</em> PERSON YOU MUST BE!'
	],
	[
		'ON <em>#{firstOrderTime}</em>, YOU PLACED THE FIRST BET. AFTER <em>#{day}</em>, YOU WON <em>#{winning}!!</em>',
		'YOU ARE A <em>KING</em> PLAYER!'
	],
	[
		'ON <em>#{firstOrderTime}</em>, YOU PLACED THE FIRST BET. AFTER <em>#{day}</em>, YOU WON <em>#{winning}!!</em>',
		'WAHT AN ACE!'
	],
	[
		'ON <em>#{firstOrderTime}</em>, YOU PLACE THE FIRST BET!!',
		'KEEP ON , A PRETTY BIG WIN IS WAITING FOR YOU!'
	]
];

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: getFirstWinning(),
		};
	},
	components: {
		Next,
		Border,
	},
	computed: {
		...mapGetters('annual', [
			'isNeverWin',
		]),
		...mapState('annual', [
			'registTime',
			'firstPrizeSequence',
			'firstPrizeWinning',
			'firstPrizeTime',
			'firstPrizeSettleTime',
			'firstOrderTime'
		]),
		// 注册后 天数
		diffTime() {
			let distance = (this.firstPrizeSettleTime || this.firstPrizeTime) - this.firstOrderTime;
			distance /= 1000;
			// s
			if (distance < 60) {
				return {
					value: distance,
					unit: 'second'
				};
			}
			distance /= 60;
			// min
			if (distance < 60) {
				return {
					value: distance,
					unit: 'minute'
				};
			}
			distance /= 60;
			// hr
			if (distance < 24) {
				return {
					value: distance,
					unit: 'hour'
				};
			}
			distance /= 24;

			return {
				value: distance,
				unit: 'day'
			};
		},
		// TODO 首次投注的时间，不是注册时间，需要增加字段
		firstOrderTimeText() {
			return dateFormat.format(this.firstOrderTime, 'MMM D');
		},
		// 赢的金额
		winningText() {
			let amount = this.firstPrizeWinning;
			amount = formatNumber(amount / 10000, getMoneyFraction());
			return `${showCurrency}${amount}`;
		},
		dayText() {
			const { value, unit } = this.diffTime;
			// time 异常时
			if (value < 0) {
				return 'serveral days';
			}
			return `${Math.floor(value)} ${value > 1 ? `${unit}s` : `${unit}`}`;
		},
		betOrderText() {
			const suffix = ['th', 'st', 'nd', 'rd']; // 0, 1, 2, 3 编号后缀，其余默认th
			const order = `${this.firstPrizeSequence}`;
			const lastNum = parseInt(order[order.length - 1], 10);

			return `${order}${suffix[lastNum] || 'th'}`;
		},
		// 首次投且赢
		isWinAtFirst() {
			return this.firstPrizeSequence === 1;
		},
		// 7次内赢
		isWinWithinSeven() {
			return this.firstPrizeSequence <= 7 && this.firstPrizeSequence > 1;
		},
		// 7次后赢
		isWinAfterSeven() {
			return this.firstPrizeSequence > 7;
		},
		// 从未赢
		// isNeverWin() {
		// 	return !this.firstPrizeSequence; // 不存在或者0
		// },
		contentText() {
			let index = -1;
			if (this.isWinAtFirst) {
				index = 0;
			} else if (this.isWinWithinSeven) {
				index = 1;
			} else if (this.isWinAfterSeven) {
				index = 2;
			} else if (this.isNeverWin) {
				index = 3;
			}

			if (index > -1) {
				const texts = winningGreetings[index];
				return this.fillTemplate(texts);
			}

			return [];
		}

	},
	mounted() {
		const refs = this.$refs;

		anime({
			targets: refs.flagTop,
			rotateZ: ['60deg', 0],
			translateX: [-100, 0],
			duration: 400,
			easing: 'easeInSine',
		});
		anime({
			targets: this.isNeverWin ? refs.gift : refs.trophy,
			scale: [0.3, 1],
			opacity: [0, 1],
			translateY: [-200, 0],
			translateX: [-100, 0],
			duration: 800,
			delay: 400,
		});
		anime({
			targets: refs.firework,
			opacity: [0.2, 1],
			duration: 1000,
			delay: 600,
			easing: 'easeInSine',
			// loop: true
		});
		anime({
			targets: refs.stage,
			translateY: ['-100%', 0],
			duration: 400,
			easing: 'easeInSine',
		});
		anime({
			targets: refs.football,
			translateX: [-100, 0],
			duration: 300,
			delay: 800,
			easing: 'easeInSine',
		});

		anime({
			targets: refs.photo,
			scale: [2, 1],
			opacity: [0, 1],
			// left: ['-100%', 0],
			// top: ['-100%', 0],
			duration: 500,
			delay: 700,
		});
		anime({
			targets: refs.flagBottom,
			translateX: ['100%', 0],
			duration: 400,
			delay: 1000,
			easing: 'easeInSine',
		});
		anime({
			targets: refs.leafLeft,
			translateX: [-100, 0],
			translateY: ['-100%', '-88%'],
			duration: 300,
			delay: 1000,
			easing: 'easeInSine'

		});
		anime({
			targets: refs.leafRight,
			translateX: [100, 0],
			translateY: ['100%', '40%'],
			duration: 300,
			delay: 1000,
			easing: 'easeInSine'

		});
		anime({
			targets: refs.content,
			opacity: [0, 1],
			translateX: ['-100%', 0],
			duration: 300,
			delay: 1500,
			easing: 'easeInSine'
		});
	},
	methods: {
		fillTemplate(templates) {
			return templates.map(text => text.replace('#{day}', this.dayText.toUpperCase())
				.replace('#{winning}', this.winningText.toUpperCase())
				.replace('#{firstOrderTime}', this.firstOrderTimeText.toUpperCase()));
		},
		onNext() {
			const prom = this.leaveAnimate();
			prom.then(() => {
				this.$refs.next.goNext();
			});
		},
		leaveAnimate() {
			const refs = this.$refs;
			anime({
				targets: refs.content,
				opacity: [0, 1],
				translateX: [0, '-150%'],
				duration: 400,
				easing: 'easeInSine'
			});

			anime({
				targets: refs.leafLeft,
				translateX: [0, -100],
				translateY: ['-88%', '-100%'],
				duration: 400,
				easing: 'easeInSine'

			});
			anime({
				targets: refs.leafRight,
				translateX: [0, 100],
				translateY: ['40%', '100%'],
				duration: 400,
				easing: 'easeInSine'
			});
			anime({
				targets: refs.flagBottom,
				translateX: [0, '100%'],
				duration: 400,
				easing: 'easeInSine',
			});

			anime({
				targets: [refs.stageWrap, refs.firework, refs.photo, refs.flagTop],
				opacity: [1, 0],
				translateY: [0, -500],
				duration: 600,
				delay: 300,
				easing: 'easeInSine'
			});

			return new Promise(resolve => {
				setTimeout(resolve, 900);
			});
		}

	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.first-winning-wrap{
	.flag-top{
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		transform-origin: right top;
		z-index: 10;
	}
	.flag-bottom{
		position: absolute;
		right: 0;
		width: 100%;
		bottom: 80/@rem;
	}
	.firework{
		position: absolute;
		width: 100%;
		top: 0;
		z-index: 50;
	}
	.stage-wrap{
		position: absolute;
		width: 100%;
		height: 496.5/@rem;
	}
	.stage{
		position: absolute;
		width: 100%;
		top: 0;
	}
	.trophy{
		position: absolute;
		width: 68.3%;
		left: 28.5%;
		margin-top: 30%;
		z-index: 60;
	}
	.gift{
		position: absolute;
		width: 55.1%;
		left: 23.5%;
		margin-top: 47%;
		z-index: 60;
		transform-origin: center center;
		perspective: 500/@rem;
	}
	.photo{
		position: absolute;
		left: 0;
		top: 20/@rem;
		width: 98%;
		z-index: 200;
	}
	.content-wrap{
		position: absolute;
		bottom: 64/@rem;
		left: 10%;
		right: 5%;
		z-index: 500;
		padding: 18/@rem;
		line-height: 1.8;
		box-sizing: border-box;
		font-size: 16/@rem;
		background-image: linear-gradient(to bottom, #1c3e81, #1c3e81), linear-gradient(184deg, #3b47fb 1%, #20ffd1);
		color: #FFF;
		text-shadow: 0px 1px 3.9px rgba(49, 36, 127, 0.84);
		line-height: 1.2;
		em{
			font-size: 30/@rem;
			color: #fffe2e;
		}
	}
	.leaf-left{
		position: absolute;
		width: 18.9%;
		left: 0;
		top: 0;
		margin-top: 130%;
		z-index: 600;
	}
	.leaf-right{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 20.6%;
		margin-bottom: 20%;
		z-index: 600;
	}
	.football{
		position: absolute;
		width: 20.3%;
		left: 0;
		margin-top: 79%;
	}
	.sporty-logo{
		position: absolute;
		.m-icon-logo();
		transform: rotate(10deg);
		transform-origin: center center;
		z-index: -1;
		// bottom: 0;
		&::before{
			font-size: 72/@rem;
			color: rgba(66, 130, 184, 0.4);
			line-height: 1;
		}
	}
}
@media screen and (max-height: 480px){
	.first-winning-wrap{
		.content-wrap{
			bottom: 36/@rem;
			padding: 16/@rem 16/@rem 4/@rem;
			em{
				font-size: 24/@rem;
			}
		}
		.photo, .stage-wrap{
			margin-top: -10%;
		}
	}
}
.wrap-aspect-ratio{
	.first-winning-wrap{
		.content-wrap{
			bottom: 36/@rem;
			padding: 16/@rem 16/@rem 4/@rem;
			em{
				font-size: 24/@rem;
			}
		}
		.photo, .stage-wrap{
			margin-top: -10%;
		}
	}
}
@media screen and (min-height: 810px){
	.first-winning-wrap{
		.content-wrap{
			bottom: 100/@rem;
		}
		.leaf-right{
			margin-bottom: 32%;
		}
	}
}
</style>

