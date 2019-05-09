<template>
  	<div class="middle">
		<div class="no-data" v-if="noData">
			<img src="./image/people.png">
			<div>You haven't referred any Friends yet. Start referring your Friends now!</div>
		</div>
		<div v-if="Data">
			<div class="head">MY REFERRALS</div>
			<table>
				<tr>
					<td class="l-side">Total Referred Friends:</td>
					<td class="r-side">{{totalNum}} PERSON(S)</td>
				</tr>
				<tr>
					<td class="l-side">Total Gifts Return:</td>
					<td class="r-side">{{showCurrency}}{{totalGiftAmount}}</td>
				</tr>
			</table>
			<div class="referral">
				<div class="flex" v-for="(item,i) in invData" :key="i">
					<div class="units">
						<div class="l">Referred</div>
						<div class="r">{{item.referredName}}</div>
					</div>
					<div class="units">
						<div class="l">Registration</div>
						<div class="r">{{item.entranceDate}}</div>
					</div>
					<div class="units">
						<div class="l">Return in Gifts</div>
						<div class="r" :class="[item.giftAmount != 0 ? 'positive' : 'negative']">{{showCurrency}}{{item.giftAmount}}</div>
					</div>
					<div class="units">
						<div class="bars">
							<span>0</span>
							<span class="bg-bar">
								<span class="bar" :style="getLen(item.activeBarLen)"  v-if="item.referredCurStake<1000&&item.referredCurStake!==0"><span>{{showCurrency}}{{item.referredCurStake}}</span></span>
								<span class="bar complete" :style="getLen(item.activeBarLen)" v-if="item.referredCurStake>=1000"><span>Complete</span></span>
							</span>
							<span>1000</span>
						</div>
					</div>
				</div>
				<div class="load-more" v-show="moreEvents && touching"></div>
				<div class="no-more" v-show="!moreEvents && hasScroll">No More Records</div>
			</div>
		</div>
	</div>
</template>
<script>
import cookie from 'packages/lib/utils/cookie.js';
import dateFormat from 'kernel/js/dateFormat';
import { showCurrency } from 'config/currencyConfig';
import '../../mockData/referral/index?debug';

export default {
	data () {
		return {
			noData: false,
			Data: false,
			totalNum: 0,
			totalGiftAmount: 0,
			pageNo: 1,
			totalPage: 0,
			pageSize: 6,
			invData: [],
			referredCurStake: [],
			activeBarLen: 0,
			isShowPagination: false,
			showCurrency,
			userId: cookie.get('userId') || '',
			loading: true,
			hasScroll: false,
			touching: false,
			moreEvents: false,
			startScroll: 0,
			binded: false,

		};
	},
	created () {
		this.getInvites();
	},
	methods: {
		getInvites () {
			fetch('promotion/v1/gifts/invites', {
				method: 'GET',
				body: {
					userId: this.userId,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						this.totalNum = res.data.totalNum;
						if (this.totalNum === 0) {
							this.noData = true;
						} else {
							this.Data = true;
							this.totalPage = this.totalNum / this.pageSize;
							this.totalGiftAmount = res.data.totalGiftAmount / 10000;
							const rawData = res.data.entityList;
							this.formatInvData(rawData);
						}
					} else {
						this.noData = true;
					}
				})
				.then(() => {
					if (this.binded === false) {
						this.bindEvent();
					}
				})
				.catch(res => {
					this.noData = true;
				});
		},
		formatInvData (data) {
			const deviceWidth = document.documentElement.clientWidth;
			for (let i = 0; i < data.length; i++) {
				data[i].giftAmount /= 10000;
				const temp = data[i].referredName.split('');
				temp.splice(0, 4, '****');
				data[i].referredName = temp.join('');
				data[i].referredCurStake /= 10000;
				data[i].curStake = data[i].referredCurStake;
				if (data[i].curStake < 300 && data[i].curStake > 0) {
					data[i].curStake = 300;
				} else if (data[i].curStake > 1000) {
					data[i].curStake = 1000;
				}
				if (deviceWidth < 375) {
					data[i].activeBarLen = (195 * data[i].curStake / 1000) + 'px';
				} else if (deviceWidth >= 375 && deviceWidth < 415) {
					data[i].activeBarLen = (228 * data[i].curStake / 1000) + 'px';
				} else if (deviceWidth >= 415) {
					data[i].activeBarLen = (260 * data[i].curStake / 1000) + 'px';
				}
				data[i].entranceDate = dateFormat.format(data[i].entranceDate, 'DD/MM/YYYY');
				this.invData.push(data[i]);
			}
		},
		getLen (param) {
			return {
				width: param
			};
		},
		getMoreList () {
			if (this.moreEvents) {
				this.pageNo++;
				if (this.pageNo <= this.totalPage + 1) {
					this.getInvites().then(() => {
						this.hasScroll = false;
					}).catch(() => {
						this.hasScroll = false;
					});
				} else {
					this.moreEvents = false;
				}
			}
		},
		handleStart (e) {
			this.touching = true;
		},
		handleMove (e) {
			if (!this.touching) {
				return;
			}
			const scrollTop = document.querySelector('.referral').scrollTop;
			if (this.startScroll < scrollTop) {
				if (scrollTop % 250 < 250 && scrollTop % 250 > 125) {
					this.hasScroll = true;
					this.moreEvents = true;
				} else {
					this.hasScroll = false;
					this.moreEvents = false;
				}
			} else {
				this.hasScroll = false;
				this.moreEvents = false;
			}
		},
		handleEnd (e) {
			this.touching = false;
			if (this.hasScroll && this.moreEvents) {
				this.getMoreList();
			} else {
				this.hasScroll = false;
			}
		},
		bindEvent () {
			const referralDom = document.querySelector('.referral');

			if (referralDom) {
				referralDom.addEventListener('touchstart', this.handleStart, false);
    			referralDom.addEventListener('touchmove', this.handleMove, false);
    			referralDom.addEventListener('touchend', this.handleEnd, false);
				this.binded = true;
			}
		},
	},
	destroyed () {
		const referralDom = document.querySelector('.referral');

		if (referralDom) {
			referralDom.removeEventListener('touchstart', this.handleStart, false);
    		referralDom.removeEventListener('touchmove', this.handleMove, false);
    		referralDom.removeEventListener('touchend', this.handleEnd, false);
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
.load-more,
.no-more {
  height: 51/@rem;
  line-height: 51/@rem;
  font-size: 12/@rem;
  text-align: center;
  background-color: @fogGray;
  color: @darkGray;
}
.load-more {
  .m-icon-loading();
  &:before {
    display: inline-block;
    animation: loaddng 0.6s linear infinite;
    margin-right: 20/@rem;
  }
}
@keyframes loaddng {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.middle {
  height: 500/@rem;
  padding: 0 29/@rem;
  overflow: hidden;
  color: #343a45;
  text-align: center;
  .no-data {
    height: 100%;
    transform: translateY(35%);
    font-size: 13px;
    line-height: 1.23;
    color: #9ca0ab;
    img {
      width: 42/@rem;
      height: 30/@rem;
      margin-bottom: 19/@rem;
    }
  }
  .head {
    padding: 24/@rem 0 16/@rem;
    border-bottom: 1px solid #b6b6b6;
    font-size: 17px;
    font-weight: 900;
    line-height: 1.3;
  }
  table {
    display: inline-block;
    margin: 23/@rem 0 35/@rem;
    tr {
      text-align: left;
      .l-side {
        padding-right: 35/@rem;
        font-size: 12px;
        line-height: 1.23;
      }
      .r-side {
        font-size: 15px;
        font-weight: 900;
        line-height: 1.02;
      }
    }
  }
  .referral {
    height: 310/@rem;
    overflow: scroll;
    .flex {
      display: inline-block;
      width: 256/@rem;
      height: 102/@rem;
      padding: 12/@rem 7/@rem;
      margin-bottom: 10/@rem;
      box-sizing: border-box;
      border: 1px solid #a0a0a0;
      border-radius: 2px;
    }
    .units {
      display: flex;
      & div {
        flex: 1;
        white-space: nowrap;
      }
      .l {
        text-align: left;
      }
      .r {
        text-align: right;
      }
      .positive {
        font-size: 15px;
        font-weight: 900;
        color: #17b91a;
      }
      .negative {
        font-size: 15px;
        font-weight: 900;
        color: #8c8c8c;
      }
      .bars {
        display: flex;
        margin-top: 5/@rem;
        .bg-bar {
          width: 195/@rem;
          line-height: 16/@rem;
          height: 16/@rem;
          background-color: #eee;
          margin-left: 6/@rem;
          margin-right: 6/@rem;
          text-align: left;
        }
        .complete {
          .m-icon-success();
          &::before {
            font-size: 11px;
            display: inline-block;
            font-weight: bold;
            position: relative;
            right: 9/@rem;
          }
        }
        .bar {
          display: inline-block;
          height: inherit;
          background: #17b91a;
          text-align: right;
          font-size: 9.2px;
		  color: #fff;
		  position: relative;
		  top: -1px;
          span {
            position: relative;
            right: 5/@rem;
          }
        }
      }
    }
  }
}
.icon-container {
  width: 100%;
  height: 35/@rem;
  line-height: 35/@rem;
  background: #f2f3f5;
  text-align: left;
  color: #343a45;
  .m-back-icon-wap::before {
    margin-left: 15px;
    content: "\E620";
    font-family: "iconfont";
    font-size: 10.7px;
    -webkit-font-smoothing: antialiased;
  }
}
</style>
