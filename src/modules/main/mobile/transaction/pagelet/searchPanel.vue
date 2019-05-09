<template>
	<div class="m-transaction-search">
		<form class="m-search-header">
			<i class="icon-back" @click="goBack"/>
			<af-input class="search-input" placeholder="Ticket ID/Trade No." icon="delete" :iconClick="iconCLick" :maxlength="27" v-model="keyword"/>
			<button class="search-action" @click.prevent="clickSearch">Search</button>
			<transition name="fade">
				<div class="error-wrap" v-if="showErr">
					<div class="error-msg">Please enter a Ticket ID or Trade Number</div>
				</div>
			</transition>
		</form>
		<ul class="search-list" v-if="list.length > 0">
			<li class="search-item" :key="index" @click="showDetail(item)" v-for="(item, index) in list">
				<div class="m-trans-r1">
					<em>{{item.type}}</em>
					<i>{{['','+','-'][item.amountSign]}} {{item.amountStr}}</i>
				</div>
				<div class="m-trans-r2">
					<em>{{item.showDate}} {{item.showTime}}</em>
					<i :class="{'m-txt-red':item.status === 10}" v-if="item.status != 20">{{item.statusStr}}</i>
				</div>
			</li>
		</ul>
		<template v-else-if="showTip">
			<p class="m-search-tip">Enter the Ticket ID or Transaction Number to search for transaction history</p>
			<img class="tip-screen" src="../image/search-tip.jpg">
		</template>
		<template v-else-if="!isHistory">
			<p class="no-item-tip">No results at this time</p>
			<div class="search-history-wrap"><span class="history-btn" @click="searchHistory">Search Older Histories</span></div>
		</template>
		<template v-else>
			<i class="icon-tip"/>
			<p class="no-item-tip--history">No results at this time</p>
		</template>
		<betLoading v-if="showLoading"/>
	</div>
</template>

<script>
import { AfInput } from 'components/input';
import betLoading from 'components/betLoading';
import { getTypeWithSub } from 'transaction/tool';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import { statusMap } from '../config';

export default {
	// props: {
	// 	isHistory: {
	// 		type: Boolean,
	// 		'default': false
	// 	}
	// },
	components: {
		AfInput,
		betLoading
	},
	data() {
		return {
			showTip: true,
			isHistory: false,
			keyword: '',
			list: [],
			showLoading: false,
			showErr: false
		};
	},
	watch: {
		keyword(val) {
			this.showErr = false;
			this.keyword = val.replace(/[^0-9a-zA-Z]/g, '');
		}
	},
	created() {
		const query = this.$router.currentRoute.query;
		if (query.keyword) {
			this.keyword = decodeURIComponent(query.keyword);
			this.search();
		}
	},
	methods: {
		iconCLick() {
			this.keyword = '';
		},
		clickSearch() {
			if (this.keyword === '') {
				this.showErr = true;
				return;
			}
			this.isHistory = false;
			this.search();
		},
		search() {
			this.showLoading = true;
			fetch(`/pocket/v1/statements/query?key=${encodeURIComponent(this.keyword)}&isHistory=${this.isHistory ? 1 : 0}`).then(res => res.json()).then(res => {
				this.showLoading = false;
				this.list = this.format(res.data.statements);
				this.showTip = false;
			}).catch(e => {
				this.showLoading = false;
				console.log(e);
			});
		},
		format(list = []) {
			for (let i = 0; i < list.length; i++) {
				const createTime = list[i].createTime;
				list[i].showDate = dateFormat.format(createTime, 'DD/MM');
				list[i].showTime = dateFormat.format(createTime, 'HH:mm:ss');

				list[i].type = getTypeWithSub(list[i]);
				// 如果是取现则显示 总金额 - 手续费
				if (list[i].tradeCode === 'WD0001' || list[i].tradeCode === 'WD0004') {
					list[i].amountStr = formatNumber((list[i].amount - list[i].feeAmount) / 10000, 2) || '';
					list[i].feeStr = formatNumber(list[i].feeAmount / 10000, 2);
				} else {
					list[i].amountStr = formatNumber(list[i].amount / 10000, 2) || '';
				}
				list[i].statusStr = statusMap[list[i].status] || '';
				list[i].afterBalStr = '- - -';
				// 线下派奖balance显示 - - -
				if (list[i].tradeCode === 'CB0003') {
					list[i].afterBalStr = '- - -';
				} else if (list[i].status !== 10 && list[i].afterBal !== undefined) {
					list[i].afterBalStr = formatNumber(list[i].afterBal / 10000, 2);
				}
			}
			return list;
		},
		showDetail(obj) {
			this.$emit('changeDetailObj', obj, this.isHistory);
		},
		searchHistory() {
			if (this.keyword === '') {
				this.showErr = true;
				return;
			}
			this.isHistory = true;
			this.search();
		},
		goBack() {
			history.go(-1);
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/mixin.less';

.m-transaction-search {
	position: fixed;
	top:0;
	left: 0;
	width: 100%;
	height: 100%;
	background: @white;
	z-index: 13;
	overflow: auto;
	
	.m-search-header {
		position: relative;
		height: 32/@rem;
		padding: 12/@rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: @red;
		.icon-back {
			.m-icon-wap-back();
			flex: 0 0 auto;
			margin: 0 12/@rem;
			&::before {
				font-size: 16/@rem;
				color: @white;
			}
		}
		.search-input {
			flex: 1 1 auto;
			height: 32/@rem;
			.m-input-wap-icon {
				height: 32/@rem;
			}
			.m-input-wap {
				height: 32/@rem;
			}
		}
		.search-action {
			flex: 0 0 auto;
			border: none;
			background: transparent;
			margin: 0 12/@rem;
			color: @white;
			font-size: 14/@rem;
			line-height: 16/@rem;
		}
		.error-wrap {
			position: absolute;
			top: 60/@rem;
			left: 0;
			width: 100%;
			color: @red;
			font-size: 12/@rem;
			line-height: 14/@rem;
			.error-msg {
				margin: 0 6/@rem;
				text-align: center;
				padding: 6/@rem 0;
				background: @midGray;
			}
		}
		.fade-enter-active, .fade-leave-active {
			transition: opacity .5s;
		}
		.fade-enter, .fade-leave-to {
			opacity: 0;
		}
	}
	
	.search-list {
		list-style: none;
		.search-item {
			.clearfix();
			margin: 0 16/@rem;
		    padding: 11/@rem 0;
		    border-bottom:1px solid @fogGray;
		    em{
		      float: left;
		      width:55%;
		    }
		    i{
		      float:right;
		      text-align: right;
		      width: 45%;
		    }
			.m-trans-r1{
		  	.clearfix();
		  	line-height: 1;
		  	padding-bottom: 4/@rem;
		  	padding-top: 1/@rem;
		      font-size: 16/@rem;
		      font-weight: 500;
		      i{
		        position: relative;
		        top: 3/@rem;
		        font-weight: bold;
		      }
		    }
		    .m-trans-r2{
		  	.clearfix();
		  	line-height: 1;
		  	padding-bottom: 1/@rem;
		      color:@darkGray;
		      font-size:12/@rem;
		    }
		}
	}
	
	.m-search-tip {
		padding: 0 40/@rem;
		margin-top: 32/@rem;
		margin-bottom: 16/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
		color: @dark;
		text-align: center;
	}
	.tip-screen {
		display: block;
		width: 180/@rem;
		margin-left: auto;
		margin-right: auto;
	}
	.icon-tip {
		margin-top: 56/@rem;
		width: 36/@rem;
		height: 36/@rem;
		line-height: 36/@rem;
		display: block;
		margin-left: auto;
		margin-right: auto;
		.m-icon-exclamation();
		&::before {
			color: @midGray;
			font-size: 36/@rem;
		}
	}
	.no-item-tip--history {
		margin-top: 16/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
		text-align: center;
		color: @darkGray;
	}
	.no-item-tip {
		margin-top: 56/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
		text-align: center;
		color: @darkGray;
	}
	.search-history-wrap {
		margin-top: 16/@rem;
		text-align: center;
		.history-btn {
			padding: 6/@rem 12/@rem;
			background: @green;
			color: @white;
			font-size: 12/@rem;
			line-height: 14/@rem;
		}
	}
}
</style>
