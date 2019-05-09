<template>
	<div class="page-screen stake-location-wrap">
		<CommonContinent />
		<div class="content-wrap" ref="content" :style="contentStyle">
			<div class="continents-label"><em>2018</em>, {{ 'SportyBet with you explored' | toUpperCase}}</div>
			<div class="continents-text">{{continents.join(', ') | toUpperCase}}</div>
			<Border color="#03e879" :left="-6" :top="9"/>
		</div>
		<Next ref="next" @click.native="onNext"/>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import anime from 'animejs';

import Border from '../components/border.vue';
import CommonContinent from './common-continent.vue';
import Next from '../components/next.vue';
import vueMixin from '../vue-mixin.js';

import { getContinent } from '../images/config';

export default {
	mixins: [vueMixin],
	components: {
		Border,
		CommonContinent,
		Next
	},
	data() {
		return {
			images: getContinent(),
		};
	},
	computed: {
		...mapGetters('annual', [
			'getContinentsLight'
		]),
		// TODO 投注里面灭有大洲
		isNoContinent() {
			return !this.getContinentsLight;
		},
		continents() {
			return this.getContinentsLight.split(',');
		},
		contentStyle() {
			return {
				backgroundImage: `url(${this.images.light})`
			};
		}
	},
	mounted() {
		// 0 - 600
		anime({
			targets: this.$refs.content,
			opacity: [0, 1],
			translateX: ['-80%', 0],
			duration: 600,
			easing: 'easeInSine',
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
			const an = anime({
				targets: this.$refs.content,
				opacity: [1, 0],
				translateX: [0, '-100%'],
			});
			return an.finished;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.stake-location-wrap{
	.content-wrap{
		position: absolute;
		top: 0;
		left: 0;
		width: 72%;
		margin: 10% 0 0 10%;
		padding: 18/@rem 12/@rem;
		background-color: #442c1d;
		background-size: 100% 100%;
		.continents-text{
			color: #03e879;
			font-size: 30/@rem;
			line-height: 1.25;
			word-break: break-word;
		}
		em{
			color: #FFF;
			font-size: 30/@rem;
			line-height: 1.25;
		}
		.continents-label{
			color: #FFF;
			font-size: 16/@rem;
		}
		
	}
}
@media screen and (max-height: 480px){
	.stake-location-wrap{
		.content-wrap{
			margin: 5% 0 0 10%; 
			.continents-text, em{
				font-size: 24/@rem;
			}
		}
	}
}
.wrap-aspect-ratio{
	.stake-location-wrap{
		.content-wrap{
			margin: 5% 0 0 10%; 
			.continents-text, em{
				font-size: 24/@rem;
			}
		}
	}
}
</style>

