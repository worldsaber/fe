<template>
	<div class="me-wrap" v-if="isShowMe">
		<div class="overly" @click.stop="close" :style="overlyStyle"></div>
		<div class="me">
			<div class="close" @click.stop="close"></div>

			<!-- account info -->
			<Account></Account>

			<div class="m-me-pbox">
				<!-- sports bet history, jackpot bet history, ... -->
				<HistoryList></HistoryList>

				<!-- Transactions, Withdraw, Deposit, ... -->
				<ActionList></ActionList>

				<!-- balance, sportyCoins, gifts, message, ... -->
				<AssetsList></AssetsList>

				<!-- call, help, ... -->
				<HelpList></HelpList>
			</div>
		</div>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';

import Account from './pagelet/Account';
import HistoryList from './pagelet/HistoryList';
import ActionList from './pagelet/ActionList';
import AssetsList from './pagelet/AssetsList';
import HelpList from './pagelet/HelpList';

export default{
	props: {
		isShowMe: {
			type: Boolean,
			'default': false
		}
	},
	model: {
		prop: 'isShowMe',
		event: 'input'
	},
	components: {
		Account,
		HistoryList,
		ActionList,
		AssetsList,
		HelpList
	},
	data () {
		return {
			homeUrl: pagePath.home,
			overlyStyle: {}
		};
	},
	mounted () {
		this.main = document.querySelector('.m-main-mid');
	},
	watch: {
		// 每次显示动态计算overly蒙层的高度，因为这个是absolute的
		isShowMe (val) {
			if (val && this.main) {
				const scrollHeight = this.main.scrollHeight;
				this.$nextTick(() => {
					const current = this.$el;
					const off = current.offsetTop;
					this.overlyStyle = {
						height: (scrollHeight - off) + 'px'
					};
				});
			}
		}
	},
	methods: {
		close () {
			this.$emit('input', false);
		},
		goToUrl (url) {
			window.location.href = URL.addPara(url || this.homeUrl, {
				source: 'me'
			});
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
.me-wrap {
	.m-me-footer {
		.m-user-info {
			// 不走心的局部加载样式问题（loadingUserStatus相关）
			.loading {
				position: absolute !important;
				top: 50% !important;
				margin-top: -10/@rem;

				&:before {
					height: 20/@rem;
					width: 20/@rem;
					line-height: 1;
					font-size: 20/@rem;
				}
			}
		}
	}
}

</style>

<style lang="less" scoped>
	@import '~base/styles/variable.less';
	@import 'base/styles/icon.less';
	@import 'base/styles/mixin.less';
	.me-wrap{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		// 因为首屏宽度一定大于100%所以这里直接就大于一屏幕也没有关系
		height: 100%;
		background: transparent;
		z-index: 800;
		.overly{
			height: 100%;
			width: 100%;
			z-index: 1;
			background-color: @black;
			opacity: 0.6;
			top: 0px;
			left: 0px;
			position: absolute;
		}
		.me{
			position: relative;
			z-index: 11;
			background: @white;
			.close{
				text-align: center;
				margin-top: 15/@rem;
				.m-icon-close();
				font-size: 24/@rem;
				color: @fogGray;
				background-color: transparent;
				position: absolute;
				top: 100%;
				width: 40/@rem;
				height: 40/@rem;
				background-color: fade(@white,  10%);
				left: 50%;
				margin-left: -20/@rem;
				border-radius: 40/@rem;
			}

		}
	}
</style>

<style lang="less">
.me-wrap{
	.m-loading-wrap{
		min-height: auto;
		.m-loading .loading{
			left: 13%;
		}
	}

	a:hover, a:active, a:visited {
		text-decoration: none;
	}
}
</style>
