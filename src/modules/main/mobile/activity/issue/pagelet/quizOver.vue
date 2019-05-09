<template>
	<div class="m-issue-over" v-loading="isLoading">
		<div class="m-issue-blank"></div>
		<div class="m-issue-board">
			<div class="m-over-title">The Quiz is Over !</div>
			<div class="m-issue-bonus-wrap">
				<img class="icon-bonus" src="../image/money.png"/>
				<div class="m-issue-wrap">
					<div class="m-issue-bonus"><span class="m-issue-kes">{{showCurrency}}</span>{{result.eachUserPrize}}</div>
					<div class="per-winner">Per winner</div>
				</div>
			</div>
			<div class="m-issue-participant">{{result.userAmount}} <span>Winners</span></div>
			<div class="m-heat-winner-wrap" v-if="heatObj.winner === 'home'">
				<img class="icon-kenya" src="../image/kenya-icon.png"/>
				<p class="m-heat-winner">Kenyan participants will get an extra Cash Gift ！</p>
			</div>
			<div class="m-heat-winner-wrap" v-else>
				<img class="icon-kenya" src="../image/nigeria-icon.png"/>
				<p class="m-heat-winner">Nigeria participants will get an extra Cash Gift ！</p>
			</div>
		</div>
		<div class="m-action-bar">
			<div class="m-check-gift" @click="checkGifts">Check Gifts</div>
			<div class="m-go-bet" @click="goBet">Go Bet</div>
		</div>
		<div class="m-heat-title">Heat Index</div>
		<div class="kenya-heat">
			<div :class="'country-wrap' + (country === 'ke' ? ' myteam' : '')">
				<img class="country-icon" src="../image/kenya-icon.png"/>
				<div class="country-label">
					Kenya
					<img class="my-team" v-if="country === 'ke'" src="../image/my-team.svg"/>
				</div>
			</div>
			<div class="heat-wrap">
				<img class="heat-winner" v-if="heatObj.winner==='home'" src="../image/winner.png"/>
				<div class="heat-value home" :style="`width: ${heatObj.homeWidth}`">{{heatObj.home}}</div>
			</div>
		</div>
		<div class="nigeria-heat">
			<div :class="'country-wrap' + (country === 'ng' ? ' myteam' : '')">
				<img class="country-icon" src="../image/nigeria-icon.png"/>
				<div class="country-label">
					Nigeria
					<img class="my-team" v-if="country === 'ng'" src="../image/my-team.svg"/>
				</div>
			</div>
			<div class="heat-wrap">
				<img class="heat-winner" v-if="heatObj.winner==='away'" src="../image/winner.png"/>
				<div class="heat-value" :style="`width: ${heatObj.awayWidth}`">{{heatObj.away}}</div>
			</div>
		</div>
		<div class="issue-super-winner-wrap" v-if="hasAwardUser">
			<img class="issue-super-winner-slogan" src="../image/superWinner.png" />
			<div class="issue-super-winner-phone" v-for="(user, index) in awardUsers" :key="index">
				<img class="super-winner-sporty" src="../image/sporty.svg"/>
				<span class="super-winner-phone-number">{{user.phone}}</span>
			</div>
			<div class="issue-super-winner-ad">
				<div class="issue-super-winner-image"> <img class="image-item" :src="bigAwardImgUrl"/></div>
				<div class="super-winner-ad-content">
					<div class="super-ad-btn-text">{{bigAwardBtnText}}</div>
					<div class="super-ad-text">{{bigAwardText}}</div>
				</div>
			</div>
			<div class="issue-super-winner-footer">The Super Winner will receive an SMS from SportyBet regarding the super prize's redemption.</div>
		</div>
		<div class="quiz-over-advert" v-if="advertUrl">
			<a :href="linkUrl"><img class="quiz-over-advert-image" :src="advertUrl" /></a>
		</div>
		<div class="m-winner-wrap">
			<h2 class="m-winner-title">+ <span class="winner-and-prize">Part of Our Winners & Prizes</span> +</h2>
			<div class="m-winner-header">
				<div class="m-winner-player">Player</div>
				<div class="m-winner-gift">Cash Gift Value</div>
			</div>
			<ul class="m-winner-list">
				<li class="m-winner-item" v-for="(winner, index) in result.prizeList" :key="index">
					<span class="m-winner-phone">{{winner.phone}}</span>
					<span class="m-winner-value">{{showCurrency}} {{winner.prize}}</span>
				</li>
			</ul>
			<div class="m-winner-point">... ...</div>
		</div>
	</div>
</template>

<script>
import { formatNumber } from 'utils';
import { mapState, mapMutations } from 'vuex';
import appCore from 'appCore';
import { pagePath } from 'config/pageConfig.js';
import { showCurrency } from 'config/currencyConfig';
import { UPDATE_GIFT } from 'store/issue/mutationTypes';
import { appPath } from 'config/appPagePath';
import giftDialog from './giftDialog.vue';
import awardDialog from './phoneAwardDialog.vue';
import { getAdvertInObject } from '../js/commonFun';

export default {
	data () {
		return {
			isLoading: false,
			result: '',
			country: window.country,
			showCurrency
		};
	},
	created() {
		this.fetchResult();
	},
	computed: {
		...mapState('issue', [
			'heatObj',
			'adConfig'
		]),
		quizShowResult() {
			const advert = this.adConfig.quizShowResult;

			return getAdvertInObject(advert);
		},
		advertUrl() {
			// return require('../image/btnBarBg.png');  // test data

			if (this.quizShowResult) {
				return this.quizShowResult.imgUrl;
			}
			return null;
		},
		linkUrl() {
			if (this.quizShowResult) {
				return this.quizShowResult.linkUrl;
			}
			return null;
		},
		quizShowPopup() {
			const advert = this.adConfig.quizShowPopup;

			return getAdvertInObject(advert);
		},
		quizShowBigAward() {
			const advert = this.adConfig.quizShowBigAward;

			return getAdvertInObject(advert);
		},
		bigAwardImgUrl() {
			if (this.quizShowBigAward) {
				return this.quizShowBigAward.imgUrl;
			}
			return null;
		},
		bigAwardBtnText() {
			if (this.quizShowBigAward) {
				return this.quizShowBigAward.btnText;
			}
			return '';
		},
		bigAwardText() {
			if (this.quizShowBigAward) {
				return this.quizShowBigAward.text;
			}
			return '';
		},
		popupText() {
			if (this.quizShowPopup) {
				return this.quizShowPopup.btnText;
			}
			return '';
		},
		popupImgUrl() {
			if (this.quizShowPopup) {
				return this.quizShowPopup.imgUrl;
			}
			return null;
		},
		awardUsers() {
			const users = this.result && this.result.rndGiftUser || [];
			return users;
		},
		hasAwardUser() {
			return this.awardUsers.length > 0;
		}
	},
	methods: {
		...mapMutations('issue', {
			changeGift: UPDATE_GIFT
		}),
		fetchResult() {
			this.isLoading = true;
			fetch('/promotion/v1/activities/quiz/periodResult', {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					const data = res.data || {};
					const result = {};
					result.rndGiftUser = data.rndGiftUser || [];

					result.eachUserPrize = formatNumber(data.eachUserPrize / 10000);
					result.userAmount = formatNumber(data.userAmount);
					result.prizeList = (data.prizeList || []).map(winner => ({
						phone: winner.phone,
						prize: formatNumber(winner.prize / 10000, 2)
					}));

					const users = result.rndGiftUser || [];
					// 当前用户是否中奖
					const winners = users.filter(user => user.uid);
					const isWinner = winners[0]; // 获取当前用户是否中大奖

					let content;
					let dlgData = {};

					if (data.userTotalPrize > 0) {
						this.changeGift(data.userTotalPrize / 10000);
						result.userTotalPrize = formatNumber(data.userTotalPrize / 10000);
						content = giftDialog;
						dlgData = {
							gift: result.userTotalPrize
						};
					}
					// 当前用户获奖
					if (isWinner) {
						content = awardDialog;
						dlgData = {
							gift: result.userTotalPrize,
							adUrl: this.popupImgUrl,
							text: this.popupText
						};
					}

					this.result = result;
					if (!content) {
						return;
					}

					const d = this.$dialog({
						title: null,
						css: 'm-issue-toast',
						content,
						width: '100%',
						contentData: dlgData,
						button: [],
					});
					d.onMounted(() => {
						d.setPosition({
							top: '10%'
						});
					});
				}
			}).catch(() => {
				this.isLoading = false;
			});
		},
		checkGifts() {
			if (appCore.getAppName() === 'sportybet') {
				appCore.sendCmd(appPath.gifts);
			} else {
				location.href = pagePath.gifts;
			}
		},
		goBet() {
			if (appCore.getAppName() === 'sportybet') {
				appCore.sendCmd(appPath.home);
			} else {
				location.href = pagePath.home;
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable';

.m-issue-over {
	min-height: 100%;
	background-image: linear-gradient(to bottom, #2b0098, #7c2bb7);

	.m-issue-blank {
		height: 63/@rem;
		margin: 0 90/@rem;
		background-image: url('../image/line.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.m-issue-board {
		margin: 0 30/@rem;
		background-image: url('../image/board.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		padding: 22/@rem 22/@rem 35/@rem 22/@rem;

		.m-over-title {
			font-size: 24/@rem;
			line-height: 28/@rem;
			font-weight: 900;
			text-align: center;
  			color: #ffcb23;
		}
		.m-issue-bonus-wrap {
			display: flex;
			align-items: center;
			justify-content: center;

			.icon-bonus {
				flex: 0 0 auto;
				height: 74/@rem;
				width: 74/@rem;
				margin-right: 12/@rem;
			}

			.m-issue-wrap {
				flex: 0 0 auto;
				text-align: center;
				.m-issue-bonus {
					line-height: 28/@rem;
					font-size: 24/@rem;
  					font-weight: 900;
					color: @white;
					.m-issue-kes {
						font-size: 16/@rem;
					}
				}
				.per-winner {
					line-height: 14/@rem;
					font-size: 12/@rem;
					color: @white;
				}
			}
		}

		.m-issue-participant {
			font-size: 20/@rem;
			font-weight: bold;
			line-height: 24/@rem;
			text-align: center;
			color: @white;
			span {
				font-size: 12/@rem;
				font-weight: normal;
			}
		}

		.m-heat-winner-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 12/@rem;
			.icon-kenya {
				flex: 0 0 auto;
				height: 26/@rem;
				margin-right: 15/@rem;
			}
			.m-heat-winner {
				flex: 0 0 auto;
				width: 70%;
				font-size: 12/@rem;
				line-height: 16/@rem;
				color: @white;
			}
		}
	}

	.m-action-bar {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-top: 10/@rem;
		margin-bottom: 30/@rem;
		.m-check-gift {
			flex: 0 0 auto;
			padding: 0 20/@rem;
			font-size: 16/@rem;
			font-weight: 500;
			line-height: 40/@rem;
			border: solid 2px #692bff;
			border-radius: 25/@rem;
			color: @white;
			background-color: #2b0098;
		}
		.m-go-bet {
			flex: 0 0 auto;
			padding: 0 40/@rem;
			font-size: 16/@rem;
			font-weight: 500;
			line-height: 40/@rem;
			border: solid 2px #692bff;
			border-radius: 25/@rem;
			color: @white;
			background-color: #692bff;
		}
	}

	.m-heat-title {
		margin-top: 27/@rem;
		margin-bottom: 14/@rem;
		text-align: center;
		font-size: 16/@rem;
		color: @white;
		font-weight: bold;
		line-height: 19/@rem;
	}

	.nigeria-heat {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.heat-winner {
			position: absolute;
			left: 6/@rem;
			top: 22/@rem;
		}
	}

	.kenya-heat {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 15/@rem;

		.heat-winner {
			position: absolute;
			left: 6/@rem;
			top: -18/@rem;
		}
	}
	.country-wrap {
		flex: 0 0 auto;
		display: flex;
		height: 32/@rem;
		align-items: center;
		justify-content: center;
		&.myteam {
			background-color: #692bff;
			border-bottom-right-radius: 16/@rem;
			border-top-right-radius: 16/@rem;
		}
		.country-icon {
			flex: 0 0 auto;
			margin-left: 20/@rem;
			width: 26/@rem;
			height: 26/@rem;
			margin-right: 10/@rem;
		}
		.country-label {
			flex: 0 0 auto;
			width: 60/@rem;
			position: relative;
			color: @white;
			font-size: 14/@rem;
			line-height: 16/@rem;
			font-weight: bold;
			.my-team {
				position: absolute;
				top: -20/@rem;
				left: 0;
			}
		}
	}
	.heat-wrap {
		flex: 1 1 auto;
		margin-left: 10/@rem;
		margin-right: 12/@rem;
		position: relative;

		.heat-value {
			display: inline-block;
			width: 80%;
			text-align: center;
			font-size: 14/@rem;
			line-height: 18/@rem;
			border-radius: 12/@rem;
			background-color: #237dff;
			color: @white;
			font-weight: bold;
			&.home {
				background-color: #ffa600;
			}
		}
	}

	.m-winner-wrap {
		margin: 35/@rem 18/@rem 0 18/@rem;
		padding: 20/@rem;
		border-radius: 2/@rem;
		background-color: #7033b5;
		.m-winner-title {
			margin-bottom: 20/@rem;
			font-size: 16/@rem;
			line-height: 20/@rem;
			font-weight: 900;
			color: #00b7ff;
			text-align: center;
			.winner-and-prize {
				color: #fac111;
			}
		}
		.m-winner-header {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14/@rem;
			line-height: 16/@rem;
			font-weight: 500;
			color: @white;
			opacity: 0.4;

			.m-winner-player {
				flex: 1 1 auto;
				text-align: left;
			}
			.m-winner-gift {
				flex: 1 1 auto;
				text-align: right;
			}
		}
		.m-winner-list {
			.m-winner-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #854cc5;
				font-size: 14/@rem;
				line-height: 30/@rem;

				.m-winner-phone, .m-winner-value {
					flex: 0 0 auto;
					color: @white;
				}
			}
			.m-winner-item:last-child {
				border: none;
			}
		}

			.m-winner-point {
				font-size: 20/@rem;
				line-height: 24/@rem;
				font-weight: 900;
				color: @white;
				text-align: center;
			}
	}
	.quiz-over-advert {
		margin: 24/@rem 18/@rem 0;
		border-radius: 2/@rem;
		.quiz-over-advert-image {
			width: 100%;
		}
	}
}
.issue-super-winner-wrap{
	position: relative;
	padding: 16/@rem 16/@rem 12/@rem;
	margin: 60/@rem 16/@rem 40/@rem;
	background-color: rgba(105, 43, 255, 0.65);
	border-radius: 2/@rem;
}
.issue-super-winner-slogan{
	margin-top: -36/@rem;
	width: 100%;
	margin-bottom: 5/@rem;
}
.issue-super-winner-phone{
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 5/@rem;
}
.super-winner-sporty{
	width: 24/@rem;
	height: 24/@rem;
	margin-right: 22/@rem;
}
.super-winner-phone-number{
	font-size: 20/@rem;
	color: #FFF;
	font-weight: bold;
}
.issue-super-winner-ad{
	display: flex;
}
.issue-super-winner-image{
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	.image-item{
		max-width: 100%;
	}
}
.super-winner-ad-content{
	flex-basis: 192/@rem;
	flex-shrink: 0;
	flex-grow: 0;
	margin-left: 10/@rem;
	.super-ad-btn-text{
		margin: 6/@rem 0 15/@rem;
		font-size: 20/@rem;
		font-weight: bold;
		color: #fac111;
	}
	.super-ad-text{
		font-size: 12/@rem;
		line-height: 1.2;
		color: #FFF;
	}
}
.issue-super-winner-footer{
	margin-top: 8/@rem;
	font-size: 12/@rem;
	line-height: 1.5;
	color: rgba(255, 255, 255, 0.6);
}


</style>
