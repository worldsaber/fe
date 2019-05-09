<template>

<div>
	<div class="top" style="position:relative">
		<div class="top-up">
			<img src="./image/top-bg.png">
		</div>
		<div class="top-down">
			<img src="./image/down-bg.png">
		</div>
	</div>
	<div class="main">
		<div class="row sportybet">
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
					<a :href="loginStatus?home:login"><div>JOIN US</div></a>
				</div>
			</div>
		</div>
		<div class="row deposit">
			<div class="inner">
				<div class="pic"></div>
				<div style="display:inline-block;position: relative;top: -70px;">
					<p class="sub-title">WE HAVE</p>
					<p class="sup-title">FIRST DEPOSIT</p>
					<p class="detail"> Get up to {{showCurrency}}300 on your single First Deposit of {{showCurrency}}100! </p>
					<p class="detail"> 6 Cash Gifts over 7 days in a total of {{showCurrency}}300! </p>
					<a :href="loginStatus ? deposit : login"><div class="btn">DEPOSIT NOW</div></a>
				</div>
			</div>
		</div>
		<div class="row cashout">
			<div class="inner">
				<div style="display:inline-block">
					<p class="sub-title">WE HAVE</p>
					<p class="sup-title">PARTIAL CASHOUT</p>
					<p class="detail">
						Stake Higher than {{showCurrency}}400 on Singles or Multiples to PARTIAL CASHOUT!
					</p>
					<a :href="football"><div class="btn">BET NOW</div></a>
				</div>
				<div class="pic"></div>
			</div>
		</div>
		<div class="row bonus">
			<div class="inner">
				<div class="pic"></div>
				<div style="display:inline-block;position: relative;top: -70px;">
					<p class="sub-title">WE HAVE</p>
					<p class="sup-title">MULTIPLE BONUS</p>
					<p class="detail">
						135! We have EXCLUSIVE BONUS for {{country}}!
					</p>
					<p class="detail">
						Get your Multiples to the top with BONUS UP TO 135%!
					</p>
					<a :href="multiple"><div class="btn">LEARN MORE</div></a>
				</div>
			</div>
		</div>
		<!-- <div class="row gifts">
			<div class="inner">
				<div style="display:inline-block">
					<p class="sub-title">WE HAVE</p>
					<p class="sup-title">SPORTYBET GIFTS</p>
					<p class="detail">
						Gifts substitute part of Stakes and have NO TURNOVER CONDITIONS!
					</p>
					<p class="detail">
						GET YOUR FREE {{showCurrency}}20 NOW!
					</p>
					<a :href="gift"><div class="btn">CLAIM FREE GIFT</div></a>
				</div>
				<div class="pic"></div>
			</div>
		</div> -->
		<div class="row live-stream">
			<div class="inner">
				<div style="display:inline-block">
					<p class="sub-title">WE HAVE</p>
					<p class="sup-title">LIVE STREAM</p>
					<p class="detail">
						Watch ongoing games live! OR track your favorite games' statistics as the matches are ongoing!
					</p>
					<a :href="live"><div class="btn">CHECK NOW</div></a>
				</div>
				<div class="pic"></div>
			</div>
		</div>
		<div class="row virtual">
			<div class="inner">
				<div class="pic"></div>
				<div class="content">
					<p class="sub-title">WE HAVE</p>
					<p class="sup-title">VIRTUALS</p>
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
</template>

<script>
import { pagePath } from 'config/pageConfig';
import { userCenterConfig } from 'config/order/userCenterConfig';
import { activitiesUrl } from 'config/activity/activityConfig';
import { showCurrency } from 'config/currencyConfig';

export default {

	data () {
		return {
			loginStatus: window.loginStatus,
			showCurrency,
			home: pagePath.home,
			football: pagePath.preFootball,
			deposit: userCenterConfig.Deposit,
			gift: activitiesUrl.gift,
			login: pagePath.login,
			multiple: activitiesUrl.multiple,
			live: pagePath.live,
			virtual: pagePath.virtual,
			download: pagePath.download,
			country: 'Nigerians'
		};
	},
};
</script>

<style lang="less">
body {
  font-family: AvenirNext, Arial, sans-serif;
}
a:hover{
	text-decoration: none;
}
.top {
  margin: 0 auto;
  .top-up {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
  }
  .top-down {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
  }
}
.main {
  color: #343a45;
  .row:nth-child(even) {
    background: #f4f4f4;
  }
  .pic {
    display: inline-block;
  }
  .sportybet {
    padding: 0 0 29px;
  }

  .row {
    .inner {
      width: 830px;
      margin: 0 auto;
      .title {
        margin-bottom: 46px;
        font-size: 50.3px;
        font-weight: 900;
        line-height: 1.06;
        letter-spacing: -1.3px;
      }
      .details {
        display: inline-block;
        .detail {
          width: 347px;
          height: 86px;
          margin-bottom: 21px;
          font-size: 18px;
          line-height: 1.34;
          text-align: left;
        }
      }
      .btn-area {
        display: inline-block;
        width: 315px;
        margin-left: 81px;
        position: relative;
        top: -90px;
        p {
          margin: 0 auto;
          padding-bottom: 11px;
          font-size: 20.2px;
          font-weight: 900;
          line-height: 1.19;
          letter-spacing: -0.5px;
        }
        div {
          width: 234px;
          height: 57px;
          margin: 0 auto;
          border-radius: 27.8px;
          background-image: linear-gradient(to right, #16b219, #1ace1d);
          font-size: 24px;
          font-weight: bold;
          line-height: 57px;
          text-align: center;
          color: #fff;
        }
      }
      .sub-title {
        margin-bottom: 8px;
        font-size: 36.3px;
        font-weight: 900;
        line-height: 0.84;
        text-align: left;
      }
      .sup-title {
        margin-bottom: 23px;
        font-size: 56.7px;
        font-weight: 900;
        line-height: 0.84;
        text-align: left;
      }
      .detail {
        width: 450px;
        margin-bottom: 5px;
        font-size: 16px;
        line-height: 1.34;
        text-align: left;
      }
      .btn {
        width: 234px;
        height: 57px;
        margin-top: 20px;
        border-radius: 27.8px;
        background-image: linear-gradient(to right, #16b219, #1ace1d);
        font-size: 18.5px;
        line-height: 57px;
        text-align: center;
        color: #fff;
      }
    }
  }
  .deposit {
    padding: 44px 0 0;
    .pic {
      width: 267px;
      height: 344px;
      background: url(./image/deposit.png) no-repeat;
      background-size: 100% 100%;
      margin-right: 102px;
    }
  }
  .cashout {
    padding: 87px 0 0;
    .pic {
      width: 427px;
      height: 326px;
      background: url(./image/cashout.png) no-repeat;
      background-size: 100% 100%;
      margin-top: -180px;
      margin-left: 348px;
	}
	.inner .detail{
		width: 420px;
	}
  }
  .bonus {
    padding: 44px 0 0;
    .pic {
      width: 256px;
      height: 362px;
      background: url(./image/bonus.png) no-repeat;
      background-size: 100% 100%;
      margin-right: 49px;
    }
  }
  .gifts {
    padding: 65px 0 27px;
    .pic {
      width: 464px;
      height: 268px;
      background: url(./image/gifts.png) no-repeat;
      background-size: 100% 100%;
      margin-top: -180px;
      margin-left: 348px;
    }
  }
  .live-stream{
	padding: 90px 0 40px;
	.pic {
      width: 441px;
      height: 273px;
      background: url(./image/live-stream.png) no-repeat;
      background-size: 100% 100%;
      margin-top: -220px;
      margin-left: 400px;
    }
  }
  .virtual{
	  padding: 20px 0 0;
	  .pic {
		width: 251px;
		height: 399px;
		background: url(./image/virtual.png) no-repeat;
		background-size: 100% 100%;
		margin-right: 102px;
	}
	.content{
		display: inline-block;
		position: relative;
		top: -90px;
	}
  }
  .download-app {
    margin: 30px auto 0;
    position: relative;
    width: 700px;
    height: 130px;
    background: url(./image/download_app@2x.jpg);
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
}
</style>
