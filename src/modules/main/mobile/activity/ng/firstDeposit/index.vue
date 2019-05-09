<template>
	<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
			<div>
				<div class="top">
					<div class="top-wrapper">
						<div class="gift-banner">
							<div class="logo">
								<a href="/"><img :src="require('./image/logo.png')" alt=""></a>
							</div>
							<div class="sportsman-wrapper"></div>
							<af-button class="btn-deposit btn-deposit-top" extraType="" @click="depositNowHandler()">{{depositBtnText}}</af-button>
							<div class="custom-broadcast" v-if="totalParticipantsNum">
								<span>{{totalParticipantsNum}}</span> customers have deposited!
							</div>
							<Entrance />
						</div>
					</div>
				</div>
				<div class="main-info">
					<div class="info-content"><span class="info-arrow"></span>A Discount Gift can be used in the Betslip when placing a bet. Discount Gifts have different minimum required amounts to be used. Go to the "Gifts" area, under "My Account" to check all your available Gifts.</div>
					<div class="info-image">?</div>
				</div>
				<div class="main-body">
					<div class="gifts-info">
						Gifts Information
					</div>
					<div class="plans">
						<div class="plan-item"  v-for="content in contents" :key="content.plan">
							<div class="plan"><span>Plan {{content.plan}}</span></div>
							<div class="without-plan">
								<div class="money seperate">
									<span>DEPOSIT: </span>
									<span class="text">{{currency}} {{content.money}}</span>
								</div>
								<div class="gold seperate">
									<span>TO CLAIM GIFTS:</span>
									<span class="text green">{{currency}} {{content.gold}}</span>
								</div>
								<div class="amount seperate">
									<span>GIFTS AMOUNT:</span>
									<span class="text">{{content.amount}}</span>
								</div>
								<div class="line"></div>
								<div class="cell-wrap" v-if="expandStatus[content.plan]">
									<div class="cell" v-for="(detail, index) in content.details" :key="index">
										<div class="detail-day">{{detail[0]}}</div>
										<div v-if="Array.isArray(detail[1])" class="detail-item-wrap">
											<div v-for="item in detail[1]" class="detail-item" :key="item"><i class="icon"></i><span>{{item}}</span></div>
										</div>
										<div v-else class="detail-item"><i class="icon"></i><span>{{detail[1]}}</span></div>
									</div>
								</div>
								<div class="cell-expand" v-else @click="onExpand" :data-plan="content.plan">See All<i class="cell-down"></i></div>
							</div>
						</div>
					</div>
					<div class="terms-conds" >
						<div class="terms-conds-title">How To</div>
						<div v-for="(item,i) in howto" :key="i" :class="[i==3? 'terms-conds-item-gray':'', 'terms-conds-item']">{{ item }}</div>
					</div>
					<div class="terms-conds" style="font-weight: 500;">
						<div class="terms-conds-title">Terms and Conditions:</div>
						<div v-for="(item,i) in termsAndConds" :key="i" class="terms-conds-item">{{ item }}</div>
					</div>
					<div class="btn-wrapper">
						<af-button extraType="" @click="depositNowHandler()">{{depositBtnText}}</af-button>
					</div>
					<div class="download-app">
						<a :href="downloadApp"></a>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>

<script>
import dialog from 'components/dialog';
import 'packages/button';
import appCore from 'appCore';
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';

import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { appPath } from 'config/appPagePath';
import terms from 'activity/ng/first-deposit/terms';
import howtoConfig from 'activity/ng/first-deposit/howto';
import Entrance from 'components/firstDeposit/entrance';

export default {
	components: {
		Layout,
		Entrance,
	},
	data () {
		return {
			activityId: 0,
			activityStatus: 0,
			totalParticipantsNum: '',
			isQualified: false,
			checkGiftsStatus: false,
			depositBtnText: 'DEPOSIT NOW',
			downloadApp: pagePath.downloadApp,
			currency: window.currency || 'NGN',
			termsAndConds: terms,
			howto: howtoConfig,
			expandStatus: {}
		};
	},
	created () {
		this.pageLoading(false);
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
			this.getQualifyStatus().then(() => { });
			this.getTotalParticipantsNum();
		}
		// 如果在app内
		if (appCore.getAppName() === 'sportybet') {
			appCore.sportybet.ready(AFJsApi => {
				if (!AFJsApi) {
					return;
				}
				AFJsApi.ui.setOptionMenu({
					title: 'Share',
					resId: 'ic_share_white_24dp'
				});
			});
			document.addEventListener(
				'optionMenu',
				() => {
					// 右上角按钮被点击时会回调 optionMenu 事件
					appCore.share({
						title: 'share',
						url: window.location.href
					});
					appCore.shareNow();
				},
				false
			);
		}

		this.contents = [{
			plan: 'A',
			money: 100,
			gold: 100,
			amount: 4,
			details: [
					['1st Day', `1x ${this.currency} 10`],
					['2nd Day', `1x ${this.currency} 10`],
					['4th Day', `1x ${this.currency} 30`],
					['6th Day', `1x ${this.currency} 50`],
			],
			day: 6
		},
		{
			plan: 'B',
			money: 300,
			gold: 300,
			amount: 6,
			details: [
					['1st Day', `2x ${this.currency} 50`],
					['2nd Day', `2x ${this.currency} 50`],
					['4th Day', `1x ${this.currency} 50`],
					['6th Day', `1x ${this.currency} 50`],
			],
			day: 6
		},
		{
			plan: 'C',
			money: 500,
			gold: 500,
			amount: 8,
			details: [
					['1st Day', `2x ${this.currency} 50`],
					['2nd Day', `2x ${this.currency} 50`],
					['4th Day', `2x ${this.currency} 50`],
					['6th Day', `1x ${this.currency} 100`],
					['7th Day', `1x ${this.currency} 100`],
			],
			day: 7
		},
		{
			plan: 'D',
			money: 1000,
			gold: 1000,
			amount: 10,
			details: [
					['1st Day', `2x ${this.currency} 50`],
					['2nd Day', `2x ${this.currency} 50`],
					['4th Day', `2x ${this.currency} 100`],
					['6th Day', `2x ${this.currency} 100`],
					['7th Day', `2x ${this.currency} 200`],
			],
			day: 9
		},
		{
			plan: 'E',
			money: 5000,
			gold: 5000,
			amount: 11,
			details: [
					['1st Day', `2x ${this.currency} 150`],
					['2nd Day', `2x ${this.currency} 300`],
					['4th Day', `2x ${this.currency} 300`],
					['6th Day', `2x ${this.currency} 400`],
					['7th Day', `2x ${this.currency} 600`],
					['9th Day', `1x ${this.currency} 1,500`],
			],
			day: 10
		}, {
			plan: 'F',
			money: 10000,
			gold: 10000,
			amount: 12,
			details: [
					['1st Day', `2x ${this.currency} 150`],
					['2nd Day', `2x ${this.currency} 350`],
					['4th Day', `2x ${this.currency} 500`],
					['6th Day', `2x ${this.currency} 1,000`],
					['7th Day', `2x ${this.currency} 1,000`],
					['9th Day', `2x ${this.currency} 2,000`],
			],
			day: 10
		}
		];
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		depositNowHandler () {
			if (this.activityStatus === 90) {
				this.openDialog(
					'Notice',
					'This promotion is over, remember to come earlier next time!'
				);
				return;
			}
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.deposit);
			}
			if (window.loginStatus) {
				this.getQualifyStatus().then(() => {
					if (!this.isQualified) {
						window.location.href = userCenterUrl.deposit;
					} else if (this.isQualified && this.checkGiftsStatus) {
						window.location.href = userCenterUrl.gift;
					}
				});
			} else {
				const okUrl = window.location.href;
				window.location.href = `${pagePath.login}?okUrl=${encodeURIComponent(okUrl)}`;
			}
		},
		openDialog (titleText, contentText) {
			dialog({
				title: `<div>${titleText}</div>`,
				content: {
					template: '<div class="dialog-content">' + contentText + '</div>'
				},
				layout: true,
				button: ['OK']
			});
		},
		getQualifyStatus () {
			return fetch(`/marketing/v1/activities/${this.activityId}`, {
				method: 'GET'
			})
				.then(res => res.json())
				.then(ret => {
					if (ret.bizCode === 10000) {
						// isQualified = 0表示不具备首充资格，可以去查看礼物；1是具备首充资格，this.isQualified为是否具备查看礼物资格，正相反
						this.isQualified = !ret.data.isQualified;
						this.totalParticipantsNum = ret.data.participantsNum;
						this.activityStatus = ret.data.status;
						if (this.isQualified && window.loginStatus) {
							this.checkGiftsStatus = true;
							this.depositBtnText = 'View Your Gifts';
						} else {
							this.checkGiftsStatus = false;
							this.depositBtnText = 'DEPOSIT NOW';
						}
					}
				});
		},
		getTotalParticipantsNum () {
			fetch(`/promotion/v1/activities/${this.activityId}/broadcast`)
				.then(res => res.json())
				.then(ret => {
					if (ret.bizCode === 10000) {
						this.totalParticipantsNum = ret.data.totalParticipantsNum;
					}
				});
		},
		onExpand(evt) {
			const target = evt.currentTarget;
			const plan = target.dataset.plan;
			this.$set(this.expandStatus, plan, true);
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
@import 'base/styles/icon.less';
.m-page-loading-wrap {
  display: none;
}
.m-top-wrapper {
  display: none;
}
body {
  font-family: Arial, sans-serif;
}
.top {
  width: 100%;
//   height: 490/@rem;
}
.btn-deposit {
  width: 230/@rem;
  height: 48/@rem;
  border-radius: 0;
  font-size: 20/@rem;
  font-weight: bold;
  text-align: center;
  color: white;
}

.top-wrapper {
  padding-bottom: 10/@rem;
  background: url(./image/top_bg@2x.jpg) no-repeat;
  background-size: 100% 600/@rem;
  position: relative;
  .logo {
    position: absolute;
    left: 12/@rem;
	top: 0;
	z-index: 10;
    img {
      width: 120/@rem;
      height: 42/@rem;
    }
  }
  .btn-deposit-top {
    .btn-deposit;
    position: relative;
    top: -14/@rem;
    left: 5%;
    // margin-top: 10/@rem;
    // margin-right: 2/@rem;
    font-size: 20/@rem;
    background-color: #a6ff04;
    color: #852042;
  }
  .custom-broadcast {
    margin-left: 16/@rem;
    font-size: 16/@rem;
    font-weight: bold;
    color: white;
    & > span {
      font-size: 20/@rem;
    }
  }
}
.sportsman-wrapper {
  margin: 0 auto;
  padding-top: 115%;
  background: url(./image/sportsman.png) no-repeat;
  background-size: cover;
  position: relative;
  top: 12/@rem;
}
.main-info{
	display: flex;
	margin: 24/@rem;
	font-size: 10/@rem;
	.info-image{
		flex-shrink: 0;
		flex-basis: 32/@rem;
		width: 32/@rem;
		height: 32/@rem;
		font-size: 24/@rem;
		color: #eaac05;
		background-color: #fef3c0;
		border-radius: 50%;
		font-weight: bold;
		text-align: center;
		line-height: 32/@rem;
		margin-top: 10/@rem;
	}
	.info-content{
		position: relative;
		padding: 5/@rem 10/@rem;
		margin-right: 20/@rem;
		border-radius: 4/@rem;
		color: #eaac05;
		background-color: #fef3c0;
		.info-arrow{
			position: absolute;
			right: -8/@rem;
			top: 14/@rem;
			width: 20/@rem;
			height: 20/@rem;
			background-color: #fef3c0;
			transform: rotate(45deg);
		}
	}
}
.main-body {
  width: 300/@rem;
  margin: 0 auto;
}
.plans {
  padding: 0 13/@rem;
  .plan-item {
    .plan {
      width: 100/@rem;
      height: 24/@rem;
      line-height: 24/@rem;
      border-top-left-radius: 4/@rem;
      background-color: #353a45;
      color: #fff;
      span {
        padding-left: 17/@rem;
        font-size: 14/@rem;
        font-weight: bold;
      }
    }
    .plan:after {
      content: " ";
      display: inline-block;
      border-right: 23/@rem solid #fff;
      border-bottom: 23/@rem solid transparent;
      background: #353a45;
      margin-left: 100/@rem;
      position: relative;
      top: -24/@rem;
	}
	.cell{
		display: flex;
		margin: 0 13/@rem;
		padding: 5/@rem 0;
		align-items: center;
		border-bottom: 1px solid #f8f8f8;
		.detail-day{
			padding-left: 15/@rem;
			flex-basis: 60/@rem;
			width: 60/@rem;
			color: #353a45;
		}
		.detail-item{
			flex: 1;
		}
	}
	.cell-expand{
		height: 34/@rem;
		line-height: 34/@rem;
		color: #0d9737;
		font-size: 13/@rem;
		text-align: center;
		.cell-down{
			padding-left: 5/@rem;
			.m-icon-arrow--down();
			font-size: 8/@rem;
		}
	}
    .without-plan {
      border-radius: 4/@rem;
      box-shadow: 0 2/@rem 4/@rem 0 rgba(0, 0, 0, 0.06);
      background-color: #ffffff;
      background-color: var(--white);
      border: solid 0.8/@rem #e4e4e4;
      margin-bottom: 36/@rem;
      .seperate {
        display: flex;
        justify-content: space-between;
        margin-top: 16/@rem;
        margin-bottom: -6/@rem;
        padding: 0 17/@rem;
        font-size: 14/@rem;
        .text {
          font-weight: bold;
        }
        .green {
          font-size: 18/@rem;
          color: #1b963c;
        }
      }
      .line {
        border-bottom: 1px solid #e1e1e1;
		transform: scaleX(0.9);
		margin-top: 14/@rem;
		// margin-bottom: 5/@rem;
	  }
	  .detail-item {
		  .icon {
			  margin-left: 31/@rem;
			  margin-right: 19/@rem;
			  .m-icon-live-tracker();
				&::before{
					color: #62f08d;
				}
		  }
	  }
	  .day {
		  padding: 15/@rem 30/@rem 19/@rem;
		  .gray {
			  color: #acacac;
		  }
	  }
    }
  }
}

.gifts-item {
	width: 274/@rem;
	margin: 0 auto;
	padding: 5/@rem 0;
	color: #353a45;
	border-top: solid 2px #979797;
	.gifts-item-term {
		margin: 2/@rem 0;
		font-weight: bold;
	}
	.gifts-item-gift{
		color: #ff2748;
		display: inline-block;
		font-weight: bold;
		font-size: 12/@rem;
	}
}
.gifts-info {
  width: 300/@rem;
  height: 33/@rem;
  margin: 24/@rem 0 11/@rem;
  font-size: 24/@rem;
  font-weight: bold;
  color: #ff2748;
  text-align: center;
  flex-grow: 1;
}
.terms-conds {
  margin: 0 auto;
  padding-top: 20/@rem;
  width: 274/@rem;
  font-size: 12/@rem;
  line-height: normal;
  color: #353a45;
}
.terms-conds-title{
	font-weight: bold;
	font-size: 16px;
	padding-bottom: 5px;
}
.terms-conds-item{
	line-height: 1.5;
}
.terms-conds-item-gray{
	color: gray;
}
.btn-wrapper {
  width: 300/@rem;
  text-align: center;
  & > button {
    .btn-deposit;
    margin: 28/@rem 0 52/@rem 0;
    background-color: #ff2748;
  }
}
.download-app {
  position: relative;
  margin: 0 auto;
  width: 300/@rem;
  height: 66/@rem;
  background: url(./image/download_app@2x.jpg);
  background-size: 100% 66/@rem;
  margin-bottom: 11/@rem;
  & > a {
    position: absolute;
    top: 23/@rem;
    right: 7/@rem;
    width: 118/@rem;
    height: 36/@rem;
  }
}
.es-dialog {
  border-radius: 0;
  width: 248/@rem !important;
  padding-top: 0;
  .es-dialog-head {
    padding: 16.2/@rem 21.3/@rem 6.6/@rem;
    h1 {
      text-align: left;
      height: 28/@rem;
      font-size: 18/@rem;
      font-weight: bold;
      color: #282c35;
    }
  }
  .es-dialog-body .es-dialog-main {
    padding: 0 21.3/@rem 5.5/@rem;
    width: 205/@rem;
    .dialog-content {
      width: 205/@rem;
      font-size: 14/@rem;
      line-height: 1.71;
    }
  }
  .es-dialog-footer {
    background-color: white;
    display: block;
    text-align: center;
    .es-dialog-btn {
      display: inline;
      color: #16892a;
      font-size: 14/@rem;
      font-weight: bold;
      background-color: white;
      border: 0;
      outline: 0;
      span {
        margin-left: 175/@rem;
      }
      &:hover {
        color: #20a0ff;
        border-color: #20a0ff;
      }
    }
  }
}
</style>
