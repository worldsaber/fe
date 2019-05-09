<template lang="html">
	<ul class="m-user-center m-list">
		<li class="m-list-bar m-balance" v-if="hasBalance">
			<span>{{balance}}</span>
			<div class="m-icon-wrapper">
				<i :class="{'m-icon-hide': showBalance, 'm-icon-show': !showBalance}" @click="toggleShowBalance"></i>
				<i class="m-icon-refresh" @click="handleRefresh"></i>
			</div>
		</li>
		<li
			v-for="(item, index) in userCenterConfig" v-if="item"
			:class="[
				'm-list-item',
				'm-text-main',
				{
					'm-list-item--active': item === current,
					'first': index === 0,
					'last': index === userCenterConfig.length - 1
				}
			]"
			@click="handleClick(index, item)"
		>
			<em v-if="item === 'Gifts' && giftAmount > 0" class="m-gift-value">
				{{formatGiftAmount}}
			</em>
			<em v-else-if="item == 'Deposit' && !hasLogout">
				<i class="m-icon--loudspeaker"></i><span>Free</span>
			</em>
			{{item === 'Gifts' && giftNum === 1 ? 'Gift' : item}}
			<span v-if="item === 'Gifts' && giftNum > 0">
				({{giftNum}})
			</span>
		</li>
		<li class="m-list-bar" v-if="hasLogout" @click="logout">Log Out</li>
	</ul>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import { userCenter, userCenterUrl } from 'config/order/userCenterConfig';

import { getbalance, commitLogout } from 'core/js/loginBar';
import { EventBus } from 'kernel/js/eventBus.js';

import commonEvent from 'config/eventConfig/commonEvent';
import { getShowCurrency } from 'config/currencyConfig';

export default {
	props: {
		hasBalance: {
			type: Boolean,
			'default': false
		},
		balance: {
			type: String,
			'default': '- - -'
		},
		hasLogout: {
			type: Boolean,
			'default': false
		},
		currentTab: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			userCenterConfig: userCenter,
			userCenterUrlConfig: userCenterUrl,
			showBalance: false,
			currecy: getShowCurrency(),
			currentBalance: this.balance &&
				(this.balance.includes(this.currecy) ? this.balance : `${this.currecy}${this.balance}`)
		};
	},
	computed: {
		...mapState('userCenter', {
			current: 'currentTab',
			giftNum: 'giftNum',
			giftAmount: 'giftAmount',
			msgNum: 'msgNum'  // 此项暂时没有值，预留接口而已
		}),
		...mapGetters('userCenter', [
			'formatGiftAmount'
		]),
	},
	methods: {
		...mapActions('userCenter', [
			'fetchAcountInfo'
		]),
		...mapMutations('userCenter', {
			updateCurrentTab: mutationTypes.UPDATE_CURRENT_TAB,
			updateBalance: mutationTypes.UPDATE_BALANCE
		}),
		handleClick(index, item) {
			let url = this.userCenterUrlConfig[index] || '/';
			// this.current = item;
			/*
				bet history增加参数isSettled=10，表示默认跳转到订单all tab下面
				没有改配置文件是怕其他地方有调用，其他地方不需要参数
			*/
			if (index === 1) {
				url += (url.indexOf('?') === -1 ? '?' : '&') + 'isSettled=10';
			}
			// router变化或者页面跳转ßß
			window.location.href = url;
		},
		handleRefresh() {
			getbalance().then(function(showVal) {
				this.currentBalance = `${this.currecy}${showVal}`;
			});
		},
		toggleShowBalance() {
			this.showBalance = !this.showBalance;
		},
		logout() {
			commitLogout();
		}
	},
	created () {
		this.fetchAcountInfo();
	},
	mounted() {
		this.updateCurrentTab(this.currentTab);
		EventBus.$on(commonEvent.UPDATE_GIFTS, this.fetchAcountInfo);
		EventBus.$on(commonEvent.SYNC_ACCOUNT_BALANCE, this.updateBalance);
	}
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

.m-user-center {
	box-sizing: border-box;
	border: 1px solid @grayBorder;

	.m-list-item {
		padding: 10px 12px;
		box-sizing: border-box;
		position: relative;
		cursor: pointer;
		.m-icon-arrow--right();
		&:before {
			position: absolute;
			right: 8px;
			top:50%;
			font-size:10px;
			color:#c0c0c0;
			transform: translate(0, -50%);
		}
		em{
			float: right;
			margin-right: 10px;
		}
		.m-gift-value{
			width: 47%;
			text-align: right;
			.ellipsis();
		}
		.m-icon--loudspeaker{
			.m-icon-loudspeaker();
			vertical-align: middle;
			margin-right: 5px;
			&:before{
				font-size: 10px;
			}
			& + *{
				font-size: 10px;
				font-weight: bold;
			}
		}
	}

	.m-list-item--active {
		color: @white;
		background: @green;
		margin:0 -1px 0 -1px;
	}

	.m-text-main {
		.m-text-main();
		font-size:12px;
	}
}
</style>
