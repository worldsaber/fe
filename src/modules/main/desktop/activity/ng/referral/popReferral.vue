<template lang="html">
	<div class="my-referrals">
		<div class="no-data" v-if="noData">
			<img src="./image/people.png"></img>
			<span>You haven't referred any Friends yet. Start referring your Friends now!</span>
			<i class="m-icon-close" data-action="close" data-ret="close"></i>
		</div>
		<div v-if="Data">
			<div class="topic" >MY REFERRALS</div>
			<i class="m-icon-close" data-action="close" data-ret="close"></i>
			<div class="total-info">
				<div class="total">
					<p>Total Referred Friends:</p>
					<p>{{totalNum}} PERSON(S)</p>
				</div>
				<div class="total">
					<p>Total Gifts Return:</p>
					<p>{{currency}} {{totalGiftAmount}}</p>
				</div>
			</div>
			<div class="table">
				<div class="units">Referred</div>
				<div class="units" style="margin-left: -50px;position: relative;left: -26px;">Registration</div>
				<div class="units" style="display: inline-table;position: relative;left: -24px;">Referred Customer's Betting Stakes</div>
				<div class="units" style="margin-left: 100px;">Return in Gifts</div>
			</div>
			<div class="table" v-for="item in invData">
				<div class="units">
					<div>{{item.referredName}}</div>
				</div>
				<div class="units" style="margin-left:-20px">
					<div>{{item.entranceDate}}</div>
				</div>
				<div class="units">
					<div class="bars">
						<span>0</span>
						<span class="bg-bar">
							<span class="bar" :style="getLen(item.activeBarLen)" v-if="item.referredCurStake<referrAmount&&item.referredCurStake!==0"><span>{{currency}} {{item.referredCurStake}}</span></span>
							<span class="bar complete" :style="getLen(item.activeBarLen)" v-if="item.referredCurStake>=referrAmount"><span>Complete</span></span>
						</span>
						<span>{{referrAmount}}</span>
					</div>
				</div>
				<div class="arrow" :class="[item.referredCurStake===referrAmount||item.referredCurStake>referrAmount?'':'hide']"><span>……</span>></div>
				<div class="units" style="padding-left:40px">
					<div>{{currency}} {{item.giftAmount}}</div>
				</div>
			</div>
			<Pagination
				v-if="isShowPagination"
				:pageCount="Math.ceil(totalNum/pageSize)"
				:clickHandler="pageClickHandler"
				:initialPage="1"
				class="pagination">
			</Pagination>
		</div>
	</div>
</template>

<script>
import Pagination from 'components/pagination/pagination';
import cookie from 'packages/lib/utils/cookie.js';
import dateFormat from 'kernel/js/dateFormat';
import '../../../mockData/referral/index?debug';

export default {
	data () {
		return {
			noData: false,
			Data: false,
			totalNum: 0,
			totalGiftAmount: 0,
			referrAmount: 300,
			pageNo: 1,
			pageCount: 0,
			pageSize: 10,
			invData: {},
			referredCurStake: 0,
			activeBarLen: 0,
			isShowPagination: false,
			currency: window.currency || 'NGN',
			userId: cookie.get('userId') || ''
		};
	},
	components: {
		Pagination
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
					pageSize: this.pageSize
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						this.totalNum = res.data.totalNum;
						if (this.totalNum === 0) {
							this.noData = true;
						} else if (this.totalNum > 0) {
							this.Data = true;
							this.isShowPagination = true;
							this.totalGiftAmount = res.data.totalGiftAmount / 10000;
							const rawData = res.data.entityList;
							this.invData = this.formatInvData(rawData);
						} else {
							this.Data = true;
						}
					} else {
						this.noData = true;
					}
				})
				.catch(res => {
					this.noData = true;
				});
		},
		formatInvData (data) {
			for (let i = 0; i < data.length; i++) {
				data[i].giftAmount /= 10000;
				const temp = data[i].referredName.split('');
				temp.splice(0, 4, '****');
				data[i].referredName = temp.join('');
				data[i].referredCurStake /= 10000;
				data[i].curStake = data[i].referredCurStake;
				if (data[i].curStake < 25 && data[i].curStake > 0) {
					data[i].curStake = 25;
				} else if (data[i].curStake > this.referrAmount) {
					data[i].curStake = this.referrAmount;
				}
				data[i].activeBarLen = (284 * data[i].curStake / this.referrAmount) + 'px';
				data[i].entranceDate = dateFormat.format(data[i].entranceDate, 'DD/MM/YYYY');
			}
			return data;
		},
		getLen (param) {
			return `width: ${param};`;
		},
		pageClickHandler (page) {
			this.pageNo = page;
			this.getInvites();
		}
	}

};
</script>
<style lang="less">
@import "base/style/variable.less";
@import "base/style/mixin.less";
@import "base/style/icon.less";
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.my-referrals {
  width: 894px;
  height: 500px;
  position: absolute;
  top: -220px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0px 17px 32.2px 2.8px rgba(0, 0, 0, 0.37);
  padding: 26px 38px 15px 32px;
}
.no-data {
  display: inline-block;
  width: 100%;
  line-height: 500px;
  text-align: center;
  font-size: 16.1px;
  color: #9ca0ab;
  & img {
    vertical-align: baseline;
  }
  & .m-icon-close {
    cursor: pointer;
    position: relative;
    left: 160px !important;
    top: -227px !important;
    .m-icon-close();
  }
}
.topic {
  font-size: 16.1px;
  line-height: 1.89;
}
.m-icon-close {
  cursor: pointer;
  position: relative;
  left: 880px;
  top: -27px;
  transform: translate3d(0, -50%, 0);
  .m-icon-close();
}
.total-info {
  display: flex;
  width: 813px;
  height: 63px;
  margin-top: -15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}
.total {
  flex-flow: row nowrap;
  text-align: center;
  flex: 1;
  & p {
    font-size: 19px;
    font-weight: 900;
    line-height: 1.61;
  }
  & p:first-child {
    font-size: 13.8px;
    line-height: 2.21;
  }
}
.total:first-child {
  border-right: 1px solid #eaeaea;
}
.table {
  display: flex;
  padding-left: 20px;
}
.units {
  flex-flow: row nowrap;
  flex: 1;
  font-size: 13.8px;
  line-height: 2.21;
  text-align: left;
  & div {
    font-size: 13.2px;
    line-height: 2.3;
    color: #8c8c8c;
  }
}
.bars {
  display: flex;
  align-items: center;
}
.bg-bar {
  width: 284px;
  height: 18px;
  border-radius: 5.4px;
  background-color: #f1f1f1;
  margin-left: 16px;
  margin-right: 16px;
}
.complete {
  .m-icon-success();
  &::before {
    font-size: 11px;
    line-height: 13px;
    display: inline-block;
    font-weight: bold;
    position: relative;
    top: -10px;
    right: 12px;
  }
}
.bar {
  display: inline-block;
  height: inherit;
  background: #17b91a;
  border-radius: 5.4px;
  text-align: right;
  font-size: 9.2px;
  line-height: 3.31;
  color: #fff;
  span {
    position: relative;
    top: -10px;
    right: 10px;
  }
}
.arrow {
  font-size: 17.3px;
  font-weight: 900;
  color: #17b91a;
  position: relative;
  left: 20px;
  & span {
    position: relative;
    top: -4px;
  }
}
.hide {
  color: #fff;
}
.my-referrals .pageNum {
  font-weight: bold !important;
}
.my-referrals .pagination {
  padding-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

