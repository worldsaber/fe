<template>
	<div style="overflow: hidden;" class="gifts-wrapper" id="j_gifts">
		<div class="top">
			<div class="top-wrapper">
				<div class="logo">
					<a @click.prevent="goHome"><img :src="require('../bonus/image/logo.png')" alt=""></a>
				</div>
				<template v-if="hasClaimed">
					<a class="btn-claim btn-fix" @click.prevent="jmpGifts">CHECK GIFTS</a>
				</template>
				<template v-else>
					<af-button class="btn-claim" @click="getGifts">CLAIM FREE GIFT</af-button>
				</template>
			</div>
		</div>
		<div class="main-body">
			<template v-if="hasImgs">
				<div class="m-img-banner">
					<h4>How to use a Gift</h4>
					<ul class="m-img-wrapper">
						<li
							class="m-img-item"
							v-for="(item, index) in imgLists"
							:key="index"
						>
							<div class="m-image-wrapper">
								<img :src="item" alt="">
							</div>
							<p class="m-desc">{{imgDesc[index].desc}}</p>
							<i class="m-icon-next" v-if="index < imgLists.length -  1"></i>
						</li>
					</ul>
				</div>
			</template>

			<template v-if="hasTips">
				<div class="m-tips-banner">
					<h4>QUICK HELP</h4>
					<ul class="m-tips-wrapper">
						<li
							class="m-tips-item"
							v-for="(tipItem, tipIndex) in tips"
							:key="tipIndex"
						>
							<h5
								class="m-tips-title"
								v-if="tipItem.title"
							>{{tipItem.title}}</h5>

							<template v-if="tipItem.type === 'passage'">
								<p
									class="m-tips-msg"
									v-if="tipItem.content"
								>{{tipItem.content}}</p>
							</template>

							<template v-else>
								<div class="m-tips-msg">
									<h6
										class="m-tips-title--min"
										v-if="tipItem.content && tipItem.content.minTitle"
									>{{tipItem.content.minTitle}}</h6>
									<div
										class="m-list-min"
										v-if="tipItem.content && tipItem.content.list"
									>
										<p
											class="m-list-item"
											v-for="(listItem, index) in tipItem.content.list"
											:key="index"
										>{{listItem}}</p>
									</div>
								</div>
							</template>
						</li>
					</ul>
				</div>
			</template>

			<div class="m-btn-wrapper">
				<a class="betting-btn" @click.prevent="bet">BET NOW</a>
			</div>

			<div class="download_wrapper">
				<div class="m-image-wrapper">
					<img src="../bonus/image/download_app.jpg" alt="">
				</div>
				<div class="download-app">
					<a :href="downloadApp"></a>
				</div>
			</div>
		</div>
		<FooterBar />
	</div>
</template>
<script>
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import 'packages/button';
import { objType } from 'utils';
import 'utils/class';
import appCore from 'appCore';
import FooterBar from 'components/layout/pagelate/footer/index.vue';
import 'components/login/popupLogin';
import { showCurrency } from 'config/currencyConfig';
import { appPath } from 'config/appPagePath';

import { helpTips, helpImg } from './config/pageConfig';

import pic1 from './image/help1.jpg';
import pic2 from './image/help2.jpg';
import pic3 from './image/help3.jpg';

const GIFT_KIND = 7;

export default {
	components: {
		FooterBar
	},
	data () {
		return {
			tips: helpTips || [],
			imgDesc: helpImg || [],
			imgLists: [],
			hasClaimed: false,
			footballPath: pagePath.preFootball,
			downloadApp: pagePath.downloadApp,
			giftsPath: `${userCenterUrl.gift}?ret=${encodeURIComponent(pagePath.preFootball)}`,
			loginPath: pagePath.login
		};
	},
	computed: {
		hasTopBanner() {
			return true;
		},
		hasImgs() {
			return !!this.imgLists.length;
		},
		hasTips() {
			return !!this.tips.length;
		}
	},
	created () {
		pic1 && this.imgLists.push(pic1);
		pic2 && this.imgLists.push(pic2);
		pic3 && this.imgLists.push(pic3);

		window.loginStatus && this.verfiyClaim();

		// 如果在app内
		if (appCore.getAppName() === 'sportybet') {
			appCore.sportybet.ready(AFJsApi => {
				if (!AFJsApi) {
					return;
				}
				AFJsApi.ui.setOptionMenu({ title: 'Share', resId: 'ic_share_white_24dp' });
			});
			document.addEventListener('optionMenu', () => {
				// 右上角按钮被点击时会回调 optionMenu 事件
				appCore.share({
					title: 'share',
					url: window.location.href
				});
				appCore.shareNow();
			}, false);
		}
	},
	methods: {
		getGifts() {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			fetch('/promotion/v1/activities/qualifies/acquire', {
				method: 'POST',
				headers: t
			})
			.then(res => res.json())
			.then(ret => {
				if (ret.login === false) {
					this.jmpLogin();
					return;
				}

				const code = ret.bizCode;

				switch (code) {
				case 10000: {
					this.hasClaimed = true;
					const self = this;
					this.showTips({
						msg: `Congratulations! You successfully claimed a free Gift of ${showCurrency}20! `,
						btnList: ['Bet Now'],
						action() {
							self.bet();
						}
					});
					break;
				}
				case 19003:
					this.jmpLogin();
					break;
				case 74100:
				case 74200:
					this.showTips({
						msg: ret.message || 'Too many customers at the monment, please try again later!'
					});
					break;
				default:
					this.showTips({
						msg: ret.message || 'No internet connection, try again.'
					});
					break;
				}
			}).catch(err => {
				this.showTips({
					msg: err.message || 'No internet connection, try again.'
				});
			});
		},
		verfiyClaim() {
			fetch('/marketing/v1/activities/getByKind', {
				body: {
					kind: GIFT_KIND
				}
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode,
					originData = ret.data || {};

				if (code === 10000) {
					this.hasClaimed = objType(originData.isQualified) !== 'undefined' && +originData.isQualified === 0 ||
						false;
				}
			}).catch(err => {
				this.showTips({
					msg: err.message || 'No internet connection, try again.'
				});
			});
		},
		jmpLogin() {
			if (this.$popupLogin) {
				document.querySelector('#j_gifts').addClass('off');
				this.$popupLogin.show();
			} else {
				const okUrl = window.location.href;
				window.location.href = `${this.loginPath}?okUrl=${encodeURIComponent(okUrl)}`;
			}
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.verfiyClaim();
			document.querySelector('#j_gifts').removeClass('off');
		},
		showTips(opt) {
			const { title, msg, btnList, action } = opt;

			if (msg) {
				this.$dialog({
					css: 'errMsg-dialog',
					width: 315,
					title: title || '',
					content: msg,
					button: btnList || ['*OK']
				}).onBtnClick(btnType => {
					action && action();
				});
			}
		},
		jmpGifts() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.gifts);
			}

			location.href = this.giftsPath;
		},
		bet() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.events);
			}

			location.href = this.footballPath;
		},
		goHome() {
			if (window.AppCore.getAppName() === 'sportybet') {
				return window.AppCore.sendCmd(appPath.home);
			}

			location.href = pagePath.home;
		}
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.gifts-wrapper {
	display: block;

	&.off {
		display: none;
	}
}
.top {
	width: 100%;
	height: 266.06/@rem;
}
.top-wrapper{
	height: 266.06/@rem;
	background: url(./image/topBanner.jpg) no-repeat;
	background-size: cover;
	background-position: top center;
	position: relative;
	.btn-claim {
		width: 184.5/@rem;
		height: 44.4/@rem;
		background: @red;
		border-radius: 22.2/@rem;
		padding: 0;
		border: none;
		position: absolute;
		bottom: 6.3425%;
		right: 7.8125%;
		font-size: 16/@rem;
		color: @white;
		box-shadow: 0px 7px 12.6px 3.4px rgba(1, 43, 21, 0.77);
		background-image: linear-gradient(to top, #bc000e, #fa321d 72%, #ff4810);

		&:hover {
			background: @hRed;
			box-shadow: none;
		}

		&:active {
			background: @aRed;
			box-shadow: none;
		}
	}

	.btn-fix {
		line-height: 44.4/@rem;
		text-align: center;
		text-decoration: none;
	}
}
.logo{
	position: absolute;
	left: 5.9375%;
	top: 1.48%;

	>a {
		display: inline-block;
		vertical-align: top;
		width: 106.875/@rem;
		height: 20.25/@rem;
	}
	img{
		width: 100%;
		height: 100%;
	}
}
.main-body{
	width:100%;
	margin: 0 auto;

	h4 {
		line-height: 27/@rem;
		font-size: 20/@rem;
		font-weight: bold;
		text-align: center;
		color: @dark;
		padding: 7/@rem 0;
		box-sizing: border-box;
		border-bottom: 1px solid @fogGrayBorder;
	}

	.m-img-banner {
		padding: 26/@rem 21/@rem 32/@rem 21/@rem;
		box-sizing: border-box;

		.m-img-wrapper {
			padding: 33/@rem 9/@rem 0 22/@rem;
			box-sizing: border-box;
		}

		.m-image-wrapper {
			width: 100%;

			> img {
				width: 100%;
			}
		}

		.m-desc {
			padding: 17/@rem 0 18/@rem;
			box-sizing: border-box;

			line-height: 16/@rem;
			font-size: 12/@rem;
			font-weight: 500;
			color: @black2;
		}

		.m-icon-next {
			.m-icon-down();
			color: @fogGray;
			display: inline-block;
			line-height: 1;
			vertical-align: top;
			width: 100%;
			text-align: center;

			&:before {
				font-size: 25/@rem;
				font-weight: bold;
			}
		}

		.m-img-item {
			margin-bottom: 33/@rem;

			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}

	.m-tips-banner {
		padding: 0 21/@rem 0 42/@rem;
		box-sizing: border-box;

		.m-tips-wrapper {
			padding-top: 33/@rem;
			box-sizing: border-box;
			list-style: decimal;
			font-size: 18/@rem;
  			font-weight: bold;
			line-height: 25/@rem;
		}

		.m-tips-title {
			color: @dark;
		}

		.m-tips-msg {
			line-height: 16/@rem;
			font-size: 12/@rem;
			font-weight: 500;
			color: @dark;
			margin-top: 2/@rem;
		}

		.m-tips-item {
			padding-bottom: 26/@rem;
			box-sizing: border-box;

			&:last-of-type {
				padding-bottom: 0
			}
		}
	}

	.m-btn-wrapper {
		padding: 28/@rem 45/@rem;
		box-sizing: border-box;
		text-align: center;

		.betting-btn {
			display: inline-block;
			width: 100%;
			height: 48/@rem;
			border-radius: 2/@rem;
			background-color: @green;
			line-height: 48/@rem;
			font-size: 16/@rem;
			font-weight: bold;
			text-align: center;
			color: @white;
			border: none;

			&:hover {
				background: @midGreen;
			}

			&:active {
				background: @lightGreen;
			}
		}
	}
}

.download_wrapper {
	margin: 23/@rem 23/@rem 0;
	position: relative;

	.m-image-wrapper {
		width: 100%;

		>img {
			width: 100%;
		}
	}

	.download-app {
		position: absolute;
		width: 100%;
		height: 100%;
		bottom: 0;
		right: 0;

		>a {
			position: absolute;
			right: 0;
			bottom: 0;
			transform: translate3d(-5.2%,-21%, 0);
			width: 39.6%;
    		height: 53.8%;
			min-width: 124.2/@rem;
			min-height: 36.7/@rem;
		}
	}
}
.es-dialog {
	border-radius: 0;
	width: 248/@rem !important;
	padding-top: 0;
	.es-dialog-head {
		padding: 0;
	}
	.es-dialog-body .es-dialog-main{
		padding: 0 21.3/@rem 5.5/@rem;
		width: 205.5/@rem;
		height: 72/@rem;
		.dialog-content{
			width: 205/@rem;
			font-size: 14/@rem;
			line-height: 1.71;
		}
	}
	.es-dialog-footer{
		background-color: white;
		display: block;
		text-align: center;
		.es-dialog-btn{
			display: inline;
			color: @green;
			font-size: 14/@rem;
			font-weight: bold;
			background-color: white;
			border:0;
			outline: 0;
			span{
				margin-left:175/@rem;
			}
			&:hover{
				color: @lightGreen;
				border-color: @lightGreen;
			}
		}
	}
}
</style>
