<template>
	<div class="page-screen promotion-gift-wrap">
		<img :src="images.tree" alt="" class="tree" ref="tree">
		<img :src="images.coins" alt="" class="coins" ref="coins">
		<img :src="images.hand" alt="" class="hand" ref='hand'>
		<img :src="images.pig" alt="" class="pig" ref="pig">
		<div class="content-wrap" ref="content">
			<div class="gift-label"> THIS YEAR, YOU RECEIVED <span class="em-text">{{receivedGift}}</span> GIFTS. </div>
			<div class="save-label">YOU SAVED <span class="em-text">{{savedGift}}</span> </div>
			<ul class="include-list">
				<li><span class="success-icon">*</span>INCLUDING <span class="em-text">{{currency}} {{giftsAmount}}</span> BY USING GIFTS</li>
				<li><span class="success-icon">*</span>INCLUDING <span class="em-text">{{currency}} {{chargeFee}}</span> BY CHARGE FEES</li>
			</ul>
			<Border color="#fdea4a" :left="6" :top="-6" />
		</div>
		<Next ref="next" @click.native="onNext"/>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import anime from 'animejs';
import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import { getMoneyFraction } from '../util';
import { PromotionGift } from '../images/config';
import Next from '../components/next.vue';
import Border from '../components/border.vue';
import vueMixin from '../vue-mixin.js';
import { getNextRoute } from '../router/config';

export default {
	mixins: [vueMixin],
	data() {
		return {
			images: PromotionGift,
			currency: showCurrency,
		};
	},
	components: {
		Next,
		Border,
	},
	computed: {
		...mapState('annual', [
			'giftReceivedAmount',
			'giftUsedAmount',
			'depositChargeAmount',
			'withdrawChargeAmount',
			'discountGiftSavedAmount',
		]),
		receivedGift() {
			const amount = formatNumber(this.giftReceivedAmount / 10000, getMoneyFraction());
			return `${showCurrency}${amount}`;
		},
		savedGift() {
			let amount = this.giftUsedAmount + this.depositChargeAmount + this.withdrawChargeAmount + this.discountGiftSavedAmount;
			amount = formatNumber(amount / 10000, getMoneyFraction());
			return `${showCurrency}${amount}`;
		},
		chargeFee() {
			const amount = this.depositChargeAmount + this.withdrawChargeAmount;
			return formatNumber(amount / 10000, getMoneyFraction());
		},
		giftsAmount() {
			const amount = this.giftUsedAmount + this.discountGiftSavedAmount;
			return formatNumber(amount / 10000, getMoneyFraction());
		},
		hasNoGift() {
			const amount = this.giftUsedAmount + this.depositChargeAmount + this.withdrawChargeAmount + this.discountGiftSavedAmount;
			return amount === 0;
		}
	},
	created() {
		// 没有收到礼物，跳到下一页
		if (this.hasNoGift) {
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
		// 0 - 600
		anime({
			targets: refs.tree,
			translateY: ['100%', 0],
			duration: 600,
			easing: 'easeInSine',
		});
		// 0 - 800
		anime({
			targets: refs.coins,
			translateY: ['-100%', 0],
			duration: 800,
			// delay: 600,
			easing: 'easeInSine',
		});
		// 400 - 1000
		anime({
			targets: refs.hand,
			translateX: ['-100%', 0],
			duration: 600,
			delay: 400,
			easing: 'easeInSine',
		});
		// 1000 - 1600
		anime({
			targets: refs.content,
			opacity: [0, 1],
			rotateX: ['90deg', 0],
			duration: 600,
			delay: 1000,
			easing: 'easeInSine',
		});
		const time = anime.timeline();
		time.add({
			targets: refs.pig,
			translateY: ['-100%', 0],
			opacity: [0, 0.6],
			duration: 600,
			easing: 'easeInSine',
		});
		anime({
			targets: refs.pig,
			opacity: [0.3, 1],
			duration: 2000,
			loop: true,
			direction: 'alternate',
			easing: 'easeInSine',
		});
	},
	methods: {
		onNext() {
			const pm = this.leaveAnimate();
			pm.then(() => {
				this.$refs.next.goNext();
			});
		},
		leaveAnimate() {
			const refs = this.$refs;

			anime({
				targets: [refs.content, refs.hand, refs.coins, refs.pig],
				translateY: [0, -200],
				opacity: [1, 0],
				duration: 400,
				delay: (target, index) => 200 * index,
				easing: 'easeInSine',
			});

			const an = anime({
				targets: refs.tree,
				translateY: [0, '100%'],
				opacity: [1, 0],
				duration: 600,
				delay: 600,
				easing: 'easeInSine',
			});

			return an.finished;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.promotion-gift-wrap{
	.tree{
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
	}
	.pig{
		position: absolute;
		width: 22.5%;
		right: 0;
		top: 0;
		z-index: 10;
	}
	.hand{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
		margin-top: 30%;
	}
	.coins{
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}
	.content-wrap{
		position: absolute;
		margin-left: 10%;
		bottom: 100/@rem;
		width: 65%;
		background: url('../images/gift/light.png');
		background-color: #101c78;
		background-size: 100% 100%;
		padding: 24/@rem;
		color: #FFF;
		line-height: 1.2;
		font-size: 16/@rem;
		transform-origin: center top;
		z-index: 20;
	}
	.include-list{
		.success-icon{
			// .m-icon-success();
			margin-right: 2/@rem;
		}
		.em-text{
			font-size: 16/@rem;
		}
	}
	.em-text{
		font-size: 30/@rem;
		line-height: 1.2;
		color: #f3d531;
	}
}
@media screen and (max-height: 480px){
	.promotion-gift-wrap{
		.content-wrap{
			bottom: 24/@rem;
			padding: 12/@rem 18/@rem  18/@rem;
			margin-left: 6%;
		}
		.em-text{
			font-size: 24/@rem;
		}
	}
}

.wrap-aspect-ratio{
	.promotion-gift-wrap{
		.content-wrap{
			bottom: 24/@rem;
			padding: 12/@rem 18/@rem  18/@rem;
			margin-left: 6%;
		}
		.em-text{
			font-size: 24/@rem;
		}
	}
}

@media screen and (min-height: 810px){
	.promotion-gift-wrap{
		.content-wrap{
			bottom: 150/@rem;
		}
	}
}
</style>

