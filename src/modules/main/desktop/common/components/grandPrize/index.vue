<template lang="html">
	<div class="m-gd-wrapper">
		<h5 class="m-gd-title">Grand Prize Winners<i class="m-gd-bg"></i></h5>
		<section class="m-gd-con">
			<Broadcast :config="bdConfig">
				<div slot="bdcastList">
					<div
						v-for="item in grandList"
						class="m-gd-item"
						:key="item.id"
						>
						<div class="i-title">
							<span class="t-left t-light">{{showCurrency}}{{item.showWinning || ''}}</span>
							<span class="t-right">{{item.showTime}}</span>
						</div>
						<div class="i-main">
							<span class="t-left">{{item.showType}}</span>
							<span class="t-right">{{item.phone}}</span>
						</div>
					</div>
				</div>
			</Broadcast>
		</section>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getShowCurrency } from 'config/currencyConfig';
import 'components/broadcast';

export default {
	name: 'GrandPrize',
	data() {
		return {
			bdConfig: {
				direction: 'vertical'
			},
			showCurrency: getShowCurrency()
		};
	},
	computed: {
		...mapGetters('home', [
			'grandList'
		])
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

.m-gd-wrapper {
	.m-gd-title {
		height: 50px;
		background: @dark;
		font-size: 14px;
		line-height: 50px;
		position: relative;
		color: @white;
		overflow: hidden;
		padding-left: 40px;
    	box-sizing: border-box;
		z-index: 2;
	}

	.m-gd-bg {
		.m-icon-jackpot();
		position: absolute;
		top: 0;
		right: 0;
		width: 64px;
		height: 50px;
		transform: rotate(18deg) translate3d(10px, 5px, 0) scale(1.2);
		background: fadeout(@dark, 45%);
		&::before {
			font-size: 52px;
			color: fadeout(@white, 88%);
		}
	}

	.m-gd-con {
		max-height: 415px;
		overflow: hidden;
		padding: 0 6px 0;
		box-sizing: border-box;
		background: @dark;
		border-bottom: 6px solid @dark;
	}

	.m-gd-item {
		background: @white;
		padding: 0 10px;
		margin-bottom: 6px;
		border-radius: 2px;
		font-size: 12px;
		line-height: 15px;
		color: @darkGray;

		.i-main,
		.i-title {
			overflow: hidden;
		}
		.i-title {
			padding: 8px 0;
			box-sizing: border-box;

			.t-right {
				line-height: 19px;
			}
		}

		.i-main {
			padding: 4px 0 10px;
			box-sizing: border-box;
		}

		.t-right {
			float: right;
			max-width: ~'calc(100% - 80px)';
		}

		.t-light {
			color: @green;
			font-size: 16px;
			line-height: 19px;
		}
	}
}
</style>
