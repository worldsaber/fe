<template>
	<div class="error-wrapper">
		<div class="success" v-if="state === 'success'">
			<span class="successful">
				<img src="../image/success.png" style="width:21px;height:21px">
				PlaceBet Successfully!
			</span>
			<a @click="clearLS" :href="path" style="text-decoration:none">
				<div class="go-check">Go Check it!</div>
			</a>
			<p class="not-popup link">If website did not pop up, please visit<br>
				<a @click="clearLS" :href="path">www.sportybet.com.</a>
			</p>
		</div>

		<div class="fail" v-if="state === 'pending'">
			<div class="coupon">
				<div class="currency">{{showCurrency}}</div>
				<div class="amount">{{giftAmount}}</div>
			</div>
			<p class="notice">The {{showCurrency}}50 voucher has already been put into your account.</p>
			<p class="link">Please visit <a @click="clearLS" :href="path">www.sportybet.com</a> for free bet.</p>
		</div>

		<div class="pending" v-if="state === 'fail'">
			<img src="../image/notice.png" style="width:40px;height:40px">
			<p class="link">Please go check your order on<br><a @click="clearLS" :href="path">www.sportybet.com</a></p>
			<p class="check-in-account">If there isn't any,<br>
			 please place another free bet with the<br>
			 <span>{{showCurrency}}50 voucher</span> in your account.</p>
		</div>
	</div>
</template>
<script>
import { LS } from 'storage';
import { wapBaseUrl, domain, protocol, pagePath } from 'config/pageConfig';
import { showCurrency } from 'config/currencyConfig';

export default {
	created () {
		this.state = LS.get('state');
		this.giftAmount = +LS.get('giftAmount') / 10000;
	},
	mounted () {
		const isWap = new RegExp(wapBaseUrl).test(window.location.href);
		// if (window.location.href.split('/')[4] === 'm') {
		// 	this.path = location.protocol + '//' + location.hostname + '/' + location.pathname.split('/')[1] + '/m/';
		// } else {
		// 	this.path = location.protocol + '//' + location.hostname + '/' + location.pathname.split('/')[1] + '/';
		// }
		if (isWap) {
			this.path = `${protocol}//${domain}${pagePath.wapHome}`;
		} else {
			this.path = `${protocol}//${domain}${pagePath.home}`;
		}
	},
	data () {
		return {
			path: '',
			state: '',
			giftAmount: 0,
			showCurrency
		};
	},
	methods: {
		clearLS () {
			LS.remove('odds');
			LS.remove('state');
			LS.remove('giftAmount');
			LS.remove('eventId');
			LS.remove('id');
			LS.remove('token');
			LS.remove('smsNumber');
			LS.remove(LS.get('phone') + 'msgContent');
			LS.remove('phone');
		}
	}
};
</script>
<style lang="less">
.success {
  margin-top: 60px;
  .successful {
	margin-left: 43px;
	color: #fff;
	font-family: Roboto;
	font-size: 19px;
	font-weight: bold;
	line-height: normal;
	letter-spacing: 0.3px;
	text-align: center;
	img {
	  margin-top: -5px;
	}
  }
  .go-check {
	width: 160px;
	height: 40px;
	margin-top: 30px;
	margin-left: 80px;
	border-radius: 20px;
	background-image: linear-gradient(to bottom, #17ce1d, #16b31a);
	box-shadow: 0 2px 5px 0 rgba(50, 206, 98, 0.5);
	font-family: Roboto;
	font-size: 16px;
	font-weight: bold;
	line-height: 40px;
	letter-spacing: 0.2px;
	text-align: center;
	color: #fff;
  }
  .not-popup {
	margin-top: 60px;
	color: #fff;
	font-family: Roboto;
	font-size: 14px;
	font-weight: 500;
	line-height: normal;
	letter-spacing: 0.2px;
	text-align: center;
  }
}
.coupon {
  width: 140px;
  height: 50px;
  margin-top: 50px;
  margin-left: 92px;
  background: url(../image/coupon.png) no-repeat;
  background-size:100% 100%;
  color: #fff;
  .currency {
	float: left;
	margin-top: 14px;
	margin-left: 30px;
	font-family: Roboto;
	font-size: 12px;
	font-weight: normal;
	line-height: normal;
	letter-spacing: 0.1px;
	text-align: center;
  }
  .amount {
	float: left;
	margin-top: 8px;
	margin-left: 8px;
	font-family: Roboto;
	font-size: 30px;
	font-weight: 500;
	line-height: normal;
	letter-spacing: 0.3px;
	text-align: center;
  }
}
.notice {
  margin-top: 20px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.2px;
  text-align: center;
  color: #fff;
}
.link {
  margin-top: 30px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.2px;
  text-align: center;
  color: #fff;
  a {
	color: #17ce1d;
  }
}
.pending {
  img {
	margin: 55px 0 -23px 140px;
  }
  .check-in-account {
	margin-top: 22px;
	color: #fff;
	font-family: Roboto;
	font-size: 14px;
	font-weight: 500;
	line-height: normal;
	letter-spacing: 0.2px;
	text-align: center;
	span {
	  font-size: 18px;
	}
  }
}
</style>
