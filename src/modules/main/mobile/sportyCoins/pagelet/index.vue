<template>
<div class="m-coin-detail" v-loading="isLoading">
	<navbar v-if="!isApp">
		<div slot="right" @click="goHelp" class="how-to-use">How to use</div>
	</navbar>
	<!-- <div class="now-attending" v-if="hasBanner && !isLoading">Now attending</div> -->
	<div class="coin-detail-wrap" v-if="hasBanner && !isLoading">
		<div class="banner-detail">
			<div class="stake-wrap">
				<div class="show-coins">My SportyCoins: 
					<span class="coins">{{info.showCurrentCoins}}</span>
				</div>
				<div class="go-transaction" @click="goTransaction('coin')">
					<span>Transactions</span><i class="icon-right" />
				</div>
			</div>
			<div class="banner-pending" v-if="info.status === 6">
				<span class="pending-text" @click.stop="pendingClick">Pending</span>
				<img @click.stop="pendingClick" class="icon-help" src="../image/icon-help.svg" />
			</div>
			<div class="banner-text">Expired date: {{info.showExpireTime}}</div>
			<div class="banner-activity-wrap">
				<div class="banner-title">You've got SportyCoins {{info.banner.promotation}} from {{info.banner.title}}</div>
				<div class="banner-detail-link" @click="goActivity(info.banner)" v-if="info.banner && info.banner.activityUrl">View detail <i class="icon-right" /></div>
			</div>
		</div>
		<img src="../image/sportycoin-banner.png" class="sporty-coin-banner" />
		
		<div class="require-detail-wrap">
			<div class="require-title">Meet All Requirements to Convert SportyCoins to Real Money</div>
			<!-- <p class="detail-text">to convert your SportyCoins to {{info.showUnit}}</p> -->
			<div class="required-item settled-required" v-if="hasStakeLimit">
				<!-- <img class="required-img" src="../image/stake-required.png" /> -->
				<div class="challenge-title">
					<div class="no">1</div>
					<div class="text">Place ONE BET or MANY BETS with Real Money adding up to {{currency}} {{info.showStakeRequire}} or more! 
						<br/>
						(on odds not less than {{info.showOdds}})
						<div class="required-current">Current Spent <span class="current-text">{{currency}} {{info.showCurrentStake}}</span></div>

					</div>
					<!-- <span>{{info.showStakeRequire}}</span>Settled Stakes Required -->
					<!-- <img @click="goStakeHelp" class="icon-help" src="../image/icon-help.svg" /> -->
				</div>
			</div>

			<div class="required-item coins-required" v-if="hasCoinLimit">
				<!-- <img class="required-img" src="../image/coins-required.png" /> -->
				<div class="challenge-title">
					<div class="no">2</div>
					<div class="text">Multiply SportyCoins to {{info.showCoinsRequire}} or More <br />
						( by placing bets with it )
						<div class="required-current">Current Own  <span class="current-text">SportyCoins {{info.showCurrentCoins}}</span></div>
						<div class="unsettle-tickets" v-if="info.placeNoSettleCount">
							<span>{{info.placeNoSettleCount}} UnSettled Tickets with SportyCoins</span>
							<span @click="goTransaction('coin')" class="link">view detail <i class="icon-right"></i></span>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</div>
	<div class="no-banner-detail-wrap" v-if="!hasBanner && !isLoading">
		<div class="banner-detail">
			<div class="stake-wrap">
				<div class="show-coins">My SportyCoins: 
					<span class="coins">{{info.showCurrentCoins || '0.00'}}</span>
				</div>
				<!-- <div class="go-transaction" @click="goTransaction('coin')">
					<span>Transactions</span><i class="icon-right" />
				</div> -->
			</div>
		</div>
		<div class="no-sportycoins-title">No SportyCoins offers in progress. Check the following information to learn more about SportyCoins.</div>
	</div>
	<div class="footer-wrap">
		<Video v-if="!hasBanner && !isLoading"/>
		<Faq />
		<Terms />
		<div class="go-history"><span @click="goHistory">SportyCoins History ></span></div>
		<Video v-if="hasBanner && !isLoading"/>
		<div class="offer-may-like" v-if="info && info.showBanners && info.showBanners.length > 0">Offers You May Like</div>
		<ul class="offer-list">
			<li class="offer-item" v-for="(item, index) in info.showBanners" :key="index" @click="goOffer(item)">
				<div class="offer-link"><img class="offer-img" :src="item.bgUrl"></div>
				<div class="offer-detail-wrap">
					<div class="offer-title">{{item.title}}</div>
					<div class="offer-promotion">{{currency}} {{item.promotation}}</div>
					<div class="offer-sportycoins">SportyCoins</div>
				</div>
			</li>
		</ul>
	</div>
</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import { isInApp } from 'appCore/util';
import navbar from '../../../../common-wap/components/navbar';
import successDialog from './successDialog';
import Terms from './terms.vue';
import Faq from './faq.vue';
import Video from './video.vue';

const unitMap = {
	ke: 'Shilling',
	ng: 'Naira',
	gh: 'Cedi'
};
const dialogMap = {
	1: 'Your SportyCoins have been cancelled by SportyBet according to the T&C of activities and SportyCoins.',
	2: 'Your SportyCoins have been cancelled due to another SportyCoins have been claimed.',
	5: 'Your SportyCoins have been used up.'
};
const helpLink = `//www.sportybet.com/swdp/pagemaker/sportybet/${window.country}/sportycoins_how_to_use1/index.htm`;
export default {
	components: {
		navbar,
		Terms,
		Faq,
		Video
	},
	data() {
		return {
			info: '',
			currency: window.currency,
			isLoading: false,
			isApp: isInApp(),
		};
	},
	created() {
		this.getConfig();
	},
	computed: {
		hasBanner() { // 是否有正在进行的banner
			return this.info && (this.info.status === 0 || this.info.status === 6);
		},
		hasStakeLimit() {
			return this.info && this.info.settleStakeRequire > 0;
		},
		hasCoinLimit() {
			return this.info && this.info.settleCoinsRequire > 0;
		}
	},
	methods: {
		getConfig() {
			this.isLoading = true;
			return fetch('/pocket/v1/activity/sportycoins/detail')
			.then(res => res.json())
			.then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					this.info = this.format(res.data);
					const { status, isShowed } = res.data;
					if (status === 4 && !isShowed) {
						this.$dialog({
							title: null,
							content: successDialog,
							contentData: {
								stake: this.info.showCurrentCoins
							},
							css: 'coin-success',
							button: []
						});
					} else if ([1, 2, 5].indexOf(status) > -1 && !isShowed) {
						this.$dialog({
							title: null,
							content: dialogMap[status] || '',
							button: ['OK']
						});
					} else if (status === 3 && !isShowed) {
						this.$dialog({
							title: null,
							content: `Your SportyCoins expired on ${this.info.showExpireTime}`,
							button: ['OK']
						});
					}
				}
			}).catch(e => {
				this.isLoading = false;
			});
		},
		format(data) {
			if (data.banner) {
				data.showCurrentCoins = formatNumber(data.currentCoins / 10000, 2);
				data.showCoinsRequire = formatNumber(data.settleCoinsRequire / 10000, 2);
				data.showCurrentStake = formatNumber(data.currentStake / 10000, 2);
				data.showStakeRequire = formatNumber(data.settleStakeRequire / 10000, 2);
				data.showExpireTime = dateFormat.format(data.predefinedExpireTime, 'DD/MM/YY');
				data.showRemainCoin = formatNumber((data.settleCoinsRequire - data.currentCoins) / 10000, 2);
				data.showRemainStake = formatNumber((data.settleStakeRequire - data.currentStake) / 10000, 2);
				data.showStakePercent = (data.currentStake / data.settleStakeRequire).toFixed(4) * 100;
				data.showStakePercent = data.showStakePercent > 100 ? 100 : data.showStakePercent;
				data.showCoinsPercent = (data.currentCoins / data.settleCoinsRequire).toFixed(4) * 100;
				data.showCoinsPercent = data.showCoinsPercent > 100 ? 100 : data.showCoinsPercent;

				data.showUnit = unitMap[window.country];
				data.showStakeLabel = this.getLabelByPercent(data.showStakePercent);
				data.showCoinsLabel = this.getLabelByPercent(data.showCoinsPercent);
				data.showOdds = formatNumber(data.odds, 2);
			}
			return data;
		},
		getLabelByPercent(percent) {
			let label = '';
			if (percent >= 0 && percent < 30) {
				label = 'Way to go!';
			} else if (percent >= 30 && percent < 70) {
				label = 'Cheer up!';
			} else if (percent >= 70 && percent < 100) {
				label = 'Almost There!';
			} else {
				label = 'Well done!';
			}
			return label;
		},
		goTransaction(tab) {
			if (this.info && this.info.activityId) {
				this.$router.push({
					name: 'transaction',
					params: {
						id: this.info.activityId
					},
					query: {
						tab: tab || 'stake'
					}
				});
			}
		},
		pendingClick() {
			this.$dialog({
				title: null,
				content: 'Your SportyCoins account is currently frozen due to unsettled ticket status. Feel free to contact us if you have any concerns.',
				button: ['OK']
			});
		},
		goHistory() {
			this.$router.push({
				name: 'history'
			});
		},
		goCoinHelp() {
			this.$router.push({
				name: 'coinHelp'
			});
		},
		goActivity(banner) {
			if (banner) {
				location.href = banner.activityUrl;
			}
		},
		goStakeHelp() {
			this.$router.push({
				name: 'stakeHelp'
			});
		},
		goOffer(item) {
			location.href = item.activityUrl;
		},
		goHelp() {
			location.href = helpLink;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-coin-detail {
	min-height: 100%;
    background-color: @white;
    
	.how-to-use {
		line-height: 40/@rem;
		font-size: 12/@rem;
		color: #3656a3;
	}
	.banner-pending {
		.pending-text{
			display: inline-block;
			vertical-align: middle;
			margin-right: 3/@rem;
			padding: 0 3/@rem;
			background-color: #a5905b;
			color: #f7f0df;
			border-radius: 2/@rem;
			font-size: 10/@rem;
			line-height: 14/@rem;
		}
		.icon-help {
			vertical-align: middle;
			height: 14/@rem;
			width: 14/@rem;
		}
	}
	.no-banner-detail-wrap{
		.banner-detail{
			padding: 16/@rem;
		}
	}
	.banner-detail{
		padding: 16/@rem 16/@rem 10/@rem;
		background-color: #e1cb8e;
		color: #483400;
		font-size: 12/@rem;
		line-height: 24/@rem;

		.stake-wrap{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.coins{
				font-size: 18/@rem;
				line-height: 24/@rem;
				font-weight: bold;
			}
		}
		.banner-activity-wrap{
			display: flex;
			overflow: hidden;
			align-items: center;
			color: #6e603b;
			font-size: 11/@rem;
			margin-top: 10/@rem;
		}
		.banner-title{
			flex: 1;
			line-height: 1.3;
			// overflow: hidden;
			// white-space: nowrap;
			
			// text-overflow: ellipsis;
		}
		.banner-detail-link{
			align-self: flex-start;
			flex-basis: 90/@rem;
			align-self: bottom;
			text-align: right;
			.icon-right::before{
				color: #6e603b;
				font-size: 10/@rem;
			}
		}
		.icon-right {
			// margin-left: 5/@rem;
			.m-icon-arrow--right();
			&::before {
				font-size: 11/@rem;
				color: #483400;
			}
		}
		
	}
	.sporty-coin-banner{
		display: block;
		width: 100%;
		margin: 8/@rem 0 24/@rem;
	}
	.no-sportycoins-title{
		padding: 30/@rem 16/@rem;
		font-size: 24/@rem;
		font-weight: bold;
		color: #1b1e25;
		line-height: 1.2;

	}
	.require-detail-wrap {
		padding: 0 16/@rem;
		// box-sizing: border-box;
		.require-title{
			color: #1b1e25;
			line-height: 1.2;
			margin-bottom: 20/@rem;
			font-size: 24/@rem;
			font-weight: bold;
		}
		.required-item{
			margin: 20/@rem 0;
			.challenge-title {
				display: flex;
				color: #1b1e25;
				.no{
					flex-basis: 20/@rem;
					font-size: 24/@rem;
					font-weight: bold;
				}
				.text{
					flex: 1;
					line-height: 1.29;
					font-size: 14/@rem;
				}
				font-size: 14/@rem;
				line-height: 16/@rem;
				.icon-help {
					margin-left: 2/@rem;
					width: 12/@rem;
					height: 12/@rem;
				}
			}
			.required-current{
				display: block;
				height: 26/@rem;
				margin: 10/@rem 10/@rem 10/@rem 0;
				padding: 0 12/@rem;
				line-height: 26/@rem;
				border-radius: 20/@rem;
				background-image: linear-gradient(to left, #e7d188, #946411);
				color: #FFF;
				font-size: 14/@rem;
			}
			.current-text{
				font-weight: bold;
			}
		}
		
	}
	.footer-wrap{
		padding: 0 16/@rem;
	}
	.go-history {
		margin: 32/@rem 7/@rem 0;
		height: 44/@rem;
		border-top: 1px solid #d8d8d8;
		border-bottom: 1px solid #d8d8d8;
		text-align: center;
		span {
			line-height: 44/@rem;
			font-size: 12/@rem;
			color: #0d9737;
		}
	}
	
	.offer-may-like {
		margin-top: 20/@rem;
		font-size: 16/@rem;
		line-height: 20/@rem;
		// color: @white;
		font-weight: bold;
		// text-align: center;
	}
	.offer-list {
		position: relative;
		margin-top: 14/@rem;
		list-style: none;
		.offer-item {
			position: relative;
			margin-bottom: 10/@rem;
			.offer-link {
				width: 100%;
			}
			.offer-img {
				width: 100%;
				height: 103/@rem;
			}
			.offer-detail-wrap {
				position: absolute;
				top: 12/@rem;
				left: 16/@rem;
				width: 60%;
				.offer-title {
					font-size: 14/@rem;
					line-height: 16/@rem;
					font-weight: bold;
					color: #453714;
				}
				.offer-promotion {
					margin-top: 2/@rem;
					line-height: 28/@rem;
					text-shadow: 0 2/@rem 4/@rem rgba(0, 0, 0, 0.5);
					font-size: 24/@rem;
					font-weight: bold;
					color: @white;
				}
				.offer-sportcoins {
					margin-top: 2/@rem;
					font-size: 12/@rem;
					line-height: 12/@rem;
					color: @white;
				}
			}
		}
	}
	.unsettle-tickets{
		display: flex;
		justify-content: space-between;
		font-size: 12/@rem;
		margin-top: 10/@rem;
		.link{
			color: #3656a3;
			padding-right: 10/@rem;
		}
		.icon-right {
			// margin-left: 5/@rem;
			.m-icon-arrow--right();
			&::before {
				font-size: 10/@rem;
				color: #3656a3;
			}
		}
	}
}
.coin-success {
	&.es-dialog.m-dialog {
		padding-top: 0;
		border-radius: 4/@rem;
	}
	.es-dialog-main.m-dialog-main {
		padding: 0;
	}
}
</style>
