<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
			<div style="overflow: hidden;">
	  <img src="./image/bg.png" class="bg">
	  <a :href="home"><img src="./image/logo.svg" class="logo"></a>
	  <div class="main">
		  <div class="period">
			  <div class="up">
				  <span class="calendar"></span>
				  <span class="date">07/04/2018</span>
			  </div>
			  <div class="down">
				  <span class="words">Promotion Period</span>
				  <span class="date">08/04/2018</span>
			  </div>
		  </div>
		  <img src="./image/girdle.png" class="girdle">
		  <div class="table">
			  <div class="row" v-for="item in items" :key="item">
				  <span class="row-left" >{{item[0]}}</span>
				  <span class="row-middle arrow"></span>
				  <span class="row-right">{{item[1]}}</span>
			  </div>
		  </div>
		  <p class="example">This is not a cumulative promotion and only 1 Cash Gift will be distributed in accordance to the Net Loss and the interval in which it fits.</p>
			<img src="./image/formula.png" class="formula"/>
			<div class="examples">
				<p><span class="smile"></span>Customer A has Stakes of a total of {{showCurrency}}1,550 and used a Discount Gift of {{showCurrency}}25 when placing his bets. After his bets were settled, Customer A won a total of {{showCurrency}}300 and had a Net Loss of {{showCurrency}}1,225. Thus, Customer A is eligible to receive a {{showCurrency}}150 Cash Gift.</p>
				<p><span class="upset"></span>Customer B has placed and settled bets of {{showCurrency}}2,500 settled before the promotion period, customer B cannot obtain any Cash Gift from this promotion.</p>
			</div>
			<div class="down-btn" @click="getQualifyStatus">BET NOW</div>
			<div class="rules">
				<div class="rule" v-for="(item,index) in rules" :key="item">
					<span class="index">{{index+1}}</span>
					<span class="detail" :class="[index!=0&&index!==2?'long':'']">{{item}}</span>
			</div>
		  </div>
		  <div class="download-app">
				<a :href="download"></a>
			</div>
	  </div>
			</div>
  </div>
  </Layout>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import Layout from 'components/layout/main.vue';
import { showCurrency } from 'config/currencyConfig';
import { appPath } from 'config/appPagePath';

export default {
	data () {
		return {
			rules: [],
			items: [],
			download: pagePath.downloadApp,
			home: pagePath.home,
			preFootball: pagePath.preFootball,
			showCurrency
		};
	},
	components: {
		Layout,
	},
	created () {
		this.rules = [
			'Only Multiple bets placed in "Sports" and "Live" betting with odds 1.5 or higher; placed and settled during the promotion period will be valid for the promotion.',
			'If a bet is cashed out, it will not be valid for the promotion. If a bet is partially cashed out, only the final remaining amount of the bet will be valid and calculated for the promotion.',
			'Gifts will be deducted when calculating the Net Loss of customers.',
			'In a situation that the final amount to be calculated has decimals included, it will be rounded and then summed up in accordance to the Terms and Conditions of this promotion.',
			'Cash Gifts will be distributed after the promotion is over within 3-4 working days. Only 1 Cash Gift will be distributed per Customer in accordance to the Terms and Conditions listed above.',
			'Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts. SportyBet reserves itself the rights to amend, cancel, reclaim or refuse any promotion at its  own discretion.',
		];
		this.items = [
			[`${this.showCurrency}500-999`, `Cash Gift of ${this.showCurrency}50`],
			[`${this.showCurrency}1,000-1,499`, `Cash Gift of ${this.showCurrency}150`],
			[`${this.showCurrency}1,500-1,999`, `Cash Gift of ${this.showCurrency}250`],
			[`${this.showCurrency}2,000 & Over`, `Cash Gift of ${this.showCurrency}350`]
		];
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
		}
	},
	methods: {
		getQualifyStatus () {
			const activityId = URL.getPara('activityId');
			if (activityId) {
				return fetch(`/marketing/v1/activities/${activityId}`, {
					method: 'GET'
				})
					.then(res => res.json())
					.then(ret => {
						if (ret.bizCode === 10000) {
							if (ret.data.status !== 30) {
								this.$toast('This promotion is over, remember to come back earlier next time!');
							} else {
								if (window.AppCore.getAppName() === 'sportybet') {
									window.AppCore.sendCmd(appPath.events);
								}
								window.setTimeout(() => {
									window.location.href = this.preFootball;
								}, 300);
							}
						} else {
							this.$toast('Sorry，something went wrong. Please try again later.');
						}
					})
					.catch(e => {
						this.$toast('Sorry，something went wrong. Please try again later.');
					});
			}
			return fetch('/marketing/v1/activities/getByKind?kind=3', {
				method: 'GET'
			})
				.then(res => res.json())
				.then(ret => {
					if (ret.bizCode === 10000) {
						if (ret.data.status !== 30) {
							this.$toast('This promotion is over, remember to come back earlier next time!');
						} else {
							if (window.AppCore.getAppName() === 'sportybet') {
								window.AppCore.sendCmd(appPath.events);
							}
							window.setTimeout(() => {
								window.location.href = this.preFootball;
							}, 300);
						}
					} else {
						this.$toast('Sorry，something went wrong. Please try again later.');
					}
				})
				.catch(e => {
					this.$toast('Sorry，something went wrong. Please try again later.');
				});
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.m-page-loading-wrap {
  display: none;
}
.m-top-wrapper {
  display: none;
}
.bg {
  width: 100%;
}
.logo {
  width: 120/@rem;
  height: 42/@rem;
  position: absolute;
  top: 10/@rem;
  left: 10/@rem;
}
.main {
  width: 100%;
  padding: 0 28/@rem;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  color: #353a45;
  .period {
    margin-top: 20/@rem;
    margin-bottom: 25/@rem;
    .calendar {
      .m-icon-calendar();
      &::before {
        color: #096b27;
        font-size: 18/@rem;
        padding-right: 5/@rem;
      }
    }
    .up {
      margin-left: -73px;
    }
    .date {
      font-size: 16/@rem;
      font-weight: bold;
      font-style: italic;
      letter-spacing: -1/@rem;
    }
    .words {
      opacity: 0.2;
      font-size: 10/@rem;
      font-weight: 500;
      text-align: left;
      color: #000;
    }
  }
  .girdle {
    width: 100%;
    margin-bottom: 22/@rem;
  }
  .table {
    display: table;
    width: 100%;
    margin-bottom: 25/@rem;
    .row {
      text-align: left;
	  display: flex;
	  align-items: center;
	  justify-content: center;
      span {
		display: block;
        opacity: 0.8;
        font-size: 10.8/@rem;
        font-weight: 500;
        line-height: 1.67;
	  }
	  .row-left{
		  flex: 1;
		  text-align: right;
	  }
	  .row-right {
		  flex: 1;
	  }
	  .row-middle{
		  flex-basis: 40/@rem;
		  width: 40/@rem;
		  margin: 0 10/@rem;
		  height: 18/@rem;
		  flex-shrink: 0;
	  }
    }
    .row:nth-of-type(odd) {
      background-color: #efefef;
	}
	.row:nth-of-type(even) {
		.row-middle{
			opacity: 0.5;
		}
    }
    .arrow {
      display: inline-block;
    //   transform: rotate(180deg);
      padding: 0 8/@rem;
      vertical-align: middle;
	  background: url('./image/arrow-right.svg') center center no-repeat;
	  background-size: 16/@rem 6/@rem;
    }
  }
  .formula{
	  width: 100%;
	  margin-bottom: 30/@rem;
  }
  .example {
    margin-bottom: 20/@rem;
    font-size: 14/@rem;
    font-weight: 500;
    text-align: left;
    color: #000;
  }
  .examples {
    p {
      width: 222/@rem;
      height: 100/@rem;
      display: inline-table;
      margin: 0 auto;
      font-size: 12/@rem;
      text-align: left;
      color: #000;
      .smile {
        .m-icon-happy-face();
        &::before {
          color: #1b963c;
          font-size: 18/@rem;
        }
      }
      .upset {
        .m-icon-upset-face();
        &::before {
          color: #999;
          font-size: 18/@rem;
        }
      }
      .smile,
      .upset {
        display: table-cell;
        position: relative;
        top: 4/@rem;
        right: 12/@rem;
      }
    }
  }
  .rule {
    margin-bottom: 20/@rem;
    text-align: left;
    .index {
      display: inline-block;
      width: 13/@rem;
      height: 13/@rem;
      background-color: #0d9737;
      font-family: Roboto;
      font-size: 13.8/@rem;
      font-weight: 900;
      color: #fff;
      vertical-align: bottom;
      line-height: 1;
      text-align: center;
    }
    .detail {
      display: inline-block;
      margin-left: 19/@rem;
      margin-top: -15/@rem;
      font-size: 14/@rem;
      line-height: 1.29;
    }
    .items {
      margin-top: 20/@rem;
    }
    .item {
      margin-left: 20/@rem;
      font-size: 12/@rem;
      line-height: 1.5;
      color: #515151;
    }
    .space {
      margin-top: 20/@rem;
    }
  }
  .down-btn {
    display: inline-block;
    width: 230/@rem;
    height: 48/@rem;
    margin-top: 44/@rem;
    margin-bottom: 48/@rem;
	line-height: 48/@rem;
	background-color: #0d9737;
    background-image: linear-gradient(to bottom, #02e966, #0d9737);
    font-size: 20/@rem;
	color: #fff;
	font-weight: bold;
  }
  .download-app {
    margin-top: 40/@rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 300/@rem;
    height: 66/@rem;
    background: url(./image/download_app.jpg);
    background-size: 100% 66/@rem;
    & > a {
      position: absolute;
      top: 23/@rem;
      right: 7/@rem;
      width: 118/@rem;
      height: 36/@rem;
    }
  }
}
</style>
