<template>
  <div class="m-me-page">
		<div class="m-me-head">
			<topNavBar backText="Back" :link="homeUrl">
				<!-- <i slot="right" class="m-icon--email" v-if="isLogin" :class="{'m-has-msg':msgNum > 0}"></i> -->
			</topNavBar>
			<div class="m-me-uwrap" @click="goToUrl(isLogin ? userCenterUrl['myAccountInfo'] : userCenterUrl['login'])">
				<span class="m-u-col"><i class="m-icon--user"></i></span>
				<template v-if="isLogin">
					<span class="m-user-info" >
						<template v-if="!!(firstName || lastName)">
							<strong>{{firstName}} {{lastName}}</strong>
							<em>{{phone}}</em>
						</template>
						<strong v-else>{{phone}}</strong>
					</span>
				</template>
				<span v-else class="m-me-login">Register/Login</span>
			</div>
		</div>
		<div class="m-me-pbox m-me-sub-head">
			<ul class="m-me-balan-wrap">
				<li @click="goToUrl(userCenterUrl['transaction'])">
					<div class="m-balan-col">
						<div class="blance-text"><i v-if="balance < 0" @click.stop="rollbackAlert"></i>Balance</div>
						<div v-if="isLogin">
							<em> {{showCurrency}}{{fomatBalance}}</em>
						</div>
					</div>
				</li>
				<li class="m-split"></li>
				<li @click="goToUrl(userCenterUrl['gift'])">
					<div class="m-balan-col">
						<div>Gifts<span v-if="isLogin">({{giftNum}})</span></div>
						<div v-if="isLogin" class="m-gift-value">
							<em>{{showCurrency}}{{formatGiftAmount || 0}}</em>
						</div>
					</div>
				</li>
			</ul>
			<div class="m-me-btn-bar">
				<div class="deposit-tip" v-if="isShowDepositTip">Deposit any amounts for FREE</div>
				<a class="m-me-btn-green" :class="{'m-has-hui': hasHui}" @click="gotDeposit">Deposit<span class="m-btn-bubble" v-if="hasHui"><em>{{huiTxtBtn}}</em></span></a>
				<a class="m-me-btn-red" @click="goToUrl(userCenterUrl['withdraw'])">Withdraw</a>
			</div>
		</div>
		<div class="m-me-pbox">
			<div class="m-sport-bet">
				<div class="sport-item sport" @click="goToUrl(userCenterUrl['sportOrder'])">
					<span>SPORTS</span><span>BET HISTORY</span>
				</div>
				<!-- 尼日没有jackpotOrder -->
				<div class="sport-item jackpot" @click="goToUrl(userCenterUrl['jackpotOrder'])">
					<span>JACKPOT</span><span>BET HISTORY</span>
				</div>
			</div>
			<ul class="m-me-tlist2">
				<li @click="goToUrl(userCenterUrl['transaction'])">
					<p>Transactions</p>
				</li>
				<li @click="goToUrl(userCenterUrl['promotion'])">
					<p>Promotions</p>
				</li>
			</ul>
		</div>
		<div class="m-me-pbox m-logout-wrap" v-if="isLogin">
			<div class="m-me-logout" @click="logout">Log Out</div>
		</div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import topNavBar from 'components/navbar';
import { LS } from 'storage';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';
import { getAdConfig } from 'utils/getAdConfig';
import { showCurrency } from 'config/currencyConfig';

const isHaveShowDeposit = LS.get('isHaveShowDeposit');

export default {
	components: {
		topNavBar,
	},
	computed: {
		...mapState('me', [
			'isLogin',
			'firstName',
			'lastName',
			'giftNum',
			'giftAmount',
			'msgNum',
			'phone',
			'balance'
		]),
		...mapGetters('me', [
			'fomatBalance',
			'formatGiftAmount'
		]),
		hasHui () { // deposit按钮是否显示活动浮动泡泡开关
			return this.huiTxtBtn !== '';
		}
	},
	data () {
		return {
			userCenterUrl,
			homeUrl: pagePath.home,
			showCurrency,
			huiTxtBtn: '', // deposit按钮活动文字
			// 本地存储中isHaveShowDeposit为1的时候表示显示过了
			isShowDepositTip: isHaveShowDeposit !== '1',
			country: window.country
		};
	},
	watch: {
		isShowDepositTip: {
			immediate: true,
			handler  (val) {
				if (val) {
					setTimeout(() => {
						this.isShowDepositTip = false;
					}, 4000);
				}
			}
		}
	},
	created () {
		getAdConfig('meDepositBtn').then(obj => {
			if (obj[0] && obj[0].text) {
				this.huiTxtBtn = obj[0].text;
			}
		});
		if (!this.isHaveShowDeposit) {
			LS.set('isHaveShowDeposit', 1);
		}
	},
	methods: {
		goToUrl (url) {
			window.location.href = url || this.homeUrl;
		},
		gotDeposit () {
			this.isShowDepositTip = false;
			setTimeout(() => this.goToUrl(this.userCenterUrl.deposit), 16);
		},
		rollbackAlert () {
			this.$alert('Due to the abnormal match data settlement , the account balance/bonus has been corrected. Sorry for the inconvenience.');
		},
		logout () {
			fetch('/patron/accessToken/delete', {
				method: 'DELETE'
			}).then(res => res.json())
				.then(data => {
					if (data.bizCode === 10000) {
						this.goToUrl();
					}
				});
		}
	}
};
</script>
<style lang="less">
@import '../style/index.less';
</style>
