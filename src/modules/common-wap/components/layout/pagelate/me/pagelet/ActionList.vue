<template>
	<ul class="m-action-list">
		<li class="m-action-item">
			<a :href="transactionLink">
				<i class="transaction"/>
				<div class="item-label">Transactions</div>
			</a>
		</li>

		<li class="m-action-item">
			<a :href="withdrawLink">
				<i class="withdraw"/>
				<div class="item-label">Withdraw</div>
			</a>
		</li>

		<li class="m-action-item">
			<a :href="depositLink">
				<i class="deposit"/>
				<div class="item-label">Deposit</div>
			</a>
		</li>
	</ul>
</template>

<script>
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';

export default {
	name: 'ActionList',
	computed: {
		transactionLink() {
			return this.addSource(userCenterUrl.transaction);
		},
		withdrawLink() {
			return this.addSource(userCenterUrl.withdraw);
		},
		depositLink() {
			return this.addSource(userCenterUrl.deposit);
		}
	},
	methods: {
		addSource(url) {
			return URL.addPara(url || pagePath.home, {
				source: 'me'
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-action-list {
	list-style: none;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12/@rem 0 16/@rem;

	.m-action-item {
		flex: 1;
		width: 33.33%;
		a {
			display: block;
			text-align: center;
			color: @dark;
		}
		i {
			display: block;
			&.withdraw{
				.m-icon-withdraw();
				&::before {
					font-size: 18/@rem;
				}
			}
			&.deposit{
				.m-icon-deposit();
				&::before {
					font-size: 18/@rem;
				}
			}
			&.transaction{
				.m-icon-transactions();
				&::before {
					font-size: 18/@rem;
				}
			}
		}
		.action-label {
			font-size: 12/@rem;
			line-height: 1;
			text-align: center;
			color: @dark;
		}
	}
}
</style>
