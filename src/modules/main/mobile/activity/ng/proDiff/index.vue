<template>
	<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
			<div style="overflow: hidden;">
				<div class="top">
					<img src="./image/bg.png" alt="">
				</div>
				<div class="main">
					<div class="row">
						<div class="inner">
							<p class="title">US SPORTYBET</p>
							<div class="details">
								<p class="detail">
								Are committed to provide the best betting
								experience possible while giving everyone
								the same opportunity to become a
								millionaire!
								</p>
								<p class="detail">
									Are committed to offer well-designed features
									and promotions while always keeping in mind
									our most valued customers' interest.
								</p>
							</div>
							<div class="btn-area">
								<p>WHAT ARE YOU WAITING FOR?</p>
								<a :href="loginStatus?home:login"><div class="btn">JOIN US</div></a>
							</div>
						</div>
					</div>
					<div class="row deposit">
						<div class="inner">
							<p class="sub-title">WE HAVE</p>
							<p class="sup-title">FIRST DEPOSIT</p>
							<div class="pic"></div>
							<p class="detail">
								Get up to {{showCurrency}}300 on your single First Deposit of {{showCurrency}}100! 6 Cash Gifts over 7 days in a total of {{showCurrency}}300!
							</p>
							<a :href="loginStatus?deposit:login"><div class="btn">DEPOSIT NOW</div></a>
						</div>
					</div>
					<div class="row cashout">
						<div class="inner">
							<p class="sub-title">WE HAVE</p>
							<p class="sup-title">PARTIAL CASHOUT</p>
							<div class="pic"></div>
							<p class="detail">
								Stake Higher than {{showCurrency}}400 on Singles or Multiples to PARTIAL CASHOUT!
							</p>
							<a :href="football"><div class="btn">BET NOW</div></a>
						</div>
					</div>
					<div class="row bonus">
						<div class="inner">
							<p class="sub-title">WE HAVE</p>
							<p class="sup-title">MULTIPLE BONUS</p>
							<div class="pic"></div>
							<p class="detail">
								135! We have EXCLUSIVE BONUS for {{country}}! Get your Multiples to the top with BONUS UP TO 135%!
							</p>
							<a :href="multiple"><div class="btn">LEARN MORE</div></a>
						</div>
					</div>
					<div class="row live-stream">
						<div class="inner">
							<p class="sub-title">WE HAVE</p>
							<p class="sup-title">LIVE STREAM</p>
							<div class="pic"></div>
							<p class="detail">
								Watch ongoing games live! OR track your favorite games' statistics as the matches are ongoing!
							</p>
							<a :href="live"><div class="btn">CHECK NOW</div></a>
						</div>
					</div>
					<div class="row virtual">
						<div class="inner">
							<p class="sub-title">WE HAVE</p>
							<p class="sup-title">VIRTUALS</p>
							<div class="pic"></div>
							<p class="detail">
								Play our virtual games! If you want to have a try at something new, this is the right place to be!
							</p>
							<a :href="virtual"><div class="btn">CHECK NOW</div></a>
						</div>
					</div>
				</div>
				<div class="download-app">
					<a :href="download"></a>
				</div>
			</div>
		</div>
	</Layout>
</template>
<script>
import Layout from 'components/layout/main.vue';
import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { activitiesUrl } from 'config/activity/activityConfig';
import { showCurrency } from 'config/currencyConfig';
import { appPath } from 'config/appPagePath';

export default {
	components: {
		Layout,
	},
	data () {
		return {
			loginStatus: window.loginStatus,
			showCurrency,
			home: pagePath.home,
			football: pagePath.preFootball,
			deposit: window.AppCore.getAppName() === 'sportybet' ? window.AppCore.sendCmd(appPath.deposit) : userCenterUrl.deposit,
			gift: activitiesUrl.gift,
			login: pagePath.login,
			multiple: activitiesUrl.multiple,
			download: pagePath.downloadApp,
			live: pagePath.liveHome,
			virtual: pagePath.virtual,
			country: 'Nigerians'
		};
	},
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.m-page-loading-wrap,
.m-top-wrapper {
  display: none;
}
.btn {
  margin: 0 auto;
  width: 155/@rem;
  height: 37/@rem;
  margin-top: 24/@rem;
  margin-bottom: 25/@rem;
  border-radius: 27.8/@rem;
  background-image: linear-gradient(to right, #16b219, #1ace1d);
  font-size: 13/@rem;
  font-weight: bold;
  line-height: 37/@rem;
  text-align: center;
  color: #fff;
}
.top {
  width: 100%;
  img {
    width: 100%;
  }
}
.main {
  a:hover {
    text-decoration: none;
  }
  color: #343a45;
  .row:nth-child(even) {
    background: #f4f4f4;
  }
  .sportybet {
    padding-top: 6/@rem;
  }
  .deposit {
    padding-top: 24/@rem;
    padding-bottom: 1px;
    .pic {
      width: 125/@rem;
      height: 163/@rem;
      background: url(./image/deposit.png) no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
      margin-bottom: 20/@rem;
    }
  }
  .cashout {
    padding-top: 37/@rem;
    padding-bottom: 1px;
    .pic {
      background: url(./image/cashout.png) no-repeat;
      width: 201/@rem;
      height: 160/@rem;
      background-size: 100% 100%;
      margin: 0 auto;
      margin-bottom: 30/@rem;
    }
  }
  .bonus {
    padding-top: 35/@rem;
    padding-bottom: 1px;
    .pic {
      background: url(./image/bonus.png) no-repeat;
      width: 123/@rem;
      height: 174/@rem;
      background-size: 100% 100%;
      margin: 0 auto;
      margin-bottom: 25/@rem;
    }
  }
  .gifts {
    padding-top: 40/@rem;
    padding-bottom: 1px;
    .pic {
      background: url(./image/gifts.png) no-repeat;
      width: 206/@rem;
      height: 120/@rem;
      background-size: 100% 100%;
      margin: 0 auto;
      margin-bottom: 30/@rem;
    }
  }
  .live-stream{
	padding-top: 40/@rem;
	padding-bottom: 1px;
	.inner{
		padding: 0;
		text-align: center;
	}
    .pic {
      background: url(./image/live-stream.png) no-repeat;
      width: 266/@rem;
	  height: 164/@rem;
	  margin: 0 auto;
	  background-size: 100% 100%;
	  background-position: center center;
	}
	.detail{
		padding: 10/@rem 19/@rem 0 31/@rem;
	}
  }
	.virtual{
		padding-top: 40/@rem;
		padding-bottom: 1px;
		.pic {
			background: url(./image/virtual.png) no-repeat;
			height: 266/@rem;
			width: 164/@rem;
			background-size: 100% 100%;
			margin: 0 auto;
		}
	}
  }
  .row {
    .inner {
      padding-left: 31/@rem;
      padding-right: 29/@rem;
      .title {
        margin-bottom: 15/@rem;
        font-size: 26/@rem;
        font-weight: 900;
        line-height: 1.06;
        letter-spacing: -1.3/@rem;
        text-align: center;
      }
      .details {
        display: inline-block;
        .detail {
          margin-bottom: 17/@rem;
          font-size: 13/@rem;
          line-height: 1.34;
          text-align: left;
        }
      }
      .btn-area {
        margin-top: 18/@rem;
        p {
          font-size: 14/@rem;
          font-weight: 900;
          line-height: 1.19;
          letter-spacing: -0.5/@rem;
          text-align: center;
        }
        .btn {
          margin-top: 12/@rem;
        }
      }
      .sub-title {
        margin-bottom: 8/@rem;
        font-size: 14/@rem;
        font-weight: 900;
        line-height: 0.84;
        text-align: center;
      }
      .sup-title {
        margin-bottom: 32/@rem;
        font-size: 24/@rem;
        font-weight: 900;
        line-height: 0.84;
        text-align: center;
      }
      .detail {
        margin-bottom: 5/@rem;
        font-size: 13/@rem;
        line-height: 1.34;
        text-align: left;
      }
    }
  }

.download-app {
  position: relative;
  margin: 20/@rem auto 0;
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
