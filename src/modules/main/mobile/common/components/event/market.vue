<template>
  <div class="m-market m-event-market-default" @click.stop="handlerStop">
	  <!-- 注意：Next Goal 类型不显示 specifiers, wap 赛事列表页outcome每行最多显示三个 -->
	  <template v-if="currentMarket && currentMarket.outcomeOrder">
	 	 <!-- 有 specifiers就显示-->
		<div v-if="isShowSpecifier" class="m-outcome m-event-outcome-default specifiers-select">
			<AfSelect
				:readonly="true"
				:data='specifiers'
				:closeOnSelect="true"
				:isInsertScrollEle='true'
				scrollEleSelector=".m-main-mid"
				:ListWidth="110/12 + 'rem'"
				:itemListCls="['m-event-specifiers']"
				v-model="currentSpecifier"/>
		</div>
		<!-- 如果market上获取的productId
		和预先设置的不一样，认为market不可以投注 -->
		<OutcomeCell
			v-for="(id, index) in currentMarket.outcomeOrder" :key="index"
			:sportId="sportId"
			:market="currentMarket"
			:event="event"
			:disabled="currentMarket.productId !== productId"
			:outcome="currentMarket.outcomes[id]" >
			<span class="m-outcome-title" v-if="title && title[index]">{{title[index]}}</span>
			<!-- suspended显示 -->
			<span :class="['m-outcome-odds', {
				'm-icon-lock': currentMarket.status !== 0 || currentMarket.outcomes[id].isActive !== 1
			}]">{{currentMarket.status !== 0 || currentMarket.outcomes[id].isActive !== 1 ? '' : currentMarket.outcomes[id].odds}}</span>
		</OutcomeCell>
	  </template>
	  <!-- 有一种情况是后台压根没有传递market，但是这个market还是要显示,所以取固定数据显示这个market -->
	  <template v-else>
		<div v-if="isShowLockSpecifier" class="m-outcome m-event-outcome-default m-outcome--disabled  specifiers-select">
			<span class="m-icon-lock"></span>
		</div>
		<template v-if="currentMarketsOutComeSize">
			<div class="m-outcome--disabled m-outcome m-event-outcome-default m-icon-lock" v-for="one in getOutComeSize()" :key="one">
				<span class="m-icon-lock"></span>
			</div>
		</template>
	  </template>
 </div>

</template>

<script>
	import 'packages/select';
	import { marketsOutComeSize } from 'components/eventsList/util';
	import OutcomeCell from './outcomeCell.vue';
	import sortMarkets from './js/sortMarkets.js';

	// 根据不同的id去显示不同的market
	// 记住这里只显示market
	export default {
		components: {
			OutcomeCell
		},
		name: 'Markets',
		props: {
			// 只是marketId，不带specifier
			marketId: {
				type: [String, Number]
			},
			event: {
				type: Object,
			},
			// 是否只显示某个置顶的specifiers，这个只对带specifiers起作用
			showOnlyOneSpecifiers: {
				type: [String, Number],
				'default': ''
			},
			// 是否隐藏掉下拉列表的选择specifiers, 如果这个marketId在这个数组里面，则这个market不显示 select，选择specifiers
			// 仅对带specifiers的market管用
			isHideSelectSpecifiers: {
				type: Boolean,
				'default': false
			},
			// title用这里传递的，暂时无用
			title: {
				type: Array,
			},
			// 1(直播),3(赛前)
			productId: {
				type: [String, Number]
			},
			// 为什么需要sportId是因为在不同的sport下的marketId可能是一样的
			sportId: {
				type: String,
				required: true
			},
			marketsOutComeSize: {
				type: Object,
				default () {
					return marketsOutComeSize;
				}
			},
			// 是否显示Next Goal market下拉列表的选择specifiers
			isShowNextGoalSpecifiers: {
				type: Boolean,
				'default': false
			}
		},
		data () {
			return {
				currentMarket: null,
				specifiers: null,
				specifiersName: null,
				currentSpecifier: null
			};
		},
		watch: {
			markets: {
				immediate: true,
				handler (val) {
					if (!val) {
						this.reset();
						return;
					}
					// 如果是一个Object证明是一个普通的makerts, array就是一组specifier的market
					// 这里要注意如果是combo的maket，也有可能带specifier，目前列表页面没有这种情况
					if (!val.length) {
						this.currentMarket = val;
						this.specifiers = null;
						this.specifierName = null;
						this.currentSpecifier = null;
					} else {
						this.parseCurrentMarkets(val);
					}
				}
			},
			currentSpecifier (val) {
				if (val && this.markets) {
					this.currentMarket = this.markets[val.index];
				}
			}
		},
		computed: {
			currentMarketsOutComeSize () {
				return (this.marketsOutComeSize[this.sportId] || {})[this.marketId];
			},
			isShowNextGoal() {
				const isNextGoal = this.isNextGoal;
				const isShow = this.isShowNextGoalSpecifiers;
				return !isNextGoal || (isNextGoal && isShow);
			},
			isShowSelectSpecifier () {
				return !this.isHideSelectSpecifiers;
			},
			isShowSpecifier() {
				return this.isShowNextGoal && this.currentSpecifier && this.isShowSelectSpecifier;
			},
			isShowLockSpecifier() {
				const size = this.currentMarketsOutComeSize;
				return this.isShowNextGoal && size && size.length && this.isShowSelectSpecifier;
			},
			markets () {
				let markets = this.event.markets;
				markets = markets ? markets[this.marketId] || {} : {};
				if (markets.length) {
					markets = markets.filter(cur => cur.status === 0 || cur.status === 1);
					// 全部过滤掉了，这个时候就认为没有market
					if (markets.length === 0) {
						return null;
					}
				}
				return markets;
			},
			isNextGoal () {
				return +this.marketId === 8;
			}
		},
		methods: {
			handlerStop () {},
			getOutComeSize () {
				if (this.currentMarketsOutComeSize) {
					if (this.currentMarketsOutComeSize.length > 1) {
						return this.currentMarketsOutComeSize[1];
					} else if (this.currentMarketsOutComeSize > 1) {
						return this.currentMarketsOutComeSize;
					}
				}
				return 1;
			},
			reset() {
				this.currentMarket = null;
				this.specifiers = null;
				this.specifierName = null;
				this.currentSpecifier = null;
			},
			parseCurrentMarkets(targetMarkets) {
				const { markets, specifierList, name } = sortMarkets(targetMarkets);
				// 如果有可以投注的market
				if (specifierList.length) {
					// favourite字段目前没有处理，因为数据问题，不知道这货是否准确
					this.specifiers = specifierList;
					this.specifierName = name;
					const index = markets.findIndex(cur => cur.favourite === 1);
					const { status } = markets[index] || {};
					if (index > -1 && (status === 0 || status === 1)) {
						this.currentMarket = markets[index];
						this.currentSpecifier = specifierList[index];
					} else {
						for (let i = 0; i < markets.length; i++) {
							if (markets[i].status === 0 || markets[i].status === 1) {
								this.currentMarket = markets[i];
								this.currentSpecifier = specifierList[i];
								break;
							}
						}
					}

					// next goal: 显示 specifier值最大的一个
					if (+this.marketId === 8) {
						const max = specifierList.sort((a, b) => a.name < b.name)[0];
						this.currentMarket = markets[max.index];
						this.currentSpecifier = max;
					}

					if (!this.currentMarket) {
						this.currentMarket = markets[0];
						this.currentSpecifier = specifierList[0];
					}
				} else {
					this.reset();
				}
			}
		}
	};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

// 注意这里用 m-event-market-default 作默认样式， m-market 可用于外部覆盖
.m-event-market-default {
	display: flex;
	table-layout: fixed;
	justify-content: space-around;
	align-items: center;
	align-content: center;
	width: 100%;

	.af-select {
		width: 100%;
		.af-select-title{
			border-radius: 4/@rem;
			height: 34/@rem;
			line-height: 34/@rem;
			border:0px;
			text-align: center;
			color: @darkGreen;
			background: @thinGreen;
			.af-select-icon-item{
				font-family: 'iconfont';
				padding-right: 6/@rem;
				&:before{
					display: inline-block;
					content: "\e603";
					font-size: 14/@rem;
				}
				.icon{
					display: none;
					font-size: 0px;
				}
			}
		}
	}
}
.m-event-specifiers{
	padding: 10/@rem 0;
	margin-left: -50/@rem;
	margin-top: 20/@rem;
	>span{
		height: 48/@rem;
		line-height: 48/@rem;
	}
	.af-select-item{
		font-size: 14px;
		font-weight: 700;
		padding-right:20/@rem;
		box-sizing: border-box;
		text-align: right;
		&.active{
			color: @green;
			background-color: @white;
		}
		&:active{
			background-color: @fogGray;
		}
	}
}
</style>
