<template>
	<div>
		<div class="top">
			<div class="top-wrapper">
				<div class="gift-banner">
					<div class="logo">
						<a href="/"><img :src="require('./image/logo.png')" alt=""></a>
					</div>
					<af-button class="btn-deposit btn-deposit-top" extraType="" @click="depositNowHandler()">{{depositBtnText}}</af-button>
					<div class="custom-broadcast">
						{{totalParticipantsNum}} customers have deposited!
					</div>
				</div>
			</div>
		</div>
		<div class="main-body">
			<div class="gifts-info"> Gifts Information</div>
			<div class="tables">
				<div class="lefts">
					<div class="left" v-for="(exp,i) in exps" :key="i" :class="{'first':i===0,'gold-bar':i===1, 'third': i===2}">
						<div class="text">
							<p>{{exp[0]}}</p>
							<p>{{exp[1]}}</p>
						</div>
					</div>
				</div>
				<div class="right">
					<div class="col" v-for="(content,i) in contents" :key="i">
						<div class="plan">Plan {{content.plan}}</div>
						<div class="money"><span>{{showCurrency}} {{content.money}}</span></div>
						<div class="gold">
							<span class="text">{{showCurrency}} {{content.gold}}</span>
							<span class="dollar">$</span>
							</div>
						<div class="cell" v-for="(detail,i) in content.details" :key="i">
							<div class="detail"><span>{{detail}}</span></div>
						</div>
						<div class="day"><span>{{content.day}} Days</span></div>
					</div>
				</div>
			</div>
			<div class="terms-conds" style="font-weight: 500;">
				<div>Terms and Conditions:</div>
				<div v-for="(item,i) in termsAndConds" :key="i">{{ item }}</div>
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
import { showCurrency } from 'config/currencyConfig';
import termsAndConds from 'activity/first-deposit/terms.js';

export default {
	data () {
		return {
			activityId: 0,
			isQualified: false,
			checkGiftsStatus: false,
			depositBtnText: 'DEPOSIT NOW',
			totalParticipantsNum: '',
			activityStatus: 0,
			termsAndConds: [],
			exps: [
				['Single', 'First Deposit'],
				['Total', 'Value of Gifts'],
				['All Gifts', 'Effective for'],
				['Gifts', 'Amount & Value']
			],
			contents: [],
			showCurrency,
			download: pagePath.download
		};
	},
	created () {
		this.contents = [
			{
				plan: 'A',
				money: 50,
				gold: 150,
				details: [
					`1x ${this.showCurrency} 3`,
					`1x ${this.showCurrency} 7`,
					`1x ${this.showCurrency} 15`,
					`3x ${this.showCurrency} 25`,
					`1x ${this.showCurrency} 50`
				],
				day: 6
			},
			{
				plan: 'B',
				money: 100,
				gold: 300,
				details: [
					`2x ${this.showCurrency} 3`,
					`2x ${this.showCurrency} 7`,
					`2x ${this.showCurrency} 15`,
					`1x ${this.showCurrency} 20`,
					`4x ${this.showCurrency} 25`,
					`1x ${this.showCurrency} 30`,
					`2x ${this.showCurrency} 50`
				],
				day: 7
			},
			{
				plan: 'C',
				money: 200,
				gold: 600,
				details: [
					`4× ${this.showCurrency}  3`,
					`4× ${this.showCurrency}  7`,
					`2× ${this.showCurrency}  30`,
					`6× ${this.showCurrency}  50`,
					`2× ${this.showCurrency}  100`,
				],
				day: 10
			},
			{
				plan: 'D',
				money: 300,
				gold: 1000,
				details: [
					`4× ${this.showCurrency}  3`,
					`4× ${this.showCurrency}  7`,
					`8× ${this.showCurrency}  50`,
					`1× ${this.showCurrency}  60`,
					`2× ${this.showCurrency}  100`,
					`2× ${this.showCurrency}  150`
				],
				day: 12
			}];
		this.termsAndConds = termsAndConds;
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
.gifts-info {
  width: 700px;
  height: 66px;
  margin-bottom: 29px;
  font-size: 48px;
  font-weight: bold;
  color: #ff2748;
  text-align: center;
  flex-grow: 1;
}
.logo {
  img {
    margin-left: 56px;
    width: 207px;
    height: 72px;
  }
}
.main-body {
  width: 700px;
  margin: 0 auto;
}
.tables {
  display: flex;
  padding-bottom: 81px;
  .left {
	  width:110px;
	  margin-right: 18px;
    &:before {
      content: " ";
      display: inline-block;
      width: 5px;
      height: 25px;
      background: #e8e8e8;
      margin-right: 5px;
    }
    .text {
      display: inline-block;
      p {
        line-height: 1;
        font-weight: 600;
      }
    }
  }
  .first {
	  margin-top: 30px;
  }
  .gold-bar {
	  margin-top: 35px;
	  margin-bottom: 34px;
	  color: #ecb639;
  }
  .third {
	  position: relative;
	  top:236px;
  }
  .gold-bar:before {
	  background: #eaac05;
  }
  .right {
    display: flex;
    .col {
		position:relative;
      .plan {
        width: 155px;
        height: 22px;
        line-height: 22px;
        background-color: #353a45;
        margin-right: 37px;
        font-size: 14px;
        color: #fff;
        text-align: center;
      }
      .money {
        width: 155px;
        height: 45px;
        line-height: 45px;
        background-color: #f8f8f8;
        margin-top: 4px;
        font-size: 14px;
        span {
          padding-left: 14px;
        }
      }
      .gold {
        width: 178px;
        height: 60px;
        line-height: 60px;
        border-radius: 4px;
        overflow: hidden;
        background-color: #fef3c0;
        font-size: 18px;
		position: relative;
		margin-top: 10px;
		margin-left: -10px;
        .text {
		  padding-left: 15px;
		  color: #ecb639;
        }
        .dollar {
          width: 76px;
          height: 76px;
          line-height: 76px;
          border-radius: 38px;
          display: inline-block;
          background-color: #fbdc60;
          box-shadow: inset 0 1px 9px 0 rgba(234, 172, 5, 0.5);
          color: #fef2c3;
          font-size: 50px;
          text-align: center;
          font-weight: 800;
          transform: rotate(-38deg);
          position: absolute;
          top: -7px;
          right: -17px;
        }
      }
      .cell {
        margin-top: 10px;
        .detail {
          width: 155px;
		  height: 24px;
		  line-height: 24px;
          background-color: #fffbe8;
          margin-bottom: 10px;
          span {
            padding-left: 10px;
          }
        }
      }
      .day {
        width: 155px;
		height: 45px;
		line-height: 45px;
		background-color: #f8f8f8;
		font-size: 14px;
		padding-top: 10px;
		position: absolute;
		bottom: -50px;
		span {
			padding-left: 13px;
		}
      }
    }
  }
}

.terms-conds {
  width: 700px;
  margin-top: 50px;
  font-size: 14px;
  line-height: normal;
  font-weight: 500;
  color: #353a45;
}
.btn-wrapper {
  margin-top: 60px;
  width: 700px;
  & > button {
    .btn-deposit;
    margin: 0 0 49px 237px;
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
  height: 130px;
  background: url(./image/download_app.jpg);
  background-size: 100% 130px;
  margin-bottom: 41px;
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
