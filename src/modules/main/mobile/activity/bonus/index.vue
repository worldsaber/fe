<template>
	<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
			<div style="overflow: hidden;">
				<div :class="country==='ke'?'top_ke':'top_ng'" class="top" :style="bannerStyle">
					<div class="top-wrapper">
						<div class="logo">
							<a href="/"><img :src="require('./image/logo.png')" alt=""></a>
						</div>
						<div class="btn-container"></div>
					</div>
				</div>
				<div class="main-body">
					<div class="requirement">
						<div class="qualification-requirement">
							Promotion Information
						</div>
						<div class="requirement-item" v-for="(val,i) in requirements" :key="i">
							<div class="sequence_num">{{i+1}}</div>
							<div class="requirement-item-col">
								<div class="requirement-item-title">{{val.title}}</div>
								<div class="requirement-item-desc">{{val.desc}}</div>
							</div>
						</div>
						<div class="betting">
							<button class="betting-btn" @click="bettingHandler()">Bet Now</button>
						</div>
					</div>
					<div class="how-to">
						<p class="how-to-title">How To</p>
						<div class="inner first">
							<div class="piece">
								<div class="inner-title">STEP 1</div>
								<div class="inner-detail">{{step1}}</div>
							</div>
							<div class="piece">
								<div class="inner-title">STEP 2</div>
								<div class="inner-detail">{{step2}}</div>
							</div>
						</div>
						<div class="inner second">
							<div class="piece">
								<div class="inner-title">CORRECT Example:</div><img class="right" src="./image/right.png">
								<div class="inner-detail">a) {{correctExample}}</div>
							</div>
							<div class="piece">
								<div class="inner-title">INCORRECT Example:</div><img class="wrong" src="./image/wrong.png">
								<div class="inner-detail bt">b) {{wrongExample}}</div>
								</div>
							</div>
							</div>
					</div>
					<div class="terms-conds">
						<div class="terms-conds-title">Terms and Conditions:</div>
						<div v-for="(item,i) in termsAndConds" :key="i" class="term-text"> {{ item }} </div>
					</div>
					<div class="download-app">
						<a :href="downloadApp"></a>
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
import getBonusConfig from 'activity/bonus/config';
import { getActivityConfig } from 'activity/util.js';

const bannerUrl = require('./image/top_bg.jpg');

const configs = getBonusConfig({
	bannerUrl
});

export default {
	components: {
		Layout
	},
	data () {
		return {
			step1: configs.step1,
			step2: configs.step2,
			correctExample: configs.correctExample,
			wrongExample: configs.wrongExample,
			termsAndConds: configs.termsAndConds,
			requirements: configs.requirements,
			betPath: configs.betPath,
			appPath: configs.appPath,
			bannerUrl: configs.bannerUrl,
			country: window.country,
			activityId: 0,
			activityStatus: 0,
			currency: window.currency || 'KES',
			downloadApp: pagePath.downloadApp,
		};
	},
	created () {
		this.pageLoading(false);
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
			this.getQualifyStatus().then(() => { });
		}
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
				// img
				// url
				// title
				// desc
				appCore.share({
					title: 'share',
					url: window.location.href
				});
				appCore.shareNow();
			}, false);
		}
		getActivityConfig('weekend_bonus', 'wap')
		.then(value => {
			if (!value) {
				return;
			}
			const config = getBonusConfig(value);
			Object.assign(this.$data, config);
		});
	},
	computed: {
		bannerStyle() {
			return {
				backgroundImage: `url(${this.bannerUrl})`
			};
		}
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		bettingHandler () {
			if (this.activityStatus === 90) {
				this.openDialog(
					'Notice',
					'<div>This promotion is over,</div><div>remember to come earlier next </div><div>time!</div>'
				);
			} else {
				if (window.AppCore.getAppName() === 'sportybet') {
 					return window.AppCore.sendCmd(this.appPath);
				}
				location.href = this.betPath;
			}
		},
		getQualifyStatus () {
			return fetch(`/marketing/v1/activities/${this.activityId}`, {
				method: 'GET'
			})
				.then(res => res.json())
				.then(ret => {
					if (ret.bizCode === 10000) {
						this.activityStatus = ret.data.status;
					}
				});
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
		}
	},
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
.tab {
	margin-left: 15/@rem;
}
.how-to {
	padding: 0 24/@rem;
}
.how-to-title {
	margin: 30/@rem 0 5/@rem 24/@rem;
	font-size: 20/@rem;
  font-weight: bold;
  line-height: 1.6;
  text-align: left;
  color: #048856;
}
.inner {
	margin: 0 auto;
  padding: 32/@rem 24/@rem 25/@rem;
  border-radius: 10/@rem;
  background-color: #f5fcf9;
  text-align: left;
  .inner-title {
	  font-size: 17/@rem;
  font-weight: bold;
  line-height: 0.94;
  color: #048856;
  }
  .inner-detail {
	  font-size: 12/@rem;
  line-height: 1.5;
  color: #353a45;
  }
}
.first {
	margin-bottom: 6/@rem;
	.piece {
		padding-bottom: 14/@rem;
	}
}
.second {
	margin-bottom: 38/@rem;
	.piece {
		.inner-title {
			display:inline-block;
		}
		padding-bottom: 30/@rem;
		.right {
			width: 40/@rem;
			position:relative;
			left: 28/@rem;
		}
		.wrong{
			width: 32/@rem;
			position:relative;
			left: 15/@rem;
		}
		.bt {
				margin-bottom: -20/@rem;
			}
	}
}
.m-page-loading-wrap {
  display: none;
}
.m-top-wrapper {
  display: none;
}
body {
  font-family: AvenirNext, Arial, sans-serif;
}
.top {
  width: 100%;
  height: 400/@rem;
}
.btn-container {
  position: relative;
  text-align: center;
  top: 340/@rem;
}
.btn-style {
  width: 230/@rem;
  height: 48/@rem;
  font-size: 17/@rem;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: #ff0350;
  border-bottom: 6/@rem solid #b71144;
  &:hover {
    border: 0;
    border-bottom: 6/@rem solid #b71144;
  }
}
.top_ke {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.top_ng {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.top .top-wrapper .btn-claim-top {
  .btn-style;

  width: 195/@rem;
  height: 51/@rem;
  margin-top: 10/@rem;
  border: none;
  border-radius: 25.5/@rem;
  background-image: linear-gradient(to bottom, #ff0450, #e80047);
  box-shadow: 0 6/@rem 7/@rem 0 rgba(0, 0, 0, 0.27);
  font-family: AvenirNext;
  font-size: 14/@rem;
  font-weight: bold;
}
.arrow {
  position: absolute;
  top: 25/@rem;
  left: 30/@rem;
  img {
    width: 25/@rem;
    height: 37/@rem;
  }
}
.ad-text {
  height: 29/@rem;
  font-family: AvenirNext;
  font-size: 13/@rem;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.08;
  letter-spacing: normal;
  text-align: center;
  color: #c3003b;
}
.ad-text-bottom {
  margin: 6/@rem auto 23/@rem;
  width: 272/@rem;
  font-size: 16/@rem;
  font-weight: bold;
  color: #b71144;
}
.logo {
  position: absolute;
  top: 11/@rem;
  left: 22/@rem;
  img {
    width: 100/@rem;
    height: 20/@rem;
  }
}
.slogan {
  position: absolute;
  top: 42/@rem;
  left: 21/@rem;
  width: 184/@rem;
  height: 201/@rem;
  img {
    width: 184/@rem;
    height: 201/@rem;
  }
}
.main-body {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  .btn-claim-bottom {
    .btn-style;
  }
}
.line {
  border-top: solid 2/@rem #f2f3f5;
}
.requirement {
  width: 274/@rem;
  margin: 0 auto;
  .qualification-requirement {
    margin: 19/@rem auto 12/@rem;
    width: 257/@rem;
    height: 27/@rem;
    font-size: 20/@rem;
    font-weight: bold;
    text-align: center;
    color: #0d9737;
  }
  .requirement-item {
    .line;
    text-align: left;
    .sequence_num {
      box-sizing: border-box;
      display: inline-block;
      width: 29/@rem;
      height: 29/@rem;
      padding-left: 6/@rem;
      background: url(./image/triangle@2x.png) no-repeat;
      background-size: 29/@rem 29/@rem;
      font-size: 14/@rem;
      font-weight: bold;
      color: white;
      vertical-align: top;
    }
    .requirement-item-col {
      box-sizing: border-box;
      width: 224/@rem;
      margin-left: 15/@rem;
      padding: 5/@rem 0 9/@rem;
      display: inline-block;
      .requirement-item-title {
        height: 23/@rem;
        font-size: 17/@rem;
        font-weight: bold;
        color: #0d9737;
      }
      .requirement-item-desc {
        font-size: 12/@rem;
        font-weight: 500;
		color: #353a45;
		width: 165px;
      }
    }
  }
}
.customer-num-info {
  position: absolute;
  top: 256/@rem;
  left: 22/@rem;
  width: 126/@rem;
  height: 53/@rem;
  & > img {
    width: 126/@rem;
    height: 53/@rem;
  }
  .customer-num {
    position: absolute;
    top: -4/@rem;
    left: 29/@rem;
    font-weight: bold;
    color: white;
    display: inline-block;
    font-family: Impact;
    font-size: 26/@rem;
    height: 31/@rem;
    line-height: 31/@rem;
  }
}
.betting {
  box-sizing: border-box;
  width: 100%;
  height: 117/@rem;
  line-height: 117/@rem;
  background-color: #f9f9f9;
//   padding: 16/@rem 0 33/@rem;
  text-align: center;
  .betting-desc {
    margin: 0 auto;
    width: 233/@rem;
    height: 36/@rem;
    font-size: 12/@rem;
    font-weight: 500;
    line-height: 1.5;
    color: #353a45;
    margin-bottom: 21/@rem;
  }
}
 button {
    margin: 0 auto;
    width: 230/@rem;
    height: 48/@rem;
    color: #fff;
    font-size: 16/@rem;
    font-weight: bold;
    background-color: #0d9737;
    border: 0;
    border-radius: 2/@rem;
    outline: 0;
    &:hover {
      color: #d6dadd;
    }
  }
.terms-conds {
  width: 274/@rem;
  margin: 27/@rem 23/@rem 38/@rem 23/@rem;
  font-size: 12/@rem;
  font-weight: 500;
  color: #353a45;
  text-align: left;
  .terms-conds-title {
    margin-bottom: 22/@rem;
    font-size: 12/@rem;
    font-weight: bold;
    line-height: 1;
  }
  .term-text{
	white-space: pre-wrap;
  }
  .seq-num {
    display: inline-block;
    font-weight: bold;
  }
}
.download-app {
  margin: 23/@rem auto 0;
  position: relative;
  width: 300/@rem;
  height: 66/@rem;
  background: url(./image/download_app.jpg) no-repeat;
  background-size: 100% 66/@rem;
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
    width: 205.5/@rem;
    height: 72/@rem;
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
