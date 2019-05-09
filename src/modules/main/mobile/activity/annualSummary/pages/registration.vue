<template>
	<div class="page-screen registration-wrap">
		<img :src="images.ceilLeaf" alt="" class="ceil-leaf" ref="ceil"/>
		<img :src="images.floor" alt="" class="floor" ref="floor"/>
		<img :src="images.handBeer" alt="" class="hand-beer" ref="handBeer" />
		<img :src="images.bar" alt="" class="bar" ref="bar"/>
		<div class="date-wrap" ref="date">
			<img :src="images.date" alt="" class="date">
			<div class="regist-time" ref="regist">{{registTimeStr}}</div>
		</div>
		<div class="content-wrap" ref="content">
			<Border color="#FFFF0A" />
			<div class="text-list">
				<div class="content-text" v-for="(text, index) in contentText" :key="index"> {{text | toUpperCase}}</div>
			</div>
			<img :src="images.logo" alt="" class="logo" v-if="images.logo" />
		</div>
		<Next ref="next" @click.native="onNext" />
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import anime from 'animejs';
import vueMixin from '../vue-mixin.js';

import { getRegistTime } from '../images/config';
import Next from '../components/next.vue';
import Border from '../components/border.vue';
import { getNextRoute } from '../router/config';

const timeStr = [
	[
		'#{time}, you knocked on Sporty Club\'s door for the first time.',
		'What did you think of the UEFA Champions Final?'
	],
	[
		'#{time}, you knocked on Sporty Club\'s door for the first time.',
		'How was the performance of the team you were supporting during the FIFA World Cup?'
	],
	[
		'#{time}, you knocked on Sporty Club\'s door for the first time.',
		'You must be a huge fan of us! Thank you.'
	],
	[
		'#{time}, you knocked on Sporty Club\'s door for the first time.',
		'Are the Top 5 Leagues\' matches enough excitement for you?!'
	]
];

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: getRegistTime(),
		};
	},
	computed: {
		...mapState('annual', [
			'registTime',
		]),
		...mapGetters('annual', [
			'getTimeIndex'
		]),
		contentText() {
			if (this.registTime) {
				return this.getTimeStr;
			}
			return [];
		},
		registTimeStr() {
			const time = this.registTime;
			return dateFormat.format(time, 'DD/MM/YYYY');
		},
		getTimeStr() {
			const point = this.getTimeIndex;
			const str = timeStr[point];
			const time = dateFormat.format(this.registTime, 'MMM D');

			return str.map(item => item.replace(/\#\{time\}/g, time));
		}
	},
	created() {
		if (!this.registTime) {
			const routeName = getNextRoute.call(this);
			if (routeName) {
				this.$router.replace({
					name: routeName,
				});
			}
		}
	},
	mounted() {
		anime({
			targets: this.$refs.ceil,
			translateY: [-100, 0],
			duration: 600,
			easing: 'easeInSine'
		});
		anime({
			targets: this.$refs.date,
			opacity: [0.2, 1],
			scale: [0.2, 1],
			rotate: [0, '-15deg'],
			duration: 600,
			delay: 200,
			easing: 'easeInSine',
		});
		anime({
			targets: this.$refs.floor,
			translateY: [100, 0],
			duration: 600,
			delay: 200,
			easing: 'easeInSine'
		});
		anime({
			targets: this.$refs.bar,
			translateX: [100, 0],
			duration: 600,
			delay: 300,
			easing: 'easeInSine'
		});
		anime({
			targets: this.$refs.content,
			translateX: [300, 0],
			duration: 600,
			delay: 300,
			easing: 'easeInSine'
		});
		anime({
			targets: this.$refs.handBeer,
			translateX: [-250, 0],
			rotate: [-20, 0],
			duration: 800,
			delay: 600,
			easing: 'easeInSine'
		});
	},
	components: {
		Next,
		Border,
	},
	methods: {
		onNext() {
			const prom = this.leaveAnimate();
			prom.then(() => {
				this.$refs.next.goNext();
			});
		},
		leaveAnimate() {
			// const am = anime({
			// 	targets: this.$el,
			// 	translateX: [0, '-100%'],
			// 	duration: 400,
			// 	easing: 'easeOutSine',
			// });
			// return am.finished;

			const refs = this.$refs;
			anime({
				targets: [refs.ceil],
				translateY: -300,
				duration: 400,
				easing: 'easeOutSine'
			});
			anime({
				targets: [refs.date],
				translateY: -300,
				rotate: ['-15deg', 0],
				duration: 400,
				easing: 'easeOutSine'
			});
			anime({
				targets: [refs.handBeer],
				translateX: [0, -300],
				opacity: [1, 0],
				duration: 400,
				delay: 100,
				easing: 'easeOutSine'
			});
			anime({
				targets: [refs.content],
				translateX: [0, 300],
				opacity: [1, 0],
				duration: 400,
				delay: 200,
				easing: 'easeOutSine'
			});
			anime({
				targets: [refs.floor],
				// rotate: [0, '-30deg'],
				translateY: [0, 100],
				opacity: [1, 0],
				durtaion: 300,
				delay: 200,
				easing: 'easeOutSine'
			});
			anime({
				targets: [refs.bar],
				// rotate: [0, '-30deg'],
				translateX: [0, 200],
				opacity: [1, 0],
				durtaion: 400,
				delay: 200,
				easing: 'easeOutSine'
			});

			return new Promise(resolve => {
				setTimeout(resolve, 500);
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.registration-wrap{
	
	overflow: hidden;
	.ceil-leaf{
		position: absolute;
		width: 100%;
		top: 0;
		z-index: 10;
	}
	.regist-time{
		color: #FFF;
		font-size: 24/@rem;
		margin-left: 3/@rem;
		font-family: 'Helvetica, Verdana, Menlo, "Gill Sans", arial, simsun';
		font-weight: bold;
	}
	.floor{
		// display: none;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		// transform: rotate(5deg);
	}
	.hand-beer{
		position: absolute;
		left: 0;
		top: 0;
		margin-top: 40%;
		width: 60%;
		z-index: 100;
		perspective: 500px;
		perspective-origin: center center;
		z-index: 210;
	}
	.bar{
		position: absolute;
		right: -13/@rem;
		bottom: 20/@rem;
		width: 100/@rem;
	}
	.date-wrap{
		position: absolute;
		width: 46.5%;
		margin: 24% 0 0 4%;

		transform-origin: left top;
		transform: rotate(-15deg);
		z-index: 200;
		text-align: center;

		.date{
			width: 100%;
		}
		.regist-time{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) ;
		}
	}
	.content-wrap{
		position: absolute;
		display: flex;
		width: 80%;
		padding: 18/@rem;
		align-items: center;
		right: -6%;
		bottom: 84/@rem;
		z-index: 150;
		background-color: #160e38;
		color: #FFF;
		font-size: 16/@rem;
		line-height: 1.3;
		.text-list{
			flex: 1;
		}
		.content-text{
			&:first-child{
				font-size: 20/@rem;
				margin-bottom: 5/@rem;
			}
		}
	}
	.logo{
		height: 100/@rem;
		margin-right: -24/@rem;
		z-index: 1;
	}
}
@media screen and (max-height: 480px){
	.registration-wrap{
		.content-wrap{
			bottom: 24/@rem;
		}
		.hand-beer{
			margin-top: 36%;
		}
	}
}

@media screen and (min-height: 810px){
	.registration-wrap{
		.hand-beer{
			margin-top: 64%;
		}
	}
}
.wrap-aspect-ratio{
	.registration-wrap{
		.content-wrap{
			bottom: 24/@rem;
		}
		.hand-beer{
			margin-top: 36%;
		}
	}
}

</style>

