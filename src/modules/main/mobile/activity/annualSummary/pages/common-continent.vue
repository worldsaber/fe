<template>
	<div class="page-screen common-continent-wrap" :style="wrapStyle">
		<img :src="images.dbBeer" alt="" class="db-beer" />
		<Map :continents="continents" :isAnimate="isAnimate" class="map" ref="map"/>
		<img :src="images.finger" alt="" class="finger" ref="finger" />
		<img :src="images.glass" alt="" class="glass" ref="glass" />
		<img :src="images.tennis" alt="" class="tennis"  ref="tennis" />
		<img :src="images.wuwuzula" alt="" class="wuwuzula" ref="wuwuzula" />
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import anime from 'animejs';

import { getContinent } from '../images/config';
import Map from '../components/map/index.vue';

export default {
	props: {
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
		wrapStyle() {
			return {
				backgroundImage: `url(${this.images.desktop})`,
			};
		}
	},
	mounted() {
		if (!this.isAnimate) {
			return;
		}

		const refs = this.$refs;
		const delay = 1400;
		anime({
			targets: [refs.finger, refs.glass],
			translateX: ['-100%', 0],
			translateY: ['100%', 0],
			duration: 600,
			delay,
			easing: 'easeInSine',
		});
		anime({
			targets: [refs.wuwuzula],
			translateX: ['100%', 0],
			translateY: ['100%', 0],
			duration: 600,
			delay,
			easing: 'easeInSine',
		});

		anime({
			targets: [refs.tennis],
			opacity: [0, 1],
			translateX: [-100, 0],
			duration: 600,
			delay,
			easing: 'easeInSine',
		});
	},
	components: {
		Map,
	},
	methods: {
		leaveAnimate(delay) {
			const refs = this.$refs;
			const map = refs.map;
			map.leaveAnimate(delay);
			anime({
				targets: [refs.finger, refs.glass, refs.tennis],
				translateY: [0, 200],
				opacity: [1, 0],
				duration: 500,
				delay: delay + 400,
				easing: 'easeInSine',
			});
			anime({
				targets: [refs.wuwuzula],
				translateX: [0, 200],
				opacity: [1, 0],
				duration: 500,
				delay: delay + 400,
				easing: 'easeInSine',
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.common-continent-wrap{
	background-size: 100% 100%;
	.db-beer{
		position: absolute;
		width: 21.8%;
		top: 0;
		right: 0;
		margin-right: 10%;
	}
	
	.map{
		position: absolute;
		margin-top: 51%;
		width: 100%;
	}
	.glass{
		position: absolute;
		bottom: 0;
		width: 56%;
		left: 2%;
	}
	.wuwuzula{
		position: absolute;
		bottom: 0;
		right: 0;
		width: 34.9%;
	}
	.tennis{
		position: absolute;
		width: 23.5%;
		left: 31.9%;
		bottom: 0;
		margin-bottom: 19.3%;
	}
	
	.finger{
		position: absolute;
		width: 36.4%;
		left: 0;
		bottom: 0;
	}
}
@media screen and (max-height: 480px){
	.common-continent-wrap{
		.map{
			margin-top: 40%; 
		}
		.glass{
			width: 50%;
		}
		.wuwuzula{
			width: 30%;
		}
		.tennis{
			width: 20%;
		}
		.finger{
			width: 32%;
		}
	}
}
.wrap-aspect-ratio{
	.common-continent-wrap{
		.map{
			margin-top: 40%; 
		}
		.glass{
			width: 50%;
		}
		.wuwuzula{
			width: 30%;
		}
		.tennis{
			width: 20%;
		}
		.finger{
			width: 32%;
		}
	}
}
@media screen and (min-height: 810px){
	.common-continent-wrap{
		.map{
			margin-top: 67%; 
		}
	}
}
</style>

