<template>
	<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
			<div style="overflow: hidden;">
				<div class="icon-container" v-if="showReferrals">
						<i class="m-back-icon-wap" @click="handleBack"></i>
						<span class="back-label" @click="handleBack"> Back</span>
				</div>
				<div class="top" v-if="showReferrals === false">
					 <a href="javascript: void(0)" @click="goHome"><img src="./image/logo.png" class="logo"></a>
				</div>
				<div class="main" v-if="showReferrals === false">
					<div class="total-gifts">
						<div class="parallelograms left">
							<div class="parallelogram up"></div>
							<div class="parallelogram down"></div>
			  			</div>
						<span class="banner"><span style="margin-left:-25px;">YOU GOT A TOTAL OF</span><br>{{currency}} <span class="gift-amount">{{totalGiftAmount}}</span> IN DISCOUNT GIFTS</span>
						<div class="parallelograms right">
							<div class="parallelogram down"></div>
							<div class="parallelogram up"></div>
			  			</div>
					</div>
					<div class="btn" @click="viewMore">View More</div>

					<div class="tabs" v-if="status!==40">
						<p class="title">FOLLOW THE STEPS BELOW<br>TO GET YOUR GIFTS</p>
						<div style="display: inline-block">
							<div class="options">
								<div class="option" :class="[option1? 'active':'']" @click="toOption1">OPTION 1</div>
								<div class="option" :class="[option2? 'active':'']" @click="toOption2">OPTION 2</div>
							</div>
						</div>
						<div class="contentA" v-if="option2">
							<p class="topic">ONLINE SHARING</p>
							<p class="detail"><strong class="num">1.</strong>Kindly tell your friend this Referral Code  below:</p>
							<div class="code">{{referralCode}}</div>
							<p class="detail"><strong class="num">2.</strong>Help them go through the registration process with either of the following options:</p>
							<p class="detail" style="margin-top:25px;margin-bottom:25px">Let your friend register using our PC/Mobile/App versions of SportyBet, and fill in the "Referral Code" field with your code. (Please, remind your friend to click"Apply")</p>
							<div class="example1"></div>
							<!-- <p class="detail" style="margin-top:32px;margin-bottom:34px ">B. Tell your friends to send an SMS with your Referral Code {{referralCode}} to 654.</p>
							<div class="example2"></div> -->
							<p class="detail" style="margin-top:58px;padding-bottom:35px "><strong class="num">3.</strong>After your friend made Settled Stakes in a Total value of {{currency}} 300 or above, SportyBet will credit your account. Gifts can be viewed by going to <a @click.prevent="jmpGifts" style="text-decoration: underline;color: #2d6ee3;">"Gifts".</a></p>
						</div>
						<div class="contentB" v-if="option1">
							<p class="topic">SHARE A REFERRAL CODE</p>
							<p class="detail"><strong class="num">1.</strong>Click on SHARE to share a link which includes your Referral Code.</p>
							<div class="share" @click="popUp">SHARE</div>
							<p class="copy detail">
								If you choose to share your Referral Code
								using the "SMS“ option but it doesn't copy
								any information, please select the option
								"Copy Link" and share your Referral Code
								link with your friends.
							</p>
							<!-- <a :href="`whatsapp://send?text=${encodeInvitation}`" data-action="share/whatsapp/share">
								<div class="whatsapp">
									<p>SHARE</p>
									<p>REFER FRIENDS VIA</p>
									<P>WHATSAPP</P>
								</div>
							</a> -->
							<p class="detail" style="padding-bottom:31px"><strong class="num">2.</strong>After your friend made Settled Stakes in a Total value of {{currency}} 300 or above, SportyBet will credit your account. Gifts can be viewed by going to <a @click.prevent="jmpGifts" style="text-decoration: underline;color: #2d6ee3;">"Gifts".</a></p>
						</div>
					</div>
					<div class="invalid-wrapper" v-if="status===40">
						<div class="invalid"></div>
						<span class="attention">!</span>
						<span class="invalid-content">
							This promotion is currently suspended, your
							Referral Code is no longer valid. However, it
							is still possible for you to receive Gifts
							from your previous Referred Friends.
						</span>
					</div>
					<div class="promotion-details">
						<div class="title">Terms and Conditions:</div>
						<div class="detail" v-for="(item, index) in details" :key="index">
							<p>{{item}}</p>
							<p class='requirements' v-if="index===0" v-for="(item,i) in requirements" :key="i"><strong>{{item.index}}</strong> {{item.con}}</p>
						</div>
					</div>
				</div>
				<Referral v-if="showReferrals"/>
			</div>
		</div>
	</Layout>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { appPath } from 'config/appPagePath';
import cookie from 'packages/lib/utils/cookie.js';
import Layout from 'components/layout/main.vue';
import Referral from './referral.vue';
import sharePop from './sharePop.vue';

let popDialog = null;
export default {
	data () {
		return {
			details: [],
			requirements: [],
			option1: true,
			option2: false,
			showReferrals: false,
			currency: window.currency || 'NGN',
			invitation: '',
			encodeInvitation: '',
			referralCode: 'R' + cookie.get('phone'),
			activityId: '',
			totalGiftAmount: 0,
			status: 30,
			gift: userCenterUrl.gift,
			home: pagePath.home,
			protocol: location.protocol,
		};
	},
	components: {
		Layout,
		Referral,
		sharePop
	},
	created () {
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
		this.invitation = `Hi! Have you heard of SportyBet?! It's a whole new concept at Betting! Follow me and give it a try! UP to ${this.currency} 10000 Discount gifts on first deposit! Check ${this.protocol}//www.sportybet.com/ng/?referralCode=${this.referralCode}`;
		this.encodeInvitation = encodeURI(this.invitation);
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
			this.getQualifyStatus();
			// this.getTotalParticipantsNum();
		}
	},
	methods: {
		jmpGifts() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.gifts);
			}
			location.href = this.gift;
		},
		popUp () {
			popDialog = this.$dialog({
				title: null,
				content: sharePop,
				button: []
			}).onBtnClick(btnType => {
				popDialog.close();
				popDialog = null;
			});
		},
		getQualifyStatus () {
			return fetch('/marketing/v1/activities/getByKind', {
				method: 'GET',
				body: {
					kind: 5
				}
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
		},
		toOption1 () {
			this.option1 = true;
			this.option2 = false;
		},
		toOption2 () {
			this.option2 = true;
			this.option1 = false;
		},
		viewMore () {
			if (window.loginStatus === true) {
				this.showReferrals = true;
			} else {
				location.href = pagePath.login;
			}
		},
		handleBack () {
			this.showReferrals = false;
		},
		goHome() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.home);
			}
			location.href = this.home;
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.invalid-wrapper {
  position: relative;
  margin-top: 30/@rem;
  margin-bottom: -30/@rem;
}
.invalid {
  height: 105/@rem;
  opacity: 0.1;
  border-radius: 2/@rem;
  background-color: #fafd00;
}
.attention {
  display: inline-block;
  width: 12/@rem;
  height: 12/@rem;
  line-height: 12/@rem;
  border-radius: 6/@rem;
  position: absolute;
  left: 7/@rem;
  top: 16/@rem;
  font-size: 12/@rem;
  text-align: center;
  background: #f9c12f;
  color: #fff;
}
.invalid-content {
  padding-right: 27/@rem;
  display: inline-block;
  position: absolute;
  left: 25/@rem;
  top: 14/@rem;
  font-size: 11.2/@rem;
  line-height: 1.44;
  letter-spacing: 0.6/@rem;
  text-align: left;
}
.m-page-loading-wrap,
.m-top-wrapper {
  display: none;
}
.top {
  width: 100%;
  height: 220/@rem;
  background: url(./image/background.jpg) no-repeat;
  background-size: 100% 100%;
}
.logo {
  width: 103/@rem;
  height: 20/@rem;
  margin-left: 19/@rem;
  margin-top: 12/@rem;
}
.banner1 {
  width: 171/@rem;
  height: 105/@rem;
  margin-left: 141/@rem;
}
.banner2 {
  width: 300/@rem;
  height: 65/@rem;
  margin-left: 10/@rem;
}
.main {
  padding: 0 18/@rem;
  overflow: hidden;
  color: #343a45;
  text-align: center;
}
.total-gifts {
  margin-top: 20/@rem;
}
.parallelograms {
  display: inline-block;
}
.parallelogram {
  background: #e21e2f;
  width: 35/@rem;
  height: 23/@rem;
}
.up {
  transform: skewX(-20deg);
}
.down {
  transform: skewX(20deg);
}
.left {
  float: left;
}
.right {
  float: right;
  position: relative;
  top: -20/@rem;
}
.banner {
  font-size: 12/@rem;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: 0.6/@rem;
}
.gift-amount{
	font-size: 21/@rem;
}
.btn {
  width: 183/@rem;
  height: 46/@rem;
  display: inline-block;
  margin-top: 19/@rem;
  border-radius: 23/@rem;
  background-image: linear-gradient(to right, #c10314, #e21e2f 51%, #ff3829);
  color: #fff;
  font-size: 17/@rem;
  font-weight: bold;
  line-height: 46/@rem;
  text-align: center;
}
.btn {
  cursor: pointer;
}
.title {
  margin-top: 52/@rem;
  margin-bottom: 23/@rem;
  font-size: 17/@rem;
  font-weight: 900;
  line-height: 1.3;
}
.tabs {
  display: inline-block;
}
.options {
  width: 255/@rem;
  display: flex;
  border-bottom: 1/@rem solid #c5c5c5;
}
.option {
  flex: 1;
  padding-bottom: 12/@rem;
  font-size: 14/@rem;
  font-weight: 900;
  line-height: 1.39;
}
.active {
  width: 105/@rem;
  border-bottom: 5/@rem solid #e01d32;
}
.contentA,
.contentB {
  background: #f4f4f4;
}
.topic {
  padding-top: 35/@rem;
  margin-top: 18/@rem;
  margin-bottom: 15/@rem;
  font-size: 14/@rem;
  font-weight: 900;
  line-height: 1.14;
}
.detail {
  padding: 0 12/@rem;
  font-size: 13/@rem;
  line-height: 1.24;
  text-align: left;
}
.code {
  display: inline-block;
  width: 171/@rem;
  height: 41/@rem;
  margin-top: 32/@rem;
  margin-bottom: 40/@rem;
  line-height: 41/@rem;
  border-radius: 4/@rem;
  background-color: #fff;
  font-size: 16/@rem;
}
.example1 {
  display: inline-block;
  width: 192/@rem;
  height: 156/@rem;
  background: url(./image/example1.png);
  background-size: 100% 100%;
}
.example2 {
  display: inline-block;
  width: 170/@rem;
  height: 170/@rem;
  background: url(./image/example2.png);
  background-size: 100% 100%;
}
.copy {
  margin-bottom: 26/@rem;
  font-size: 13px;
  line-height: 1.24;
  text-align: left;
  color: #929497;
}
.share {
  width: 137/@rem;
  height: 35/@rem;
  margin: 20/@rem auto 21/@rem auto;
  line-height: 35/@rem;
  border-radius: 17.5/@rem;
  background-image: linear-gradient(to right, #16b219, #1ace1d);
  color: #fff;
  text-align: center;
  font-size: 12/@rem;
  font-weight: 900;
}
.whatsapp {
  width: 177/@rem;
  height: 42/@rem;
  margin-bottom: 48/@rem;
  border-radius: 4/@rem;
  background-color: #e21e2f;
  display: inline-block;
  text-align: center;
  & p {
    font-size: 14/@rem;
    font-weight: 900;
    line-height: 0.88;
    color: #fff;
  }
  p:first-child {
    font-size: 12/@rem;
    line-height: 1.28;
    padding-top: 5/@rem;
    padding-bottom: 5/@rem;
  }
}
.promotion-details {
  margin-bottom: 35/@rem;
  & .title {
    font-size: 17/@rem;
    font-weight: 900;
    line-height: 1.3;
  }
  & .detail {
    margin-bottom: 15/@rem;
    & .requirements {
      margin-top: 10/@rem;
      margin-left: 10/@rem;
    }
  }
}
</style>
