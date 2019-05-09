<template lang="html">
	<main class="m-page-gifts">
		<div class="m-top-pannel" v-if="hasTopBanner">
			<div class="m-top-wrapper">
				<div class="logo">
					<a class="m-image-wrapper" href="/"><img :src="require('../bonus/image/logo.png')" alt=""></a>
				</div>
				<img src="./image/topBanner.jpg" alt="">
				<template v-if="hasClaimed">
					<a class="btn-claim btn-fix" :href="giftPath">CHECK GIFTS</a>
				</template>
				<template v-else>
					<af-button class="btn-claim" @click="getGifts">CLAIM FREE GIFT</af-button>
				</template>
			</div>
		</div>
		<section class="m-main-pannel">
			<template v-if="hasImgs">
				<div class="m-img-banner">
					<h4>How to use a Gift</h4>
					<ul class="m-img-wrapper">
						<li
							class="m-img-item"
							v-for="(item, index) in imgLists"
						>
							<div class="m-image-wrapper">
								<img :src="item" alt="">
							</div>
							<div class="m-desc">
								<div class="m-label">{{index + 1}}</div>
								<p class="m-value">{{imgDesc[index].desc}}</p>
							</div>
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
							key="tipIndex"
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
											v-for="listItem in tipItem.content.list"
										>{{listItem}}</p>
									</div>
								</div>
							</template>
						</li>
					</ul>
				</div>
			</template>

			<div class="m-btn-wrapper">
				<a :href="footballPath" class="af-button-primary">BET NOW</a>
			</div>
			<div class="download-app">
				<a download :href="downloadPath"></a>
			</div>
		</section>
	</main>
</template>

<script>
import 'packages/button';
import CommonPop from 'components/popDialog/commonPop';
import { objType } from 'utils';

import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';
import { userCenterConfig } from 'config/order/userCenterConfig';
import { showCurrency } from 'config/currencyConfig';

import { helpTips, helpImg } from './config/pageConfig';

import pic1 from './image/help1.png';
import pic2 from './image/help2.png';
import pic3 from './image/help3.png';

const GIFT_KIND = 7;

export default {
	data() {
		return {
			tips: helpTips || [],
			imgDesc: helpImg || [],
			imgLists: [],
			hasClaimed: false,
			downloadPath: pagePath.download,
			footballPath: pagePath.preFootball,
			giftPath: userCenterConfig.Gifts,
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
	created() {
		pic1 && this.imgLists.push(pic1);
		pic2 && this.imgLists.push(pic2);
		pic3 && this.imgLists.push(pic3);

		window.loginStatus && this.verfiyClaim();
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
				case 10000:
					this.hasClaimed = true;
					this.showTips({
						msg: `Congratulations! You successfully claimed a free Gift of ${showCurrency}20! `,
						type: 'success'
					});
					break;
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
			if (window.login) {
				window.login({ activeTab: 'Log In' });
			} else {
				window.location.href = `${this.loginPath}&ret=${encodeURIComponent(location.href)}`;
			}
		},
		showTips(opt) {
			const { title, msg, type } = opt;

			if (msg) {
				this.$dialog({
					title: null,
					contentData: {
						title: title || '',
						msg,
						okBtn: type === 'success' ? 'Bet Now' : '',
					},
					content: CommonPop,
					button: []
				}).onBtnClick(btnType => {
					(type === 'success') && (location.href = this.footballPath);
				});
			}
		},
		handleLoginStatus() {
			this.verfiyClaim();
		},
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

.m-page-gifts {
	.m-image-wrapper {
		> img {
			width: 100%;
			height: 100%;
		}
	}

	.m-top-pannel {
		background: @black;
		min-height: 420px;

		.m-top-wrapper {
			position: relative;
			margin: 0 auto;
			min-height: 420px;
			min-width: 1366px;

			> img {
				width: 100%;
				height: auto;
			}
		}

		.logo {
			width: 193px;
			height: 37px;
			position: absolute;
			top: 17px;
			left: 213px;

			> a {
				display: inline-block;
				vertical-align: top;
				width: 193px;
				height: 37px;
			}
		}

		.btn-claim {
			width: 268px;
			height: 64px;
			padding: 0;
			border: none;
			border-radius: 32px;
			position: absolute;
			bottom: 18.81%;
			left: 39.82%;
			font-size: 21px;
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
			line-height: 64px;
			text-align: center;
			text-decoration: none;
		}
	}
	.m-main-pannel {
		width: 1000px;
		margin: 47px auto 42px;

		h4 {
			line-height: 36px;
		    font-size: 26px;
		    font-weight: bold;
		    text-align: center;
		    color: @dark;
		}

		.m-img-wrapper {
			margin-top: 23px;
		}

		.m-img-item {
			display: inline-block;
			vertical-align: top;
			width: 315px;
			margin-right: 13px;
		}

		.m-image-wrapper {
			width: 271px;
			height: 291px;
			margin-left: 44px;
		}

		.m-label,
		.m-value {
			display: inline-block;
			vertical-align: top;
		}

		.m-label {
			font-size: 46px;
			font-weight: bold;
			color: @green;
			line-height: 1;
			margin-right: 7px;

			&:after {
				content: '';
				width: 7px;
				height: 7px;
				background: @green;
				display: inline-block;
				vertical-align: baseline;
			}
		}

		.m-value {
			line-height: 19px;
			font-size: 14px;
			font-weight: 500;
			color: @grayBlack;
			width: 210px;
		}

		.m-desc {
			margin-top: 32px;
		}

		.m-tips-banner {
			margin-top: 61px;
		}

		.m-tips-wrapper {
			margin-top: 14px;
			counter-reset: count;
		}

		.m-tips-item {
			margin-bottom: 25px;
		}

		.m-tips-title {
			font-size: 18px;
  			font-weight: bold;
			line-height: 25px;
			color: @dark;

			&:before {
				counter-increment: count;
				content: counter(count);
				width: 25px;
				height: 25px;
				background-color: @green;
				color: @white;
				line-height: 25px;
				text-align: center;
				display: inline-block;
				margin-right: 16px;
			}
		}

		.m-tips-msg {
			line-height: 19px;
			font-size: 14px;
			font-weight: 500;
			color: @dark;
			padding-left: 41px;
			box-sizing: border-box;
		}

		.m-btn-wrapper {
			text-align: center;
		}

		.af-button-primary {
			display: inline-block;
			width: 230px;
			height: 48px;
			border-radius: 2px;
			background-color: @green;
			line-height: 48px;
			font-size: 16px;
			font-weight: bold;
			text-align: center;
			color: @white;
			text-decoration: none;

			&:hover {
				background: @midGreen;
			}

			&:active {
				background: @lightGreen;
			}
		}
	}

	.download-app {
		margin: 20px auto 0;
		position: relative;
		width: 700px;
		height: 130px;
		background: url(../bonus/image/download_app.jpg) no-repeat;
		background-size: 100% 130px;
		& > a {
			position: absolute;
			top: 52px;
			left: 450px;
			width: 225px;
			height: 55px;
		}
	}
}
</style>
