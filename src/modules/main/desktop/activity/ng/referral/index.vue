<template>
<div>
	<div class="top">
		<img src="./image/background.jpg" class="top-img">
	</div>
	<div class="main">
		<div class="highlight">
		  <div class="banner">
			  <div class="parallelograms">
				  <div class="parallelogram larger up"></div>
				  <div class="parallelogram larger down"></div>
			  </div>
			  <div class="got-gifts">
				  <div class="got">YOU GOT A TOTAL OF</div>
				  <div class="gifts">
					  {{currency}} <span style="font-size:43.5px">{{totalGiftAmount}}</span> IN DISCOUNT GIFTS.
				  </div>
			  </div>
			  	<div class="view-more" @click="popReferral">View More</div>
			  <div class="parallelograms">
				  <div class="parallelogram smaller down"></div>
				  <div class="parallelogram smaller up"></div>
			  </div>
			  <div class="parallelograms" style="margin-left:-16px">
				  <div class="parallelogram smaller down"></div>
				  <div class="parallelogram smaller up"></div>
			  </div>
			  <div class="follow-steps-wrapper">
				  <span class="block"></span>
				  <span class="follow-steps">FOLLOW THE STEPS BELOW TO GET YOUR GIFTS</span>
			  </div>
		  </div>
		</div>
		<div class="invalid-wrapper" v-if="status===40">
			<div class="invalid"></div>
			<span class="attention">!</span>
			<span class="invalid-content">
				THIS PROMOTION IS CURRENTLY SUSPENDED, YOUR REFERRAL CODE IS NO LONGER VALID. HOWEVER, IT IS STILL POSSIBLE FOR YOU TO RECEIVE GIFTS FROM YOUR PREVIOUS REFERRED FRIENDS.
			</span>
		</div>
		<div class="tabs-wrapper" v-if="status!==40">
			<div class="tabs">
				<div class="tab" :class="[option1? 'active':'']" style="padding-left:87px;" @click="toOption1">
					<div class="option">OPTION 1</div>
					<div class="content">ONLINE SHARING</div>
				</div>
				<div class="tab" :class="[option2? 'active':'']" style="padding-left:44px;" @click="toOption2">
					<div class="option">OPTION 2</div>
					<div class="content">SHARE A REFERRAL CODE</div>
				</div>
				<div class="rules-wrapperA" v-if="option2">
					<div class="rule-wrapper" style="margin-top:62px">
						<span class="number">1.</span>
						<span class="rule">Kindly tell your friend this Referral Code:</span>
						<span style="font-size: 21.6px;margin-left:32px;">{{referralCode}}</span>
					</div>
					<div class="rule-wrapper">
						<span class="number">2.</span>
						<span class="rule" style="vertical-align:super">Help them go through the registration process with either of the following options:</span>
						<div class="details">
							<p class="rule" style="margin-left:95px; display:inline-table">Let your friend register using our PC/Mobile/<br>App versions of SportyBet, and fill in the "Referral<br>Code" field with your code. (Please, remind your<br> friend to click "Apply")</p>
							<!-- <span class="rule" style="margin-left:53px;display:inline-table;vertical-align:top;">2. Tell your friends to send an SMS with your<br>Referral Code {{referralCode}}  to 654.</span> -->
							<img src="./image/example1.png" class="first-img">
							<!-- <img src="./image/example2.png" class="second-img"> -->
						</div>
					</div>
					<div class="rule-wrapper">
						<span class="number">3.</span>
						<span class="rule" style="display:inline-block">After your friend made Settled Stakes in a Total value of {{currency}} 300 or above, SportyBet will<br>credit your account. Gifts can be viewed by going to <a :href="gift" style="text-decoration: underline;color: #2d6ee3;">"Gifts".</a></span>
					</div>
				</div>
				<div class="rules-wrapperB" v-if="option1">
					<div class="rule-wrapper" style="margin-top:62px">
						<span class="number">1.</span>
						<span class="rule" style="display:inline-block;">Please, click on "Copy" and post the copied message into your social media platform. </span>
						<textarea type="text" class="copy" :value="text"></textarea>
						<div class="copy-con">Hi! Have you heard of SportyBet?! It's a whole new concept at Betting! Follow me and give it a try! UP to {{currency}} 10000 Discount gifts on first deposit! Check {{protocol}}//www.sportybet.com/ng/?referralCode={{referralCode}}</div>
					</div>
					<div class="btn" @click="copyLink">Copy</div>
					<div class="rule-wrapper" style="margin-top:52px;">
						<span class="number" style="padding-right:39px;display:table-cell">2.</span>
						<span class="rule" style="display:table-cell;vertical-align:middle">After your friend made Settled Stakes in a Total value of NGN 300 or above, SportyBet will credit your account. Gifts can be viewed by going to <a :href="gift" style="text-decoration: underline;color: #2d6ee3;">"Gifts".</a></span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="promotion-details">
		<div class="title">Terms and Conditions:</div>
		<div class="detail" v-for="(item, index) in details" :key="index">
			<p>{{item}}</p>
			<p class='requirements' v-if="index===0" v-for="(item,idx) in requirements" :key="idx"><strong>{{item.index}}</strong> {{item.con}}</p>
		</div>
	</div>
</div>

</template>
<script>
import { pagePath } from 'config/pageConfig';
import { userCenterConfig } from 'config/order/userCenterConfig';
import cookie from 'packages/lib/utils/cookie.js';
import referralPop from './popReferral';

let popDialog = null;
export default {
	data () {
		return {
			details: [],
			requirements: [],
			option1: true,
			option2: false,
			currency: window.currency || 'NGN',
			referralCode: 'R' + cookie.get('phone'),
			activityId: '',
			totalGiftAmount: 0,
			status: 30,
			gift: userCenterConfig.Gifts,
			protocol: location.protocol,
			text: '',
			// startDate: '27/06/2018',
			// endDate: '30/09/2018'
		};
	},
	components: {
		referralPop
	},
	created () {
		this.text = `Hi! Have you heard of SportyBet?! It's a whole new concept at Betting! Follow me and give it a try! UP to ${this.currency} 10000 Discount gifts on first deposit! Check ${this.protocol}//www.sportybet.com/ng/?referralCode=${this.referralCode}`;
		this.details = [
			'1. Stake Conditions to get Gift:',
			'2. To qualify for a Referral Gift, the referred customer must be a new customer and not hold any account at SportyBet.',
			`3. Once the newly referred customer meets the Stake Conditions (A, B and C), A total value of ${this.currency} 50 "Discount Gift" will be credited to the referrer’s account.`,
			'4. There is no limit to the number of possible referrals.',
			'5. Every Gift obtained from this promotion will be valid for 7 days.',
			'6. SportyBet reserves itself the right to amend, cancel, reclaim or refuse any promotion in order to ensure equality and the balance of promotions at its own discretion. Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts.',
		];
		this.requirements = [
			{ con: `A newly referred customer at SportyBet must place a total amount of Stakes with all Odds of 2.0 or above which account for a total of ${this.currency} 300 or more.`, index: 'A.' },
			{ con: 'Only Settled Stakes are valid for this promotion.', index: 'B.' },
			{ con: 'A Settled Stake will not be valid if a stake has been fully cashed out. If a stake has been partially cashed out, the Settled Stake will be calculated based on the remaining active stake.', index: 'C.' }
		];
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
			this.getQualifyStatus();
			// this.getTotalParticipantsNum();
		}
	},
	methods: {
		copyLink () {
			document.querySelector('.copy').select();
			document.execCommand('Copy');
			this.$toast('Successfully copied!');
		},
		toOption1 () {
			this.option1 = true;
			this.option2 = false;
		},
		toOption2 () {
			this.option2 = true;
			this.option1 = false;
		},
		popReferral () {
			if (window.loginStatus === true) {
				popDialog = this.$dialog({
					title: null,
					content: referralPop,
					button: []
				}).onBtnClick(btnType => {
					popDialog.close();
					popDialog = null;
				});
			} else {
				location.href = pagePath.login;
			}
		},
		getQualifyStatus () {
			return fetch('/marketing/v1/activities/getByKind?kind=5', {
				method: 'GET'
			})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						this.totalGiftAmount = res.data.totalGiftAmount / 10000;
						this.status = res.data.status;
						// this.activityStartTime = ret.data.activityStartTime;
						// this.activityEndTime = ret.data.activityEndTime;
						// this.isQualified = !!ret.data.isQualified;
						// this.totalParticipantsNum = ret.data.participantsNum;
					}
				});
		}
	}
};
</script>
<style lang="less">
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.invalid-wrapper {
  width: 822px;
  margin: 0 auto;
  position: relative;
}
.invalid {
  height: 116px;
  opacity: 0.1;
  border-radius: 2px;
  background-color: #fafd00;
}
.attention {
  display: inline-block;
  width: 29px;
  height: 29px;
  line-height: 29px;
  border-radius: 14.5px;
  position: absolute;
  left: 48px;
  top: 43px;
  font-size: 29px;
  text-align: center;
  background: #f9c12f;
  color: #fff;
}
.invalid-content {
  width: 635px;
  height: 54px;
  display: inline-block;
  position: absolute;
  left: 97px;
  top: 32px;
  font-size: 15.1px;
  line-height: 1.36;
  text-align: left;
}
.top-img {
	width:100%;
}
.main {
  margin: 0 auto;
  text-align: center;
  color: #343a45;
}
.banner {
  margin-top: 34px;
}
.parallelograms {
  display: inline-block;
}
.parallelogram {
  background: #e21e2f;
}
.larger {
  width: 93px;
  height: 56px;
  margin-left: 33px;
}
.up {
  transform: skewX(-20deg);
}
.down {
  transform: skewX(20deg);
}
.smaller {
  width: 34px;
  height: 19px;
  margin-left: 27px;
}
.got-gifts {
  display: inline-block;
  margin-left: 20px;
  transform: translateY(-20px);
}
.got {
  font-size: 26.6px;
  font-weight: bold;
  line-height: 0.94;
  letter-spacing: 0.7px;
}
.gifts {
  font-size: 25.6px;
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: 0.6px;
}
.view-more {
  width: 269px;
  height: 64px;
  margin-left: 28px;
  transform: translateY(-55px);
  display: inline-block;
  border-radius: 32px;
  background-image: linear-gradient(to bottom, #c10314, #e21e2f 51%, #ff3829);
  color: #fff;
  font-size: 26.4px;
  font-weight: bold;
  line-height: 64px;
  text-align: center;
}
.view-more:hover {
  cursor: pointer;
}
.block {
  width: 16px;
  height: 16px;
  display: inline-block;
  background: #313743;
  margin-right: 5px;
}
.follow-steps {
  font-family: AvenirNext;
  font-size: 25.5px;
  font-weight: bold;
  line-height: 3;
  letter-spacing: 0.6px;
}
.tab {
  width: 329px;
  height: 71px;
  line-height: 35.5px;
  margin-left: 20px;
  box-sizing: border-box;
  background: #f8f8f8;
  text-align: left;
  display: inline-block;
  border: 1px solid #686868;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
}
.tab:hover {
	cursor: pointer;
}
.active {
  position: relative;
  bottom: -1px;
  background: #fff;
  z-index: 1;
}
.option {
  font-size: 15.9px;
}
.content {
  font-size: 20.1px;
}
.rules-wrapperA,
.rules-wrapperB {
  width: 883px;
  margin: 0 auto;
  padding-left: 45px;
  padding-bottom: 57px;
  box-sizing: border-box;
  border: 1px solid #686868;
  text-align: left;
}
.rules-wrapperB {
  position: relative;
}
.rules-wrapper {
  vertical-align: middle;
}
.number {
  margin-right: 49px;
  font-size: 34px;
  font-weight: 900;
}
.rule {
  font-size: 12.5px;
}
.promotion-details {
  margin-bottom: 45px;
  width: 882px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.btn {
  width: 158px;
  height: 56px;
  position: absolute;
  left: 570px;
  top: 156px;
  line-height: 56px;
  text-align: center;
  color: #fff;
  border-radius: 27.8px;
  background-image: linear-gradient(to bottom, #16b219, #1ace1d);
  font-size: 18.5px;
}
.btn:hover {
	cursor: pointer;
}
.title {
  margin-top: 77px;
  margin-bottom: 32px;
  margin-left: 54px;
  font-size: 18.2px;
  line-height: 1.13;
  text-align: left;
}
.details img {
  margin-top: 26px;
  margin-left: 95px;
  margin-bottom: 43px;
}

.details img:first-child {
  margin-left: 141px;
}
.detail {
  margin-left: 85px;
  margin-right: 73px;
  margin-bottom: 16px;
  text-align: left;
  font-size: 12.5px;
  line-height: 1.6;
  letter-spacing: 0.3px;

}
.details .second-img{
	margin-top: -40px;
	margin-left: 40px;
}
.requirements {
  margin-left: 14px;
}
.copy {
  width: 0;
  height: 0;
  position: fixed;
  top: 0;
  left: 0;
}
.copy-con {
  width: 385px;
  height: 114px;
  padding: 21px 18px 23px 25px;
  margin-left: 87px;
  margin-top: 11px;
  box-sizing: border-box;
  box-shadow: 0px 13px 6.4px 0.6px rgba(141, 141, 141, 0.18);
}
</style>
