<template>
	<div class="page screen new-customer-wrap">
		<img :src="images.leafTop" alt="" class="leaf-top">
		<img :src="images.leafLeft" alt="" class="leaf-left">
		<img :src="images.leafRight" alt="" class="leaf-right">
		<!-- <img :src="images.title" alt="" class="title"> -->
		<div class="text" ref="text">YOU HAVE YET TO PLACE ANY <br/> BETS WITH THE SPORTY CLUB  <br/> THIS YEAR</div>
		<img :src="images.sportyLogo" alt="" class="sporty-logo">
		<div class="shield-wrap">
			<img :src="images.shield" alt="" class="shield" ref="shield">
			<img :src="images.smallLeafLeft" alt="" class="small-leaf-left" ref="smallLeafLeft">
			<img :src="images.orangeLeaf" alt="" class="orange-leaf" ref="orangeLeaf">
			<img :src="images.football" alt="" class="football" ref="football">
			<img :src="images.smallLeafRight" alt="" class="small-leaf-right" ref="smallLeafRight">
			<img :src="images.greenLeaf" alt="" class="green-leaf" ref="greenLeaf">
			<img :src="images.wine" alt="" class="wine" ref='wine'>
		</div>
		<img :src="images.betNow" class="btn-bet-now" ref="bet" @click="goHome"/>
		<ChipLayer />
	</div>
</template>
<script>
import anime from 'animejs';
import { goHome } from 'appCore/util';
import { getNewCustomer } from '../images/config';
import ChipLayer from '../components/random-chips-layer';

export default {
	data() {
		return {
			images: getNewCustomer(),
		};
	},
	components: {
		ChipLayer,
	},
	mounted() {
		const refs = this.$refs;
		anime({
			targets: refs.text,
			opacity: [0, 1],
			translateY: [-200, 0],
			duration: 600,
			easing: 'easeInSine'
		});
		const delay = 600;
		anime({
			targets: refs.shield,
			opacity: [0, 1],
			scale: [1.5, 1],
			translateY: ['-200%', '-100%'],
			translateX: ['-25%', '-50%'],
			duration: 800,
			delay,
			easing: 'easeInElastic',
		});

		anime({
			targets: refs.wine,
			rotate: ['-20deg', 0],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 400,
			delay: 800 + delay,
			easing: 'easeInSine',
		});
		anime({
			targets: [refs.smallLeafRight, refs.greenLeaf],
			rotate: ['-10deg', 0],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 400,
			delay: 1100 + delay,
			easing: 'easeInSine'
		});
		anime({
			targets: refs.football,
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			translateX: [-200, 0],
			duration: 500,
			delay: 1000 + delay,
		});
		anime({
			targets: [refs.smallLeafLeft, refs.orangeLeaf],
			rotate: ['10deg', 0],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 400,
			delay: 1200 + delay,
			easing: 'easeInSine'
		});

		anime({
			targets: refs.bet,
			translateY: ['100%', 0],
			translateX: ['-50%', '-50%'],
			opacity: [0, 1],
			delay: 1600 + delay,
			duration: 400,
		});
	},
	methods: {
		goHome() {
			goHome();
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.new-customer-wrap{
	.leaf-top{
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 10;
	}
	.leaf-left{
		position: absolute;
		left: 0;
		width: 11.8%;
	}
	.leaf-right{
		position: absolute;
		right: 0;
		width: 13.6%;
	}
	.text{
		position: absolute;
		top: 0;
		margin-top: 26%;
		width: 100%;
		text-align: center;
		color: #ffd980;
		font-size: 16/@rem;
		font-family: 'Helvetica, Verdana, Menlo, "Gill Sans", arial, simsun';
		text-shadow: 0 2px 3px rgba(18, 7, 68, 0.52);
	}
	.sporty-logo{
		position: absolute;
		top: 0;
		right: 0;
		width: 24.7%;
	}
	.shield-wrap{
		position: absolute;
		width: 100%;
		margin-top: 136%;
	}
	.shield{
		position: absolute;
		width: 85.8%;
		transform: translateY(-100%) translateX(-50%);
		left: 50%;
		z-index: 50;
		transform-origin: center bottom;
	}
	.small-leaf-left{
		position: absolute;
		width: 20.7%;
		transform: translateY(-100%);
		margin: -14% 0 0 4%;
	}
	.orange-leaf{
		position: absolute;
		width: 29.2%;
		transform: translateY(-100%);
		margin: -2% 0 0 6%;
	}
	.football{
		position: absolute;
		width: 17%;
		transform: translateY(-100%);
		margin: 3% 0 0 24%;
	}
	.small-leaf-right{
		position: absolute;
		width: 15.6%;
		margin: -26% 0 0 78%;
		transform: translateY(-100%);
	}
	.green-leaf{
		position: absolute;
		width: 31.5%;
		margin: -9% 0 0 69%;
		transform: translateY(-100%);
	}
	.wine{
		position: absolute;
		width: 35.3%;
		margin: 10% 0 0 58%;
		transform: translateY(-100%);
		z-index: 51;
		transform-origin: left bottom;
	}
	.home-link{
		display: block;
		width: 100%;
	}
	.btn-bet-now{
		position: absolute;
		width: 66.7%;
		bottom: 0;
		left: 50%;
		margin-bottom: 6%;
		transform: translateX(-50%);
		z-index: 100;
	}
}
</style>
