<template>
	<div class="odds-boost-wrap">
		<div class="odds-boost-header">
			<img src="./image/odds-boost.jpg" class="odds-boost-background"/>
			<div class="odds-boost-upper">
				<a class="sportybet-logo" :href="homeUrl" title="sportybet logo"></a>
				<div :class="['odds-boost-claim-wrap', showTimer ? '' : 'odds-boost-claim-wrap--notimer' ]">
					<Timer class="odds-boost-timer" :delta="timeDelta" v-if="showTimer" @timeout="onTimeout"/>
					<div class="odds-boost-claim">
						<template v-if="claimed">
							<div class="claim-btn claimed-btn">Claimed</div>
							<div class="offer-left-label"><span class="offer-number">{{remainNum}}</span> Offers Left!</div>
						</template>
						<template v-else-if="commingSoon">
							<div class="claim-btn soon-btn">Upcoming Soon</div>
						</template>
						<template v-else-if="upComing">
							<div class="next-round-label">Next Round: {{nextRoundTime}}</div>
							<div class="claim-btn upcoming-btn">Upcoming on {{nextDay}}</div>
						</template>
						
						<template v-else-if="ableClaim">
							<div :class="['claim-btn', 'now-btn']" @click="onClaimNow">
								<span class="now-loading-icon" v-if="loading"></span>
								Claim Now
							</div>
							<div class="offer-left-label"><span class="offer-number">{{remainNum}}</span> Offers Left!</div>
						</template>
						<template v-else-if="runOut">
							<div class="next-round-label">Next Round: {{nextRoundTime}}</div>
							<div class="claim-btn runout-btn">Offers Ran Out</div>
						</template>
					</div>
				</div>
			</div>
		</div>
		<div class="howto-title">HOW TO</div>
		<ul class="step-list">
			<li class="step-item">
				<span class="step-no">Step 1</span>
				<span class="step-content">
					Click on "CLAIM NOW" from <em class="step-em">{{startDay.toUpperCase()}}</em> to <em class="step-em">{{endDay.toUpperCase()}}</em>
				</span>
			</li>
			<li class="step-item">
				<span class="step-no">Step 2</span>
				<span class="step-content">
					Select <em class="step-em">O/U</em> or <em class="step-em">Next Goal</em> from any <em class="step-em">Live</em> of <em class="step-em">England Premier League</em> on current <em class="step-em">WEEKEND</em>
				</span>
			</li>
			<li class="step-item">
				<span class="step-no">Step 3</span>
				<span class="step-content">
					Play <em class="step-em">Single Live</em> and click on "Boost" in the betslip
					<img src="./image/step-3.jpg" class="step-image"/>
				</span>
			</li>
			<li class="step-item">
				<span class="step-no">Step 4</span>
				<span class="step-content">
					The odds of your selections will be enhanced
					<img src="./image/step-2.jpg" class="step-image"/>
				</span>
			</li>
		</ul>
		<div class="terms-title">Terms and Conditons</div>
		<ul class="terms-list">
			<li class="term-item"><span class="term-index">1. </span>Promotion Period: {{startTime}} - {{endTime}} ({{startDay}} to {{endDay}}).</li>
			<li class="term-item"><span class="term-index">2. </span>The "Odds Boost" offer is only valid for current weekend ({{usableFormatTime}} - {{expireFormatTime}} {{usableDay}} to {{expireDay}}).</li>
			<li class="term-item" v-for="(item, index) in terms" :key="index + 2"><span class="term-index">{{index + 3}}. </span>{{item}}
				<template v-if="index === 1">
					<br/> 
					a) Odds Boost can only be applied to Live Singles. Odds Boost tokens cannot be used on Multiple or System bets.
					<br/>
					b) Bets must include the appointed matches of the English Premier League.
				</template>
			</li>
		</ul>

		<a :href="downloadApp" class="download-app"></a>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import dialog from 'components/dialog';
import { getAdConfig } from 'utils/getAdConfig';

import Timer from './timer.vue';

export default {
	components: {
		Timer,
	},
	data() {
		return {
			homeUrl: pagePath.home,
			downloadApp: pagePath.downloadApp,
			terms: [
				'Each customer can only claim 1 offer during the promotion period. The "Odds Boost" offer can only be used once on the English Premier League (EPL) for Live Singles during Weekends.',
				'Betting Rules:',
				'Odds boost can only be used for 1 ticket: once the "Boost" button is clicked on, the odds in your betslip will instantly increase.',
				'Market restriction: only O/U and Next Goal are valid for their odds to be boosted.',
				'A button will be displayed if your selection fits the requirements for the "Odds Boost" Promotion, click it for the odds to be increased.',
				'Cash Out is not available for tickets with Odds “boosted” in the “Odds Boost” promotion.',
				'In this promotion, SportyBet only allows one chance to award the offer per person / household address / email address / mobile number / debit / credit card number / IP address / device number. Duplicate accounts will be closed and will not qualify for this offer. Any winnings obtained unlawfully from this bonus will be removed. Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts. SportyBet reserves itself the rights to amend, cancel, reclaim or refuse any promotion at its own discretion.',
			],
			loading: false,
		};
	},
	computed: {
		...mapState('oddsBoost', [
			'receivingStartTime',
			'receivingEndTime',
			'usableTime',
			'expireTime',
			'nextPeriodTime',
			'nowTime',
			'remainNum',
			'userStatus',
			'periodId',
			'needClaim'
		]),
		...mapGetters('oddsBoost', [
			'isDuringClaim',
			'isDuringUsage'
		]),
		nextRoundTime() {
			return dateFormat.format(this.nextPeriodTime, 'YYYY-MM-DD');
		},
		startTime() {
			return dateFormat.format(this.receivingStartTime, 'YYYY-MM-DD HH:mm:ss');
		},
		endTime() {
			return dateFormat.format(this.receivingEndTime, 'YYYY-MM-DD HH:mm:ss');
		},
		usableFormatTime() {
			return dateFormat.format(this.usableTime, 'YYYY-MM-DD HH:mm:ss');
		},
		expireFormatTime() {
			return dateFormat.format(this.expireTime, 'YYYY-MM-DD HH:mm:ss');
		},
		usableDay() {
			return dateFormat.format(this.usableTime, 'dddd');
		},
		expireDay() {
			return dateFormat.format(this.expireTime, 'dddd');
		},
		nextDay() {
			return dateFormat.format(this.nextPeriodTime, 'dddd');
		},
		startDay() {
			return dateFormat.format(this.receivingStartTime, 'dddd');
		},
		endDay() {
			return dateFormat.format(this.receivingEndTime, 'dddd');
		},
		hasNext() {
			return this.nextPeriodTime;  // 是否存在下一期
		},
		commingSoon() {
			// 没有下一期
			return !this.isDuringClaim && !this.hasNext;
		},
		upComing() {
			// 有下一期
			return !this.isDuringClaim && this.hasNext;
		},
		claimed() {
			// 已领取
			return (this.isDuringClaim && [1, 2].includes(this.userStatus) || this.isDuringUsage && this.userStatus === 1);
		},
		ableClaim() {
			return this.isDuringClaim && this.remainNum > 0; // userStatus == 2
		},
		runOut() {
			return this.isDuringClaim && this.remainNum === 0;
		},
		timeDelta() {
			return this.receivingEndTime - this.nowTime;
		},
		showTimer() {
			// 有效时间内，有剩余
			return this.isDuringClaim && this.remainNum > 0;
		},
	},
	created() {
		// const loading = document.querySelector('#pageLoading');
		// loading.style.display = 'none';
		this.getAds()
		.then(ad => {
			if (ad && ad.linkUrl) {
				// 不是 odds_boost页面则调整
				if (!(/promotions\/odds_boost/.test(ad.linkUrl))) {
					location.replace(ad.linkUrl);
					return;
				}
			}
			const loading = document.querySelector('#pageLoading');
			loading.style.display = 'none';
		})
		.catch(() => {
			const loading = document.querySelector('#pageLoading');
			loading.style.display = 'none';
		});
		this.getOddsBoost();
		// .then(data => {
		// 	// android 发版，按照更新不及时兼容; 访问老页面重定向
		// 	if (data.needClaim === 2) {
		// 		location.replace(`https://www.sportybet.com/swdp/pagemaker/sportybet/${window.country}/crazyweek1/index.htm`);
		// 		return;
		// 	}
		// 	const loading = document.querySelector('#pageLoading');
		// 	loading.style.display = 'none';
		// })
		// .catch(() => {
		// 	const loading = document.querySelector('#pageLoading');
		// 	loading.style.display = 'none';
		// });
	},
	methods: {
		...mapActions('oddsBoost', [
			'getOddsBoost'
		]),
		...mapMutations('oddsBoost', [
			'UPDATE'
		]),
		onClaimNow() {
			// 判断是否登录
			if (!window.loginStatus) {
				dialog.toast('You need to log in to claim');
				window.login && window.login.show();
				EventBus.$once(commonEvent.UPDATE_LOGIN_STATUS, () => {
					window.login && window.login.close();
					this.getOddsBoost();
				});
				return;
			}
			this.submitClaim();
		},
		submitClaim() {
			if (this.loading) {
				return;
			}
			this.loading = true;
			fetch('marketing/v1/activities/oddsBoost/claim', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'Application/json'
				}),
				body: JSON.stringify({
					periodId: this.periodId
				})
			}).then(res => res.json())
			.then(res => {
				this.loading = false;
				const data = res.data;
				if (res.bizCode === 10000) {
					// 成功claim
					if (data) {
						dialog.toast('Offer Claimed!', 1500);
						this.UPDATE({
							userStatus: 1,
							remainNum: this.remainNum - 1,
						});
					}
				} else if (res.bizCode === 75000) { // 过期
					this.UPDATE({
						nowTime: this.receivingEndTime + 1
					});
					dialog.toast('This round of offer has just ended!');
				} else if (res.bizCode === 75100) { // 没有可用数量
					this.UPDATE({
						remainNum: 0
					});
					dialog.toast('You are late! All offers are gone!');
				}
			}).catch(() => {
				this.loading = false;
			});
		},
		onTimeout() {
			this.UPDATE({
				nowTime: this.receivingEndTime + 1
			});
		},
		getAds() {
			return getAdConfig('oddsBoostLink').then(ads => {
				const ad = ads[0];
				return ad;
			});
		},
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/animate.less';
.odds-boost-header{
	position: relative;
	background-color: #044090;
	min-height: 300/@rem;
	.odds-boost-background{
		width: 100%;
	}
	.odds-boost-upper{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.odds-boost-claim-wrap{
		position: absolute;
		bottom: 15/@rem;
		width: 100%;
	}
	.odds-boost-claim-wrap--notimer{
		bottom: 64/@rem;
	}
}
.sportybet-logo{
	display: block;
	height: 42/@rem;
	width: 140/@rem;
	padding: 10/@rem;
	line-height: 42/@rem;
	.m-icon-sportbet();
	&::before{
		font-size: 24/@rem;
		color: #FFF;
	}
}
.odds-boost-timer{
	margin: 10/@rem 0 20/@rem;
}
.claim-btn{
	width: 210/@rem;
	height: 48/@rem;
	margin: 0 auto;
	line-height: 48/@rem;
	text-align: center;
	font-size: 14/@rem;
	font-weight: bold;
	box-sizing: border-box;
	border-radius: 5/@rem;
}
.soon-btn,.upcoming-btn,.runout-btn{
	border: 1px solid #979797;
	color: #FFF;
	opacity: 0.6;
}
.now-btn{
	position: relative;
	background-image: linear-gradient(to right, #ffe500, #faba2b);
	box-shadow: 0 2px 4px 2px #763172;
	color: #073974;
}
.now-loading-icon{
	position: absolute;
	height: 20/@rem;
	width: 20/@rem;
	top: 50%;
	margin-top: -10/@rem;
	margin-left: -30/@rem;
	line-height: 20/@rem;
	text-align: center;
	.m-icon-loading();
	color: #FFF;
	animation: circles 2s infinite;
}
.claimed-btn{
	background-color: #c49212;
	color: #021533;
}
.next-round-label{
	text-align: center;
	font-size: 14/@rem;
	color: #FFF;
	margin-bottom: 6/@rem;
}
.offer-left-label{
	font-size: 16/@rem;
	color: #FFF;
	font-weight: bold;
	line-height: 24/@rem;
	text-align: center;
	margin-top: 10/@rem;
	.offer-number{
		font-size: 18/@rem;
	}
}
.howto-title{
	margin: 40/@rem 20/@rem 20/@rem;
	font-size: 18/@rem;
	font-weight: bold;
	color: #044090;
}
.step-list{
	margin: 10/@rem 20/@rem;
}
.step-item{
	display: flex;
	margin: 10/@rem 0;
}
.step-no{
	font-size: 16/@rem;
	color: #044090;
	font-weight: bold;
	margin-right: 5/@rem;
	white-space: nowrap;
	flex-shrink: 0;
}
.step-content{
	font-size: 12/@rem;
	line-height: 20/@rem;
	.step-em{
		font-weight: bold;
	}
	.step-image{
		width: 100%;
		margin-top: 10/@rem;
		border: 1px solid #979797;
	}
}
.terms-title{
	margin: 30/@rem 20/@rem 10/@rem;
	font-size: 12/@rem;
	font-weight: bold;
	color: #353a45;
}
.terms-list{
	margin: 0 20/@rem;
	color: #353a45;
	font-size: 12/@rem;
	line-height: 1.8;
	text-align: justify;
}
.term-item{
	margin: 5/@rem 0;
}
.term-index{
	font-weight: bold;
}
.download-app{
	display: block;
	margin: 20/@rem;
	height: 76/@rem;
	background-repeat: no-repeat;
	background-image: url('./image/download_app.jpg');
	background-size: 100%;
}
</style>

