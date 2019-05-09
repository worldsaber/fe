<template>
	<div class="sporty-coins-bet-status-wrapper">
		<img src="../image/banner-ke.jpg" v-if="country==='ke'">
		<img src="../image/banner-ng.jpg" v-if="country==='ng'">
		<img src="../image/banner-gh.jpg" v-if="country==='gh'">
		<div class="success" v-if="betStatus==='success'">
			<h1 class="title"><i/>Bet Placed!</h1>
			<img class="sportycoins-banner" src="../image/sportycoin-banner.png" />
			<p class="congrats">You have placed Free Bet with SportyCoins. It can be converted to Real Money</p>
			<div class="btn" @click="jump('coin')">Go SportyCoins</div>
			<!-- <p class="timer">This page will be redirected to SportyBet in <span>{{timer}}</span> seconds...</p> -->
		</div>
		<div class="fail" v-if="['pending','fail'].includes(betStatus)">
			<p class="first">{{firstParagraph}}</p>
			<p class="second">{{secondParagraph}}</p>
			<div class="btn" @click="jump(betStatus==='fail'?'coin':'order')">Check Now</div>
			<p class="jump" @click="jump">Go to SportyBet</p>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';

export default {
	data () {
		return {
			timer: 3,
			country: window.country,
			currency: window.currency,
			coinsMap: {
				ke: 50,
				ng: 100,
				gh: 1
			}
		};
	},
	// watch: {
	// 	betStatus(val) {
	// 		if (val === 'success') {
	// 			const interval = setInterval(() => {
	// 				if (this.timer === 0) {
	// 					clearInterval(interval);
	// 					this.jump('orderDetail');
	// 				} else {
	// 					this.timer--;
	// 				}
	// 			}, 1000);
	// 		}
	// 	},
	// },
	computed: {
		...mapState('activityRegister', [
			'betStatus', // 拿coin失败和生单失败状态都为fail，拿coin成功但生单pending则状态为pending
			'orderId' // 供跳转订单详情URL使用
		]),
		firstParagraph() {
			if (this.betStatus === 'pending') {
				return 'Successfully submitted!';
			}
			return 'Unfortunately, an error occurred and your bet didn\'t go through.';
		},
		secondParagraph() {
			if (this.betStatus === 'pending') {
				return 'Your bet request has been submitted and is now waiting for confirmation on its status. Check your records in a short while to check if it was successfully accepted by Sportybet.';
			}
			return `The ${this.currency} ${this.coinsMap[this.country]} Free Bet (SportyCoins) has already been distributed into your account.`;
		},
	},
	methods: {
		jump(where) {
			if (where === 'coin') {
				location.href = `${pagePath.myCenter}/sportycoins`;
			} else if (where === 'order') {
				location.href = `${userCenterUrl.sportOrder}?isSettled=0`;
			} else if (where === 'orderDetail') {
				location.href = `${userCenterUrl.sportOrder}/detail/${this.orderId}`;
			} else location.href = pagePath.home;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import 'base/styles/icon.less';
	.sporty-coins-bet-status-wrapper {
		color: #1b1e25;
		img {
			width: 100%;
		}
		.success, .fail {
			padding: 0 30/@rem;
		}
		.success {
			text-align: center;
			h1 {
				font-size: 22/@rem;
				font-weight: bold;
				margin-top: 43/@rem;
				margin-bottom: 19/@rem;
				color: #0d9737;
				i {
					.m-icon-success-bg();
					&:before {
						font-size: 24/@rem;
						color: #3ccc67;
						margin-right: 8/@rem;
					}
				}
			}
			.sportycoins-banner{
				margin: 20/@rem auto 12/@rem;
				width: 200/@rem;
			}
			.congrats {
				font-size: 14/@rem;
  				font-weight: bold;
			}
			.btn {
				height: 48/@rem;
				line-height: 48/@rem;
				border-radius: 2/@rem;
				background-color: #0d9737;
				margin-top: 24/@rem;
				margin-bottom: 80/@rem;
				color: #fff;
				font-size: 16/@rem;
  				font-weight: bold;
			}
			.timer {
				margin-bottom: 64/@rem;
				span {
					color: @green;
					font-size: 14/@rem;
				}
			}
		}
		
		.fail {
			font-size: 14/@rem;
			.first {
				margin-top: 28/@rem;
				margin-bottom: 16/@rem;
			}
			.btn {
				margin-top: 42/@rem;
				margin-bottom: 15/@rem;
				height: 48/@rem;
				line-height: 48/@rem;
				border-radius: 2/@rem;
				border: 1/@rem solid;
				color :#0d9737;
				font-size: 16/@rem;
				font-weight: bold;
				text-align: center;
			}
			.jump {
				text-decoration: underline;
				text-align: center;
				color: #3656a3;
				margin-bottom: 37/@rem;
			}
		}
	}
</style>
