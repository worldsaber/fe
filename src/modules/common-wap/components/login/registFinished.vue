<template>
<div id="registFinished">
	<div class="registFinished-top">
		<div class="title">
			<i class="success-icon"></i>
			<span>Registration Successful</span>
		</div>
	</div>

	<div class="registFinished-content">
		<div class="suc-banner" v-if="sucCfg">
			<p class="t-green t-big" v-if="sucCfg.amount > 0">{{showCurrency}}{{sucCfg.money}}</p>
			<p class="t-black t-mid">{{sucCfg.desc}}</p>
			<af-button class="detail-button" @click.prevent="goDpDetail" v-if="sucCfg.activityId">See Details</af-button>
		</div>
		<div class="back-container">
			<span><a :href="homeUrl" class="back-home">Back to Home</a><i class="m-arrow--right-icon"></i></span>
		</div>

		<div class="registFinished-bottom">
			<template v-if="hasCode">
				<p class="t-lable">Referral Code</p>
				<p class="t-value">{{referralCode}}</p>
			</template>
			<template v-else>
				<p class="m-label">Have a referral code?</p>
				<form>
					<div class="apply-container">
						<af-input
							placeholder="Referral Code (OPTIONAL)"
							class="apply-input"
							v-model='referralCode'
							icon="delete"
							:iconClick='clearReferralCode'>
						</af-input>
						<af-button
							class="apply-button"
							@click.prevent='applyCode'
							:loading="isLoading"
							:disabled="referralCode === ''">
						  <span>{{isLoading ? '' : 'Apply' }}</span>
						</af-button>
					</div>
				</form>
			</template>
		</div>
	</div>
	<!-- <div class="m-image-wrapper" v-if="ad && ad.imgUrl">
		<a :href="ad.linkUrl">
			<img :src="ad.imgUrl"/>
		</a>
	</div> -->
</div>
</template>

<script>
import { AfInput } from 'components/input/index';
import AfButton from 'packages/button/index';
import { formatNumber } from 'utils';
// import {
// 	applyCodeErr
// } from './errorMsg/registFinished';
import dialog from 'components/dialog';
import {
	getReferralCode,
	getCreativeId,
	getReferrerSource
} from 'utils/channel';
import { pagePath } from 'config/pageConfig';
import { activitiesUrl } from 'config/activity/activityConfig.js';
import cookie from 'storage/cookie';
import { showCurrency } from 'config/currencyConfig';

export default {
	name: 'registFinished',
	components: {
		AfInput,
		AfButton
	},
	data () {
		return {
			referralCode: getReferralCode(),
			isLoading: false,
			hasCode: false,
			// ad: {
			// 	imgUrl: '',
			// 	linkUrl: ''
			// },
			homeUrl: pagePath.home,
			sucCfg: null,
			showCurrency
		};
	},
	created () {
		// this.loadAd();
		this.getCfg();
		if (this.referralCode) {
			this.applyCode();
		}
	},
	methods: {
		applyCode () {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			fetch('/patron/account/inviteCode', {
				method: 'post',
				body: {
					inviteCode: this.referralCode,
					creativeId: getCreativeId(),
					source: getReferrerSource()
				}
			})
			.then(res => res.json())
			.then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					this.hasCode = true;
					cookie('referralCode', null, {
						path: '/'
					});
				} else {
				// let msg = applyCodeErr[res.bizCode] ? applyCodeErr[res.bizCode].text : 'Unknown error.';
					if (res.bizCode === 11670 || res.bizCode === 11671) { // 邀请码不可用或已使用也清除
						cookie('referralCode', null, {
							path: '/'
						});
					}
					const msg = res.message;
					dialog.alert(msg, ['OK']);
				}
			})
			.catch(res => {
				this.isLoading = false;
				dialog.alert('No internet connection, try again.', ['OK']);
			});
		},

		// loadAd() {
		// 	const t = new Headers();
		// 	t.append('Content-Type', 'application/json;charset=UTF-8');
		// 	const params = {
		// 		adSpots: [
		// 			{
		// 				spotId: 'registerBanner',
		// 				preserve: ''
		// 			}
		// 		]
		// 	};
		// 	fetch('/promotion/v1/sp/query', {
		// 		method: 'POST',
		// 		body: JSON.stringify(params),
		// 		headers: t
		// 	})
		// 	.then(res => res.json())
		// 	// 如果不传递就先不显示--暂时不做默认图标
		// 	.then(res => {
		// 		const code = res.bizCode;
		// 		const data = res.data;
		// 		if (code === 10000) {
		// 			if (data.adSpots && data.adSpots[0]) {
		// 				if (data.adSpots[0].ads) {
		// 					this.ad = data.adSpots[0].ads;
		// 				}
		// 			}
		// 		}
		// 	});
		// },
		getCfg() {
			fetch('/marketing/v1/activities/firstDeposit/registrationSuccInfo', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(res => {
				const { bizCode } = res;

				let temp;

				if (bizCode === 10000 && (temp = res.data) && temp.info) {   // eslint-disable-line
					this.sucCfg = {
						amount: temp.amount || 0,
						money: temp.amount && formatNumber(temp.amount, 0) || 0,
						desc: temp.info,
						activityId: temp.activityId
					};
				}
			}).catch(() => {});
		},

		clearReferralCode() {
			this.referralCode = '';
		},
		goDpDetail() {
			location.href = `${activitiesUrl.firstDp}?activityId=${this.sucCfg.activityId}`;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";
#registFinished {
  width:100%;
  padding: 0 0;
  position: relative;
  background: url(./img/sucBg.png) no-repeat;
  background-size: 100% 114/@rem;
  background-position: left top;

  .registFinished-top {
	width: 100%;
	padding: 24/@rem 0;
	box-sizing: border-box;
    .success-icon {
      .m-icon-success-bg();
	  margin-right: 10/@rem;

	  &:before {
		  color: @green;
		  font-size: 23/@rem;
		  line-height: 1;
	  }
    }
    .title {
      text-align: center;
      font-size: 14/@rem;
	  line-height: 23/@rem;
      font-weight: bold;
      color: @dark;
    }
  }

  .detail-button {
	margin-top: 11/@rem;
	width: 106/@rem;
	height: 36/@rem;
	border: none;
	font-size: 14/@rem;
	line-height: 1;
  }

  .m-input-wap{
	  padding-right:0
  }
  .m-input-wap-wrapper--active {
    border: 1px solid #0d9737;
  }
  .af-button--primary {
    background: #0d9737;
  }
  .registFinished-content {
    width: 100%;

	.t-green {
		color: @green;
	}
	.t-black {
		color: @darker;
	}
	.t-big {
		font-size: 20/@rem;
		line-height: 24/@rem;
		font-weight: 900;
	}
	.t-mid {
		font-size: 16/@rem;
		line-height: 20/@rem;
		font-weight: 900;
	}
    .t-lable {
	  line-height: 17/@rem;
  	  font-size: 12/@rem;
  	  color: @dark;
    }

	.t-value {
		height: 17/@rem;
		font-size: 16/@rem;
		font-weight: 500;
		margin-top: 6/@rem;
	}

	.suc-banner {
		text-align: center;
		padding: 10@rem 15/@rem 0;
		box-sizing: border-box;
	}
  }
  .back-container {
    margin-top: 24/@rem;
	color: @linkBlue;
	text-align: center;
	.m-arrow--right-icon {
	  .m-icon-arrow--right();
    }
    .back-home {
	  font-size: 14/@rem;
	  line-height: 1;
	  color: @linkBlue;
    }
  }

  .registFinished-bottom {
	  width: 84%;
	  border-top: 1px solid @fogGrayBorder;
	  margin: 51/@rem auto 0;
	  padding: 18/@rem 0 33/@rem;
	  box-sizing: border-box;

	  .m-label {
		line-height: 17/@rem;
		font-size: 12/@rem;
		color: @dark;
		margin-bottom: 3/@rem;
	  }

	  .apply-container {
	    display: flex;
	  }
	  .apply-button {
		height: 38/@rem;
		border: none;
		width: 74@rem;
		flex: 0 0 auto;
		font-size: 14/@rem;
	  }
	  .apply-input {
	    flex: 1 1 auto;
		height: 38/@rem;
		box-sizing: border-box;
		input {
		  height: 100%;
		  font-size: 14/@rem;
		  padding-top: 11/@rem;
		  padding-bottom: 11/@rem;
		}
	  }
  }

  // .m-image-wrapper {
  //   width: 100%;
  //   position: absolute;
  //   top: 390/@rem;
  //   a,
  //   a:hover,
  //   a:visited,
  //   a:active {
  //     text-decoration: none;
  //   }
  //   a {
  //     width: 100%;
  //     height: 100%;
  //     display: block;
  //     img {
  //       width: 100%;
  //       height: 100%;
  //     }
  //   }
  // }
}
</style>
