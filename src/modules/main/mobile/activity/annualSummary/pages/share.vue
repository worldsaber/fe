<template>
	<div class="share-wrap">
		<img :src="images.leafTop" alt="" class="leaf-top" ref="leafTop">
		<img :src="images.leafLeft" alt="" class="leaf-left" ref="leafLeft">
		<img :src="images.leafRight" alt="" class="leaf-right" ref="leafRight">
		<img :src="images.sportyLogo" alt="" class="sporty-logo" ref="sportyLogo">
		<div class="content-wrap">
			<img :src="images.unit" alt="" class="unit" ref="unit">
			<img :src="images.adj" alt="" class="adj" ref="adj">
			<img :src="images.noun" alt="" class="noun" ref="noun">
			<div class="text" ref="text">IN SPORTY CLUB</div>
		</div>
		<div class="animal-wrap">
			<img :src="images.animal" alt="" class="animal" ref="animal">
			<img :src="images.glow" alt="" class="glow glow-animated" ref="glow"/>
			<img :src="images.smallLeafLeft" alt="" class="small-leaf-left" ref="smallLeafLeft">
			<img :src="images.orangeLeaf" alt="" class="orange-leaf" ref="orangeLeaf">
			<img :src="images.football" alt="" class="football" ref="football">
			<img :src="images.smallLeafRight" alt="" class="small-leaf-right" ref="smallLeafRight">
			<img :src="images.greenLeaf" alt="" class="green-leaf" ref="greenLeaf">
			<img :src="images.wine" alt="" class="wine" ref='wine'>
		</div>
		<img :src="images.share" alt="" class="share" ref="share" @click="onClickShare">
		<ChipLayer :delay="0"/>
		<Share v-show="showShare" :shareCfg="shareCfg" @close-share="close" @succ-share="close"/>
	</div>
</template>
<script>
import anime from 'animejs';
import { mapGetters } from 'vuex';
import Share from 'components/share/index.vue';
import { getShare } from '../images/config';
import ChipLayer from '../components/random-chips-layer';
import { getShareKey } from '../util';

export default {
	data() {
		const url = `https://www.sportybet.com/${window.country || 'ke'}/m/promotion/annual_summary`;

		return {
			images: getShare(),
			showShare: false,
			shareCfg: {
				text: 'Annual Summary - My Position in the Sporty Club',
				url,
				// quote: 'SportyBet',
				via: 'sportybet',
				hashtag: 'SportyBet',
				whatsapp: {
					text: 'Annual summary - Check your level in the Sporty Club',
				},
				fb: {},
				twitter: {},
			}
		};
	},
	computed: {
		...mapGetters('annual', {
			adjText: 'getAdjText',
			nounText: 'getNounText',
		}),
	},
	created() {
		this.shareCfg.url = `https://www.sportybet.com/${window.country || 'ke'}/m/promotion/annual_summary/${getShareKey(this.adjText, this.nounText)}`;
	},
	components: {
		ChipLayer,
		Share
	},
	mounted() {
		const refs = this.$refs;
		// leaf  0-600
		anime({
			targets: refs.leafTop,
			translateY: [-200, 0],
			duration: 600,
			easing: 'easeInSine'
		});
		anime({
			targets: refs.leafLeft,
			translateX: [-200, 0],
			duration: 600,
			easing: 'easeInSine'
		});
		anime({
			targets: refs.leafRight,
			translateX: [200, 0],
			duration: 600,
			easing: 'easeInSine'
		});
		anime({
			targets: refs.sportyLogo,
			translateY: [-200, 0],
			translateX: [-200, 0],
			duration: 600,
			delay: 600,
			easing: 'easeInSine',
		});
		// 600 -
		anime({
			targets: [refs.unit, refs.adj, refs.noun, refs.text],
			translateY: [-200, 0],
			opacity: [0, 1],
			duration: 600,
			delay: (target, index) => (index * 300) + 600,
			easing: 'easeInSine'
		});

		const animal = anime({
			targets: refs.animal,
			scale: [0.2, 1],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			translateX: ['-50%', '-50%'],
			marginTop: [0, '14%'],
			duration: 800,
			delay: 2400,
			elasticity: 600,
			easing: 'easeOutElastic',
			// easing: [1.000, 0.140, 0.970, 0.490],
		});

		animal.finished.then(() => {
			anime({
				targets: refs.glow,
				opacity: [0.4, 1],
				duration: 1000,
				loop: true,
				easing: 'linear',
				direction: 'alternate',
			});
		});

		anime({
			targets: refs.share,
			opacity: [0, 1],
			translateY: ['-100%', '0'],
			translateX: ['-50%', '-50%'],
			duration: 600,
			delay: 3400,
		});

		const delay = 2800;
		anime({
			targets: refs.wine,
			rotate: ['-20deg', 0],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 400,
			delay,
			easing: 'easeInSine',
		});
		anime({
			targets: [refs.smallLeafRight, refs.greenLeaf],
			rotate: ['-10deg', 0],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 400,
			delay: delay + 300,
			easing: 'easeInSine'
		});
		anime({
			targets: refs.football,
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			translateX: [-200, 0],
			duration: 500,
			delay: delay + 200,
		});
		anime({
			targets: [refs.smallLeafLeft, refs.orangeLeaf],
			rotate: ['10deg', 0],
			opacity: [0, 1],
			translateY: ['-100%', '-100%'],
			duration: 400,
			delay: delay + 400,
			easing: 'easeInSine'
		});
	},
	methods: {
		onClickShare() {
			this.showShare = true;
		},
		close() {
			this.showShare = false;
		},
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.share-wrap{
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

	.sporty-logo{
		position: absolute;
		top: 0;
		right: 0;
		width: 24.7%;
	}
	.animal-wrap{
		position: absolute;
		width: 100%;
		margin-top: 139%;
	}
	.animal{
		position: absolute;
		width: 58.9%;
		transform: translateY(-100%) translateX(-50%);
		margin-top: 14%;
		left: 50%;
		z-index: 49;
		transform-origin: left top;
	}
	.glow{
		position: absolute;
		width: 75.1%;
		transform: translateY(-100%) translateX(-50%);
		margin-top: 14%;
		left: 50%;
		z-index: 48;
		transform-origin: center center;
		opacity: 0;
	}
	.small-leaf-left{
		position: absolute;
		width: 20.7%;
		transform: translateY(-100%);
		margin: -14% 0 0 8%;
	}
	.orange-leaf{
		position: absolute;
		width: 29.2%;
		transform: translateY(-100%);
		margin: -2% 0 0 8%;
	}
	.football{
		position: absolute;
		width: 17%;
		transform: translateY(-100%);
		margin: 3% 0 0 22%;
	}
	.small-leaf-right{
		position: absolute;
		width: 15.6%;
		margin: -27% 0 0 76%;
		transform: translateY(-100%);
	}
	.green-leaf{
		position: absolute;
		width: 31.5%;
		margin: -9% 0 0 67%;
		transform: translateY(-100%);
	}
	.wine{
		position: absolute;
		width: 28%;
		margin: 3% 0 0 63%;
		transform: translateY(-100%);
		z-index: 50;
		transform-origin: left bottom;
	}
	.share{
		position: absolute;
		width: 61.8%;
		bottom: 0;
		margin-bottom: 6%;
		left: 50%;
		transform: translateX(-50%);
		// background: url('../images/share/share.png') center center no-repeat;
		// background-size: 100% 100%;

		cursor: pointer;
		z-index: 100;
	}
	.content-wrap{
		position: absolute;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 16%;
		.unit{
			width: 63.3%;
			margin: 1% 0;
		}
		.noun{
			height: 32/@rem;
			margin: 1% 0;
		}
		.adj{
			height: 32/@rem;
			margin: 1% 0;
		}
		.text{
			color: #f0bd3f;
			font-size: 18/@rem;
			letter-spacing: 4px;
			margin-top: 2%;
		}
	}
}
@media screen and (max-height: 480px){
	.share-wrap{
		.content-wrap{
			margin-top: 11%;
		}
		.animal-wrap{
			margin-top: 132%;
		}
		
		.share{
			margin-bottom: 4%;
			width: 55%;
		}
	}
}
.wrap-aspect-ratio{
	.share-wrap{
		.content-wrap{
			margin-top: 11%;
		}
		.animal-wrap{
			margin-top: 132%;
		}
		
		.share{
			margin-bottom: 4%;
			width: 55%;
		}
	}
}
@media screen and (min-height: 810px){
	.share-wrap{
		.content-wrap{
			margin-top: 25%;
		}
		.animal-wrap{
			margin-top: 160%;
		}
	
		.share{
			margin-bottom: 14%;
		}
	}
}
</style>

