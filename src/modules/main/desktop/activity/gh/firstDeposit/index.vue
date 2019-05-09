<template>
	<div>
		<div class="top">
			<div class="top-wrapper">
				<div class="gift-banner">
					<div class="logo">
						<a href="/"><img :src="require('./image/logo.png')" alt=""></a>
					</div>
					<af-button class="btn-deposit btn-deposit-top" extraType="" @click="depositNowHandler()">{{depositBtnText}}</af-button>
					<div class="custom-broadcast" v-if="totalParticipantsNum">
						{{totalParticipantsNum}} customers have deposited!
					</div>
				</div>
			</div>
		</div>
		<div class="main-info">
			<img class="info-image" src="./image/info.svg" />
			<div class="info-content"><span class="info-arrow"></span>A Discount Gift can be used in the Betslip when placing a bet. Discount Gifts have different minimum required amounts to be used. Go to the "Gifts" area, under "My Account" to check all your available Gifts.</div>
		</div>
		<div class="main-body">
			<div class="gifts-info">
				Gifts Information
			</div>
			<div class="gifts-info-table">
				<ul class="gifts-info-table-row gifts-info-table-header">
					<li class="gift-info-cell gift-info-cell-first" key="0"></li>
					<li class="gift-info-cell" v-for="(item,i) in headerData" :key="i">{{item}}</li>
				</ul>
				<ul class="gifts-info-table-row gifts-info-table-deposit">
					<li class="gift-info-cell gift-info-cell-title" key="0">First Deposit <br/>Value</li>
					<li class="gift-info-cell" v-for="(item,i) in depositData" :key="i">{{item}}</li>
				</ul>
				<ul class="gifts-info-table-row gifts-info-table-discount">
					<li class="gift-info-cell gift-info-title" key="0">Discount Gifts Value</li>
					<li class="gift-info-cell" v-for="(item,i) in discountData" :key="i">
						<Gift :currency="currency" :price="item"></Gift>
					</li>
				</ul>
				<div class="gifts-info-day-wrap">
						<ul class="gifts-info-day-line gifts-info-table-row " v-for="(items, index) in planData" :key="index">
							<li :class="['gift-info-cell', item ? '' : 'gift-info-cell-empty']" v-for="(item, idx) in items" :key="`${index}-${idx}`">
								{{item}}
							</li>
						</ul>
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
				<a download :href="download"></a>
			</div>
		</div>
	</div>
</template>
<script>
import 'packages/button';
import dialog from 'components/dialog';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';
import { userCenterConfig } from 'config/order/userCenterConfig';
import terms from 'activity/gh/first-deposit/terms';
import howtoConfig from 'activity/gh/first-deposit/howto';

import Gift from './gift';

export default {
	components: {
		Gift
	},
	data () {
		return {
			activityId: 0,
			isQualified: false,
			checkGiftsStatus: false,
			depositBtnText: 'DEPOSIT NOW',
			totalParticipantsNum: '',
			activityStatus: 0,
			termsAndConds: terms,
			howto: howtoConfig,
			headerData: ['Plan A', 'PlanB', 'PlanC', 'PlanD', 'PlanE'],
			depositData: ['GHS 1', 'GHS 5', 'GHS 10', 'GHS 50', 'GHS 100'],
			discountData: ['1', '5', '11', '60', '150'],
			planData: [
				['1st Day', '1 x GHS 0.2', '2 x GHS 0.2', '2 x GHS 0.2', '2 x GHS 1', '2 x GHS 3'],
				['2nd Day', '1 x GHS 0.2', '2 x GHS 0.5', '2 x GHS 1', '2 x GHS 5', '2 x GHS 10'],
				['4th Day', '1 x GHS 0.2', '2 x GHS 0.4', '2 x GHS 0.5', '2 x GHS 5', '2 x GHS 12'],
				['6th Day', '1 x GHS 0.1', '2 x GHS 0.8', '2 x GHS 1.8', '2 x GHS 5', '2 x GHS 20'],
				['7th Day', '1 x GHS 0.3', '2 x GHS 0.6', '2 x GHS 2', '2 x GHS 8', '2 x GHS 10'],
				['9th Day', '', 		  '', 		 	 '', 			'2 x GHS 6', '2 x GHS 20'],
			],
			currency: window.currency || 'GHS',
			download: pagePath.download
		};
	},
	created () {
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
			this.getQualifyStatus().then(() => { });
			this.getTotalParticipantsNum();
		}
	},
	methods: {
		depositNowHandler (event) {
			if (this.activityStatus === 90) {
				this.openDialog(
					'Notice',
					'This promotion is over, remember to come earlier next time!'
				);
				return;
			}
			if (window.loginStatus) {
				this.getQualifyStatus().then(() => {
					if (!this.isQualified) {
						window.location.href = userCenterConfig.Deposit;
					} else if (this.isQualified && this.checkGiftsStatus) {
						window.location.href = userCenterConfig.Gifts;
					}
				});
			} else {
				window.login();
				EventBus.$once(commonEvent.UPDATE_LOGIN_STATUS, () => {
					this.getQualifyStatus().then(() => { });
				});
			}
		},
		openDialog (titleText, contentText) {
			dialog({
				title: `<div class="dialog-title">${titleText}</div>`,
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
			fetch(`/promotion/v1/activities/${this.activityId}/broadcast`, {
				method: 'GET'
			})
				.then(res => res.json())
				.then(ret => {
					if (ret.bizCode === 10000) {
						this.totalParticipantsNum = ret.data.totalParticipantsNum;
					}
				});
		}
	}
};
</script>
<style lang="less">
@import "~base/style/variable.less";

body {
  font-family: AvenirNext, Arial, sans-serif;
}
.top {
  width: 100%;
  height: 585px;
}
.btn-deposit {
  width: 232px;
  height: 62px;
  border-radius: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: @white;
  border: none;
}
.top-wrapper {
  height: 519px;
  background: url(./image/top_bg.jpg);
  background-size: 100% 519px;
}
.gift-banner {
  margin: 0 auto;
  max-width: 1120px;
  height: 585px;
  background: url(./image/sportsman@2x.png);
  background-size: 100% 585px;
  position: relative;
  .btn-deposit-top {
    .btn-deposit;
    position: absolute;
    top: 314px;
    left: 114px;
    background-color: #a6ff04;
    color: #852042;
  }
  .custom-broadcast {
    position: absolute;
    top: 391px;
    left: 115px;
    font-size: 18px;
    font-weight: bold;
    color: white;
  }
}
.logo {
  img {
    margin-left: 56px;
    width: 207px;
    height: 72px;
  }
}
.main-info{
	display: flex;
	width: 950px;
	margin: -30px  auto 40px;
	font-size: 13px;
	.info-image{
		width: 32px;
		height: 32px;
		margin-top: 10px;
	}
	.info-content{
		position: relative;
		width: 640px;
		padding: 10px 15px;
		margin-left: 20px;
		border-radius: 4px;
		color: #eaac05;
		background-color: #fef3c0;
		.info-arrow{
			position: absolute;
			width: 20px;
			height: 20px;
			background-color: #fef3c0;
			left: -10px;
			transform: rotate(45deg);
		}
	}
}
.main-body {
  width: 950px;
  margin: 0 auto;
}
.gifts-info-table-row{
	display: flex;
	justify-content: space-between;
	.gift-info-cell{
		flex-basis: 132px;
		width: 132px;
		box-sizing: border-box;
	}
}

.gifts-info-table-header{
	color: #FFF;
	font-size: 14px;
	text-align: center;
	.gift-info-cell{
		background-color: #353a45;
	}
	.gift-info-cell-first{
		background-color: #FFF;
		text-align: left;
	}
}
.gifts-info-table-deposit{
	margin-bottom: 10px;
	.gift-info-cell{
		line-height: 45px;
		height: 45px;
		padding-left: 11px;
		background-color: #f8f8f8;
	}
	.gift-info-cell-title{
		box-sizing: border-box;
		background-color: #FFF;
		text-align: left;
		margin: 7px 0;
		height: 30px;
		line-height: 15px;
		padding-left: 5px;
		font-weight: bold;
		font-size: 14px;
		border-left: 5px solid #e8e8e8;
		color: #353a45;
	}
}
.gifts-info-table-discount{
	.gift-info-title{
		margin: 14px 0;
		line-height: 16px;
		padding-left: 5px;
		font-weight: bold;
		font-size: 14px;
		border-left: 5px solid #eaac05;
		color: #eaac05;
	}
}
.gifts-info-day-line{
	margin: 5px 0;
	.gift-info-cell{
		background-color: #fffbe8;
		height: 24px;
		line-height: 24px;
		padding-left: 8px;
	}
	.gift-info-cell-empty{
		background-color: #f8f8f8;
	}
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
.gifts-info {
  width: 950px;
  height: 66px;
  margin-bottom: 29px;
  font-size: 48px;
  font-weight: bold;
  color: #ff2748;
  text-align: center;
  flex-grow: 1;
}
.line {
  border-bottom: solid 2px #979797;
}
.deposit-day-col {
  display: flex;
  flex-grow: 1;
  width: 286px;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  font-weight: 500;
  color: #353a45;
  .line;
}
.terms-conds {
  width: 950px;
  margin-top: 50px;
  font-size: 14px;
  line-height: normal;
  font-weight: 500;
  color: #353a45;
}
.btn-wrapper {
  width: 700px;
  margin: 60px auto 0 ;
  & > button {
    .btn-deposit;
    margin:0 0 49px 237px;
    background: @red;
    color: @white;
    border: none;

    &:hover {
      background: @hRed !important;
      color: @white !important;
    }

    &:active {
      background: @aRed !important;
      color: @white !important;
    }
  }
}
.download-app {
  position: relative;
  width: 700px;
  margin: 0 auto 41px;
  height: 130px;
  background: url(./image/download_app.jpg);
  background-size: 100% 130px;
  & > a {
    position: absolute;
    top: 52px;
    left: 450px;
    width: 225px;
    height: 55px;
  }
}
.es-dialog {
  .es-dialog-head {
    padding: 16px 24px 7px;
    color: #353a45;
    height: 24px;
    h1 {
      line-height: 1;
      height: 24px;
      padding: 0;
      .dialog-title {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .es-dialog-close {
      cursor: pointer;
      right: 12px;
      text-decoration: none;
    }
  }
  .es-dialog-body {
    .es-dialog-main {
      padding: 18px 24px 0;
      .dialog-content {
        width: 464px;
        height: 103px;
        font-size: 15px;
      }
    }
  }
  .es-dialog-footer {
    padding: 0 20px 15px;
    .es-dialog-btn {
      cursor: pointer;
      width: 85px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      font-weight: bold;
      border: 0;
      border-radius: 2px;
      outline: 0;
      margin: 0 0 0 387px;

      background: @green;
      color: @white;

      &:hover {
        background: @midGreen;
      }

      &:active {
        background: @lightGreen;
      }
    }
  }
}
</style>
