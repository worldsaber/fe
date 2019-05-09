<template>
  <div class="m-market" @click.stop="handlerStop">
	  <template v-if="currentMarket && currentMarket.outcomeOrder">
		 <!-- 有 specifiers就显示-->
		<div v-if="currentSpecifier && isShowSelectSpecifier" class="m-outcome specifiers-select">
			<AfSelect
				:readonly="true"
				:data='specifiers'
				:closeOnSelect="true"
				:isInsertScrollEle='true'
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
		<div v-if="currentMarketsOutComeSize && currentMarketsOutComeSize.length && isShowSelectSpecifier" class="m-outcome m-outcome--disabled  specifiers-select">
			<span class="m-icon-lock"></span>
		</div>
		<template v-if="currentMarketsOutComeSize">
			<div class="m-outcome--disabled m-outcome" v-for="one in getOutComeSize()" :key="one">
				<span class="m-icon-lock"></span>
			</div>
		</template>
	  </template>
 </div>

</template>

<script>
	import 'packages/select';
	import OutcomeCell from './outcomeCell.vue';
	import { marketsOutComeSize } from './marketConst';

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
						this.currentMarket = null;
						this.specifiers = null;
						this.specifierName = null;
						this.currentSpecifier = null;
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
						const s = [];
						let name;
						val.sort((a, b) => { // eslint-disable-line
							if (a.specifier && b.specifier) {
								let tmp = a.specifier.split('|');
								tmp = tmp[0];
								tmp = tmp.split('=');
								tmp = tmp[1];
								let tmp1 = b.specifier.split('|');
								tmp1 = tmp1[0];
								tmp1 = tmp1.split('=');
								tmp1 = tmp1[1];
								return tmp - tmp1;
							}
						});
						// 对market排序
						for (let i = 0; i < val.length; i++) {
							const market = val[i];
							// 锁哥specifier用|隔开，每个speifier是用=隔开
							let tmp = market.specifier.split('|');
							tmp = tmp[0];
							const ss = tmp.split('=');
							s.push({
								index: i,
								name: ss[1]
							});
							// 每个specifier都是类似  goals=1.5这种,所以多次赋值也可以
							name = ss[0];
						}
						// 如果有可以投注的market
						if (s.length) {
							// favourite字段目前没有处理，因为数据问题，不知道这货是否准确
							this.specifiers = s;
							this.specifierName = name;
							const index = this.markets.findIndex(cur => cur.favourite === 1);
							if (index > -1 && (this.markets[index].status === 0 || this.markets[index].status === 1)) {
								this.currentMarket = this.markets[index];
								this.currentSpecifier = s[index];
							} else {
								for (let i = 0; i < this.markets.length; i++) {
									if (this.markets[i].status === 0 || this.markets[i].status === 1) {
										this.currentMarket = this.markets[i];
										this.currentSpecifier = s[i];
										break;
									}
								}
							}
							if (!this.currentMarket) {
								this.currentMarket = this.markets[0];
								this.currentSpecifier = s[0];
							}
						} else {
							this.currentMarket = null;
							this.specifiers = null;
							this.specifierName = null;
							this.currentSpecifier = null;
						}
					}
				}
			},
			currentSpecifier (val) {
				if (val && this.markets) {
					this.currentMarket = this.markets[val.index];
				}
			},
		},
		computed: {
			currentMarketsOutComeSize () {
				return (this.marketsOutComeSize[this.sportId] || {})[this.marketId];
			},
			isShowSelectSpecifier () {
				return !this.isHideSelectSpecifiers;
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
			}
		}
	};
</script>
<style lang="less">
	@import '~base/style/variable.less';
	@import 'base/style/icon.less';
	.m-market {
		display: inline-table;
		display: inline-flex;
		table-layout: fixed;
		justify-content: space-around;
		align-items: center;
		align-content: center;
		width: 100%;
		&>div{
			&:first-child{
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
			}
			&:last-child{
				border-top-right-radius: 4px;
				border-bottom-right-radius: 4px;
				box-shadow: none;
			}
			box-shadow: -1px 0px 0px 0px rgba(255, 255, 255, 0.3) inset;
		}
		.m-outcome{
			flex:1;
			display: block;
			min-width: 1%;
			text-align: center;
			background-color: @green;
			color:@white;
			font-weight: 700;
			font-size: 12px;
			text-align: center;
			height: 36px;
			line-height: 36px;
			cursor: pointer;
			position: relative;
			&>span{
				display: block;
			}
			&.m-outcome--up{
				.m-icon-up2();
			}
			&.m-outcome--down{
				.m-icon-down2();
			}
			&.m-outcome--up,&.m-outcome--down{
				&:before{
					color: @white;
					display: block;
					position: absolute;
					top: 2px;
					right: 2px;
					line-height: 1;
					font-size: 12px;
					transform: scale(0.83);
				}
			}
			&.m-outcome--checked {
				background: @lightGreen;
				color: @blueBlack;
				&:before{
					color: @dark;
				}
			}
			&:hover{
				background: @midGreen;

				.af-select-title {
					background: @midGreen;
				}
			}
			&:active{
				background: @lightGreen;
			}
			&.m-outcome--disabled{
				background: @whiteGray;
				color: @darkGray;
				&:before{
					font-size: 0;
				}
				.m-icon-lock{
					.m-icon-locked();
					&:before{
						font-size: 16px;
						vertical-align: middle;
					}
				}
			}
			border: 0px;
			&:last-of-type{
				border: 0px;
			}
		}
		.af-select {
			width: 100%;
			.af-select-title{
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
				height: 34px;
				line-height: 34px;
				font-weight: 700;
				background: @green;
				// border:1px solid @green;
				border: none;
				color:@white;
				box-shadow: -1px 0px 0px 0px rgba(255, 255, 255, 0.3) inset;
				text-align: center;
				.af-select-icon-item{
					font-family: 'iconfont';
					padding-right: 6px;
					&:before{
						display: inline-block;
						content: "\e603";
						font-size: 12px;
					}
					.icon{
						display: none;
						font-size: 0px;
					}
				}
				&:hover{
					background: @midGreen;
				}
				&:active{
					background: @lightGreen;
				}
			}
		}
	}
</style>
