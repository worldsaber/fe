<template>
	<div class="m-bet-details" v-loading:getBetDetail="isLoading">
		<template v-if="!isLoading">
			<p class="bets-num">Number of Bets: {{betSize || betDetail.length}}</p>
    		<div class="bet-details-list" v-for="(item,i) in betDetail" :key="i">
    			<!-- bet基本信息部分 -->
    			<div class="bet-wrapper">
    				<p class="bet-id">Bet ID: {{item.id}}</p>
    				<div class="bars seperate" :class="{'win':item.status==='Won','lost':item.status==='Lost'}">
    					<span v-if="item.betType=='System'" class="bet-type">{{item.comboType}}<span v-if="item.comboNum>1">(X{{item.comboNum}})</span></span>
    					<span v-else>{{item.betType}}<span v-if="comboSize>1&&item.betType!=='Singles'">(X{{comboSize}})</span></span>
    					<span class="bet-status" :class="{'cup':item.status==='Won'}">{{item.status}}</span>
    				</div>
    				<div class="gray seperate">
    					<span>Stake</span>
    					<span>Return</span>
    				</div>
    				<!-- under split不为空时显示分割线 -->
    				<div class="stake_info seperate" :class="{'split-line':(item.stake!=item.originalStake&&item.stake>0&&item.status!=='Won'&&item.status!=='Lost')||item.bonus>0||(item.potentialWinnings>0&&item.stake>0&&item.status!=='Won'&&item.status!=='Lost')}">
    					<span>{{item.showOriginalStake}}</span>
    					<span :class="{'gray':item.winnings==0}" v-if="item.status==='Running'">--</span>
    					<span :class="{'gray':item.winnings==0}" v-else>{{item.showWinnings}}</span>
    				</div>
    				<!-- flexbet订单 -->
    				<div class="flexibet-title" v-if="item.type === 4">
    					<i>F</i>Flex Your Bet {{item.minToWin}}+ of {{item.selectionSize}}
    				</div>
    				<div class="under-split">
    					<!-- 比赛未结束，有cashout历史且未全部cashout时显示 -->
    					<div class="remain seperate" v-if="item.stake!=item.originalStake&&item.stake!=0&&item.status!=='Won'&&item.status!=='Lost'">
    						<span class="gray">Remain Stake</span>
    						<span>{{item.showStake}}</span>
    					</div>
    					<!-- 有bonus时显示 -->
    					<div class="remain seperate" v-if="item.bonus>0">
    						<span class="gray">Bonus</span>
    						<span>{{item.showBonus}}</span>
    					</div>
    					<!-- 显示totalOdds -->
    					<div class="remain seperate" v-if="item.totalOdds">
    						<span class="gray">Odds</span>
    						<span>{{item.totalOdds}}</span>
    					</div>
    					<!-- 比赛未结束，有cashout历史且未全部cashout时显示 -->
    					<div class="remain seperate"  v-if="item.potentialWinnings!=0&&item.status!=='Lost'&&item.status!=='Won'">
    						<span class="gray">Pot. Win</span>
    						<span>{{item.showPotentialWinnings}}</span>
    					</div>
    					<div class="gray flexibet-tip" v-if="item.type === 4 && item.currentMinToWin > 0 && item.currentSelectionSize > 0" @click="showFlexibetTip">* FlexiBet current selections: {{item.currentMinToWin}} of {{item.currentSelectionSize}}<i class="tip"></i></div>
    				</div>
    			</div>
    			<!-- 倒梯形 -->
    			<div class="ladder-reverse"></div>
    			<!-- cashout详情部分，在有cashout时显示，默认收起 -->
    			<div class="cashout-outter">
    				<!-- 梯形 -->
    				<div class="ladder"></div>
    				<div class="cashout-wrapper" v-if="item.cashOutHistorys&&item.cashOutHistorys.length>0">
    					<div @click="item.showCashoutDetail?item.showCashoutDetail=false:item.showCashoutDetail=true">
    						<span :class="{'cashout-tittle':item.showCashoutDetail,'fold':!item.showCashoutDetail}"></span>
    						<span>Cashout History</span>
    					</div>
    					<AfTable v-if="item.showCashoutDetail">
    						<AfTableRow class="legend queue">
    							<AfTableCell>Time</AfTableCell>
    							<AfTableCell>Stake Used</AfTableCell>
    							<AfTableCell>Cashout</AfTableCell>
    						</AfTableRow>
    					</AfTable>
    					<AfTable v-if="item.showCashoutDetail">
    						<AfTableRow class="content gray-line queue" v-for="(cashout,i) in item.cashOutHistorys" :key="i">
    							<AfTableCell>{{cashout.date}}</AfTableCell>
    							<AfTableCell>{{cashout.showUsedStake}}</AfTableCell>
    							<AfTableCell>{{cashout.showAmount}}</AfTableCell>
    						</AfTableRow>
    					</AfTable>
    					<AfTable v-if="item.showCashoutDetail">
    						<AfTableRow class="queue">
    							<AfTableCell class="gray">Total</AfTableCell>
    							<AfTableCell>{{item.showTotalUsedStake}}</AfTableCell>
    							<AfTableCell>{{item.showTotalCashout}}</AfTableCell>
    						</AfTableRow>
    					</AfTable>
    				</div>
    				<div class="ladder-reverse"></div>
    			</div>
    			<!-- selection部分 -->
    			<div class="selection-outter">
    				<div class="ladder"></div>
    				<div class="selection-wrapper">
    					<!-- 默认展开，点击收起 -->
    					<div @click="item.showSelection?item.showSelection=false:item.showSelection=true">
    						<span :class="{'cashout-tittle':item.showSelection,'fold':!item.showSelection}"></span>
    						<span>Selection Details</span>
    					</div>
    					<div v-if="item.showSelection">
    						<Selection class="selections" v-for="(selection, index) in item.selections"
    							:key="index" :selection="selection"
    							:isHaveLiveLink="false"
    							:isHaveTrackerLink="false"
    							:sequenceNum="item.comboNum > 1 && (item.type == 2 || (item.type == 3 && item.comboType!=='Single')) ? index + 1 : null" >
    						</Selection>
    					</div>
    				</div>
    			</div>
    			<!-- 组合部分 -->
    			<div class="combo-details" v-if="item.comboNum>1">
    				<div class="title" >Combo Details</div>
    				<div class="details" v-for="(combination,i) in item.combinations" :key="i">
    					<div class="seperate barss">
    						<span>{{combination.combo}}</span>
    						<span :class="{'cups':combination.status==='Won'}">{{combination.status==='Won'?'Won':combination.status}}</span>
    					</div>
    					<div class="seperate">
    						<span>Stake</span>
    						<span>{{combination.stake}}</span>
    					</div>
    					<div class="seperate">
    						<span>Odds</span>
    						<span>{{combination.odds}}</span>
    					</div>
    					<div class="seperate" v-if="combination.bonus>0">
    						<span>Bonus</span>
    						<span>{{combination.bonus}}</span>
    					</div>
    					<div class="seperate">
    						<span>Return</span>
    						<span>{{combination.winnings>=0?combination.winnings:'--'}}</span>
    					</div>
    				</div>
    			</div>
    		</div>
		</template>
	</div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import * as mutationTypes from 'store/order/mutationTypes';
import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
import 'components/login/popupLogin';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import Selection from './selectionNew.vue';

export default {
	data() {
		return {
			orderId: this.$route.params.id,
			comboSize: this.$route.query.combo_size,
			betSize: this.$route.query.bet_size
		};
	},
	components: {
		AfTable,
		AfTableRow,
		AfTableCell,
		Selection
	},
	computed: {
		...mapState('order', [
			'betDetail',
			'isLoading',
			'errorInfo'
		])
	},
	watch: {
		errorInfo(val) {
			const { type = '' } = val || {};

			if (type === 'login') {
				this.$dialog();
				this.$popupLogin.show();
			}
		}
	},
	created() {
		this.getBetDetail();
	},
	mounted() {
		document.querySelector('body').style.background = '#f2f3f5';
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destroyed() {
		document.querySelector('body').style.background = 'none';
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	methods: {
		...mapActions('order', [
			'fetchBetDetail',
		]),
		...mapMutations('order', {
			changeBetDetail: mutationTypes.UPDATEOPENBETDETAIL
		}),
		showFlexibetTip () {
			this.$alert('Because one or some of your selected matches are void, FlexiBet has removed relate selections and recalculated the odds.');
		},
		getBetDetail() {
			this.fetchBetDetail(this.orderId);
			this.changeBetDetail();
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.getBetDetail();
		}
	}
};
</script>
<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";
@import "../style/mixin";

.m-bet-details {
	background: @fogGray;
	  padding: 0 10 / @rem;
	  min-height: 100%;
  .bets-num {
    height: 28 / @rem;
    margin-bottom: 16 / @rem;
    line-height: 28 / @rem;
    font-size: 14 / @rem;
    color: #9ca0ab;
  }
  .bet-wrapper,
  .cashout-wrapper,
  .selection-wrapper,
  .combo-details {
    background: #fff;
    padding: 6 / @rem 10 / @rem 10 / @rem;
  }
	.cashout-outter,
	.selection-outter,
	.combo-details {
		margin-top: -18 / @rem;
	}

  .ladder {
    border-left: 10 / @rem solid #f5f7fd;
    border-bottom: 10 / @rem solid transparent;
    border-right: 10 / @rem solid #f2f3f5;
    position: relative;
    top: 10 / @rem;
  }
  .ladder-reverse {
    transform: rotate(180deg);
    border-left: 10 / @rem solid #f2f3f5;
    border-bottom: 10 / @rem solid transparent;
    border-right: 10 / @rem solid #f2f3f5;
    position: relative;
    top: -10 / @rem;
  }

  .combo-details {
	margin-bottom: 20 / @rem;
    font-size: 14 / @rem;
    .title {
      margin-top: 10 / @rem;
      text-align: center;
    }
    .barss {
      height: 23 / @rem;
      padding: 0 6 / @rem;
      margin-top: 14 / @rem;
      margin-bottom: 12 / @rem;
      line-height: 22 / @rem;
      background: #f2f3f5;
    }
    .cups {
      .m-icon-wincup();
      &::before {
        font-size: 12 / @rem;
        margin-right: 5 / @rem;
        display: inline-block;
      }
    }
  }
  .bars {
    height: 28 / @rem;
    padding: 0 6 / @rem;
    margin-top: 8 / @rem;
    margin-bottom: 12 / @rem;
    line-height: 28 / @rem;
    background: #1b1e25;
    color: #fff;
    font-size: 16 / @rem;
    font-weight: bold;
  }
  .cup {
    .m-icon-wincup();
    &::before {
      color: #fff;
      font-size: 16 / @rem;
      margin-right: 5 / @rem;
      display: inline-block;
    }
  }
  .win {
    background: #0d9737;
  }
  .lost {
    background: #9ca0ab;
  }
  .seperate {
    display: flex;
    justify-content: space-between;
  }
  .gray {
    color: #9ca0ab;
  }
  .stake_info {
    font-size: 20 / @rem;
    font-weight: bold;
  }
  .flexibet-title {
    .flexibet();
  }
  .flexibet-tip {
    .tip {
      font-size: 10 / @rem;
      .m-icon-tips();
      &:before {
        color: @darkGray;
        font-size: 12 / @rem;
        padding-left: 5 / @rem;
      }
    }
  }
  .split-line {
    padding-bottom: 15 / @rem;
    border-bottom: 1px solid #eaecef;
  }
  .remain {
    margin-top: 3 / @rem;
    font-size: 14 / @rem;
  }
  .fold {
    transform: rotate(270deg);
    display: inline-block;
    margin-top: -1px;
    position: relative;
    top: -3px;
    .cashout-tittle();
  }
  .cashout-tittle {
    .m-icon-arrow-down2();
    &::before {
      font-size: 10 / @rem;
      padding-right: 15 / @rem;
      position: relative;
      left: 5 / @rem;
      top: 1 / @rem;
      color: #0d9737;
    }
  }
  .legend {
    margin-top: 10 / @rem;
    height: 17 / @rem;
    line-height: 17 / @rem;
    background: #f2f3f5;
    color: #9ca0ab;
  }
  .content {
    margin: 5 / @rem;
  }

  .gray-line {
    border-bottom: 1px solid #eaecef;
  }
  .queue {
	  display: table-row;
	  .m-table-cell {
		  text-align: center;
		  width: 30vw;
	  }
	  .m-table-cell:first-child {
		  text-align: left;
	  }
	  .m-table-cell:last-child {
		  text-align: right;
	  }
  }
  .selection-outter {
    margin-bottom: 20 / @rem;
	.selections {
		margin-top: 12 / @rem;
		padding: 8 / @rem 0;
		&:last-child{
			border-bottom: 0;
		}
	}
	.item-status {
		font-size: 14 / @rem;
		font-weight: bold;
		color: #353a45;
	}
	  .pick-info {
   		margin-top: 6 / @rem;
 	 }
  }
  .others {
    color: #9ca0ab;
  }
  .won {
    .m-icon-success-bg();
    &::before {
      color: #33ea6a;
      font-size: 16 / @rem;
      padding-right: 15 / @rem;
      position: relative;
      left: 10 / @rem;
      top: -5 / @rem;
    }
  }
  .teams {
    font-size: 14 / @rem;
    width: 260 / @rem;
  }
  .bold {
    font-weight: bold;
  }
  .not-seperate {
    display: table-row;
    span {
      display: table-cell;
    }
    span:last-child {
      padding-left: 8 / @rem;
    }
    .banker {
      width: 16 / @rem;
      height: 16 / @rem;
      line-height: 16 / @rem;
      display: inline-block;
      margin-left: 3 / @rem;
      border: solid 1 / @rem #0d9737;
      border-radius: 8 / @rem;
      color: #0d9737;
      text-align: center;
      font-weight: bold;
    }
  }
}

</style>
