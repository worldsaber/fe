<template>
	<ListGroup class="m-me-assets-list" :list="list"></ListGroup>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { showCurrency } from 'config/currencyConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import loginMixin from 'base/js/loginMixin';
import ListGroup from 'components/ListGroup';

export default {
	name: 'AssetsList',
	mixins: [loginMixin],
	components: {
		ListGroup
	},
	computed: {
		...mapState('assetsInfo', ['giftNum', 'giftAmount', 'coin', 'balance']),
		...mapGetters('assetsInfo', ['formatGiftAmount', 'formatCoin', 'fomatBalance']),
		...mapState('message', ['messagesUnreadCount', 'systemMessagesUnreadCount']),
		list() {
			// 取值
			const defaultValue = '0.00';
			const balanceValue = this.balance > 0 ? this.fomatBalance : defaultValue;
			const sportyCoinsValue = this.coin > 0 ? this.formatCoin : defaultValue;
			const giftsValue = this.giftAmount > 0 ? this.formatGiftAmount : defaultValue;

			// 未读消息总数量大于0，显示 new
			const messageValue = (this.messagesUnreadCount > 0 || this.systemMessagesUnreadCount > 0) && 'NEW';

			return [{
				label: 'Balance',
				value: `${showCurrency} ${balanceValue}`,
				link: userCenterUrl.transaction
			}, {
				label: 'SportyCoins',
				value: `${showCurrency} ${sportyCoinsValue}`,
				link: userCenterUrl.sportycoin
			}, {
				label: `Gifts (${this.giftNum})`,
				value: `${showCurrency} ${giftsValue}`,
				link: userCenterUrl.gift
			}, {
				label: 'Message',
				value: messageValue,
				cls: 'm-tag-new',
				link: userCenterUrl.message
			}].map(x => {
				x.link = URL.addPara(x.link || this.homeUrl, {
					source: 'me'
				});
				return x;
			});
		}
	},
	methods: {
		...mapActions('me', ['fetchAccountBaseInfo']),
		...mapActions('message', ['getMessagesUnreadCount', 'getSystemMessagesUnreadCount']),
		// 获取用户未读消息数量
		async fetchtNoticeCount() {
			try {
				await Promise.all([
					this.getMessagesUnreadCount(),
					this.getSystemMessagesUnreadCount()
				]);
			} catch (err) {
				if (err.login === false) {
					return this.login();
				}
			}
		}
	},
	created() {
		this.fetchtNoticeCount();
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-me-assets-list {
	padding: 0 16/@rem;
	border-bottom: 6px solid @fogGray;

	.m-list-group-item {
		&:first-child {
			border-top: 1px solid @fogGray;
		}

		&:last-child {
			border-bottom: 0;
		}

		a {
			height: 48/@rem;
			line-height: 48/@rem;
			padding: 0;
			padding-right: 22/@rem;

			.m-label {
				font-size: 14/@rem;
				font-weight: 500;
			}

			.m-value {
				font-size: 14/@rem;
			}
		}
	}

	.m-tag-new {
		a {
			.m-value {
				width: 37/@rem;
				height: 18/@rem;
				line-height: 18/@rem;
				text-align: center;
				border-radius: 9/@rem;
				background: @red;
				color: @white;
				font-size: 12/@rem;
				font-weight: bold;
			}
		}
	}
}
</style>
