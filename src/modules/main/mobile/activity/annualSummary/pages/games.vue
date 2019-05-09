<template>
	<div class="games-wrap">
		<img :src="images.floor" alt="" class="floor" ref="floor">
		<img :src="images.desktop" alt="" class="desktop" ref="desktop">
		<img :src="images.barRight" alt="" class="bar-right" ref="bar">
		<div class="game-line-wrap" ref="wrap">
			<div class="game-line">
				<div :class="gameStyle(rouletteCount)" ref="roulette">
					<img :src="images.roulette" alt="" class="roulette">
					<div class="game-name">ROULETTE</div>
				</div>
				<div :class="gameStyle(diceCount)" ref="dice">
					<img :src="images.dice" alt="" class="dice">
					<div class="game-name">DICE</div>
				</div>
			</div>
			<div class="game-line">
				<div :class="gameStyle(bingowinCount)" v-if="country !== 'gh'" ref="bingo">
					<img :src="images.bingo" alt="" class="bingo">
					<div class="game-name">BINGOWIN</div>
				</div>
				<div :class="gameStyle(jackpotCount)" ref="jackpot">
					<img :src="images.jackpot" alt="" class="jackpot">
					<div class="game-name">JACKPOT</div>
				</div>
				<div :class="gameStyle(virtualCount)" ref="virtual">
					<img :src="images.virtual" alt="" class="virtual">
					<div class="game-name">VIRTUALS</div>
				</div>
			</div>
		</div>
		<img :src="images.jetton" alt="" class="jetton" ref="jetton">
		<div class="content-wrap" :style="contentStyle" ref="content">
			<Border color='#FFF' :left="6" :top="-6"/>
			<div v-html="mostGameText"></div>
		</div>

		<Next ref="next" @click.native="onNext"/>

	</div>
</template>
<script>
import { mapState } from 'vuex';
import anime from 'animejs';
import { getGames } from '../images/config';
import Next from '../components/next.vue';
import Border from '../components/border.vue';
import vueMixin from '../vue-mixin.js';

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: getGames(),
			country: window.country,
		};
	},
	components: {
		Next,
		Border,
	},
	computed: {
		...mapState('annual', [
			'rouletteCount',
			'diceCount',
			'bingowinCount',
			'jackpotCount',
			'virtualCount'
		]),
		gamesCount() {
			return {
				Roulette: this.rouletteCount,
				Dice: this.diceCount,
				BingoWin: this.bingowinCount,
				Jackpot: this.jackpotCount,
				Virtuals: this.virtualCount
			};
		},
		mostGame() {
			let max = -1;
			let name = [];
			const gamesCount = this.gamesCount;
			const keys = Object.keys(gamesCount);
			for (const key of keys) {
				const value = gamesCount[key];
				if (value > max) {
					max = value;
					name = [key];
				} else if (value === max) {
					name.push(key);
				}
			}

			return {
				name,
				max
			};
		},
		mostGameText() {
			const { name, max } = this.mostGame;
			const gameText = this.joinName(name);
			// never played
			if (max === 0) {
				return 'You have never given a try to these options at SportyBet! Why not have fun trying them out?!'.toUpperCase();
			}
			return `YOU HAVE PLAYED <span class="em-text">${gameText.toUpperCase()}</span> ${name.length > 1 ? 'EACH' : ''} <span class="em-text">${this.mostGame.max} TIMES!</span> `;
		},
		contentStyle() {
			return {
				backgroundImage: `url(${this.images.dot})`
			};
		}
	},
	mounted() {
		const refs = this.$refs;

		// 0 - 600
		anime({
			targets: refs.floor,
			translateY: [-100, 0],
			duration: 600,
			easing: 'easeInSine'
		});
		anime({
			targets: refs.bar,
			translateX: ['100%', 0],
			duration: 600,
			easing: 'easeInSine'
		});
		anime({
			targets: [refs.desktop, refs.wrap],
			translateY: [200, 0],
			opacity: [0, 1],
			duration: 600,
			// delay: 600,
			easing: 'easeInSine'
		});
		// 600 - 1200
		anime({
			targets: refs.content,
			translateX: ['-100%', 0],
			opacity: [0, 1],
			duration: 600,
			delay: 600,
			easing: 'easeInSine'
		});
		// 玩过， 没玩过
		const played = [];
		const unplayed = [];
		const games = [refs.roulette, refs.bingo, refs.dice, refs.jackpot, refs.virtual];
		const gamesCount = [this.rouletteCount, this.bingowinCount, this.diceCount, this.jackpotCount, this.virtualCount];
		// 移除bingo
		if (window.country === 'gh') {
			games.splice(1, 1);
			gamesCount.splice(1, 1);
		}

		gamesCount.forEach((count, index) => {
			if (count) {
				played.push(games[index]);
			} else {
				unplayed.push(games[index]);
			}
		});
		// 1200 - 1800
		anime({
			targets: played,
			rotateY: ['-90deg', 0],
			opacity: [0, 1],
			duration: 600,
			delay: 1200,
			easing: 'easeInSine',
		});
		const delay = played.length === 0 ? 1200 : 1800;
		anime({
			targets: unplayed,
			rotateY: ['-90deg', 0],
			opacity: [0, 1],
			duration: 600,
			delay,
			easing: 'easeInSine',
		});

		anime({
			targets: refs.jetton,
			translateY: [100, 0],
			opacity: [0, 1],
			duration: 400,
			delay: 1600,
			easing: 'easeInSine',
		});
	},
	methods: {
		joinName(games) {
			const len = games.length;
			if (len === 0) {
				return '';
			} else if (len === 1) {
				return games[0];
			}
			return `${games.slice(0, -1).join(',')} and ${games[len - 1]}`;
		},
		gameStyle(count) {
			const { max } = this.mostGame;
			const values = Object.values(this.gamesCount);
			const zeroCount = values.filter(value => value === 0) || [];

			return {
				'game-item': true,
				'game-item--active': count === 0,
				'game-item--most': zeroCount.length === 0 && max === count, // 运营要求，全玩过时针对最多的高亮
			};
		},
		onNext() {
			const pm = this.leaveAnimate();
			pm.then(() => {
				this.$refs.next.goNext();
			});
		},
		leaveAnimate() {
			const refs = this.$refs;
			anime({
				targets: [refs.content],
				translateX: [0, '-100%'],
				opacity: [1, 0],
				duration: 600,
				easing: 'easeInSine',
			});
			anime({
				targets: [refs.wrap, refs.desktop, refs.jetton],
				translateY: [0, '200'],
				opacity: [1, 0],
				duration: 600,
				delay: 200,
				easing: 'easeInSine',
			});
			anime({
				targets: [refs.floor],
				translateY: [0, -200],
				opacity: [1, 0],
				duration: 600,
				delay: 200,
				easing: 'easeInSine',
			});
			const an = anime({
				targets: [refs.bar],
				translateX: [0, 200],
				opacity: [1, 0],
				duration: 600,
				delay: 200,
				easing: 'easeInSine',
			});

			return an.finished;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.games-wrap{
	.floor{
		position: absolute;
		width: 100%;
		height: 50%;
		top: 0;
		left: 0;
	}
	.desktop{
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 100;
		margin-bottom: -24%;
	}
	.bar-right{
		position: absolute;
		top: 0;
		right: 0;
		width: 33.3%;
	}
	.jetton{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 45.7%;
		z-index: 130;
	}
	.game-line-wrap{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		margin-bottom: 25%;
		z-index: 140;
		perspective: 500px;
		perspective-origin: center center;
	}
	.game-line{
		margin: 0 10%;
		display: flex;
		justify-content: center;
		transform-style: preserve-3d;
	}
	.game-item{
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		
		align-items: center;
		font-size: 16/@rem;
		line-height: 24/@rem;
		color: rgba(255, 255, 255, 0.5);
		border: 1px solid #94e7a8;
		border-radius: 6/@rem;
		margin: 4/@rem;
		transform-origin: center center;
		.game-name{
			flex-basis: 24/@rem;
			width: 100%;
			height: 24/@rem;
			line-height: 24/@rem;
			text-align: center;
			border-top: 1px solid #94e7a8;
		}
		img{
			height: 87/@rem;
			padding: 5/@rem 0;
		}

		&.game-item--active, &.game-item--most{
			background: url('../images/games/border-light.png') no-repeat;
			border: 1px solid transparent;
			background-size: 100% 100%;
			.game-name{
				border-top: 1px solid #fff100;
				color: #fff100;
			}
			
		}
	}
	.game-item--active{
		&::before{
			content: '';
			position: absolute;
			left: 50%;
			transform: translateX(-20%);
			top: -18/@rem;
			width: 50/@rem;
			height: 37.5/@rem;
			background: url('../images/games/try-out.png') no-repeat;
			background-size: 100% 100%;
		}
	}
	.content-wrap{
		position: absolute;
		left: 0;
		top: 0;
		margin: 8%;
		width: 66%;
		padding: 18/@rem;
		background-color: #f6ff01;
		background-size: 100% 100%;
		font-size: 16/@rem;
		color: #390000;
		word-break: break-word;
		z-index: 100;
		.em-text{
			font-size: 30/@rem;
			line-height: 1.2;
		}
	}
}
@media screen and (max-height: 480px){
	.games-wrap{
		.game-line-wrap{
			margin-bottom: 22%;
		}
		.desktop{
			margin-bottom: -42%;
		}
		.game-item img{
			height: 60/@rem;
		}
		.content-wrap{
			.em-text{
				font-size: 20/@rem;
			}
		}
	}
}
.wrap-aspect-ratio{
	.games-wrap{
		.game-line-wrap{
			margin-bottom: 22%;
		}
		.desktop{
			margin-bottom: -42%;
		}
		.game-item img{
			height: 60/@rem;
		}
		.content-wrap{
			.em-text{
				font-size: 20/@rem;
			}
		}
	}
}

@media screen and (min-height: 810px){
	.games-wrap{
		.desktop{
			margin-bottom: -10%
		}
		.game-line-wrap{
			margin-bottom: 34%;
		}
	}
}
</style>

