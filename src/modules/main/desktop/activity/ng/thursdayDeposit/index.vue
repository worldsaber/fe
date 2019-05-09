<template>
	<div class="thursday-depsoit">
		<div class="thurs-deposit-header">
			<div class="thurs-deposit-header-center">
				<div class="thurs-desposit-gift" :style="backStyle"></div>
				<a href="/">
					<img class="sportybet-logo" src="./image/logo.png"/>
				</a>
				<div class="thurs-deposit-time">
					<div class="thurs-time-wrap">
						<p class="thurs-time-text thurs-time-title">ENDS IN</p>
						<p class="thurs-time-text thurs-time-num">{{timeDiffStr}}</p>
					</div>
				</div>
				<div class="thurs-desposit-date">DEPOSITS ON {{twoBitNum(day)}}/{{twoBitNum(month)}}/{{year}}</div>
				<div class="thurs-desposit-tip">*Deposit on Thursday for Cash Gifts usable during the Weekend</div>
			</div>
		</div>
		<img class="thurs-deposit-cash-gift" :src="cashGiftUrl"/>
		<af-button class="thurs-deposit-btn" extraType="" @click="depositNowHandler">{{depositBtnText}}</af-button>
		<div class="thurs-terms-title">Terms & Conditions</div>
		<ol class="thurs-terms-list">
			<li class="thurs-terms-item" v-for="(item,index) in termsAndConds" :key="index"><span class="thurs-terms-item-order">{{index + 1}}</span>{{item}}</li>
		</ol>
		<div class="download-app">
			<a download :href="download"></a>
		</div>
	</div>
</template>
<script>
import 'packages/button';
import { pagePath } from 'config/pageConfig';
import { userCenterConfig } from 'config/order/userCenterConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';
import termsAndConds from 'activity/ng/thurs-deposit/terms.js';
import { getActivityConfig } from 'activity/util.js';

const cashGiftUrl = require('./image/cash-gift.jpg');
const depositGiftUrl = require('./image/deposit-gift.png');

export default {
	data () {
		return {
			activityId: 0,
			depositBtnText: 'DEPOSIT NOW',
			showCurrency: showCurrencyOrigin,
			download: pagePath.download,
			termsAndConds,
			configValue: {},
			time: Date.now()
		};
	},
	created () {
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
		}
		getActivityConfig('thurs_deposit')
		.then(data => {
			// 配置失效
			if (!data) {
				return;
			}

			let value = data.configValue;
			try {
				value = JSON.parse(value);
			} catch (e) {
				value = {};
			}
			this.configValue = value;
			if (value.termsAndConds) {
				this.termsAndConds = value.termsAndConds;
			}

			this.$nextTick(() => {
				// 开启倒计时
				if (this.timeDiff > 0) {
					setInterval(() => {
						this.time = Date.now();
					}, 1000);
				}
			});
		});
	},
	computed: {
		year() {
			return this.configValue.year || 2018;
		},
		month() {
			return this.configValue.month || 5;
		},
		day() {
			return this.configValue.day || 24;
		},
		timeDiff() {
			return Math.floor((this.endTime - this.time) / 1000);
		},
		timeDiffStr() {
			let time = this.timeDiff;
			if (time <= 0) {
				return '00:00:00';
			}

			const second = time % 60;
			time = Math.floor(time / 60);
			const minute = time % 60;
			time = Math.floor(time / 60);
			const hour = time;

			return `${this.twoBitNum(hour)}:${this.twoBitNum(minute)}:${this.twoBitNum(second)}`;
		},
		endTime() {
			const date = new Date();
			date.setYear(this.year);
			date.setMonth(this.month - 1);
			date.setDate(this.day);
			date.setHours(24);
			date.setMinutes(0);
			date.setSeconds(0);
			return +date;
		},
		cashGiftUrl() {
			return this.configValue.cashUrl || cashGiftUrl;
		},
		depositGiftUrl() {
			return this.configValue.depositUrl || depositGiftUrl;
		},
		backStyle() {
			return {
				backgroundImage: `url(${this.depositGiftUrl})`
			};
		}

	},
	watch: {
		timeDiff(value) {
			if (value < 0) {
				this.interval && clearInterval(this.interval);
				this.interval = null;
			}
		}
	},
	methods: {
		depositNowHandler (event) {
			if (window.loginStatus) {
				window.location.href = userCenterConfig.Deposit;
			} else {
				window.login();
			}
		},
		twoBitNum(num) {
			if (num >= 0 && num <= 9) {
				return `0${num}`;
			}
			return num;
		}
	}
};
</script>
<style lang="less" scoped>
@import "~base/style/variable.less";
.thurs-deposit-header{
	position: relative;
	width: 100%;
	height: 520px;
	background: url('./image/deposit-back.jpg') center center no-repeat;
	background-size: 100% 100%;
}
.thurs-deposit-header-center{
	position: relative;
	width: 1000px;
	height: 520px;
	margin: 0 auto;
}
.sportybet-logo{
	position: absolute;
	width: 250px;
	height: 87px;
	margin-top: 20px;
}
.thurs-deposit-time{
	position: absolute;
	right: 0;
	top: 0;
	width: 239px;
	height: 187px;
	background: url('./image/time-board.png') center center no-repeat;
	background-size: 100% 100%;
}
.thurs-time-wrap{
	position: absolute;
	font-size: 20px;
	color: #FFF;
	font-weight: bold;
	top: 48px;
	width: 100px;
	padding-left: 48px;
	line-height: 1.4;
	transform: rotate(8deg);
}
.thurs-time-num{
	font-size: 24px;
	// line-height: 1.5;
}
.thurs-desposit-gift{
	position: absolute;
	top: 0;
	left: -179px;
	width: 1283px;
	height: 506px;
	background: url('./image/deposit-gift.png') center center no-repeat;
	background-size: 100% 100%;
}
.thurs-desposit-date{
	position: absolute;
	top: 173px;
	right: 10px;
	background-color: #f86f1e;
	border-radius: 21px;
	height: 42px;
	width: 360px;
	text-align: center;
	line-height: 42px;
	font-size: 24px;
	font-weight: bold;
	color: #FFF;
}
.thurs-desposit-tip{
	position: absolute;
	bottom: 50px;
	left: 25px;

	font-size: 24px;
	color: #FFF;
}
.thurs-deposit-cash-gift{
	display: block;
	width: 687px;
	height: 232px;
	margin: 60px auto;
}
.thurs-deposit-btn{
	display: block;
	margin: 60px auto;
	width: 260px;
	height: 60px;
	color: #FFF;
	border: none;
	font-size: 24px;
	background-color: #e41827;
	&:hover{
		color: #FFF;
	}
}
.thurs-terms-title{
	width: 1000px;
	margin: 0 auto;
	font-size: 16px;
	font-weight: bold;
	color: #000;
}
.thurs-terms-list{
	width: 1000px;
	margin: 0 auto;
	font-size: 14px;
	line-height: 1.5;
}
.thurs-terms-item{
	margin: 10px 0;
}
.thurs-terms-item-order{
	display: inline-block;
	width: 14px;
	height: 14px;
	font-size: 12px;
	line-height: 14px;
	text-align: center;
	margin-right: 10px;
	background-color: #e41827;
	color: #FFF;
}
.download-app {
	position: relative;
	width: 700px;
	height: 130px;
	margin: 40px auto;
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
</style>
