<template>
<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
			<div class="thurs-deposit">
				<img class="thurs-deposit-header" :src="depositUrl" />
				<img class="thurs-deposit-cash-gift" :src="cashUrl"/>
				<af-button class="thurs-deposit-btn" extraType="" @click="depositNowHandler">{{depositBtnText}}</af-button>
				<div class="thurs-terms-title">Terms & Conditions</div>
				<ol class="thurs-terms-list">
					<li class="thurs-terms-item" v-for="(item,index) in termsAndConds" :key="index"><span class="thurs-terms-item-order">{{index + 1}}</span>{{item}}</li>
				</ol>
				<div class="download-app">
					<a :href="downloadApp"></a>
				</div>
			</div>
		</div>
	</Layout>
</template>
<script>
import 'packages/button';
import { pagePath } from 'config/pageConfig';
import termsAndConds from 'activity/ng/thurs-deposit/terms.js';

import 'components/dialog';
import appCore from 'appCore';
import { mapMutations } from 'vuex';
import Layout from 'components/layout/main.vue';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';

import 'components/loading';

import { userCenterUrl } from 'config/mycenter/dataConfig';
import { getActivityConfig } from 'activity/util';
import { appPath } from 'config/appPagePath';

const depositUrl = require('./image/thurs-deposit.jpg');
const cashUrl = require('./image/cash-gift.jpg');

export default {
	data () {
		return {
			activityId: 0,
			depositBtnText: 'DEPOSIT NOW',
			showCurrency: window.showCurrencyOrigin || 'NGN',
			downloadApp: pagePath.downloadApp,
			termsAndConds,
			time: Date.now(),
			configValue: {}
		};
	},
	components: {
		Layout
	},
	computed: {
		depositUrl() {
			return this.configValue.depositUrl || depositUrl;
		},
		cashUrl () {
			return this.configValue.cashUrl || cashUrl;
		}
	},
	created() {
		this.pageLoading(false);

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

		getActivityConfig('thurs_deposit', 'wap')
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
		});
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		depositNowHandler (event) {
			if (window.loginStatus) {
				if (window.AppCore.getAppName() === 'sportybet') {
					return window.AppCore.sendCmd(appPath.deposit);
				}
				window.location.href = userCenterUrl.deposit;
			} else {
				const okUrl = window.location.href;
				window.location.href = `${pagePath.login}?okUrl=${encodeURIComponent(okUrl)}`;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import "~base/styles/variable.less";
@import 'base/styles/icon.less';
.thurs-deposit-header{
	width: 100%;
}
.thurs-deposit-cash-gift{
	display: block;
	width: 290/@rem;
	height: 132/@rem;
	margin: 30/@rem auto;
}
.thurs-deposit-btn{
	display: block;
	margin: 60px auto;
	width: 240/@rem;
	height: 48/@rem;
	color: #FFF;
	border: none;
	font-size: 20/@rem;
	background-color: #e41827;
	&:hover{
		color: #FFF;
	}
}
.thurs-terms-title{
	margin: 10/@rem 20/@rem;
	font-size: 14/@rem;
	font-weight: bold;
	color: #000;
}
.thurs-terms-list{
	margin: 10/@rem 20/@rem;
	font-size: 12/@rem;
	padding-left: 24/@rem;
	line-height: 1.5;
}
.thurs-terms-item{
	margin: 10/@rem 0;
}
.thurs-terms-item-order{
	display: inline-block;
	width: 14/@rem;
	height: 14/@rem;
	font-size: 12/@rem;
	line-height: 14/@rem;
	text-align: center;
	margin-right: 10/@rem;
	margin-left: -24/@rem;
	background-color: #e41827;
	color: #FFF;
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
</style>
