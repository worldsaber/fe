<template>
	<div class="bingo-rules" :style="{
		display: isShow ? 'block' : 'none'
	}">
		<NavBar :backClick="goBack" slot="right">
			<homeNav slot="right"/>
		</NavBar>
		<div class="rules">
			<div class="winning">
				<p class="cons">Winning No.</p>
				<p class="calc">= Remainder of (Value A% total share of current prize) + 10000001</p>
				<p class="outcome" v-if="roundInfo.valueA">= {{roundInfo.valueA}} % {{roundInfo.stock.amount}} + 10000001</p>
				<p class="outcome">= {{roundInfo.winnerNumber}}</p>
			</div>
			<div class="value">
				<p class="cons">Value A</p>
				<p class="calc">= sum of the purchase time in the platform by the last 100 participants. E.g. A participant purchase time is 11h 23min 34sec 549msec (11:23:34:549), then the value representing this customer will be 112334549.</p>
			</div>
		</div>
		<div class="bord"></div>
		<p class="title">Participants</p>
		<MoreList :fetchData="getPartiList" :params="listParams">
			<template slot="list" slot-scope="{ list }">
				<div class="m-list" v-if="list.length > 0">
					<template v-for="(item, index) in list">
						<participant @click.native="goParti(item)" :key="index" :data="item" />
					</template>
				</div>
				<div class="m-goods-empty" v-else>
					You don't have any items in this category.
				</div>
			</template>
			<span slot="noMore">No More Participants</span>
		</MoreList>
	</div>
</template>
<script>
import { formatNumber } from 'utils';
import NavBar from 'components/navbar';
import homeNav from 'components/homeNav';
import Participant from '../../../components/participant';
import MoreList from '../../../components/moreList';
import { UTCToServer } from '../../../js/utils.js';

export default {
	props: ['roundInfo'],
	data() {
		return {
			list: [],
			listParams: {
				roundId: this.roundInfo.roundId,
				status: 1
			},
			isShow: false
		};
	},
	mounted () {
		// ios渲染bug，不知道咋解决，在某些ios手机下， iphone7 11.4.1系统下，莫名白屏不显示，就这样先解决下
		window.setTimeout(() => {
			this.isShow = true;
		});
	},
	components: {
		NavBar,
		Participant,
		MoreList,
		homeNav
	},
	methods: {
		goParti(item) {
			const userId = item ? item.userId : '';
			this.$router.push({
				path: `/participation/${this.roundInfo.roundId}`,
				query: {
					userId,
					goodsId: this.roundInfo.goodsId
				}
			});
		},
		getPartiList(params) {
			return fetch('/bingowin/goods/round/participants', {
				methods: 'GET',
				body: params
			}).then(res => res.json()).then(res => {
				this.partiLoading = false;
				if (res.bizCode === 10000) {
					this.entityList = this.formatEntity(res.data.entityList);
					const data = res.data;
					const extra = data.extra || {};
					const list = data.entityList || [];
					// hasMore
					let hasMore = extra.hasNext;
					// last
					let last;
					const len = list.length;
					if (len === 0) {
						hasMore = false;
					} else {
						last = extra.lastId;
					}
					return {
						list,
						hasMore,
						lastId: last
					};
				}
			}).catch(e => {
				console.log(e);
			});
		},
		formatEntity(entityList) {
			entityList && entityList.forEach(item => {
				item.showTime = UTCToServer(item.createTime, true);
				item.showBoughtFee = formatNumber(item.boughtFee / 10000, 0);
			});
			this.list = entityList;
		},
		goBack() {
			this.$emit('back');
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
.bingo-rules {
  .rules {
    padding: 20 / @rem 16 / @rem;
    .winning {
      margin-bottom: 26 / @rem;
      .cons {
        font-size: 14px;
        font-weight: bold;
        color: @green;
        margin-bottom: 3 / @rem;
      }
      .outcome {
        font-size: 13px;
        line-height: 1.38;
        color: @green;
      }
    }
    .value {
		padding-bottom: 21/@rem;
		.cons {
			font-size: 14px;
			font-weight: bold;
			color: @blueBlack;
			margin-bottom: 10/@rem;
		}
      
	}
  }
  .bord {
	height: 6/@rem;
	background: @lightGray;
	}
	.title {
		height: 20/@rem;
		line-height: 20/@rem;
		padding: 20 / @rem 16 / @rem;
	}
}
</style>
