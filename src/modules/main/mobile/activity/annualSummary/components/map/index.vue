<template>
	<div class="map-wrap">
		<img :src="images.mapBack" alt="" class="map-part map-back" ref="back"/>
		<img :src="images.mapCorner" alt="" class="map-part  map-corner" ref="corner"/>
		<component v-for="(item, index) in continentComponents" :is="item" :key="index" :isAnimate="isAnimate" :delay="index" class="map-part" ref="mapLight"></component>
		<img :src="images.football" alt="" class="football" ref="football">
	</div>
</template>
<script>
import anime from 'animejs';

import { getContinent } from '../../images/config';
import Africa from './africa.vue';
import Asia from './asia.vue';
import Europe from './europe.vue';
import NorthAmerica from './north-america.vue';
import SouthAmerica from './south-america.vue';
import Oceania from './australia.vue';

const map = {
	africa: Africa,
	asia: Asia,
	europe: Europe,
	northamerica: NorthAmerica,
	southamerica: SouthAmerica,
	oceania: Oceania,
};

export default {
	props: {
		continents: Array,
		isAnimate: {
			type: Boolean,
			'default': true,
		}
	},
	data() {
		return {
			images: getContinent(),
		};
	},
	computed: {
		continentComponents() {
			const lights = this.continents || [];
			return lights.map(light => {
				const key = light.toLowerCase().replace(/ /g, '');
				return map[key];
			});
		}
	},
	mounted() {
		if (!this.isAnimate) {
			return;
		}
		const delay = 600;
		const refs = this.$refs;
		const lights = refs.mapLight || [];
		const els = lights.map(ref => ref.$el);
		const time = anime.timeline();

		// 600 - 1400
		anime({
			targets: this.$el,
			translateX: ['-100%', 0],
			opacity: [0, 1],
			duration: 800,
			delay,
			easing: 'easeInSine'
		});

		// 1200 - 2800
		time.add({
			targets: els,
			opacity: [0, 1],
			duration: 800,
			delay: delay + 1400,
			easing: 'easeInSine',
		});
		time.add({
			targets: els,
			opacity: [0.4, 1],
			duration: 800,
			easing: 'easeInSine',
		});

		anime({
			targets: refs.football,
			translateX: ['-100%', 0],
			opacity: [0, 1],
			duration: 400,
			delay: delay + 600,
			easing: 'easeInSine'
		});
	},
	methods: {
		leaveAnimate(delay) {
			anime({
				targets: this.$el,
				translateX: [0, '-100%'],
				opacity: [1, 0],
				duration: 600,
				delay,
				easing: 'easeInSine'
			});
		}
	}

};
</script>

<style lang="less">
.map-wrap{
	position: absolute;
	margin-top: 54.9%;
	width: 100%;
	.map-part{
		position: absolute;
		top: 0;
		left: 0;
		width: 132%;
		margin-left: -15%;
		perspective: 500px;
	}
	.map-corner{
		z-index: 100;
	}
	.football{
		position: absolute;
		width: 22.4%;
		left: 0;
		opacity: 1;
	}

}
@media screen and (max-height: 480px){
	.map-wrap{
		.football{
			width: 20%;
			margin-top: 10%;
		}
	}
}
.wrap-aspect-ratio{
	.map-wrap{
		.football{
			width: 20%;
			margin-top: 10%;
		}
	}
}
	
</style>


