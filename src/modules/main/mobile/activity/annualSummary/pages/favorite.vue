<template>
	<div class="favorite-wrap">
		<CommonContinent :isAnimate="false" ref="continent"/>

		<div class="content-wrap" :style="contentStyle" ref="content">
			<div class="label">
				<span v-html="contentText"></span>
			</div>
			<Border color="#03e879" :left="-6" :top="9" />
		</div>
		<div class="medal-wrap" ref="medal">
			<img :src="images.tournament" alt="" class="tournament" />
			<img :src="images.outLight" alt="" class="out-light" />
		</div>
		<Next ref="next" @click.native="onNext"/>

	</div>
</template>
<script>
import { mapState } from 'vuex';
import anime from 'animejs';
import CommonContinent from './common-continent.vue';
import Border from '../components/border.vue';
import Next from '../components/next.vue';
import { getFavorite } from '../images/config';
import vueMixin from '../vue-mixin.js';
import { getNextRoute } from '../router/config';

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: getFavorite(),
		};
	},
	components: {
		Border,
		CommonContinent,
		Next,
	},
	computed: {
		...mapState('annual', [
			'topTournamentId',
			'topTournamentName',
			'topTeamName',
			'topTeamCount'
		]),
		contentText() {
			if (this.topTournamentName) {
				return `YOU DO LOVE THE <br /><span class="text">${this.topTournamentName.toUpperCase()}</span>,
				<br />DON'T YOU? <br />YOU BET <br /><span class="text">${this.topTeamName.toUpperCase()} ${`${this.topTeamCount}`.toUpperCase()} TIMES!</span>`;
			}
				// 没有联赛，视作球员
			return `SO MUCH LOVE FOR YOUR FAVORITE PLAYER, <span class="text">${this.topTeamName.toUpperCase()}</span>! kEEP ON SHOWING YOUR LOVE, AMAZING TOURNAMENTS AWAIT!`;
		},
		contentStyle() {
			return {
				backgroundImage: `url(${this.images.light})`
			};
		},
		isNoFavorite() {
			return !(this.topTournamentName || this.topTeamName);
		}
	},
	created() {
		// 没有喜欢的，跳到下一页
		if (this.isNoFavorite) {
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
			targets: this.$refs.content,
			opacity: [0, 1],
			translateX: ['100%', 0],
			duration: 600,

			easing: 'easeInSine',
		});
		anime({
			targets: refs.medal,
			opacity: [0, 1],
			scale: [2, 1],
			translateY: ['-200', 0],
			rotate: ['20deg', '6deg'],
			duration: 600,
			delay: 600,
			easing: 'easeInSine',
		});
	},
	methods: {
		onNext() {
			const pm = this.leaveAnimate();
			pm.then(() => this.$refs.next.goNext());
		},
		leaveAnimate() {
			const refs = this.$refs;
			anime({
				targets: refs.content,
				translateX: [0, '-100%'],
				opacity: [1, 0],
				duration: 400,
				easing: 'easeInSine',
			});
			anime({
				targets: refs.medal,
				opacity: [1, 0],
				// scale: [1, 2],
				translateY: [0, '-200'],
				translateX: [0, '-100'],
				rotate: ['6deg', '0deg'],
				duration: 400,
				delay: 200,
				easing: 'easeInSine',
			});
			refs.continent.leaveAnimate(600);

			return new Promise(resolve => {
				setTimeout(resolve, 1600);
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.favorite-wrap{
	.content-wrap{
		position: absolute;
		top: 0;
		left: 0;
		width: 72%;
		margin: 10% 10% 0;
		padding: 24/@rem 18/@rem 18/@rem;
		background-color: #442c1d;
		background-size: 100% 100%;
		// z-index: 200;
		line-height: 1.2;

		.text{
			color: #03e879;
			font-size: 30/@rem;
		}
		.label{
			color: #FFF;
			font-size: 16/@rem;
		}
	}
	.medal-wrap{
		position: absolute;
		margin-top: 70%;
		width: 100%;
		left: 0;
		top: 0;
		margin-left: 5%;
		transform: rotate(6deg);
		transform-origin: center top;
		z-index: 100;
	}
	.tournament{
		position: absolute;
		width: 57.9%;
		left: 50%;
		transform: translateX(-50%);
	}
	.out-light{
		position: absolute;
		width: 80.1%;
		left: 50%;
		margin-top: -10.9%;
		transform: translateX(-50%);
	}
}
@media screen and (max-height: 480px){
	.favorite-wrap{
		.medal-wrap{
			margin-top: 50%; 
		}
		.content-wrap{
			margin: 5% 0 0 10%; 
			.text {
				font-size: 24/@rem;
			}
		}
	}
}

.wrap-aspect-ratio{
	.favorite-wrap{
		.medal-wrap{
			margin-top: 50%; 
		}
		.content-wrap{
			margin: 5% 0 0 10%; 
			.text {
				font-size: 24/@rem;
			}
		}
	}
}
@media screen and (min-height: 810px){
	.favorite-wrap{
		.medal-wrap{
			margin-top: 85%; 
		}
	}
}
</style>

