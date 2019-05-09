<template>
	<div class="container">
		<div class="top">
			<div class="header-content">
				<a :href="home" class="home">
					<img src="./image/logo.svg" class="logo">
				</a>
				<img src="./image/stake-rebate.png" class="stake-rebate"/>
				<img src="./image/giftup.png" class="gift-up"/>
				<img src="./image/betting.png" class="betting"/>
				<img src="./image/sportsman.png" class="sportsman">
			</div>
			<!-- <img src="./image/btn.png" class="btn-wrapper top-btn" @click="getQualifyStatus"> -->
		</div>
		<div class="main">
			<div class="period">
				<div class="up">
					<span class="calendar"></span>
					<span class="date">12/04/2018</span>
				</div>
				<div class="down">
					<span class="words">Promotion Period</span>
					<span class="date">15/04/2018</span>
				</div>
			</div>
			<img src="./image/girdle.svg" class="girdle">
			<div class="table">
				<div class="row" v-for="(item,i) in items" :key="i">
					<span style="text-align:right">{{item[0]}}</span>
					<span class="arrow"></span>
					<span>{{item[1]}}</span>
				</div>
			</div>
			<p class="example">This is not a cumulative promotion and only 1 Cash Gift will be distributed in accordance to the total sum of Settled Bets and the interval in which it fits. </p>
			<div class="examples">
				<p><span class="smile"></span>Customer A has placed and settled bets of {{showCurrency}}2,750 (settled during the promotion period), customer A is eligible to obtain a {{showCurrency}}150 Cash Gift.</p>
				<p><span class="upset"></span>Customer B has placed and settled bets of {{showCurrency}}4,500 settled before the promotion period, customer B cannot obtain any Cash Gift from this promotion.</p>
			</div>
			<div class="down-btn" @click="getQualifyStatus">BET NOW</div>
			<div class="rules-wrapper">
			<div class="rules">
				<div class="rule" v-for="(item,index) in rules" :key="index">
					<div class="inner-wrapper">
						<span class="index" :class="[innerWrapperHeight[index]>19?'trans':'',innerWrapperHeight[index]>36?'tran':'']">{{index+1}}</span>
					</div>
					<span class="detail">{{item}}</span>
			</div>
			</div>
			</div>
			<div class="download-app">
				<a download :href="download"></a>
			</div>
		</div>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';
import { showCurrency } from 'config/currencyConfig';

export default {
	data () {
		return {
			rules: [],
			items: [],
			download: pagePath.download,
			home: pagePath.home,
			preFootball: pagePath.preFootball,
			showCurrency,
			innerWrapperHeight: [],
			activityId: 0
		};
	},
	created () {
		this.rules = [
			'Only Multiple bets placed in "Sports" and "Live" betting with odds 1.5 or higher, and settled during the promotion period will be valid for the promotion.',
			'If a bet is cashed out, it will not be valid for the promotion. If a bet is partially cashed out, only the final remaining amount of the bet will be valid for the promotion.',
			'In a situation that the final amount to be calculated has decimals included, it will be rounded and then summed up in accordance to the Terms and Conditions of this promotion.',
			'Cash Gifts will be distributed after the promotion is over within 3-4 working days and will be valid for 7 days. Only 1 Cash Gift will be distributed per Customer in accordance to the Terms and Conditions listed above.',
			'Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts. SportyBet reserves itself the rights to amend, cancel, reclaim or refuse any promotion at its own discretion.',
		];
		this.items = [
			[`${this.showCurrency}500-999`, `Cash Gift of ${this.showCurrency}20`],
			[`${this.showCurrency}1,000-2,499`, `Cash Gift of ${this.showCurrency}50`],
			[`${this.showCurrency}2,500-3,999`, `Cash Gift of ${this.showCurrency}150`],
			[`${this.showCurrency}4,000 & Over`, `Cash Gift of ${this.showCurrency}300`],
		];
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
		}
	},
	mounted () {
		const innerWrappers = document.querySelectorAll('.inner-wrapper');
		console.log(innerWrappers);
		for (let i = 0; i < innerWrappers.length; i++) {
			this.innerWrapperHeight.push(innerWrappers[i].getBoundingClientRect().height);
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
							window.location.href = this.preFootball;
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
						window.location.href = this.preFootball;
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
@import "~base/style/icon.less";

.top {
	width: 100%;
	background: url(./image/bg.jpg) no-repeat;
	background-size: cover;
	height: 520px;
	.header-content{
		position: relative;
		width: 1080px;
		margin: 0 auto;
	}
	.home{
		display: block;
		width: 192px;
		height: 67px;
		padding-top: 10px;
	}
	.logo {
		width: 192px;
		height: 67px;
	}
	.sportsman {
		width: 1006px;
		height: 520px;
		position: absolute;
		top: 0;
		right: -80px;
	}
	.stake-rebate,.gift-up, .betting{
		position: relative;
		z-index: 10;
		// margin-top: 10px;
	}
	.betting{
		margin: 35px 0 0 15px;
	}
	.btn-wrapper {
		position: absolute;
		left: 50%;
		top: 310px;
		transform: translateX(-50%);
	}
	.top-btn {
		width: 390px;
		height: 126px;
		margin-left: -207px;
	}
}
.main {
  display: inline-block;
  text-align: center;
  width: 100%;
  font-family: AvenirNext;
   .period {
    margin-top: 60px;
    margin-bottom: 30px;
    .calendar {
      .m-icon-calendar();
      &::before {
        color: #fc2c4d;
        font-size: 27px;
        padding-right: 15px;
      }
    }
    .up {
      margin-left: -73px;
    }
    .date {
      font-size: 25px;
      font-weight: bold;
      font-style: italic;
      letter-spacing: -1.5px;
    }
    .words {
      opacity: 0.2;
      font-family: Roboto;
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      color: #000;
    }
  }
  .girdle {
    width: 881px;
    margin-bottom: 20px;
  }
  .table {
    display: table;
	width: 880px;
	margin:0 auto;
    margin-bottom: 25px;
    .row {
      text-align: left;
      display: table-row;
      span {
        display: table-cell;
        opacity: 0.8;
        font-family: Roboto;
        font-size: 10.8px;
        font-weight: 500;
        line-height: 1.67;
      }
    }
    .row:nth-of-type(odd) {
      background-color: #efefef;
    }
    .arrow {
      display: inline-block;
      transform: rotate(180deg);
      padding: 0 8px;
      .m-icon-left2();
      &::before {
        color: #cacbcd;
        font-size: 16px;
      }
    }
  }
  .example {
    margin-bottom: 20px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: #000;
  }
  .examples {
	  width: 930px;
	  margin: 0 auto;
    p {
      font-family: Roboto;
      font-size: 12px;
      text-align: left;
      color: #000;
      .smile {
        .m-icon-happy-face();
        &::before {
          color: #1b963c;
          font-size: 18px;
        }
      }
      .upset {
        .m-icon-upset-face();
        &::before {
          color: #999;
          font-size: 18px;
        }
      }
      .smile,
      .upset {
        position: relative;
        top: 2px;
        right: 32px;
      }
    }
  }
  .download-app {
    margin: 0 auto;
    position: relative;
    width: 700px;
    height: 130px;
    background: url(./image/download_app.jpg) no-repeat;
    background-size: 100% 130px;
    padding: 20px 0 41px;
    & > a {
      position: absolute;
      top: 52px;
      left: 450px;
      width: 225px;
      height: 55px;
    }
  }
  .rules-wrapper {
    height: 460px;
  }
  .rules {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .rule {
    margin-bottom: 25px;
    text-align: left;
    .inner-wrapper {
      display: table-cell;
      position: relative;
      right: 22px;
      font-family: Roboto;
      font-size: 19.2px;
      font-weight: 900;
      color: #fff;
      vertical-align: bottom;
      line-height: 1;
      text-align: center;
      .index {
        width: 18px;
        height: 18px;
        display: inline-block;
        background-color: #ff0300;
      }
      .trans {
        transform: translateY(-75%);
      }
      .tran {
        transform: translateY(-175%);
      }
    }
    .long {
      margin-left: 45px;
      margin-top: -20px;
    }
    .detail {
      display: table-cell;
      font-family: Roboto;
      font-size: 14px;
      line-height: 1.29;
    }
    .item {
      margin-left: 19px;
      font-size: 12px;
      line-height: 1.5;
      color: #515151;
    }
  }
  .down-btn {
    display: inline-block;
    width: 230px;
	height: 60px;
	margin-top: 40px;
    margin-bottom: 90px;
    line-height: 60px;
    background-color: #ff0300;
    font-family: AvenirNext;
    font-size: 24px;
    color: #fff;
  }
}
</style>
