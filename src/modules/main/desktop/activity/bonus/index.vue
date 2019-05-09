<template>
	<div style="position: relative;">
		<div class="top" :class="country==='ke'?'top_ke':'top_ng'" :style="bannerStyle">
			<div class="top-wrapper">
				<div class="logo">
					<a href="/"><img :src="require('./image/logo.png')" alt=""></a>
				</div>
			</div>
		</div>
		<div class="main-body">
			<p class="how-to-title">How To</p>
			<div class="how-to">
				<div class="step">
					<div class="index">STEP 1</div>
					<div class="detail-A">{{step1}}</div>
				</div>
				<div class="dot">...</div>
				<div class="step">
					<div class="index">STEP 2</div>
					<div class="detail-B" style="position: absolute;left: 284px;top: 27px;">{{step2}}</div>
				</div>
				<div class="examples">
					<div class="example">
						<div class="example-title">
							<div class="pic right"></div>
							<p>CORRECT Example:</p>
						</div>
						<p> a) {{correctExample}}</p>
					</div>
					<div class="example" style="position: relative;left:18px;">
						<div class="example-title">
							<div class="pic wrong"></div>
							<p>INCORRECT Example:</p>
						</div>
						<p>b) {{wrongExample}}</p> </div>
				</div>
				<div class="btn-wrap"><button class="betting-btn" @click="bettingHandler()">Bet Now</button></div>

			</div>
			<div class="terms-conds">
				<div class="terms-conds-title">Terms and Conditions:</div>
				<div v-for="(item,key) in termsAndConds" :key="key" class="term-text">{{item}}</div>
			</div>
			<div class="download-app">
				<a :href="download"></a>
			</div>

		</div>
	</div>
</template>
<script>
import dialog from 'components/dialog';
import 'packages/button';
import { pagePath } from 'config/pageConfig';
import getBonusConfig from 'activity/bonus/config';
import { getActivityConfig } from 'activity/util.js';

const bannerUrl = require('./image/top-bg.jpg');

const configs = getBonusConfig({
	bannerUrl
});

export default {
	data () {
		return {
			step1: configs.step1,
			step2: configs.step2,
			correctExample: configs.correctExample,
			wrongExample: configs.wrongExample,
			termsAndConds: configs.termsAndConds,
			betPath: configs.betPath,
			bannerUrl: configs.bannerUrl,
			country: window.country,
			activityId: 0,
			activityStatus: 0,
			download: pagePath.download,
			currency: window.currency || 'KES',
		};
	},
	created () {
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
			this.getQualifyStatus();
		}
		getActivityConfig('weekend_bonus')
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
		bettingHandler () {
			if (this.activityStatus === 90) {
				this.openDialog(
					'Notice',
					'This promotion is over, remember to come earlier next time!'
				);
			} else {
				location.href = this.betPath;
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
						this.activityStatus = ret.data.status;
					}
				});
		}
	}
};
</script>
<style lang="less">
@import "~base/style/variable.less";
@import "~base/style/icon.less";
.tab {
  margin-left: 15px;
  font-weight: bold;
}
.how-to-title {
  margin-top: 87px;
  text-align: center;
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: bold;
  line-height: 1.07;
  color: #048856;
}
.how-to {
  border-radius: 10px;
  background-color: rgba(70, 196, 134, 0.05);
  padding-right: 18px;
  .step {
    padding: 30px 0 16px 168px;
    position: relative;
    .index {
      display: inline-block;
      width: 112px;
      height: 37px;
      border-radius: 18.5px;
      background-color: #048856;
      font-size: 20px;
      font-weight: bold;
      line-height: 37px;
      text-align: center;
      color: #fff;
    }
    .detail-A {
    //   display: inline-block;
      margin-left: 145px;
      margin-top: -30px;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      text-align: left;
      color: #048856;
	}
	 .detail-B {
    //   display: inline-block;
      margin-left: 29px;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.38;
      text-align: left;
      color: #048856;
    }
  }
  .dot {
    width: 25px;
    margin-left: 215px;
    color: #028753;
    font-size: 50px;
    font-weight: bolder;
    word-break: break-word;
    line-height: 0.25;
  }
  .examples {
    padding: 0 54px 30px 54px;
    margin-top: 45px;
    .example {
      position: relative;
      width: 322px;
      height: 175px;
      display: table-cell;
      border-radius: 2px;
      background-color: #fff;
      p {
        margin: 17px 33px 16px 49px;
      }
      .pic {
        position: absolute;
        top: 28px;
        left: 15px;
        width: 25px;
        height: 25px;
      }
      .right {
        background: url(./image/right.png) no-repeat;
        background-size: 100% 100%;
      }
      .wrong {
        background: url(./image/wrong.png) no-repeat;
        background-size: 100% 100%;
      }
      .example-title {
        font-size: 16px;
        font-weight: bold;
        line-height: 1;
        text-align: left;
        color: #353a45;
        p {
          padding-top: 17px;
        }
      }
    }
  }
}

.m-top-wrapper {
  display: none;
}
body {
  font-family: AvenirNext, Arial, sans-serif;
}
.top_ke {
  background-repeat: no-repeat;
  background-position: center;
}
.top_ng {
  background-repeat: no-repeat;
  background-position: center;
}
.btn-wrap {
	width:100%;
	text-align:center;
	margin-top: 24px;
	padding-bottom: 50px;
}
.btn-style {
  width: 301px;
  height: 71px;
  border-radius: 0;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: white;
}
.top-wrapper {
  margin: 0 auto;
  height: 550px;
  width: 1000px;
  position: relative;
}

.logo {
  position: absolute;
  top: 26px;
  left: 0;
  img {
    width: 226px;
    height: 44px;
  }
}
.main-body {
  width: 735px;
  margin: 0 auto;
}
.betting {
  width: 476px;
  height: 55px;
  margin: 53px 0 0 147px;
  & > div {
    float: left;
    width: 270px;
    height: 40px;
    padding: 15px 23px 0 0;
    span {
      display: inline-block;
      width: 270px;
      height: 38px;
      font-size: 14px;
      font-weight: 500;
      color: #161616;
    }
    &:after {
      content: "\0020";
      display: block;
      height: 0;
      clear: both;
    }
  }
}
  button {
    width: 286px;
    height: 66px;
    color: #fff;
    font-size: 36px;
    font-weight: bold;
    background-color: #0d9737;
    border: 0;
    border-radius: 4px;
    outline: 0;
    cursor: pointer;
    &:hover {
      background-color: @midGreen;
      border-color: @midGreen;
    }
  }
.terms-conds {
  //   width: 460px;
  margin: 92px 0 47px;
  font-size: 14px;
  line-height: 1.57;
  font-weight: 500;
  color: #353a45;
  .terms-conds-title {
    margin-bottom: 24px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
  }
  .term-text{
	margin: 5px 0;
	white-space: pre-wrap;
  }
  .seq-num {
    display: inline-block;
	font-weight: 800;
  }
}
.download-app {
  margin: 0 auto;
  position: relative;
  width: 700px;
  height: 130px;
  background: url(./image/download_app.jpg) no-repeat;
  background-size: 100% 130px;
  padding: 20px 0 125px;
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
      right: 12px;
      cursor: pointer;
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
      cursor: pointer;

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
