<template>
	<div class="page-screen entry-wrap">
		<img :src="images.leafTop" class="leaf-top" ref="leafTop"/>
		<img :src="images.leafLeft" class="leaf-left" ref="leafLeft"/>
		<img :src="images.leafRight" class="leaf-right" ref="leafRight"/>
		<img :src="images.title" alt="" class="title" ref="title">
		<img :src="images.sportyLogo" alt="" class="sporty-logo" ref="sportyLogo">

		<div class="content-wrap" ref="content">
			<div class="door-wrap" ref="door">
				<img class="door-back" :src="images.doorBack" />
				<img class="door-part door-left" :src="images.doorLeft" ref="doorLeft" />
				<img class="door-part door-right" :src="images.doorRight" ref="doorRight"/>
			</div>
			<div class="decoration-wrap">
				<img :src="images.doorLight" alt="" class="door-light" ref="light"/>
				<img :src="images.doorDecoration" alt="" class="door-decoration" ref="decoration"/>
				<img :src="images.wine" alt="" class="door-wine" ref="wine"/>
				<img :src="images.doorShadow" alt="" class="door-shadow" ref="shadow"/>
				<div class="btn-wrap" ref="btn">
					<img :src="images.buttonBack" alt="" class="door-button-back" />
					<div class="btn-start" @click="onStart" ref="start">TAP TO START</div>
				</div>
			</div>
		</div>

		<!-- checkbox -->
		<div class="agreement-wrap" ref="agree">
			<!-- <span :class="['check-box', checkedCls]"></span> -->
			<span class="text">BY CLICKING THE TAP TO START BUTTON, YOU AGREE WITH SPORTYBET COLLECTING YOUR DATA.</span>
		</div>
		<audio :src="audioSrc" class="audio" preload="auto" ref="audio" width="0" height="0" style="visibility: hidden"></audio>
		<ChipLayer :delay="2000"/>
	</div>
</template>

<script>
// 入口页

import { loginPromise } from 'components/login/tools';
import { mapGetters, mapMutations } from 'vuex';
import anime from 'animejs';
import { goNextRoute } from '../router/config';
import vueMixin from '../vue-mixin.js';
import ChipLayer from '../components/random-chips-layer';
import { entry, getNewCustomer } from '../images/config';
import { getData, preLoadImages } from '../util';
import audioSrc from '../images/audio.wav';

export default {
	mixins: [vueMixin],
	components: {
		ChipLayer,
	},
	data() {
		return {
			images: entry,
			// checked: true, // 默认同意协议
			loaded: false,
			audioSrc,
		};
	},
	computed: {
		...mapGetters('annual', [
			'isNewCustomer'
		]),
		// checkedCls() {
		// 	return this.checked ? 'checked' : '';
		//
	},
	watch: {
		isNewCustomer() {
			// 检查是否是新用户，提前拉取图片
			if (this.isNewCustomer) {
				// 加载new-customer 图片
				const images = getNewCustomer();
				const list = Object.values(images);
				preLoadImages(list);
			}
		}
	},
	mounted() {
		// leaf  0-800
		anime({
			targets: this.$refs.leafTop,
			translateY: [-200, 0],
			duration: 800,
			easing: 'easeInSine'
		});
		anime({
			targets: this.$refs.leafLeft,
			translateX: [-200, 0],
			duration: 800,
			easing: 'easeInSine'
		});
		anime({
			targets: this.$refs.leafRight,
			translateX: [200, 0],
			duration: 800,
			easing: 'easeInSine'
		});
		// logo title  800 - 1800
		anime({
			targets: this.$refs.sportyLogo,
			translateY: [-200, 0],
			translateX: [-200, 0],
			duration: 600,
			delay: 800,
			easing: 'easeInSine',
		});
		anime({
			targets: this.$refs.title,
			scale: [0.2, 1],
			opacity: [0, 1],
			translateX: ['-150%', '-50%'],
			duration: 600,
			delay: 1200,
			easing: 'easeInSine',
		});
		// doorr 1800 - 2400
		anime({
			targets: [this.$refs.door, this.$refs.decoration, this.$refs.shadow],
			opacity: [0, 1],
			duration: 400,
			delay: 1800,
			easing: 'easeInSine',
		});

		anime({
			targets: this.$refs.decoration,
			scaleX: [0.5, 1],
			translateY: ['-100%', '-100%'],
			translateX: ['-100%', '-50%'],
			duration: 600,
			delay: 1800,
			easing: 'easeInCubic',
		});

		anime({
			targets: this.$refs.wine,
			// scale: [2, 1],
			opacity: [0, 1],
			translateY: ['-200%', '-100%'],
			translateX: ['-50%', '-50%'],
			delay: 2200,
			duration: 200,
			easing: 'easeInSine',
		});
		// 2000 -
		anime({
			targets: this.$refs.doorRight,
			rotateY: [0, '-24deg'],
			duration: 800,
			delay: 2400,
			easing: 'easeInSine'
		});
		// const light = anime.timeline();
		anime({
			targets: this.$refs.light,
			opacity: [0, 1],
			scaleX: [0.4, 1],
			translateY: ['-100%', '-100%'],
			duration: 800,
			delay: 2400,
			// loop: true,
			// direction: 'alertnate',
			easing: 'easeInSine'
		});

		anime({
			targets: this.$refs.btn,
			opacity: [0, 1],
			scale: [0.1, 1],
			duration: 800,
			delay: 2600,
			easing: 'easeInSine'
		});
		// 缩放 start
		anime({
			targets: this.$refs.start,
			// delay: 1000,
			opacity: [1, 0.6],
			// fontSize: ['2.17rem', '2rem'],
			scale: [1, 0.95],
			translateY: ['-50%', '-50%'],
			translateX: ['-50%', '-50%'],
			duration: 1500,
			loop: true,
			direction: 'alternate',
			easing: 'linear',
		});

		// 检验登录状态，提前获取数据
		if (window.loginStatus) {
			this.getSummaryData();
		}
	},
	methods: {
		...mapMutations('annual', [
			'UPDATE_DATA'
		]),
		// onToggleChecked() {
		// 	this.checked = !this.checked;
		// },
		onStart() {
			this.$nextTick(async () => {
				// 异常捕获
				try {
					// check 是否登录
					await loginPromise();
					// 拉取数据
					await this.getSummaryData();
					await this.leaveAnimate();
					this.goNext();
				} catch (e) {
					console.log(e);
				}
			});
		},
		goNext() {
			// TODO 根据用户身份状态 和 当前页面位置，跳转到下一页
			if (this.isNewCustomer) {
				this.$router.push({
					name: 'new-customer'
				});
			} else {
				goNextRoute.call(this);
			}
		},
		async getSummaryData() {
			if (this.loaded) {
				return;
			}
			// 拉取数据 需要等待， 打开大门进度
			const data = await getData();
			this.UPDATE_DATA(data);
			this.loaded = true;
		},
		leaveAnimate() {
			this.$refs.audio.play();

			anime({
				targets: this.$refs.doorRight,
				rotateY: ['-24deg', '-100deg'],
				duration: 600,
				// delay: 600,
				easing: 'easeInSine'
			});

			anime({
				targets: this.$refs.doorLeft,
				rotateY: ['0deg', '100deg'],
				duration: 600,
				// delay: 600,
				easing: 'easeInSine'
			});
			anime({
				targets: this.$refs.light,
				opacity: [1, 0],
				duration: 600,
				// delay: 600,
				easing: 'easeInSine',
			});

			anime({
				targets: this.$el,
				scale: [1, 3.5],
				// opacity: [1, 0.5],
				translateY: [0, '-13%'],
				duration: 1000,
				// delay: 600,
				easing: 'easeInSine'
			});
			anime({
				targets: this.$el,
				opacity: [1, 0],
				delay: 600,
				duration: 400,
				easing: 'easeInSine',
			});
			anime({
				targets: this.$refs.agree,
				opacity: [1, 0],
				duration: 300,
			});
			return new Promise(resolve => {
				setTimeout(resolve, 1000);
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.entry-wrap{
	transform-origin: center center;
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
	.title{
		position: absolute;
		top: 0;
		left: 57%;
		transform: translateX(-50%);
		margin-top: 20%;
		width: 76.9%;
		transform-origin: center center;
	}
	.sporty-logo{
		position: absolute;
		top: 0;
		right: 0;
		width: 24.7%;
	}
	.content-wrap{
		position: absolute;
		bottom: 0;
		margin-bottom: 43%;
		width: 100%;
		transform-origin: center center;
		z-index: 10;
	}
	@doorWidth: 46%;
	.door-wrap{
		position: absolute;
		left: 50%;
		transform: perspective(500px) translateX(-50%) translateY(-100%);
		width: @doorWidth;
		z-index: 100;
		perspective: 500px;
		perspective-origin: center bottom;
		border-top-left-radius: @doorWidth/2;
		border-top-right-radius: @doorWidth/2;
		overflow: hidden;
		// border: 1px solid #FFF;
		.door-back{
			width: 100%;
		}
		.door-part{
			width: 50%;
		}
		.door-left{
			position: absolute;
			bottom: 0;
			left: 0;
			height: 100%;
			transform-origin: left 100%;
		}
		.door-right{
			position: absolute;
			bottom: 0;
			right: 0;
			height: 100%;
			transform: rotateY(-24deg);
			transform-origin: right bottom;
		}
	}
	.decoration-wrap{
		position: absolute;
		width: 100%;
		.door-light{
			position: absolute;
			width: 49.2%;
			left: 50%;
			transform: translateY(-100%);
			margin-top: 6.5%;
			z-index: 150;
			transform-origin: left bottom;
		}
		.door-decoration{
			position: absolute;
			left: 50%;
			top: 0;
			// transform-origin: center center;
			transform: translateY(-100%) translateX(-50%);
			margin-top: 24/@rem;
			width: 98.75%;
		}
		.door-wine{
			position: absolute;
			width:  14.9%;
			transform: translateY(-100%) translateX(-50%);
			left: 50%;
			margin-left: @doorWidth/ 2;
			z-index: 151;
			transform-origin: center bottom;
		}
		.door-shadow{
			position: absolute;
			left: 50%;
			transform: translateX(-50%) translateY(-10px);
			width: 340/@rem;
		}
	}
	.btn-wrap{
		width: 100%;
		.door-button-back{
			position: absolute;
			width: 74.3%;
			left: 50%;
			transform: translateX(-50%);
			margin-top: -5.5%;
		}
		.btn-start{
			position: absolute;
			width: 50%;
			left: 50%;
			margin-top: 12%;
			color: #1c1814;
			font-size: 26/@rem;
			// font-weight: bold;
			text-align: center;
			transform: translateX(-50%) translateY(-50%);
			transform-origin: -25% -25%;
		}
	}
}
.agreement-wrap{
	display: flex;
	align-items: center;
	box-sizing: border-box;

	position: absolute;
	bottom: 12/@rem;
	width: 100%;
	box-sizing: border-box;
	padding: 0 20/@rem;
	z-index: 10;
	.check-box{
		flex-basis: 20/@rem;
		flex-shrink: 0;
		line-height: 16/@rem;
		width: 16/@rem;
		height: 16/@rem;
		.m-icon-check();
		&::before{
			color: #8d8d8d;
		}
	}
	.checked{
		.m-icon-check--fill--checked();
		&::before{
			color: #449515;
		}
	}
	.text{
		flex: 1;
		line-height: 1.2;
		color: #8d8d8d;
		font-size: 10/@rem;
	}
}
@media screen and (max-height: 480px) {
	.entry-wrap{
		.content-wrap{
			margin-bottom: 30%;
		}
		.title{
			margin-top: 15%;
		}
		.agreement-wrap{
			bottom: 0;
		}
	}
}
.wrap-aspect-ratio{
	.entry-wrap{
		.content-wrap{
			margin-bottom: 30%;
		}
		.title{
			margin-top: 15%;
		}
		.agreement-wrap{
			bottom: 0;
		}
	}
}

@media screen and (min-height: 810px){
	.entry-wrap{
		.content-wrap{
			margin-bottom: 56%;
		}
		.title{
			margin-top: 25%
		}
	}
}

</style>

